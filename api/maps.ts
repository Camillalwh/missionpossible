import type { IncomingMessage, ServerResponse } from 'node:http';

const ONEMAP_AUTH_URL = 'https://www.onemap.gov.sg/api/auth/post/getToken';
const ONEMAP_ROUTE_URL = 'https://www.onemap.gov.sg/api/public/routingsvc/route';

const VALID_ROUTE_TYPES = new Set(['walk', 'drive', 'cycle', 'pt'] as const);
type RouteType = 'walk' | 'drive' | 'cycle' | 'pt';

const COORD_PATTERN = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const DEFAULT_TOKEN_TTL_MS = 3 * 24 * 60 * 60 * 1000;

interface CachedToken {
  accessToken: string;
  expiresAtMs: number;
}

interface OneMapTokenResponse {
  access_token?: string;
  expiry_timestamp?: string | number;
  error?: string;
}

export interface ServerlessRequest extends IncomingMessage {
  query?: Record<string, unknown>;
  body?: unknown;
}

export interface ServerlessResponse extends ServerResponse {}

let cachedToken: CachedToken | null = null;
let inflightTokenPromise: Promise<string> | null = null;

function sendJson(res: ServerlessResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getQueryParam(
  req: ServerlessRequest,
  urlParams: URLSearchParams,
  key: string
): string | undefined {
  const fromQuery = req.query?.[key];
  if (typeof fromQuery === 'string' && fromQuery.trim() !== '') {
    return fromQuery.trim();
  }
  if (Array.isArray(fromQuery) && typeof fromQuery[0] === 'string') {
    return fromQuery[0].trim();
  }
  const fromUrl = urlParams.get(key);
  if (fromUrl && fromUrl.trim() !== '') {
    return fromUrl.trim();
  }
  if (req.body && typeof req.body === 'object' && key in req.body) {
    const val = (req.body as Record<string, unknown>)[key];
    if (typeof val === 'string' && val.trim() !== '') {
      return val.trim();
    }
  }
  return undefined;
}

function getSingaporeDateTimeDefaults(): { date: string; time: string } {
  const now = new Date();
  const sgtParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    sgtParts.find((p) => p.type === type)?.value ?? '00';

  return {
    date: `${part('month')}-${part('day')}-${part('year')}`,
    time: `${part('hour')}:${part('minute')}:${part('second')}`,
  };
}

async function fetchOneMapToken(forceRefresh = false): Promise<string> {
  const staticToken = process.env.ONEMAP_API_TOKEN?.trim();
  if (staticToken && !forceRefresh) {
    return staticToken;
  }

  if (!forceRefresh && cachedToken && Date.now() < cachedToken.expiresAtMs - TOKEN_REFRESH_BUFFER_MS) {
    return cachedToken.accessToken;
  }

  if (inflightTokenPromise) {
    return inflightTokenPromise;
  }

  const email = process.env.ONEMAP_EMAIL?.trim();
  const password = process.env.ONEMAP_PASSWORD;

  if (!email || !password) {
    if (staticToken) {
      return staticToken;
    }
    throw new Error(
      'OneMap credentials are not configured. Set ONEMAP_EMAIL and ONEMAP_PASSWORD in environment variables.'
    );
  }

  inflightTokenPromise = (async () => {
    const response = await fetch(ONEMAP_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json().catch(() => ({}))) as OneMapTokenResponse;

    if (!response.ok || !data.access_token) {
      throw new Error(
        data.error || `Failed to obtain OneMap token (HTTP ${response.status}).`
      );
    }

    const expiryEpochSec = Number(data.expiry_timestamp);
    const expiresAtMs =
      Number.isFinite(expiryEpochSec) && expiryEpochSec > 0
        ? expiryEpochSec * 1000
        : Date.now() + DEFAULT_TOKEN_TTL_MS;

    cachedToken = {
      accessToken: data.access_token,
      expiresAtMs,
    };

    return data.access_token;
  })();

  try {
    return await inflightTokenPromise;
  } finally {
    inflightTokenPromise = null;
  }
}

async function requestOneMapRoute(
  routeUrl: string,
  accessToken: string
): Promise<globalThis.Response> {
  return fetch(routeUrl, {
    method: 'GET',
    headers: {
      Authorization: accessToken,
    },
  });
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method && req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    sendJson(res, 405, { error: 'Method not allowed. Use GET or POST.' });
    return;
  }

  const parsedUrl = new URL(req.url ?? '/api/maps', 'http://localhost');
  const urlParams = parsedUrl.searchParams;

  const start = getQueryParam(req, urlParams, 'start');
  const end = getQueryParam(req, urlParams, 'end');
  const rawRouteType = (getQueryParam(req, urlParams, 'routeType') ?? 'walk').toLowerCase();

  if (!start || !end) {
    sendJson(res, 400, {
      error: 'Missing required coordinates: start and end query parameters are required.',
      example: '/api/maps?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk',
    });
    return;
  }

  if (!COORD_PATTERN.test(start) || !COORD_PATTERN.test(end)) {
    sendJson(res, 400, {
      error: 'Invalid coordinate format. Expected "lat,lng" for both start and end.',
    });
    return;
  }

  if (!VALID_ROUTE_TYPES.has(rawRouteType as RouteType)) {
    sendJson(res, 400, {
      error: 'Invalid routeType. Allowed values: walk, drive, cycle, pt.',
    });
    return;
  }

  const routeType = rawRouteType as RouteType;
  const upstreamParams = new URLSearchParams({
    start,
    end,
    routeType,
  });

  if (routeType === 'pt') {
    const defaults = getSingaporeDateTimeDefaults();
    upstreamParams.set('date', getQueryParam(req, urlParams, 'date') ?? defaults.date);
    upstreamParams.set('time', getQueryParam(req, urlParams, 'time') ?? defaults.time);
    upstreamParams.set('mode', getQueryParam(req, urlParams, 'mode') ?? 'TRANSIT');

    const maxWalkDistance = getQueryParam(req, urlParams, 'maxWalkDistance');
    if (maxWalkDistance) upstreamParams.set('maxWalkDistance', maxWalkDistance);

    const numItineraries = getQueryParam(req, urlParams, 'numItineraries');
    if (numItineraries) upstreamParams.set('numItineraries', numItineraries);
  }

  const routeUrl = `${ONEMAP_ROUTE_URL}?${upstreamParams.toString()}`;

  try {
    let token = await fetchOneMapToken(false);
    let upstreamResponse = await requestOneMapRoute(routeUrl, token);

    if (upstreamResponse.status === 401) {
      cachedToken = null;
      token = await fetchOneMapToken(true);
      upstreamResponse = await requestOneMapRoute(routeUrl, token);
    }

    const bodyText = await upstreamResponse.text();
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(bodyText);
    } catch {
      parsedBody = { raw: bodyText };
    }

    if (!upstreamResponse.ok) {
      sendJson(res, upstreamResponse.status, {
        error: 'OneMap routing request failed.',
        upstreamStatus: upstreamResponse.status,
        details: parsedBody,
      });
      return;
    }

    res.setHeader('Cache-Control', 'no-store');
    sendJson(res, 200, {
      provider: 'OneMap',
      routeType,
      start,
      end,
      data: parsedBody,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected OneMap proxy error.';
    const isConfigError = message.includes('credentials are not configured');
    sendJson(res, isConfigError ? 503 : 502, { error: message });
  }
}

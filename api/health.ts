import type { IncomingMessage, ServerResponse } from 'node:http';

export interface ServerlessRequest extends IncomingMessage {
  query?: Record<string, unknown>;
  body?: unknown;
}

export interface ServerlessResponse extends ServerResponse {}

function sendJson(res: ServerlessResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    sendJson(res, 405, { error: 'Method not allowed. Use GET.' });
    return;
  }

  const hasCredentials = Boolean(
    (process.env.ONEMAP_EMAIL && process.env.ONEMAP_PASSWORD) ||
      process.env.ONEMAP_API_TOKEN
  );

  sendJson(res, 200, {
    ok: true,
    service: 'impactconnect-api',
    timestamp: new Date().toISOString(),
    onemapConfigured: hasCredentials,
  });
}

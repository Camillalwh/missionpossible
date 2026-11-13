import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  HandHeart,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  ANNUAL_MATCH_LIMIT,
  INITIAL_CAMPAIGNS,
  INITIAL_RECEIPTS,
  INITIAL_SHIFTS,
} from './data/mockData';
import {
  Campaign,
  CauseCategory,
  DonationReceipt,
  NavScreen,
  ViewMode,
  VolunteerShift,
} from './types';
import { CampaignArtwork } from './components/CampaignArtwork';
import { DualTrackProgress } from './components/DualTrackProgress';
import { DonationSheet } from './components/DonationSheet';
import { ReceiptModal } from './components/ReceiptModal';
import { CampaignDetailView } from './components/CampaignDetailView';
import { ImpactScreen } from './components/ImpactScreen';
import { CsrHubScreen } from './components/CsrHubScreen';

const CATEGORIES: CauseCategory[] = [
  'All Causes',
  'Crisis Relief',
  'Clean Water',
  'Education',
  'Local Food',
  'Climate',
];

const STORAGE_KEY = 'impactconnect_state_v1';

interface PersistedState {
  campaigns: Campaign[];
  shifts: VolunteerShift[];
  receipts: DonationReceipt[];
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (
        Array.isArray(parsed.campaigns) &&
        Array.isArray(parsed.shifts) &&
        Array.isArray(parsed.receipts)
      ) {
        return {
          campaigns: parsed.campaigns,
          shifts: parsed.shifts,
          receipts: parsed.receipts,
        };
      }
    }
  } catch {
    // Fallback to seeded initial data
  }
  return {
    campaigns: INITIAL_CAMPAIGNS,
    shifts: INITIAL_SHIFTS,
    receipts: INITIAL_RECEIPTS,
  };
}

export default function App() {
  const initial = useMemo(() => loadInitialState(), []);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initial.campaigns);
  const [shifts, setShifts] = useState<VolunteerShift[]>(initial.shifts);
  const [receipts, setReceipts] = useState<DonationReceipt[]>(initial.receipts);

  const [activeScreen, setActiveScreen] = useState<NavScreen>('discover');
  const [viewMode, setViewMode] = useState<ViewMode>('donor');
  const [selectedCategory, setSelectedCategory] = useState<CauseCategory>('All Causes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [donatingCampaign, setDonatingCampaign] = useState<Campaign | null>(null);
  const [inspectingReceipt, setInspectingReceipt] = useState<DonationReceipt | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ campaigns, shifts, receipts })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [campaigns, shifts, receipts]);

  const usedAnnualMatch = useMemo(
    () => receipts.reduce((sum, rec) => sum + rec.matchedAmount, 0),
    [receipts]
  );

  const remainingAnnualMatch = Math.max(0, ANNUAL_MATCH_LIMIT - usedAnnualMatch);

  const featuredCampaign = useMemo(
    () => campaigns.find((c) => c.urgent) ?? campaigns[0],
    [campaigns]
  );

  const activeDetailCampaign = useMemo(
    () => campaigns.find((c) => c.id === selectedCampaignId) ?? null,
    [campaigns, selectedCampaignId]
  );

  const filteredCampaigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return campaigns.filter((c) => {
      const matchesCat =
        selectedCategory === 'All Causes' || c.category === selectedCategory;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [campaigns, selectedCategory, searchQuery]);

  const filteredShifts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return shifts.filter((s) => {
      const matchesCat =
        selectedCategory === 'All Causes' || s.category === selectedCategory;
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [shifts, selectedCategory, searchQuery]);

  const platformMetrics = useMemo(() => {
    const totalRaised = campaigns.reduce((s, c) => s + c.raisedAmount, 0);
    const totalMatched = campaigns.reduce((s, c) => s + c.matchedAmount, 0);
    const totalDonors = campaigns.reduce((s, c) => s + c.donorCount, 0);
    return { totalRaised, totalMatched, totalDonors };
  }, [campaigns]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const handleConfirmDonation = ({
    campaignId,
    amount,
    matchedAmount,
    donorName,
    note,
  }: {
    campaignId: string;
    amount: number;
    applyMatch: boolean;
    matchedAmount: number;
    donorName: string;
    note?: string;
  }): DonationReceipt => {
    const target = campaigns.find((c) => c.id === campaignId) ?? campaigns[0];
    const receiptCode = `IC-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    const todayLabel = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());

    const newReceipt: DonationReceipt = {
      id: `rec-${Date.now()}`,
      receiptCode,
      date: todayLabel,
      campaignId: target.id,
      campaignTitle: target.title,
      organization: target.organization,
      ein: target.ein,
      category: target.category,
      amount,
      matchedAmount,
      matchSponsor: target.matchSponsor,
      status: 'Verified',
      taxDeductible: true,
    };

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        return {
          ...c,
          raisedAmount: c.raisedAmount + amount,
          matchedAmount: c.matchedAmount + matchedAmount,
          matchPoolRemaining: Math.max(0, c.matchPoolRemaining - matchedAmount),
          donorCount: c.donorCount + 1,
          recentContributors: [
            {
              id: `contrib-${Date.now()}`,
              name: donorName,
              amount,
              matchedAmount,
              timestamp: 'Just now',
              note,
            },
            ...c.recentContributors,
          ],
        };
      })
    );

    setReceipts((prev) => [newReceipt, ...prev]);
    return newReceipt;
  };

  const handleToggleShiftRegistration = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;
        const nextReg = !s.registered;
        return {
          ...s,
          registered: nextReg,
          checkedIn: nextReg ? s.checkedIn : false,
          spotsFilled: nextReg
            ? Math.min(s.spotsTotal, s.spotsFilled + 1)
            : Math.max(0, s.spotsFilled - 1),
        };
      })
    );
  };

  const handleCheckInShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, checkedIn: true } : s))
    );
  };

  const handleSubmitExternalMatch = (payload: {
    organization: string;
    ein: string;
    category: Exclude<CauseCategory, 'All Causes'>;
    amount: number;
  }) => {
    const todayLabel = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date());

    const newReceipt: DonationReceipt = {
      id: `rec-ext-${Date.now()}`,
      receiptCode: `EXT-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      date: todayLabel,
      campaignId: 'external',
      campaignTitle: `External 501(c)(3) Match — ${payload.organization}`,
      organization: payload.organization,
      ein: payload.ein,
      category: payload.category,
      amount: payload.amount,
      matchedAmount: payload.amount,
      matchSponsor: 'Horizon Technologies CSR',
      status: 'Match Pending',
      taxDeductible: true,
    };

    setReceipts((prev) => [newReceipt, ...prev]);
  };

  const navigateTo = (screen: NavScreen, mode?: ViewMode) => {
    setSelectedCampaignId(null);
    setActiveScreen(screen);
    if (mode) setViewMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: 3 clean zones separated by gap-8 */}
      <header className="sticky top-0 z-30 h-12 sm:h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => navigateTo('discover')}
            className="font-display text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 text-left"
          >
            ImpactConnect
          </button>

          <nav
            className="hidden sm:flex items-center gap-7 text-sm font-medium"
            aria-label="Primary navigation"
          >
            <button
              type="button"
              onClick={() => navigateTo('discover')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeScreen === 'discover'
                  ? 'border-[#0D9488] text-[#0F172A] font-semibold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => navigateTo('impact')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeScreen === 'impact'
                  ? 'border-[#0D9488] text-[#0F172A] font-semibold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              My Impact
            </button>
            <button
              type="button"
              onClick={() => navigateTo('csr')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeScreen === 'csr'
                  ? 'border-[#0D9488] text-[#0F172A] font-semibold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              CSR Hub
            </button>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setDonatingCampaign(activeDetailCampaign ?? featuredCampaign)}
              className="min-h-[36px] sm:min-h-[40px] px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Donate Now
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {activeScreen === 'discover' && activeDetailCampaign ? (
          <CampaignDetailView
            campaign={activeDetailCampaign}
            onBack={() => setSelectedCampaignId(null)}
            onDonateClick={(camp) => setDonatingCampaign(camp)}
          />
        ) : activeScreen === 'discover' ? (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 pb-24 sm:pb-14 space-y-8">
            {/* Hero Spotlight: Balanced 2-Column Split */}
            <section
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden"
              aria-label="Featured urgent relief initiative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-semibold">
                      <span className="text-[#E11D48]">Urgent Crisis Response</span>
                      <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                      <span className="text-[#1D4ED8]">
                        {featuredCampaign.matchMultiplier}x Match by {featuredCampaign.matchSponsor}
                      </span>
                      <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                      <span className="text-[#64748B] tabular-nums">
                        {featuredCampaign.daysLeft} days left
                      </span>
                    </div>

                    <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight text-balance">
                      {featuredCampaign.title}
                    </h1>

                    <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed max-w-2xl">
                      {featuredCampaign.summary}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <DualTrackProgress
                      raisedAmount={featuredCampaign.raisedAmount}
                      matchedAmount={featuredCampaign.matchedAmount}
                      goalAmount={featuredCampaign.goalAmount}
                    />

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setDonatingCampaign(featuredCampaign)}
                        className="min-h-[48px] px-6 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.99] text-white text-sm font-semibold transition-all whitespace-nowrap shrink-0"
                      >
                        Give with {featuredCampaign.matchMultiplier}x Match
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCampaignId(featuredCampaign.id)}
                        className="min-h-[48px] px-5 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-sm font-semibold text-[#0F172A] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <span>Inspect Allocation</span>
                        <ArrowUpRight className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] flex flex-col">
                  <CampaignArtwork
                    category={featuredCampaign.category}
                    urgent={featuredCampaign.urgent}
                    className="flex-1 min-h-[190px] lg:h-full"
                  />
                  <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-4 text-xs">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-[#1D4ED8]">
                      <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Verified 501(c)(3) · EIN {featuredCampaign.ein}</span>
                    </div>
                    <span className="text-[#64748B] tabular-nums whitespace-nowrap">
                      {featuredCampaign.donorCount} donors
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Full-Width 4-Column KPI Strip */}
            <section
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              aria-label="Platform stewardship totals"
            >
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5">
                <p className="text-xs font-medium text-[#64748B]">Direct Community Gifts</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#0F172A] tabular-nums mt-1">
                  {formatMoney(platformMetrics.totalRaised)}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5">
                <p className="text-xs font-medium text-[#64748B]">Corporate CSR Matched</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#1D4ED8] tabular-nums mt-1">
                  {formatMoney(platformMetrics.totalMatched)}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5">
                <p className="text-xs font-medium text-[#64748B]">Active Supporters</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#0F172A] tabular-nums mt-1">
                  {platformMetrics.totalDonors.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5">
                <p className="text-xs font-medium text-[#64748B]">Your Match Allowance Left</p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#0D9488] tabular-nums mt-1">
                  {formatMoney(remainingAnnualMatch)}
                </p>
              </div>
            </section>

            {/* Workspace Controls: Role Switcher + Search + Category Filter */}
            <section className="space-y-4" aria-label="Explore causes and volunteer shifts">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div
                  className="inline-flex p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] self-start"
                  role="tablist"
                  aria-label="View mode"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'donor'}
                    onClick={() => setViewMode('donor')}
                    className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
                      viewMode === 'donor'
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 text-[#0D9488]" aria-hidden="true" />
                    <span>Donor View</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'volunteer'}
                    onClick={() => setViewMode('volunteer')}
                    className={`min-h-[40px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
                      viewMode === 'volunteer'
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Users className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                    <span>Volunteer View</span>
                  </button>
                </div>

                <div className="relative w-full md:w-80">
                  <Search
                    className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      viewMode === 'donor'
                        ? 'Search campaigns, nonprofits, locations...'
                        : 'Search shifts, skills, locations...'
                    }
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8]"
                    aria-label="Search initiatives"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#0F172A] border-[#0F172A] text-white'
                          : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {viewMode === 'donor' ? (
                filteredCampaigns.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
                    <p className="font-display text-lg font-semibold text-[#0F172A]">
                      No campaigns match your filters
                    </p>
                    <p className="text-sm text-[#64748B]">
                      Reset category filters or search terms to view all verified 501(c)(3) projects.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('All Causes');
                        setSearchQuery('');
                      }}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((camp) => (
                      <article
                        key={camp.id}
                        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)] transition-shadow flex flex-col overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCampaignId(camp.id)}
                          className="text-left focus:outline-none group"
                        >
                          <CampaignArtwork
                            category={camp.category}
                            urgent={camp.urgent}
                            className="h-40 w-full border-b border-[#E2E8F0]"
                          />
                        </button>

                        <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-[#64748B] font-medium truncate">
                                {camp.category} · {camp.daysLeft}d left
                              </span>
                              <span className="font-semibold text-[#1D4ED8] whitespace-nowrap shrink-0">
                                {camp.matchMultiplier}x Match
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedCampaignId(camp.id)}
                              className="text-left block group"
                            >
                              <h2 className="font-display text-lg font-semibold text-[#0F172A] group-hover:text-[#0D9488] transition-colors leading-snug">
                                {camp.title}
                              </h2>
                            </button>

                            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                              <span className="truncate font-medium text-[#334155]">
                                {camp.organization}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <DualTrackProgress
                              raisedAmount={camp.raisedAmount}
                              matchedAmount={camp.matchedAmount}
                              goalAmount={camp.goalAmount}
                              compact
                            />

                            <p className="text-xs text-[#64748B] leading-relaxed">
                              <span className="font-semibold text-[#0F172A] tabular-nums">
                                ${camp.unitCost}
                              </span>{' '}
                              {camp.impactUnitLabel}.
                            </p>

                            <div className="flex items-center gap-2.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setDonatingCampaign(camp)}
                                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold transition-colors"
                              >
                                Quick Give
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedCampaignId(camp.id)}
                                className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              ) : filteredShifts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
                  <p className="font-display text-lg font-semibold text-[#0F172A]">
                    No volunteer shifts match your filters
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All Causes');
                      setSearchQuery('');
                    }}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold transition-colors"
                  >
                    Show All Shifts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredShifts.map((shift) => {
                    const spotsOpen = Math.max(0, shift.spotsTotal - shift.spotsFilled);
                    return (
                      <article
                        key={shift.id}
                        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] flex flex-col justify-between gap-5"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-[#64748B]">
                              {shift.category} ·{' '}
                              <span className={shift.urgent ? 'text-[#E11D48] font-semibold' : ''}>
                                {shift.urgent ? 'Immediate Dispatch' : `${shift.durationHours} hr shift`}
                              </span>
                            </span>
                            <span className="font-semibold text-[#0D9488] tabular-nums">
                              {spotsOpen} spot{spotsOpen === 1 ? '' : 's'} left
                            </span>
                          </div>

                          <div>
                            <h2 className="font-display text-lg font-semibold text-[#0F172A] leading-snug">
                              {shift.title}
                            </h2>
                            <p className="text-xs font-medium text-[#334155] mt-1">
                              {shift.organization} · Coordinator: {shift.coordinatorName}
                            </p>
                          </div>

                          <div className="space-y-1.5 text-xs text-[#334155] pt-1">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#64748B] shrink-0" aria-hidden="true" />
                              <span>
                                {shift.dateLabel} · {shift.timeRange}
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#64748B] shrink-0" aria-hidden="true" />
                              <span>
                                {shift.location} — {shift.address}
                              </span>
                            </p>
                          </div>

                          <p className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2">
                            Prep & requirements: {shift.skillsNeeded}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#E2E8F0]">
                          <span className="text-xs text-[#64748B] tabular-nums">
                            {shift.spotsFilled}/{shift.spotsTotal} crew confirmed
                          </span>

                          {shift.registered ? (
                            <button
                              type="button"
                              onClick={() => handleToggleShiftRegistration(shift.id)}
                              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F0FDFA] border border-[#0D9488] text-[#0D9488] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors hover:bg-[#CCFBF1]"
                            >
                              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                              <span>Registered (Release)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={spotsOpen === 0}
                              onClick={() => handleToggleShiftRegistration(shift.id)}
                              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#CBD5E1] text-white text-sm font-semibold transition-colors"
                            >
                              {spotsOpen === 0 ? 'Shift Full' : 'Claim Shift'}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        ) : activeScreen === 'impact' ? (
          <ImpactScreen
            receipts={receipts}
            shifts={shifts}
            onOpenReceipt={(rec) => setInspectingReceipt(rec)}
            onCheckInShift={handleCheckInShift}
            onToggleShiftRegistration={handleToggleShiftRegistration}
            onNavigateToVolunteer={() => navigateTo('discover', 'volunteer')}
          />
        ) : (
          <CsrHubScreen
            usedAnnualMatch={usedAnnualMatch}
            campaigns={campaigns}
            onDonateClick={(camp) => setDonatingCampaign(camp)}
            onSubmitExternalMatch={handleSubmitExternalMatch}
          />
        )}
      </main>

      <footer className="hidden sm:block border-t border-[#E2E8F0] bg-white">
        <div className="max-w-[1200px] mx-auto px-8 lg:px-12 py-5 flex items-center justify-between text-xs text-[#64748B]">
          <span>ImpactConnect · Verified 501(c)(3) Micro-Philanthropy & CSR Stewardship</span>
          <span>100% pass-through settlement · Instant IRS tax documentation</span>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (<640px, 56px height -> total mobile sticky height <= 15%) */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] grid grid-cols-4 items-center"
        aria-label="Mobile navigation"
      >
        <button
          type="button"
          onClick={() => navigateTo('discover', 'donor')}
          className={`h-full flex flex-col items-center justify-center gap-0.5 ${
            activeScreen === 'discover' && viewMode === 'donor'
              ? 'text-[#0D9488] font-semibold'
              : 'text-[#64748B]'
          }`}
        >
          <Compass className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px] leading-none">Discover</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('discover', 'volunteer')}
          className={`h-full flex flex-col items-center justify-center gap-0.5 ${
            activeScreen === 'discover' && viewMode === 'volunteer'
              ? 'text-[#2563EB] font-semibold'
              : 'text-[#64748B]'
          }`}
        >
          <Users className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px] leading-none">Volunteer</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('impact')}
          className={`h-full flex flex-col items-center justify-center gap-0.5 ${
            activeScreen === 'impact' ? 'text-[#0D9488] font-semibold' : 'text-[#64748B]'
          }`}
        >
          <HandHeart className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px] leading-none">Impact</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('csr')}
          className={`h-full flex flex-col items-center justify-center gap-0.5 ${
            activeScreen === 'csr' ? 'text-[#1D4ED8] font-semibold' : 'text-[#64748B]'
          }`}
        >
          <Building2 className="w-5 h-5" aria-hidden="true" />
          <span className="text-[10px] leading-none">CSR Hub</span>
        </button>
      </nav>

      <DonationSheet
        campaign={donatingCampaign}
        remainingAnnualMatch={remainingAnnualMatch}
        onClose={() => setDonatingCampaign(null)}
        onConfirmDonation={handleConfirmDonation}
        onOpenReceipt={(rec) => setInspectingReceipt(rec)}
      />

      <ReceiptModal
        receipt={inspectingReceipt}
        onClose={() => setInspectingReceipt(null)}
      />
    </div>
  );
}

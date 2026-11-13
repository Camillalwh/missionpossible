import React from 'react';
import { ArrowLeft, MapPin, ShieldCheck, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Campaign } from '../types';
import { CampaignArtwork } from './CampaignArtwork';
import { DualTrackProgress } from './DualTrackProgress';

interface CampaignDetailViewProps {
  campaign: Campaign;
  onBack: () => void;
  onDonateClick: (campaign: Campaign) => void;
}

export const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onBack,
  onDonateClick,
}) => {
  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-6 pb-28 sm:pb-12">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#334155] hover:text-[#0D9488] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to all causes</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <CampaignArtwork
              category={campaign.category}
              urgent={campaign.urgent}
              className="h-52 sm:h-64 w-full border-b border-[#E2E8F0]"
            />

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#64748B]">
                <span className="text-[#0F172A] font-semibold">{campaign.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {campaign.location}
                </span>
                <span aria-hidden="true">·</span>
                <span className={campaign.urgent ? 'text-[#E11D48] font-semibold' : ''}>
                  {campaign.urgent ? `Urgent · ${campaign.daysLeft} days left` : `${campaign.daysLeft} days remaining`}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight text-balance">
                {campaign.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-[#1E293B]">
                <span className="font-semibold text-[#0F172A]">{campaign.organization}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  Verified 501(c)(3) · EIN {campaign.ein}
                </span>
              </div>

              <p className="text-base text-[#1E293B] leading-relaxed pt-2">
                {campaign.summary}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-lg font-semibold text-[#0F172A]">
                Transparent Fund Allocation
              </h2>
              <span className="text-xs font-medium text-[#64748B]">100% Direct-to-Field Ledger</span>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#F1F5F9]">
              {campaign.allocation.map((item, idx) => {
                const colors = ['#0D9488', '#2563EB', '#94A3B8'];
                return (
                  <div
                    key={item.label}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: colors[idx % colors.length],
                    }}
                    title={`${item.label}: ${item.percentage}%`}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {campaign.allocation.map((item, idx) => {
                const colors = ['#0D9488', '#2563EB', '#64748B'];
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: colors[idx % colors.length] }}
                        aria-hidden="true"
                      />
                      <span className="font-display text-lg font-bold text-[#0F172A] tabular-nums">
                        {item.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">
              Recent Contributions & Matches
            </h2>
            <div className="divide-y divide-[#E2E8F0]">
              {campaign.recentContributors.map((entry) => (
                <div key={entry.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#0F172A]">{entry.name}</span>
                      <span className="text-xs text-[#64748B]">· {entry.timestamp}</span>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-[#334155] mt-1">{entry.note}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <p className="text-sm font-bold text-[#0F172A]">{formatMoney(entry.amount)}</p>
                    {entry.matchedAmount > 0 && (
                      <p className="text-xs font-medium text-[#1D4ED8]">
                        +{formatMoney(entry.matchedAmount)} matched
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-5 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)]">
            <DualTrackProgress
              raisedAmount={campaign.raisedAmount}
              matchedAmount={campaign.matchedAmount}
              goalAmount={campaign.goalAmount}
            />

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                <div>
                  <p className="font-display font-bold text-sm text-[#0F172A] tabular-nums">
                    {campaign.donorCount}
                  </p>
                  <p className="text-xs text-[#64748B]">Supporters</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                <div>
                  <p className="font-display font-bold text-sm text-[#0F172A] tabular-nums">
                    {campaign.daysLeft} days
                  </p>
                  <p className="text-xs text-[#64748B]">Remaining</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#1D4ED8]">
                  {campaign.matchMultiplier}x Active Corporate Match
                </span>
                <span className="text-xs font-semibold text-[#0F172A] tabular-nums">
                  {formatMoney(campaign.matchPoolRemaining)} left
                </span>
              </div>
              <p className="text-xs text-[#334155]">
                Sponsored by {campaign.matchSponsor}. Every ${campaign.unitCost} you give{' '}
                {campaign.impactUnitLabel}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDonateClick(campaign)}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.99] text-white font-semibold text-sm transition-all"
            >
              Donate with {campaign.matchMultiplier}x Match
            </button>

            <div className="flex items-center gap-2 text-xs text-[#64748B] justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" aria-hidden="true" />
              <span>Instant IRS-ready 501(c)(3) tax receipt issued</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

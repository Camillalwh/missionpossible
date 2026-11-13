import React, { useState } from 'react';
import { Building2, CheckCircle2, Plus, ShieldCheck } from 'lucide-react';
import { Campaign, CauseCategory, DepartmentGiving } from '../types';
import { ANNUAL_MATCH_LIMIT, DEPARTMENT_GIVING, EMPLOYER_NAME } from '../data/mockData';
import { DualTrackProgress } from './DualTrackProgress';

interface CsrHubScreenProps {
  usedAnnualMatch: number;
  campaigns: Campaign[];
  onDonateClick: (campaign: Campaign) => void;
  onSubmitExternalMatch: (payload: {
    organization: string;
    ein: string;
    category: Exclude<CauseCategory, 'All Causes'>;
    amount: number;
  }) => void;
}

export const CsrHubScreen: React.FC<CsrHubScreenProps> = ({
  usedAnnualMatch,
  campaigns,
  onDonateClick,
  onSubmitExternalMatch,
}) => {
  const [orgName, setOrgName] = useState('');
  const [ein, setEin] = useState('');
  const [category, setCategory] = useState<Exclude<CauseCategory, 'All Causes'>>('Education');
  const [amount, setAmount] = useState('50');
  const [submittedNotice, setSubmittedNotice] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const remainingMatch = Math.max(0, ANNUAL_MATCH_LIMIT - usedAnnualMatch);
  const matchUsagePct = Math.min(100, Math.round((usedAnnualMatch / ANNUAL_MATCH_LIMIT) * 100));

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const handleExternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Math.round(Number(amount) || 0);
    if (!orgName.trim() || !ein.trim()) {
      setFormError('Please provide both the registered organization name and 9-digit EIN.');
      return;
    }
    if (numericAmount < 10) {
      setFormError('Minimum external match request is $10.');
      return;
    }
    if (numericAmount > remainingMatch) {
      setFormError(`Amount exceeds your remaining ${formatMoney(remainingMatch)} annual match allowance.`);
      return;
    }

    setFormError('');
    onSubmitExternalMatch({
      organization: orgName.trim(),
      ein: ein.trim(),
      category,
      amount: numericAmount,
    });
    setSubmittedNotice(
      `Submitted 1:1 match request for ${formatMoney(numericAmount)} to ${orgName.trim()}. Recorded in My Impact.`
    );
    setOrgName('');
    setEin('');
    setAmount('50');
  };

  const featuredPartnerCampaigns = campaigns.filter((c) =>
    c.matchSponsor.includes('Horizon')
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-8 pb-28 sm:pb-14 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
            <Building2 className="w-4 h-4" aria-hidden="true" />
            <span>{EMPLOYER_NAME} Corporate Stewardship</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
            Corporate CSR Matching Hub
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Track your annual matching budget, join 2x–3x company initiatives, and verify outside 501(c)(3) receipts.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] flex flex-col justify-between space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0F172A]">
                2026 Annual Employer Match Allowance
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Resets January 1, 2027 · Automatic payroll & instant card matching enabled
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1D4ED8] tabular-nums whitespace-nowrap">
              {matchUsagePct}% utilized
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-3 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full bg-[#2563EB] transition-[width] duration-300"
                style={{ width: `${matchUsagePct}%` }}
              />
            </div>
            <div className="flex items-baseline justify-between text-sm tabular-nums">
              <span>
                <strong className="font-display text-lg text-[#0F172A]">
                  {formatMoney(usedAnnualMatch)}
                </strong>{' '}
                <span className="text-[#64748B]">matched this year</span>
              </span>
              <span className="font-semibold text-[#0D9488]">
                {formatMoney(remainingMatch)} remaining of {formatMoney(ANNUAL_MATCH_LIMIT)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#E2E8F0] tabular-nums">
            <div>
              <p className="text-xs text-[#64748B]">Standard Match</p>
              <p className="font-display font-bold text-base text-[#0F172A] mt-0.5">1:1 (100%)</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Crisis Relief</p>
              <p className="font-display font-bold text-base text-[#E11D48] mt-0.5">3x Multiplier</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Volunteer Grant</p>
              <p className="font-display font-bold text-base text-[#0D9488] mt-0.5">$25 / hr</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <h2 className="font-display text-lg font-semibold text-[#0F172A]">
            Request External 501(c)(3) Match
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5 mb-4">
            Donated outside ImpactConnect? Submit the organization’s EIN to claim a 1:1 employer match.
          </p>

          {submittedNotice && (
            <div className="mb-4 p-3 rounded-xl bg-[#F0FDFA] border border-[#0D9488]/25 flex items-start gap-2 text-xs text-[#0F172A]">
              <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{submittedNotice}</span>
            </div>
          )}

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]/30 text-xs font-medium text-[#93000A]">
              {formError}
            </div>
          )}

          <form onSubmit={handleExternalSubmit} className="space-y-3">
            <div>
              <label htmlFor="ext-org" className="block text-xs font-semibold text-[#64748B] mb-1">
                Nonprofit Organization Name
              </label>
              <input
                id="ext-org"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Bay Area Community Food Bank"
                className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="ext-ein" className="block text-xs font-semibold text-[#64748B] mb-1">
                  Federal EIN
                </label>
                <input
                  id="ext-ein"
                  type="text"
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  placeholder="94-1234567"
                  className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] font-mono text-sm text-[#0F172A] bg-white"
                />
              </div>
              <div>
                <label htmlFor="ext-amount" className="block text-xs font-semibold text-[#64748B] mb-1">
                  Donation Amount ($)
                </label>
                <input
                  id="ext-amount"
                  type="number"
                  min={10}
                  max={remainingMatch || ANNUAL_MATCH_LIMIT}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm font-semibold tabular-nums text-[#0F172A] bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ext-category" className="block text-xs font-semibold text-[#64748B] mb-1">
                Cause Category
              </label>
              <select
                id="ext-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<CauseCategory, 'All Causes'>)}
                className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] bg-white"
              >
                <option value="Education">Education</option>
                <option value="Clean Water">Clean Water</option>
                <option value="Crisis Relief">Crisis Relief</option>
                <option value="Local Food">Local Food</option>
                <option value="Climate">Climate</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={remainingMatch < 10}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#CBD5E1] text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Submit Match Request</span>
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-[#0F172A]">
            Active {EMPLOYER_NAME} Matching Pools
          </h2>
          <span className="text-xs font-medium text-[#1D4ED8] inline-flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Instant Payroll & Card Match
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredPartnerCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#64748B] font-medium">
                    {camp.category} · {camp.daysLeft} days left
                  </span>
                  <span className="font-semibold text-[#B45309] tabular-nums">
                    {camp.matchMultiplier}x Match · {formatMoney(camp.matchPoolRemaining)} pool left
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-[#0F172A]">
                  {camp.title}
                </h3>
                <p className="text-xs text-[#64748B]">{camp.organization}</p>
              </div>

              <div className="space-y-3">
                <DualTrackProgress
                  raisedAmount={camp.raisedAmount}
                  matchedAmount={camp.matchedAmount}
                  goalAmount={camp.goalAmount}
                  compact
                />
                <button
                  type="button"
                  onClick={() => onDonateClick(camp)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold transition-colors"
                >
                  Give with {camp.matchMultiplier}x Match
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0]">
          <h2 className="font-display text-lg font-semibold text-[#0F172A]">
            Department Participation & Matching Ledger
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Quarterly company-wide giving totals across {EMPLOYER_NAME} teams.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5 text-right">Participation</th>
                <th className="py-3 px-5 text-right">Employee Given</th>
                <th className="py-3 px-5 text-right">Corporate Matched</th>
                <th className="py-3 px-5 text-right">Volunteer Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {DEPARTMENT_GIVING.map((dept: DepartmentGiving) => {
                const pct = Math.round((dept.participants / dept.totalDonors) * 100);
                return (
                  <tr key={dept.department} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#0F172A] whitespace-nowrap">
                      {dept.department}
                    </td>
                    <td className="py-3.5 px-5 text-right text-[#334155] tabular-nums whitespace-nowrap">
                      {dept.participants}/{dept.totalDonors} ({pct}%)
                    </td>
                    <td className="py-3.5 px-5 text-right font-medium text-[#0F172A] tabular-nums whitespace-nowrap">
                      {formatMoney(dept.employeeGiven)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-semibold text-[#1D4ED8] tabular-nums whitespace-nowrap">
                      {formatMoney(dept.corporateMatched)}
                    </td>
                    <td className="py-3.5 px-5 text-right text-[#0D9488] font-semibold tabular-nums whitespace-nowrap">
                      {dept.volunteerHours} hrs
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

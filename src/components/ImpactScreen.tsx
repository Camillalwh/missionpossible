import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Download, ExternalLink, MapPin, Search, ShieldCheck } from 'lucide-react';
import { DonationReceipt, VolunteerShift } from '../types';

interface ImpactScreenProps {
  receipts: DonationReceipt[];
  shifts: VolunteerShift[];
  onOpenReceipt: (receipt: DonationReceipt) => void;
  onCheckInShift: (shiftId: string) => void;
  onToggleShiftRegistration: (shiftId: string) => void;
  onNavigateToVolunteer: () => void;
}

export const ImpactScreen: React.FC<ImpactScreenProps> = ({
  receipts,
  shifts,
  onOpenReceipt,
  onCheckInShift,
  onToggleShiftRegistration,
  onNavigateToVolunteer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Match Pending'>('All');

  const registeredShifts = useMemo(
    () => shifts.filter((s) => s.registered),
    [shifts]
  );

  const totals = useMemo(() => {
    const direct = receipts.reduce((sum, r) => sum + r.amount, 0);
    const matched = receipts.reduce((sum, r) => sum + r.matchedAmount, 0);
    const hours = registeredShifts.reduce((sum, s) => sum + s.durationHours, 0);
    return {
      direct,
      matched,
      combined: direct + matched,
      hours,
    };
  }, [receipts, registeredShifts]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.organization.toLowerCase().includes(q) ||
        r.campaignTitle.toLowerCase().includes(q) ||
        r.receiptCode.toLowerCase().includes(q) ||
        r.ein.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [receipts, statusFilter, searchQuery]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  const handleExportCsv = () => {
    const header = ['ReceiptCode', 'Date', 'Organization', 'EIN', 'Category', 'DirectUSD', 'MatchedUSD', 'Status'];
    const rows = receipts.map((r) => [
      r.receiptCode,
      `"${r.date}"`,
      `"${r.organization}"`,
      r.ein,
      `"${r.category}"`,
      r.amount,
      r.matchedAmount,
      r.status,
    ]);
    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'impactconnect-2026-tax-receipts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-8 pb-28 sm:pb-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0D9488]">Personal Stewardship Ledger</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mt-1">
            My Impact & Tax Receipts
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            2026 verified 501(c)(3) contributions, unlocked corporate matches, and upcoming field shifts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-sm font-semibold text-[#0F172A] transition-colors inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 text-[#0D9488]" aria-hidden="true" />
          <span>Export 2026 Tax CSV</span>
        </button>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Personal impact summary">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#64748B]">Direct Contributions</p>
          <p className="font-display text-2xl font-bold text-[#0F172A] tabular-nums mt-1.5">
            {formatMoney(totals.direct)}
          </p>
          <p className="text-xs text-[#0D9488] font-medium mt-1">100% tax-deductible YTD</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#64748B]">CSR Match Unlocked</p>
          <p className="font-display text-2xl font-bold text-[#1D4ED8] tabular-nums mt-1.5">
            {formatMoney(totals.matched)}
          </p>
          <p className="text-xs text-[#64748B] mt-1">Corporate partner funds</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#64748B]">Total Field Capital</p>
          <p className="font-display text-2xl font-bold text-[#0D9488] tabular-nums mt-1.5">
            {formatMoney(totals.combined)}
          </p>
          <p className="text-xs text-[#64748B] tabular-nums mt-1">
            Across {receipts.length} verified gifts
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-medium text-[#64748B]">Committed Volunteer Time</p>
          <p className="font-display text-2xl font-bold text-[#0F172A] tabular-nums mt-1.5">
            {totals.hours} hrs
          </p>
          <p className="text-xs text-[#64748B] tabular-nums mt-1">
            {registeredShifts.length} scheduled shift{registeredShifts.length === 1 ? '' : 's'}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0F172A]">
                Tax-Deductible Receipts
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Select any contribution to inspect or print its official IRS statement.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg self-start">
              {(['All', 'Verified', 'Match Pending'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === tab
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 sm:px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by organization, EIN, or receipt ID..."
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8]"
                aria-label="Filter tax receipts"
              />
            </div>
          </div>

          {filteredReceipts.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-[#0F172A]">No matching receipts found</p>
              <p className="text-xs text-[#64748B]">
                Try clearing your search filter or switching status tabs.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {filteredReceipts.map((rec) => (
                <div
                  key={rec.id}
                  className="px-5 sm:px-6 py-4 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs text-[#64748B]">
                      <span className="font-mono font-medium text-[#0F172A]">{rec.receiptCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>EIN {rec.ein}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#0F172A] truncate">
                      {rec.organization}
                    </p>
                    <p className="text-xs text-[#64748B] truncate">{rec.campaignTitle}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    <div className="text-left sm:text-right tabular-nums">
                      <p className="text-sm font-bold text-[#0F172A]">
                        {formatMoney(rec.amount)}{' '}
                        <span className="text-xs font-semibold text-[#1D4ED8]">
                          +{formatMoney(rec.matchedAmount)} match
                        </span>
                      </p>
                      <p
                        className={`text-xs font-medium inline-flex items-center gap-1 ${
                          rec.status === 'Verified' ? 'text-[#0D9488]' : 'text-[#B45309]'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{rec.status}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenReceipt(rec)}
                      className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#0D9488] hover:text-[#0D9488] text-xs font-semibold text-[#0F172A] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <span>Receipt</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#E2E8F0]">
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">
              Scheduled Volunteer Shifts
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              On-site check-in verifies volunteer hours for CSR grants.
            </p>
          </div>

          {registeredShifts.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-sm font-medium text-[#0F172A]">No upcoming shifts claimed</p>
              <p className="text-xs text-[#64748B]">
                Switch to Volunteer View to join local dispatch crews.
              </p>
              <button
                type="button"
                onClick={onNavigateToVolunteer}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold transition-colors"
              >
                Browse Volunteer Shifts
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {registeredShifts.map((shift) => (
                <div key={shift.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                    <span className="font-semibold text-[#0D9488]">{shift.category}</span>
                    <span className="tabular-nums">{shift.durationHours} hrs</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A] leading-snug">
                      {shift.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{shift.organization}</p>
                  </div>
                  <div className="space-y-1 text-xs text-[#334155]">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                      <span>
                        {shift.dateLabel} · {shift.timeRange}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                      <span>{shift.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {shift.checkedIn ? (
                      <div className="flex-1 min-h-[40px] px-3 py-2 rounded-lg bg-[#F0FDFA] text-[#0D9488] text-xs font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        <span>Checked In</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCheckInShift(shift.id)}
                        className="flex-1 min-h-[40px] px-3 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleShiftRegistration(shift.id)}
                      className="min-h-[40px] px-3 py-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                    >
                      Release
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

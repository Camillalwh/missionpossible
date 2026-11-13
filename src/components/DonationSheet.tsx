import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { Campaign, DonationReceipt } from '../types';
import { EMPLOYER_NAME } from '../data/mockData';

interface DonationSheetProps {
  campaign: Campaign | null;
  remainingAnnualMatch: number;
  onClose: () => void;
  onConfirmDonation: (payload: {
    campaignId: string;
    amount: number;
    applyMatch: boolean;
    matchedAmount: number;
    donorName: string;
    note?: string;
  }) => DonationReceipt;
  onOpenReceipt: (receipt: DonationReceipt) => void;
}

const PRESET_AMOUNTS = [10, 25, 50, 100];

export const DonationSheet: React.FC<DonationSheetProps> = ({
  campaign,
  remainingAnnualMatch,
  onClose,
  onConfirmDonation,
  onOpenReceipt,
}) => {
  const [amountInput, setAmountInput] = useState<string>('25');
  const [applyMatch, setApplyMatch] = useState<boolean>(true);
  const [donorName, setDonorName] = useState<string>('Alex Rivera');
  const [note, setNote] = useState<string>('');
  const [confirmedReceipt, setConfirmedReceipt] = useState<DonationReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (campaign) {
      setAmountInput('25');
      setApplyMatch(remainingAnnualMatch > 0 && campaign.matchPoolRemaining > 0);
      setNote('');
      setConfirmedReceipt(null);
      setErrorMsg('');
    }
  }, [campaign, remainingAnnualMatch]);

  useEffect(() => {
    if (!campaign) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [campaign, onClose]);

  if (!campaign) return null;

  const parsedAmount = Math.max(0, Math.round((Number(amountInput) || 0) * 100) / 100);
  const maxEligibleMatch = Math.min(remainingAnnualMatch, campaign.matchPoolRemaining);
  const requestedMatch = applyMatch ? parsedAmount * (campaign.matchMultiplier - 1) : 0;
  const effectiveMatch = Math.min(requestedMatch, maxEligibleMatch);
  const totalImpact = parsedAmount + effectiveMatch;
  const impactUnits = Math.max(1, Math.floor(totalImpact / campaign.unitCost));

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount < 5) {
      setErrorMsg('Minimum micro-donation is $5 to cover payment settlement.');
      return;
    }
    setErrorMsg('');
    const receipt = onConfirmDonation({
      campaignId: campaign.id,
      amount: parsedAmount,
      applyMatch: effectiveMatch > 0,
      matchedAmount: effectiveMatch,
      donorName: donorName.trim() || 'Anonymous Supporter',
      note: note.trim() || undefined,
    });
    setConfirmedReceipt(receipt);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F172A]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-sheet-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2E8F0] shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-[#CBD5E1]" aria-hidden="true" />
        </div>

        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[#E2E8F0]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#1D4ED8] font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Verified 501(c)(3) · EIN {campaign.ein}</span>
            </div>
            <h2
              id="donation-sheet-title"
              className="mt-1 font-display text-lg font-bold text-[#0F172A] leading-snug"
            >
              {confirmedReceipt ? 'Contribution Confirmed' : campaign.title}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">{campaign.organization}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors shrink-0"
            aria-label="Close donation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedReceipt ? (
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F0FDFA] border border-[#0D9488]/25">
              <CheckCircle2 className="w-6 h-6 text-[#0D9488] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-display font-bold text-[#0F172A] text-base tabular-nums">
                  {formatMoney(confirmedReceipt.amount + confirmedReceipt.matchedAmount)} deployed to{' '}
                  {confirmedReceipt.organization}
                </p>
                <p className="text-sm text-[#1E293B] mt-1">
                  Your {formatMoney(confirmedReceipt.amount)} contribution unlocked{' '}
                  <span className="font-semibold text-[#1D4ED8] tabular-nums">
                    {formatMoney(confirmedReceipt.matchedAmount)}
                  </span>{' '}
                  in corporate matching funds.
                </p>
              </div>
            </div>

            <div className="border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0] text-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#64748B]">Receipt ID</span>
                <span className="font-mono text-xs font-semibold text-[#0F172A]">
                  {confirmedReceipt.receiptCode}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#64748B]">Your Contribution</span>
                <span className="font-semibold text-[#0F172A] tabular-nums">
                  {formatMoney(confirmedReceipt.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#64748B]">CSR Match ({confirmedReceipt.matchSponsor})</span>
                <span className="font-semibold text-[#1D4ED8] tabular-nums">
                  +{formatMoney(confirmedReceipt.matchedAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC]">
                <span className="font-medium text-[#0F172A]">Tax-Deductible Amount</span>
                <span className="font-display font-bold text-[#0D9488] tabular-nums">
                  {formatMoney(confirmedReceipt.amount)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  const rec = confirmedReceipt;
                  onClose();
                  onOpenReceipt(rec);
                }}
                className="flex-1 min-h-[48px] px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-sm font-semibold text-[#0F172A] transition-colors flex items-center justify-center gap-2"
              >
                <span>View IRS Tax Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <span className="block text-xs font-semibold text-[#64748B] mb-2.5">
                Select quick-give amount
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {PRESET_AMOUNTS.map((preset) => {
                  const isSelected = parsedAmount === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmountInput(String(preset));
                        setErrorMsg('');
                      }}
                      className={`min-h-[44px] rounded-xl text-sm font-semibold tabular-nums border transition-colors ${
                        isSelected
                          ? 'bg-[#F0FDFA] border-[#0D9488] text-[#0D9488]'
                          : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      ${preset}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="custom-donation-amount"
                className="block text-xs font-semibold text-[#64748B] mb-2"
              >
                Or enter custom amount
              </label>
              <div className="relative flex items-center h-12 rounded-xl border-[1.5px] border-[#CBD5E1] focus-within:border-[#0D9488] focus-within:shadow-[0_0_0_3px_rgba(13,148,136,0.25)] bg-white transition-all">
                <span className="pl-4 pr-1 font-display text-2xl font-bold text-[#64748B] select-none">
                  $
                </span>
                <input
                  id="custom-donation-amount"
                  type="number"
                  min={1}
                  step="1"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full h-full pr-4 bg-transparent font-display text-2xl font-bold text-[#0F172A] tabular-nums focus:outline-none focus:shadow-none"
                  placeholder="25"
                />
                <span className="pr-4 text-xs font-medium text-[#64748B] whitespace-nowrap">
                  USD
                </span>
              </div>
              {errorMsg && (
                <p className="mt-1.5 text-xs font-medium text-[#BA1A1A]">{errorMsg}</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0F172A]">
                      Apply {campaign.matchMultiplier}x Corporate Match
                    </span>
                    <span className="text-xs font-semibold text-[#1D4ED8]">
                      {campaign.matchSponsor}
                    </span>
                  </div>
                  <p className="text-xs text-[#334155] mt-0.5 tabular-nums">
                    Your annual CSR allowance remaining: {formatMoney(remainingAnnualMatch)}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={applyMatch}
                  disabled={maxEligibleMatch <= 0}
                  onClick={() => setApplyMatch((prev) => !prev)}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    applyMatch && maxEligibleMatch > 0 ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                  }`}
                  aria-label="Toggle corporate CSR matching"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      applyMatch && maxEligibleMatch > 0 ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {parsedAmount > 0 && (
                <div className="pt-2 border-t border-[#2563EB]/15 flex items-center justify-between text-xs tabular-nums">
                  <span className="text-[#1E293B]">
                    {formatMoney(parsedAmount)} gift + {formatMoney(effectiveMatch)} match
                  </span>
                  <span className="font-display font-bold text-[#1D4ED8] text-sm">
                    {formatMoney(totalImpact)} total impact
                  </span>
                </div>
              )}
            </div>

            {parsedAmount >= 5 && (
              <p className="text-xs text-[#334155] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5">
                Estimated outcome: <span className="font-semibold text-[#0F172A] tabular-nums">{impactUnits}×</span>{' '}
                {campaign.impactUnitLabel}.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="donor-display-name" className="block text-xs font-semibold text-[#64748B] mb-1">
                  Receipt Name ({EMPLOYER_NAME})
                </label>
                <input
                  id="donor-display-name"
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] bg-white"
                  placeholder="Alex Rivera"
                />
              </div>
              <div>
                <label htmlFor="donor-note" className="block text-xs font-semibold text-[#64748B] mb-1">
                  Optional Note to Team
                </label>
                <input
                  id="donor-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#CBD5E1] text-sm text-[#0F172A] bg-white"
                  placeholder="Supporting local crews"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] active:scale-[0.99] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>
                Donate {parsedAmount > 0 ? formatMoney(parsedAmount) : ''} Now
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

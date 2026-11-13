import React, { useState } from 'react';
import { Check, Copy, Printer, ShieldCheck, X } from 'lucide-react';
import { DonationReceipt } from '../types';

interface ReceiptModalProps {
  receipt: DonationReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(n);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receipt.receiptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-start justify-between gap-4 bg-[#F8FAFC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Official 501(c)(3) Tax Receipt</span>
            </div>
            <h2 id="receipt-modal-title" className="mt-1 font-display text-lg font-bold text-[#0F172A]">
              {receipt.organization}
            </h2>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">EIN {receipt.ein}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors"
            aria-label="Close receipt modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Designated Initiative</p>
            <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{receipt.campaignTitle}</p>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl divide-y divide-[#E2E8F0] text-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[#64748B]">Receipt Reference</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0F172A] hover:text-[#0D9488] transition-colors"
                title="Copy receipt ID"
              >
                <span>{receipt.receiptCode}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-[#0D9488]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
              </button>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[#64748B]">Settlement Date</span>
              <span className="font-medium text-[#0F172A]">{receipt.date}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[#64748B]">Status</span>
              <span className="font-semibold text-[#0D9488]">{receipt.status}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[#64748B]">Direct Donor Contribution</span>
              <span className="font-semibold text-[#0F172A] tabular-nums">
                {formatMoney(receipt.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[#64748B]">Corporate Match ({receipt.matchSponsor})</span>
              <span className="font-semibold text-[#1D4ED8] tabular-nums">
                {formatMoney(receipt.matchedAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-[#F0FDFA]">
              <span className="font-semibold text-[#0F172A]">Total Combined Impact</span>
              <span className="font-display font-bold text-[#0D9488] tabular-nums">
                {formatMoney(receipt.amount + receipt.matchedAmount)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            No goods or services were provided in exchange for this contribution. Retaining this
            statement satisfies IRS substantiation requirements for charitable gifts under $250
            and above.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-sm font-semibold text-[#0F172A] transition-colors inline-flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

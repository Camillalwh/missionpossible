import React from 'react';

interface DualTrackProgressProps {
  raisedAmount: number;
  matchedAmount: number;
  goalAmount: number;
  compact?: boolean;
}

export const DualTrackProgress: React.FC<DualTrackProgressProps> = ({
  raisedAmount,
  matchedAmount,
  goalAmount,
  compact = false,
}) => {
  const safeGoal = Math.max(goalAmount, 1);
  const raisedPct = Math.min(100, (raisedAmount / safeGoal) * 100);
  const matchedPct = Math.min(100 - raisedPct, (matchedAmount / safeGoal) * 100);
  const totalCombined = raisedAmount + matchedAmount;
  const totalPct = Math.min(100, Math.round((totalCombined / safeGoal) * 100));

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="w-full">
      <div
        className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden flex"
        role="progressbar"
        aria-valuenow={totalPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${totalPct}% of ${formatCurrency(goalAmount)} goal funded including corporate match`}
      >
        <div
          className="h-full bg-[#0D9488] transition-[width] duration-300 ease-out"
          style={{ width: `${raisedPct}%` }}
          title={`Direct donor funds: ${formatCurrency(raisedAmount)}`}
        />
        {matchedPct > 0 && (
          <div
            className="h-full match-hatch transition-[width] duration-300 ease-out"
            style={{ width: `${matchedPct}%` }}
            title={`Corporate CSR match: ${formatCurrency(matchedAmount)}`}
          />
        )}
      </div>

      <div className={`flex items-baseline justify-between gap-2 ${compact ? 'mt-2' : 'mt-2.5'}`}>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display font-bold text-[#0F172A] tabular-nums text-base">
            {formatCurrency(totalCombined)}
          </span>
          <span className="text-xs text-[#64748B] tabular-nums">
            of {formatCurrency(goalAmount)} goal
          </span>
        </div>
        <span className="text-xs font-semibold text-[#0D9488] tabular-nums whitespace-nowrap shrink-0">
          {totalPct}% funded
        </span>
      </div>

      {!compact && (
        <div className="flex items-center gap-4 mt-1.5 text-xs text-[#64748B] tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0D9488] inline-block" aria-hidden="true" />
            <span>Direct: {formatCurrency(raisedAmount)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm match-hatch inline-block" aria-hidden="true" />
            <span>CSR Match: {formatCurrency(matchedAmount)}</span>
          </span>
        </div>
      )}
    </div>
  );
};

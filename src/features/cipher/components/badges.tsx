// src/features/cipher/components/badges.tsx — small status indicators for tokens.
import { AlertTriangle, Info, Lock, Shield, TrendingDown, TrendingUp, Unlock } from 'lucide-react';
import { Token, getRiskColor, getRiskText } from '../types';

export const VerifiedIcon = ({ verified }: { verified: boolean }) =>
  verified ? (
    <Shield size={16} className="text-success shrink-0" aria-label="Verified token" />
  ) : (
    <AlertTriangle size={16} className="text-warning shrink-0" aria-label="Unverified token" />
  );

export const AuditBadge = ({ token }: { token: Token }) =>
  token.auditStatus?.isAudited ? (
    <span className="text-xs px-1.5 py-0.5 rounded-full bg-success/10 text-success inline-flex items-center gap-0.5">
      <Shield size={10} aria-hidden="true" />
      Audited
    </span>
  ) : null;

export const TeamBadge = ({ token }: { token: Token }) =>
  token.team?.isDoxxed ? (
    <span className="text-xs px-1.5 py-0.5 rounded-full bg-success/10 text-success inline-flex items-center gap-0.5">
      <Unlock size={10} aria-hidden="true" />
      Doxxed
    </span>
  ) : (
    <span className="text-xs px-1.5 py-0.5 rounded-full bg-warning/10 text-warning inline-flex items-center gap-0.5">
      <Lock size={10} aria-hidden="true" />
      Anon
    </span>
  );

export const PriceChange = ({ change, iconSize = 14 }: { change: number; iconSize?: number }) => (
  <span
    className={`inline-flex items-center gap-1 font-mono tabular-nums ${
      change >= 0 ? 'text-gain' : 'text-loss'
    }`}
  >
    {change >= 0 ? (
      <TrendingUp size={iconSize} aria-hidden="true" />
    ) : (
      <TrendingDown size={iconSize} aria-hidden="true" />
    )}
    {change >= 0 ? '+' : ''}
    {change.toFixed(2)}%
  </span>
);

/** Risk pill with a hover tooltip listing the token's risk factors. */
export const RiskBadge = ({ token }: { token: Token }) => (
  <div className="flex justify-center relative group">
    <span
      className={`px-2 py-1 rounded-full text-xs ${getRiskColor(token.riskScore)} bg-surface-2 border border-current inline-flex items-center gap-1`}
    >
      {getRiskText(token.riskScore)}
      <Info size={10} aria-hidden="true" />
    </span>

    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 p-3 bg-surface border border-border rounded-lg shadow-xl z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      <div className="text-sm text-left">
        <div className="font-semibold mb-1">Risk factors</div>
        {token.riskFactors && token.riskFactors.length > 0 ? (
          <ul className="list-disc pl-4 space-y-0.5 text-xs text-text-secondary">
            {token.riskFactors.map((factor, idx) => (
              <li key={idx}>{factor}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-success">No significant risk factors</p>
        )}

        {token.lockupPeriod && (
          <div className="mt-1.5 pt-1.5 border-t border-border">
            <div className="text-xs flex gap-1 items-center text-text-secondary">
              <Lock size={10} aria-hidden="true" />
              <span>
                {token.lockupPercentage}% tokens locked for {token.lockupPeriod} days
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

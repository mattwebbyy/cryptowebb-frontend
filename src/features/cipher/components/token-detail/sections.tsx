// src/features/cipher/components/token-detail/sections.tsx — content cards for the token modal.
import {
  AlertTriangle,
  ExternalLink,
  FileText,
  Github as GitHub,
  Lock,
  Shield,
  Twitter,
  Unlock,
  Users,
} from 'lucide-react';
import { Sparkline } from '@/components/charts/Sparkline';
import {
  Token,
  formatCompactNumber,
  formatCurrency,
  getExplorerUrl,
  getRiskColor,
  getRiskText,
} from '../../types';
import { PriceChange } from '../badges';

const formatPrice = (price: number) => {
  if (price < 0.00001 && price > 0) {
    return `$${price.toExponential(4)}`;
  }
  return `$${price.toFixed(6)}`;
};

const calculateUnlockDate = (launch: string, period: number) => {
  try {
    const launchDate = new Date(launch);
    const unlockTimestamp = launchDate.getTime() + period * 24 * 60 * 60 * 1000;
    return new Date(unlockTimestamp).toLocaleDateString();
  } catch (e) {
    console.error('Error calculating unlock date:', e);
    return 'Invalid Date';
  }
};

export const SectionCard = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-surface-2 border border-border rounded-xl p-4 ${className}`}>
    <h3 className="text-base font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex justify-between gap-3 text-sm">
    <span className="text-text-secondary">{label}</span>
    <span className="text-right">{children}</span>
  </div>
);

export const PriceInfoCard = ({ token }: { token: Token }) => (
  <SectionCard title="Price information">
    <div className="space-y-3">
      <Row label="Current price">
        <span className="font-mono tabular-nums font-semibold">{formatPrice(token.price)}</span>
      </Row>
      <Row label="24h change">
        <PriceChange change={token.priceChange24h} />
      </Row>
      <Row label="Market cap">
        <span className="font-mono tabular-nums">{formatCurrency(token.marketCap)}</span>
      </Row>
      <Row label="Liquidity">
        <span className="font-mono tabular-nums">{formatCurrency(token.liquidity)}</span>
      </Row>
      <Row label="Holders">
        <span className="font-mono tabular-nums">{formatCompactNumber(token.holders)}</span>
      </Row>
      <Row label="Launch date">{new Date(token.launchDate).toLocaleDateString()}</Row>
      <div className="pt-2 mt-2 border-t border-border">
        <a
          href={getExplorerUrl(token.address, token.chainName)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
        >
          <ExternalLink size={12} aria-hidden="true" />
          View on {token.chainName} explorer
        </a>
      </div>
    </div>
  </SectionCard>
);

export const PriceHistoryCard = ({ token }: { token: Token }) => (
  <SectionCard title="Price history (7d)" className="md:col-span-2">
    <div className="h-40">
      {token.priceHistory && token.priceHistory.length > 1 ? (
        <Sparkline
          data={token.priceHistory}
          width={480}
          height={120}
          strokeWidth={2}
          color={
            token.priceHistory[token.priceHistory.length - 1] >= token.priceHistory[0]
              ? 'var(--color-gain)'
              : 'var(--color-loss)'
          }
          className="w-full h-full"
        />
      ) : (
        <div className="h-full flex items-center justify-center text-text-secondary">
          No price history data available
        </div>
      )}
    </div>
  </SectionCard>
);

export const SupplyCard = ({ token }: { token: Token }) => (
  <SectionCard title="Supply">
    <div className="space-y-3">
      <Row label="Total supply">
        <span className="font-mono tabular-nums">{formatCompactNumber(token.totalSupply)}</span>
      </Row>
      <Row label="Circulating supply">
        <span className="font-mono tabular-nums">
          {formatCompactNumber(token.circulatingSupply)}
        </span>
      </Row>
      <Row label="Circulation ratio">
        <span className="font-mono tabular-nums">
          {token.totalSupply > 0
            ? ((token.circulatingSupply / token.totalSupply) * 100).toFixed(2)
            : '0.00'}
          %
        </span>
      </Row>

      {token.lockupPeriod !== undefined && token.lockupPercentage !== undefined && (
        <div className="border-t border-border my-2 pt-2">
          <div className="flex items-center gap-1 mb-2 text-sm font-semibold">
            <Lock size={14} aria-hidden="true" />
            Token lockup
          </div>
          <div className="space-y-2">
            <Row label="Locked tokens">
              <span className="font-mono tabular-nums">{token.lockupPercentage}%</span>
            </Row>
            <Row label="Lock duration">
              <span className="font-mono tabular-nums">{token.lockupPeriod} days</span>
            </Row>
            <Row label="Unlock date">
              {calculateUnlockDate(token.launchDate, token.lockupPeriod)}
            </Row>
          </div>
        </div>
      )}
    </div>
  </SectionCard>
);

export const TeamAuditCard = ({ token }: { token: Token }) => (
  <SectionCard title="Team & audit">
    <div className="space-y-3">
      <Row label="Team name">{token.team.name || 'N/A'}</Row>
      <Row label="Identity status">
        <span
          className={`inline-flex items-center gap-1 ${token.team.isDoxxed ? 'text-success' : 'text-warning'}`}
        >
          {token.team.isDoxxed ? (
            <>
              <Unlock size={14} aria-hidden="true" />
              Doxxed
            </>
          ) : (
            <>
              <Lock size={14} aria-hidden="true" />
              Anonymous
            </>
          )}
        </span>
      </Row>
      <Row label="Prior projects">
        <span className={token.team.hasPriorProjects ? 'text-warning' : 'text-success'}>
          {token.team.hasPriorProjects ? 'Yes' : 'No'}
        </span>
      </Row>

      <div className="border-t border-border my-2 pt-2">
        <div className="flex items-center gap-1 mb-2 text-sm font-semibold">
          <Shield size={14} aria-hidden="true" />
          Security audit
        </div>

        {token.auditStatus.isAudited ? (
          <div className="space-y-2">
            <Row label="Audit status">
              <span className="text-success">Audited</span>
            </Row>
            {token.auditStatus.auditCompany && (
              <Row label="Audit company">{token.auditStatus.auditCompany}</Row>
            )}
            {token.auditStatus.score !== undefined && (
              <Row label="Audit score">
                <span
                  className={
                    token.auditStatus.score > 70
                      ? 'text-success'
                      : token.auditStatus.score > 40
                        ? 'text-warning'
                        : 'text-error'
                  }
                >
                  {token.auditStatus.score}/100
                </span>
              </Row>
            )}
            {token.auditStatus.auditUrl && (
              <a
                href={token.auditStatus.auditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
              >
                <FileText size={12} aria-hidden="true" />
                View audit report
              </a>
            )}
          </div>
        ) : (
          <div className="text-warning flex items-center gap-1 text-sm">
            <AlertTriangle size={14} aria-hidden="true" />
            Not audited
          </div>
        )}
      </div>
    </div>
  </SectionCard>
);

export const CommunityCard = ({ token }: { token: Token }) => (
  <SectionCard title="Community">
    <div className="space-y-3">
      <Row label="Twitter">
        <span className="font-mono tabular-nums inline-flex items-center gap-1">
          <Twitter size={12} aria-hidden="true" />
          {formatCompactNumber(token.socialMetrics.twitterFollowers)} followers
        </span>
      </Row>
      <Row label="Discord">
        <span className="font-mono tabular-nums inline-flex items-center gap-1">
          <Users size={12} aria-hidden="true" />
          {formatCompactNumber(token.socialMetrics.discordMembers)} members
        </span>
      </Row>
      <Row label="Telegram">
        <span className="font-mono tabular-nums inline-flex items-center gap-1">
          <Users size={12} aria-hidden="true" />
          {formatCompactNumber(token.socialMetrics.telegramMembers)} members
        </span>
      </Row>

      {token.socialMetrics.githubStats && (
        <div className="border-t border-border my-2 pt-2">
          <div className="flex items-center gap-1 mb-2 text-sm font-semibold">
            <GitHub size={14} aria-hidden="true" />
            GitHub activity
          </div>
          <div className="space-y-2">
            <Row label="Stars">
              <span className="font-mono tabular-nums">
                {formatCompactNumber(token.socialMetrics.githubStats.stars)}
              </span>
            </Row>
            <Row label="Forks">
              <span className="font-mono tabular-nums">
                {formatCompactNumber(token.socialMetrics.githubStats.forks)}
              </span>
            </Row>
            <Row label="Contributors">
              <span className="font-mono tabular-nums">
                {formatCompactNumber(token.socialMetrics.githubStats.contributors)}
              </span>
            </Row>
            <Row label="Commits (all time)">
              <span className="font-mono tabular-nums">
                {formatCompactNumber(token.socialMetrics.githubStats.commits)}
              </span>
            </Row>
          </div>
        </div>
      )}
    </div>
  </SectionCard>
);

interface RiskBarProps {
  label: string;
  level: 'low' | 'medium' | 'high';
}

const riskBar = {
  low: { text: 'Low', width: '25%', color: 'bg-success' },
  medium: { text: 'Medium', width: '55%', color: 'bg-warning' },
  high: { text: 'High', width: '80%', color: 'bg-error' },
} as const;

const RiskBar = ({ label, level }: RiskBarProps) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm text-text-secondary">{riskBar[level].text}</span>
    </div>
    <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border">
      <div className={`h-full ${riskBar[level].color}`} style={{ width: riskBar[level].width }} />
    </div>
  </div>
);

const getRiskBgColor = (score: number) => {
  if (score < 30) return 'bg-success/10';
  if (score < 60) return 'bg-warning/10';
  return 'bg-error/10';
};

export const RiskAssessmentCard = ({ token }: { token: Token }) => {
  const teamLevel = token.team.isDoxxed ? 'low' : 'medium';
  const auditLevel = token.auditStatus.isAudited
    ? token.auditStatus.score !== undefined && token.auditStatus.score < 50
      ? 'medium'
      : 'low'
    : 'high';
  const lockupLevel = token.lockupPeriod && token.lockupPeriod > 30 ? 'low' : 'medium';
  const volatilityLevel =
    Math.abs(token.priceChange24h) > 25
      ? 'high'
      : Math.abs(token.priceChange24h) > 10
        ? 'medium'
        : 'low';

  return (
    <SectionCard title="Risk assessment">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border border-current ${getRiskBgColor(token.riskScore)} ${getRiskColor(token.riskScore)}`}
            >
              <span className="text-xl font-bold font-mono tabular-nums">{token.riskScore}</span>
            </div>
            <div>
              <div className={`font-bold ${getRiskColor(token.riskScore)}`}>
                {getRiskText(token.riskScore)} risk
              </div>
              <div className="text-sm text-text-secondary">Overall risk score (0–100)</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Identified risk factors</h4>
            {token.riskFactors && token.riskFactors.length > 0 ? (
              <ul className="space-y-1">
                {token.riskFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle
                      size={14}
                      className="text-warning flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-text-secondary">{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start gap-2 text-success">
                <Shield size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm">
                  No major specific risk factors identified based on available data.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Risk breakdown</h4>
          <RiskBar label="Team risk (anon/doxxed)" level={teamLevel} />
          <RiskBar label="Code security (audit status)" level={auditLevel} />
          <RiskBar label="Tokenomics (lockup)" level={lockupLevel} />
          <RiskBar label="Market volatility (24h change)" level={volatilityLevel} />
        </div>
      </div>
    </SectionCard>
  );
};

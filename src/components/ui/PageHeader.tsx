import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: React.ReactNode;
  /** Right-aligned slot: live indicators, badges, filters. */
  actions?: React.ReactNode;
}

/** Compact product page header: title left, actions right, one-line context. */
export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  actions,
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
    <div>
      <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
        {Icon && <Icon className="w-[18px] h-[18px] text-text-secondary" aria-hidden />}
        {title}
      </h1>
      {description && <p className="text-[13px] text-text-secondary mt-0.5">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

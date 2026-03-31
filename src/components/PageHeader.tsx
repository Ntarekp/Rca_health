"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  greeting?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, greeting, actions }: PageHeaderProps) {
  const { locale } = useLanguage();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="flex-1">
        {greeting && (
          <h2 className="text-14px text-text-tertiary font-normal mb-1">{greeting}</h2>
        )}
        <h1 className="text-24px font-semibold text-primary">{title}</h1>
        {subtitle && (
          <p className="text-12px text-text-tertiary">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {actions}
        <LanguageSwitcher />
      </div>
    </div>
  );
}

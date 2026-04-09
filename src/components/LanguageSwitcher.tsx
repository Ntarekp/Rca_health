"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { Locale, localeNames } from '@/i18n/config';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-200 rounded-10 hover:border-primary transition-colors">
        <Globe size={18} className="text-slate-600" />
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="text-14px font-bold text-slate-700 bg-transparent outline-none cursor-pointer appearance-none uppercase"
        >
          {Object.entries(localeNames).map(([code, name]) => (
            <option key={code} value={code}>
              {code.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

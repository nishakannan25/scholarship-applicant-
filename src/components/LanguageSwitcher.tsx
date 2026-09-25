import React from 'react';
import { useUiStore } from '../stores/useUiStore';
import { Language } from '../i18n/translations';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useUiStore();

  return (
    <div className="relative flex items-center gap-1.5 bg-card border border-border px-2.5 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
      <Globe className="h-4 w-4 text-primary shrink-0" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer pr-1"
        aria-label="Select Language"
      >
        <option value="en" className="bg-card text-foreground">English</option>
        <option value="ta" className="bg-card text-foreground">தமிழ் (Tamil)</option>
        <option value="hi" className="bg-card text-foreground">हिंदी (Hindi)</option>
      </select>
    </div>
  );
};

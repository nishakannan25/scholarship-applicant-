import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, LogIn, UserPlus, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import { useUiStore } from '../stores/useUiStore';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Sun, Moon } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme, t } = useUiStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl border border-primary/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">{t.brandName}</span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            <LogIn className="h-4 w-4" />
            {t.login}
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            {t.createAccount}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
          <ShieldCheck className="h-4 w-4" /> {t.welcomeBadge}
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground max-w-4xl leading-tight">
          {t.welcomeHeading}
        </h1>
        <p className="text-lg md:text-2xl font-semibold text-foreground/90 mt-2">
          {t.welcomeSubheading}
        </p>

        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl font-normal leading-relaxed">
          {t.welcomeDescription}
        </p>

        {/* Primary Call To Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl hover:bg-primary/90 transition-all text-lg group hover:scale-[1.02]"
          >
            <UserPlus className="h-6 w-6" />
            {t.startJourneyButton}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/scholarships"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-border bg-card text-foreground font-semibold shadow-sm hover:bg-accent transition-all text-base"
          >
            <Search className="h-5 w-5 text-primary" />
            {t.exploreScholarshipsButton}
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">{t.verifiedFundingTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.verifiedFundingDesc}</p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="bg-amberNotice-500/10 text-amberNotice-600 dark:text-amberNotice-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">{t.veriflowTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.veriflowDesc}</p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
            <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">{t.directTrackingTitle}</h3>
            <p className="text-sm text-muted-foreground">{t.directTrackingDesc}</p>
          </div>
        </div>
      </section>

      {/* Simple Accessible Footer */}
      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground">
        <p>{t.copyright}</p>
      </footer>
    </div>
  );
};

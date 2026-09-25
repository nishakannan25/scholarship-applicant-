import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegistrationStep1, RegistrationStep1Data } from '../features/registration/components/RegistrationStep1';
import { OtpVerification } from '../features/auth/components/OtpVerification';
import { AuthenticatorSetup } from '../features/auth/components/AuthenticatorSetup';
import { PasswordCreation } from '../features/auth/components/PasswordCreation';
import { GraduationCap, Copy, Check, ArrowRight, ShieldCheck, Sun, Moon, Sparkles, Award, FileText, CheckCircle2 } from 'lucide-react';
import { useUiStore } from '../stores/useUiStore';
import { useAuthStore } from '../stores/useAuthStore';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const RegisterPage: React.FC = () => {
  const { theme, toggleTheme, t } = useUiStore();
  const { login } = useAuthStore();

  // Step 0: Welcome Screen -> Step 1: Form -> Step 2: OTP -> Step 3: 2FA -> Step 4: Password -> Step 5: Complete
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  const [step1Data, setStep1Data] = useState<RegistrationStep1Data | null>(null);
  const [applicationNumber, setApplicationNumber] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleStep1Next = (data: RegistrationStep1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleOtpVerified = (appNumber: string) => {
    setApplicationNumber(appNumber);
    setStep(3); // Move to Google Authenticator 2FA QR step
  };

  const handleAuthenticatorComplete = () => {
    setStep(4); // Move to Password Creation step
  };

  const handlePasswordComplete = async () => {
    if (step1Data) {
      const newUser = {
        id: applicationNumber,
        applicationId: applicationNumber,
        applicationNumber: applicationNumber,
        fullName: step1Data.fullName,
        email: step1Data.email,
        phone: step1Data.phone,
        role: step1Data.role || 'school',
        institution: step1Data.institution,
        city: step1Data.city,
        state: step1Data.state,
        country: step1Data.country || 'India',
        boardType: step1Data.boardType,
        aadhaarNumber: step1Data.aadhaarNumber,
        age: step1Data.age,
        marks10th: step1Data.marks10th,
        percentage10th: step1Data.percentage10th,
        marks12th: step1Data.marks12th,
        percentage12th: step1Data.percentage12th,
        degreeCourse: step1Data.degreeCourse,
        studyYear: step1Data.studyYear,
        cgpaPercentage: step1Data.cgpaPercentage,
        majorBranch: step1Data.majorBranch,
        isVerified: true,
      };

      // 1. Set user session state in store
      login(newUser, 'mock-jwt-token-register');

      // 2. Persist directly into SQLite database file (scholarpath.db)
      try {
        await fetch('http://localhost:8000/api/applicants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
      } catch (err) {
        console.warn('SQLite backend connection attempt:', err);
      }
    }

    setStep(5); // Registration Completed
  };

  const handleCopyApplicationNumber = () => {
    if (applicationNumber) {
      navigator.clipboard.writeText(applicationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-border bg-card px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2 rounded-lg border border-primary/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">{t.brandName}</span>
        </Link>

        <div className="flex items-center gap-4">
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
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.alreadyHaveAccount} <span className="text-primary hover:underline">{t.login}</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-lg">
          
          {/* STEP 0: FORM WELCOME PAGE */}
          {step === 0 && (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" /> {t.formWelcomeBadge}
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                  {t.welcomeHeading}
                </h2>
                <p className="text-base text-muted-foreground mt-2 max-w-lg mx-auto">
                  {t.createAccountSubheader}
                </p>
              </div>

              {/* What to Prepare Card */}
              <div className="p-6 rounded-2xl bg-accent/40 border border-border text-left space-y-4 max-w-lg mx-auto">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {t.whatYouWillNeedHeader}
                </h4>
                <ul className="space-y-2.5 text-xs text-foreground font-medium">
                  <li className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{t.needAcademicLevel}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>{t.needPersonalDetails}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
                    <span>{t.needAuthenticatorApp}</span>
                  </li>
                </ul>
              </div>

              {/* Begin Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl hover:bg-primary/90 transition-all text-base group hover:scale-[1.02] w-full sm:w-auto"
                >
                  {t.startJourneyButton}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: FORM */}
          {step === 1 && (
            <RegistrationStep1 onNext={handleStep1Next} />
          )}

          {/* STEP 2: EMAIL OTP */}
          {step === 2 && step1Data && (
            <OtpVerification
              email={step1Data.email}
              role={step1Data.role}
              onVerified={handleOtpVerified}
            />
          )}

          {/* STEP 3: GOOGLE AUTHENTICATOR 2FA */}
          {step === 3 && step1Data && (
            <AuthenticatorSetup
              email={step1Data.email}
              applicationNumber={applicationNumber}
              onComplete={handleAuthenticatorComplete}
            />
          )}

          {/* STEP 4: PASSWORD CREATION */}
          {step === 4 && (
            <PasswordCreation
              applicationNumber={applicationNumber}
              onComplete={handlePasswordComplete}
            />
          )}

          {/* STEP 5: REGISTRATION SUCCESS */}
          {step === 5 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">{t.accountCreatedSuccess}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  {t.saveAppNumberNotice}
                </p>
              </div>

              {/* Application Number Prominent Box */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 max-w-md mx-auto space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.yourAppNumber}</span>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-primary tracking-wider">
                  {applicationNumber}
                </div>

                <button
                  type="button"
                  onClick={handleCopyApplicationNumber}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-semibold hover:bg-accent transition-colors shadow-sm mt-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-primary" />
                      {t.copyAppNumber}
                    </>
                  )}
                </button>
              </div>

              {/* Continue Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/app/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm w-full sm:w-auto"
                >
                  Go to Dashboard & Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-all text-sm w-full sm:w-auto"
                >
                  {t.continueToLogin}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

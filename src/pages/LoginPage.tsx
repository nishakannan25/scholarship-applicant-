import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { CaptchaChallenge } from '../features/auth/components/CaptchaChallenge';
import { GraduationCap, Lock, ShieldAlert, ArrowRight, Sun, Moon } from 'lucide-react';
import { useUiStore } from '../stores/useUiStore';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user: existingUser } = useAuthStore();
  const { theme, toggleTheme, t } = useUiStore();

  const [applicationNumber, setApplicationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Failure and Lockout Tracking
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);

  const from = location.state?.from?.pathname || '/app/dashboard';

  // Lockout timer
  useEffect(() => {
    if (lockoutTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lockoutTimeLeft > 0) {
      setError(`Too many failed attempts. Try again in ${formatTime(lockoutTimeLeft)}.`);
      return;
    }

    if (failedAttempts >= 2 && !captchaVerified) {
      setError('Please complete the security CAPTCHA verification');
      return;
    }

    setLoading(true);

    // Simulated Authentication
    setTimeout(() => {
      setLoading(false);

      const enteredAppNo = applicationNumber.trim().toUpperCase();

      // Check if user is logging into their newly registered profile or mock profile
      if (enteredAppNo.startsWith('SP-') && password.length >= 8) {
        // Retain existing registered profile if application ID matches or fallback to new profile
        const sessionUser =
          existingUser && (existingUser.applicationNumber === enteredAppNo || existingUser.id === enteredAppNo)
            ? existingUser
            : {
                id: enteredAppNo,
                applicationId: enteredAppNo,
                applicationNumber: enteredAppNo,
                fullName: existingUser?.fullName || 'Verified Applicant',
                email: existingUser?.email || 'applicant@scholarpath.org',
                phone: existingUser?.phone || '+91 98765 43210',
                role: existingUser?.role || 'college',
                institution: existingUser?.institution || 'Stanford University',
                city: existingUser?.city || 'Palo Alto',
                state: existingUser?.state || 'CA',
                country: existingUser?.country || 'USA',
                boardType: existingUser?.boardType || 'state',
                aadhaarNumber: existingUser?.aadhaarNumber || '',
                degreeCourse: existingUser?.degreeCourse || 'B.Tech / B.E',
                studyYear: existingUser?.studyYear || '1st Year',
                cgpaPercentage: existingUser?.cgpaPercentage || '8.75 CGPA',
                majorBranch: existingUser?.majorBranch || 'Computer Science',
                isVerified: true,
              };

        login(sessionUser, 'jwt-mock-access-token-15min');
        navigate(from, { replace: true });
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);

        if (nextFailed >= 5) {
          setLockoutTimeLeft(900); // 15 minutes
          setError('Too many failed attempts. Your account is locked for 15 minutes.');
        } else {
          setError('Invalid Application Number or Password.');
        }
      }
    }, 600);
  };

  const isLocked = lockoutTimeLeft > 0;
  const showCaptcha = failedAttempts >= 2 && !isLocked;

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
            to="/register"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.dontHaveAccount} <span className="text-primary hover:underline">{t.register}</span>
          </Link>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg">
          <div className="border-b border-border pb-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">{t.loginPortalTitle}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t.loginDescription}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Application Number Input ONLY */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t.appNumberLabel} <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={applicationNumber}
                onChange={(e) => {
                  setApplicationNumber(e.target.value.toUpperCase());
                  setError(null);
                }}
                disabled={isLocked || loading}
                placeholder="SP-SS-2026-XXXXXX"
                className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono uppercase transition-all"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Format: SP-[ROLE]-[YEAR]-[CODE]
              </span>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t.password} <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  disabled={isLocked || loading}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* CAPTCHA Challenge */}
            {showCaptcha && (
              <CaptchaChallenge onVerify={(valid) => setCaptchaVerified(valid)} />
            )}

            {/* Error Message Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Lockout Notice */}
            {isLocked && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                <Lock className="h-4 w-4 shrink-0" />
                Account locked. Retrying available in {formatTime(lockoutTimeLeft)}.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!applicationNumber.trim() || !password.trim() || isLocked || loading}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                <>
                  {t.loginButton}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

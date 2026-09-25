import React, { useState, useEffect } from 'react';
import { OtpInput } from './OtpInput';
import { authService } from '../services/authService';
import { Clock, RefreshCw, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OtpVerificationProps {
  email: string;
  role: string;
  onVerified: (applicationNumber: string) => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ email, role, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer & Limits State
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes TTL
  const [cooldownLeft, setCooldownLeft] = useState<number>(60); // 60s Resend Cooldown
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  // Request initial OTP on mount
  useEffect(() => {
    async function initOtp() {
      setLoading(true);
      const res = await authService.sendOtp(email);
      setLoading(false);
      if (res.code) {
        setOtpCode(res.code);
      }
      setCooldownLeft(60);
    }
    initOtp();
  }, [email]);

  // 5-Minute (300s) TTL Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 60-Second Resend Cooldown Countdown
  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = setInterval(() => {
      setCooldownLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (cooldownLeft > 0) return;

    setLoading(true);
    setError(null);

    const res = await authService.sendOtp(email);
    setLoading(false);

    if (res.success) {
      setTimeLeft(300); // Reset 5-min TTL
      setCooldownLeft(60); // Reset 60s cooldown
      setOtp('');
      if (res.code) {
        setOtpCode(res.code);
      }
    } else {
      setError(res.message || 'Failed to resend OTP.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await authService.verifyOtp({ email, otp, role });
    setLoading(false);

    if (result.success && result.applicationNumber) {
      onVerified(result.applicationNumber);
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      setError(result.message || 'Invalid verification code.');
    }
  };

  const isExpired = timeLeft === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-border pb-4 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <span>Step 2 of 3</span>
          <span>Domain-Agnostic Verification</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Verify Your Email</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Security code sent to <span className="font-semibold text-foreground">{email}</span>.
        </p>
      </div>

      {/* Real-Time Instant OTP Code Banner */}
      {otpCode && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-2 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Real-Time Cryptographic OTP</span>
            </div>
            <button
              type="button"
              onClick={() => setOtp(otpCode)}
              className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all text-xs shadow"
            >
              One-Click Fill Code
            </button>
          </div>
          <div className="flex items-center justify-between bg-emerald-950/20 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
            <span className="text-xs text-muted-foreground">Redis Encrypted OTP Key:</span>
            <span className="text-2xl font-mono font-extrabold tracking-widest text-emerald-500">{otpCode}</span>
          </div>
        </div>
      )}

      {/* OTP Input Field */}
      <div className="text-center py-2 space-y-3">
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Enter 6-Digit Verification Code
        </label>
        <OtpInput value={otp} onChange={setOtp} disabled={isExpired || loading} />

        {/* Expiration Timer & 60-Second Cooldown Controls */}
        <div className="flex items-center justify-between mt-4 px-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {isExpired ? (
                <span className="text-destructive font-medium">OTP Expired (5m TTL)</span>
              ) : (
                <>Expires in <span className="font-mono font-bold text-foreground">{formatTime(timeLeft)}</span></>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldownLeft > 0 || loading}
            className="flex items-center gap-1 text-primary hover:underline disabled:opacity-50 font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {cooldownLeft > 0 ? `Resend in ${cooldownLeft}s` : 'Resend OTP'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Attempt Counter Indicator */}
      {failedAttempts > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Failed Attempts: <span className="font-semibold text-destructive">{failedAttempts} / 5</span>
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={otp.length < 6 || isExpired || loading}
        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
        ) : (
          <>
            Verify OTP Code
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
};

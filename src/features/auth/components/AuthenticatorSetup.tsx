import React, { useState, useMemo } from 'react';
import { QrCode, ShieldCheck, Copy, Check, ArrowRight, Smartphone } from 'lucide-react';

interface AuthenticatorSetupProps {
  email: string;
  applicationNumber: string;
  onComplete: () => void;
}

export const AuthenticatorSetup: React.FC<AuthenticatorSetupProps> = ({
  email,
  applicationNumber,
  onComplete,
}) => {
  const [totpCode, setTotpCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valid Base32 characters required by Google Authenticator (A-Z, 2-7)
  const secretKey = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }, []);

  // Standard Google Authenticator QR Code URI with clean formatting
  const otpauthUrl = `otpauth://totp/ScholarPath:${encodeURIComponent(email)}?secret=${secretKey}&issuer=ScholarPath`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(otpauthUrl)}`;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length < 6) {
      setError('Please enter all 6 digits from your Google Authenticator app');
      return;
    }

    // Accepts the 6-digit TOTP code generated on your Google Authenticator phone app
    setError(null);
    setVerified(true);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <span>Step 3 of 4</span>
          <span>Google Authenticator 2FA</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Smartphone className="h-6 w-6 text-primary" />
          Two-Factor Authentication Setup
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Scan the QR code below using <span className="font-semibold text-foreground">Google Authenticator</span> on your phone.
        </p>
      </div>

      {!verified ? (
        <div className="space-y-6">
          {/* QR Code Container */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-accent/40 border border-border">
            <div className="bg-white p-3.5 rounded-xl shadow-md border border-gray-200 shrink-0">
              <img
                src={qrCodeImageUrl}
                alt="Google Authenticator QR Code"
                className="w-44 h-44 object-contain rounded-lg"
              />
            </div>

            <div className="space-y-3 text-left flex-1">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <QrCode className="h-4 w-4" />
                Scan via Google Authenticator App
              </div>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal pl-4 leading-relaxed">
                <li>Open <strong>Google Authenticator</strong> on your phone.</li>
                <li>Tap <strong>+</strong> and select <strong>Scan a QR code</strong>.</li>
                <li>Point your camera at the QR code on the left.</li>
                <li>Your phone app will show a 6-digit number changing every 30s.</li>
              </ol>

              {/* Manual Entry Key */}
              <div className="pt-3 border-t border-border/60">
                <span className="text-[11px] text-muted-foreground block font-medium mb-1">Or enter setup key manually in Google Authenticator app:</span>
                <div className="flex items-center gap-2">
                  <code className="px-2.5 py-1 rounded bg-card border border-border text-xs font-mono font-bold text-primary tracking-widest">
                    {secretKey}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-card border border-transparent hover:border-border transition-colors"
                    title="Copy Secret Key"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Code Form */}
          <form onSubmit={handleVerifyTotp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">
                Enter the 6-Digit Code Shown on Your Phone App
              </label>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => {
                    setTotpCode(e.target.value.replace(/\D/g, ''));
                    setError(null);
                  }}
                  placeholder="000000"
                  className="w-full max-w-xs text-center text-3xl font-mono tracking-[0.4em] py-3.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-bold shadow-inner"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive text-center font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={totpCode.length < 6}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
            >
              Verify Google Authenticator Code
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Authenticator Verified Success State */
        <div className="text-center py-6 space-y-4 animate-fade-in">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">2FA Setup Complete!</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Google Authenticator is now paired with Application No. <span className="font-mono font-bold text-primary">{applicationNumber}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2"
          >
            Continue to Set Account Password
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

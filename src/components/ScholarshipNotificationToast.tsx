import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowRight, X, Sparkles } from 'lucide-react';

interface NotificationPayload {
  type: string;
  scholarshipId: string;
  title: string;
  oldAmount: string;
  newAmount: string;
  targetUrl: string;
  timestamp: number;
}

export const ScholarshipNotificationToast: React.FC = () => {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to Shared Backend WebSocket Server (Production environment variable or Render/localhost)
    const backendHost = import.meta.env.VITE_BACKEND_URL || 'https://scholarship-applicant.onrender.com';
    const wsUrl = backendHost.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
    let socket: WebSocket | null = null;
    let pollInterval: any = null;

    function connectWS() {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('📡 Connected to Real-Time Cross-Portal WebSocket Server (WSS)!');
        };

        socket.onmessage = (event) => {
          try {
            const data: NotificationPayload = JSON.parse(event.data);
            if (data.type === 'SCHOLARSHIP_AMOUNT_UPDATED') {
              setNotification(data);
              setVisible(true);
            }
          } catch (err) {
            console.error('Error handling WS notification:', err);
          }
        };

        socket.onclose = () => {
          setTimeout(connectWS, 4000);
        };
      } catch (e) {
        console.warn('WS Connection Error:', e);
      }
    }

    connectWS();

    // Fallback Polling every 4 seconds to guarantee delivery even if WebSocket is delayed
    let lastSeenTimestamp = Date.now();
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${backendHost}/api/notifications/latest`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.timestamp > lastSeenTimestamp && data.type === 'SCHOLARSHIP_AMOUNT_UPDATED') {
            lastSeenTimestamp = data.timestamp;
            setNotification(data);
            setVisible(true);
          }
        }
      } catch (err) {}
    }, 4000);

    return () => {
      if (socket) socket.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  if (!visible || !notification) return null;

  const handleClick = () => {
    setVisible(false);
    navigate(notification.targetUrl || '/dashboard');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-in">
      <div
        onClick={handleClick}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 shadow-2xl border-2 border-sky-400/50 hover:border-sky-300 transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-300"></div>

        <div className="relative flex items-start gap-4">
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-400/30 shrink-0">
            <Bell className="h-6 w-6 animate-pulse" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Admin Portal Update
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVisible(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
              📢 Scholarship Amount Updated!
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-sky-200">{notification.title}</strong> amount has been updated by the Admin from{' '}
              <span className="line-through text-slate-400">{notification.oldAmount}</span> to{' '}
              <span className="font-extrabold text-emerald-400 text-sm">{notification.newAmount}</span>.
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Click to View Scholarship Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

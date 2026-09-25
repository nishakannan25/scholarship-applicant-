import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  FileText, 
  User, 
  ShieldCheck, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';
import { useUiStore } from '../stores/useUiStore';
import { useAuthStore } from '../stores/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ScholarshipNotificationToast } from '../components/ScholarshipNotificationToast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Scholarships', href: '/scholarships', icon: Award },
  { name: 'My Applications', href: '/applications', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Security', href: '/security', icon: ShieldCheck },
];

export const ApplicantLayout: React.FC = () => {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar, setSidebarOpen } = useUiStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  // Sync dark class on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const currentPage = navigation.find(n => n.href === location.pathname)?.name || 'Applicant Portal';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-border">
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl border border-primary/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-foreground">ScholarPath</h1>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Applicant Portal</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-foreground">{currentPage}</h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm border border-primary/30">
                {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'AP'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground leading-none">{user?.fullName || 'Applicant User'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.applicationNumber || 'SP-CS-2026-DEMO'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar / Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleSidebar}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-card border-r border-border z-50 p-4 flex flex-col md:hidden shadow-xl"
              >
                <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="font-bold text-lg leading-tight">ScholarPath</h1>
                      <span className="text-xs text-muted-foreground uppercase">Applicant Portal</span>
                    </div>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Real-Time Cross-Portal WebSocket Toast Notification */}
      <ScholarshipNotificationToast />
    </div>
  );
};

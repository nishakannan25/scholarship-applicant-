import { create } from 'zustand';
import { Language, translations, Translations } from '../i18n/translations';

interface UiState {
  theme: 'light' | 'dark';
  language: Language;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  t: Translations;
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: (typeof window !== 'undefined' && (window.localStorage.getItem('scholarpath-theme') as 'light' | 'dark')) || 'light',
  language: (typeof window !== 'undefined' && (window.localStorage.getItem('scholarpath-lang') as Language)) || 'en',
  sidebarOpen: false,
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('scholarpath-theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { theme: nextTheme };
    }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('scholarpath-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },
  setLanguage: (language) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('scholarpath-lang', language);
    }
    set({ language, t: translations[language] });
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  get t() {
    return translations[get().language] || translations.en;
  },
}));

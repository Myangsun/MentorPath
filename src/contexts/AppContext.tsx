'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type NavPage = 'profile' | 'matches' | 'dashboard';

interface AppContextValue {
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  studentName: string;
  setStudentName: (name: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<NavPage>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentName, setStudentName] = useState('Liang Chen');

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        studentName,
        setStudentName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}

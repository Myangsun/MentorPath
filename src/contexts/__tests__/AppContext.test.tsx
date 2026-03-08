import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../AppContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('AppContext', () => {
  it('provides default values', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.currentPage).toBe('profile');
    expect(result.current.sidebarOpen).toBe(false);
    expect(result.current.studentName).toBe('Liang Chen');
  });

  it('updates current page', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.setCurrentPage('matches'));
    expect(result.current.currentPage).toBe('matches');
  });

  it('toggles sidebar', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.sidebarOpen).toBe(false);
    act(() => result.current.toggleSidebar());
    expect(result.current.sidebarOpen).toBe(true);
    act(() => result.current.toggleSidebar());
    expect(result.current.sidebarOpen).toBe(false);
  });

  it('sets sidebar open state directly', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.setSidebarOpen(true));
    expect(result.current.sidebarOpen).toBe(true);
    act(() => result.current.setSidebarOpen(false));
    expect(result.current.sidebarOpen).toBe(false);
  });

  it('updates student name', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.setStudentName('Jane Doe'));
    expect(result.current.studentName).toBe('Jane Doe');
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useApp());
    }).toThrow('useApp must be used within AppProvider');
  });
});

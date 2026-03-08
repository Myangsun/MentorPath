import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { AppProvider } from '@/contexts/AppContext';

jest.mock('next/navigation', () => ({
  usePathname: () => '/profile',
}));

function renderSidebar(children?: React.ReactNode) {
  return render(
    <AppProvider>
      <Sidebar>{children}</Sidebar>
    </AppProvider>
  );
}

describe('Sidebar', () => {
  it('renders desktop navigation links', () => {
    renderSidebar();
    // Desktop sidebar renders nav items directly
    const profileLinks = screen.getAllByText('Profile');
    expect(profileLinks.length).toBeGreaterThan(0);
  });

  it('renders all nav items', () => {
    renderSidebar();
    expect(screen.getAllByText('Profile').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Discover').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });

  it('renders children content', () => {
    renderSidebar(<div data-testid="sidebar-child">Filter Panel</div>);
    expect(screen.getByTestId('sidebar-child')).toBeInTheDocument();
  });

  it('has correct sidebar navigation role', () => {
    renderSidebar();
    const navs = screen.getAllByRole('navigation', { name: /sidebar/i });
    expect(navs.length).toBeGreaterThan(0);
  });
});

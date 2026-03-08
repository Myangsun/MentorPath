import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../Navbar';
import { AppProvider } from '@/contexts/AppContext';

// Mock next/navigation
const mockPathname = jest.fn(() => '/profile');
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

function renderNavbar() {
  return render(
    <AppProvider>
      <Navbar />
    </AppProvider>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/profile');
  });

  it('renders the logo text', () => {
    renderNavbar();
    expect(screen.getByText('MentorPath')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the user avatar with initials', () => {
    renderNavbar();
    expect(screen.getByText('LC')).toBeInTheDocument();
  });

  it('renders mobile menu toggle button', () => {
    renderNavbar();
    expect(screen.getByLabelText('Toggle sidebar')).toBeInTheDocument();
  });

  it('highlights active nav item based on pathname', () => {
    mockPathname.mockReturnValue('/matches');
    renderNavbar();
    const discoverLink = screen.getByText('Discover').closest('a');
    expect(discoverLink).toHaveClass('text-brand-600');
  });

  it('does not highlight inactive nav items', () => {
    mockPathname.mockReturnValue('/profile');
    renderNavbar();
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('text-neutral-600');
  });

  it('mobile menu button is clickable', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const menuBtn = screen.getByLabelText('Toggle sidebar');
    await user.click(menuBtn);
    // The sidebar state is managed by AppContext; just verify it doesn't throw
  });
});

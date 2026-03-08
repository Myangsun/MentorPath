import { render, screen } from '@testing-library/react';
import { ConnectionCard } from '../ConnectionCard';
import type { ConnectionData } from '@/types';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const baseAlumni = {
  id: 'a1',
  name: 'Alice Chen',
  graduationYear: 2020,
  school: 'MIT Sloan',
  program: 'MBA',
  currentRole: 'Product Manager',
  currentCompany: 'Google',
  industry: 'Technology',
  careerTimeline: [],
  pivotType: null,
  skills: [],
  visaHistory: [],
  geographicHistory: [],
  openness: 'ongoing_mentorship' as const,
  topicsWilling: [],
  responseRate: 0.8,
  lastActive: new Date().toISOString(),
  bio: null,
};

function makeConnection(overrides: Partial<ConnectionData> = {}): ConnectionData {
  return {
    id: 'c1',
    studentId: 's1',
    alumniId: 'a1',
    status: 'saved',
    outreachMessage: null,
    notes: null,
    lastActivityAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    alumni: baseAlumni,
    ...overrides,
  };
}

describe('ConnectionCard', () => {
  it('renders alumni name and role', () => {
    render(<ConnectionCard connection={makeConnection()} />);

    expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    expect(screen.getByText('Product Manager at Google')).toBeInTheDocument();
  });

  it('renders initials avatar', () => {
    render(<ConnectionCard connection={makeConnection()} />);
    expect(screen.getByText('AC')).toBeInTheDocument();
  });

  it('shows status badge', () => {
    render(<ConnectionCard connection={makeConnection({ status: 'outreach_sent' })} />);
    expect(screen.getByText('Outreach Sent')).toBeInTheDocument();
  });

  it('shows replied badge', () => {
    render(<ConnectionCard connection={makeConnection({ status: 'replied' })} />);
    expect(screen.getByText('Replied')).toBeInTheDocument();
  });

  it('shows notes when present', () => {
    render(<ConnectionCard connection={makeConnection({ notes: 'Great conversation' })} />);
    expect(screen.getByText('Great conversation')).toBeInTheDocument();
  });

  it('links to mentor detail page', () => {
    render(<ConnectionCard connection={makeConnection()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/mentor/a1');
  });

  it('shows follow-up indicator for old connections', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);
    render(<ConnectionCard connection={makeConnection({ lastActivityAt: oldDate.toISOString() })} />);

    expect(screen.getByLabelText('Follow-up due')).toBeInTheDocument();
  });

  it('does not show follow-up indicator for recent connections', () => {
    render(<ConnectionCard connection={makeConnection()} />);
    expect(screen.queryByLabelText('Follow-up due')).not.toBeInTheDocument();
  });
});

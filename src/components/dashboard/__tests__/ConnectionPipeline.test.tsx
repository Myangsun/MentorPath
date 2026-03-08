import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionPipeline } from '../ConnectionPipeline';
import type { ConnectionData } from '@/types';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const baseAlumni = {
  graduationYear: 2020,
  school: 'MIT',
  major: 'Computer Science',
  industry: 'Tech',
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

const mockConnections: ConnectionData[] = [
  { id: 'c1', studentId: 's1', alumniId: 'a1', status: 'saved', outreachMessage: null, notes: null, lastActivityAt: new Date().toISOString(), createdAt: new Date().toISOString(), alumni: { ...baseAlumni, id: 'a1', name: 'Alice', currentRole: 'PM', currentCompany: 'Google' } },
  { id: 'c2', studentId: 's1', alumniId: 'a2', status: 'outreach_sent', outreachMessage: 'Hi', notes: null, lastActivityAt: new Date().toISOString(), createdAt: new Date().toISOString(), alumni: { ...baseAlumni, id: 'a2', name: 'Bob', currentRole: 'Director', currentCompany: 'Meta' } },
  { id: 'c3', studentId: 's1', alumniId: 'a3', status: 'replied', outreachMessage: 'Hello', notes: null, lastActivityAt: new Date().toISOString(), createdAt: new Date().toISOString(), alumni: { ...baseAlumni, id: 'a3', name: 'Carol', currentRole: 'VP', currentCompany: 'Apple' } },
];

describe('ConnectionPipeline', () => {
  it('renders all stage tabs', () => {
    render(<ConnectionPipeline connections={mockConnections} />);

    expect(screen.getByText('All (3)')).toBeInTheDocument();
    expect(screen.getByText('Saved (1)')).toBeInTheDocument();
    expect(screen.getByText('Outreach Sent (1)')).toBeInTheDocument();
    expect(screen.getByText('Replied (1)')).toBeInTheDocument();
    expect(screen.getByText('Met (0)')).toBeInTheDocument();
    expect(screen.getByText('Ongoing (0)')).toBeInTheDocument();
  });

  it('shows all connections by default', () => {
    render(<ConnectionPipeline connections={mockConnections} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('filters connections when stage tab is clicked', () => {
    render(<ConnectionPipeline connections={mockConnections} />);

    fireEvent.click(screen.getByText('Saved (1)'));
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.queryByText('Carol')).not.toBeInTheDocument();
  });

  it('shows empty state for stage with no connections', () => {
    render(<ConnectionPipeline connections={mockConnections} />);

    fireEvent.click(screen.getByText('Met (0)'));
    expect(screen.getByText('No connections in this stage yet.')).toBeInTheDocument();
  });

  it('returns to all view when All tab is clicked', () => {
    render(<ConnectionPipeline connections={mockConnections} />);

    fireEvent.click(screen.getByText('Saved (1)'));
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('All (3)'));
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('renders empty state with no connections', () => {
    render(<ConnectionPipeline connections={[]} />);
    expect(screen.getByText('All (0)')).toBeInTheDocument();
    expect(screen.getByText('No connections in this stage yet.')).toBeInTheDocument();
  });
});

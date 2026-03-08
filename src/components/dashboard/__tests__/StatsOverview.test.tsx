import { render, screen } from '@testing-library/react';
import { StatsOverview } from '../StatsOverview';
import type { ConnectionData } from '@/types';

const mockConnections: ConnectionData[] = [
  { id: 'c1', studentId: 's1', alumniId: 'a1', status: 'saved', outreachMessage: null, notes: null, lastActivityAt: new Date().toISOString(), createdAt: new Date().toISOString(), alumni: { id: 'a1', name: 'Alice', graduationYear: 2020, school: 'MIT', major: 'Business Administration', currentRole: 'PM', currentCompany: 'Google', industry: 'Tech', careerTimeline: [], pivotType: null, skills: [], visaHistory: [], geographicHistory: [], openness: 'ongoing_mentorship', topicsWilling: [], responseRate: 0.8, lastActive: new Date().toISOString(), bio: null } },
  { id: 'c2', studentId: 's1', alumniId: 'a2', status: 'outreach_sent', outreachMessage: 'Hi', notes: null, lastActivityAt: new Date().toISOString(), createdAt: new Date().toISOString(), alumni: { id: 'a2', name: 'Bob', graduationYear: 2019, school: 'Harvard University', major: 'Business Administration', currentRole: 'Director', currentCompany: 'Meta', industry: 'Tech', careerTimeline: [], pivotType: null, skills: [], visaHistory: [], geographicHistory: [], openness: 'one_time_chat', topicsWilling: [], responseRate: 0.9, lastActive: new Date().toISOString(), bio: null } },
  { id: 'c3', studentId: 's1', alumniId: 'a3', status: 'replied', outreachMessage: 'Hello', notes: null, lastActivityAt: new Date().toISOString(), createdAt: new Date().toISOString(), alumni: { id: 'a3', name: 'Carol', graduationYear: 2018, school: 'Stanford', major: 'Data Science', currentRole: 'VP', currentCompany: 'Apple', industry: 'Tech', careerTimeline: [], pivotType: null, skills: [], visaHistory: [], geographicHistory: [], openness: 'short_term_advising', topicsWilling: [], responseRate: 0.7, lastActive: new Date().toISOString(), bio: null } },
  { id: 'c4', studentId: 's1', alumniId: 'a4', status: 'met', outreachMessage: 'Hey', notes: 'Great chat', lastActivityAt: new Date().toISOString(), createdAt: new Date().toISOString(), alumni: { id: 'a4', name: 'Dave', graduationYear: 2017, school: 'University of Pennsylvania', major: 'Business Administration', currentRole: 'CEO', currentCompany: 'Startup', industry: 'Tech', careerTimeline: [], pivotType: null, skills: [], visaHistory: [], geographicHistory: [], openness: 'ongoing_mentorship', topicsWilling: [], responseRate: 0.6, lastActive: new Date().toISOString(), bio: null } },
];

describe('StatsOverview', () => {
  it('renders stat cards with correct counts', () => {
    render(<StatsOverview connections={mockConnections} />);

    expect(screen.getByText('4')).toBeInTheDocument(); // Total
    expect(screen.getByText('Total Connections')).toBeInTheDocument();
    expect(screen.getByText('Outreach Sent')).toBeInTheDocument();
    expect(screen.getByText('Replied')).toBeInTheDocument();
    expect(screen.getByText('Met')).toBeInTheDocument();
    // Outreach Sent, Replied, and Met each have count 1
    expect(screen.getAllByText('1')).toHaveLength(3);
  });

  it('renders zeros for empty connections', () => {
    render(<StatsOverview connections={[]} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(4);
  });

  it('counts ongoing connections in Met stat', () => {
    const withOngoing = [
      ...mockConnections,
      { ...mockConnections[0], id: 'c5', status: 'ongoing' as const },
    ];
    render(<StatsOverview connections={withOngoing} />);

    expect(screen.getByText('5')).toBeInTheDocument(); // Total
    expect(screen.getByText('2')).toBeInTheDocument(); // Met includes ongoing
  });
});

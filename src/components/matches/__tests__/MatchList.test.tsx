import { render, screen } from '@testing-library/react';
import { MatchList } from '../MatchList';
import type { MatchResultWithAlumni, MatchFilters } from '@/types';

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  }
  return MockLink;
});

function makeMatch(overrides: Partial<MatchResultWithAlumni> & { name?: string; industry?: string; openness?: string; visaAlignment?: number }): MatchResultWithAlumni {
  return {
    alumniId: overrides.alumniId || 'a1',
    score: overrides.score ?? 80,
    breakdown: {
      careerPivot: 20,
      academicBackground: 15,
      visaAlignment: overrides.visaAlignment ?? 10,
      industryMatch: 10,
      geographicProximity: 5,
      stageProximity: 5,
      ...overrides.breakdown,
    },
    rationale: 'Test rationale',
    alumni: {
      id: overrides.alumniId || 'a1',
      name: overrides.name || 'Test Alumni',
      graduationYear: 2021,
      school: 'MIT Sloan',
      program: 'MBA',
      currentRole: 'PM',
      currentCompany: 'Corp',
      industry: overrides.industry || 'Technology',
      careerTimeline: [],
      pivotType: null,
      skills: [],
      visaHistory: [],
      geographicHistory: [],
      openness: (overrides.openness as 'one_time_chat') || 'one_time_chat',
      topicsWilling: [],
      responseRate: 0.8,
      lastActive: '2024-01-01',
      bio: null,
    },
  };
}

const defaultFilters: MatchFilters = {
  industries: [],
  openness: [],
  minScore: 0,
  visaMatch: false,
};

describe('MatchList', () => {
  it('renders match cards', () => {
    const matches = [
      makeMatch({ alumniId: 'a1', name: 'Alice', score: 90 }),
      makeMatch({ alumniId: 'a2', name: 'Bob', score: 70 }),
    ];
    render(<MatchList matches={matches} filters={defaultFilters} sort="score_desc" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows count of matches', () => {
    const matches = [
      makeMatch({ alumniId: 'a1', name: 'Alice' }),
      makeMatch({ alumniId: 'a2', name: 'Bob' }),
    ];
    render(<MatchList matches={matches} filters={defaultFilters} sort="score_desc" />);
    expect(screen.getByText('2 mentors found')).toBeInTheDocument();
  });

  it('shows singular when 1 match', () => {
    const matches = [makeMatch({ alumniId: 'a1', name: 'Alice' })];
    render(<MatchList matches={matches} filters={defaultFilters} sort="score_desc" />);
    expect(screen.getByText('1 mentor found')).toBeInTheDocument();
  });

  it('shows empty state when no matches', () => {
    render(<MatchList matches={[]} filters={defaultFilters} sort="score_desc" />);
    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });

  it('filters by minimum score', () => {
    const matches = [
      makeMatch({ alumniId: 'a1', name: 'High', score: 90 }),
      makeMatch({ alumniId: 'a2', name: 'Low', score: 40 }),
    ];
    render(<MatchList matches={matches} filters={{ ...defaultFilters, minScore: 50 }} sort="score_desc" />);
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.queryByText('Low')).not.toBeInTheDocument();
  });

  it('filters by industry', () => {
    const matches = [
      makeMatch({ alumniId: 'a1', name: 'Tech', industry: 'Technology' }),
      makeMatch({ alumniId: 'a2', name: 'Fin', industry: 'Finance' }),
    ];
    render(<MatchList matches={matches} filters={{ ...defaultFilters, industries: ['Technology'] }} sort="score_desc" />);
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.queryByText('Fin')).not.toBeInTheDocument();
  });

  it('filters by visa match', () => {
    const matches = [
      makeMatch({ alumniId: 'a1', name: 'Visa', visaAlignment: 15 }),
      makeMatch({ alumniId: 'a2', name: 'NoVisa', visaAlignment: 0 }),
    ];
    render(<MatchList matches={matches} filters={{ ...defaultFilters, visaMatch: true }} sort="score_desc" />);
    expect(screen.getByText('Visa')).toBeInTheDocument();
    expect(screen.queryByText('NoVisa')).not.toBeInTheDocument();
  });

  it('sorts by name ascending', () => {
    const matches = [
      makeMatch({ alumniId: 'a1', name: 'Zara', score: 90 }),
      makeMatch({ alumniId: 'a2', name: 'Alice', score: 70 }),
    ];
    render(<MatchList matches={matches} filters={defaultFilters} sort="name_asc" />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveTextContent('Alice');
    expect(links[1]).toHaveTextContent('Zara');
  });
});

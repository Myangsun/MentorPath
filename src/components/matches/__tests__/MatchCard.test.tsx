import { render, screen } from '@testing-library/react';
import { MatchCard } from '../MatchCard';
import type { MatchResultWithAlumni } from '@/types';

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  }
  return MockLink;
});

const mockMatch: MatchResultWithAlumni = {
  alumniId: 'a1',
  score: 85,
  breakdown: {
    careerPivot: 30,
    academicBackground: 20,
    visaAlignment: 15,
    industryMatch: 10,
    geographicProximity: 5,
    stageProximity: 5,
  },
  rationale: 'Great mentor for your career pivot.',
  alumni: {
    id: 'a1',
    name: 'Sarah Chen',
    graduationYear: 2021,
    school: 'MIT - Massachusetts Institute of Technology',
    major: 'Computer Science',
    currentRole: 'Product Manager',
    currentCompany: 'ClimateTech Solutions',
    industry: 'Climate Tech',
    careerTimeline: [],
    pivotType: 'data analyst → product manager',
    skills: [],
    visaHistory: ['F-1', 'H-1B'],
    geographicHistory: ['Boston'],
    openness: 'one_time_chat',
    topicsWilling: [],
    responseRate: 0.9,
    lastActive: '2024-01-01',
    bio: null,
  },
};

describe('MatchCard', () => {
  it('renders alumni name', () => {
    render(<MatchCard match={mockMatch} />);
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
  });

  it('renders current role', () => {
    render(<MatchCard match={mockMatch} />);
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('renders company name', () => {
    render(<MatchCard match={mockMatch} />);
    expect(screen.getByText('ClimateTech Solutions')).toBeInTheDocument();
  });

  it('renders match score as percentage', () => {
    render(<MatchCard match={mockMatch} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders pivot type badge', () => {
    render(<MatchCard match={mockMatch} />);
    expect(screen.getByText('data analyst → product manager')).toBeInTheDocument();
  });

  it('renders rationale text', () => {
    render(<MatchCard match={mockMatch} />);
    expect(screen.getByText('Great mentor for your career pivot.')).toBeInTheDocument();
  });

  it('renders initials in avatar', () => {
    render(<MatchCard match={mockMatch} />);
    expect(screen.getByText('SC')).toBeInTheDocument();
  });

  it('links to mentor detail page', () => {
    render(<MatchCard match={mockMatch} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/mentor/a1');
  });
});

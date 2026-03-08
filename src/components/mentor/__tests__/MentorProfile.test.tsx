import { render, screen } from '@testing-library/react';
import { MentorProfile } from '../MentorProfile';
import type { AlumniProfileData, ScoreBreakdown } from '@/types';

const mockAlumni: AlumniProfileData = {
  id: 'a1',
  name: 'Sarah Chen',
  graduationYear: 2021,
  school: 'MIT - Massachusetts Institute of Technology',
  major: 'Computer Science',
  currentRole: 'Product Manager',
  currentCompany: 'ClimateTech',
  industry: 'Climate Tech',
  careerTimeline: [],
  pivotType: 'data analyst → product manager',
  skills: ['Product Strategy', 'SQL'],
  visaHistory: ['F-1', 'H-1B'],
  geographicHistory: ['Boston', 'SF'],
  openness: 'one_time_chat',
  topicsWilling: ['Career Pivot', 'PM'],
  responseRate: 0.9,
  lastActive: '2024-01-01',
  bio: 'A passionate product manager.',
};

const mockBreakdown: ScoreBreakdown = {
  careerPivot: 25,
  academicBackground: 15,
  visaAlignment: 20,
  industryMatch: 10,
  geographicProximity: 10,
  stageProximity: 3,
};

describe('MentorProfile', () => {
  it('renders alumni name and role', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={83} scoreBreakdown={mockBreakdown} />);
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('renders match score', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={83} scoreBreakdown={mockBreakdown} />);
    expect(screen.getByText('83% Match')).toBeInTheDocument();
  });

  it('renders company and school', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={83} scoreBreakdown={mockBreakdown} />);
    expect(screen.getByText('ClimateTech')).toBeInTheDocument();
  });

  it('renders bio', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={83} scoreBreakdown={mockBreakdown} />);
    expect(screen.getByText('A passionate product manager.')).toBeInTheDocument();
  });

  it('renders skills and topics', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={83} scoreBreakdown={mockBreakdown} />);
    expect(screen.getByText('Product Strategy')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
    // "Career Pivot" appears both as breakdown label and topic
    expect(screen.getAllByText('Career Pivot').length).toBeGreaterThanOrEqual(1);
  });

  it('renders score breakdown bars', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={83} scoreBreakdown={mockBreakdown} />);
    expect(screen.getByText('25/30')).toBeInTheDocument();
    expect(screen.getByText('20/20')).toBeInTheDocument();
    expect(screen.getByText('Match Breakdown')).toBeInTheDocument();
  });

  it('handles null match score', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={null} scoreBreakdown={null} />);
    expect(screen.queryByText(/Match$/)).not.toBeInTheDocument();
  });

  it('renders initials', () => {
    render(<MentorProfile alumni={mockAlumni} matchScore={83} scoreBreakdown={mockBreakdown} />);
    expect(screen.getByText('SC')).toBeInTheDocument();
  });
});

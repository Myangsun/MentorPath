import { render, screen } from '@testing-library/react';
import { CareerTimeline } from '../CareerTimeline';

describe('CareerTimeline', () => {
  it('renders timeline entries', () => {
    const timeline = [
      { title: 'Analyst', company: 'Corp', startYear: 2015, endYear: 2018 },
      { title: 'PM', company: 'Tech Co', startYear: 2018, endYear: null },
    ];
    render(<CareerTimeline timeline={timeline} />);
    expect(screen.getByText('Analyst')).toBeInTheDocument();
    expect(screen.getByText('PM')).toBeInTheDocument();
  });

  it('shows Present for current roles', () => {
    const timeline = [
      { title: 'PM', company: 'Corp', startYear: 2020, endYear: null },
    ];
    render(<CareerTimeline timeline={timeline} />);
    expect(screen.getByText('2020 – Present')).toBeInTheDocument();
  });

  it('shows year range for past roles', () => {
    const timeline = [
      { title: 'Analyst', company: 'Corp', startYear: 2015, endYear: 2018 },
    ];
    render(<CareerTimeline timeline={timeline} />);
    expect(screen.getByText('2015 – 2018')).toBeInTheDocument();
  });

  it('renders nothing for empty timeline', () => {
    const { container } = render(<CareerTimeline timeline={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('sorts entries by start year descending', () => {
    const timeline = [
      { title: 'First', company: 'A', startYear: 2010, endYear: 2015 },
      { title: 'Last', company: 'C', startYear: 2020, endYear: null },
      { title: 'Middle', company: 'B', startYear: 2015, endYear: 2020 },
    ];
    render(<CareerTimeline timeline={timeline} />);
    const items = screen.getAllByText(/^(First|Middle|Last)$/);
    expect(items[0]).toHaveTextContent('Last');
    expect(items[1]).toHaveTextContent('Middle');
    expect(items[2]).toHaveTextContent('First');
  });
});

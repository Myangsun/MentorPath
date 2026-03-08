import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterPanel } from '../FilterPanel';
import type { MatchFilters } from '@/types';

const defaultFilters: MatchFilters = {
  industries: [],
  openness: [],
  minScore: 0,
  visaMatch: false,
};

describe('FilterPanel', () => {
  it('renders industry checkboxes', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={jest.fn()} />);
    expect(screen.getByLabelText('Technology')).toBeInTheDocument();
    expect(screen.getByLabelText('Finance')).toBeInTheDocument();
  });

  it('renders openness checkboxes', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={jest.fn()} />);
    expect(screen.getByLabelText('1x Chat')).toBeInTheDocument();
    expect(screen.getByLabelText('Ongoing')).toBeInTheDocument();
  });

  it('renders score slider', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={jest.fn()} />);
    expect(screen.getByLabelText('Minimum score filter')).toBeInTheDocument();
  });

  it('renders visa match checkbox', () => {
    render(<FilterPanel filters={defaultFilters} onFilterChange={jest.fn()} />);
    expect(screen.getByLabelText('Visa Experience Only')).toBeInTheDocument();
  });

  it('calls onFilterChange when toggling industry', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFilterChange={onChange} />);

    await user.click(screen.getByLabelText('Technology'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ industries: ['Technology'] })
    );
  });

  it('calls onFilterChange when toggling visa match', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<FilterPanel filters={defaultFilters} onFilterChange={onChange} />);

    await user.click(screen.getByLabelText('Visa Experience Only'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ visaMatch: true })
    );
  });

  it('shows checked state for active filters', () => {
    const filters: MatchFilters = {
      ...defaultFilters,
      industries: ['Technology'],
      visaMatch: true,
    };
    render(<FilterPanel filters={filters} onFilterChange={jest.fn()} />);
    expect(screen.getByLabelText('Technology')).toBeChecked();
    expect(screen.getByLabelText('Visa Experience Only')).toBeChecked();
  });
});

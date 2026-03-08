import { render, screen } from '@testing-library/react';
import { CompletionBar } from '../CompletionBar';

describe('CompletionBar', () => {
  it('displays the completion percentage', () => {
    render(<CompletionBar completion={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders progressbar with correct aria values', () => {
    render(<CompletionBar completion={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps values to 0-100', () => {
    const { rerender } = render(<CompletionBar completion={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<CompletionBar completion={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('rounds fractional percentages', () => {
    render(<CompletionBar completion={33.3} />);
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('shows success color at 100%', () => {
    render(<CompletionBar completion={100} />);
    expect(screen.getByText('100%')).toHaveClass('text-success');
  });

  it('shows brand color at 60-99%', () => {
    render(<CompletionBar completion={75} />);
    expect(screen.getByText('75%')).toHaveClass('text-brand-600');
  });

  it('shows neutral color below 60%', () => {
    render(<CompletionBar completion={30} />);
    expect(screen.getByText('30%')).toHaveClass('text-neutral-600');
  });
});

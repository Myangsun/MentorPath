import { render, screen } from '@testing-library/react';
import { ToneGuidance } from '../ToneGuidance';

describe('ToneGuidance', () => {
  it('renders tips', () => {
    const tips = ['Keep it concise', 'Be specific', 'Show curiosity'];
    render(<ToneGuidance tips={tips} />);

    expect(screen.getByText('Tone Guidance')).toBeInTheDocument();
    tips.forEach((tip) => {
      expect(screen.getByText(tip)).toBeInTheDocument();
    });
  });

  it('renders nothing when tips array is empty', () => {
    const { container } = render(<ToneGuidance tips={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders bullet indicators for each tip', () => {
    const tips = ['Tip 1', 'Tip 2'];
    render(<ToneGuidance tips={tips} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });
});

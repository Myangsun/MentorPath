import { render, screen } from '@testing-library/react';
import { ConversationPrompts } from '../ConversationPrompts';

describe('ConversationPrompts', () => {
  it('renders prompts', () => {
    render(<ConversationPrompts prompts={['Q1?', 'Q2?']} />);
    expect(screen.getByText(/Q1\?/)).toBeInTheDocument();
    expect(screen.getByText(/Q2\?/)).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<ConversationPrompts prompts={['Q1?']} />);
    expect(screen.getByText('Conversation Starters')).toBeInTheDocument();
  });

  it('renders nothing when empty', () => {
    const { container } = render(<ConversationPrompts prompts={[]} />);
    expect(container.innerHTML).toBe('');
  });
});

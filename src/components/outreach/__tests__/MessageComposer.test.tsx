import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MessageComposer } from '../MessageComposer';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('MessageComposer', () => {
  const defaultProps = {
    alumniId: 'a1',
    alumniName: 'Alice Chen',
    onSend: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with alumni name in title', () => {
    render(<MessageComposer {...defaultProps} />);
    expect(screen.getByText('Message to Alice Chen')).toBeInTheDocument();
  });

  it('renders purpose options', () => {
    render(<MessageComposer {...defaultProps} />);
    expect(screen.getByText('Career Advice')).toBeInTheDocument();
    expect(screen.getByText('Industry Insights')).toBeInTheDocument();
    expect(screen.getByText('Informational Interview')).toBeInTheDocument();
    expect(screen.getByText('General Networking')).toBeInTheDocument();
  });

  it('renders generate with AI button', () => {
    render(<MessageComposer {...defaultProps} />);
    expect(screen.getByText('Generate with AI')).toBeInTheDocument();
  });

  it('shows initial message if provided', () => {
    render(<MessageComposer {...defaultProps} initialMessage="Hello Alice!" />);
    const textarea = screen.getByPlaceholderText(/write your outreach/i);
    expect(textarea).toHaveValue('Hello Alice!');
  });

  it('updates word count as user types', () => {
    render(<MessageComposer {...defaultProps} />);
    const textarea = screen.getByPlaceholderText(/write your outreach/i);

    fireEvent.change(textarea, { target: { value: 'Hello world test' } });
    expect(screen.getByText('3 words')).toBeInTheDocument();
  });

  it('disables send button when message is empty', () => {
    render(<MessageComposer {...defaultProps} />);
    const sendButton = screen.getByText('Save & Send');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when message has content', () => {
    render(<MessageComposer {...defaultProps} />);
    const textarea = screen.getByPlaceholderText(/write your outreach/i);
    fireEvent.change(textarea, { target: { value: 'Hello!' } });

    const sendButton = screen.getByText('Save & Send');
    expect(sendButton).not.toBeDisabled();
  });

  it('calls onSend with message when send is clicked', async () => {
    render(<MessageComposer {...defaultProps} />);
    const textarea = screen.getByPlaceholderText(/write your outreach/i);
    fireEvent.change(textarea, { target: { value: 'Hello Alice!' } });

    fireEvent.click(screen.getByText('Save & Send'));
    await waitFor(() => {
      expect(defaultProps.onSend).toHaveBeenCalledWith('Hello Alice!');
    });
  });

  it('generates message via API when generate button is clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Generated message content',
        toneGuidance: ['Be concise'],
      }),
    });

    render(<MessageComposer {...defaultProps} />);
    fireEvent.click(screen.getByText('Generate with AI'));

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText(/write your outreach/i);
      expect(textarea).toHaveValue('Generated message content');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/outreach', expect.objectContaining({
      method: 'POST',
    }));
  });

  it('copies message to clipboard', async () => {
    render(<MessageComposer {...defaultProps} initialMessage="Copy this" />);

    // Find the copy button (it has a Copy icon, no text label)
    const buttons = screen.getAllByRole('button');
    const copyButton = buttons[buttons.length - 1]; // last button is copy
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy this');
    });
  });

  it('selects purpose when option is clicked', () => {
    render(<MessageComposer {...defaultProps} />);
    const networkingBtn = screen.getByText('General Networking');
    fireEvent.click(networkingBtn);

    // The button should now have the active class
    expect(networkingBtn.className).toContain('brand-600');
  });
});

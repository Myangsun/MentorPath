import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from '../ProfileForm';

const mockSave = jest.fn().mockResolvedValue(undefined);

const sampleData = {
  name: 'Liang Chen',
  school: 'MIT - Massachusetts Institute of Technology',
  major: 'Computer Science',
  graduationYear: 2026,
  priorRoles: [{ title: 'Analyst', company: 'Corp', industry: 'Tech', years: 3 }],
  visaStatus: 'F-1',
  industries: ['Technology'],
  roleInterests: ['Product Manager'],
  pivotDirection: 'Data to PM',
  geographicPrefs: ['Boston'],
  mentorPreferences: null,
};

describe('ProfileForm', () => {
  beforeEach(() => {
    mockSave.mockClear();
  });

  it('renders all form sections', () => {
    render(<ProfileForm onSave={mockSave} />);
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Prior Experience')).toBeInTheDocument();
    expect(screen.getByText('Career Interests')).toBeInTheDocument();
    expect(screen.getByText('Mentor Preferences')).toBeInTheDocument();
  });

  it('populates fields from initialData', () => {
    render(<ProfileForm initialData={sampleData} onSave={mockSave} />);
    expect(screen.getByLabelText('Full Name')).toHaveValue('Liang Chen');
    expect(screen.getByLabelText('Graduation Year')).toHaveValue(2026);
  });

  it('shows completion bar', () => {
    render(<ProfileForm initialData={sampleData} onSave={mockSave} />);
    expect(screen.getByText('Profile Completion')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('can add and remove prior roles', async () => {
    const user = userEvent.setup();
    render(<ProfileForm onSave={mockSave} />);

    expect(screen.getByText(/No prior roles added/)).toBeInTheDocument();

    await user.click(screen.getByText('Add Role'));
    expect(screen.getByText('Role 1')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Remove role 1'));
    expect(screen.getByText(/No prior roles added/)).toBeInTheDocument();
  });

  it('toggles industry selection', async () => {
    const user = userEvent.setup();
    render(<ProfileForm onSave={mockSave} />);

    const techBtn = screen.getByText('Technology');
    await user.click(techBtn);
    expect(techBtn).toHaveClass('border-brand-600');

    await user.click(techBtn);
    expect(techBtn).not.toHaveClass('border-brand-600');
  });

  it('toggles role selection', async () => {
    const user = userEvent.setup();
    render(<ProfileForm onSave={mockSave} />);

    const pmBtn = screen.getByText('Product Manager');
    await user.click(pmBtn);
    expect(pmBtn).toHaveClass('border-brand-600');
  });

  it('calls onSave with form data on submit', async () => {
    const user = userEvent.setup();
    render(<ProfileForm initialData={sampleData} onSave={mockSave} />);

    await user.click(screen.getByText('Save Profile'));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    const savedData = mockSave.mock.calls[0][0];
    expect(savedData.name).toBe('Liang Chen');
    expect(savedData.school).toBe('MIT - Massachusetts Institute of Technology');
  });

  it('shows success message after save', async () => {
    const user = userEvent.setup();
    render(<ProfileForm initialData={sampleData} onSave={mockSave} />);

    await user.click(screen.getByText('Save Profile'));
    await waitFor(() => {
      expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();
    });
  });

  it('updates name field', async () => {
    const user = userEvent.setup();
    render(<ProfileForm onSave={mockSave} />);

    const nameInput = screen.getByLabelText('Full Name');
    await user.type(nameInput, 'Jane Doe');
    expect(nameInput).toHaveValue('Jane Doe');
  });
});

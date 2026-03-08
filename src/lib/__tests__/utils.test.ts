import {
  cn,
  getInitials,
  formatScore,
  getScoreColor,
  getOpennessLabel,
  formatRelativeDate,
  isFollowUpDue,
} from '../utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});

describe('getInitials', () => {
  it('returns initials for two-word name', () => {
    expect(getInitials('Liang Chen')).toBe('LC');
  });

  it('returns single initial for one-word name', () => {
    expect(getInitials('Liang')).toBe('L');
  });

  it('limits to 2 initials for long names', () => {
    expect(getInitials('John Paul Smith')).toBe('JP');
  });
});

describe('formatScore', () => {
  it('formats score as percentage', () => {
    expect(formatScore(94.5)).toBe('95%');
    expect(formatScore(0)).toBe('0%');
    expect(formatScore(100)).toBe('100%');
  });
});

describe('getScoreColor', () => {
  it('returns success for high scores', () => {
    expect(getScoreColor(80)).toBe('bg-success text-white');
    expect(getScoreColor(100)).toBe('bg-success text-white');
  });

  it('returns brand for medium scores', () => {
    expect(getScoreColor(60)).toBe('bg-brand-600 text-white');
    expect(getScoreColor(79)).toBe('bg-brand-600 text-white');
  });

  it('returns neutral for low scores', () => {
    expect(getScoreColor(59)).toBe('bg-neutral-400 text-white');
    expect(getScoreColor(0)).toBe('bg-neutral-400 text-white');
  });
});

describe('getOpennessLabel', () => {
  it('returns correct label for one_time_chat', () => {
    expect(getOpennessLabel('one_time_chat')).toEqual({
      label: '1x Chat',
      icon: 'Coffee',
    });
  });

  it('returns correct label for short_term_advising', () => {
    expect(getOpennessLabel('short_term_advising')).toEqual({
      label: 'Short-term',
      icon: 'Calendar',
    });
  });

  it('returns correct label for ongoing_mentorship', () => {
    expect(getOpennessLabel('ongoing_mentorship')).toEqual({
      label: 'Ongoing',
      icon: 'Users',
    });
  });
});

describe('formatRelativeDate', () => {
  it('returns "just now" for recent dates', () => {
    expect(formatRelativeDate(new Date())).toBe('just now');
  });

  it('returns minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeDate(fiveMinAgo)).toBe('5 minutes ago');
  });

  it('returns singular minute', () => {
    const oneMinAgo = new Date(Date.now() - 60 * 1000);
    expect(formatRelativeDate(oneMinAgo)).toBe('1 minute ago');
  });

  it('returns hours ago', () => {
    const threeHrAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeDate(threeHrAgo)).toBe('3 hours ago');
  });

  it('returns days ago', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(fiveDaysAgo)).toBe('5 days ago');
  });

  it('returns months ago', () => {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(formatRelativeDate(sixtyDaysAgo)).toBe('2 months ago');
  });
});

describe('isFollowUpDue', () => {
  it('returns false for recent activity', () => {
    expect(isFollowUpDue(new Date())).toBe(false);
  });

  it('returns true after threshold', () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    expect(isFollowUpDue(eightDaysAgo)).toBe(true);
  });

  it('returns true at exactly threshold', () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    expect(isFollowUpDue(sevenDaysAgo)).toBe(true);
  });

  it('respects custom threshold', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(isFollowUpDue(threeDaysAgo, 3)).toBe(true);
    expect(isFollowUpDue(threeDaysAgo, 5)).toBe(false);
  });
});

// ── Prior Role (nested in StudentProfile.priorRoles JSON) ──
export interface PriorRole {
  title: string;
  company: string;
  industry: string;
  years: number;
}

// ── Career Timeline Entry (nested in AlumniProfile.careerTimeline JSON) ──
export interface CareerTimelineEntry {
  title: string;
  company: string;
  startYear: number;
  endYear: number | null; // null = current
}

// ── Score Breakdown ──
export interface ScoreBreakdown {
  careerPivot: number;
  academicBackground: number;
  visaAlignment: number;
  industryMatch: number;
  geographicProximity: number;
  stageProximity: number;
}

// ── Connection Status ──
export type ConnectionStatus =
  | 'saved'
  | 'outreach_sent'
  | 'replied'
  | 'met'
  | 'ongoing';

// ── Openness Level ──
export type OpennessLevel =
  | 'one_time_chat'
  | 'short_term_advising'
  | 'ongoing_mentorship';

// ── API Request/Response Types ──
export interface StudentProfileInput {
  name: string;
  school: string;
  program: string;
  graduationYear: number;
  priorRoles: PriorRole[];
  visaStatus?: string | null;
  industries: string[];
  roleInterests: string[];
  pivotDirection?: string | null;
  geographicPrefs: string[];
  mentorPreferences?: string | null;
}

export interface AlumniProfileData {
  id: string;
  name: string;
  graduationYear: number;
  school: string;
  program: string;
  currentRole: string;
  currentCompany: string;
  industry: string;
  careerTimeline: CareerTimelineEntry[];
  pivotType: string | null;
  skills: string[];
  visaHistory: string[];
  geographicHistory: string[];
  openness: OpennessLevel;
  topicsWilling: string[];
  responseRate: number;
  lastActive: string;
  bio: string | null;
}

export interface MatchResultWithAlumni {
  id: string;
  alumniId: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  rationale: string | null;
  alumni: AlumniProfileData;
}

export interface RationaleResponse {
  detailedRationale: string;
  alignmentPoints: string[];
  conversationPrompts: string[];
}

export interface OutreachResponse {
  message: string;
  toneGuidance: string[];
}

export interface ConnectionData {
  id: string;
  studentId: string;
  alumniId: string;
  status: ConnectionStatus;
  outreachMessage: string | null;
  notes: string | null;
  lastActivityAt: string;
  createdAt: string;
  alumni: AlumniProfileData;
}

// ── Filter State ──
export interface MatchFilters {
  industries: string[];
  openness: OpennessLevel[];
  minScore: number;
  sharedVisa: boolean;
  pivotTypes: string[];
}

export type SortOption = 'score_desc' | 'score_asc' | 'recent';

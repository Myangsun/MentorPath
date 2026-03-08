import OpenAI from 'openai';
import type { ScoreBreakdown, RationaleResponse, OutreachResponse } from '@/types';
import type { StudentProfile, AlumniProfile } from '@prisma/client';

let _openai: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

function isMockMode(): boolean {
  return process.env.OPENAI_MOCK === 'true';
}

function extractStudentContext(student: StudentProfile) {
  return {
    name: student.name,
    school: student.school,
    major: student.major,
    priorRoles: student.priorRoles,
    visaStatus: student.visaStatus,
    industries: student.industries,
    roleInterests: student.roleInterests,
    pivotDirection: student.pivotDirection,
  };
}

function extractAlumniContext(alumni: AlumniProfile, detailed = false) {
  const base = {
    name: alumni.name,
    school: alumni.school,
    major: alumni.major,
    currentRole: alumni.currentRole,
    currentCompany: alumni.currentCompany,
    industry: alumni.industry,
    pivotType: alumni.pivotType,
    visaHistory: alumni.visaHistory,
  };
  if (!detailed) return base;
  return {
    ...base,
    careerTimeline: alumni.careerTimeline,
    skills: alumni.skills,
    topicsWilling: alumni.topicsWilling,
  };
}

export async function generateMatchRationale(
  student: StudentProfile,
  alumni: AlumniProfile,
  scoreBreakdown: ScoreBreakdown
): Promise<string> {
  if (isMockMode()) {
    return `${alumni.name} shares a similar background with you and could provide valuable insights on your career path.`;
  }

  try {
    const response = await getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a mentor matching assistant for MentorPath, a platform that helps graduate students find alumni mentors. Given a student profile and an alumni profile, generate a concise 1-2 sentence match rationale that explains why this alumni is a good match. Focus on shared experiences, similar career transitions, and relevant constraints like visa status. Be warm and encouraging.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            student: extractStudentContext(student),
            alumni: extractAlumniContext(alumni),
            scoreBreakdown,
          }),
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'A great potential mentor match for your career journey.';
  } catch {
    return 'A great potential mentor match for your career journey.';
  }
}

export async function generateDetailedRationale(
  student: StudentProfile,
  alumni: AlumniProfile,
  scoreBreakdown: ScoreBreakdown
): Promise<RationaleResponse> {
  if (isMockMode()) {
    return {
      detailedRationale: `${alumni.name}'s career path closely mirrors your goals. Their experience transitioning roles and navigating career changes makes them an ideal mentor for your journey.`,
      alignmentPoints: [
        'Similar educational background',
        'Shared career transition experience',
        'Industry alignment with your interests',
      ],
      conversationPrompts: [
        'What motivated your career transition?',
        'How did you navigate the challenges of changing industries?',
        'What advice would you give to someone starting a similar path?',
      ],
    };
  }

  try {
    const response = await getClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a mentor matching assistant. Generate a detailed analysis of why a student and alumni are a good match. Return JSON with: detailedRationale (2-3 paragraphs), alignmentPoints (array of 3-5 specific shared traits), conversationPrompts (array of 3-5 contextual questions the student could ask).',
        },
        {
          role: 'user',
          content: JSON.stringify({
            student: extractStudentContext(student),
            alumni: extractAlumniContext(alumni, true),
            scoreBreakdown,
          }),
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 800,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response');
    return JSON.parse(content) as RationaleResponse;
  } catch {
    return {
      detailedRationale: `${alumni.name} is a strong match based on your shared background and career goals.`,
      alignmentPoints: ['Similar background', 'Relevant experience', 'Shared interests'],
      conversationPrompts: [
        'What has your career journey been like?',
        'What advice would you give someone in my position?',
        'How did you make key career decisions?',
      ],
    };
  }
}

export async function generateOutreachMessage(
  student: StudentProfile,
  alumni: AlumniProfile,
  rationale: string,
  purpose: string
): Promise<OutreachResponse> {
  if (isMockMode()) {
    return {
      message: `Hi ${alumni.name},\n\nI'm ${student.name}, a ${student.major} student at ${student.school}. I came across your profile and was impressed by your career journey. I'd love to connect and learn from your experience.\n\nWould you be open to a brief conversation?\n\nBest regards,\n${student.name}`,
      toneGuidance: [
        'Keep it concise and respectful of their time',
        'Mention specific shared experiences',
        'Be clear about what you\'re asking for',
      ],
    };
  }

  try {
    const response = await getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are helping a graduate student write an outreach message to an alumni mentor. The purpose is: ${purpose}. Generate a professional but warm message (150-250 words) that references specific shared experiences. Also provide 3-4 tone guidance tips. Return JSON with: message (string), toneGuidance (array of strings).`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            student: extractStudentContext(student),
            alumni: extractAlumniContext(alumni),
            rationale,
            purpose,
          }),
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response');
    return JSON.parse(content) as OutreachResponse;
  } catch {
    return {
      message: `Hi ${alumni.name},\n\nI'm ${student.name}, a ${student.major} student at ${student.school}. I'd love to connect and learn from your experience.\n\nBest regards,\n${student.name}`,
      toneGuidance: ['Keep it concise', 'Be specific about your ask', 'Mention shared background'],
    };
  }
}

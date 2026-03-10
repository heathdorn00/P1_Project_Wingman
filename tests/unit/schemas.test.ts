import { describe, it, expect } from 'vitest';
import { AirmanProfileSchema, MentorshipSessionSchema } from '@/types/schemas';

describe('AirmanProfileSchema', () => {
  it('validates a correct airman profile', () => {
    const profile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Rodriguez',
      rank: 'A1C',
      afsc: '1D7X1Z',
      unit: '90 COS',
      mentorTier: 'train' as const,
      skillLevel: 3,
      joinedAt: '2026-01-15T00:00:00Z',
    };
    expect(AirmanProfileSchema.parse(profile)).toEqual(profile);
  });

  it('rejects an invalid AFSC format', () => {
    const profile = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Rodriguez',
      rank: 'A1C',
      afsc: 'INVALID',
      unit: '90 COS',
      mentorTier: 'train' as const,
      skillLevel: 3,
      joinedAt: '2026-01-15T00:00:00Z',
    };
    expect(() => AirmanProfileSchema.parse(profile)).toThrow('Invalid AFSC format');
  });

  it('rejects missing required fields', () => {
    expect(() => AirmanProfileSchema.parse({})).toThrow();
  });
});

describe('MentorshipSessionSchema', () => {
  it('validates a correct session', () => {
    const session = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      airmanId: '550e8400-e29b-41d4-a716-446655440000',
      agentId: 'Scrum_Coach_Fulcrum',
      sessionType: 'code_review' as const,
      summary: 'Reviewed Zod validation implementation',
    };
    expect(MentorshipSessionSchema.parse(session)).toEqual(session);
  });

  it('accepts optional rating and completedAt', () => {
    const session = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      airmanId: '550e8400-e29b-41d4-a716-446655440000',
      agentId: 'GPT_Agent',
      sessionType: 'pair_programming' as const,
      summary: 'Pair programming on API integration',
      completedAt: '2026-03-10T12:00:00Z',
      rating: 5,
    };
    expect(MentorshipSessionSchema.parse(session)).toEqual(session);
  });
});

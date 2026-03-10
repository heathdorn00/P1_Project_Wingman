import { z } from 'zod';

export const AirmanProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  rank: z.string().min(1, 'Rank is required'),
  afsc: z.string().regex(/^\d[A-Z]\d[A-Z]\d[A-Z]?$/, 'Invalid AFSC format'),
  unit: z.string().min(1, 'Unit is required'),
  mentorTier: z.enum(['train', 'coach', 'catch']),
  skillLevel: z.number().int().min(1).max(9),
  joinedAt: z.string().datetime(),
});

export type AirmanProfile = z.infer<typeof AirmanProfileSchema>;

export const MentorshipSessionSchema = z.object({
  id: z.string().uuid(),
  airmanId: z.string().uuid(),
  agentId: z.string(),
  sessionType: z.enum(['code_review', 'career_coaching', 'devsecops_training', 'pair_programming']),
  summary: z.string().min(1),
  completedAt: z.string().datetime().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export type MentorshipSession = z.infer<typeof MentorshipSessionSchema>;

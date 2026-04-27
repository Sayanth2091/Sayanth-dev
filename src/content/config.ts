import { defineCollection, z } from 'astro:content';

const operations = defineCollection({
  type: 'content',
  schema: z.object({
    caseNumber: z.string(),
    codename: z.string(),
    classification: z.string(),
    status: z.enum(['DEPLOYED', 'IN_DEVELOPMENT', 'CONCEPT', 'ARCHIVED']),
    realName: z.string(),
    stack: z.array(z.string()),
    role: z.string(),
    outcome: z.string(),
    period: z.string(),
    heroVisual: z.string(),
    heroVideo: z.string().optional(),
    order: z.number(),
    featured: z.boolean().default(true),
  }),
});

export const collections = { operations };

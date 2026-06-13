import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DEMO_MODE: z.coerce.boolean().default(true),

  // alem.plus — опциональны если DEMO_MODE=true
  ALEM_PLUS_BASE_URL: z.string().url().optional(),
  ALEM_PLUS_API_KEY: z.string().optional(),
  ALEM_PLUS_LLM_MODEL: z.string().optional(),
  ALEM_PLUS_STT_MODEL: z.string().optional(),
  ALEM_PLUS_OCR_MODEL: z.string().optional(),

  // Redis — полностью опциональный
  REDIS_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

import z from 'zod';

const emailSchema = z.email();
const passwordSchema = z.string().min(6);

export const registerDataSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

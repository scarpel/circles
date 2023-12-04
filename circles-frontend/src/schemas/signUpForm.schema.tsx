import { z } from "zod";

const SignUpFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    samePassword: z.string().min(8).max(128),
    name: z.string().min(1).max(50),
    username: z.string().min(2).max(50),
  })
  .refine((data) => data.password === data.samePassword, {
    message: "Password don't match!",
  });

export default SignUpFormSchema;

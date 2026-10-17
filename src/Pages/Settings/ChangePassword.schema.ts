import * as z from "zod";

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(1, "New password is required.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "At least 8 characters with uppercase, lowercase, number, and special character."
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
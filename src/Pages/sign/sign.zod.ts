import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("أدخل بريد إلكتروني صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "الاسم مطلوب"),
  username: z.string().optional(),
  email: z.string().email("أدخل بريد إلكتروني صحيح"),
  gender: z.string().min(1, "اختر النوع"),
  dateOfBirth: z.string().min(1, "تاريخ الميلاد مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["rePassword"],
});
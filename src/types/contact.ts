import * as z from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: "contact.validation.name_required" }) // Retorna clave de traducción i18n
    .min(3, { message: "contact.validation.name_min" }),
  email: z
    .string()
    .min(1, { message: "contact.validation.email_required" })
    .email({ message: "contact.validation.email_invalid" }),
  message: z
    .string()
    .min(1, { message: "contact.validation.message_required" })
    .min(10, { message: "contact.validation.message_min" }),
  // Campo invisible (honeypot) para mitigar el spam automatizado
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export interface ContactApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

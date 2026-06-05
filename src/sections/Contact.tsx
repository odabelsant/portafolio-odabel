import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail, MessageSquare, Send, CheckCircle2,
  AlertCircle, Copy, Check,
} from "lucide-react";
import { Linkedin } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../content/siteContent";

// ─── Formspree endpoint ───────────────────────────────────────────────────────
// Set VITE_FORMSPREE_ID in your .env.local file or Vercel Environment Variables.
// Get your form ID at https://formspree.io
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID ?? ""}`;

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  // Schema defined inside the component so error messages are always translated
  const contactSchema = z.object({
    name: z
      .string()
      .min(1, { message: t("contact.validation.name_required") })
      .min(3, { message: t("contact.validation.name_min") }),
    email: z
      .string()
      .min(1, { message: t("contact.validation.email_required") })
      .email({ message: t("contact.validation.email_invalid") }),
    message: z
      .string()
      .min(1, { message: t("contact.validation.message_required") })
      .min(10, { message: t("contact.validation.message_min") }),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // ─── BUG-03 FIX: Real Formspree HTTP POST ──────────────────────────────────
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          _replyto: data.email,
          _subject: `[Portfolio Contact] Message from ${data.name}`,
        }),
      });

      if (!response.ok) {
        // Formspree returns JSON errors on non-2xx
        const errorBody = await response.json().catch(() => ({}));
        console.error("[Contact] Formspree error:", errorBody);
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      reset();
    } catch (err) {
      // Network / fetch-level failure
      console.error("[Contact] Network error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(siteConfig.personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const directContacts = [
    {
      name: "LinkedIn",
      value: "linkedin.com/in/odabel-santos",
      url: siteConfig.personalInfo.linkedin,
      icon: <Linkedin className="w-5 h-5 text-sky-400" />,
      actionLabel: "Visitar Perfil",
    },
    {
      name: "WhatsApp",
      value: "+1 (829) 372-7869",
      url: siteConfig.personalInfo.whatsappUrl,
      icon: <MessageSquare className="w-5 h-5 text-green-400" />,
      actionLabel: "Enviar WhatsApp",
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 bg-[#050816] dark:bg-[#050816] text-white border-t border-white/5 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight mb-4">
            {t("contact.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="text-xl font-bold font-display mb-6">
              {t("contact.direct_title")}
            </h3>

            {/* Email Copy Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-900/60 text-rose-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400">Email</h4>
                  <p className="text-sm font-bold break-all select-all">
                    {siteConfig.personalInfo.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={copyEmailToClipboard}
                className="p-2.5 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/5 text-slate-400 hover:text-primary transition-all duration-200 focus:outline-none"
                aria-label="Copiar correo al portapapeles"
                title="Copiar correo al portapapeles"
              >
                {copied
                  ? <Check className="w-4 h-4 text-emerald-400" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Other Contacts */}
            {directContacts.map((contact) => (
              <a
                key={contact.name}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex items-center justify-between gap-4 group hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-900/60 group-hover:scale-105 transition-transform duration-300">
                    {contact.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400">{contact.name}</h4>
                    <p className="text-sm font-bold">{contact.value}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {contact.actionLabel} &rarr;
                </span>
              </a>
            ))}
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6 text-left"
              noValidate
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-semibold text-slate-300"
                >
                  {t("contact.name_label")}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t("contact.name_placeholder")}
                  {...register("name")}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 text-white border ${
                    errors.name
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-white/10 focus:border-primary"
                  } focus:outline-none transition-all duration-300`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-semibold text-slate-300"
                >
                  {t("contact.email_label")}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder={t("contact.email_placeholder")}
                  {...register("email")}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 text-white border ${
                    errors.email
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-white/10 focus:border-primary"
                  } focus:outline-none transition-all duration-300`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-semibold text-slate-300"
                >
                  {t("contact.message_label")}
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder={t("contact.message_placeholder")}
                  {...register("message")}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 text-white border ${
                    errors.message
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-white/10 focus:border-primary"
                  } focus:outline-none transition-all duration-300 resize-none`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.message.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="contact-submit-btn"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{t("contact.submit_sending")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t("contact.submit_btn")}</span>
                  </>
                )}
              </button>

              {/* Success / Error States */}
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold flex items-center gap-2"
                    role="status"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{t("contact.submit_success")}</span>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm font-semibold flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{t("contact.submit_error")}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

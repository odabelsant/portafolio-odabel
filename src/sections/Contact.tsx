import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail, MessageSquare, Send, CheckCircle2,
  AlertCircle, Copy, Check, Clock
} from "lucide-react";
import { Linkedin } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../content/siteContent";
import { contactSchema, type ContactFormData } from "../types/contact";

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "timeout">("idle");
  const [showWarning, setShowWarning] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setShowWarning(false);

    // AbortController para cancelar la petición a los 5 segundos
    const controller = new AbortController();
    const warningTimer = setTimeout(() => {
      setShowWarning(true); // Muestra aviso preventivo a los 2.5s (RNF-001)
    }, 2500);

    const abortTimer = setTimeout(() => {
      controller.abort(); // Fuerza timeout a los 5s
    }, 5000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(warningTimer);
      clearTimeout(abortTimer);
      setShowWarning(false);

      if (!response.ok) {
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      reset(); // Limpia el formulario solo en caso de éxito
    } catch (err: any) {
      clearTimeout(warningTimer);
      clearTimeout(abortTimer);
      setShowWarning(false);

      console.error("[Contacto] Error al enviar:", err);
      if (err.name === "AbortError") {
        setSubmitStatus("timeout");
      } else {
        setSubmitStatus("error");
      }
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
      className="py-24 bg-[#050816] text-white border-t border-white/5 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight mb-4">
            {t("contact.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Información Directa */}
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
                className="p-2.5 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/5 text-slate-400 hover:text-primary transition-all duration-200 focus:outline-none cursor-pointer"
                aria-label="Copiar correo"
                title="Copiar correo"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Otros Contactos */}
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

          {/* Formulario */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6 text-left"
              noValidate
            >
              {/* Campo Honeypot - Oculto para Usuarios, visible para Bots */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder="Tu sitio web"
                  {...register("website")}
                />
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-300">
                  {t("contact.name_label")}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  disabled={isSubmitting}
                  placeholder={t("contact.name_placeholder")}
                  {...register("name")}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 text-white border ${
                    errors.name ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-primary"
                  } focus:outline-none transition-all duration-300 disabled:opacity-50`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t(errors.name.message || "")}</span>
                  </p>
                )}
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-300">
                  {t("contact.email_label")}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  disabled={isSubmitting}
                  placeholder={t("contact.email_placeholder")}
                  {...register("email")}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 text-white border ${
                    errors.email ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-primary"
                  } focus:outline-none transition-all duration-300 disabled:opacity-50`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t(errors.email.message || "")}</span>
                  </p>
                )}
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-300">
                  {t("contact.message_label")}
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  disabled={isSubmitting}
                  placeholder={t("contact.message_placeholder")}
                  {...register("message")}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 text-white border ${
                    errors.message ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-primary"
                  } focus:outline-none transition-all duration-300 resize-none disabled:opacity-50`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t(errors.message.message || "")}</span>
                  </p>
                )}
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="contact-submit-btn"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>{t("contact.btn.sending")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{submitStatus === "error" || submitStatus === "timeout" ? t("contact.btn.retry") : t("contact.btn.send")}</span>
                  </>
                )}
              </button>

              {/* Alertas preventivas y de estado */}
              <AnimatePresence>
                {showWarning && isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 animate-pulse flex-shrink-0" />
                    <span>{t("contact.feedback.error_timeout")}</span>
                  </motion.div>
                )}

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold flex items-center gap-2"
                    role="status"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">{t("contact.feedback.success_title")}</p>
                      <p className="text-xs opacity-90">{t("contact.feedback.success_desc")}</p>
                    </div>
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
                    <span>{t("contact.feedback.error_generic")}</span>
                  </motion.div>
                )}

                {submitStatus === "timeout" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm font-semibold flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{t("contact.feedback.error_timeout")}</span>
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

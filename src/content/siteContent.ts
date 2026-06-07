// =============================================================================
// siteContent.ts — Single Source of Truth for static site configuration.
// Admin Backoffice edits are persisted to this file via GitHub API.
// DO NOT remove or rename exported identifiers without updating the backoffice.
// =============================================================================

import backofficeYoutube from "../data/backoffice_youtube.json";
import backofficeMetrics from "../data/backoffice_metrics.json";
import backofficeSkills from "../data/backoffice_skills.json";
import backofficeEducation from "../data/backoffice_education.json";

export interface SocialLinks {
  linkedin: string;
  github?: string;
  email: string;
  whatsapp: string;
}

export interface MetricHighlight {
  id: string;
  value: string;
  labelKey: string; // Translation key
  icon: string;     // Lucide icon name
  label?: string;   // Direct fallback label
}

export interface Skill {
  name: string;
  level: number; // Percentage (e.g. 85)
  icon: string;  // Lucide icon name or text
}

export interface SkillCategory {
  id: string;
  titleKey?: string; // Translation key
  title?: string;     // Direct title string fallback
  skills: Skill[];
}

export interface EducationItem {
  id: string;
  title: string;
  titleKey?: string;
  institution: string;
  date: string;
  dateKey?: string;
  description: string;
}

export const siteConfig = {
  personalInfo: {
    name: "Odabel Santos Álvarez",
    title: "QA Engineer",
    email: "odabelrunner@gmail.com",
    whatsapp: "+18293727869",
    whatsappUrl: "https://wa.me/18293727869",
    linkedin: "https://www.linkedin.com/in/odabel-santos/",
    // HU-03: Updated to real GitHub profile
    github: "https://github.com/odabelsant",
    // HU-01: Profile photo path from public/recursos/
    profilePhoto: "/recursos/foto-perfil.jpg",
  },
  // HU-01: CV files updated to real PDFs in public/recursos/
  cvFiles: {
    es: "/recursos/CV_ES.pdf",
    en: "/recursos/CV_EN.pdf",
  },
  // YouTube presentation video URLs (editable from Backoffice)
  youtubeES: (backofficeYoutube as any).urlES || "https://www.youtube.com/watch?v=FO1rII573ho",
  youtubeEN: (backofficeYoutube as any).urlEN || "",
  navigation: [
    { id: "home",           labelKey: "nav.home" },
    { id: "about",          labelKey: "nav.about" },
    { id: "skills",         labelKey: "nav.skills" },
    { id: "education",      labelKey: "nav.education" },
    { id: "certifications", labelKey: "nav.certifications" },
    { id: "projects",       labelKey: "nav.projects" },
    { id: "highlights",     labelKey: "nav.highlights" },
    { id: "contact",        labelKey: "nav.contact" },
  ],
  metrics: (backofficeMetrics.metrics || [
    { id: "tc_designed",        value: "1,500+", labelKey: "highlights.tc_designed",        icon: "FileText"    },
    { id: "bugs_reported",      value: "450+",   labelKey: "highlights.bugs_reported",      icon: "Bug"         },
    { id: "scripts_automated",  value: "250+",   labelKey: "highlights.scripts_automated",  icon: "Code2"       },
    { id: "projects_delivered", value: "12+",    labelKey: "highlights.projects_delivered", icon: "CheckSquare" },
  ]).map((m: any) => ({
    id: m.id,
    value: m.value,
    label: m.label || "",
    labelKey: m.labelKey || "",
    icon: m.icon || "CheckSquare"
  })) as MetricHighlight[],
  skillsCategories: (backofficeSkills.categories || []).map((cat: any) => ({
    id: cat.id,
    titleKey: cat.titleKey || "",
    title: cat.title || "",
    skills: (cat.skills || []).map((s: any) => ({
      name: s.name,
      level: s.level,
      icon: s.icon
    }))
  })) as SkillCategory[],
  education: (backofficeEducation.education || []).map((edu: any) => ({
    id: edu.id,
    title: edu.title || "",
    titleKey: edu.titleKey || "",
    institution: edu.institution || "",
    date: edu.date || "",
    dateKey: edu.dateKey || "",
    description: edu.description || ""
  })) as EducationItem[],
};

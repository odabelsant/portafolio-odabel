// =============================================================================
// siteContent.ts — Single Source of Truth for static site configuration.
// Admin Backoffice edits are persisted to this file via GitHub API.
// DO NOT remove or rename exported identifiers without updating the backoffice.
// =============================================================================

import backofficeYoutube from "../data/backoffice_youtube.json";
import backofficeMetrics from "../data/backoffice_metrics.json";

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
  titleKey: string; // Translation key
  skills: Skill[];
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
  // HU-02: YouTube presentation video URL (editable from Backoffice)
  youtubeUrl: backofficeYoutube.youtubeUrl || "https://www.youtube.com/watch?v=JjDL7Turyp8",
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
  skillsCategories: [
    {
      id: "testing",
      titleKey: "skills.categories.testing",
      skills: [
        { name: "Manual Testing",      level: 95, icon: "ClipboardCheck" },
        { name: "Regression Testing",  level: 95, icon: "RefreshCw"      },
        { name: "Smoke Testing",       level: 95, icon: "Flame"          },
        { name: "Functional Testing",  level: 90, icon: "Settings"       },
      ],
    },
    {
      id: "automation",
      titleKey: "skills.categories.automation",
      skills: [
        { name: "Selenium",        level: 85, icon: "Cpu"       },
        { name: "Cucumber",        level: 85, icon: "FileCode2" },
        { name: "Katalon Studio",  level: 80, icon: "Layers"    },
        { name: "Appium (Básico)", level: 60, icon: "Smartphone"},
      ],
    },
    {
      id: "backend",
      titleKey: "skills.categories.backend",
      skills: [
        { name: "Postman",      level: 90, icon: "Send"   },
        { name: "API Testing",  level: 85, icon: "Globe"  },
        { name: "SQL",          level: 80, icon: "Database"},
      ],
    },
    {
      id: "qa_management",
      titleKey: "skills.categories.qa_management",
      skills: [
        { name: "Jira",         level: 90, icon: "Kanban"     },
        { name: "Zephyr",       level: 85, icon: "ShieldCheck" },
        { name: "Xray",         level: 85, icon: "Kanban"     },
        { name: "Azure DevOps", level: 80, icon: "Cloud"      },
      ],
    },
    {
      id: "development",
      titleKey: "skills.categories.development",
      skills: [
        { name: "Java",                  level: 75, icon: "Coffee"   },
        { name: "HTML & CSS",            level: 85, icon: "Code"     },
        { name: "JavaScript (Básico)",   level: 70, icon: "Terminal" },
        { name: "Git & Gitflow",         level: 85, icon: "GitBranch"},
      ],
    },
    {
      id: "soft_skills",
      titleKey: "skills.categories.soft_skills",
      skills: [
        { name: "Scrum & Agile",            level: 90, icon: "Users"        },
        { name: "Atención al detalle",      level: 95, icon: "Search"       },
        { name: "Comunicación Asertiva",    level: 90, icon: "MessageSquare"},
        { name: "Resolución de Problemas",  level: 90, icon: "Lightbulb"   },
      ],
    },
  ] as SkillCategory[],
};

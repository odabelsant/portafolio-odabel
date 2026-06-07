export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  titleKey?: string;
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

export interface VideoConfig {
  urlES: string;
  urlEN: string;
}

// Strictly type the i18n translation namespaces
export interface TranslationSchema {
  nav: {
    home: string;
    about: string;
    skills: string;
    education: string;
    certifications: string;
    projects: string;
    highlights: string;
    contact: string;
    download_cv: string;
    cv_es: string;
    cv_en: string;
  };
  hero: {
    greeting: string;
    title: string;
    subtitle: string;
    view_projects: string;
    download_cv: string;
    open_to_work: string;
  };
  about: {
    title: string;
    intro: string;
    p1: string;
    p2: string;
    p3: string;
    approach_title: string;
    approach_1: string;
    approach_2: string;
    approach_3: string;
  };
  skills: {
    title: string;
    subtitle: string;
    categories: {
      testing: string;
      automation: string;
      backend: string;
      qa_management: string;
      development: string;
      soft_skills: string;
      [key: string]: string; // Support dynamic categories
    };
  };
  education: {
    title: string;
    subtitle: string;
  };
  certifications: {
    title: string;
    subtitle: string;
    download: string;
    [key: string]: string | { name: string; date: string } | undefined;
  };
  video: {
    title: string;
    subtitle: string;
  };
  languages: {
    title: string;
    es: { name: string; level: string };
    en: { name: string; level: string };
  };
  projects: {
    title: string;
    subtitle: string;
    filter_all: string;
    filter_manual: string;
    filter_automation: string;
    filter_api: string;
    filter_personal: string;
    role_label: string;
    repo_btn: string;
    demo_btn: string;
    [key: string]: string | { title: string; description: string; role: string } | undefined;
  };
  highlights: {
    title: string;
    subtitle: string;
    tc_designed: string;
    bugs_reported: string;
    scripts_automated: string;
    projects_delivered: string;
    impact_title: string;
    impact_1_title: string;
    impact_1_desc: string;
    impact_2_title: string;
    impact_2_desc: string;
    impact_3_title: string;
    impact_3_desc: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name_label: string;
    email_label: string;
    message_label: string;
    name_placeholder: string;
    email_placeholder: string;
    message_placeholder: string;
    submit_btn: string;
    submit_sending: string;
    submit_success: string;
    submit_error: string;
    direct_title: string;
    validation: {
      name_required: string;
      name_min: string;
      email_required: string;
      email_invalid: string;
      message_required: string;
      message_min: string;
    };
  };
  footer: {
    rights: string;
    back_to_top: string;
  };
}

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tech: string[];
  roleKey: string;
  category: "manual" | "automation" | "api" | "personal";
  demoUrl?: string;
  repoUrl?: string;
  image?: string;
}

export interface Certificate {
  id: string;
  nameKey: string;
  institution: string;
  dateKey: string;
  fileName: string;
}

export interface MetricHighlight {
  id: string;
  value: string;
  labelKey: string;
  icon: string;
}

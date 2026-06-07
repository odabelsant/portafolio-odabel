import projectsJson from "./projects.json";

export interface Project {
  id: string;
  titleKey?: string;      // Translation key for Title (optional)
  descriptionKey?: string;// Translation key for Description (optional)
  tech: string[];
  roleKey?: string;       // Translation key for Role (optional)
  category: 'manual' | 'automation' | 'api' | 'personal';
  demoUrl?: string;
  repoUrl?: string;
  image?: string;         // Optional path to custom mockup/image
  title?: string;         // Dynamic CMS title
  description?: string;   // Dynamic CMS description
  role?: string;          // Dynamic CMS role
}

export const projectsData: Project[] = projectsJson as Project[];

export interface Project {
  id: string;
  titleKey: string; // Translation key for Title
  descriptionKey: string; // Translation key for Description
  tech: string[];
  roleKey: string; // Translation key for Role
  category: 'manual' | 'automation' | 'api' | 'personal';
  demoUrl?: string;
  repoUrl?: string;
  image?: string; // Optional path to custom mockup/image
}

export const projectsData: Project[] = [
  {
    id: "ecommerce-bdd",
    titleKey: "projects.ecommerce_bdd.title",
    descriptionKey: "projects.ecommerce_bdd.description",
    tech: ["Selenium", "Java", "Cucumber", "Maven", "Git", "JUnit"],
    roleKey: "projects.ecommerce_bdd.role",
    category: "automation",
    repoUrl: "https://github.com/odabelrunner/ecommerce-bdd-framework",
    demoUrl: undefined,
  },
  {
    id: "api-postman-suite",
    titleKey: "projects.api_postman.title",
    descriptionKey: "projects.api_postman.description",
    tech: ["Postman", "Newman", "SQL", "Gitflow", "Jira", "JSON Schema"],
    roleKey: "projects.api_postman.role",
    category: "api",
    repoUrl: "https://github.com/odabelrunner/api-testing-postman",
    demoUrl: undefined,
  },
  {
    id: "mobile-banking-app",
    titleKey: "projects.mobile_banking.title",
    descriptionKey: "projects.mobile_banking.description",
    tech: ["Appium", "Java", "Android SDK", "Git", "Zephyr"],
    roleKey: "projects.mobile_banking.role",
    category: "automation",
    repoUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: "saas-system-testing",
    titleKey: "projects.saas_testing.title",
    descriptionKey: "projects.saas_testing.description",
    tech: ["Jira", "Xray", "Excel", "SQL Server", "Agile/Scrum"],
    roleKey: "projects.saas_testing.role",
    category: "manual",
    repoUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: "qa-testdata-generator",
    titleKey: "projects.testdata_generator.title",
    descriptionKey: "projects.testdata_generator.description",
    tech: ["HTML", "CSS", "JavaScript", "LocalStorage", "JSON"],
    roleKey: "projects.testdata_generator.role",
    category: "personal",
    repoUrl: "https://github.com/odabelrunner/qa-test-data-helper",
    demoUrl: "https://qa-test-data-helper.vercel.app",
  }
];

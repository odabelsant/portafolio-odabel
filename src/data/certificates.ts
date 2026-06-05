// BUG-01 FIX: Translation keys now correctly use the "certifications.*" namespace
// matching the structure defined in es.json and en.json translations.
export interface Certificate {
  id: string;
  nameKey: string;    // Translation key for Name  e.g. "certifications.selenium_java_cucumber.name"
  institution: string;
  dateKey: string;    // Translation key for Date  e.g. "certifications.selenium_java_cucumber.date"
  pdfPath: string;    // Absolute path from public root (e.g. /recursos/cert.pdf or /certificates/cert.pdf)
}

export const certificatesData: Certificate[] = [
  {
    id: "selenium-java-cucumber",
    nameKey: "certifications.selenium_java_cucumber.name",
    institution: "Udemy / Global QA Certification",
    dateKey: "certifications.selenium_java_cucumber.date",
    pdfPath: "/certificates/selenium_java_cucumber.pdf",
  },
  {
    id: "testing-fundamentals",
    nameKey: "certifications.testing_fundamentals.name",
    institution: "International Software Testing Institute",
    dateKey: "certifications.testing_fundamentals.date",
    pdfPath: "/certificates/testing_fundamentals.pdf",
  },
  {
    id: "jira-zephyr",
    nameKey: "certifications.jira_zephyr.name",
    institution: "Atlassian / SmartBear Academy",
    dateKey: "certifications.jira_zephyr.date",
    pdfPath: "/certificates/jira_zephyr.pdf",
  },
  {
    id: "postman-api",
    nameKey: "certifications.postman_api.name",
    institution: "Postman Student / Academy",
    dateKey: "certifications.postman_api.date",
    pdfPath: "/certificates/postman_api.pdf",
  },
  {
    id: "html-css",
    nameKey: "certifications.html_css.name",
    institution: "FreeCodeCamp / Tech Academy",
    dateKey: "certifications.html_css.date",
    pdfPath: "/recursos/certificado_odabel.pdf",
  },
  {
    id: "capacitate-empleo",
    nameKey: "certifications.capacitate_empleo.name",
    institution: "Capacítate para el Empleo / Fundación Carlos Slim",
    dateKey: "certifications.capacitate_empleo.date",
    pdfPath: "/recursos/certificado_capacitate_empleo.pdf",
  },
];

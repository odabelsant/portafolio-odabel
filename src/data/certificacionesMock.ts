export interface CertificacionMock {
  id: string;
  titulo: string;
  plataforma: string;
  imageUrl: string;
  pdfUrl?: string;
}

export const certificacionesMock: CertificacionMock[] = [
  {
    id: "testing-fundamentals",
    titulo: "Testing Fundamentals",
    plataforma: "International Software Testing Institute",
    imageUrl: "/recursos/Testing_Fundamentals.png",
    pdfUrl: "/certificates/testing_fundamentals.pdf",
  },
  {
    id: "selenium-java-cucumber-bdd",
    titulo: "Selenium con Java Cucumber BDD",
    plataforma: "Udemy",
    imageUrl: "/recursos/Selenium_con_Java_Cucumber_BDD.png",
    pdfUrl: "/certificates/selenium_java_cucumber.pdf",
  },
  {
    id: "jira-zephyr",
    titulo: "Jira & Zephyr",
    plataforma: "SmartBear Academy",
    imageUrl: "/recursos/Jira_Zephyr.png",
    pdfUrl: "/certificates/jira_zephyr.pdf",
  },
  {
    id: "postman-api-testing",
    titulo: "Postman & API Testing",
    plataforma: "Postman Academy",
    imageUrl: "/recursos/Postman_API_Testing.png",
    pdfUrl: "/certificates/postman_api.pdf",
  },
];

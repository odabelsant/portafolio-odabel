export interface CertificacionMock {
  id: string;
  titulo: string;
  plataforma: string;
  imageUrl: string;
}

export const certificacionesMock: CertificacionMock[] = [
  {
    id: "testing-fundamentals",
    titulo: "Testing Fundamentals",
    plataforma: "International Software Testing Institute",
    imageUrl: "/recursos/Testing Fundamentals.png",
  },
  {
    id: "selenium-java-cucumber-bdd",
    titulo: "Selenium con Java Cucumber BDD",
    plataforma: "Udemy",
    imageUrl: "/recursos/Selenium con Java Cucumber BDD.png",
  },
  {
    id: "jira-zephyr",
    titulo: "Jira & Zephyr",
    plataforma: "SmartBear Academy",
    imageUrl: "/recursos/Jira & Zephyr.png",
  },
  {
    id: "postman-api-testing",
    titulo: "Postman & API Testing",
    plataforma: "Postman Academy",
    imageUrl: "/recursos/Postman & API Testing.png",
  },
];

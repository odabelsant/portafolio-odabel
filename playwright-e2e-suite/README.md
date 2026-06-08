# Playwright E2E & Visual Regression Testing (VRT) Framework

[English](#english) | [Español](#español)

---

## English

A highly scalable, robust end-to-end (E2E) automation and visual regression testing framework designed for modern web applications. Built with **Playwright**, **TypeScript**, and structured under the **Page Object Model (POM)** pattern.

### Key Features
- **Page Object Model (POM)**: Enforces code reusability and clean separation of concerns by encapsulating page locators and user actions in page classes.
- **Visual Regression Testing (VRT)**: Uses pixel-perfect screenshot comparisons across multiple viewports to detect layout regressions.
- **API Mocking**: Intercepts network calls to mock dynamic endpoints (e.g., Formspree submits), making tests independent of third-party APIs.
- **CI/CD Integration**: Seamless automation with GitHub Actions to validate code health on every commit.

### Project Structure
```text
playwright-e2e-suite/
│
├── pages/                  # Page Object Model classes
│   ├── HomePage.ts         # Selectors and methods for Landing Page
│   ├── ContactPage.ts      # Selectors and mock handlers for Contact Form
│   └── admin/
│       ├── LoginPage.ts    # Admin Login POM
│       └── DashboardPage.ts# Admin Backoffice Dashboard POM
│
├── tests/                  # Automated test scripts
│   ├── functional.spec.ts  # E2E and functional specs
│   └── visual.spec.ts      # Visual regression specs (VRT)
│
├── playwright.config.ts    # Configuration file (browsers, viewports, reports)
└── package.json            # Dependencies and script tasks
```

### Getting Started

#### Prerequisites
- Node.js (LTS version recommended)
- Git

#### Installation
1. Clone this repository:
   ```bash
   git clone <your-repository-url>
   cd qa-playwright-e2e-framework
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browser engines:
   ```bash
   npx playwright install --with-deps
   ```

#### Execution Scripts
- **Run all tests**:
  ```bash
  npm run test
  ```
- **Run tests in UI mode**:
  ```bash
  npm run test:ui
  ```
- **Debug tests step-by-step**:
  ```bash
  npm run test:debug
  ```
- **Show latest test execution report**:
  ```bash
  npm run test:report
  ```

---

## Español

Un framework de automatización extremo a extremo (E2E) y pruebas de regresión visual altamente escalable y robusto. Construido con **Playwright**, **TypeScript**, y estructurado bajo el patrón **Page Object Model (POM)**.

### Características Principales
- **Page Object Model (POM)**: Fomenta la reutilización del código y la separación de responsabilidades encapsulando los selectores y las interacciones en clases específicas.
- **Pruebas de Regresión Visual (VRT)**: Realiza comparaciones de capturas de pantalla píxel por píxel en múltiples resoluciones para detectar cambios no deseados en la UI.
- **Simulación de APIs (Mocking)**: Intercepta peticiones de red (por ejemplo, envíos a Formspree) para independizar las pruebas de servicios de terceros.
- **Integración de CI/CD**: Ejecución automática de pruebas de regresión en GitHub Actions con cada push o PR.

### Estructura del Proyecto
```text
playwright-e2e-suite/
│
├── pages/                  # Clases del Page Object Model (POM)
│   ├── HomePage.ts         # Métodos y selectores de la página de inicio
│   ├── ContactPage.ts      # Manejadores y selectores del formulario de contacto
│   └── admin/
│       ├── LoginPage.ts    # POM de inicio de sesión de administrador
│       └── DashboardPage.ts# POM del panel de administración del Backoffice
│
├── tests/                  # Scripts de pruebas automatizadas
│   ├── functional.spec.ts  # Pruebas de funcionalidad E2E
│   └── visual.spec.ts      # Pruebas de regresión visual (VRT)
│
├── playwright.config.ts    # Archivo de configuración (navegadores, tamaños, reportes)
└── package.json            # Dependencias y tareas del proyecto
```

### Primeros Pasos

#### Requisitos Previos
- Node.js (Versión LTS recomendada)
- Git

#### Instalación
1. Clonar este repositorio:
   ```bash
   git clone <url-de-tu-repositorio>
   cd qa-playwright-e2e-framework
   ```
2. Instalar las dependencias de Node:
   ```bash
   npm install
   ```
3. Instalar los navegadores de Playwright:
   ```bash
   npx playwright install --with-deps
   ```

#### Scripts de Ejecución
- **Ejecutar todas las pruebas**:
  ```bash
  npm run test
  ```
- **Ejecutar en modo interactivo (UI)**:
  ```bash
  npm run test:ui
  ```
- **Depurar las pruebas paso a paso**:
  ```bash
  npm run test:debug
  ```
- **Visualizar el último reporte de ejecución**:
  ```bash
  npm run test:report
  ```

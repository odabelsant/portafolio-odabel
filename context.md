# Contexto de Desarrollo — Portafolio Odabel Santos

Este archivo sirve como la fuente de verdad (Single Source of Truth) para el estado del proyecto, su arquitectura, componentes operativos, bugs resueltos y variables de entorno necesarias para la ejecución y despliegue del portafolio del QA Engineer **Odabel Santos Álvarez**.

---

## 🛠️ Stack Tecnológico

El proyecto está desarrollado utilizando:
- **Core:** React 19, TypeScript, Vite
- **Estilos:** Tailwind CSS v4, Framer Motion (para micro-animaciones premium)
- **i18n:** react-i18next (soporte multilenguaje dinámico Español/Inglés)
- **Formularios:** react-hook-form + zod (validación estricta de esquemas)
- **Enrutamiento:** react-router-dom
- **Hosting:** Vercel (despliegue continuo CI/CD desde la rama `main`)

---

## 🔑 Variables de Entorno (.env)

El proyecto requiere las siguientes variables de entorno para habilitar la persistencia del Backoffice y el formulario de contacto real.

| Variable | Tipo | Propósito / Descripción |
| :--- | :--- | :--- |
| `VITE_FORMSPREE_ID` | String | Identificador de formulario de Formspree para la recepción de correos en `Contact.tsx`. |
| `VITE_ADMIN_PASSWORD` | String | Contraseña para la autenticación local y acceso al panel de control `/admin`. |
| `VITE_GITHUB_TOKEN` | String | Personal Access Token (PAT) con permisos de escritura (`repo`) para actualizar archivos vía API de GitHub. |
| `VITE_GITHUB_REPO` | String | Formato `usuario/nombre-repositorio` (ej: `odabelsant/portafolio-odabel`) que el Backoffice modificará. |

> [!WARNING]
> No subas nunca el archivo `.env.local` al repositorio. En producción (Vercel), configura estas variables en la sección **Settings** -> **Environment Variables**.

---

## 📂 Estructura de Directorios Clave

```text
├── public/
│   ├── recursos/           # Recursos estáticos reales (CVs, Fotos, Certificados)
│   │   ├── foto-perfil.jpg
│   │   ├── CV_ES.pdf
│   │   ├── CV_EN.pdf
│   │   ├── certificado_odabel.pdf
│   │   └── certificado_capacitate_empleo.pdf
├── src/
│   ├── components/         # Componentes transversales y reutilizables (Toggles, Botones)
│   ├── config/             # Configuración de inicialización (i18n)
│   ├── content/
│   │   └── siteContent.ts  # Fuente de verdad de textos y enlaces estáticos
│   ├── context/
│   │   └── ThemeContext.tsx # Contexto de temas con persistencia en localStorage
│   ├── data/
│   │   └── certificates.ts # Estructura y metadata de certificaciones
│   ├── pages/
│   │   └── admin/          # Todo el Backoffice Administrativo
│   │       ├── sections/   # Paneles individuales de edición de datos y archivos
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminLogin.tsx
│   │       └── AdminRoute.tsx
│   ├── sections/           # Secciones principales del portafolio (Hero, About, etc.)
│   ├── services/
│   │   └── githubApiService.ts # Cliente API de GitHub para commits y uploads desde el cliente
│   ├── translations/       # Archivos de traducción JSON (es.json, en.json)
```

---

## 🐞 Bugs Críticos Resueltos

1. **BUG-01 (Certificaciones i18n):** Se corrigieron los prefijos de traducción en `src/data/certificates.ts`. Las claves ahora usan el prefijo `certifications.` mapeado correctamente en los JSONs de idiomas en lugar de `certificates.`.
2. **BUG-02 (Tema Claro/Oscuro):** Se implementó una separación estricta en `src/index.css`. El modo oscuro es de estética premium (fondo `#050816`, acentos neón y glow). El modo claro se reestructuró como blanco y negro absoluto (`#ffffff` de fondo puro, textos negros, sombras suaves y tarjetas gris claro) para evitar sobrecarga visual. Se actualizó `ThemeContext.tsx` con el atributo `data-theme` a nivel del documento.
3. **BUG-03 (Formulario con Formspree):** Se eliminó la simulación por `setTimeout` en `src/sections/Contact.tsx`. Ahora realiza una llamada POST real usando `fetch` a la API de Formspree con validaciones de red, control de envío bloqueante y alertas elegantes de éxito o error.

---

## 🚀 Historias de Usuario Implementadas

- **HU-01 (Recursos Multimedia Reales):** Se actualizó el diseño de la sección Hero en dos columnas: el texto a la izquierda y la foto de perfil real con borde degradado animado, estado "Open to work" e indicadores QA a la derecha. Además, los botones de descarga apuntan a los PDFs de CV reales hospedados localmente en `/recursos/`.
- **HU-02 (Video de Presentación):** Se diseñó la nueva sección `<VideoPresentation />` (ubicada entre Hero y Sobre Mí) con reproductor incrustado de YouTube (lazy loading, responsive 16:9 y soporte de enlaces cortos/completos) configurable dinámicamente desde el Backoffice.
- **HU-03 (Enlace de GitHub Correcto):** Se actualizó la URL de GitHub en todas las secciones para apuntar a la cuenta oficial del cliente: `https://github.com/odabelsant`.
- **HU-04 (Backoffice con Persistencia GitHub API):** Se desarrolló un panel completo de administración accesible mediante `/admin`:
  - **Login:** Autenticación por contraseña persistente mediante `sessionStorage` (las sesiones expiran al cerrar la pestaña).
  - **TextsEditor:** Modificación de textos e información estática.
  - **YouTubeEditor:** Edición rápida de la URL del video con previsualización en vivo.
  - **MetricsEditor:** Ajuste de las 4 métricas clave de impacto de QA.
  - **FilesEditor:** Permite subir archivos directamente (foto de perfil, CVs y certificados PDF) convirtiéndolos a Base64 e inyectándolos en el repositorio usando la GitHub Contents API, lo que dispara la reconstrucción del sitio en Vercel automáticamente sin usar base de datos.
- **HU-05 (Contexto de Desarrollo):** Creación de este archivo descriptivo para asegurar la continuidad del proyecto.

---

## 📐 Reglas Arquitectónicas y Mantenimiento

1. **Evitar Bases de Datos Tradicionales:** Toda la persistencia debe realizarse editando la configuración del sitio (`src/content/siteContent.ts`) o subiendo archivos a la carpeta `public/recursos/` utilizando la GitHub Contents API en `githubApiService.ts`.
2. **Preservar el i18n:** Al agregar textos nuevos en las vistas, siempre deben agregarse a `es.json` y `en.json`, invocándolos a través de la función `t()` de `react-i18next`.
3. **Consistencia de Estilos:** No usar colores ad-hoc que rompan la paleta. Los tokens de diseño en `src/index.css` deben respetarse tanto en modo oscuro como en el modo blanco y negro del tema claro.

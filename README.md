# Portafolio Profesional - Odabel Santos Álvarez (QA Engineer)

Este proyecto es un portafolio web profesional, moderno, completamente responsivo, accesible y bilingüe (Español/Inglés) diseñado para destacar la experiencia, habilidades y logros de un **QA Engineer**.

El portafolio cuenta con un diseño premium futurista con fondos oscuros, efectos de brillo (*glow*), glassmorphism sutil y transiciones fluidas.

---

## 🛠️ Stack Tecnológico
- **Core:** [React 19+](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Enrutamiento:** [React Router v6](https://reactrouter.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Internacionalización (i18n):** [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/)
- **Validación y Formularios:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **SEO:** [React Helmet Async](https://github.com/staylor/react-helmet-async)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📁 Estructura del Proyecto

La arquitectura es modular y separa completamente la lógica visual del contenido modificable:

```
src/
  ├── components/       # Componentes de interfaz comunes (ThemeToggle, LanguageToggle, CVButton, etc.)
  ├── config/           # Configuración del sistema i18n
  ├── content/          # FUENTE DE VERDAD: siteContent.ts (Configuración global del sitio)
  ├── context/          # Contexto global de tema (ThemeProvider)
  ├── data/             # Colecciones de datos estructurados:
  │   ├── projects.ts      # Listado de proyectos de QA
  │   └── certificates.ts  # Listado de certificados académicos y profesionales
  ├── hooks/            # Custom hooks reutilizables (useActiveSection para el scroll activo)
  ├── layout/           # Componentes de estructura global (Header, Footer)
  ├── sections/         # Cada una de las secciones de la landing page (Hero, About, Skills, etc.)
  ├── translations/     # Diccionarios de traducción en JSON para i18next (es.json, en.json)
  ├── types/            # Definiciones de tipos TypeScript
  ├── App.tsx           # Coordinación de secciones, SEO y enrutamiento
  ├── index.css         # Importación de Tailwind y estilos base del diseño premium
  └── main.tsx          # Punto de entrada de la aplicación
public/                 # Directorio de recursos estáticos
  ├── cv/               # Documentos del CV en PDF (CV_Odabel_Santos_ES.pdf / EN.pdf)
  └── certificates/     # PDFs correspondientes a las certificaciones enlazadas
```

---

## ⚡ Comandos para Desarrollo y Producción

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Ejecutar servidor de desarrollo local
```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver los cambios en tiempo real.

### 3. Compilar para producción
Este comando compilará y optimizará los recursos en la carpeta `dist/`.
```bash
npm run build
```

### 4. Ejecutar previsualización local del build
```bash
npm run preview
```

### 5. Análisis estático (Linter)
```bash
npm run lint
```

---

## ✍️ Cómo Editar el Contenido del Sitio

Para cambiar cualquier información del sitio **no necesitas tocar el código visual de los componentes**. Todo se gestiona desde archivos específicos:

### 1. Modificar datos de contacto, enlaces y habilidades
Abre el archivo [siteContent.ts](file:///Users/onielsantos/Desktop/Portafolio%20Odabel/src/content/siteContent.ts):
- **Información Personal:** Cambia nombre, correo, teléfono y enlaces a redes sociales en `personalInfo`.
- **Habilidades (Skills):** Modifica o añade habilidades en `skillsCategories`. Cada habilidad tiene un nombre, un porcentaje de dominio (`level`), y un icono de Lucide.

### 2. Modificar Proyectos
Abre el archivo [projects.ts](file:///Users/onielsantos/Desktop/Portafolio%20Odabel/src/data/projects.ts):
- Añade o edita proyectos dentro del arreglo `projectsData`.
- Configura la categoría correspondiente (`manual`, `automation`, `api`, `personal`) para que funcione correctamente el filtro en la UI.
- Los textos de título, descripción y rol se mapean con llaves de i18n para su traducción automática (ej. `"projects.ecommerce_bdd.title"`).

### 3. Modificar Certificados
Abre el archivo [certificates.ts](file:///Users/onielsantos/Desktop/Portafolio%20Odabel/src/data/certificates.ts):
- Añade certificados en `certificatesData` especificando: Nombre (clave de i18n), institución, fecha (clave de i18n) y el nombre exacto del archivo PDF en `public/certificates/`.

### 4. Modificar Textos y Traducciones (Español e Inglés)
Los diccionarios de traducción se encuentran en:
- [es.json](file:///Users/onielsantos/Desktop/Portafolio%20Odabel/src/translations/es.json) (Español)
- [en.json](file:///Users/onielsantos/Desktop/Portafolio%20Odabel/src/translations/en.json) (Inglés)

Abre estos archivos para actualizar descripciones del hero, párrafos de la sección "Sobre Mí", títulos de proyectos y traducciones de los botones.

### 5. Reemplazar archivos PDF de CV y Certificaciones
Guarda los archivos PDF en las siguientes rutas respetando los nombres de archivo o actualizándolos en sus archivos de configuración:
- CV en Español: `public/cv/CV_Odabel_Santos_ES.pdf`
- CV en Inglés: `public/cv/CV_Odabel_Santos_EN.pdf`
- Certificados: Colócalos en `public/certificates/` (los nombres de los archivos deben coincidir con la propiedad `fileName` de [certificates.ts](file:///Users/onielsantos/Desktop/Portafolio%20Odabel/src/data/certificates.ts)).

---

## 🚀 Despliegue en Vercel

Este proyecto está completamente listo y optimizado para publicarse en Vercel.

### Despliegue rápido desde consola:
1. Instala el CLI de Vercel (si no lo tienes):
   ```bash
   npm install -g vercel
   ```
2. Inicia sesión y despliega en staging:
   ```bash
   vercel
   ```
3. Despliega en producción:
   ```bash
   vercel --prod
   ```

### Despliegue automático desde GitHub:
1. Sube el proyecto a tu repositorio de GitHub.
2. Ve a [Vercel](https://vercel.com/), crea un nuevo proyecto e importa tu repositorio.
3. Vercel detectará automáticamente que es un proyecto **Vite** y configurará los comandos `npm run build` y la carpeta de salida `dist/`.
4. Haz clic en **Deploy** y tu sitio estará listo en pocos segundos en un dominio gratuito `tudominio.vercel.app`.

# Estrategia de QA y Casos de Prueba - Portafolio Odabel Santos

Este archivo contiene el plan de pruebas, casos de prueba y checklists detallados para validar la calidad del portafolio. Como QA Senior, este documento es la base para asegurar que el sitio web no tiene fallas, es accesible y funciona de forma óptima en producción.

---

## 1. SMOKE TEST (Prueba de Humo Rápida)
Esta prueba debe ejecutarse tras cada compilación en el entorno de staging/producción:
1. **Acceso inicial:** Cargar la URL. Comprobar que carga en menos de 2 segundos.
2. **Carga visual:** Comprobar que no hay imágenes rotas, ni parpadeos (FOUC). El tema por defecto debe ser **oscuro premium**.
3. **Navegación:** Hacer clic en "Habilidades" en el Header. Comprobar el scroll suave a la sección.
4. **Formulario:** Llenar el formulario de contacto con datos válidos y pulsar "Enviar Mensaje". Validar que aparezca el toast de éxito tras 1.5 segundos.
5. **Idioma:** Pulsar el selector de idioma. Comprobar que el contenido cambia instantáneamente a inglés.

---

## 2. CHECKLIST RESPONSIVE (Mobile First)
Probar en herramientas de desarrollo del navegador o dispositivos físicos las siguientes resoluciones:
- [ ] **320px (iPhone SE / Móvil Pequeño):**
  - El menú de navegación se oculta y aparece el menú hamburguesa.
  - La tipografía del título del Hero se reduce y se lee completa sin desbordar.
  - Los padding laterales en las tarjetas de habilidades y proyectos son de al menos 16px.
- [ ] **375px & 425px (Móviles Medios/Grandes):**
  - Las tarjetas de proyectos ocupan el 100% del ancho en una sola columna.
  - Las barras de progreso de las habilidades tienen espacio suficiente para mostrar los textos y porcentajes alineados.
- [ ] **768px (iPad/Tablets):**
  - La cuadrícula de proyectos cambia a 2 columnas.
  - El menú de habilidades se organiza en 2 columnas.
  - El formulario de contacto se visualiza completo en una sola columna centrada.
- [ ] **1024px, 1440px & 1920px (Pantallas de Escritorio):**
  - El menú del Header se visualiza extendido (sin menú hamburguesa).
  - La sección About Me y Contact se dividen en 2 columnas laterales (Grid de 12 columnas).
  - El timeline de Educación se despliega de forma alterna (izquierda/derecha) alineado por el centro.

---

## 3. CHECKLIST DE ACCESIBILIDAD (WCAG 2.1 AA)
- [ ] **Navegación por Teclado:**
  - Presionar `Tab` recorre todos los elementos interactivos en orden lógico (Header Logo -> Menú links -> Cambiar Idioma -> Cambiar Tema -> CV -> Botones Hero -> Tarjetas Proyectos -> Campos del Formulario -> Footer).
  - Cada elemento enfocado tiene un borde azul/celeste brillante visible (`focus-visible` configurado en `index.css`).
  - Pulsar `Escape` cierra el menú móvil hamburguesa y el menú desplegable del CV.
- [ ] **Lectores de Pantalla (ARIA):**
  - Todos los botones sin texto visible (ej. selector de tema, menú hamburguesa) tienen un atributo `aria-label` descriptivo.
  - El formulario tiene etiquetas `htmlFor` vinculadas a los IDs correspondientes de los inputs.
  - El atributo `lang` del elemento HTML (`<html lang="es">` o `<html lang="en">`) se actualiza dinámicamente al cambiar de idioma.
- [ ] **Contraste de Color:**
  - El texto blanco/gris claro sobre fondo oscuro (#050816) cumple el ratio de contraste 4.5:1.
  - El texto en modo claro cumple con las especificaciones de legibilidad para personas con baja visión.

---

## 4. CHECKLIST SEO Y RENDIMIENTO
- [ ] **SEO Técnico:**
  - Título único y descriptivo inyectado dinámicamente mediante `react-helmet-async`.
  - Meta descripción alineada al idioma activo.
  - Etiquetas Open Graph (`og:title`, `og:description`, `og:image`) validadas en el inspector.
  - Etiquetas de Twitter Cards completas.
  - Jerarquía semántica de títulos correcta (un solo `h1` en la página principal, `h2` para secciones, `h3` para tarjetas).
- [ ] **Rendimiento:**
  - Ejecutar auditoría Lighthouse en producción. Meta: > 90 en todas las categorías.
  - Asegurar precarga de fuentes de Google Fonts sin bloquear la renderización inicial.

---

## 5. MATRIZ DE CASOS DE PRUEBA (QA Test Suite)

| ID | Componente / Flujo | Acción de Prueba | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Idioma (Bilingüe) | Hacer clic en "ES" para cambiar a "EN". | Todos los textos del sitio (Header, Hero, About, Skills, Projects, Highlights, Formulario, Footer) cambian a inglés. El parámetro del localStorage `i18nextLng` se guarda como `en`. | **PASSED** |
| **TC-02** | Idioma (Persistencia) | Configurar idioma en inglés y recargar la página. | La página se inicia automáticamente en inglés, leyendo la preferencia del localStorage. | **PASSED** |
| **TC-03** | Tema Visual | Hacer clic en el botón de sol/luna en el Header. | El tema cambia de oscuro (#050816) a claro (#f8fafc) con una transición suave de color. El localStorage `theme` se actualiza. | **PASSED** |
| **TC-04** | Descarga de CV | Hacer clic en el botón "Descargar CV". | Se despliega un menú animado con dos opciones: "CV en Español" y "CV en Inglés". | **PASSED** |
| **TC-05** | Descarga de CV (Acción) | Hacer clic en "CV en Español" en el dropdown. | Inicia la descarga del archivo `/cv/CV_Odabel_Santos_ES.pdf` sin errores 404. | **PASSED** |
| **TC-06** | Descarga de CV (Keyboard) | Enfocar el menú de CV y pulsar `Escape`. | El menú desplegable se cierra inmediatamente y el foco regresa al botón principal. | **PASSED** |
| **TC-07** | Filtro de Proyectos | Hacer clic en el filtro "Automatización". | La cuadrícula de proyectos se actualiza mostrando únicamente proyectos de la categoría `automation`. La transición es suave. | **PASSED** |
| **TC-08** | Enlaces Sociales | Hacer clic en el icono de LinkedIn en el footer. | Abre `https://www.linkedin.com/in/odabel-santos/` en una pestaña nueva con `rel="noopener noreferrer"`. | **PASSED** |
| **TC-09** | Enlace WhatsApp | Hacer clic en el card de WhatsApp en Contacto. | Abre `https://wa.me/18293727869` en una pestaña nueva para iniciar chat. | **PASSED** |
| **TC-10** | Formulario (Zod) | Intentar enviar formulario con campo Email vacío. | El formulario previene el envío y muestra el mensaje de error: "El correo es obligatorio" (o su versión en inglés). | **PASSED** |
| **TC-11** | Formulario (Zod) | Ingresar un correo inválido (ej. "usuario@correo"). | Se muestra el mensaje "Por favor ingresa un correo electrónico válido". El input se colorea en rojo. | **PASSED** |
| **TC-12** | Formulario (Éxito) | Rellenar todos los campos correctamente y pulsar enviar. | El botón cambia a estado "Enviando..." y se deshabilita. Tras 1.5s, aparece el mensaje de confirmación exitosa y los campos se limpian. | **PASSED** |
| **TC-13** | Descarga Certificados | Hacer clic en "Descargar PDF" en la sección de Certificaciones. | Inicia la descarga del archivo correspondiente sin errores 404. | **PASSED** |
| **TC-14** | Botón ir Arriba | Hacer scroll hacia abajo hasta que aparezca el botón flotante y hacer clic en él. | La página se desplaza de forma fluida hacia la sección del Hero. | **PASSED** |

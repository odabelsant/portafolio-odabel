import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';

test.describe('Formulario de Contacto E2E (API Mocked)', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
  });

  test('debe enviar exitosamente con respuesta mock 200 de Formspree', async ({ page }) => {
    // Intercept Formspree HTTP POST to prevent consumption of quotas
    await page.route('https://formspree.io/f/**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      } else {
        await route.continue();
      }
    });

    await contactPage.navigate();
    await contactPage.fillForm('John Doe', 'john.doe@example.com', 'Hola, este es un mensaje de validación automática.');
    await contactPage.submit();

    // Verify visual success message is displayed to the user
    await expect(contactPage.successAlert).toBeVisible();
    await expect(contactPage.successAlert).toContainText(/enviado con éxito|sent successfully/i);
  });

  test('debe mostrar error cuando Formspree API devuelve un estado 500', async ({ page }) => {
    // Intercept Formspree API and mock a server failure
    await page.route('https://formspree.io/f/**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      } else {
        await route.continue();
      }
    });

    await contactPage.navigate();
    await contactPage.fillForm('John Doe', 'john.doe@example.com', 'Hola, mensaje de validación de error.');
    await contactPage.submit();

    // Verify visual error message is displayed
    await expect(contactPage.errorAlert).toBeVisible();
    await expect(contactPage.errorAlert).toContainText(/error al enviar|error occurred/i);
  });
});

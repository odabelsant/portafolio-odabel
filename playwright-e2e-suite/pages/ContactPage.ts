import { Page, Locator } from '@playwright/test';

export class ContactPage {
  private page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly successAlert: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    // Map to element selectors in Contact.tsx
    this.nameInput = page.locator('#contact-name');
    this.emailInput = page.locator('#contact-email');
    this.messageInput = page.locator('#contact-message');
    this.submitButton = page.locator('#contact-submit-btn');
    this.successAlert = page.locator('[role="status"]');
    this.errorAlert = page.locator('[role="alert"]');
  }

  async navigate() {
    await this.page.goto('/');
    // Scroll to the contact section to ensure elements are within viewport
    await this.page.locator('#contact').scrollIntoViewIfNeeded();
  }

  async fillForm(name: string, email: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.messageInput.fill(message);
  }

  async submit() {
    await this.submitButton.click();
  }
}

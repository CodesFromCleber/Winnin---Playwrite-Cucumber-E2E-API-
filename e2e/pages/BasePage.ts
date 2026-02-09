import { Page, Locator } from '@playwright/test';
import { WaitStrategy } from '../helpers/wait.helper';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await WaitStrategy.waitForDomContentLoaded(this.page);
  }

  async waitForPageLoad(): Promise<void> {
    // Para sites externos, networkidle pode ser instável / válidar
  
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      // Se networkidle falhar, apenas aguarda domcontentloaded
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async clickElement(locator: Locator): Promise<void> {
    await WaitStrategy.waitForVisible(locator);
    await WaitStrategy.waitForStable(locator);
    await locator.click();
  }

  async getText(locator: Locator): Promise<string> {
    await WaitStrategy.waitForVisible(locator);
    return await locator.textContent() || '';
  }

  async getElementCount(locator: Locator): Promise<number> {
    await WaitStrategy.waitForDomContentLoaded(this.page);
    return await locator.count();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await WaitStrategy.waitForVisible(locator, 5000);
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async clickWithScroll(locator: Locator): Promise<void> {
    await WaitStrategy.waitForVisible(locator);
    await this.scrollToElement(locator);
    await WaitStrategy.waitForStable(locator);
    await locator.click();
  }

  async fillWithRetry(locator: Locator, text: string, maxAttempts: number = 3): Promise<void> {
    await WaitStrategy.retry(async () => {
      await WaitStrategy.waitForVisible(locator);
      await locator.fill(text);
      const value = await locator.inputValue();
      if (value !== text) {
        throw new Error('Fill verification failed');
      }
    }, maxAttempts);
  }

  async getTextArray(locator: Locator): Promise<string[]> {
    await WaitStrategy.waitForVisible(locator.first());
    const elements = await locator.all();
    const texts: string[] = [];
    
    for (const element of elements) {
      const text = await element.textContent();
      if (text) {
        texts.push(text.trim());
      }
    }
    
    return texts;
  }

  async waitForStable(locator: Locator): Promise<void> {
    await WaitStrategy.waitForStable(locator);
  }

  async takeElementScreenshot(locator: Locator, path: string): Promise<void> {
    await WaitStrategy.waitForVisible(locator);
    await locator.screenshot({ path });
  }

  async waitForUrlContains(urlPart: string, timeout: number = 10000): Promise<void> {
    await WaitStrategy.waitForUrlContains(this.page, urlPart, timeout);
  }

  async waitForMinElementCount(locator: Locator, minCount: number, timeout: number = 10000): Promise<number> {
    return await WaitStrategy.waitForMinCount(locator, minCount, timeout);
  }
}


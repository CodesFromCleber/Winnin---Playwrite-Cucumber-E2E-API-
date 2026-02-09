import { Page, Browser, BrowserContext } from '@playwright/test';

let currentPage: Page;
let currentBrowser: Browser;
let currentContext: BrowserContext;

export function setPage(page: Page): void {
  currentPage = page;
}

export function getPage(): Page {
  if (!currentPage) {
    throw new Error('Page não foi inicializado. Verifique os hooks.');
  }
  return currentPage;
}

export function setBrowser(browser: Browser): void {
  currentBrowser = browser;
}

export function getBrowser(): Browser {
  if (!currentBrowser) {
    throw new Error('Browser não foi inicializado. Verifique os hooks.');
  }
  return currentBrowser;
}

export function setContext(context: BrowserContext): void {
  currentContext = context;
}

export function getContext(): BrowserContext {
  if (!currentContext) {
    throw new Error('Context não foi inicializado. Verifique os hooks.');
  }
  return currentContext;
}

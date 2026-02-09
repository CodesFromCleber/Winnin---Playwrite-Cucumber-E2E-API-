import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { WaitStrategy } from '../helpers/wait.helper';

export class NewsPage extends BasePage {
  // Locators
  readonly articleTitle: Locator;
  readonly articleContent: Locator;
  readonly articleImage: Locator;
  readonly articleDate: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);
    
    this.articleTitle = page.locator('h1, [class*="content-head__title"]');
    this.articleContent = page.locator('article, [class*="content-text"], [class*="mc-article-body"]');
    this.articleImage = page.locator('article img, [class*="content-media"] img').first();
    this.articleDate = page.locator('time, [class*="content-publication-data"]');
    this.breadcrumb = page.locator('[class*="breadcrumb"], nav');
  }

  async verifyArticlePage(): Promise<boolean> {
    try {
      // Aguarda apenas domcontentloaded sem networkidle
      await this.page.waitForLoadState('domcontentloaded');
      
      // Verifica se está em uma página de notícia
      const urlIsArticle = this.page.url().includes('/futebol/') || 
                           this.page.url().includes('/noticia/') ||
                           this.page.url().includes('ge.globo.com');
      
      if (!urlIsArticle) return false;
      
      // Verifica se tem título OU conteúdo (flexível para diferentes layouts)
      const hasTitle = await this.articleTitle.isVisible({ timeout: 5000 }).catch(() => false);
      const hasContent = await this.articleContent.isVisible({ timeout: 5000 }).catch(() => false);
      
      return hasTitle || hasContent;
    } catch {
      return false;
    }
  }


  async isNewsPageLoaded(): Promise<boolean> {
    return await this.verifyArticlePage();
  }

  async getArticleTitle(): Promise<string> {
    return await this.getText(this.articleTitle);
  }

  async verifyArticleHasContent(): Promise<boolean> {
    const content = await this.articleContent.textContent();
    return (content?.length || 0) > 100; // Verifica se tem conteúdo substancial
  }

  async verifyArticleHasImage(): Promise<boolean> {
    return await this.isVisible(this.articleImage);
  }
}

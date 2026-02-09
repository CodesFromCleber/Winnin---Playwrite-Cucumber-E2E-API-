import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { WaitStrategy } from '../helpers/wait.helper';

export class TeamPage extends BasePage {
  // Locators
  readonly teamTitle: Locator;
  readonly teamLogo: Locator;
  readonly teamNews: Locator;
  readonly teamNewsCards: Locator;
  readonly teamStats: Locator;
  readonly teamName: Locator;
  readonly teamMenu: Locator;
  readonly subMenu: Locator;
  readonly teamMenu1: Locator;

  constructor(page: Page) {
    super(page);

    this.teamTitle = page.locator('h1, [class*="team-name"], [class*="clube-nome"]');
    this.teamLogo = page.locator('img[alt*="logo"], [class*="team-logo"], [class*="clube-escudo"]');
    this.teamNews = page.locator('article, [class*="feed-post"], [class*="news-item"]');
    this.teamNewsCards = page.locator('a[href*="/futebol/"]:has(h2), a[href*="/futebol/"]:has(h3)');
    this.teamStats = page.locator('[class*="stats"], [class*="tabela"]');
    this.teamName = page.locator('#busca-campo');
    
    this.teamMenu = page.locator('.mosaico__header-personalization--times-label').first();
    this.teamMenu1 = page.locator('.menu-button').first();
    this.subMenu = page.locator('.icons-escudo-header').first();
  }

  async selectTeamOnSearch(teamName: string): Promise<void> {
    await WaitStrategy.waitForVisible(this.teamName);
    await this.clickElement(this.teamName);
    await this.fillWithRetry(this.teamName, teamName);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  async selectTeamFromMenu(teamName: string = 'Palmeiras'): Promise<void> {
    await WaitStrategy.waitForNetworkIdle(this.page);
    
    await this.teamMenu.hover();
    await WaitStrategy.waitForVisible(this.subMenu);
    await this.clickElement(this.subMenu);
    
    await WaitStrategy.waitForNetworkIdle(this.page);
    
    const teamButton = this.page.getByRole('button', { name: teamName }).first();
    await this.clickElement(teamButton);
    await this.waitForPageLoad();
  }

  async verifyTeamPage(): Promise<boolean> {
    try {
      // Aguarda apenas domcontentloaded sem networkidle
      await this.page.waitForLoadState('domcontentloaded');

      // Verifica se está em uma página de time
      const urlIsTeam = this.page.url().includes('/futebol/times/') ||
        this.page.url().includes('/times/') ||
        this.page.url().includes('/equipes/') ||
        this.page.url().includes('ge.globo.com');

      if (!urlIsTeam) {
        return false;
      }

      // Verifica se tem conteúdo de time (título ou notícias)
      const hasTitle = await this.teamTitle.first().isVisible({ timeout: 5000 }).catch(() => false);
      const hasNews = await this.teamNewsCards.first().isVisible({ timeout: 5000 }).catch(() => false);

      return urlIsTeam && (hasTitle || hasNews);
    } catch {
      return false;
    }
  }

  /**
   * Alias para verifyTeamPage - para melhor semântica nos testes E2E
   */
  async isTeamPageLoaded(): Promise<boolean> {
    return await this.verifyTeamPage();
  }

  async getTeamNewsCount(): Promise<number> {
    await this.page.waitForLoadState('domcontentloaded');

    // Tenta pegar notícias específicas do time
    const newsCount = await this.teamNewsCards.count();

    if (newsCount > 0) {
      return newsCount;
    }

    // Fallback: conta articles
    return await this.teamNews.count();
  }

  async verifyTeamHasNews(): Promise<boolean> {
    const count = await this.getTeamNewsCount();
    return count > 0;
  }

  async getTeamName(): Promise<string> {
    try {
      const title = await this.teamTitle.first().textContent({ timeout: 5000 });
      return title?.trim() || 'Time';
    } catch {
      // Extrai o nome do time da URL
      const url = this.page.url();
      const match = url.match(/\/times\/([^\/]+)/);
      return match ? match[1].replace(/-/g, ' ') : 'Time';
    }
  }
}

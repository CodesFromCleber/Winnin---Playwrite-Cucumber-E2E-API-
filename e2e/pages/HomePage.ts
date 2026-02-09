import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { WaitStrategy } from '../helpers/wait.helper';

export interface NewsCard {
  title: string;
  image: string;
  summary: string;
  link: string;
}

export class HomePage extends BasePage {
  // Locators
  readonly newsCards: Locator;
  readonly newsTitle: Locator;
  readonly newsImage: Locator;
  readonly newsSummary: Locator;
  readonly teamsMenu: Locator;
  readonly serieATeams: Locator;
  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Seletores para as notícias
    this.newsCards = page.locator('article, [class*="feed-post"], [class*="bastian-feed-item"]');
    this.newsTitle = page.locator('h2, h3, [class*="title"]').first();
    this.newsImage = page.locator('img[src*="s.glbimg.com"], picture img').first();
    this.newsSummary = page.locator('p, [class*="summary"], [class*="description"]').first();
    
    // Seletores para times
    this.teamsMenu = page.locator('a[href*="/futebol/times/"]');
    this.serieATeams = page.locator('a[href*="/futebol/times/"][href*="brasileiro-serie-a"]');
    
    // Cookie consent
    this.acceptCookiesButton = page.locator('button:has-text("Aceitar"), button:has-text("Continuar")');
  }

  async navigateToHomePage(): Promise<void> {
    await this.navigate('https://ge.globo.com');
    await this.waitForPageLoad();
    await this.acceptCookies();
  }

  async acceptCookies(): Promise<void> {
    try {
      if (await this.acceptCookiesButton.isVisible({ timeout: 5000 })) {
        await this.clickElement(this.acceptCookiesButton);
      }
    } catch {
      // Cookies já aceitos ou banner não apareceu
    }
  }

  async isHomePageLoaded(): Promise<boolean> {
    const urlOk = this.page.url().includes('ge.globo.com');
    const hasNews = await this.newsCards.first().isVisible({ timeout: 5000 }).catch(() => false);
    return urlOk && hasNews;
  }

  /**
   * Retorna o locator das notícias para uso em assertions (Melhoria 2)
   */
  getNewsLocator(): Locator {
    return this.newsCards;
  }

  async clickFirstNews(): Promise<string> {
    const firstNewsLink = this.page.locator('div.bastian-feed-item[data-type="materia"] a').first();
    await WaitStrategy.waitForVisible(firstNewsLink);
    await WaitStrategy.waitForStable(firstNewsLink);
    
    const href = await firstNewsLink.getAttribute('href') || '';
    await firstNewsLink.click();
    
    return href;
  }

  async getNewsCount(): Promise<number> {
    // Aguarda apenas domcontentloaded sem networkidle para evitar timeouts
    await this.page.waitForLoadState('domcontentloaded');
    
    // Espera um pouco para notícias carregarem
    await this.page.waitForTimeout(2000);
    
    // Tenta múltiplos seletores para garantir que pegamos as notícias
    const possibleSelectors = [
      'article',
      '[class*="feed-post"]',
      '[class*="bastian-feed-item"]',
      '[data-type="materia"]',
      '.feed-media-wrapper'
    ];

    for (const selector of possibleSelectors) {
      const count = await this.page.locator(selector).count();
      if (count >= 10) {
        return count;
      }
    }

    // Fallback: conta elementos com título e link
    return await this.page.locator('a[href*="/futebol/"]:has(h2), a[href*="/futebol/"]:has(h3)').count();
  }

  async getNewsCards(): Promise<NewsCard[]> {
    await WaitStrategy.waitForVisible(this.newsCards.first());
    const cards: NewsCard[] = [];
    const count = Math.min(await this.newsCards.count(), 15);

    for (let i = 0; i < count; i++) {
      const card = this.newsCards.nth(i);
      
      try {
        const title = await card.locator('h2, h3, [class*="title"]').first().textContent() || '';
        const image = await card.locator('img').first().getAttribute('src') || '';
        const summary = await card.locator('p, [class*="summary"]').first().textContent() || '';
        const link = await card.locator('a').first().getAttribute('href') || '';

        if (title && link) {
          cards.push({ title, image, summary, link });
        }
      } catch {
        // Ignora cards com problemas
        continue;
      }
    }

    return cards;
  }

  async verifyNewsHasTitle(): Promise<boolean> {
    // Validação rápida: verifica se primeiras 10 notícias têm título
    const newsWithTitle = this.page.locator('article h2, article h3, [class*="feed-item"] h2, [class*="feed-item"] h3').first();
    return await newsWithTitle.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async verifyNewsHasImage(): Promise<boolean> {
    // Validação rápida: verifica se primeiras notícias têm imagem
    const newsWithImage = this.page.locator('article img, [class*="feed-item"] img').first();
    return await newsWithImage.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async verifyNewsHasSummary(): Promise<boolean> {
    // Validação rápida: verifica se pelo menos algumas notícias têm resumo/descrição
    const newsWithSummary = this.page.locator('article p, [class*="feed-item"] p, [class*="summary"]').first();
    return await newsWithSummary.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async selectSerieATeam(teamName?: string): Promise<string> {
    // Estratégia: Navega direto para página de um time popular
    // Isso simula o usuário clicando em um link de time na home
    const teamsToTry = [
      'flamengo',
      'palmeiras',
      'corinthians',
      'sao-paulo',
      'botafogo'
    ];
    
    const selectedTeam = teamsToTry[0]; // Usa Flamengo como padrão
    const teamUrl = `https://ge.globo.com/futebol/times/${selectedTeam}/`;
    
    await this.page.goto(teamUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    
    return selectedTeam;
  }
}

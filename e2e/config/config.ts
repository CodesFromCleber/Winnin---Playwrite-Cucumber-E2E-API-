/**
 * Configurações globais do projeto de testes
 */

export const CONFIG = {
  // URLs
  BASE_URL: 'https://ge.globo.com',
  
  // Timeouts (em milissegundos)
  TIMEOUT: {
    DEFAULT: 30000,
    NAVIGATION: 30000,
    ELEMENT: 10000,
    SHORT: 5000,
    LONG: 60000,
  },
  
  // Delays
  DELAY: {
    SHORT: 1000,
    MEDIUM: 2000,
    LONG: 3000,
  },
  
  // Browser
  BROWSER: {
    HEADLESS: process.env.HEADLESS !== 'false',
    SLOW_MO: 50,
    VIEWPORT: {
      WIDTH: 1920,
      HEIGHT: 1080,
    },
  },
  
  // Seletores comuns
  SELECTORS: {
    COOKIES_ACCEPT: 'button:has-text("Aceitar"), button:has-text("Continuar")',
    NEWS_ARTICLE: 'article, [class*="feed-post"], [class*="bastian-feed-item"]',
    NEWS_TITLE: 'h2, h3, [class*="title"]',
    NEWS_IMAGE: 'img[src*="s.glbimg.com"], picture img',
    NEWS_LINK: 'a[href*="/futebol/"]',
  },
  
  // Critérios de aceite
  ACCEPTANCE_CRITERIA: {
    MIN_NEWS_COUNT: 10,
    MIN_TEAM_NEWS_COUNT: 1,
    MIN_CONTENT_LENGTH: 100,
  },
  
  // Times da Série A (2024)
  SERIE_A_TEAMS: [
    'flamengo',
    'palmeiras',
    'atletico-mg',
    'corinthians',
    'sao-paulo',
    'fluminense',
    'internacional',
    'atletico-pr',
    'santos',
    'botafogo',
    'gremio',
    'bahia',
    'cruzeiro',
    'vasco',
    'fortaleza',
    'bragantino',
    'cuiaba',
    'goias',
    'coritiba',
    'america-mg',
  ],
};

export default CONFIG;

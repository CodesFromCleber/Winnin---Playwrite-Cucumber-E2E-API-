import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NewsPage } from '../pages/NewsPage';
import { TeamPage } from '../pages/TeamPage';
import { getPage } from '../support/world';

// Define timeout padrão de 60 segundos
setDefaultTimeout(60000);

let homePage: HomePage;
let newsPage: NewsPage;
let teamPage: TeamPage;

// ============================================
// GIVEN - Precondições
// ============================================

Given('que o usuário acessa a página inicial do GE', async function () {
  const page = getPage();
  homePage = new HomePage(page);
  
  await homePage.navigateToHomePage();
});

// ============================================
// WHEN - Ações
// ============================================

When('clicar em uma notícia', async function () {
  await homePage.clickFirstNews();
  
  const page = getPage();
  newsPage = new NewsPage(page);
  
  await page.waitForLoadState('domcontentloaded');
});

When('selecionar um time da Série A', async function () {
  const teamName = await homePage.selectSerieATeam();
  this.selectedTeam = teamName;
  
  const page = getPage();
  teamPage = new TeamPage(page);
  
  await page.waitForLoadState('domcontentloaded');
});

// ============================================
// THEN - Verificações
// ============================================
Then('o logo do GE deve estar visível', async function () {
  const logo = this.page.locator('#logo-ge-alternative');
  await expect(logo).toBeVisible();
});

Then('devem ser exibidas no mínimo {int} notícias', async function (minCount: number) {
  const newsCount = await homePage.getNewsCount();
  
  console.log(`Notícias encontradas: ${newsCount}`);
  expect(newsCount).toBeGreaterThanOrEqual(minCount);
});

Then('a página inicial do GE deve estar acessível', async function () {
  const isLoaded = await homePage.isHomePageLoaded();
  expect(isLoaded).toBeTruthy();
});

Then('cada notícia deve conter título, imagem e resumo', async function () {
  // Verifica se todas as notícias têm título
  const hasTitle = await homePage.verifyNewsHasTitle();
  expect(hasTitle).toBeTruthy();
  
  // Verifica se todas as notícias têm imagem
  const hasImage = await homePage.verifyNewsHasImage();
  expect(hasImage).toBeTruthy();
  
  // Verifica se pelo menos 50% das notícias têm resumo
  // (algumas notícias podem não ter resumo visível)
  const hasSummary = await homePage.verifyNewsHasSummary();
  expect(hasSummary).toBeTruthy();
});

Then('deve ser redirecionado para a matéria completa', async function () {
  const isArticlePage = await newsPage.verifyArticlePage();
  expect(isArticlePage).toBeTruthy();
  
  // Verifica se a matéria tem conteúdo
  const hasContent = await newsPage.verifyArticleHasContent();
  expect(hasContent).toBeTruthy();
});

Then('deve ser redirecionado para a página do clube', async function () {
  const isTeamPage = await teamPage.verifyTeamPage();
  expect(isTeamPage).toBeTruthy();
});

Then('visualizar notícias relacionadas ao time', async function () {
  const hasNews = await teamPage.verifyTeamHasNews();
  expect(hasNews).toBeTruthy();
  
  const newsCount = await teamPage.getTeamNewsCount();
  console.log(`Notícias do time encontradas: ${newsCount}`);
  expect(newsCount).toBeGreaterThan(0);
});

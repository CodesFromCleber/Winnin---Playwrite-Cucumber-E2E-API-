import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TeamPage } from '../pages/TeamPage';


test.describe('Home GE - validando noticias', () => {

  test('Deve acessar home GE com sucesso', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigateToHomePage();
    console.log(`URL atual: ${page.url()}`);
  });

  test('Deve exibir no mínimo 10 notícias', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigateToHomePage();

    const count = await home.getNewsCount();
    expect(count).toBeGreaterThanOrEqual(10);
    console.log(`Total de notícias encontradas: ${count}`);
  });


  test('Deve abrir matéria completa ao clicar em uma notícia', async ({ page }) => {
    const home = new HomePage(page);
    await home.navigateToHomePage();
    await home.clickFirstNews();
    await expect(page).toHaveURL(/ge.globo.com/);
  });

  test('Deve acessar página de time da Série A', async ({ page }) => {
    const home = new HomePage(page);
    const team = new TeamPage(page);
    await home.navigateToHomePage();
    await team.selectTeamFromMenu();

  });
  
});

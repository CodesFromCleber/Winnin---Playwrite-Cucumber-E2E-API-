import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NewsPage } from '../pages/NewsPage';
import { TeamPage } from '../pages/TeamPage';
import { AssertionHelper } from '../helpers/assertion.helper';


test.setTimeout(120000);

/**
 * TESTES E2E - GE.GLOBO.COM
 * 
 * Cenários modelados em BDD (home.feature):
 * 1. A página inicial do GE deve estar acessível
 * 2. Deve exibir no mínimo 10 notícias
 * 3. Cada notícia contém: título, imagem e resumo
 * 4. Ao clicar em notícia, redireciona para matéria completa
 * 5. Ao selecionar time Série A, redireciona para página do clube
 */

test.describe('Acessar GE.GLOBO.COM - Notícias Esportivas', () => {
  
  /**
   * Cenário 1: Validar acesso à página inicial do GE
   * Dado que: o usuário acessa a página inicial do GE
   * Então: a página inicial do GE deve estar acessível
   */
  test('Test_01 - Deve acessar a página inicial do GE com sucesso', async ({ page }) => {
    const home = new HomePage(page);
    
    await home.navigateToHomePage();
    await AssertionHelper.expectPageAccessible(page, /ge\.globo\.com/);
    console.log(`✓ Página inicial acessada: ${page.url()}`);
  });

  /**
   * Cenário 2: Exibir quantidade mínima de notícias na home
   * Dado que: o usuário acessa a página inicial do GE
   * Então: devem ser exibidas no mínimo 10 notícias
   */
  test('Test_02 - Deve exibir no mínimo 10 notícias na página inicial', async ({ page }) => {
    const home = new HomePage(page);
     
    await home.navigateToHomePage();
    const newsCount = await home.getNewsCount();
    await AssertionHelper.expectMinCount(
      home.getNewsLocator(),
      10,
      `Esperado no mínimo 10 notícias, mas encontrou ${newsCount}`
    );
    console.log(`✓ Notícias encontradas: ${newsCount}`);
  });

  /**
   * Cenário 3: Validar estrutura das notícias
   * Dado que: o usuário acessa a página inicial do GE
   * Então: cada notícia deve conter título, imagem e resumo
   */
  test('Test_03 - Cada notícia deve conter título, imagem e resumo', async ({ page }) => {
    const home = new HomePage(page);
      
    await home.navigateToHomePage();
    const hasTitle = await home.verifyNewsHasTitle();
    await AssertionHelper.expectCustom(
      hasTitle,
      '✗ Nem todas as notícias contêm título'
    );
    console.log('✓ Todas as notícias contêm título');


    const hasImage = await home.verifyNewsHasImage();
    await AssertionHelper.expectCustom(
      hasImage,
      '✗ Nem todas as notícias contêm imagem destacada'
    );
    console.log('✓ Todas as notícias contêm imagem destacada');

    //Verifica resumos (mínimo 50% das notícias)
    const hasSummary = await home.verifyNewsHasSummary();
    await AssertionHelper.expectCustom(
      hasSummary,
      '✗ A maioria das notícias não contém resumo'
    );
    console.log('✓ Notícias contêm resumo (ou descrição)');
  });

  /**
   * Cenário 4: Acessar matéria completa ao clicar em notícia
   * Dado que: o usuário acessa a página inicial do GE
   * Quando: clicar em uma notícia
   * Então: deve ser redirecionado para a matéria completa
   */
  test('Test_04 - Ao clicar em notícia, deve abrir a matéria completa', async ({ page }) => {
    const home = new HomePage(page);
    const news = new NewsPage(page);
   
    await home.navigateToHomePage();
    await home.clickFirstNews();
    
    await AssertionHelper.expectPageAccessible(page, /ge\.globo\.com/);
    const isNewsPageLoaded = await news.isNewsPageLoaded();
    await AssertionHelper.expectCustom(
      isNewsPageLoaded,
      '✗ A página da notícia não carregou corretamente'
    );
    console.log(`✓ Matéria completa acessada: ${page.url()}`);
  });

  /**
   * Cenário 5: Acessar página de um time da Série A
   * Dado que: o usuário acessa a página inicial do GE
   * Quando: selecionar um time da Série A do Campeonato Brasileiro
   * Então: deve ser redirecionado para a página do clube com notícias relacionadas
   */
  test('Test_05 - Ao selecionar time Série A, exibir página do clube', async ({ page }) => {
    const home = new HomePage(page);
    const team = new TeamPage(page);
    
    await home.navigateToHomePage();
    const selectedTeam = await home.selectSerieATeam();
    
    const isTeamPageLoaded = await team.isTeamPageLoaded();
    await AssertionHelper.expectCustom(
      isTeamPageLoaded,
      `✗ Página do time ${selectedTeam} não carregou corretamente`
    );
    console.log(`✓ Página do time ${selectedTeam} acessada com sucesso`);
    
    // implementar>> Bonus: Verificar se existem notícias relacionadas ao time
    const teamNewsCount = await team.getTeamNewsCount();
    console.log(`✓ Notícias do time encontradas: ${teamNewsCount}`);
  });
});

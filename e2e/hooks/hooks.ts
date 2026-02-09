import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { setPage, setBrowser, setContext, getPage, getBrowser, getContext } from '../support/world';

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  console.log('🚀 Iniciando browser...');
  
  // Configurações do browser
  const headless = process.env.HEADLESS !== 'false';
  const browserType = process.env.BROWSER || 'chromium';
  
  browser = await chromium.launch({
    headless: headless,
    slowMo: 50, // Adiciona um pequeno delay entre ações para estabilidade
  });
  
  setBrowser(browser);
  console.log(`✅ Browser ${browserType} iniciado (headless: ${headless})`);
});

Before(async function (scenario) {
  console.log(`\n📝 Iniciando cenário: ${scenario.pickle.name}`);
  
  // Cria um novo contexto para cada cenário
  context = await getBrowser().newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    permissions: ['geolocation'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  setContext(context);
  
  // Cria uma nova página
  const page = await context.newPage();
  setPage(page);
  
  // Configurações da página
  await page.setDefaultTimeout(30000);
  await page.setDefaultNavigationTimeout(30000);
});

After(async function (scenario) {
  const page = getPage();
  
  // Captura screenshot em caso de falha
  if (scenario.result?.status === Status.FAILED) {
    console.log(`❌ Cenário falhou: ${scenario.pickle.name}`);
    
    try {
      const screenshot = await page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
      
      // Salva informações de debug
      const url = page.url();
      this.attach(`URL: ${url}`, 'text/plain');
      
      console.log(`📸 Screenshot capturado: ${url}`);
    } catch (error) {
      console.error('Erro ao capturar screenshot:', error);
    }
  } else {
    console.log(`✅ Cenário passou: ${scenario.pickle.name}`);
  }
  
  // Fecha a página e o contexto
  await page.close();
  await getContext().close();
});

AfterAll(async function () {
  console.log('\n🏁 Finalizando testes...');
  
  if (browser) {
    await browser.close();
    console.log('✅ Browser fechado');
  }
});

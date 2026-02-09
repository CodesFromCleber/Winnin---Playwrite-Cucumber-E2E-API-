# Documentação de Arquitetura - Testes E2E

## Arquitetura do Projeto

### Visão Geral

Este projeto segue uma arquitetura em camadas, separando responsabilidades e facilitando manutenção e escalabilidade.

```
┌─────────────────────────────────────────────────────────┐
│                    Layer 1: BDD                         │
│              Features Files (.feature)                  │
│         Cenários escritos em Gherkin (PT-BR)            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Layer 2: Step Definitions                  │
│         Implementação dos steps do Cucumber             │
│         Orquestra chamadas aos Page Objects             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│               Layer 3: Page Objects                     │
│        Abstração das páginas e suas interações          │
│        (HomePage, NewsPage, TeamPage)                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Layer 4: Base Page                       │
│         Métodos comuns reutilizáveis                    │
│         (navigate, click, getText, etc.)                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│               Layer 5: Playwright API                   │
│         Framework de automação de navegadores           │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Módulos e Responsabilidades

### 1. Features (`e2e/features/`)

**Responsabilidade:** Definir cenários de teste em linguagem natural (Gherkin)

**Arquivos:**
- `home.feature` - Cenários da página inicial

**Características:**
- Escrito em português
- Segue sintaxe Gherkin (Given/When/Then)
- Serve como documentação viva
- Facilita comunicação com stakeholders

**Exemplo:**
```gherkin
Feature: Exibição de notícias
  Scenario: Validar quantidade de notícias
    Given que o usuário acessa a página inicial do GE
    Then devem ser exibidas no mínimo 10 notícias
```

### 2. Step Definitions (`e2e/steps/`)
**Arquivos:**
- `home.steps.ts` - Implementação dos steps da home

**Características:**
- Mapeia steps do Gherkin para código TypeScript
- Usa decorators do Cucumber (@Given, @When, @Then)
- Orquestra chamadas aos Page Objects
- Contém assertions (expect)

**Exemplo:**
```typescript
Then('devem ser exibidas no mínimo {10 notícias', async function (minCount: number) {
  const newsCount = await homePage.getNewsCount();
  expect(newsCount).toBeGreaterThanOrEqual(minCount);
});
```

### 3. Page Objects (`e2e/pages/`)

**Arquivos:**
- `BasePage.ts` - Classe base com métodos comuns
- `HomePage.ts` - Página inicial do GE
- `NewsPage.ts` - Página de notícia individual
- `TeamPage.ts` - Página de time específico

**Estrutura:**
```typescript
export class HomePage extends BasePage {
  // 1. Locators (seletores)
  readonly newsCards: Locator;
  readonly newsTitle: Locator;
  
  // 2. Constructor
  constructor(page: Page) {
    super(page);
    this.newsCards = page.locator('article');
  }
  
  // 3. Métodos de interação
  async getNewsCount(): Promise<number> {
    return await this.newsCards.count();
  }
  
  // 4. Métodos de verificação
  async verifyNewsHasTitle(): Promise<boolean> {
    // lógica de verificação
  }
}
```

---

### 4. Hooks (`e2e/hooks/`)
**Arquivos:**
- `hooks.ts` - Before, After, BeforeAll, AfterAll

**Funções:**
- `BeforeAll`: Inicializa o browser
- `Before`: Cria contexto e página para cada cenário
- `After`: Captura screenshots em falhas, fecha página
- `AfterAll`: Fecha o browser

**Exemplo:**
```typescript
Before(async function (scenario) {
  context = await browser.newContext();
  const page = await context.newPage();
  setPage(page);
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await page.screenshot();
    this.attach(screenshot, 'image/png');
  }
});
```

---

### 5. Support (`e2e/support/`)
**Arquivos:**
- `world.ts` - Gerencia instâncias de Page, Browser, Context

**Funções:**
- `setPage()` / `getPage()`
- `setBrowser()` / `getBrowser()`
- `setContext()` / `getContext()`

**Padrão Singleton:**
Mantém uma única instância compartilhada entre steps.

---

### 6. Utils (`e2e/utils/`)
**Arquivos:**
- `helpers.ts` - Funções auxiliares (WaitHelper, StringHelper, etc.)
- `generate-report.js` - Gerador de relatórios HTML

**Classes disponíveis:**
- `WaitHelper` - Métodos para esperas
- `DateHelper` - Formatação de datas
- `StringHelper` - Manipulação de strings
- `UrlHelper` - Validação de URLs

---

### 7. Config (`e2e/config/`)
**Arquivos:**
- `config.ts` - Constantes e configurações

**Conteúdo:**
- URLs base
- Timeouts
- Seletores comuns
- Critérios de aceite
- Lista de times da Série A

---

## 🎯 Design Patterns Utilizados

### 1. Page Object Model (POM)

### 2. Singleton

### 3. Template Method

### 4. Builder

---

## 🔧 Estratégias de Resiliência

### 1. Múltiplos Seletores (Fallback)
```typescript
const selectors = [
  'article',
  '[class*="feed-post"]',
  '[data-type="materia"]'
];

for (const selector of selectors) {
  const count = await page.locator(selector).count();
  if (count > 0) return count;
}
```

### 2. Waits Inteligentes
```typescript
// Aguarda elemento estar visível
await element.waitFor({ state: 'visible', timeout: 5000 });

// Aguarda carregamento da rede
await page.waitForLoadState('networkidle');

// Wait explícito quando necessário
await page.waitForTimeout(2000);
```

### 3. Try-Catch para Elementos Opcionais
```typescript
async acceptCookies(): Promise<void> {
  try {
    if (await this.cookiesButton.isVisible({ timeout: 5000 })) {
      await this.cookiesButton.click();
    }
  } catch {
    // Cookies já aceitos
  }
}
```

### 4. Screenshots em Falhas
Automaticamente captura evidências quando um teste falha.

---

## 📊 Relatórios

### 1. Cucumber JSON
Raw data para processamento posterior.

### 2. Cucumber HTML
Relatório visual amigável com:
- Suíte de testes
- Steps executados
- Screenshots de falhas
- Tempo de execução
- Metadata

### 3. Playwright Report
Relatório nativo do Playwright com traces.

---

## 🔐 Segurança

### Boas Práticas Implementadas

- ✅ Cookies e dados sensíveis não versionados (.gitignore)
- ✅ Variáveis de ambiente para configurações
- ✅ User-Agent real para evitar bloqueios
- ✅ Rate limiting respeitado (delays entre requisições)

---

## 📈 Métricas e Monitoramento

### Métricas Capturadas

- ✅ Tempo de execução dos cenários
- ✅ Taxa de sucesso/falha
- ✅ Screenshots de falhas
- ✅ Logs detalhados

### Visualização

Relatório HTML gerado automaticamente após execução:
```bash
npm run report
```

---

## 🎓 Conceitos Aplicados

### BDD (Behavior Driven Development)

### TDD (Test Driven Development)

### DRY (Don't Repeat Yourself)

### SOLID


---

## 📚 Referências

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [BDD Best Practices](https://cucumber.io/docs/bdd/)

---

**Última atualização:** Dia 08 de Fevereiro de 2026

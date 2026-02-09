# 🏆 Desafio Técnico - Quality Assurance (QA) 

Projeto de testes automatizados E2E e API para o portal **GE Globo Esporte**, desenvolvido com **Playwright** e **Cucumber (BDD)**.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução dos Testes](#execução-dos-testes)
- [Relatórios](#relatórios)
- [Critérios de Aceite](#critérios-de-aceite)
- [Padrões e Boas Práticas](#padrões-e-boas-práticas)

---

## 🎯 Sobre o Projeto

Este projeto implementa testes automatizados end-to-end (E2E) para o portal **ge.globo.com**, validando os principais fluxos de navegação e exibição de notícias esportivas.

### Objetivos

- ✅ Validar a exibição de notícias na página inicial
- ✅ Garantir a estrutura correta das notícias (título, imagem, resumo)
- ✅ Verificar a navegação para matérias completas
- ✅ Validar o acesso às páginas de times da Série A

---

## 🚀 Tecnologias Utilizadas

- **[Playwright](https://playwright.dev/)** - Framework de automação de navegadores
- **[Cucumber](https://cucumber.io/)** - Framework BDD (Behavior Driven Development)
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação

- **Node.js** - Ambiente de execução JavaScript

### Dependências Principais

```json
{
  "@playwright/test": "^1.41.0",
  "@cucumber/cucumber": "^10.3.1",
  "typescript": "^5.3.3",
  "cucumber-html-reporter": "^7.1.1"
}
```

---

## 📁 Estrutura do Projeto

```
winning/
├── api/
│   ├── config/
│   │   ├── api.config.ts          # Configurações da API
│   │   ├── global.setup.ts        # Setup global (valida API)
│   │   └── global.teardown.ts     # Teardown global
│   ├── client/
│   │   └── api.client.ts          # Cliente HTTP reutilizável
│   ├── fixtures/
│   │   └── api.fixture.ts         # Fixtures do Playwright
│   ├── helpers/
│   │   └── data.helper.ts         # Geradores de dados únicos
│   └── tests/
│       ├── usuarios.spec.ts       # Testes de /usuarios
│       ├── login.spec.ts          # Testes de /login
│       ├── produtos.spec.ts       # Testes de /produtos
│       └── carrinhos.spec.ts      # Testes de /carrinhos
├── e2e/
│   ├── config/
│   │   └── config.ts              # Configurações globais
│   ├── features/
│   │   └── home.feature           # Cenários BDD em Gherkin
│   ├── hooks/
│   │   └── hooks.ts               # Hooks do Cucumber (Before/After)
│   ├── pages/
│   │   ├── BasePage.ts            # Classe base para Page Objects
│   │   ├── HomePage.ts            # Page Object da página inicial
│   │   ├── NewsPage.ts            # Page Object da página de notícia
│   │   └── TeamPage.ts            # Page Object da página de time
│   ├── steps/
│   │   └── home.steps.ts          # Step Definitions
│   ├── support/
│   │   └── world.ts               # Configuração do World (contexto)
│   └── utils/
│       ├── generate-report.js     # Gerador de relatórios HTML
│       └── helpers.ts             # Funções auxiliares
├── reports/                        # Relatórios gerados (git ignored)
├── playwright-report/              # Relatórios Playwright (git ignored)
├── test-results/                   # Resultados dos testes (git ignored)
├── .gitignore
├── .env.example                    # Variáveis de ambiente de exemplo
├── API_TESTING.md                  # Documentação de testes de API
├── ARCHITECTURE.md                 # Documentação de arquitetura E2E
├── CHECKLIST.md                    # Checklist de requisitos
├── QUICKSTART.md                   # Guia rápido de inicialização
├── cucumber.js                     # Configuração do Cucumber
├── package.json
├── playwright.config.ts            # Configuração do Playwright E2E
├── playwright-api.config.ts        # Configuração do Playwright API
├── tsconfig.json
└── README.md
```

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git**

Verifique as versões:

```bash
node --version  # v18.0.0 ou superior
npm --version   # 9.0.0 ou superior
```

---

## 📦 Instalação

### 1. Clone o repositório (ou inicialize o projeto)

```bash
git clone <url-do-repositorio>
cd winning
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale os navegadores do Playwright

```bash
npx playwright install
```

ou apenas o Chromium:

```bash
npx playwright install chromium
```

---

## 🧪 Execução dos Testes

### Comandos Disponíveis

#### Executar todos os testes E2E (headless)
```bash
npm run test:e2e
```

#### Executar com navegador visível (headed mode)
```bash
npm run test:e2e:headed
```

#### Executar em navegadores específicos

**Chrome:**
```bash
npm run test:e2e:chrome
```

**Firefox:**
```bash
npm run test:e2e:firefox
```

**Safari (WebKit):**
```bash
npm run test:e2e:webkit
```

#### Gerar relatório HTML
```bash
npm run report
```

### 🔌 Testes de API (ServeRest)

Para detalhes completos sobre os testes de API, consulte [API_TESTING.md](API_TESTING.md).

#### Pré-requisito: Iniciar ServeRest

```bash
# Opção 1: NPX (Recomendado)
npx serverest@latest

# Opção 2: Docker
docker run -p 3000:3000 paulogr/serverest:latest
```

#### Executar testes de API
```bash
npm run test:api
```

#### Executar com interface interativa
```bash
npm run test:api:ui
```

#### Debug de testes de API
```bash
npm run test:api:debug
```

#### Usar ServeRest público
```bash
export API_BASE_URL=https://serverest.dev
npm run test:api
```

#### Executar todos os testes (E2E + API)
```bash
npm run test:all
```

---

## 📊 Relatórios

Após a execução dos testes, os relatórios são gerados automaticamente:

### Cucumber HTML Report

Localização: `reports/cucumber_report.html`

Execute `npm run report` para gerar e abrir o relatório detalhado com:
- ✅ Resumo de execução
- 📸 Screenshots de falhas
- ⏱️ Tempo de execução
- 📝 Steps executados

### Relatórios JSON

- `reports/cucumber_report.json` - Relatório Cucumber em JSON
- `test-results/results.json` - Relatório Playwright em JSON

---

## 📝 Critérios de Aceite

Os critérios de aceite foram modelados em **BDD (Gherkin)** e implementados nos testes:

### 1️⃣ Exibição de Notícias

**Critério:**
```gherkin
Scenario: Exibir quantidade mínima de notícias na home
  Given que o usuário acessa a página inicial do GE
  Then devem ser exibidas no mínimo 10 notícias
```

**Validação:**
- A página inicial deve exibir **no mínimo 10 notícias**

---

### 2️⃣ Estrutura das Notícias

**Critério:**
```gherkin
Scenario: Validar estrutura das notícias
  Given que o usuário acessa a página inicial do GE
  Then cada notícia deve conter título, imagem e resumo
```

**Validação:**
- Cada notícia deve conter:
  - ✅ **Título** - Texto descritivo
  - ✅ **Imagem destacada** - URL válida da imagem
  - ✅ **Resumo** - Descrição da notícia
  - ✅ **Link** - URL para matéria completa

---

### 3️⃣ Navegação para Matéria Completa

**Critério:**
```gherkin
Scenario: Acessar matéria completa ao clicar em notícia
  Given que o usuário acessa a página inicial do GE
  When clicar em uma notícia
  Then deve ser redirecionado para a matéria completa
```

**Validação:**
- Ao clicar na notícia, o usuário é redirecionado
- A página da matéria contém:
  - ✅ Título do artigo (H1)
  - ✅ Conteúdo completo (mínimo 100 caracteres)
  - ✅ URL contém `/futebol/` ou `/noticia/`

---

### 4️⃣ Navegação para Página de Time

**Critério:**
```gherkin
Scenario: Acessar página de um time da Série A
  Given que o usuário acessa a página inicial do GE
  When selecionar um time da Série A
  Then deve ser redirecionado para a página do clube
  And visualizar notícias relacionadas ao time
```

**Validação:**
- Ao selecionar um time da Série A, o usuário é redirecionado
- A página do time contém:
  - ✅ URL contém `/futebol/times/`
  - ✅ Notícias relacionadas ao time
  - ✅ Pelo menos 1 notícia visível

---

## ✨ Requisitos de Qualidade

### 1️⃣ Organização e Estrutura do Projeto

**✅ Implementado:**

```
e2e/
├── config/          # Configurações centralizadas
├── features/        # Cenários BDD separados
├── hooks/           # Setup/Teardown isolados
├── pages/           # Page Objects organizados
├── steps/           # Step Definitions claros
├── support/         # Suporte e helpers
├── tests/           # Testes reutilizáveis
└── utils/           # Utilitários e relatórios
```


### 2️⃣ Boas Práticas de Automação

**✅ Implementadas:**

- **Page Object Model (POM)**
  ```typescript
  // Separação: Elementos (Locators) vs Ações (Methods)
  readonly newsCards: Locator;
  async getNewsCount(): Promise<number> { ... }
  ```

- **Herança com BasePage**
  ```typescript
  // Métodos reutilizáveis em todas as páginas
  async navigate(url: string)
  async clickElement(locator: Locator)
  async getText(locator: Locator)
  ```

- **Waits Inteligentes**
  ```typescript
  // Múltiplos seletores com fallback automático
  for (const selector of possibleSelectors) {
    const count = await this.page.locator(selector).count();
    if (count >= 10) return count;
  }
  ```

- **TypeScript com Tipagem Forte**
  ```typescript
  // Interface para dados estruturados
  export interface NewsCard {
    title: string;
    image: string;
    summary: string;
    link: string;
  }
  ```

---

### 3️⃣ Isolamento e Independência dos Testes

**✅ Implementação:**

**Hooks BeforeAll/Before:**
```typescript
BeforeAll(async function () {
  // Browser criado UMA VEZ
  browser = await chromium.launch();
});

Before(async function (scenario) {
  // Novo contexto e página para CADA cenário
  context = await browser.newContext();
  const page = await context.newPage();
  setPage(page);
});
```
---

### 4️⃣ Estratégia de Limpeza de Dados (Cleanup)

**✅ Implementada nos Hooks:**

```typescript
After(async function (scenario) {
  const page = getPage();
  
  // Captura evidências se falhar
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  
  // CLEANUP: Fecha tudo ao final
  await page.close();           // ← Fecha página
  await getContext().close();   // ← Fecha contexto
  // localStorage, cookies e cache são descartados
});

AfterAll(async function () {
  // CLEANUP: Fecha browser ao final de tudo
  if (browser) {
    await browser.close();      // ← Fecha browser
  }
});
```

**O que é limpo:**
- 🗑️ Cookies e localStorage (cada novo contexto)
- 🗑️ Cache do navegador
- 🗑️ Histórico de páginas
- 🗑️ Variáveis globais (reinicializadas)


### 5️⃣ Clareza dos Cenários e Validações

**✅ Cenários em Gherkin (Linguagem Natural):**

```gherkin
# language: pt
Feature: Exibição de notícias esportivas na página inicial
  Como um usuário padrão do portal GE
  Eu quero visualizar as últimas notícias esportivas
  Para me manter informado sobre o mundo do esporte

  Scenario: Validar quantidade mínima de notícias na home
    Given que o usuário acessa a página inicial do GE
    Then devem ser exibidas no mínimo 10 notícias
```

**Validações Implementadas:**
```typescript
// Step Definition com assertions claras
Then('devem ser exibidas no mínimo {int} notícias', async function (minCount) {
  const newsCount = await homePage.getNewsCount();
  console.log(`📰 Notícias encontradas: ${newsCount}`);
  expect(newsCount).toBeGreaterThanOrEqual(minCount);  // ← Validação clara
});
```

---

### 6️⃣ Legibilidade e Manutenibilidade do Código

**✅ Implementadas:**

**Nomenclatura Clara:**
```typescript
// ❌ Ruim
async getN(): Promise<number>

// ✅ Bom
async getNewsCount(): Promise<number>
```

**Comentários em Pontos Críticos:**
```typescript
// Aguarda o carregamento das notícias
await this.page.waitForTimeout(3000);

// Tenta múltiplos seletores para garantir que pegamos as notícias
const possibleSelectors = ['article', '[class*="feed-post"]', ...];
```

**Métodos Pequenos e Focados:**
```typescript
// Cada método tem sua função
async navigateToHomePage(): Promise<void> { ... }
async getNewsCount(): Promise<number> { ... }
async verifyNewsHasTitle(): Promise<boolean> { ... }
```

**DRY (Don't Repeat Yourself):**
```typescript
// ❌ Repetição - Em Home, News e Team
await this.page.goto(url);
await this.page.waitFor({ state: 'visible' });

// ✅ Abstração - BasePage (reutilizável)
async navigate(url: string): Promise<void> { ... }
async isVisible(locator: Locator): Promise<boolean> { ... }
```

**Tratamento de Erros:**
```typescript
async acceptCookies(): Promise<void> {
  try {
    if (await this.acceptCookiesButton.isVisible({ timeout: 5000 })) {
      await this.acceptCookiesButton.click();
    }
  } catch {
    // Cookies já aceitos ou banner não apareceu
  }
}
```

## 🎨 Padrões e Boas Práticas

### Page Object Model (POM)

O projeto utiliza o padrão **Page Object Model** para:
- ✅ Separar a lógica de página dos testes
- ✅ Facilitar manutenção
- ✅ Reutilizar código
- ✅ Aumentar legibilidade

**Exemplo:**

```typescript
// HomePage.ts
export class HomePage extends BasePage {
  async navigateToHomePage(): Promise<void> {
    await this.navigate('https://ge.globo.com');
  }

  async getNewsCount(): Promise<number> {
    return await this.newsCards.count();
  }
}
```

### BDD (Behavior Driven Development)

Cenários escritos em **Gherkin** (linguagem natural):

```gherkin
Feature: Exibição de notícias esportivas
  
  Scenario: Validar estrutura das notícias
    Given que o usuário acessa a página inicial do GE
    Then cada notícia deve conter título, imagem e resumo
```


### Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│      Features (BDD/Gherkin)         │  ← Cenários de negócio
├─────────────────────────────────────┤
│      Step Definitions               │  ← Implementação dos steps
├─────────────────────────────────────┤
│      Page Objects                   │  ← Abstração das páginas
├─────────────────────────────────────┤
│      Base Page                      │  ← Métodos reutilizáveis
├─────────────────────────────────────┤
│      Playwright API                 │  ← Framework de automação
└─────────────────────────────────────┘
```

---

### Tratamento de Elementos Dinâmicos

O site do GE possui carregamento dinâmico. Estratégias implementadas:

```typescript
// Aguarda carregamento
await page.waitForTimeout(2000);

// Múltiplos seletores (fallback)
const selectors = ['article', '[class*="feed-post"]', '.feed-media-wrapper'];

// Verificação com timeout
await element.waitFor({ state: 'visible', timeout: 5000 });
```

---

### Screenshots em Falhas

Configurado nos **hooks** para capturar evidências:

```typescript
After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
});
```

---

## 🔧 Variáveis de Ambiente
```bash
# Modo headless (padrão: true)
HEADLESS=false npm run test:e2e

# Browser (padrão: chromium)
BROWSER=firefox npm run test:e2e
BROWSER=webkit npm run test:e2e
```

---

## 📚 Documentação Adicional

- [Documentação Playwright](https://playwright.dev/docs/intro)
- [Documentação Cucumber](https://cucumber.io/docs/cucumber/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👨‍💻 Autor: Cleber Almeida dos Santos
---

## 🎯 Próximos Passos (Melhorias Futuras)

- [ ] Implementar testes de acessibilidade
- [ ] Adicionar testes de performance
- [ ] Integração com CI/CD (GitHub Actions)
- [ ] Testes de responsividade (mobile)
- [ ] Relatórios com Allure


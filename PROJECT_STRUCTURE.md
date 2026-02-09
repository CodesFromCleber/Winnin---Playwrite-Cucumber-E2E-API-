# 📂 Estrutura Completa do Projeto

```
winning/
│
├── 📄 README.md                         # Documentação principal
├── 📄 QUICKSTART.md                     # Guia rápido de início
├── 📄 ARCHITECTURE.md                   # Documentação de arquitetura
│
├── ⚙️ package.json                      # Dependências e scripts
├── ⚙️ tsconfig.json                     # Configuração TypeScript
├── ⚙️ playwright.config.ts              # Configuração Playwright
├── ⚙️ cucumber.js                       # Configuração Cucumber
│
├── 🔧 .env.example                      # Exemplo de variáveis de ambiente
├── 🔧 .gitignore                        # Arquivos ignorados pelo Git
│
├── 🚀 setup.sh                          # Script de setup (Linux/Mac)
├── 🚀 setup.bat                         # Script de setup (Windows)
│
├── 📁 e2e/                              # Pasta principal de testes E2E
│   │
│   ├── 📁 config/                       # Configurações
│   │   └── 📄 config.ts                 # Constantes e configurações globais
│   │
│   ├── 📁 features/                     # Cenários BDD em Gherkin
│   │   └── 📄 home.feature              # Cenários da página inicial
│   │
│   ├── 📁 hooks/                        # Hooks do Cucumber
│   │   └── 📄 hooks.ts                  # Before/After/BeforeAll/AfterAll
│   │
│   ├── 📁 pages/                        # Page Objects (POM)
│   │   ├── 📄 BasePage.ts               # Classe base com métodos comuns
│   │   ├── 📄 HomePage.ts               # Page Object da página inicial
│   │   ├── 📄 NewsPage.ts               # Page Object da página de notícia
│   │   └── 📄 TeamPage.ts               # Page Object da página de time
│   │
│   ├── 📁 steps/                        # Step Definitions
│   │   └── 📄 home.steps.ts             # Implementação dos steps
│   │
│   ├── 📁 support/                      # Suporte e contexto
│   │   └── 📄 world.ts                  # Gerenciamento de contexto (World)
│   │
│   ├── 📁 utils/                        # Utilitários e helpers
│   │   ├── 📄 helpers.ts                # Funções auxiliares
│   │   └── 📄 generate-report.js        # Gerador de relatórios HTML
│   │
│   └── 📄 init.ts                       # Arquivo de inicialização
│
├── 📁 reports/                          # 📊 Relatórios gerados (git ignored)
│   ├── cucumber_report.html
│   └── cucumber_report.json
│
├── 📁 test-results/                     # 📈 Resultados dos testes (git ignored)
│   └── results.json
│
└── 📁 node_modules/                     # Dependências (git ignored)
```

---

## 📦 Arquivos Principais

### Configuração

| Arquivo | Descrição |
|---------|-----------|
| `package.json` | Dependências e scripts npm |
| `tsconfig.json` | Configuração do TypeScript |
| `playwright.config.ts` | Configuração do Playwright |
| `cucumber.js` | Configuração do Cucumber/BDD |
| `.env.example` | Exemplo de variáveis de ambiente |
| `.gitignore` | Arquivos ignorados pelo Git |

### Documentação

| Arquivo | Descrição |
|---------|-----------|
| `README.md` | Documentação completa do projeto |
| `QUICKSTART.md` | Guia rápido de início |
| `ARCHITECTURE.md` | Arquitetura e padrões |
| `PROJECT_STRUCTURE.md` | Este arquivo |

### Scripts de Setup

| Arquivo | Descrição |
|---------|-----------|
| `setup.sh` | Script de instalação (Linux/Mac) |
| `setup.bat` | Script de instalação (Windows) |

---

## 🎯 Testes E2E

### Features (BDD/Gherkin)

```
e2e/features/
└── home.feature         # Cenários da página inicial
```

**Conteúdo:**
- Feature: Exibição de notícias
- Scenario: Validar quantidade de notícias
- Scenario: Validar estrutura das notícias
- Scenario: Acessar matéria completa
- Scenario: Acessar página de time

### Step Definitions

```
e2e/steps/
└── home.steps.ts        # Implementação dos steps
```

**Responsabilidades:**
- Mapear steps do Gherkin para código TypeScript
- Orquestrar chamadas aos Page Objects
- Realizar assertions (expect)

### Page Objects

```
e2e/pages/
├── BasePage.ts          # Métodos comuns
├── HomePage.ts          # Página inicial
├── NewsPage.ts          # Página de notícia
└── TeamPage.ts          # Página de time
```

**Padrão:** Page Object Model (POM)

**Estrutura de cada Page:**
1. Locators (seletores CSS)
2. Constructor
3. Métodos de navegação
4. Métodos de interação
5. Métodos de verificação

### Hooks

```
e2e/hooks/
└── hooks.ts             # Before/After/BeforeAll/AfterAll
```

**Funções:**
- `BeforeAll`: Inicializa o browser
- `Before`: Cria contexto e página para cada cenário
- `After`: Captura screenshots em falhas, fecha página
- `AfterAll`: Fecha o browser

### Support

```
e2e/support/
└── world.ts             # Gerenciamento de contexto
```

**Funções:**
- `setPage()` / `getPage()`
- `setBrowser()` / `getBrowser()`
- `setContext()` / `getContext()`

### Utils

```
e2e/utils/
├── helpers.ts           # Funções auxiliares
└── generate-report.js   # Gerador de relatórios
```

**Classes disponíveis:**
- `WaitHelper` - Esperas inteligentes
- `DateHelper` - Formatação de datas
- `StringHelper` - Manipulação de strings
- `UrlHelper` - Validação de URLs

### Config

```
e2e/config/
└── config.ts            # Configurações globais
```

**Conteúdo:**
- URLs base
- Timeouts
- Delays
- Seletores comuns
- Critérios de aceite
- Lista de times da Série A

---

## 📊 Relatórios

```
reports/
├── cucumber_report.html     # Relatório visual (HTML)
└── cucumber_report.json     # Relatório em JSON

test-results/
└── results.json             # Resultados Playwright
```

**Geração:**
```bash
npm run report
```

---

## 🔧 Variáveis de Ambiente

```
.env.example             # Template
.env                    # Suas configurações (git ignored)
```

**Variáveis disponíveis:**
- `BROWSER` - chromium, firefox, webkit
- `HEADLESS` - true, false
- `BASE_URL` - URL base da aplicação
- `DEFAULT_TIMEOUT` - Timeout padrão

---

## 📈 Tamanho Estimado

| Categoria | Linhas de Código | Arquivos |
|-----------|------------------|----------|
| Page Objects | ~400 LOC | 4 arquivos |
| Step Definitions | ~100 LOC | 1 arquivo |
| Hooks | ~80 LOC | 1 arquivo |
| Utils | ~150 LOC | 2 arquivos |
| Config | ~100 LOC | 4 arquivos |
| Features (Gherkin) | ~30 linhas | 1 arquivo |
| **Total** | **~860+ LOC** | **~13 arquivos** |

---

## 🎨 Padrões Aplicados

### Architecture Layers

```
[BDD Features]
      ↓
[Step Definitions]
      ↓
[Page Objects]
      ↓
[Base Page]
      ↓
[Playwright API]
```

### Design Patterns

- ✅ **Page Object Model** (POM)
- ✅ **Singleton** (World)
- ✅ **Template Method** (BasePage)
- ✅ **Factory** (Browser creation)

---

## 🚀 Como Navegar no Projeto

### Para adicionar um novo teste:

1. **Criar cenário BDD:**
   ```
   e2e/features/novo-teste.feature
   ```

2. **Implementar steps:**
   ```
   e2e/steps/novo-teste.steps.ts
   ```

3. **Criar Page Object (se necessário):**
   ```
   e2e/pages/NovaPage.ts
   ```

### Para debugar:

1. Ative modo headed:
   ```bash
   npm run test:e2e:headed
   ```

2. Veja screenshots em caso de falha:
   ```
   reports/ (anexados ao relatório)
   ```

3. Analise logs no console

---

## 📚 Recursos Adicionais

### Documentação

- [README.md](README.md) - Guia completo
- [QUICKSTART.md](QUICKSTART.md) - Início rápido
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura detalhada

### Links Úteis

- [Playwright Docs](https://playwright.dev/)
- [Cucumber Docs](https://cucumber.io/docs/cucumber/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

**Estrutura criada para o Desafio Técnico - Winnin** 🏆

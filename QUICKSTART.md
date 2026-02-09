# 🚀 Quick Start - Guia Rápido

## ⚡ Começando em 3 Passos

### 1️⃣ Instalar Dependências

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Ou manualmente:**
```bash
npm install
npx playwright install chromium
```

---

### 2️⃣ Executar Testes

**Modo headless (padrão):**
```bash
npm run test:e2e
```

**Com navegador visível:**
```bash
npm run test:e2e:headed
```

---

### 3️⃣ Ver Relatório

```bash
npm run report
```

---

## 📋 Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `npm run test:e2e` | Executa todos os testes (headless) |
| `npm run test:e2e:headed` | Executa com navegador visível |
| `npm run test:e2e:chrome` | Executa no Chrome |
| `npm run test:e2e:firefox` | Executa no Firefox |
| `npm run test:e2e:webkit` | Executa no Safari (WebKit) |
| `npm run report` | Gera relatório HTML |

---

## 🎯 Estrutura de Cenários

```gherkin
Feature: Exibição de notícias

  Scenario: Validar quantidade de notícias
    Given que o usuário acessa a página inicial do GE
    Then devem ser exibidas no mínimo 10 notícias

  Scenario: Validar estrutura das notícias
    Given que o usuário acessa a página inicial do GE
    Then cada notícia deve conter título, imagem e resumo

  Scenario: Acessar matéria completa
    Given que o usuário acessa a página inicial do GE
    When clicar em uma notícia
    Then deve ser redirecionado para a matéria completa

  Scenario: Acessar página de time
    Given que o usuário acessa a página inicial do GE
    When selecionar um time da Série A
    Then deve ser redirecionado para a página do clube
    And visualizar notícias relacionadas ao time
```

---

## 📊 Relatórios

Após executar os testes, acesse:

- **HTML Report:** `reports/cucumber_report.html`
- **JSON Report:** `reports/cucumber_report.json`
- **Screenshots:** Salvos automaticamente em caso de falha

---

## 🐛 Problemas Comuns

### ❌ "Browser não instalado"

**Solução:**
```bash
npx playwright install chromium
```

---

### ❌ "Timeout ao carregar página"

**Solução:**
```bash
# Aumente o timeout no cucumber.js
timeout: 90000
```

---

### ❌ "Elementos não encontrados"

**Motivo:** O site pode ter mudado a estrutura HTML

**Solução:**
- Verifique os seletores nos Page Objects
- Execute com `HEADLESS=false` para visualizar

---

## 🔍 Debug

**Ver testes executando:**
```bash
npm run test:e2e:headed
```

**Ver logs detalhados:**
```bash
DEBUG=true npm run test:e2e
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [README.md](README.md) - Documentação completa
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura do projeto

---

## 💡 Dicas

✅ **Execute em headless para CI/CD**
```bash
npm run test:e2e
```

✅ **Execute em headed para debug**
```bash
npm run test:e2e:headed
```

✅ **Gere relatório após cada execução**
```bash
npm run report
```

---

## ✨ Pronto!

Agora você está pronto para executar os testes! 🎉

```bash
npm run test:e2e
```

---

**Boa sorte! 🚀**

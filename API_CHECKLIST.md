# Checklist - Automação de Testes de API ServeRest

## 📋 Requisitos Mínimos de Testes

### ✅ Usuários (/usuarios)

#### Criar Usuário com Sucesso
- [x] Status 201 na resposta
- [x] Validar campos essenciais no body
- [x] Validar coerência dos valores retornados
- [x] Campo `_id` retornado com sucesso
- [x] Teste: `Deve criar usuário com sucesso (status 201)`
- [x] Teste: `Deve validar campos essenciais no body da resposta`
- [x] Teste: `Deve validar coerência dos valores retornados`

#### Validar Erros - Email Inválido
- [x] Status 400 para email inválido
- [x] Mensagem de erro contém referência a "email"
- [x] Teste: `Deve rejeitar email inválido (status 400)`

#### Validar Erros - Campo Administrador Inválido
- [x] Status 400 para administrador não boolean
- [x] Mensagem de erro contém referência a "administrador"
- [x] Teste: `Deve rejeitar campo administrador com valor inválido (status 400)`

#### Validar Erros - Campo Obrigatório Ausente
- [x] Status 400 para campo "nome" ausente
- [x] Mensagem de erro apropriada
- [x] Teste: `Deve rejeitar campo obrigatório ausente - nome (status 400)`

#### Funcionalidades Extras Implementadas
- [x] Email duplicado retorna status 409
- [x] GET /usuarios lista usuários
- [x] DELETE /usuarios/:_id remove usuário
- [x] Teste: `Deve rejeitar email duplicado (status 409)`

---

### ✅ Login (/login)

#### Login com Sucesso
- [x] Status 200 na resposta
- [x] Token retornado no campo `authorization`
- [x] Token é válido (string não vazia)
- [x] Teste: `Deve fazer login com sucesso e retornar token (status 200)`

#### Capturar e Validar Token
- [x] Token extraído da resposta
- [x] Token é string válida
- [x] Token tem comprimento > 0
- [x] Teste: `Deve capturar token válido da resposta`

#### Validar Erro - Senha Incorreta
- [x] Status 401 para senha incorreta
- [x] Mensagem de erro validada
- [x] Estrutura de erro validada
- [x] Teste: `Deve rejeitar login com senha incorreta (status 401)`
- [x] Teste: `Deve validar estrutura de erro no login com falha`

#### Funcionalidades Extras Implementadas
- [x] Email inválido retorna status 401
- [x] Campo email ausente retorna 400
- [x] Campo password ausente retorna 400
- [x] Teste: `Deve rejeitar login com email inválido (status 401)`
- [x] Teste: `Deve rejeitar login com campo ausente - email (status 400)`
- [x] Teste: `Deve rejeitar login com campo ausente - password (status 400)`

---

### ✅ Produtos (/produtos)

#### Criar Produto com Sucesso
- [x] Status 201 na resposta
- [x] Requer credenciais adequadas (token)
- [x] Requer usuário administrador
- [x] Campo `_id` retornado
- [x] Teste: `Deve criar produto com sucesso (status 201) com credenciais adequadas`

#### Validar Contrato do Produto
- [x] Campos necessários: nome, preco, descricao, quantidade
- [x] Tipos de dados corretos (string, number, etc)
- [x] Valores coerentes com os dados enviados
- [x] Teste: `Deve validar contrato do produto - campos necessários`
- [x] Teste: `Deve validar tipos dos campos do produto`
- [x] Teste: `Deve validar coerência dos valores do produto`

#### Validar Erro - Preço Negativo
- [x] Status 400 para preço negativo
- [x] Mensagem de erro contém referência a "preco"
- [x] Teste: `Deve rejeitar produto com preço negativo (status 400)`

#### Validar Erro - Preço Decimal
- [x] Status 400 para preço decimal (não-inteiro)
- [x] Mensagem de erro apropriada
- [x] Teste: `Deve rejeitar produto com preço decimal (não-inteiro) (status 400)`

#### Funcionalidades Extras Implementadas
- [x] Rejeita produto sem token (401)
- [x] Rejeita produto sem ser administrador (401/403)
- [x] Campo obrigatório ausente - nome (400)
- [x] GET /produtos lista produtos
- [x] DELETE /produtos/:_id remove produto
- [x] Teste: `Deve rejeitar produto sem token (status 401)`
- [x] Teste: `Deve rejeitar produto com usuário não-administrador (status 403)`
- [x] Teste: `Deve rejeitar campo obrigatório ausente - nome (status 400)`

---

### ✅ Carrinhos (/carrinhos)

#### Criar Carrinho com Sucesso
- [x] Status 201 na resposta
- [x] Contém produto criado anteriormente
- [x] Campo `idProduto` validado
- [x] Campo `quantidade` validado
- [x] Teste: `Deve criar carrinho com sucesso (status 201)`
- [x] Teste: `Deve validar idProduto no carrinho criado`
- [x] Teste: `Deve validar quantidade no carrinho criado`

#### Validar Erro - Quantidade Zero
- [x] Status 400 para quantidade zero
- [x] Mensagem de erro contém referência a "quantidade"
- [x] Teste: `Deve rejeitar carrinho com quantidade zero (status 400)`

#### Validar Erro - Quantidade Negativa
- [x] Status 400 para quantidade negativa
- [x] Mensagem de erro apropriada
- [x] Teste: `Deve rejeitar carrinho com quantidade negativa (status 400)`

#### Funcionalidades Extras Implementadas
- [x] Rejeita carrinho sem token (401)
- [x] Rejeita carrinho com produto inválido (400)
- [x] Campo obrigatório ausente - idProduto (400)
- [x] GET /carrinhos lista carrinhos
- [x] DELETE /carrinhos/:_id limpa carrinho
- [x] Teste: `Deve rejeitar carrinho sem token (status 401)`
- [x] Teste: `Deve rejeitar carrinho com produto inválido (status 400)`
- [x] Teste: `Deve rejeitar campo obrigatório ausente - idProduto (status 400)`

---

## 📊 Requisitos de Qualidade

### ✅ Organização e Estrutura do Projeto

- [x] Separação clara entre testes E2E e API
- [x] Diretórios bem organizados:
  - `api/config/` - Configurações
  - `api/client/` - Cliente HTTP
  - `api/fixtures/` - Fixtures Playwright
  - `api/helpers/` - Helpers e geradores
  - `api/tests/` - Arquivos de teste
- [x] Estrutura documentada em README

### ✅ Boas Práticas de Automação

- [x] Padrão AAA (Arrange-Act-Assert) consistente
- [x] Dados reutilizáveis via fixtures
- [x] Helpers para geração de dados
- [x] Cliente HTTP abstrato e reutilizável
- [x] Validações de contrato implementadas
- [x] Timeouts configuráveis

### ✅ Isolamento e Independência dos Testes

- [x] Cada teste cria seus próprios dados
- [x] Não há ordem de execução obrigatória
- [x] Testes podem rodar em paralelo
- [x] Sem compartilhamento de estado
- [x] Execução paralela ativada: `fullyParallel: true`

### ✅ Geração de Dados Únicos (Anti-Flakiness)

- [x] Gerador de emails únicos: `generateUniqueEmail()`
- [x] Gerador de nomes únicos: `generateUniqueName()`
- [x] Gerador de IDs únicos: `generateUniqueId()`
- [x] Timestamp + aleatoriedade para unicidade
- [x] Funciona em ambiente público

### ✅ Estratégia de Limpeza de Dados

- [x] Testes não dependem de massa pré-existente
- [x] Cada teste cria dados necessários
- [x] Cleanup pode ser habilitado em config
- [x] Implementação de DELETE para limpeza
- [x] Tests independentes de cleanup

### ✅ Clareza dos Cenários e Validações

- [x] Nomes descritivos dos testes
- [x] Comentários explicativos
- [x] Validações explícitas
- [x] Mensagens de erro claras
- [x] Documentação em comentários

### ✅ Legibilidade e Manutenibilidade do Código

- [x] TypeScript com tipos explícitos
- [x] Nomes de variáveis descritivos
- [x] Funções pequenas e focused
- [x] DRY (Don't Repeat Yourself)
- [x] Documentação JSDoc
- [x] Separação de responsabilidades

---

## ✨ Pontos Extras Implementados

### ✅ GitHub Actions (CI/CD)

- [x] Workflow `api-tests.yml` para testes de API
- [x] Workflow `e2e-tests.yml` para testes E2E
- [x] Suporte a `workflow_dispatch` (trigger manual)
- [x] Execução em eventos push e pull requests
- [x] ServeRest como serviço Docker no CI
- [x] Upload de artefatos (relatórios)
- [x] Slacknotifications opcionais
- [x] Verificação de saúde do ServeRest

### ✅ Variáveis de Ambiente

- [x] `.env.example` documentado
- [x] Suporte a `API_BASE_URL`
- [x] Configurável via environment variables
- [x] Suporte a ambiente local e público

### ✅ Separação E2E vs API

- [x] Config separado: `playwright.config.ts` vs `playwright-api.config.ts`
- [x] Diretórios separados: `e2e/` vs `api/`
- [x] Scripts npm separados: `test:e2e` vs `test:api`
- [x] Fixtures separadas

### ✅ Fixtures Reutilizáveis

- [x] `apiClient` - Cliente HTTP
- [x] `adminUser` - Dados admin
- [x] `testUser` - Dados usuario normal
- [x] `adminToken` - Token admin
- [x] `testUserToken` - Token usuario normal

### ✅ Helpers Reutilizáveis

- [x] `generateUniqueEmail()`
- [x] `generateValidUser()`
- [x] `generateAdminUser()`
- [x] `generateValidProduct()`
- [x] `generateProductWithNegativePrice()`
- [x] Validação de contrato
- [x] Helpers de resposta HTTP

---

## 📚 Documentação

- [x] `README.md` - Documentação geral e instruções
- [x] `API_TESTING.md` - Documentação completa de testes de API
- [x] `.env.example` - Variáveis de ambiente
- [x] `.github/workflows/` - CI/CD configurations
- [x] Comentários em código
- [x] Docstrings com JSDoc

---

## 🧪 Total de Testes Implementados

### Usuários: 7 testes
- 3 testes de sucesso
- 4 testes de erro

### Login: 7 testes
- 3 testes de sucesso
- 4 testes de erro

### Produtos: 9 testes
- 4 testes de sucesso
- 5 testes de erro

### Carrinhos: 9 testes
- 4 testes de sucesso
- 5 testes de erro

### Total: 32 testes 🎯

---

## ✅ Status Final

**Status: COMPLETO** ✅

Todos os requisitos mínimos foram implementados com sucesso.
Todos os requisitos de qualidade foram atendidos.
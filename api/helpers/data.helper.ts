/**
 * Helper para gerar dados de teste únicos
 * Estratégia para flakiness e conflito
 */


export function generateUniqueId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gera um email único para testes
 */
export function generateUniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `qa_user_${timestamp}_${random}@qatest.com`;
}

/**
 * Gera um nome de produto único
 */
export function generateUniqueName(prefix: string = 'Test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Gera dados válidos de usuário
 */
export function generateValidUser() {
  return {
    nome: `QA Test User ${generateUniqueId()}`,
    email: generateUniqueEmail(),
    password: 'senha123456',
    administrador: 'false',
  };
}

/**
 * Gera dados válidos de usuário administrador
 */
export function generateAdminUser() {
  return {
    nome: `QA Admin User ${generateUniqueId()}`,
    email: generateUniqueEmail(),
    password: 'senha123456',
    administrador: 'true',
  };
}

/**
 * Gera dados válidos de produto
 */
export function generateValidProduct() {
  return {
    nome: generateUniqueName('Produto'),
    preco: Math.floor(Math.random() * 1000) + 10, // Preço entre 10 e 1010
    descricao: `Descrição do produto ${generateUniqueId()}`,
    quantidade: Math.floor(Math.random() * 100) + 1, // Quantidade entre 1 e 100
  };
}

/**
 * Gera dados de usuário com email inválido
 */
export function generateUserWithInvalidEmail() {
  return {
    nome: `QA Test User ${generateUniqueId()}`,
    email: 'email_invalido',
    password: 'senha123456',
    administrador: 'false',
  };
}

/**
 * Gera dados de usuário com campo administrador inválido
 */
export function generateUserWithInvalidAdmin() {
  return {
    nome: `QA Test User ${generateUniqueId()}`,
    email: generateUniqueEmail(),
    password: 'senha123456',
    administrador: 'maybe', // Inválido - deve ser true ou false
  };
}

/**
 * Gera dados de produto com preço inválido (negativo)
 */
export function generateProductWithNegativePrice() {
  return {
    nome: generateUniqueName('Produto'),
    preco: -100,
    descricao: 'Produto com preço negativo',
    quantidade: 10,
  };
}

/**
 * Gera dados de produto com preço decimal (não-inteiro)
 */
export function generateProductWithDecimalPrice() {
  return {
    nome: generateUniqueName('Produto'),
    preco: 99.99,
    descricao: 'Produto com preço decimal',
    quantidade: 10,
  };
}

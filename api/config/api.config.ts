/**
 * Configurações para testes de API ServeRest
 */

export const API_CONFIG = {
  // URL base - usar ServeRest local ou público
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  
  // Endpoints
  ENDPOINTS: {
    USUARIOS: '/usuarios',
    LOGIN: '/login',
    PRODUTOS: '/produtos',
    CARRINHOS: '/carrinhos',
    CARRINHOS_CANCELAR_COMPRA: '/carrinhos/cancelar-compra',
  },
  
  // Timeouts (em milissegundos)
  TIMEOUT: {
    DEFAULT: 30000,
    REQUEST: 10000,
  },
  
  // Dados padrão para testes
  TEST_DATA: {
    // Meu usuário admin para criar produtos
    ADMIN_USER: {
      email: 'adm@qa.com',
      password: 'adm123',
      nome: 'Admin QA',
      administrador: 'true',
    },
    // Usuário comum
    REGULAR_USER: {
      nome: 'Usuário QA',
      email: '', // será preenchido dinamicamente
      password: 'senha123',
      administrador: 'false',
    },
    // Dados de produto
    PRODUCT: {
      nome: 'Produto Test-QA',
      preco: 100,
      descricao: 'Produto criado automaticamente para testes',
      quantidade: 10,
    },
  },
  
  // Estratégia de limpeza
  CLEANUP: {
    ENABLED: true,
    DELETE_USERS: true,
    DELETE_PRODUCTS: true,
    DELETE_CARTS: true,
  },
};

export default API_CONFIG;

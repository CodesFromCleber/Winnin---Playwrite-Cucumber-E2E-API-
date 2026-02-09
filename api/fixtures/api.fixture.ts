/**
 * Fixture do Playwright para testes de API
 * Fornece client de API e dados de teste reutilizáveis
 */

import { test as base, APIRequestContext } from '@playwright/test';
import { APIClient } from '../client/api.client';
import API_CONFIG from '../config/api.config';
import { generateValidUser, generateAdminUser, generateValidProduct } from '../helpers/data.helper';

export interface APIFixtures {
  apiClient: APIClient;
  adminUser: any;
  testUser: any;
  adminToken: string;
  testUserToken: string;
  createUser: (userData?: any) => Promise<{ response: any; body: any; data: any }>;
  createProduct: (token: string, productData?: any) => Promise<{ response: any; body: any; data: any }>;
}

export const test = base.extend<APIFixtures>({
  // API Client
  apiClient: async ({ request }, use) => {
    const apiClient = new APIClient(request);
    await use(apiClient);
  },

  // Admin User (dados gerados uma única vez)
  adminUser: async ({}, use: any) => {
    const adminUser = generateAdminUser();
    await use(adminUser);
  },

  // Regular Test User (dados gerados uma única vez)
  testUser: async ({}, use: any) => {    const testUser = generateValidUser();
    await use(testUser);
  },

  // Admin Token (gerado do admin user)
  adminToken: async ({ apiClient, adminUser }, use) => {
    // Primeiro, tenta criar o usuário admin
    const createResponse = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, adminUser);
    
    // Verifica se criou com sucesso ou se já existe
    if (createResponse.status() !== 201 && createResponse.status() !== 400) {
      const body = await APIClient.getResponseBody(createResponse);
      throw new Error(`Falha ao criar usuário admin: ${createResponse.status()} - ${JSON.stringify(body)}`);
    }

    // Faz login para obter token
    const loginResponse = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: adminUser.email,
      password: adminUser.password,
    });

    if (loginResponse.status() !== 200) {
      const loginBody = await APIClient.getResponseBody(loginResponse);
      throw new Error(`Falha ao fazer login admin: ${loginResponse.status()} - ${JSON.stringify(loginBody)}`);
    }

    const loginBody = await APIClient.getResponseBody(loginResponse);
    const token = loginBody.authorization;

    if (!token) {
      throw new Error(`Token não foi retornado no login: ${JSON.stringify(loginBody)}`);
    }

    console.log('✅ Admin token gerado com sucesso');
    await use(token);
  },

  // Test User Token (gerado do test user)
  testUserToken: async ({ apiClient, testUser }, use) => {
    // Cria o usuário de teste
    const createResponse = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, testUser);

    if (createResponse.status() !== 201 && createResponse.status() !== 400) {
      const body = await APIClient.getResponseBody(createResponse);
      throw new Error(`Falha ao criar usuário: ${createResponse.status()} - ${JSON.stringify(body)}`);
    }

    // Faz login para obter token
    const loginResponse = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: testUser.email,
      password: testUser.password,
    });

    if (loginResponse.status() !== 200) {
      const loginBody = await APIClient.getResponseBody(loginResponse);
      throw new Error(`Falha ao fazer login: ${loginResponse.status()} - ${JSON.stringify(loginBody)}`);
    }

    const loginBody = await APIClient.getResponseBody(loginResponse);
    const token = loginBody.authorization;

    if (!token) {
      throw new Error(`Token não foi retornado no login: ${JSON.stringify(loginBody)}`);
    }

    console.log('✅ Test user token gerado com sucesso');
    await use(token);
  },

  // Cria um usuario dinamico
  createUser: async ({ apiClient }, use) => {
    await use(async (userData = generateValidUser()) => {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, userData);
      const body = await APIClient.getResponseBody(response).catch(() => ({}));
      return { response, body, data: userData };
    });
  },

  // Cria um produto (requer token)
  createProduct: async ({ apiClient }, use) => {
    await use(async (token: string, productData = generateValidProduct()) => {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUTOS, productData, { token });
      const body = await APIClient.getResponseBody(response).catch(() => ({}));
      return { response, body, data: productData };
    });
  },
});

export { expect } from '@playwright/test';

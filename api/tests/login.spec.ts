/**
 * Testes para endpoint /login
 * - Fazer login com sucesso
 * - Capturar e validar token
 * - Validar erro com senha incorreta
 */

import { test, expect } from '../fixtures/api.fixture';
import { APIClient } from '../client/api.client';
import { generateValidUser } from '../helpers/data.helper';
import { expectErrorContains } from '../helpers/error.helper';
import { LoginResponse, ApiError, ValidationError } from '../types/api.types';
import API_CONFIG from '../config/api.config';

test.describe('Login - POST /login', () => {
 test('@loginTest_01 - Deve fazer login com sucesso e retornar token (status 200)', async ({ apiClient, testUser, testUserToken }) => {

    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: testUser.email,
      password: testUser.password,
    });

 
    expect(response.status()).toBe(200);

    const body = await APIClient.getResponseBody<LoginResponse>(response);
    expect(body).toHaveProperty('authorization');
    expect(body.authorization).toBeTruthy();
    expect(typeof body.authorization).toBe('string');
  });

  test('@loginTest_02 - Deve capturar token válido da resposta', async ({ apiClient }) => {
  
    const userData = generateValidUser();
    await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, userData);


    const loginResponse = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: userData.email,
      password: userData.password,
    });

    const loginBody = await APIClient.getResponseBody<LoginResponse>(loginResponse);
    const token = loginBody.authorization;


    expect(loginResponse.status()).toBe(200);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('@loginTest_03 - Deve rejeitar login com senha incorreta (status 401)', async ({ apiClient, testUser }) => {
    
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: testUser.email,
      password: 'senhaErrada123',
    });

    
    expect(response.status()).toBe(401);

    const body = await APIClient.getResponseBody<ApiError>(response);
    expect(body).toHaveProperty('message');
    expectErrorContains(body, 'email');
  });

  test('@loginTest_04 - Deve validar estrutura de erro no login com falha', async ({ apiClient, testUser }) => {

    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: testUser.email,
      password: 'senhaErrada',
    });

  
    expect(response.status()).toBe(401);

    const body = await APIClient.getResponseBody<ApiError>(response);
    expect(body).toHaveProperty('message');
    expect(typeof body.message).toBe('string');
  });

  test('@loginTest_05 - Deve rejeitar login com email inválido (status 401)', async ({ apiClient }) => {
   
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: 'emailnaoexiste@@test.com',
      password: 'qualquerSenha',
    });

    
    expect(response.status()).toBe(401);

    const body = await APIClient.getResponseBody<ApiError>(response);
    expect(body).toHaveProperty('message');
  });

  test('@loginTest_06 - Deve rejeitar login com campo ausente - email (status 400)', async ({ apiClient }) => {
   
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      password: 'invalida123',
      // Falta email
    });

   
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
        expect(body).toHaveProperty('email');
    expect(body.email).toBe('email é obrigatório');
  });

  test('@loginTest_07 - Deve rejeitar login com campo ausente - password (status 400)', async ({ apiClient }) => {
  
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: 'test@test.com',
      // Falta password
    });

   
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expect(body).toHaveProperty('password');
    expect(body.password).toBe('password é obrigatório');
  });
});

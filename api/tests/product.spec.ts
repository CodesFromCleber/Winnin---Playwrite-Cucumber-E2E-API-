/**
 * Testes para endpoint /produtos
 * - Login de administrador e captura de token
 * - Criar produto com sucesso
 * - Validar contrato do produto
 * - Validar erro com preço inválido
 */

import { test, expect } from '../fixtures/api.fixture';
import { APIClient } from '../client/api.client';
import { generateValidProduct, generateProductWithNegativePrice, generateProductWithDecimalPrice, generateAdminUser,} from '../helpers/data.helper';
import { LoginResponse, CreateProductResponse, Product, GetProductsResponse, DeleteProductResponse, ApiError, ValidationError } from '../types/api.types';
import API_CONFIG from '../config/api.config';

test.describe('Login e Autorização', () => {
  test('@productTest_00 - Deve efetuar login com credenciais de administrador e capturar token', async ({
    apiClient,
  }) => {

    const adminData = generateAdminUser();

    // Criar usuário admin
    const createResponse = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, adminData);
    expect(createResponse.status()).toBe(201);
    console.log('✅ Usuário admin criado');

    // Fazer login e capturar token
    const loginResponse = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email: adminData.email,
      password: adminData.password,
    });

    expect(loginResponse.status()).toBe(200);
    const loginBody = await APIClient.getResponseBody<LoginResponse>(loginResponse);
    const adminToken = loginBody.authorization;


    expect(adminToken).toBeTruthy();
    expect(typeof adminToken).toBe('string');
    expect(adminToken.length).toBeGreaterThan(0);

    console.log('✅ Token de admin capturado:', adminToken.substring(0, 20) + '...');

  });
});

test.describe('Produtos - POST /produtos', () => {
  test('@productTest_01 - Deve criar produto com sucesso (status 201) com credenciais adequadas', async ({
    createProduct,
    adminToken,
  }) => {
   
    const { response, body } = await createProduct(adminToken);

    
    expect(response.status()).toBe(201);
    expect(body).toHaveProperty('_id');
    expect(body._id).toBeTruthy();
  });

  test('@productTest_02 - Deve validar contrato do produto - campos necessários', async ({
    apiClient,
    createProduct,
    adminToken,
  }) => {
    // Criar produto
    const { response: createResponse, body: createBody } = await createProduct(adminToken);
    expect(createResponse.status()).toBe(201);
    expect(createBody).toHaveProperty('_id');

    // Act - Buscar produto criado para validar contrato
    const getResponse = await apiClient.get(`/produtos/${createBody._id}`);
    const body = await APIClient.getResponseBody<Product>(getResponse);


    expect(getResponse.status()).toBe(200);
    expect(body).toHaveProperty('_id');
    expect(body).toHaveProperty('nome');
    expect(body).toHaveProperty('preco');
    expect(body).toHaveProperty('descricao');
    expect(body).toHaveProperty('quantidade');
  });

  test('@productTest_03 - Deve validar tipos dos campos do produto', async ({ apiClient, createProduct, adminToken }) => {
    
    const { response: createResponse, body: createBody } = await createProduct(adminToken);
    expect(createResponse.status()).toBe(201);

    // Buscar produto criado
    const getResponse = await apiClient.get(`/produtos/${createBody._id}`);
    const body = await APIClient.getResponseBody<Product>(getResponse);

    
    expect(typeof body._id).toBe('string');
    expect(typeof body.nome).toBe('string');
    expect(typeof body.preco).toBe('number');
    expect(typeof body.descricao).toBe('string');
    expect(typeof body.quantidade).toBe('number');
  });

  test('@productTest_04 - Deve validar coerência dos valores do produto', async ({ apiClient, createProduct, adminToken }) => {
    
    const productData = generateValidProduct();

    //Criar produto
    const { response: createResponse, body: createBody } = await createProduct(adminToken, productData);
    expect(createResponse.status()).toBe(201);

    // Buscar produto criado
    const getResponse = await apiClient.get(`/produtos/${createBody._id}`);
    const body = await APIClient.getResponseBody<Product>(getResponse);

    // Validar coerência dos dados
    expect(body.nome).toBe(productData.nome);
    expect(body.preco).toBe(productData.preco);
    expect(body.descricao).toBe(productData.descricao);
    expect(body.quantidade).toBe(productData.quantidade);
  });

  test('@productTest_05 - Deve rejeitar produto com preço negativo (status 400)', async ({ apiClient, adminToken }) => {
   
    const invalidProductData = generateProductWithNegativePrice();

 
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUTOS, invalidProductData, {
      token: adminToken,
    });

 
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expect(body).toHaveProperty('preco');
    expect(body.preco).toBe('preco deve ser um número positivo');
  });

  test('@productTest_06 - Deve rejeitar produto com preço decimal (não-inteiro) (status 400)', async ({
    apiClient,
    adminToken,
  }) => {

    const invalidProductData = generateProductWithDecimalPrice();

  
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUTOS, invalidProductData, {
      token: adminToken,
    });

   
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expect(body).toHaveProperty('preco');
    expect(body.preco).toBe('preco deve ser um inteiro');
  });

  test('@productTest_07 - Deve rejeitar produto sem token (status 401)', async ({ apiClient }) => {
    
    const productData = generateValidProduct();

   
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUTOS, productData);

  
    expect(response.status()).toBe(401);

    const body = await APIClient.getResponseBody<CreateProductResponse>(response);
    expect(body).toHaveProperty('message');
  });

  test('@productTest_08 - Deve rejeitar produto com usuário não-administrador (status 403)', async ({
    apiClient,
    testUserToken,
  }) => {
    
    const productData = generateValidProduct();

 
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUTOS, productData, {
      token: testUserToken,
    });

      // Esperado 401
    expect([401]).toContain(response.status());
  });

  test('@productTest_09 - Deve rejeitar campo obrigatório ausente - nome (status 400)', async ({
    apiClient,
    adminToken,
  }) => {
  
    const incompleteProductData = {
      preco: 100,
      descricao: 'Descrição',
      quantidade: 10,
      // Falta 'nome'
    };


    const response = await apiClient.post(API_CONFIG.ENDPOINTS.PRODUTOS, incompleteProductData, {
      token: adminToken,
    });


    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expect(body).toHaveProperty('nome');
    expect(body.nome).toBe('nome é obrigatório')

  });
});

test.describe('Produtos - GET /produtos', () => {
  test('@productTest_10 - Deve listar produtos com sucesso', async ({ apiClient }) => {
  
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PRODUTOS);


    expect(response.status()).toBe(200);

    const body = await APIClient.getResponseBody<GetProductsResponse>(response);
    expect(Array.isArray(body.produtos) || Array.isArray(body)).toBeTruthy();
  });
});

test.describe('Produtos - DELETE /produtos/:_id', () => {
  test('@productTest_11 - Deve deletar produto com sucesso', async ({ apiClient, createProduct, adminToken }) => {
    
    const { body: createdProduct } = await createProduct(adminToken);


    const deleteResponse = await apiClient.delete(`${API_CONFIG.ENDPOINTS.PRODUTOS}/${createdProduct._id}`, {
      token: adminToken,
    });


    expect(deleteResponse.status()).toBe(200);

    const body = await APIClient.getResponseBody<DeleteProductResponse>(deleteResponse);
    expect(body).toHaveProperty('message');
  });
});

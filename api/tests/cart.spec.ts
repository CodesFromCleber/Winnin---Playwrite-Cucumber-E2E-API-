import { test, expect } from '../fixtures/api.fixture';
import { APIClient } from '../client/api.client';
import { generateValidUser } from '../helpers/data.helper';
import { expectErrorContains } from '../helpers/error.helper';
import { LoginResponse, CreateCartResponse, GetCartsResponse, DeleteCartResponse, ApiError, ValidationError } from '../types/api.types';
import API_CONFIG from '../config/api.config';

let cartTestToken: string;

test.beforeAll(async ({ apiClient }) => {

  const userData = generateValidUser();

  //Criar usuário admin
  const createResponse = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, userData);
  expect(createResponse.status()).toBe(201);
  console.log('Usuário admin criado');

  //Fazer login e capturar token
  const loginResponse = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
    email: userData.email,
    password: userData.password,
  });

  expect(loginResponse.status()).toBe(200);
  const loginBody = await APIClient.getResponseBody<LoginResponse>(loginResponse);
  const userToken = loginBody.authorization;

  expect(userToken).toBeTruthy();
  expect(typeof userToken).toBe('string');
  expect(userToken.length).toBeGreaterThan(0);

  cartTestToken = userToken;

  console.log('Token de usuario capturado:', userToken.substring(0, 20) + '...');
});

test.describe('Login e Autorização', () => {
  test('@cartTest_00 - Deve efetuar login com credenciais de administrador e capturar token', async () => {
    expect(cartTestToken).toBeTruthy();
  });
});


test.describe('Carrinhos - POST /carrinhos', () => {
  test.beforeEach(() => {
    expect(cartTestToken).toBeTruthy();
  });

  
  
  test('@cartTest_01 - Deve criar carrinho com sucesso (status 201)', async ({
    apiClient,
    createProduct,
    adminToken,
  }) => {

    // Limpa carrinho anterior do usuario, se existir
    const cleanupResponse = await apiClient.delete(API_CONFIG.ENDPOINTS.CARRINHOS_CANCELAR_COMPRA, {
      token: cartTestToken,
    });
    if (![200, 404].includes(cleanupResponse.status())) {
      const cleanupBody = await APIClient.getResponseBody<ApiError>(cleanupResponse);
      console.log('Limpeza de carrinho retornou status inesperado:', cleanupResponse.status(), cleanupBody);
    }

    // Cria produto primeiro
    const { body: product } = await createProduct(adminToken);

    // Prepara dados do carrinho
    const cartData = {
      produtos: [
        {
          idProduto: product._id,
          quantidade: 5,
        },
      ],
    };

   
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: cartTestToken,
    });

    
    expect(response.status()).toBe(201);

    const body = await APIClient.getResponseBody<CreateCartResponse>(response);
    expect(body).toHaveProperty('message');
  });

  test('@cartTest_02 - Deve validar idProduto no carrinho criado', async ({
    apiClient,
    createProduct,
    adminToken,
    testUserToken,
  }) => {
 
    const { body: product } = await createProduct(adminToken);

    const cartData = {
      produtos: [
        {
          idProduto: product._id,
          quantidade: 3,
        },
      ],
    };


    const cartResponse = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: testUserToken,
    });

   
    expect(cartResponse.status()).toBe(201);

    const listResponse = await apiClient.get(API_CONFIG.ENDPOINTS.CARRINHOS, { token: testUserToken });
    expect(listResponse.status()).toBe(200);

    const listBody = await APIClient.getResponseBody<GetCartsResponse>(listResponse);
    const carrinhos = Array.isArray(listBody.carrinhos) ? listBody.carrinhos : [];
    const carrinho = carrinhos.find((item: any) =>
      Array.isArray(item.produtos) && item.produtos.some((p: any) => p.idProduto === product._id)
    );
    expect(carrinho).toBeTruthy();
    const produtoCarrinho = carrinho!.produtos.find((p: any) => p.idProduto === product._id);
    expect(produtoCarrinho!.idProduto).toBe(product._id);
  });

  test('@cartTest_03 - Deve validar quantidade no carrinho criado', async ({
    apiClient,
    createProduct,
    adminToken,
    testUserToken,
  }) => {
 
    const { body: product } = await createProduct(adminToken);

    const quantidade = 7;
    const cartData = {
      produtos: [
        {
          idProduto: product._id,
          quantidade,
        },
      ],
    };

   
    const cartResponse = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: testUserToken,
    });

 
    expect(cartResponse.status()).toBe(201);

    const listResponse = await apiClient.get(API_CONFIG.ENDPOINTS.CARRINHOS, { token: testUserToken });
    expect(listResponse.status()).toBe(200);

    const listBody = await APIClient.getResponseBody<GetCartsResponse>(listResponse);
    const carrinhos = Array.isArray(listBody.carrinhos) ? listBody.carrinhos : [];
    const carrinho = carrinhos.find((item: any) =>
      Array.isArray(item.produtos) && item.produtos.some((p: any) => p.idProduto === product._id)
    );
    expect(carrinho).toBeTruthy();
    const produtoCarrinho = carrinho!.produtos.find((p: any) => p.idProduto === product._id);
    expect(produtoCarrinho!.quantidade).toBe(quantidade);
  });

  test('@cartTest_04 - Deve rejeitar carrinho com quantidade zero (status 400)', async ({
    apiClient,
    createProduct,
    adminToken,
    testUserToken,
  }) => {
    
    const { body: product } = await createProduct(adminToken);

    const cartData = {
      produtos: [
        {
          idProduto: product._id,
          quantidade: 0,
        },
      ],
    };

  
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: testUserToken,
    });

    
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expectErrorContains(body, 'quantidade');
  });

  test('@cartTest_05 - Deve rejeitar carrinho com quantidade negativa (status 400)', async ({
    apiClient,
    createProduct,
    adminToken,
    testUserToken,
  }) => {
   
    const { body: product } = await createProduct(adminToken);

    const cartData = {
      produtos: [
        {
          idProduto: product._id,
          quantidade: -5,
        },
      ],
    };

   
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: testUserToken,
    });

  
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expectErrorContains(body, 'quantidade');
  });

  test('@cartTest_06 - Deve rejeitar carrinho sem token (status 401)', async ({ apiClient, createProduct, adminToken }) => {
    
    const { body: product } = await createProduct(adminToken);

    const cartData = {
      produtos: [
        {
          idProduto: product._id,
          quantidade: 5,
        },
      ],
    };

  
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData);


    expect(response.status()).toBe(401);

    const body = await APIClient.getResponseBody<ApiError>(response);
    expect(body).toHaveProperty('message');
  });

  test('@cartTest_07 - Deve rejeitar carrinho com produto inválido (status 400)', async ({
    apiClient,
    testUserToken,
  }) => {

    const cartData = {
      produtos: [
        {
          idProduto: 'produto_nao_existe_xyz',
          quantidade: 5,
        },
      ],
    };

 
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: testUserToken,
    });

   
    expect([400, 404]).toContain(response.status());

    const body = await APIClient.getResponseBody<ValidationError>(response);
    const itemId = (body as any)?.item?.idProduto ?? (body as any)?.idProduto;
    expect(itemId).toBe('produto_nao_existe_xyz');
    expectErrorContains(body, 'produto');
  });

  test('@cartTest_08 - Deve rejeitar campo obrigatório ausente - idProduto (status 400)', async ({
    apiClient,
    testUserToken,
  }) => {
    
    const cartData = {
      produtos: [
        {
          quantidade: 5,
          // Falta idProduto
        },
      ],
    };


    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: testUserToken,
    });

   
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expectErrorContains(body, 'idproduto');
  });
});

test.describe('Carrinhos - GET /carrinhos', () => {
  test('@cartTest_09 - Deve listar carrinhos com sucesso', async ({ apiClient, testUserToken }) => {
    
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CARRINHOS, { token: testUserToken });

   
    expect(response.status()).toBe(200);

    const body = await APIClient.getResponseBody<GetCartsResponse>(response);
    expect(Array.isArray(body.carrinhos) || Array.isArray(body)).toBeTruthy();
  });
});

test.describe('Carrinhos - DELETE /carrinhos/cancelar-compra', () => {
  test('@cartTest_10 - Deve limpar carrinho com sucesso', async ({ apiClient, createProduct, adminToken, testUserToken }) => {
    
    const { body: product } = await createProduct(adminToken);

    const cartData = {
      produtos: [
        {
          idProduto: product._id,
          quantidade: 5,
        },
      ],
    };

    const cartResponse = await apiClient.post(API_CONFIG.ENDPOINTS.CARRINHOS, cartData, {
      token: testUserToken,
    });
   
    const deleteResponse = await apiClient.delete(API_CONFIG.ENDPOINTS.CARRINHOS_CANCELAR_COMPRA, {
      token: testUserToken,
    });

    
    expect(deleteResponse.status()).toBe(200);

    const body = await APIClient.getResponseBody<DeleteCartResponse>(deleteResponse);
    expect(body).toHaveProperty('message');
  });
});

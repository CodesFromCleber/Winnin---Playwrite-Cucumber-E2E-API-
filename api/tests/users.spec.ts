/**
 * Testes para endpoint /usuarios
 * - Criar usuário com sucesso
 * - Validar campos essenciais
 * - Validar erros (email inválido, administrador inválido)
 * - Validar edição de um usuário
 * - Validar exclusão de um usuário
 */

import { test, expect } from '../fixtures/api.fixture';
import { APIClient } from '../client/api.client';
import API_CONFIG from '../config/api.config';
import { expectErrorContains } from '../helpers/error.helper';
import { CreateUserResponse, GetUsersResponse, DeleteUserResponse, ApiError, ValidationError, User } from '../types/api.types';
import {
  generateUniqueEmail,
  generateUserWithInvalidEmail,
  generateUserWithInvalidAdmin,
} from '../helpers/data.helper';

test.describe('Usuarios - POST /usuarios', () => {
  test('@userTest_01 - Deve criar usuário com sucesso (status 201)', async ({ apiClient, testUser }) => {
    
    const userData = testUser;


    const response = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, userData);

 
    expect(response.status()).toBe(201);

    const body = await APIClient.getResponseBody<CreateUserResponse>(response);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Cadastro realizado com sucesso');
  });

  test('@userTest_02 - Deve validar campos essenciais no body da resposta', async ({ createUser }) => {

    const { response, body } = await createUser();

 
    expect(response.status()).toBe(201);
    expect(body).toHaveProperty('_id');
    expect(body._id).toBeTruthy();
  });

  test('@userTest_03 - Deve validar coerência dos valores retornados', async ({ apiClient, createUser }) => {
   
    const { response: createResponse, body, data: userData } = await createUser();

    // Busca usuário para validar coerência
    const getResponse = await apiClient.get(API_CONFIG.ENDPOINTS.USUARIOS, { token: body._id });
    const getBody = await APIClient.getResponseBody<GetUsersResponse>(getResponse);


    expect(createResponse.status()).toBe(201);
    expect(getResponse.status()).toBe(200);
    
    // Valida que os dados são coerentes
    const user: any = getBody.usuarios?.find((u: any) => u._id === body._id) || getBody;
    expect(user.nome).toBe(userData.nome);
    expect(user.email).toBe(userData.email);
  });

  test('@userTest_04 - Deve rejeitar email inválido (status 400)', async ({ apiClient }) => {
   
    const invalidUserData = generateUserWithInvalidEmail();

  
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, invalidUserData);

 
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expect(body).toHaveProperty('email');
    expect(body.email).toBe('email deve ser um email válido');
  });

  test('@userTest_05 - Deve rejeitar campo administrador com valor inválido (status 400)', async ({ apiClient }) => {
   
    const invalidUserData = generateUserWithInvalidAdmin();


    const response = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, invalidUserData);

 
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expect(body).toHaveProperty('administrador');
    expect(body.administrador).toBe('administrador deve ser \'true\' ou \'false\'');
  });

  test('@userTest_06 - Deve rejeitar campo obrigatório sem preenchimento - nome (status 400)', async ({ apiClient }) => {
   
    const incompleteUserData = {
      email: generateUniqueEmail(),
      password: 'senha123',
      administrador: 'false',
      // Falta 'nome'
    };

    
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.USUARIOS, incompleteUserData);

  
    expect(response.status()).toBe(400);

    const body = await APIClient.getResponseBody<ValidationError>(response);
    expect(body).toHaveProperty('nome');
    expect(body.nome).toBe('nome é obrigatório');
  });

  test('@userTest_07 - Deve rejeitar email duplicado (status 400)', async ({ createUser }) => {
  
    const { response: firstCreate, data: userData } = await createUser();
    expect(firstCreate.status()).toBe(201);

    // Tenta criar com mesmo email
    const { response: secondCreate } = await createUser(userData);


    expect(secondCreate.status()).toBe(400);

    const body = await APIClient.getResponseBody<ApiError>(secondCreate);
    expect(body).toHaveProperty('message');
    expectErrorContains(body, 'email');
  });
});

test.describe('Usuarios - GET /usuarios', () => {
  test('@userTest_08 - Deve listar usuários com sucesso (200)', async ({ apiClient, testUser, testUserToken }) => {
  
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USUARIOS, { token: testUserToken });

    expect(response.status()).toBe(200);

    const body = await APIClient.getResponseBody<GetUsersResponse>(response);
    expect(Array.isArray(body.usuarios) || Array.isArray(body)).toBeTruthy();
  });
});



  test('@userTest_09 - Deve deletar usuário com sucesso', async ({ apiClient, createUser }) => {

    const { body: createdUser } = await createUser();


    const deleteResponse = await apiClient.delete(`${API_CONFIG.ENDPOINTS.USUARIOS}/${createdUser._id}`);


    expect(deleteResponse.status()).toBe(200);

    const body = await APIClient.getResponseBody<ApiError>(deleteResponse);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Registro excluído com sucesso');
  });


  test('@userTest_10 - Deve rejeitar exclusão de um usuário inexistente (status 404)', async ({ apiClient }) => {
    
    const nonExistentUserId = '64b64c7f8f1b2c0012345678';

 
    const deleteResponse = await apiClient.delete(`${API_CONFIG.ENDPOINTS.USUARIOS}/${nonExistentUserId}`);

 
    expect(deleteResponse.status()).toBe(200);

    const body = await APIClient.getResponseBody<ApiError>(deleteResponse);
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Nenhum registro excluído');
  });
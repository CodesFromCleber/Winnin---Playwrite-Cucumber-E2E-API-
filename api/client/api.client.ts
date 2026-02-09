/**
 * Cliente de API para testes ServeRest
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import API_CONFIG from '../config/api.config';

export interface IAPIClient {
  get(endpoint: string, options?: RequestOptions): Promise<APIResponse>;
  post(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse>;
  put(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse>;
  delete(endpoint: string, options?: RequestOptions): Promise<APIResponse>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  token?: string;
}

export class APIClient implements IAPIClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Headers com token de autorização, se fornecido
   */
  private getHeaders(options?: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (options?.token) {
      // ServeRest não usa "Bearer", apenas o token direto
      headers['Authorization'] = options.token;
    }

    return headers;
  }

  /**
   * GET request
   */
  async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return this.request.get(url, {
      headers: this.getHeaders(options),
      timeout: API_CONFIG.TIMEOUT.REQUEST,
    });
  }

  /**
   *  POST request
   */
  async post(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return this.request.post(url, {
      headers: this.getHeaders(options),
      data,
      timeout: API_CONFIG.TIMEOUT.REQUEST,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options?: RequestOptions): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return this.request.put(url, {
      headers: this.getHeaders(options),
      data,
      timeout: API_CONFIG.TIMEOUT.REQUEST,
    });
  }

  /**
   *  DELETE request
   */
  async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return this.request.delete(url, {
      headers: this.getHeaders(options),
      timeout: API_CONFIG.TIMEOUT.REQUEST,
    });
  }

  /**
   * Extrair dados da resposta
   */
  static async getResponseBody<T = any>(response: APIResponse): Promise<T> {
    return response.json();
  }

  /**
   * Validar status code
   */
  static async validateStatusCode(response: APIResponse, expectedStatus: number): Promise<void> {
    if (response.status() !== expectedStatus) {
      const body = await response.json().catch(() => ({}));
      throw new Error(
        `Status inválido. Esperado: ${expectedStatus}, Obtido: ${response.status()}\n` +
        `Body: ${JSON.stringify(body, null, 2)}`
      );
    }
  }
}

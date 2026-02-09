/**
 * Respostas da API ServeRest
 * type safety e autocomplete para testes
 */


// Tipos de Usuário
export interface User {
  _id: string;
  nome: string;
  email: string;
  password: string;
  administrador: string;
}

export interface CreateUserResponse {
  message: string;
  _id: string;
}

export interface GetUsersResponse {
  quantidade: number;
  usuarios: User[];
}

export interface DeleteUserResponse {
  message: string;
}


// Tipos de Login
export interface LoginResponse {
  message: string;
  authorization: string;
}


// Tipos de Produto
export interface Product {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

export interface CreateProductResponse {
  message: string;
  _id: string;
}

export interface GetProductsResponse {
  quantidade: number;
  produtos: Product[];
}

export interface DeleteProductResponse {
  message: string;
}

 
// Tipos de Carrinho
export interface CartProduct {
  idProduto: string;
  quantidade: number;
  precoUnitario?: number;
}

export interface Cart {
  _id: string;
  produtos: CartProduct[];
  precoTotal: number;
  quantidadeTotal: number;
  idUsuario: string;
}

export interface CreateCartRequest {
  produtos: CartProduct[];
}

export interface CreateCartResponse {
  message: string;
  _id: string;
}

export interface GetCartsResponse {
  quantidade: number;
  carrinhos: Cart[];
}

export interface DeleteCartResponse {
  message: string;
}


// Tipos de Erro
export interface ApiError {
  message?: string;
  error?: string;
}

export interface ValidationError {
  [field: string]: string | object;
}


// Tipos Genéricos de Resposta
export type ApiResponse<T> = T;

export interface ListResponse<T> {
  quantidade: number;
  [key: string]: T[] | number;
}

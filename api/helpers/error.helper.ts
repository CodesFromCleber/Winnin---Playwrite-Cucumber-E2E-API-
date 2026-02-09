/**
 * Helper para validação consistente de mensagens de erro da API
 * Extrai a mensagem de erro de uma resposta da API
 */
export function extractErrorMessage(body: any, field?: string): string {
  // Se body é string, retorna direto
  if (typeof body === 'string') {
    return body;
  }

  // Se não há field específico, tenta message genérico
  if (!field) {
    return body?.message ?? body?.error ?? JSON.stringify(body);
  }

  // Tenta buscar no campo específico
  const fieldValue = body?.[field];
  if (fieldValue) {
    return typeof fieldValue === 'string' ? fieldValue : JSON.stringify(fieldValue);
  }

  // Tenta buscar em nested fields (ex: body.item.idProduto)
  const itemValue = body?.item?.[field];
  if (itemValue) {
    return typeof itemValue === 'string' ? itemValue : JSON.stringify(itemValue);
  }

  // Tenta buscar em formato array (ex: body['produtos[0].quantidade'])
  const arrayPattern = `${field}`;
  const arrayValue = body?.[arrayPattern];
  if (arrayValue) {
    return typeof arrayValue === 'string' ? arrayValue : JSON.stringify(arrayValue);
  }

  // Fallback: retorna message ou stringify do body
  return body?.message ?? JSON.stringify(body);
}

/**
 * Valida que uma mensagem de erro contém palavras-chave esperadas
 */
export function expectErrorContains(body: any, keywords: string | string[], field?: string): void {
  const errorMessage = extractErrorMessage(body, field);
  const keywordList = Array.isArray(keywords) ? keywords : [keywords];
  
  const lowerMessage = String(errorMessage).toLowerCase();
  const hasKeyword = keywordList.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
  
  if (!hasKeyword) {
    throw new Error(
      `Error message "${errorMessage}" does not contain any of: ${keywordList.join(', ')}`
    );
  }
}

/**
 * Valida que o body possui a propriedade esperada
 */
export function expectHasProperty(body: any, property: string): void {
  if (!body) {
    throw new Error(`Body is null or undefined`);
  }

  // Checa propriedade direta
  if (body.hasOwnProperty(property)) {
    return;
  }

  // Checa em item nested
  if (body.item && body.item.hasOwnProperty(property)) {
    return;
  }

  throw new Error(`Body does not have property: ${property}`);
}

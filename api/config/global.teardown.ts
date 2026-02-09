/**
 * Teardown global para testes de API
 */

async function globalTeardown() {
  console.log('\n=== Finalizando testes de API ===');
  
  // LEMBRAR* Adicionar lógica de limpeza global(deletar todos os usuários de teste criados)
  
  console.log('✓ Testes de API concluídos');
}

export default globalTeardown;

/**
 * Setup global para testes de API
 */

async function globalSetup() {
  console.log('\n=== Iniciando testes de API ===');
  
  // Valida que a API está acessível
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${apiBaseUrl}/usuarios`);
    if (response.status >= 500) {
      throw new Error('API retornou erro 5xx');
    }
    console.log(`API está acessível em ${apiBaseUrl}`);
  } catch (error) {
    console.error(`  Não foi possível acessar a API em ${apiBaseUrl}`);
    console.error(`  Certifique-se de que o ServeRest está rodando.`);
    console.error(`  Execute: npx serverest@latest`);
    throw error;
  }
}

export default globalSetup;

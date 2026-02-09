const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

// Cria o diretório de reports se não existir
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const options = {
  theme: 'bootstrap',
  jsonFile: path.join(reportsDir, 'cucumber_report.json'),
  output: path.join(reportsDir, 'cucumber_report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Name': 'GE Globo - Testes E2E',
    'Test Environment': 'Production',
    'Browser': process.env.BROWSER || 'chromium',
    'Platform': process.platform,
    'Executed': new Date().toLocaleString('pt-BR')
  },
  failedSummaryReport: true,
};

try {
  reporter.generate(options);
  console.log('\n✅ Relatório HTML gerado com sucesso!');
  console.log(`📄 Localização: ${options.output}`);
} catch (error) {
  console.error('❌ Erro ao gerar relatório:', error);
  process.exit(1);
}

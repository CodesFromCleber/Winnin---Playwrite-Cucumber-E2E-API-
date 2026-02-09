# language: pt
Funcionalidade: Validação da página inicial do GE

  Como usuário do Globo Esporte
  Quero acessar a página inicial
  Para visualizar as notícias mais recentes de futebol

  Contexto:
    Dado que o usuário acessa a página inicial do GE

  @homeTest_01
  Cenário: Deve acessar home GE com sucesso
    Então a página inicial deve estar carregada
    E a URL deve conter "ge.globo.com"

  @homeTest_02
  Cenário: Deve exibir no mínimo 10 notícias
    Então devem existir pelo menos 10 notícias na página
    E o total de notícias deve ser exibido no console

  @homeTest_03
  Cenário: Deve abrir matéria completa ao clicar em uma notícia
    Quando clicar em uma notícia
    Então a página da notícia deve ser carregada
    E a URL deve conter "ge.globo.com"

  @homeTest_04
  Cenário: Deve acessar página de time da Série A
    Quando selecionar um time da Série A
    Então a página do time deve estar carregada
    E a página deve conter notícias relacionadas ao time

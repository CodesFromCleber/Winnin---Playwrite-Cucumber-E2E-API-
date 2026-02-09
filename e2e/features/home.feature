@e2e @homeGe
Feature: Exibição de notícias esportivas na página inicial
  Como um usuário padrao do portal GE
  Eu quero visualizar as últimas notícias esportivas
  Para me manter informado sobre o mundo do esporte

  Background:
    Given que o usuário acessa a página inicial do GE

  @smoke @critical
  Scenario: Validar acesso à página inicial do GE
    Then a página inicial do GE deve estar acessível

  @smoke @critical
  Scenario: Exibir quantidade mínima de notícias na home
    Then devem ser exibidas no mínimo 10 notícias

  @smoke @critical
  Scenario: Validar estrutura das notícias
    Then cada notícia deve conter título, imagem e resumo

  @navigation @critical
  Scenario: Acessar matéria completa ao clicar em notícia
    When clicar em uma notícia
    Then deve ser redirecionado para a matéria completa

  @navigation @teams-Serie-A @critical
  Scenario: Acessar página de um time da Série A
    When selecionar um time da Série A
    Then deve ser redirecionado para a página do clube
    And visualizar notícias relacionadas ao time
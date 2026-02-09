/**
 * Helper para estratégias de wait inteligentes
 * Substitui waitForTimeout fixos por waits baseados em condições
 */

import { Page, Locator } from '@playwright/test';

export class WaitStrategy {
  /**
   * Aguarda elemento estar visível e estável (parou de se mover)
   */
  static async waitForStable(
    locator: Locator,
    timeout: number = 10000,
    stableTime: number = 500
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    
    // Aguarda elemento parar de mudar de posição
    let lastBox = await locator.boundingBox();
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      await this.wait(100);
      const currentBox = await locator.boundingBox();
      
      if (lastBox && currentBox) {
        const isSame = 
          lastBox.x === currentBox.x &&
          lastBox.y === currentBox.y &&
          lastBox.width === currentBox.width &&
          lastBox.height === currentBox.height;
        
        if (isSame) {
          await this.wait(stableTime);
          const finalBox = await locator.boundingBox();
          
          if (finalBox && 
              finalBox.x === currentBox.x && 
              finalBox.y === currentBox.y) {
            return;
          }
        }
      }
      
      lastBox = currentBox;
    }
  }

  /**
   * Aguarda elemento estar visível com retry
   */
  static async waitForVisible(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Aguarda elemento estar attached ao DOM
   */
  static async waitForAttached(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
  }

  /**
   * Aguarda URL conter determinado texto
   */
  static async waitForUrlContains(
    page: Page,
    urlPart: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForURL(`**/*${urlPart}*`, { timeout });
  }

  /**
   * Aguarda network estar idle (sem requisições por 500ms)
   */
  static async waitForNetworkIdle(
    page: Page,
    timeout: number = 30000
  ): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Aguarda DOM estar carregado
   */
  static async waitForDomContentLoaded(
    page: Page,
    timeout: number = 30000
  ): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Aguarda contagem de elementos atingir mínimo esperado
   */
  static async waitForMinCount(
    locator: Locator,
    minCount: number,
    timeout: number = 10000
  ): Promise<number> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const count = await locator.count();
      if (count >= minCount) {
        return count;
      }
      await this.wait(200);
    }
    
    throw new Error(`Timeout: Expected at least ${minCount} elements, but found ${await locator.count()}`);
  }

  /**
   * Aguarda condição customizada
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 200
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        if (await condition()) {
          return true;
        }
      } catch {
        // Continua tentando
      }
      await this.wait(interval);
    }
    
    return false;
  }

  /**
   * Aguarda elemento ter texto não vazio
   */
  static async waitForText(
    locator: Locator,
    timeout: number = 10000
  ): Promise<string> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      await this.waitForVisible(locator, 1000).catch(() => {});
      const text = await locator.textContent();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
      await this.wait(200);
    }
    
    throw new Error('Timeout: Element has no text content');
  }

  /**
   * Aguarda elemento ter atributo com valor específico
   */
  static async waitForAttribute(
    locator: Locator,
    attribute: string,
    expectedValue?: string,
    timeout: number = 10000
  ): Promise<string | null> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const value = await locator.getAttribute(attribute);
      
      if (expectedValue === undefined && value !== null) {
        return value;
      }
      
      if (value === expectedValue) {
        return value;
      }
      
      await this.wait(200);
    }
    
    throw new Error(`Timeout: Attribute "${attribute}" did not match expected value`);
  }

  /**
   * Aguarda elemento desaparecer (hidden)
   */
  static async waitForHidden(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Aguarda elemento ser removido do DOM
   */
  static async waitForDetached(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ state: 'detached', timeout });
  }

  /**
   * Helper para delay simples (usar apenas quando necessário)
   */
  private static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Aguarda página estar totalmente carregada (DOM + Network + Imagens)
   */
  static async waitForPageFullyLoaded(
    page: Page,
    timeout: number = 30000
  ): Promise<void> {
    await page.waitForLoadState('load', { timeout });
    await this.waitForNetworkIdle(page, timeout);
  }

  /**
   * Aguarda múltiplos elementos estarem visíveis
   */
  static async waitForMultipleVisible(
    locators: Locator[],
    timeout: number = 10000
  ): Promise<void> {
    const promises = locators.map(loc => this.waitForVisible(loc, timeout));
    await Promise.all(promises);
  }

  /**
   * Aguarda animação CSS terminar
   */
  static async waitForAnimationEnd(
    locator: Locator,
    timeout: number = 5000
  ): Promise<void> {
    await this.waitForVisible(locator, timeout);
    
    // Aguarda 300ms após visível para animações padrão
    await this.wait(300);
    
    // Verifica se está estável
    await this.waitForStable(locator, timeout, 200);
  }

  /**
   * Retry de função até ter sucesso
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayBetweenAttempts: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await this.wait(delayBetweenAttempts);
        }
      }
    }
    
    throw lastError || new Error('Retry failed');
  }
}

import { expect, Page, Locator } from '@playwright/test';

/**
 *  * Centraliza verificações comuns de UI para melhor legibilidade e manutenibilidade
 *
 */
export class AssertionHelper {
  /**
   * ✓ Valida se página está acessível verificando URL
   * @example await AssertionHelper.expectPageAccessible(page, /ge\.globo\.com/)
   */
  static async expectPageAccessible(page: Page, expectedUrlPattern: RegExp): Promise<void> {
    await expect(page).toHaveURL(expectedUrlPattern);
  }

  /**
   * ✓ Valida se elemento está visível na tela
   * @example await AssertionHelper.expectVisible(newsCard)
   */
  static async expectVisible(locator: Locator, timeout: number = 5000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * ✓ Valida se elemento está oculto
   * @example await AssertionHelper.expectHidden(loadingSpinner)
   */
  static async expectHidden(locator: Locator, timeout: number = 5000): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * ✓ Valida quantidade EXATA de elementos
   * @example await AssertionHelper.expectElementCount(rows, 5)
   */
  static async expectElementCount(locator: Locator, expectedCount: number): Promise<void> {
    await expect(locator).toHaveCount(expectedCount);
  }

  /**
   * ✓ Valida quantidade MÍNIMA de elementos
   * @example await AssertionHelper.expectMinCount(newsCards, 10)
   */
  static async expectMinCount(
    locator: Locator,
    minCount: number,
    errorMessage?: string
  ): Promise<void> {
    const count = await locator.count();
    expect(
      count,
      errorMessage || `Esperado no mínimo ${minCount} elementos, mas encontrou ${count}`
    ).toBeGreaterThanOrEqual(minCount);
  }

  /**
   * ✓ Valida se elemento contém texto específico
   * @example await AssertionHelper.expectTextContains(title, "Notícia")
   */
  static async expectTextContains(
    locator: Locator,
    expectedText: string,
    timeout: number = 5000
  ): Promise<void> {
    await expect(locator).toContainText(expectedText, { timeout });
  }

  /**
   * ✓ Valida se elemento tem texto EXATO
   * @example await AssertionHelper.expectExactText(title, "Título da Notícia")
   */
  static async expectExactText(
    locator: Locator,
    expectedText: string,
    timeout: number = 5000
  ): Promise<void> {
    await expect(locator).toHaveText(expectedText, { timeout });
  }

  /**
   * ✓ Valida se elemento está habilitado
   * @example await AssertionHelper.expectEnabled(submitButton)
   */
  static async expectEnabled(locator: Locator, timeout: number = 5000): Promise<void> {
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * ✓ Valida se elemento está desabilitado
   * @example await AssertionHelper.expectDisabled(submitButton)
   */
  static async expectDisabled(locator: Locator, timeout: number = 5000): Promise<void> {
    await expect(locator).toBeDisabled({ timeout });
  }

  /**
   * ✓ Valida se checkbox está marcado
   * @example await AssertionHelper.expectChecked(checkbox)
   */
  static async expectChecked(locator: Locator, timeout: number = 5000): Promise<void> {
    await expect(locator).toBeChecked({ timeout });
  }

  /**
   * ✓ Valida se elemento tem atributo específico
   * @example await AssertionHelper.expectHasAttribute(link, "href", "https://")
   */
  static async expectHasAttribute(
    locator: Locator,
    attrName: string,
    attrValue?: string,
    timeout: number = 5000
  ): Promise<void> {
    if (attrValue) {
      await expect(locator).toHaveAttribute(attrName, new RegExp(attrValue), { timeout });
    } else {
      const attr = await locator.getAttribute(attrName);
      expect(attr).not.toBeNull();
    }
  }

  /**
   * ✓ Valida URL da página
   * @example await AssertionHelper.expectURL(page, /ge\.globo\.com/)
   */
  static async expectURL(page: Page, expectedUrl: string | RegExp): Promise<void> {
    await expect(page).toHaveURL(expectedUrl);
  }

  /**
   * ✓ Validação customizada com função
   * @example await AssertionHelper.expectCustom(result === true, "Validação falhou")
   */
  static async expectCustom(
    condition: boolean | Promise<boolean>,
    message: string
  ): Promise<void> {
    const result = await Promise.resolve(condition);
    expect(result, message).toBeTruthy();
  }

  /**
   * ✓ Valida se todos os elementos contêm atributo src (imagem carregada)
   * @example await AssertionHelper.expectAllHaveImages(newsCards)
   */
  static async expectAllHaveImages(locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      const src = await locator.getAttribute('src');
      expect(src, `Imagem sem src encontrada`).toBeTruthy();
    }
  }

  /**
   * ✓ Valida se elemento está em foco
   * @example await AssertionHelper.expectFocused(inputField)
   */
  static async expectFocused(locator: Locator, timeout: number = 5000): Promise<void> {
    await expect(locator).toBeFocused({ timeout });
  }
}

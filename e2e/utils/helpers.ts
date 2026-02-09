/**
 * Helper utilitários para testes E2E
 * Nota: Para estratégias de wait, use WaitStrategy em helpers/wait.helper.ts
 */

export class DateHelper {
  /**
   * Formata data para o padrão brasileiro
   */
  static formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retorna a data atual formatada
   */
  static getCurrentDate(): string {
    return this.formatDate(new Date());
  }

  /**
   * Verifica se uma data é hoje
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  /**
   * Retorna diferença em dias entre duas datas
   */
  static daysDiff(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export class StringHelper {
  /**
   * Remove acentos de uma string
   */
  static removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Converte string para slug (URL-friendly)
   */
  static toSlug(str: string): string {
    return this.removeAccents(str)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Trunca texto mantendo palavras completas
   */
  static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    
    const truncated = str.substr(0, maxLength);
    return truncated.substr(0, truncated.lastIndexOf(' ')) + '...';
  }
}

export class UrlHelper {
  /**
   * Verifica se uma URL é válida
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extrai o domínio de uma URL
   */
  static getDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return '';
    }
  }

  /**
   * Verifica se a URL pertence ao domínio GE
   */
  static isGEDomain(url: string): boolean {
    const domain = this.getDomain(url);
    return domain.includes('ge.globo.com') || domain.includes('globoesporte.globo.com');
  }
}

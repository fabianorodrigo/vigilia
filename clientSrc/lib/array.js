module.exports = class ArrayUtils {
  /**
   * Ordena o array passado pelas propriedades solicitadas de forma ascendente
   * @param {Array} array Array que serÃ¡ ordenado
   * @param {String[]} atributos Atributos pelos quais o array serÃ¡ ordenado
   */
  static ordenarASC(array, atributos) {
    if (array == null || !Array.isArray(array)) {
      throw new Error(
        `O array para ordenaÃ§Ã£o nÃ£o foi informado adequadamente: ${array}`,
      );
    }
    if (
      atributos == null ||
      !Array.isArray(atributos) ||
      atributos.length == 0
    ) {
      throw new Error(
        `Os atributos para ordenaÃ§Ã£o nÃ£o foram informados adequadamente: ${atributos}`,
      );
    }
    array.sort(function(a, b) {
      for (let i = 0; i < atributos.length; i++) {
        if (a[atributos[i]] < b[atributos[i]]) {
          return -1;
        } else if (a[atributos[i]] > b[atributos[i]]) {
          return 1;
        } else {
          continue;
        }
      }
      //Se chegou aqui, Ã© por que nÃ£o passou pelo nenhum dos returns acima,logo, Ã© igual
      return 0;
    });
  }

  /**
   * Ordena o array passado pelas propriedades solicitadas de forma descendente
   * @param {Array} array Array que serÃ¡ ordenado
   * @param {String[]} atributos Atributos pelos quais o array serÃ¡ ordenado
   */
  static ordenarDESC(array, atributos) {
    if (array == null || !Array.isArray(array)) {
      throw new Error(
        `O array para ordenaÃ§Ã£o nÃ£o foi informado adequadamente: ${array}`,
      );
    }
    if (
      atributos == null ||
      !Array.isArray(atributos) ||
      atributos.length == 0
    ) {
      throw new Error(
        `Os atributos para ordenaÃ§Ã£o nÃ£o foram informados adequadamente: ${atributos}`,
      );
    }
    array.sort(function(a, b) {
      for (let i = 0; i < atributos.length; i++) {
        if (a[atributos[i]] < b[atributos[i]]) {
          return 1;
        } else if (a[atributos[i]] > b[atributos[i]]) {
          return -1;
        } else {
          continue;
        }
      }
      //Se chegou aqui, Ã© por que nÃ£o passou pelo nenhum dos returns acima,logo, Ã© igual
      return 0;
    });
  }

  /**
   * Filtra o array passado procurando em todas as propriedades de seus objetos (que seja string) a ocorrÃªncia do termo solicitado
   * @param {Array} array Array que serÃ¡ ordenado
   * @param {String} termo Atributos pelos quais o array serÃ¡ ordenado
   */
  static filtra(array, termo) {
    const filtroTermo = termo == null ? '' : termo.toLowerCase();
    if (filtroTermo != null && filtroTermo != '') {
      array = array.filter(b => {
        const valores = Object.values(b);
        for (let i = 0; i < valores.length; i++) {
          if (
            valores[i] != null &&
            typeof valores[i] == 'string' &&
            valores[i].toLowerCase().indexOf(filtroTermo) > -1
          ) {
            return true;
          }
        }
        return false;
      });
    }
    return array;
  }
};

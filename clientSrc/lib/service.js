import axios from 'axios';
import {requiredParam} from './utils';

/**
 * FunÃ§Ã£o responsÃ¡vel por encapsular as chamadas a serviÃ§os e dar um tratamento padrÃ£o
 */
function decoratorRemoteCall(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        if (e.response.status == 401) {
          sessionStorage.removeItem('access_token');
          reject(e);
        } else {
          reject(e);
        }
      });
  });
}

const Service = {
  /**
   * Loga com um TTL padrÃ£o de 3600 segundos
   */
  login: function(autenticacao) {
    return axios.post(`/api/Usuarios/login`, {
      email: autenticacao.email,
      password: autenticacao.senha,
      ttl: 3600,
    });
  },

  logout: function() {
    return axios.post(`/api/Usuarios/logout`);
  },

  /**
   * Faz um GET no endpoint referente o nome do modelo no plural passado
   *
   * @param {string} nomeModeloPlural Nome do modelo que se deseja buscar os dados no plural
   * @param {Array} filtroAND ExpressÃµes que delimitam o resultado da busca cumulativamente (AND) no formato {"atributo": "Valor"}
   * @param {Array} filtroOR ExpressÃµes que delimitamo resultado comutativamente (OR) no format {"atributo":"Valor"}
   * @param {Array} include Especifica se trÃ¡s dados de modelos relacionados ao modelo do nomeModeloPlural. Pode ser um nÃ­vel apenas, ex. "Municipios",
   * ou pode ser em vÃ¡rios dois nÃ­veis e aÃ­ separa-se por "|", ex. "Municipios|Bairros"
   * @param {string} literalInclude Enquanto o parÃ¢metro interior monta o include em uma sequÃªncia encapsulando sua complexidade, este parÃ¢metro
   * especifica exatamente como o include serÃ¡, podendo fazer combinaÃ§Ãµes mais elaboradas desde que se conheÃ§a a sintaxe do queryString Loopback
   * @param {Array} sort Atributos pelos quais se deseja o resultado ordenado
   */
  getAll: function({
    nomeModeloPlural = requiredParam('nomeModeloPlural'),
    filtroAND = [],
    filtroOR = [],
    include = [],
    literalInclude,
    sort = [],
  }) {
    if (
      filtroAND != null &&
      Array.isArray(filtroAND) &&
      filtroAND.length > 0 &&
      filtroOR != null &&
      Array.isArray(filtroOR) &&
      filtroOR.length > 0
    ) {
      console.warn(
        `Foi solicitado tanto filtro "AND" quanto filtro "OR". O segundo serÃ¡ preterido`,
      );
    }

    let fqs = '';
    if (literalInclude != null) {
      fqs += `filter={"include":${literalInclude}`;
    } else if (include != null && include.length > 0) {
      fqs += `filter={"include":[`;
      for (let f = 0; f < include.length; f++) {
        if (f < include.length - 1) {
          fqs += '{';
        }
        fqs += `"${include[f]}"`;
        //Ã‰ o Ãºltimo, entra
        if (f == include.length - 1) {
          //Se for mais de um, adiciona chaves pra fechar
          if (include.length > 1) {
            fqs += '}';
          }
          //if (include.length > 1) { //versao anterior que parou de funcionar quando botou 'sort': if (include.length > 1)
          fqs += ']';
          //}
        } else {
          fqs += ':';
        }
      }
    }
    if (filtroAND != null && Array.isArray(filtroAND) && filtroAND.length > 0) {
      const temInclude = fqs.indexOf('filter') > -1;
      fqs += temInclude ? ',' : 'filter={';
      fqs += `"where":`;
      if (filtroAND.length > 1) {
        fqs += `{"and":[`;
      }
      for (let f = 0; f < filtroAND.length; f++) {
        if (f > 0) {
          fqs += ',';
        }
        fqs += '{';
        fqs += filtroAND[f];
        fqs += '}';
      }
      if (filtroAND.length > 1) {
        fqs += `]}`;
      }
    } else if (
      filtroOR != null &&
      Array.isArray(filtroOR) &&
      filtroOR.length > 0
    ) {
      const temInclude = fqs.indexOf('filter') > -1;
      fqs += temInclude ? ',' : 'filter={';
      fqs += `"where":`;
      if (filtroOR.length > 1) {
        fqs += `{"or":[`;
      }
      for (let f = 0; f < filtroOR.length; f++) {
        if (f > 0) {
          fqs += ',';
        }
        fqs += '{';
        fqs += filtroOR[f];
        fqs += '}';
      }
      if (filtroOR.length > 1) {
        fqs += `]}`;
      }
    }
    if (sort != null && Array.isArray(sort) && sort.length > 0) {
      fqs += fqs.indexOf('filter') > -1 ? ',' : 'filter={';
      fqs += `"sort":[`;
      for (let f = 0; f < sort.length; f++) {
        if (f > 0) {
          fqs += ',';
        }
        fqs += `"${sort[f]}"`;
      }
      fqs += `]`;
    }
    fqs += '}';

    //console.log(`/api/${nomeModeloPlural}?${fqs}`)
    return decoratorRemoteCall(`/${nomeModeloPlural}?${fqs}`);
  },

  /**
   * Busca no EndPoint de {nomePlural} os registros onde algum dos campos solicitados em {campos} apresente a {expressaoFiltro}.
   * Os resultados incluirÃ£o a entidade que se relaciona solicitadas em {include}.
   * Se for encontrar o sÃ­mbolo "+" na {expressaoFiltro}, entende-se como "AND", ou seja, sÃ³ virÃ£o resultados em que algum dos {campos}
   * apresentarem todas as partes separadas por "+"
   * Se for encontrado "," em {expressaoFiltro}, entende-se como "OR", ou seja, qualquer registro que possuir ao menos uma das partes separadas
   * por ",", serÃ¡ retornado
   */
  getAllLike: function({
    nomeModeloPlural = requiredParam('nomeModeloPlural'),
    expressaoFiltro,
    campos = [],
    include = [],
  }) {
    const c = encodeURI('%');
    let fqs = '';
    if (include.length > 0) {
      fqs += `filter={"include":`;
      for (let f = 0; f < include.length; f++) {
        if (f < include.length - 1) {
          fqs += '{';
        }
        fqs += `"${include[f]}"`;
        if (f == include.length - 1) {
          if (include.length > 1) {
            fqs += '}';
          }
        } else {
          fqs += ':';
        }
      }
    }
    if (expressaoFiltro != null && expressaoFiltro != '') {
      //Colocando caracter escape quando existirem aspas
      expressaoFiltro = expressaoFiltro.replace(/"/g, `\\"`);
      //expressaoFiltro = expressaoFiltro.replace(':',encodeURI(`:`));
      expressaoFiltro = encodeURI(expressaoFiltro);
      fqs += fqs.indexOf('filter') > -1 ? ',' : 'filter={';
      //Se tiver mais no filtro, entende-se que os campos tem que ter todas os itens ao mesmo tempo
      const filtrosAND = expressaoFiltro.split('+');
      //Se tiver vÃ­rgula no filtro, entende-se que os campos tem que ter ao menos um dos itens
      const filtrosOR = [];
      //as expressÃµes AND que tiverem ocorrÃªncias de vÃ­rgulas, serÃ£o transferidas por array {filtrosOR}
      //e adicionadas em outro array para que sejam removidas posteriormente do {filtrosAND}
      const removerDeFiltrosAND = [];
      filtrosAND.forEach(filtro => {
        if (filtro.indexOf(',') >= 0) {
          removerDeFiltrosAND.push(filtro);
          const partes = filtro.split(',');
          partes.forEach(p => {
            filtrosOR.push(p.trim());
          });
        }
      });
      removerDeFiltrosAND.forEach(filtro => {
        filtrosAND.splice(filtrosAND.indexOf(filtro), 1);
      });

      fqs += `"where":{"or":[`;

      //Para cada filtro OR vai executar uma vez o laÃ§o externo, se nÃ£o houver, executa ao menos uma vez
      let contaOR = filtrosOR.length - 1;
      do {
        for (let i = 0; i < campos.length; i++) {
          if (i > 0 || contaOR < filtrosOR.length - 1) {
            fqs += `,`;
          }
          if (filtrosAND.length > 0) {
            fqs += `{"and":[`;
          }

          //Se existe um filtroOR nesta posiÃ§Ã£o, acrescenta ao laÃ§os de AND
          if (filtrosOR[contaOR] != null) {
            fqs += `{"${campos[i]}":{"like":"${c}${
              filtrosOR[contaOR]
            }${c}","options":"i"}}`;
          }

          for (let f = 0; f < filtrosAND.length; f++) {
            if (f > 0 || filtrosOR[contaOR] != null) {
              fqs += ',';
            }
            fqs += `{"${campos[i]}":{"like":"${c}${
              filtrosAND[f]
            }${c}","options":"i"}}`;
          }
          if (filtrosAND.length > 0) {
            fqs += `]}`;
          }
        }
        contaOR--;
      } while (contaOR >= 0);

      fqs += `]}`;
    }
    fqs += '}';

    //console.log(`/api/${nomeModeloPlural}?${fqs}`)
    return axios.get(`/api/${nomeModeloPlural}?${fqs}`);
  },

  delete: function({nomeModeloPlural, id}) {
    return axios.delete(`/api/${nomeModeloPlural}/${id}`);
  },

  get: function({nomeModeloPlural, id, include = []}) {
    const url = `/api/${nomeModeloPlural}/${id == null ? '' : id}`;
    return axios.get(adicionaIncludeURL(url, include));
  },

  update: function({nomeModeloPlural, instancia}) {
    return axios.put(`/api/${nomeModeloPlural}/`, instancia);
  },

  patch: function({nomeModeloPlural, instancia}) {
    return axios.patch(`/api/${nomeModeloPlural}/`, instancia);
  },

  insert: function({nomeModeloPlural, instancia}) {
    return axios.post(`/api/${nomeModeloPlural}/`, instancia);
  },
  post: function({nomeModeloPlural, instancia}) {
    return axios.post(`/api/${nomeModeloPlural}/`, instancia);
  },
  handleError: function(error) {
    if (error.response) {
      alert(
        'Code: ' +
          error.response.data.error.code +
          '\r\nMessage: ' +
          error.response.data.error.message,
      );
    } else {
      console.log('Error', error.message);
    }
  },
};

function adicionaIncludeURL(url, include = []) {
  if (include && include.length > 0) {
    for (let i = 0; i < include.length; i++) {
      if (url.indexOf('?filter') > -1) {
        url += `&`;
      } else {
        url += `?`;
      }
      if (include[0].indexOf('|') > -1) {
        const partesInclude = include[i].split('|');
        url += `filter[include][${partesInclude[0]}]=${partesInclude[1]}`;
      } else {
        url += `filter[include]=${include[i]}`;
      }
    }
  }
  return url;
}

export {Service};

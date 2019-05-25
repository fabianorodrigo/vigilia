//serviços
import {Service} from './lib/service';

import {ArrayUtils} from './lib/array';
import {requiredParam} from './lib/utils';

//Controllers Especializados
import FornecedorController from './controllers/FornecedorController';

class AppController {
  constructor(appUI) {
    this._appUI = appUI;

    this.controllers = {};
    // Gera todos os controllers necessários à aplicação
    AppController.geraController({
      app: this,
      nomeEntidade: 'Fornecedor',
      nomeEntidadePlural: 'Fornecedores',
      mantemState: true,
      camposObrigatorios: [
        {atributo: 'cnpj', label: 'CNPJ'},
        {atributo: 'razaoSocial', label: 'Razão Social'},
        {atributo: 'nomeFantasia', label: 'Nome Fantasia'},
      ],
      especializacao: new FornecedorController(this),
    });
  }

  /**
   * Para os controllers que mantém cópia dos registros da base na State, recarrega e armazena na state
   */
  cargaEntidades() {
    Object.values(this.controllers).forEach(controller => {
      if (controller.mantemState) {
        controller.carrega();
      }
    });
  }

  mostraMensagem(msg, tipo, cb) {
    this._appUI.refs.popupMensagem.handleAlertShow(msg, tipo, cb);
  }

  get appUI() {
    return this._appUI;
  }

  validaCamposObrigatorios(instancia, campos = []) {
    const invalidos = [];
    campos.forEach(function(campo) {
      if (
        instancia[campo.atributo] == null ||
        (Array.isArray(instancia[campo.atributo]) &&
          instancia[campo.atributo].length == 0) ||
        (typeof instancia[campo.atributo] == 'string' &&
          instancia[campo.atributo].trim() == '')
      ) {
        invalidos.push(campo);
      }
    });
    return invalidos;
  }

  getState(atributo) {
    return this._appUI.getStateDados(atributo);
  }
  setState(atributo, valor) {
    if (atributo == 'loading' && valor == true) {
      //setando cursor para processamento em progresso
      document.body.style.cursor = 'wait';
    }
    this._appUI.atualizaStateDados(atributo, valor);
    //Voltando cursor ao normal
    if (atributo == 'loading' && valor == false) {
      document.body.style.cursor = 'default';
    }
  }

  carrega(nomeEntidade) {
    if (this.controllers[nomeEntidade] == null) {
      throw new Error(
        `Não foi configurado um controller para a entidade "${nomeEntidade}"`,
      );
    }
    this.controllers[nomeEntidade].carrega();
  }
  filtraState(nomeEntidade, termo) {
    if (this.controllers[nomeEntidade] == null) {
      throw new Error(
        `Não foi configurado um controller para a entidade "${nomeEntidade}"`,
      );
    }
    return this.controllers[nomeEntidade].filtraState(termo);
  }
  edita(nomeEntidade, instancia) {
    if (this.controllers[nomeEntidade] == null) {
      throw new Error(
        `Não foi configurado um controller para a entidade "${nomeEntidade}"`,
      );
    }
    this.controllers[nomeEntidade].edita(instancia);
  }
  salva(nomeEntidade, instancia, callback) {
    if (this.controllers[nomeEntidade] == null) {
      throw new Error(
        `Não foi configurado um controller para a entidade "${nomeEntidade}"`,
      );
    }
    this.controllers[nomeEntidade].salva(instancia, callback);
  }
  exclui(nomeEntidade, instancia, callback) {
    if (this.controllers[nomeEntidade] == null) {
      throw new Error(
        `Não foi configurado um controller para a entidade "${nomeEntidade}"`,
      );
    }
    this.controllers[nomeEntidade].exclui(instancia, callback);
  }

  /**
   * Gera um controller genérico voltado para uma entidad específica
   *
   * OBSERVAÇÃO: Padrão RORO (Receive an Object, Return an Object)
   *
   * @param {Object} app Instância de Controller da aplicação
   * @param {String} nomeEntidade Nome da entidade que o controller manterá
   * @param {String} nomeEntidadePlural Nome da entidade que o controller manterá no plural (usada nas URLs dos serviços REST)
   * @param {boolean} mantemState Se TRUE, mantém na state (memória) uma cópia dos registros do banco para serem usados em outros pontos da aplicação
   * @param {[String]} includesCarga Array de nomes de entidades a se fazer INCLUDE ao chamar o método carrega
   * @param {String} atributoValueAutosuggest Nome do Atributo que será atribuído à propriedade "value", caso a instância venha  a ser exibida em um Autosuggest (pode ser array ou função do próprio controller)
   * @param {[Object]} camposObrigatorios Array de objetos {atributo, label} para validar quando for salvar
   * @param {Object} especializacao Quando a entidade demandar uma especialização que foge do CRUD comum, uma instância desta especialização pode ser guardada no controller
   */
  static geraController({
    app = requiredParam('app'),
    nomeEntidade = requiredParam('nomeEntidade'),
    nomeEntidadePlural = requiredParam('nomeEntidadePlural'),
    mantemState,
    includesCarga,
    atributoValueAutosuggest,
    camposObrigatorios,
    especializacao,
  }) {
    let assercoesMsg = '';
    if (nomeEntidade.trim() == '') {
      assercoesMsg += `@nomeEntidade deve ser informado\n\r`;
    }
    if (nomeEntidadePlural.trim() == '') {
      assercoesMsg += `@nomeEntidadePlural deve ser informado\n\r`;
    }
    if (includesCarga != null && !Array.isArray(includesCarga)) {
      assercoesMsg += `@includesCarga deve ser um array\n\r`;
    }
    if (!Array.isArray(camposObrigatorios)) {
      assercoesMsg += `@camposObrigatorios deve ser um array\n\r`;
    }
    if (assercoesMsg != '') {
      throw new Error(assercoesMsg);
    }

    app.controllers[nomeEntidade] = {
      mantemState: mantemState,
      especializacao: especializacao,
      carrega: () => {
        return carregaGenerico({
          app: app,
          nomeEntidadePlural: nomeEntidadePlural,
          mantemState: mantemState,
          includesCarga: includesCarga,
          atributoValueAutosuggest: atributoValueAutosuggest,
        });
      },
      filtraState: termo => {
        return ArrayUtils.filtra(
          Object.values(app.getState(nomeEntidadePlural)),
          termo,
        );
      },
      edita: instancia => {
        app.appUI.refs[`form${nomeEntidade}`].abrirForm(instancia);
      },
      salva: (instancia, cb) => {
        return salvaGenerico({
          app: app,
          nomeEntidade: nomeEntidade,
          nomeEntidadePlural: nomeEntidadePlural,
          mantemState: mantemState,
          camposObrigatorios: camposObrigatorios,
          instancia: instancia,
          cb: cb,
        });
      },
      exclui: (instancia, cb) => {
        return excluiGenerico({
          app: app,
          nomeEntidade: nomeEntidade,
          nomeEntidadePlural: nomeEntidadePlural,
          mantemState: mantemState,
          instancia: instancia,
          cb: cb,
        });
      },
    };
    //Todas as funções da especialização, serão transferidas para a instância do controller para facilitar a referenciação ao longo do código
    if (especializacao != null) {
      //Pega primeiro a classe (getPrototypeOf) e então pega as propriedades dela (getOwnPropertyNames)
      Object.getOwnPropertyNames(Object.getPrototypeOf(especializacao)).forEach(
        nome => {
          //apenas as funções (as que possuem o mesmo nome, serão sobrescritas do que foi definido acima)
          if (
            typeof especializacao[nome] == 'function' &&
            nome != 'constructor'
          ) {
            //Para cada método da especialização, cria uma função que o invocará o respectivo método da respectiva instãncia recebida
            app.controllers[nomeEntidade][nome] = (...args) => {
              return especializacao[nome](...args);
            };
          }
        },
      );
    }
  }
}

/**
 * Implementação genérica do método de carregar os registros de uma entidade para a State do componente Main
 */
async function carregaGenerico({
  app = requiredParam('app'),
  nomeEntidadePlural = requiredParam('nomeEntidadePlural'),
  mantemState,
  includesCarga,
  atributoValueAutosuggest,
}) {
  const instancias = {};
  try {
    app.setState('loading', true);
    const response = await Service.getAll({
      nomeModeloPlural: nomeEntidadePlural,
      include: includesCarga,
    });
    response.data.forEach(function(instancia) {
      instancias[instancia.id] = instancia;
      //Se informado, seta o value para os casos em que a entidade por utilizada pelo AutoSuggest
      if (atributoValueAutosuggest) {
        //Pode ser uma string, array ou função do próprio controller
        if (typeof atributoValueAutosuggest == 'String') {
          instancias[instancia.id].value = instancia[atributoValueAutosuggest];
        } else if (Array.isArray(atributoValueAutosuggest)) {
          instancias[instancia.id].value = '';
          atributoValueAutosuggest.forEach(atrib => {
            instancias[instancia.id].value += instancia[atrib];
          });
        }
      }
    });
    if (mantemState) {
      app.setState(nomeEntidadePlural, instancias);
    }
    return instancias;
  } catch (e) {
    console.error(e);
    app.mostraMensagem(`Falha ao buscar ${nomeEntidadePlural}`, 'error');
  } finally {
    app.setState('loading', false);
  }
}

async function salvaGenerico({
  app = requiredParam('app'),
  nomeEntidade = requiredParam('nomeEntidade'),
  nomeEntidadePlural = requiredParam('nomeEntidadePlural'),
  mantemState,
  camposObrigatorios = requiredParam('camposObrigatorios'),
  instancia = requiredParam('instancia'),
  cb,
}) {
  const camposInvalidos = app.validaCamposObrigatorios(
    instancia,
    camposObrigatorios,
  );
  if (camposInvalidos.length > 0) {
    const mensagem = [`Os campos abaixo são de preenchimento obrigatório:`];
    camposInvalidos.forEach(campo => {
      mensagem.push(`${campo.label}`);
    });
    app.mostraMensagem(mensagem, 'error');
  } else {
    try {
      app.setState('loading', true);
      let response = null;
      if (instancia.id == null) {
        response = await Service.insert({
          nomeModeloPlural: nomeEntidadePlural,
          instancia: instancia,
        });
      } else {
        response = await Service.update({
          nomeModeloPlural: nomeEntidadePlural,
          instancia: instancia,
        });
      }
      if (mantemState) {
        const dadoState = app.getState(nomeEntidadePlural);
        dadoState[response.data.id] = response.data;
        app.setState(nomeEntidadePlural, dadoState);
      }
      if (cb) {
        cb();
      }
    } catch (e) {
      console.error(e);
      app.mostraMensagem(
        `Falha ao gravar ${nomeEntidade} na base de dados`,
        'error',
      );
    } finally {
      app.setState('loading', false);
    }
  }
}

async function excluiGenerico({
  app = requiredParam('app'),
  nomeEntidade = requiredParam('nomeEntidade'),
  nomeEntidadePlural = requiredParam('nomeEntidadePlural'),
  mantemState,
  instancia = requiredParam('instancia'),
  cb,
}) {
  try {
    app.setState('loading', true);
    const response = await Service.delete({
      nomeModeloPural: nomeEntidadePlural,
      id: instancia.id,
    });
    if (mantemState) {
      const dadoState = app.getState(nomeEntidadePlural);
      delete dadoState[instancia.id];
      app.setState(nomeEntidadePlural, dadoState);
    }
    if (cb) {
      cb();
    }
  } catch (e) {
    console.error(e);
    app.mostraMensagem(
      `Falha ao excluir ${nomeEntidade} da base de dados`,
      'error',
    );
  } finally {
    app.setState('loading', false);
  }
}

export default AppController;

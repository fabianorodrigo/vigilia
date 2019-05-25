//serviços
import { Service } from "lib-common";
import Categoria from "../components/Categoria";

class CategoriaController {

    constructor(appController) {
        this.app = appController;
    }

    getHierarquiaCategoria(categoria, categorias = this.app.getState('CategoriasProdutos')) {
        let retorno = "";
        if (categoria.idpai != null) {
            retorno += this.getHierarquiaCategoria(categorias[categoria.idpai],categorias) + "→";
        }
        retorno = retorno + categoria.descricao;
        return retorno;
    }

    async carrega() {
        const categoriasHierarquica = {};

        //Carga nas categorias raiz e monta estrutura encadeada
        try {
            this.app.setState('loading', true);
            const response = await Service.getAll({ nomeModeloPlural: 'CategoriasProdutos', filtroAND:['"idpai": null'], sort: ['descricao']});
            response.data.forEach(function (a) {
                categoriasHierarquica[a.id] = new Categoria(a, this.atualizaStateCategorias.bind(this));
                categoriasHierarquica[a.id].value = categoriasHierarquica[a.id].descricao;
            }.bind(this));
            this.app.setState('categorias', categoriasHierarquica);
        } catch (e) {
            console.error(e);
            this.app.mostraMensagem(`Falha ao carregar Categorias Raiz da base de dados`, "error");
        } finally {
            this.app.setState('loading', false);
        }
        const categorias = {};
        //carga em todas as categorias
        try {
            this.app.setState('loading', true);
            const response = await Service.getAll({ nomeModeloPlural: 'CategoriasProdutos', sort: ["descricao"]});
            response.data.forEach((c) => {
                categorias[c.id] = c;
            });
            //this.app.setState('CategoriasProdutos', categorias);
            //Depois de setar a state, percorre os itens para setar o value pois o getHierarquia lê da state
            Object.keys(categorias).forEach(id => {
                categorias[id].value = this.app.controllers['CategoriaProduto'].getHierarquiaCategoria(categorias[id],categorias);
            })
            this.app.setState('CategoriasProdutos', categorias);
        } catch (e) {
            console.error(e);
            this.app.mostraMensagem(`Falha ao buscar Categorias`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }
    atualizaStateCategorias(categoria, arvoreAtualizacao) {
        if (arvoreAtualizacao == null || arvoreAtualizacao.length == 0) {
            throw new Exception("Caminho de atualização não estabelecido");
        }
        const dados = this.app.getState('categorias');
        //Arvore atualizacao é o caminho a se percorrer para atualizar a state
        let referenciaNaState = dados;
        //console.log(referenciaNaState)
        for (let i = 0; i < arvoreAtualizacao.length; i++) {
            //Se for o último item da "arvoreAtualizacao", associa-o a "referenciaNaState", senão, pega os filhos para continuar descendo a árvore
            if (i == arvoreAtualizacao.length - 1) {
                referenciaNaState = referenciaNaState[arvoreAtualizacao[i]];
            } else {
                referenciaNaState = referenciaNaState[arvoreAtualizacao[i]].categorias; //Pega o atributo de "categorias" cujo nome está armazenado na árvore atualização[i]
            }
        }
        referenciaNaState = categoria; //espera-se que atualize por referência, logo, a variável dados também será atualizada
        this.app.setState('categorias', dados);
    }

    /**
     * Busca na lista encadeada de categorias a referência cujo id corresponda ao id passado
     * @param {*} id identificador do categoria procurado
     * @param {*} categorias Parâmetro opcional. Caso não seja passado, pega da state
     */
    encontraAssuntoArvore(id, categorias = this.app.getState('categorias')) {
        const categoriasArray = Object.values(categorias);
        for (let i = 0; i < categoriasArray.length; i++) {
            const categoria = categoriasArray[i];
            if (categoria.id == id) {
                return categoria;
            } else {
                const categoriaFilho = this.encontraAssuntoArvore(id, categoria.assuntos);
                if (categoriaFilho != null) {
                    return categoriaFilho;
                }
            }
        }
        return null;
    }

}

module.exports = CategoriaController;

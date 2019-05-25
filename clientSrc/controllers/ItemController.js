//serviços
import { Service } from "lib-common";

class ItemController {

    constructor(appController) {
        this.app = appController;
    }

    async carregaItensPublicacaoEmAnalise() {
        const itens = {};
        try {
            this.app.setState('loading', true);
            const response = await Service.getAll({ nomeModeloPlural: 'ItensNotas', filtroOR: ['"idPublicacaoFacebook": null', '"idPublicacaoTwitter":null'], literalInclude: `["Nota",{"ProdutoEstabelecimento":["Estabelecimento",{"Produto":"CategoriaProduto"}]}]` });
            response.data.forEach(function (item) {
                itens[item.id] = item;
                //Seta value para aparecer no AutoSuggest
                if (item.ProdutoEstabelecimento.Produto != null) {
                    itens[item.id].ProdutoEstabelecimento.Produto.value = item.ProdutoEstabelecimento.Produto.descricao;
                }
            });
            this.app.setState('itensNaoPublicados', itens);
        } catch (e) {
            console.error(e);
            this.app.mostraMensagem(`Falha ao buscar Itens cuja publicação estão em análise`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }

    async ordenarArrayItensPorDataEmisaoNF(array) {
        array.sort((a, b) => {
            if (a.Nota.dtemissao < b.Nota.dtemissao) {
                return -1;
            }
            else if (a.Nota.dtemissao > b.Nota.dtemissao) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    async postarFacebook(item) {
        try {
            this.app.setState('loading', true);
            const dadoState = this.app.getState('itensNaoPublicados');
            const response = await Service.post({ nomeModeloPlural: 'ItensNotas/postarfacebook', instancia: item });
            if (response.data.sucesso == true) {
                delete dadoState[item.id];
            } else {
                console.warn(response.data)
            }
            this.app.setState('itensNaoPublicados', dadoState);
        } catch (e) {
            console.error(e);
            this.app.mostraMensagem(`Falha ao publicar Item no Facebook`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }

    postarTodosFacebook() {
        const itens = Object.values(this.app.getState('itensNaoPublicados'));
        for (let i = 0; i < itens.length; i++) {
            if (itens[i].idPublicacaoFacebook == null) {
                this.app.controllers['ItemNota'].postarFacebook(itens[i]);
            }
        };
    }

    postarTodosTwitter() {
        const itens = Object.values(this.app.getState('itensNaoPublicados'));
        for (let i = 0; i < itens.length; i++) {
            if (itens[i].idPublicacaoTwitter == null) {
                this.app.controllers['ItemNota'].postarTwitter(itens[i]);
            }
        };
    }

    async postarTwitter(item) {
        try {
            this.app.setState('loading', true);
            const dadoState = this.app.getState('itensNaoPublicados');
            const response = await Service.post({ nomeModeloPlural: 'ItensNotas/postartwitter', instancia: item });
            if (response.data.sucesso == true) {
                delete dadoState[item.id];
            } else {
                console.warn(response.data)
            }
            this.app.setState('itensNaoPublicados', dadoState);
        } catch (e) {
            console.error(e);
            this.app.mostraMensagem(`Falha ao publicar Item no Twitter`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }

    async excluir(item) {
        try {
            this.app.setState('loading', true);
            const dadoState = this.app.getState('itensNaoPublicados');
            const response = await Service.delete({ nomeModeloPlural: 'ItensNotas', id: item.id });
            if (response.data) {
                delete dadoState[item.id];
            }
            this.app.setState('itensNaoPublicados', dadoState);
        } catch (e) {
            this.app.mostraMensagem(`Falha ao excluir Item da base de dados: ${e}`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }
}

module.exports = ItemController;

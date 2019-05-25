//serviços
import {Service} from '../lib/service';

class FornecedorController {
  constructor(appController) {
    this.app = appController;
  }

  async atualizarProdutoEstabelecimento(produtoEstabelecimento) {
    const itens = this.app.getState('itensNaoPublicados');
    try {
      this.app.setState('loading', true);
      const response = await Service.update({
        nomeModeloPlural: 'ProdutosEstabelecimentos',
        instancia: produtoEstabelecimento,
      });
      //Se não foi encontrado um QR Code na imagem, retorna null
      if (response.data != null) {
        Object.values(itens).forEach(item => {
          if (item.ProdutoEstabelecimento.id == produtoEstabelecimento.id) {
            itens[item.id].idproduto = produtoEstabelecimento.idproduto;
          }
        });
        this.app.setState('itensNaoPublicados', itens);
      }
    } catch (e) {
      console.error(e);
      this.app.mostraMensagem(
        `Falha ao associar Produto Estabelecimento a Produto Global`,
        'error',
      );
    } finally {
      this.app.setState('loading', false);
    }
  }
}

export default FornecedorController;

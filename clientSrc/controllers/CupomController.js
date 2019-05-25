//serviços
import { Service } from "lib-common";

class CupomController {

    constructor(appController) {
        this.app = appController;
    }

    async carregaCuponsNaoProcessados() {
        let arquivos = {}
        try {
            this.app.setState('loading', true);
            const response = await Service.post({nomeModeloPlural:'Utils/listarArquivos', instancia: { diretorio: 'pipeline/0.originais', extensao: 'JPG' }});
            response.data.forEach(function (a) {
                arquivos[a] = {
                    label: a,
                    path: `./pipeline/0.originais/${a}`
                }
            });
            this.app.setState('cuponsNaoProcessados', arquivos);
        } catch (e) {
            this.app.mostraMensagem(`Falha ao ler QR Code do cupom fiscal: ${e}`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }

    async lerQRCode(cupom, cb) {
        let cupons = this.app.getState('cuponsNaoProcessados');
        try {
            this.app.setState('loading', true);
            const response = await Service.post({nomeModeloPlural:'Utils/lerQRCode', instancia:{ arquivo: cupom.path }});
            //Se não foi encontrado um QR Code na imagem, retorna null
            if (response.data != null) {
                cupons[cupom.label].qrCode = response.data.data;
            }
            this.app.setState('cuponsNaoProcessados', cupons);
        } catch (e) {
            this.app.mostraMensagem(`Falha ao ler QR Code do cupom fiscal: ${e}`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }
    async processar(cupom, cb) {
        let cupons = this.app.getState('cuponsNaoProcessados');
        try {
            this.app.setState('loading', true);
            const response = await Service.post({nomeModeloPlural:'Cupom/processar', instancia: { arquivo: cupom == null? null : cupom.path }});
            //Se não foi encontrado um QR Code na imagem, retorna null
            if (response.data != null) {
                this.app.mostraMensagem(JSON.stringify(response.data));
            }
            this.app.setState('cuponsNaoProcessados', cupons);
        } catch (e) {
            this.app.mostraMensagem(`Falha ao processar cupom fiscal: ${e}`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }
    async redimensionar(cupom, fator, cb) {
        try {
            this.app.setState('loading', true);
            const response = await Service.post({nomeModeloPlural:'Utils/redimensionarImagem', instancia: { arquivo: cupom.path, escala: fator }});
            console.log(response.data);
        } catch (e) {
            this.app.mostraMensagem(`Falha ao redimensionar cupom fiscal: ${e}`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }
    

}

module.exports = CupomController;

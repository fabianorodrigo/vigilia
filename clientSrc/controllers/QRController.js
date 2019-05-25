//serviços
import { Service } from "lib-common";

import Cookies from 'universal-cookie';


const cookies = new Cookies();

class QRController {

    constructor(appController) {
        this.app = appController;
    }

    async carregaQRCodesNaoImportados() {
        const qrCodes = {};
        try {
            this.app.setState('loading', true);
            const response = await Service.get({ nomeModeloPlural: 'QRCodes/naoImportados' });
            response.data.qrCodes.forEach(function (qr) {
                qrCodes[qr.chave] = qr;
            });
            this.app.setState('qrCodesNaoImportados', qrCodes);
        } catch (e) {
            console.error(e);
            this.app.mostraMensagem(`Falha ao buscar QR Codes não importados`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }

    async importarQRCodes(qrCode) {
        try {
            this.app.setState('loading', true);
            const dadoState = this.app.getState('qrCodesNaoImportados');
            const response = await Service.post({ nomeModeloPlural: 'QRCodes/importar', instancia: qrCode });
            if (response.data.sucesso == true) {
                delete dadoState[qrCode.chave];
            } else {
                console.warn(response.data)
            }
            this.app.setState('qrCodesNaoImportados', dadoState);
        } catch (e) {
            console.error(e);
            this.app.mostraMensagem(`Falha ao importar QR Code`, "error");
        } finally {
            this.app.setState('loading', false);
        }
    }
}

module.exports = QRController;

const https = require('https');

class Dollar {

    static value = null;
    static date = null;

    static updateDollar() {
        console.log('Atualizando Dólar...');

        const date = new Date();

        if (date.getDay() == 1) {
            date.setDate(date.getDate() - 3);
        } else if (date.getDay() == 0) {
            date.setDate(date.getDate() - 2);
        } else {
            date.setDate(date.getDate() - 1);
        }


        const dataCotacao = `${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}-${date.getFullYear()}`;
        const path = encodeURI(`/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dataCotacao}'&$top=1&$format=json&$select=cotacaoVenda,dataHoraCotacao`);
        const host = 'olinda.bcb.gov.br';

        const options = {
            method: 'GET',
            host,
            path
        };


        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {

                let data = '';
                res.on('data', chunk => data += chunk.toString());
                res.on('end', () => {
                    console.log('Dólar atualizado');
                    const json = JSON.parse(data);
                    Dollar.value = json?.value?.[0]?.cotacaoVenda;
                    Dollar.date = json?.value?.[0]?.dataHoraCotacao;
                    resolve();
                });
                res.on('error', reject);
                res.send
            });

            req.on('error', reject);
            req.end();
        });
    }



}

setTimeout(Dollar.updateDollar, 12 * 60 * 60 * 1000);

module.exports = Dollar;
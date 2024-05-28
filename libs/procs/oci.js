const path = require('path');
const xlsx = require('xlsx');
const { parse } = require('csv-parse/sync');

const OCIConfig = require('../../clouds/oci.config');

const Dollar = require('../../libs/dollar');
const { runStep, aggregateTest } = require('../util');
const toolsConfig = require('../../tools');


const indiceComplexidade = {
    'compute': 2,
    'container': 2,
    'database': 4,
    'network': 4,
    'security': 3,
    'serverless': 4
}

const getData = (file) => {
    if (path.extname(file.name) == '.csv') {
        // Extrai os registros do CSV
        const records = parse(file.data, {
            columns: true,
            cast: (value, context) => {
                if (value === null || value === '') return null;
                if (isNaN(value)) return value;
                return Number(value);
            },
            trim: true,
            bom: true
        });
        // Cria uma planilha temporária para processar os serviços
        return records;
    } else {
        // Abre arquivo Excel do billing
        const xlsFile = xlsx.read(file.data);

        // pega a primeira planiha do arquivo
        return xlsx.utils.sheet_to_json(xlsFile?.sheets[0]);
    }

}


const processor = { type: 'OCI' };
processor.run = ({ usageData, costData }, options) => {

    const dollar = (Number(options.dollar) || Dollar.value);

    const data = Object.entries(usageData).map(([key, value]) => ({ ServiceId: key, Quantity: value, Description: key }));
    const result = {otherServices: [...data]};

    const services = OCIConfig.services.reduce((acc, service) => {
        // if (service.serviceId == 'API Gateway') debugger;

        // Variável para armazenar observações sobre o serviço
        let remarks = [];

        // Lista itens do billing através dos filtros
        const items = service.steps?.reduce((acc, step) => {
            acc = runStep(acc, step);
            return acc;
        }, data) || data;

        // Remove os serviços filtrados da lista de serviços excluídos
        result.otherServices = result.otherServices.filter(it => !items.some(svc => svc == it));

        // Caso algum item tenha adicionado um aviso, adiciona o aviso à variável do serviço
        if (items.remarks) remarks.push(...items.remarks);

        const total = runStep(items, { 'type': 'sum', 'field': 'Quantity' });
        // Cria objeto temporário de retorno
        const tmpService = { serviceId: service.serviceId, items, total, group: service.group, remarks };

        // Adiciona tratamento para referências que tem valor 720 quando o mês é fevereiro
        let reference = service.reference;
        if (reference == 720 && options.isFebruary) {
            reference = 670;
        }
        tmpService.volumetria = Math.ceil(Math.floor(total / reference) / service.increment);

        acc.push(tmpService);
        return acc;

    }, []);


    // Agrupa serviços nos grupos configurados
    result.groups = runStep(services, { type: 'groupby', field: 'group' });


    // Agrupa os serviços dentro de um grupo
    result.otherServices = runStep(result.otherServices || [], { type: 'groupby', field: 'ServiceId' });
    result.groups.otherServices = Object.entries(result.otherServices).map(([serviceId, items]) => {
        return { serviceId, items };
    });


    // Calcula complexidade e volumetria de cada grupo
    // Complexidade considera a soma da volumetria de todos os serviços divido por 4, ou 1 se for maior que 4
    Object.entries(result.groups).forEach(([groupId, group]) => {
        const sumVolumetria = group.reduce((acc, svc) => acc += svc.volumetria > 0 ? 1 : 0, 0);

        const idx = indiceComplexidade[groupId];
        if (!idx) {
            group.complexidade = sumVolumetria > 4 ? 1.0 : sumVolumetria / 4.0;
            if (!group?.remarks) group.remarks = [];
            group.remarks.push(`Não foi encontrado índice de complexidade para o grupo ${groupId}`);
        } else {

            group.complexidade = sumVolumetria > idx ?
                1.0 :
                // Arredonda o valor para 2 casas decimais
                Math.round((sumVolumetria / idx + Number.EPSILON) * 100) / 100;
        }

        group.volumetria = group.reduce((acc, it) => acc += (it.volumetria || 0), 0);
    });

    result.volumetria = Object.values(result.groups).reduce((acc, group) => acc += group.volumetria, 0);
    result.complexidade = Object.values(result.groups).reduce((acc, group) => acc += group.complexidade, 0);

    result.totalCost = (costData.Total || costData['Total (BRL)']) / dollar;
    // Lista as VMs contidas no billing, executando os steps de filtro
    result.vm = OCIConfig.vm?.steps?.reduce((acc, step) => {
        acc = runStep(acc, step);
        return acc;
    }, [...data]);;

    result.rds = [];


    // Calcula custo de ferramentas
    result.tools = toolsConfig.tools.map(tool => {
        // copia objeto da ferramenta atual pzra objeto de retorno
        const ret = Object.assign({}, tool);

        // Se a ferramenta tem uma condição, executa a condição
        if (tool?.conditions?.length > 0) {
            // Validação da condição
            const validateTest = aggregateTest(options, tool.conditionsAggregator || 'or', tool.conditions);

            // Se a condição falhou, retorna 0
            if (!validateTest) {
                ret.value = 'N/A';
                return ret;
            }
        }

        // Verifica se a ferramenta tem passos para cálculo ou é fixo 
        if (tool.steps) {
            // Monta objeto inicial dos passos de execução
            ret.base = { services, vm: result.vm, rds: result.rds, options, totalCost: result.totalCost, processor: this };
            // Executa cada passo, retro alimentando a resposta do passo anterior
            tool.steps.forEach(step => {
                ret.base = runStep(ret.base, step);
            });

        } else {
            // Adiciona custo fixo
            ret.base = tool.cost;
        }

        // Aplica taxa de dólar se tiver configurado 
        ret.value = ret.base * (tool.isDolar ? dollar : 1);
        // Aplica tibutos e markup
        ret.value = ret.value / (1 - toolsConfig.tributos - toolsConfig.markup);

        // Se a ferramenta tem um nome customizado, altera o nome atual
        if (ret.customName) ret.name = ret.customName({ options });

        // Retorna objeto com o custo da ferramenta
        return ret;
    });



    // Calcula valor total da ferramenta, acumulando os valores calculados
    result.tools.total = result.tools.reduce((acc, it) => acc += isNaN(it.value) ? 0 : it.value, 0);

    return result;
};

const oci = (req) => {

    console.log(`Recebido arquivos: ${req.files.oci_cost} e ${req.files.oci_usage} de ${req.client.remoteAddress}`);

    const costRaw = getData(req.files.oci_cost);
    const usageRaw = getData(req.files.oci_usage);

    const usageData = usageRaw.find(it => it[Object.keys(it)[0]].indexOf('Total') < 0);
    const costData = costRaw.find(it => it[Object.keys(it)[0]].indexOf('Total') < 0);

    return { data: { usageData, costData }, processor };
}

module.exports = oci;
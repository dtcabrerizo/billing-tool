const Dollar = require("./dollar");
const { runStep, aggregateTest, log } = require("./util");
const cliProgress = require('cli-progress');

const indiceComplexidade = {
    'compute': 2,
    'container': 2,
    'database': 4,
    'network': 4,
    'security': 3,
    'serverless': 4
}


class Processor {

    progressBar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: false,
        format: ' {bar} | {service} | {value}/{total}\n'
    }, cliProgress.Presets.shades_grey);
    config = {};

    run(data, options) {
        const toolsConfig = require('../tools');

        const dollar = (Number(options.dollar) || Dollar.value);

        log('Executando Step inicial...');

        data.forEach(d => {
            d._quantity = d[this.config.itemOutput.Quantity];
            d._serviceId = d[this.config.itemOutput.ServiceId];
            d._description = d[this.config.itemOutput.Description];
        })

        // Efetua operação inicial
        this.config?.steps?.forEach(step => {
            data = runStep(data, step);
        });

        // Calcula serviços
        log('Calculando serviços...');

        // Cria um array para armazenar os serviços que não forem incluídos em um grupo
        let otherServices = [...data];


        const progressSvc = this.progressBar.create(this.config.services.length, 0);
        progressSvc.update(0, { service: 'Serviços' });

        // Inicia processamento dos serviços
        const services = this.config.services.reduce((acc, service, index) => {

            // Verifica se existe um filtro customizado além do ProductID
            const serviceOptions = service.customMainFilter ?
                { type: 'filter', ...service.customMainFilter } :
                { type: 'filter', field: '_serviceId', value: service.serviceId, operator: 'eq' }

            // Executa passos de filtros customizados 
            const serviceData = runStep(data, serviceOptions);

            // Remove os serviços filtrados da lista de serviços excluídos
            otherServices = otherServices.filter(it => !serviceData.some(svc => svc == it));

            // Variável para armazenar observações sobre o serviço
            let remarks = [];

            // Lista itens do billing através dos filtros
            const items = service.steps?.reduce((acc, step) => {
                acc = runStep(acc, step);
                return acc;
            }, serviceData) || serviceData;

            // Caso algum item tenha adicionado um aviso, adiciona o aviso à variável do serviço
            if (items.remarks) remarks.push(...items.remarks);

            // Verifica se encontrou registros mas filtrou todos
            if (serviceData.length > 0 && items.length === 0) {
                // Adiciona aviso se todos os registros encotrados foram filtrados
                remarks.push(`Encontrados ${serviceData.length} registros, porém foram todos filtrados`);
                // Zera a quantidade dos itens para não afetar no cálculo
                items.push(...serviceData.map(it => {
                    it._quantity = 0;
                    return it;
                }));
            }

            // Cálcula total conforme configuração se houver uma configuração de total
            const total = service.total?.reduce((acc, step) => {
                acc = runStep(acc, step);
                return acc;
            }, items) || items.reduce((acc, item) => acc + item._quantity, 0);


            // Traduz itens para o padrão
            const translatedItems = items.map(i => {
                return Object.entries(this.config.itemOutput).reduce((acc, [key, value]) => {
                    acc[key] = i[value];
                    return acc;
                }, {});
            });

            // Cria objeto temporário de retorno
            const tmpService = { serviceId: service.serviceId, items: translatedItems, total, group: service.group, remarks };
            // Calcula a volumetria baseado na referência e incremento

            // Adiciona tratamento para referências que tem valor 720 quando o mês é fevereiro
            let reference = service.reference;
            if (reference == 720 && options.isFebruary) {
                reference = 670;
            }
            tmpService.volumetria = Math.ceil(Math.floor(total / reference) / service.increment);
            // Adiciona serviço na lista de retorno
            acc.push(tmpService);

            progressSvc.increment();

            return acc;
        }, []);

        // Calcula custo total de nuvem
        const totalCost = this.config.totalCost?.reduce((acc, step) => {
            acc = runStep(acc, step);
            return acc;
        }, data) / (this.config.totalCostIsDollar ? 1 : dollar);


        // Lista as VMs contidas no billing, executando os steps de filtro
        const vm = this.config?.vm?.steps?.reduce((acc, step) => {
            acc = runStep(acc, step);
            return acc;
        }, [...data]);

        // Preenche as informações de CPU e Memória de cada VM
        vm?.forEach(v => {
            v.remarks = [];
            const specs = this.config.VMSpecs?.[v._type] || this.config.RDSSpecs?.[v._type];
            if (!specs) v.remarks.push(`Tipo de VM não encontrado (${v._type})`)
            v._cpu = specs?.vCPUs;
            v._mem = specs?.mem;
        });

        // Lista os Bancos de Dados contidos no billing, executando os steps de filtro
        const rds = this.config?.rds?.steps?.reduce((acc, step) => {
            acc = runStep(acc, step);
            return acc;
        }, [...data]);

        // Preenche as informações de CPU e Memória de cada banco de dados
        rds?.forEach(v => {
            if (v._type) {
                v.remarks = [];
                const specs = this.config.RDSSpecs?.[v._type] || this.config.VMSpecs?.[v._type];
                if (!specs) v.remarks.push(`Tipo de RDS não encontrado (${v._type})`)
                v._cpu = specs?.vCPUs;
                v._mem = specs?.mem;
            }
        });


        // Calcula custo de ferramentas
        const tools = toolsConfig.tools.map(tool => {
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
                ret.base = { services, vm, rds, options, totalCost, processor: this };
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
        tools.total = tools.reduce((acc, it) => acc += isNaN(it.value) ? 0 : it.value, 0);

        // Monta objeto de retorno
        const result = { vm, rds, tools, totalCost };

        // Agrupa serviços nos grupos configurados
        result.groups = runStep(services, { type: 'groupby', field: 'group' });


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

        const sumComplexidade = Object.values(result.groups).reduce((acc, group) => acc += group.complexidade, 0);
        result.complexidade = sumComplexidade > 0 ? Math.max(1, sumComplexidade) : 0;


        // Ajusta os itens dos serviços que não foram atribu[idos a nenhum grupo]
        otherServices = otherServices.map(it => {
            return Object.entries(this.config.itemOutput).reduce((acc, [key, value]) => {
                acc[key] = it[value];
                return acc;
            }, {});
        });
        // Agrupa os serviços dentro de um grupo
        otherServices = runStep(otherServices || [], { type: 'groupby', field: 'ServiceId' });
        result.groups.otherServices = Object.entries(otherServices).map(([serviceId, items]) => {
            return { serviceId, items };
        });

        // Retorna objeto com as informações do billing
        return result;
    }

}

module.exports = Processor;
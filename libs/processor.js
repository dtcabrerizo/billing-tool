const { runStep } = require("./util");

class Processor {

    config = {};

    run(data) {
        console.log('Executando Step inicial...');

        data.forEach(d => {
            d._quantity = d[this.config.itemOutput.Quantity];
            d._serviceId = d[this.config.itemOutput.ServiceId];
            d._description = d[this.config.Description];
        })
        
        // Efetua operação inicial
        this.config?.steps?.forEach(step => {
            data = runStep(data, step);
        });

        // Calcula serviços
        console.log('Calculando serviços...');

        const services = this.config.services.reduce((acc, service, index) => {

            // console.log(`(${index + 1}/${this.config.services.length}) Executando Serviço: ${service.serviceId}...`);

            // Verifica se existe um filtro customizado além do ProductID
            const options = service.customMainFilter ?
                { type: 'filter', ...service.customMainFilter } :
                { type: 'filter', field: '_serviceId', value: service.serviceId, operator: 'eq' }

            const serviceData = runStep(data, options);

            // Lista itens do billing através dos filtros
            const items = service.steps?.reduce((acc, step) => {
                acc = runStep(acc, step);
                return acc;
            }, serviceData) || serviceData;

            
            // Verifica se encontrou registros mas filtrou todos
            let remarks = [];
            if (serviceData.length > 0 && items.length === 0) {
                remarks.push(`Encontrados ${serviceData.length} registros, porém foram todos filtrados`);
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
            tmpService.volumetria = Math.ceil(Math.floor(total / service.reference) / service.increment);
            // Adiciona serviço na lista de retorno
            acc.push(tmpService);

            return acc;
        }, []);

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
                const specs = this.config.RDSSpecs?.[v._type] || this.config.VMSpecs?.[v._type];
                if (!specs) v.remarks.push(`Tipo de RDS não encontrado (${v._type})`)
                v._cpu = specs?.vCPUs;
                v._mem = specs?.mem;
            }
        });

        // Monta objeto de retorno
        const result = {vm, rds};

        // Agrupa serviços nos grupos configurados
        result.groups = runStep(services, { type: 'groupby', field: 'group' });

        // Calcula complexidade e volumetria de cada grupo
        // Complexidade considera a soma da volumetria de todos os serviços divido por 4, ou 1 se for maior que 4
        Object.values(result.groups).forEach(group => {
            const sumVolumetria = group.reduce((acc, svc) => acc += svc.volumetria > 0 ? 1 : 0, 0);
            group.complexidade = sumVolumetria > 4 ? 1.0 : sumVolumetria / 4.0;
            group.volumetria = group.reduce((acc, it) => acc += (it.volumetria || 0), 0);
        });

        // Calcula custo total de nuvem
        result.totalCost = this.config.totalCost?.reduce((acc, step) => {
            acc = runStep(acc, step);
            return acc;
        }, data);

        // Retorna objeto com as informações do billing
        return result;
    }

}

module.exports = Processor;
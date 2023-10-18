const azureConfig = require('../clouds/azure-csp-novo.config');
const Processor = require('./processor');
const VMs = require('../assets/AZURE-VMS.json');


class AzureCSPNovo extends Processor {
    type = 'Azure-CSP-Novo';
    A1Cell = 'invoiceId';

    constructor() {
        super();
        this.config = azureConfig;

        this.config.VMSpecs = VMs.reduce((acc, v) => {
            const vmName = v.name.replace(/[^_]+_(.*)/,'$1').replace(/_/g,' ');
            acc[vmName] = {
                type: vmName,
                vCPUs: Number(v.numberOfCores),
                mem: Number(v.memoryInMB),
            };
            return acc;
        }, {});
    }



}

module.exports = AzureCSPNovo;
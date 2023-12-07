const azureConfig = require('../../clouds/azure-new-ea.config');
const Processor = require('../processor');
const VMs = require('../../assets/AZURE-VMS.json');


class AzureNewEA extends Processor {
    type = 'AzureNew-EA';
    A1Cell = 'IdDaContaDeCobrança (BillingAccountId)';

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

module.exports = AzureNewEA;
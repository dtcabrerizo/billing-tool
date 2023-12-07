const azureConfig = require('../../clouds/azure-ea.config');
const Processor = require('../processor');
const VMs = require('../../assets/AZURE-VMS.json');


class AzureEA extends Processor {
    type = 'Azure-EA';
    A1Cell = 'AccountOwnerId';

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

module.exports = AzureEA;
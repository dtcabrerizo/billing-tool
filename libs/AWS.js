const awsConfig = require('../clouds/aws.config');
const Processor = require('./processor');
const VMs = require('../assets/AWS-EC2.json');
const RDSs = require('../assets/AWS-RDS.json');

class AWS extends Processor {
    type = 'AWS';
    A1Cell = 'InvoiceID';
    
    constructor() {
        super();
        this.config = awsConfig;
        this.config.VMSpecs = VMs.reduce((acc, v) => {
            acc[v['API Name']] = {
                type: v['API Name'],
                vCPUs: Number(v.vCPUs.toString().replace(/(\d+).+/, '$1')),
                mem: Number(v['Instance Memory'].toString().replace(/[^\d\.]/g, '')),
            };
            return acc;
        }, {});
        this.config.RDSSpecs = RDSs.reduce((acc, v) => {
            acc[v['API Name']] = {
                type: v['API Name'],
                vCPUs: Number(v.vCPUs.toString().replace(/(\d+).+/, '$1')),
                mem: Number(v['Memory'].toString().replace(/[^\d\.]/g, '')),
            };
            return acc;
        })
    }

    


}

module.exports = AWS;
const Dollar = require("./libs/dollar");

const toolsConfig = {
    "tributos": 0.1215,
    "markup": 0.1,
    "tools": [
        {
            "solution": "Monitoramento",
            "name": "Dynatrace - Host Units",
            "customName": data => `Dynatrace - Host Units (${Number(data.options.dyna_hu)})`,
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return isNaN(data.options.dyna_hu) ? 'N/A' : Number(data.options.dyna_hu) * 310; } },
            ]
        }, {
            "solution": "Monitoramento",
            "name": "Dynatrace - DDUs",
            "customName": data => `Dynatrace - DDUs (${Number(data.options.dyna_ddu)})`,
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return isNaN(data.options.dyna_ddu) ? 'N/A' : Number(data.options.dyna_ddu) / 1000000 * 11931.14; } },
            ]
        }, {
            "solution": "Monitoramento",
            "name": "Dynatrace - DEM Unit",
            "customName": data => `Dynatrace - DEM Unit (${Number(data.options.dyna_dem)})`,
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return isNaN(data.options.dyna_dem) ? 'N/A' : Number(data.options.dyna_dem) / 1000000 * 39008.99; } },
            ]
        }, {
            "solution": "Gestão de Chamados",
            "name": "Service Now",
            "cost": (535477.29 / 12) / 300,
            "isDolar": false
        }, {
            "solution": "Monitoramento",
            "name": "Uptime Robot",
            "cost": (121 / 1000) * (1 + 0.068 + 0.03) * 10,
            "isDolar": true
        }, {
            "solution": "Gestão de Custos",
            "name": "Dashboard Dedalus",
            "cost": 1000 * 1.1384 / 150,
            "isDolar": true,
            "conditionsAggregator": 'or',
            "conditions": [
                {
                    "field": "pilar_custos",
                    "operator": "neq",
                    "value": "BASIC"
                }
            ]
        }, {
            "solution": "Automação de Servidores",
            "name": "Cloud8 - Servidores",
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return data.services; } },
                { "type": "filter", "field": "serviceId", "operator": "in", "value": ["AmazonEC2", "Virtual Machines"] },
                { "type": "sum", "field": "total" },
                { "type": "function", "fn": (data) => { return data * 0.0106; } }
            ],
            "conditionsAggregator": 'or',
            "conditions": [
                {
                    "field": "pilar_monitoracao",
                    "operator": "neq",
                    "value": "BASIC"
                }, {
                    "field": "pilar_continuidade",
                    "operator": "neq",
                    "value": "BASIC"
                }
            ]

        }, {
            "solution": "Automação DB",
            "name": "Cloud8 - Banco de Dados",
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return data.services; } },
                { "type": "filter", "field": "serviceId", "operator": "in", "value": ["AmazonRDS", "SQL Database", "SQL Managed Instance"] },
                { "type": "sum", "field": "total" },
                { "type": "function", "fn": (data) => { return data * 0.0155; } }
            ],
            "conditionsAggregator": 'or',
            "conditions": [
                {
                    "field": "pilar_continuidade",
                    "operator": "neq",
                    "value": "BASIC"
                }
            ]
        }, {
            "solution": "Automação Load Balancer",
            "name": "Cloud8 - Load Balancer",
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return data.services; } },
                { "type": "filter", "field": "serviceId", "operator": "in", "value": ["AmazonEC2"] },
                { "type": "sum", "field": "total" },
                { "type": "function", "fn": (data) => { return data * 0.0019; } }
            ],
            "conditionsAggregator": 'or',
            "conditions": [
                {
                    "field": "pilar_continuidade",
                    "operator": "neq",
                    "value": "BASIC"
                }
            ]
        }, {
            "solution": "Performance DB",
            "name": "Nazar",
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return data.rds; } },
                { "type": "sum", "field": "_calculatedQuantity" },
                { "type": "function", "fn": (data) => { return data * 125; } }
            ]
        }, {
            "solution": "Backup",
            "name": "Commvault - Servidores",
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return data.vm; } },
                { "type": "sum", "field": "_calculatedQuantity" },
                { "type": "function", "fn": (data) => { return data * 66.23; } }
            ],
            "conditionsAggregator": 'and',
            "conditions": [
                {
                    "field": "pilar_continuidade",
                    "operator": "eq",
                    "value": "ADVANCED"
                }, {
                    "field": "commvault",
                    "operator": "eq",
                    "value": "SIM"
                }
            ]
        }, {
            "solution": "Backup",
            "name": "Commvault - RDs",
            "isDolar": false,
            "steps": [
                { "type": "function", "fn": (data) => { return data.rds; } },
                { "type": "sum", "field": "_calculatedQuantity" },
                { "type": "function", "fn": (data) => { return data * 99.28; } }
            ],
            "conditionsAggregator": 'and',
            "conditions": [
                {
                    "field": "pilar_continuidade",
                    "operator": "eq",
                    "value": "ADVANCED"
                }, {
                    "field": "commvault",
                    "operator": "eq",
                    "value": "SIM"
                }
            ]
        }, {
            "solution": "Suporte do Fornecedor",
            "name": "Enterprise Support / Advanced Support",
            "isDolar": false,
            "conditionsAggregator": 'or',
            "conditions": [
                {
                    "field": "chkSuporte",
                    "operator": "eq",
                    "value": "on"
                }
            ],
            "steps": [
                // Reaplicar Dolar
                {
                    "type": "function", "fn": (data) => {
                        if (data.processor.type == 'AWS') {
                            return data.totalCost * Dollar.value * 0.06;
                        } else if (data.processor.type.toString().startsWith('Azure')) {
                            return data.totalCost * Dollar.value * 0.01;
                        } else {
                            return 0;
                        }
                    }
                },
            ]
        }
    ]
};

module.exports = toolsConfig;
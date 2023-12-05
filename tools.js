const toolsConfig = {
    "USD_Est": 5.00,
    "tributos": 0.1215,
    "markup": 0.1,
    "tools": [
        {
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
                { "type": "filter", "field": "serviceId", "operator": "in", "value": ["AmazonEC2"] },
                { "type": "sum", "field": "total" },
                { "type": "function", "fn": (data) => { return data * 0.0106; } }
            ],
            "conditionsAggregator": 'or',
            "conditions": [
                {
                    "field": "pilar_monitoracao",
                    "operator": "neq",
                    "value": "BASIC"
                },{
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
                },{
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
                },{
                    "field": "commvault",
                    "operator": "eq",
                    "value": "SIM"
                }
            ]            
        }
    ]
};

module.exports = toolsConfig;
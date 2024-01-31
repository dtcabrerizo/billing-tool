const Dollar = require("../libs/dollar");

const azureConfig = {
    "itemOutput": {
        "ServiceId": "CategoriaDoMedidor (MeterCategory)",
        "Quantity": "Quantidade (Quantity)",
        "Description": "Produto (Product)"
    },
    "totalCost": [
        { "type": "sum", "field": "Custo (Cost)" },
        { "type": 'function', "fn": data => data / Dollar.value }
    ],
    "services": [
        {
            "serviceId": "Virtual Machines",
            "steps": [
                { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "nct", "value": "Reservation" }
            ],
            "group": "compute", "reference": 720, "increment": 10
        }, {
            "serviceId": "Azure DevOps - Pipelines",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "eq", "value": "Azure Pipelines" },
            "group": "container", "reference": 5, "increment": 5
        }, {
            "serviceId": "Container Instances",
            "group": "container",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "eq", "value": "Container Instances" },
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "eq", "value": "vCPU Duration" }
            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "Azure Kubernetes Service",
            "group": "container", "reference": 720, "increment": 1
        }, {
            "serviceId": "Container Registry",
            "group": "container",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Data Stored" }
            ], "reference": 720, "increment": 1
        }, {
            "serviceId": "Azure Synapse Analytics SQL",
            "group": "database",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "sw", "value": "Azure Synapse Analytics SQL" },
            "reference": 1, "increment": 5
        }, {
            "serviceId": "Azure Data Factory v2",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "run" }
            ], "reference": 100000, "increment": 5
        }, {
            "serviceId": "Stream analytics",
            "group": "database",
            "reference": 10000, "increment": 1
        }, {
            "serviceId": "Azure Databricks",
            "group": "database",
            "reference": 720, "increment": 3
        }, {
            "serviceId": "Power BI Embedded",
            "group": "database",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "Azure Data Lake Storage",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Data Stored" },
                { "type": "function", "fn": data => {
                    data.forEach(v => { v._quantity = v._quantity / 1024; return v;});
                    return data;
                }}
            ],
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "sw", "value": "Azure Data Lake Storage" },
            "reference": 5, "increment": 2
        }, {
            "serviceId": "Elastic Azure",
            "group": "database",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "Files",
            "group": "compute",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "sw", "value": "Files" },
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Data Stored" }
            ],
            "reference": 2048, "increment": 1
        }, {
            "serviceId": "Blob",
            "group": "compute",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "ct", "value": "Blob" },
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Data Stored" }
            ],
            "reference": 5120, "increment": 10
        }, {
            "serviceId": "File Sync",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "eq", "value": "File Sync" },
            "group": "compute",
            "reference": 2048, "increment": 10
        }, {
            "serviceId": "IP Addresses",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "eq", "value": "IP Addresses" },
            "group": "network",
            "reference": 720, "increment": 20
        }, {
            "serviceId": "Content Delivery Network",
            "group": "network",
            "reference": 15000000, "increment": 1
        }, {
            "serviceId": "Load Balancer",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Rules" }
            ], "reference": 720, "increment": 100
        }, {
            "serviceId": "Azure DNS",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Zone" }
            ], "reference": 3, "increment": 10
        }, {
            "serviceId": "VPN Gateway",
            "group": "network",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "ExpressRoute",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Gateway" }
            ],
            "reference": 1, "increment": 10000000000
        }, {
            "serviceId": "Azure Active Directory Domain Services",
            "group": "security",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "Key Vault",
            "group": "security",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Operations" }
            ], "reference": 5000, "increment": 1000
        }, {
            "serviceId": "Application Gateway",
            "group": "security",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "sw", "value": "Application Gateway" },
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ew", "value": "Gateway" }
            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "API Management",
            "group": "serverless",
            "reference": 720, "increment": 5
        }, {
            "serviceId": "Functions",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Total Executions" }
            ], "reference": 100000000, "increment": 2
        }, {
            "serviceId": "Azure Redis Cache",
            "group": "database",
            "customMainFilter": { "field": "CategoriaDoMedidor (MeterCategory)", "operator": "ct", "value": "Redis Cache" },
            "reference": 720, "increment": 10
        }, {
            "serviceId": "Azure Cosmos DB",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "Data Stored" }
            ], "reference": 10240, "increment": 3
        }, {
            "serviceId": "Azure Database for (MySQL/PostgreSQL/MariaDB)",
            "group": "database",
            "customMainFilter": { "field": "CategoriaDoMedidor (MeterCategory)", "operator": "sw", "value": "Azure Database for" },
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "eq", "value": "vCore" }
            ], "reference": 720, "increment": 5
        }, {
            "serviceId": "SQL Database",
            "group": "database",
            "customMainFilter": { "field": "CategoriaDoMedidor (MeterCategory)", "operator": "sw", "value": "SQL Database" },
            "steps": [
                {
                    "type": "function", "fn":
                        data => {
                            return Object.entries(data).reduce((acc, [_, item]) => {

                                let tmpItem = null;
                                if (item['NomeDoMedidor (MeterName)'].indexOf('vCore') >= 0) {
                                    tmpItem = { ...item };
                                    tmpItem._quantity = item["Quantidade (Quantity)"];
                                } else if (item['NomeDoMedidor (MeterName)'].indexOf('DTU') >= 0) {
                                    tmpItem = { ...item };
                                    const unit = Number(item['UnidadeDeMedida (UnitOfMeasure)'].replace(/\D/g, ''));
                                    tmpItem._quantity = item["Quantidade (Quantity)"] * 24 / unit;
                                    if (item['SubcategoriaDoMedidor (MeterSubCategory)'].indexOf('Elastic') >= 0) {
                                        tmpItem._quantity = tmpItem._quantity / 10;
                                    }

                                }
                                if (tmpItem) acc.push(tmpItem);
                                return acc;
                            }, []);
                        }
                }

            ], "reference": 720, "increment": 5
        }, {
            "serviceId": "SQL Managed Instance",
            "group": "database",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "ct", "value": "Managed Instance" },
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ct", "value": "vCore" }
            ], "reference": 720, "increment": 5
        }, {
            "serviceId": "Service Bus",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "ew", "value": "Messaging Operations" },
                {
                    "type": "function", "fn":
                        data => {
                            data.forEach(item => {
                                const qty = item['Quantidade (Quantity)'] * 10000000;
                                item['Quantidade (Quantity)'] = qty;
                                item._quantity = qty;
                            });
                            return data;
                        }
                }
            ], "reference": 30000000, "increment": 10
        }, {
            "serviceId": "Queues",
            "group": "serverless",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "sw", "value": "Queue" },
            "reference": 1000000000, "increment": 1
        }, {
            "serviceId": "Event Grid",
            "group": "serverless",
            "reference": 250000000, "increment": 5
        }, {
            "serviceId": "Event Hubs",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "eq", "value": "Standard Capture" }
            ], "reference": 50, "increment": 2
        },  {
            "serviceId": "Static Web Apps",
            "group": "serverless",
            "reference": 1024, "increment": 1
        }, {
            "serviceId": "Application Service",
            "group": "serverless",
            "customMainFilter": { "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "sw", "value": "Azure App Service" },
            "reference": 720, "increment": 30
        },


    ],
    "vm": {
        "steps": [
            { "type": "filter", "field": "CategoriaDoMedidor (MeterCategory)", "operator": "eq", "value": "Virtual Machines" },
            { "type": "filter", "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "nct", "value": "Reservation" },
            { "type": "groupby", "field": "IdDoRecurso (ResourceId)" },
            {
                "type": "function",
                fn:
                    data => {
                        const ret = Object
                            .entries(data)
                            .map(
                                ([resourceId, info]) => info.reduce(
                                    (acc, it) => {
                                        acc = {
                                            resourceId,
                                            count: info.length,
                                            _description: it.Product,
                                            _type: it['NomeDoMedidor (MeterName)'].replace(/([^\/]+).*/, '$1'),
                                            _quantity: (acc._quantity || 0) + it._quantity
                                        };
                                        return acc;
                                    }, {}
                                )
                            )
                            .map(i => {
                                i._calculatedQuantity = i._quantity > 160 ? Math.ceil(i._quantity / 744) : 0;
                                return i;
                            });
                        return ret;
                    }
            }
        ]
    },
    "rds": {
        "steps": [
            { "type": "filter", "field": "CategoriaDoMedidor (MeterCategory)", "operator": "in", "value": ["SQL Database", "Azure Database for MySQL", "Azure Database for PostgreSQL", "SQL Managed Instance"] },
            { "type": "filter", "field": "SubcategoriaDoMedidor (MeterSubCategory)", "operator": "nct", "value": "License" },
            { "type": "filter", "field": "NomeDoMedidor (MeterName)", "operator": "eq", "value": "vCore" },
            { "type": "groupby", "field": "IdDoRecurso (ResourceId)" },
            {
                "type": "function",
                fn:
                    data => {
                        const remarks = [];
                        const ret = Object
                            .entries(data)
                            .map(
                                ([resourceId, info]) => info.reduce(
                                    (acc, it) => {
                                        acc = {
                                            resourceId,
                                            count: info.length,
                                            _description: it._description,
                                            _cpu: Math.max(acc._cpu || 0, it['Quantidade (Quantity)'] / 24),
                                            _quantity: 1
                                        };
                                        return acc;
                                    }, {}
                                )
                            )
                            .map(i => {
                                i._mem = i._cpu * 5.05;
                                i._calculatedQuantity = i._quantity;
                                return i;
                            });
                        ret.remarks = remarks;
                        return ret;
                    }
            }
        ]
    }
}

module.exports = azureConfig;
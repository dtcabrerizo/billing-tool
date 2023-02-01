const azureConfig = {
    "itemOutput": {
        "ServiceId": "MeterCategory",
        "Quantity": "Quantity",
        "Description": "ProductName"
    },
    "totalCost": [
        { "type": "sum", "field": "PricingPreTaxTotal" },
        { "type": "function", fn: value => value * 1.2}
    ],
        "services": [
        {
            "serviceId": "Virtual Machines",
            "steps": [
                { "field": "MeterSubCategory", "operator": "nct", "value": "Reservation" }
            ],
            "group": "compute", "reference": 720, "increment": 10
        }, { // REVISAR
            "serviceId": "Azure DevOps - Pipelines",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "eq", "value": "Azure Pipelines" },
            "group": "container", "reference": 5, "increment": 5
        }, { // REVISAR
            "serviceId": "Container Instances",
            "group": "container",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "eq", "value": "Container Instances" },
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "eq", "value": "vCPU Duration" }
            ], "reference": 720, "increment": 10
        }, {// REVISAR
            "serviceId": "Azure Kubernetes Service",
            "group": "container", "reference": 720, "increment": 1
        }, {// REVISAR
            "serviceId": "Container Registry",
            "group": "container",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Data Stored" }
            ], "reference": 720, "increment": 1
        }, {// REVISAR
            "serviceId": "Azure Synapse Analytics SQL",
            "group": "database",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Azure Synapse Analytics SQL" },
            "reference": 1, "increment": 5
        }, {// REVISAR
            "serviceId": "Azure Data Factory v2",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "run" }
            ], "reference": 100000, "increment": 5
        }, {// REVISAR
            "serviceId": "Stream analytics",
            "group": "database",
            "reference": 10000, "increment": 1
        }, {// REVISAR
            "serviceId": "Azure Databricks",
            "group": "database",
            "reference": 720, "increment": 3
        }, {// REVISAR
            "serviceId": "Power BI Embedded",
            "group": "database",
            "reference": 720, "increment": 1
        }, {// REVISAR
            "serviceId": "Azure Data Lake Storage",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Data Stored" }
            ],
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Azure Data Lake Storage" },
            "reference": 5, "increment": 2
        }, {// REVISAR
            "serviceId": "Elastic Azure",
            "group": "database",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "Files",
            "group": "compute",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Files" },
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Data Stored" }
            ],
            "reference": 2048, "increment": 1
        }, {
            "serviceId": "Blob",
            "group": "compute",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "ct", "value": "Blob" },
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Data Stored" }
            ],
            "reference": 5120, "increment": 2
        }, {// Revisar
            "serviceId": "File Sync",
            "group": "compute",
            "reference": 2048, "increment": 10
        }, {
            "serviceId": "IP Addresses",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "eq", "value": "IP Addresses" },
            "group": "network",
            "reference": 720, "increment": 20
        }, { // REVISAR
            "serviceId": "Azure CDN",
            "group": "network",
            "reference": 15000000, "increment": 1
        }, { // REVISAR
            "serviceId": "Load Balancer",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Rules" }
            ], "reference": 720, "increment": 100
        }, {
            "serviceId": "Azure DNS",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Zone" }
            ], "reference": 3, "increment": 10
        }, {
            "serviceId": "VPN Gateway",
            "group": "network",
            "reference": 720, "increment": 1
        }, { // REVISAR
            "serviceId": "Express Route",
            "group": "network",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Express Route" },
            "reference": 1, "increment": 10000000000
        }, { // REVISAR
            "serviceId": "Azure Active Directory Domain Services",
            "group": "security",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "Key Vault",
            "group": "security",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Operations" }
            ], "reference": 1000, "increment": 100
        }, { // REVISAR
            "serviceId": "Application Gateway",
            "group": "security",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Application Gateway" },
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ew", "value": "Gateway" }
            ], "reference": 720, "increment": 10
        }, { // REVISAR
            "serviceId": "API Management",
            "group": "serverless",
            "reference": 720, "increment": 5
        }, { // REVISAR
            "serviceId": "Functions",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Total Executions" }
            ], "reference": 100000000, "increment": 2
        }, {
            "serviceId": "Azure Redis Cache",
            "group": "database",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Azure Redis Cache" },
            "reference": 720, "increment": 10
        }, { // REVISAR
            "serviceId": "Azure Cosmos DB",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "Data Stored" }
            ], "reference": 10240, "increment": 3
        }, {
            "serviceId": "Azure Database for (MySQL/PostgreSQL/MariaDB)",
            "group": "database",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Azure Database for" },
            "reference": 720, "increment": 5
        }, {
            "serviceId": "SQL Database",
            "group": "database",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "SQL Database" },
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "eq", "value": "vCore" }
            ], "reference": 720, "increment": 5
        }, { // REVISAR
            "serviceId": "SQL Managed Instance",
            "group": "database",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "SQL Managed Instance" },
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ct", "value": "vCore" }
            ], "reference": 720, "increment": 5
        }, { // REVISAR
            "serviceId": "ServiceBus",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "ew", "value": "Messaging Operations" }
            ], "reference": 30000000, "increment": 10
        }, { 
            "serviceId": "Queues",
            "group": "serverless",
            "customMainFilter": { "field": "MeterSubCategory", "operator": "sw", "value": "Queue" },
            "steps": [
                {
                    "type": "function", 
                    "fn": data => {
                        return data.map(entry => { entry.Quantity = entry.Quantity * 10000; return entry; });
                    }
                }
            ],
            "reference": 1000000000, "increment": 1
        }, { // REVISAR
            "serviceId": "Event Grid",
            "group": "serverless",
            "reference": 250000000, "increment": 5
        }, { // REVISAR
            "serviceId": "Event Hubs",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "MeterName", "operator": "eq", "value": "Standard Capture" }
            ], "reference": 50, "increment": 2
        }, { // REVISAR
            "serviceId": "API Management",
            "group": "serverless",
            "reference": 720, "increment": 10
        }, { // REVISAR
            "serviceId": "Static Web Apps",
            "group": "serverless",
            "reference": 1024, "increment": 1
        },{
            "serviceId": "Application Service",
            "group": "serverless",
            "reference": 720, "increment": 30
        },


    ],
    "vm": {
        "steps": [
            { "type": "filter", "field": "MeterCategory", "operator": "eq", "value": "Virtual Machines" },
            { "type": "filter", "field": "MeterSubCategory", "operator": "nct", "value": "Reservation" },
            { "type": "groupby", "field": "ResourceURI" },
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
                                            _type: it['MeterName'].replace(/([^\/]+).*/, '$1'),
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
            { "type": "filter", "field": "MeterCategory", "operator": "in", "value": ["SQL Database", "Azure Database for MySQL"] },
            { "type": "filter", "field": "MeterSubCategory", "operator": "nct", "value": "License" },
            { "type": "filter", "field": "MeterName", "operator": "eq", "value": "vCore" },
            { "type": "groupby", "field": "ResourceURI" },
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
                                            _cpu: Math.max(acc._cpu || 0, it['Quantity'] / 24),
                                            _quantity: 1
                                        };
                                        return acc;
                                    }, {}
                                )
                            )
                            .map(i => {                           
                                i._mem = i._cpu * 5.5;     
                                i._calculatedQuantity = i._quantity;
                                return i;
                            });
                        return ret;
                    }
            }
        ]
    }
}

module.exports = azureConfig;
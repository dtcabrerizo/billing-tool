const azureConfig = {
    "itemOutput": {
        "ServiceId": "meterCategory",
        "Quantity": "quantity",
        "Description": "ProductName"
    },
    "totalCostIsDollar": true,
    "totalCost": [
        { "type": "sum", "field": "costInUsd" }
    ],
        "services": [
        {
            "serviceId": "Virtual Machines",
            "steps": [
                { "field": "meterSubCategory", "operator": "nct", "value": "Reservation" }
            ],
            "group": "compute", "reference": 720, "increment": 10
        }, { // REVISAR
            "serviceId": "Azure DevOps - Pipelines",
            "customMainFilter": { "field": "meterSubCategory", "operator": "eq", "value": "Azure Pipelines" },
            "group": "container", "reference": 5, "increment": 5
        }, { 
            "serviceId": "Container Instances",
            "group": "container",
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "Container Instances" },
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "eq", "value": "vCPU Duration" }
            ], "reference": 720, "increment": 10
        }, {// REVISAR
            "serviceId": "Azure Kubernetes Service",
            "group": "container", "reference": 720, "increment": 1
        }, {// REVISAR
            "serviceId": "Container Registry",
            "group": "container",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Data Stored" }
            ], "reference": 720, "increment": 1
        }, {// REVISAR
            "serviceId": "Azure Synapse Analytics SQL",
            "group": "database",
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "Azure Synapse Analytics SQL" },
            "reference": 1, "increment": 5
        }, {// REVISAR
            "serviceId": "Azure Data Factory v2",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "run" }
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
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Data Stored" },
                { "type": "function", "fn": data => {
                    data.forEach(v => { v._quantity = v._quantity / 1024; return v;});
                    return data;
                }}
            ],
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "Azure Data Lake Storage" },
            "reference": 5, "increment": 2
        }, {// REVISAR
            "serviceId": "Elastic Azure",
            "group": "database",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "Files",
            "group": "compute",
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "Files" },
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Data Stored" }
            ],
            "reference": 2048, "increment": 1
        }, {
            "serviceId": "Blob",
            "group": "compute",
            "customMainFilter": { "field": "meterSubCategory", "operator": "ct", "value": "Blob" },
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Data Stored" }
            ],
            "reference": 5120, "increment": 10
        }, {// Revisar
            "serviceId": "File Sync",
            "customMainFilter": { "field": "meterSubCategory", "operator": "eq", "value": "File Sync" },
            "group": "compute",
            "reference": 2048, "increment": 10
        }, {
            "serviceId": "IP Addresses",
            "customMainFilter": { "field": "meterSubCategory", "operator": "eq", "value": "IP Addresses" },
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
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Rules" }
            ], "reference": 720, "increment": 100
        }, {
            "serviceId": "Azure DNS",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Zone" }
            ], "reference": 3, "increment": 10
        }, {
            "serviceId": "VPN Gateway",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "regexp", "value": /(Basic Gateway|VpnGw*)/ }

            ],
            "reference": 720, "increment": 1
        }, { // REVISAR
            "serviceId": "ExpressRoute",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Gateway" }
            ],
            "reference": 1, "increment": 10000000000
        }, { // REVISAR
            "serviceId": "Azure Active Directory Domain Services",
            "group": "security",
            "reference": 720, "increment": 1
        }, {
            "serviceId": "Key Vault",
            "group": "security",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Operations" }
            ], "reference": 5000, "increment": 1000
        }, { // REVISAR
            "serviceId": "Application Gateway",
            "group": "security",
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "Application Gateway" },
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ew", "value": "Gateway" }
            ], "reference": 720, "increment": 10
        }, { // REVISAR
            "serviceId": "API Management",
            "group": "serverless",
            "reference": 720, "increment": 5
        }, { // REVISAR
            "serviceId": "Functions",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Total Executions" }
            ], "reference": 100000000, "increment": 2
        }, {
            "serviceId": "Azure Redis Cache",
            "group": "database",
            "customMainFilter": { "field": "meterCategory", "operator": "ct", "value": "Redis Cache" },
            "reference": 720, "increment": 10
        }, { // REVISAR
            "serviceId": "Azure Cosmos DB",
            "group": "database",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "Data Stored" }
            ], "reference": 10240, "increment": 3
        }, {
            "serviceId": "Azure Database for (MySQL/PostgreSQL/MariaDB)",
            "group": "database",
            "customMainFilter": { "field": "meterCategory", "operator": "sw", "value": "Azure Database for" },
            "steps": [
                { "type": "filter", "field": "meterSubCategory", "operator": "ct", "value": "Compute" }                
            ],"reference": 720, "increment": 5
        }, , {
            "serviceId": "SQL Database",
            "group": "database",
            "customMainFilter": { "field": "meterCategory", "operator": "sw", "value": "SQL Database" },
            "steps": [
                {
                    "type": "function", "fn":
                        data => {
                            return Object.entries(data).reduce((acc, [_, item]) => {

                                let tmpItem = null;
                                if (item['meterName'].indexOf('vCore') >= 0) {
                                    tmpItem = { ...item };
                                    tmpItem._quantity = item["quantity"];
                                } else if (item['meterName'].indexOf('DTU') >= 0) {
                                    tmpItem = { ...item };
                                    const unit = Number(item['unitOfMeasure'].replace(/\D/g, ''));
                                    tmpItem._quantity = item["quantity"] * 24 / unit;
                                    if (item['meterSubCategory'].indexOf('Elastic') >= 0) {
                                        tmpItem._quantity = tmpItem._quantity / 10;
                                    }
                                }
                                if (tmpItem) acc.push(tmpItem);
                                return acc;
                            }, []);
                        }
                }

            ], "reference": 720, "increment": 5
        }, { // REVISAR
            "serviceId": "SQL Managed Instance",
            "group": "database",
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "SQL Managed Instance" },
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ct", "value": "vCore" }
            ], "reference": 720, "increment": 5
        }, { // REVISAR
            "serviceId": "Service Bus",
            "group": "serverless",
            "steps": [
                { "type": "filter", "field": "meterName", "operator": "ew", "value": "Messaging Operations" },
                { "type": "function", "fn": 
                    data => {
                        data.forEach(item => { 
                            const qty = item['Quantity'] * 10000000;
                            item['Quantity'] = qty;
                            item._quantity = qty;
                        });
                        return data;
                    }
                }
            ], "reference": 30000000, "increment": 10
        }, { 
            "serviceId": "Queues",
            "group": "serverless",
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "Queue" },
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
                { "type": "filter", "field": "meterName", "operator": "eq", "value": "Standard Capture" }
            ], "reference": 50, "increment": 2
        }, { // REVISAR
            "serviceId": "Static Web Apps",
            "group": "serverless",
            "reference": 1024, "increment": 1
        },{
            "serviceId": "Application Service",
            "group": "serverless",
            "customMainFilter": { "field": "meterSubCategory", "operator": "sw", "value": "Azure App Service" },
            "reference": 720, "increment": 30
        },


    ],
    "vm": {
        "steps": [

            
            { "type": "filter", "field": "meterCategory", "operator": "eq", "value": "Virtual Machines" },
            { "type": "filter", "field": "meterSubCategory", "operator": "nct", "value": "Reservation" },
            { "type": "groupby", "field": "resourceId" },
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
                                            _type: it['meterName'].replace(/([^\/]+).*/, '$1'),
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
            { "type": "filter", "field": "meterCategory", "operator": "in", "value": ["SQL Database", "Azure Database for MySQL", "Azure Database for PostgreSQL",  "SQL Managed Instance"] },
            { "type": "filter", "field": "meterSubCategory", "operator": "nct", "value": "License" },
            { "type": "filter", "field": "meterSubCategory", "operator": "nct", "value": "Storage" },
            { "type": "groupby", "field": "resourceId" },
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
                                            _description: it.Product || it.ProductName,                                    
                                            _cpu: Math.max(acc._cpu || 0, it['quantity'] / 24),
                                            _quantity: 1,
                                            _meterName: it.meterName
                                        };
                                        return acc;
                                    }, {}
                                )
                            )
                            .map(i => {
                                if (i?._meterName.indexOf('DTU') >= 0 ) {
                                    i._cpu = Math.ceil(i._cpu / 100);
                                    i.remarks = ['Foram encontrados DTUs, validar quantidade de CPU e Memória'];
                                }                 
                                i._mem = i._cpu * 5.05;     
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
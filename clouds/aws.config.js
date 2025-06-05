const awsConfig = {
    "itemOutput": {
        "ServiceId": "ProductCode",
        "Quantity": "UsageQuantity",
        "Description": "ItemDescription"
    },
    "steps": [
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": null },
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": "" },
        { "type": "filter", "field": "ProductCode", "operator": "neq", "value": null }
    ],
    "totalCostIsDollar": true,
    "totalCost": [
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": null },
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": "" },
        { "type": "filter", "field": "ProductCode", "operator": "neq", "value": null },
        { "type": "sum", "field": "TotalCost" }
    ],
    "services": [
        {
            "serviceId": "AmazonEC2",
            "group": "compute",
            "steps": [
                { "type": "filter", "field": "Operation", "operator": "ct", "value": "RunInstances" }
            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "datapipeline",
            "group": "container",
            "total": [
                { "type": "count", "field": "UsageQuantity" }
            ], "reference": 5, "increment": 5
        }, {
            "serviceId": "AmazonECS", "group": "container",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "vCPU" }
            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "AmazonEKS", "group": "container",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "vCPU-Hours" }
            ], "reference": 720, "increment": 1
        }, {
            "serviceId": "AmazonECR", "group": "container", "reference": 100, "increment": 10
        }, {
            "serviceId": "AmazonRedshift", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "sw", "value": "Node:" }
            ], "reference": 720, "increment": 1
        }, {
            "serviceId": "AmazonRedshift", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "*GB*" },
                {
                    "type": "function", "fn":
                        data => {
                            data.forEach(item => item.UsageQuantity = item.UsageQuantity * 1 / 1024);
                            return data;
                        }
                }
            ], "reference": 1, "increment": 5
        }, {
            "serviceId": "AWSGlue", "group": "database",
            "steps": [
                { "type": "filter", "field": "Operation", "operator": "ct", "value": "request" }
            ], "reference": 100000, "increment": 5
        }, {
            "serviceId": "AmazonKinesis", "group": "database",
            "steps": [
                { "type": "filter", "field": "Operation", "operator": "eq", "value": "shardHourStorage" },
            ], "reference": 10000, "increment": 1
        }, {
            "serviceId": "ElasticMapReduce", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "usage" }
            ], "reference": 720, "increment": 3
        }, {
            "serviceId": "AmazonQuickSight", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "User" }
            ], "reference": 10, "increment": 1
        }, {
            "serviceId": "AmazonAthena", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "DataScannedInTB" }
            ], "reference": 5, "increment": 2
        }, {
            "serviceId": "AmazonES", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Instance" }
            ], "reference": 720, "increment": 1
        }, {
            "serviceId": "AmazonEFS", "group": "compute",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "TimedStorage" }
            ], "reference": 2048, "increment": 1
        }, {
            "serviceId": "AmazonS3", "group": "compute",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "TimedStorage" }
            ], "reference": 5120, "increment": 10
        }, {
            "serviceId": "AmazonVPC", 
            "group": "network", 
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Hour" }
            ],
            "reference": 720, "increment": 20
        }, {
            "serviceId": "AmazonCloudFront", "group": "network",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Requests" }
            ], "reference": 15000000, "increment": 1
        }, {
            "serviceId": "AWSELB", "group": "network",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Usage" }
            ], "reference": 720, "increment": 100
        }, {
            "serviceId": "AmazonRoute53", "group": "network",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "HostedZone" }
            ], "reference": 3, "increment": 10
        }, {
            "serviceId": "AWSDirectConnect", "group": "network",
            "steps": [
                { "type": "filter", "field": "Operation", "operator": "sw", "value": "Create" }
            ], "reference": 1, "increment": 1000000000
        }, {
            "serviceId": "awskms", "group": "security",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Requests" }
            ], "reference": 5000, "increment": 1000
        }, {
            "serviceId": "CloudHSM", "group": "security",
            "steps": [
                { "type": "filter", "field": "Operation", "operator": "ct", "value": "Hourly" }
            ], "reference": 720, "increment": 1
        }, {
            "serviceId": "AmazonInspector", "group": "security",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "assessments" }
            ], "reference": 1, "increment": 500
        }, {
            "serviceId": "AmazonGuardDuty", "group": "security",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "PaidEventsAnalyzed-Bytes" }
            ], "reference": 10, "increment": 5
        }, {
            "serviceId": "awswaf", "group": "security",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Rule" }
            ], "reference": 1, "increment": 10
        }, {
            "serviceId": "AmazonApiGateway", "group": "serverless",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "ApiGatewayRequest" }
            ], "reference": 10000000, "increment": 5
        }, {
            "serviceId": "AWSLambda", "group": "serverless",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Request" }
            ], "reference": 100000000, "increment": 2
        }, {
            "serviceId": "AmazonElastiCache", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "nct", "value": "BackupUsage" },
                { "type": "filter", "field": "UsageType", "operator": "nct", "value": "Valkey" }
            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "AmazonDynamoDB", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "ByteHrs" }
            ], "reference": 10240, "increment": 3
        }, {
            "serviceId": "AmazonRDS", "group": "database",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "usage:db" }
            ], "reference": 720, "increment": 5
        }, {
            "serviceId": "AmazonSNS", "group": "serverless",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Requests" }
            ], "reference": 30000000, "increment": 10
        }, {
            "serviceId": "AWSQueueService", "group": "serverless",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "Requests" }
            ], "reference": 1000000000, "increment": 1
        }, {
            "serviceId": "AmazonLightsail", "group": "serverless",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "BundleUsage" }
            ], "reference": 720, "increment": 30
        }, {
            "serviceId": "AWSAmplify", "group": "serverless",
            "steps": [
                { "type": "filter", "field": "UsageType", "operator": "ct", "value": "DataTransferOut" }
            ], "reference": 1024, "increment": 1
        }
    ],
    "vm": {
        "steps": [
            { "type": "filter", "field": "ProductCode", "operator": "eq", "value": "AmazonEC2" },
            { "type": "filter", "field": "UsageType", "operator": "ct", "value": "BoxUsage" },
            { "type": "filter", "field": "ItemDescription", "operator": "nct", "value": "SQL" },
            {
                "type": "function",
                fn:
                    data => {
                        data.forEach(item => {
                            item._description = item.ItemDescription;
                            item._calculatedQuantity = item.UsageQuantity > 160 ? Math.ceil(Math.floor(item.UsageQuantity) / 744) : 0;
                            item._type = item.UsageType.replace(/.*BoxUsage:([^\n:]+)/, '$1');
                        });
                        return data;
                    }
            }
        ]
    },
    "rds": {
        "steps": [
            {
                "type": "function", fn: data => {
                    return data.filter(it => {
                        if (it.ProductCode == 'AmazonRDS' && /usage:db/i.test(it.UsageType)) return true;
                        if (it.ProductCode == 'AmazonEC2' && /BoxUsage/i.test(it.UsageType) && it.ItemDescription.indexOf('SQL') >= 0) return true;
                        return false;
                    });
                }
            },
            {
                "type": "function",
                fn:
                    data => {
                        data.forEach(item => {
                            item._calculatedQuantity = item.UsageQuantity > 160 ? Math.ceil(item.UsageQuantity / 744) : 0;
                            item._description = item.ItemDescription;
                            if (item.ProductCode == 'AmazonRDS') {
                                item._type = item.UsageType
                                    .replace(/.*:(db.*)/i, '$1')
                                    .replace(/xl$/, 'xlarge');
                            } else if (item.ProductCode == 'AmazonEC2') {
                                item._type = item.UsageType
                                    .replace(/.*BoxUsage:([^\n:]+)/, '$1');
                            }
                        });
                        return data;
                    }
            }
        ]
    }
}

module.exports = awsConfig;
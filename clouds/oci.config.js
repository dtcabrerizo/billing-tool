const ociConfig = {
    "totalCost": [
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": null },
        { "type": "filter", "field": "LinkedAccountName", "operator": "neq", "value": "" },
        { "type": "filter", "field": "ProductCode", "operator": "neq", "value": null },
        { "type": "sum", "field": "TotalCost" }
    ],
    "services": [
        {
            "serviceId": "Virtual Machines",
            "group": "compute",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Compute" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(OCPU Hours)" },
                { "type": "filter", "field": "ServiceId", "operator": "nct", "value": "Windows OS" }
            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "Block Storage",
            "group": "compute",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Block Storage" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(GB Months)" },
                { "type": "filter", "field": "ServiceId", "operator": "nct", "value": "Performance Units" }
            ], "reference": 5120, "increment": 10
        }, {
            "serviceId": "Load Balancers",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Load Balancer" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(Load Balancer Hours)" }

            ], "reference": 720, "increment": 100
        }, {
            "serviceId": "WAF",
            "group": "security",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Oracle Web Application Firewall" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(Instance per Month)" }

            ], "reference": 1, "increment": 10
        }, {
            "serviceId": "Fast Connect",
            "group": "network",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "Virtual Private Network" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "FastConnect" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(Port Hours)" }

            ], "reference": 720, "increment": 10
        }, {
            "serviceId": "OCVS",
            "group": "compute",
            "steps": [
                { "type": "filter", "field": "ServiceId", "operator": "sw", "value": "VMware" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "Oracle Cloud VMware Solution" },
                { "type": "filter", "field": "ServiceId", "operator": "ct", "value": "(OCPU Per Hour)" }

            ], "reference": 720, "increment": 10
        }
    ],
    "vm": {},
    "rds": {}
}

module.exports = ociConfig;


function runStep(data, step) {
    if (step.type == 'count') return data.length;
    if (step.type == 'sum') return data.reduce((acc, it) => acc + (isNaN(it[step.field]) ? 0 : Number(it[step.field])), 0);
    if (step.type == 'function') return step.fn.call(step, data);
    if (step.type == 'join') {
        return data.reduce((acc, it) => {
            if (Array.isArray(it[step.field])) acc = acc.concat(it[step.field]);
            return acc;
        }, []);
    }

    if (step.type == 'groupby') {
        return data.reduce((acc, it) => {
            const key = it[step.field]?.toString()?.toLowerCase();
            if (!key) return acc;
            if (!acc.hasOwnProperty(key)) acc[key] = [];
            acc[key].push(it);
            return acc;
        }, {});
    }
    if (step.type == 'filter') {
        return data.filter(it => runTest(it, step));
    }
}

function runTest(obj, { field, operator, value }) {
    if (!obj) return false;
    if (operator == 'in') return value.indexOf(obj[field]) >= 0;
    if (operator == 'eq') return obj[field] == value;
    if (operator == 'neq') return obj[field] != value;
    if (operator == 'ct') return obj[field]?.toString().toLowerCase().indexOf(value?.toString().toLowerCase()) >= 0;
    if (operator == 'nct') return obj[field]?.toString().toLowerCase().indexOf(value?.toString().toLowerCase()) < 0;
    if (operator == 'sw') return obj[field]?.toString().toLowerCase().startsWith(value?.toString().toLowerCase());
    if (operator == 'nsw') return obj[field]?.toString().toLowerCase().startsWith(value?.toString().toLowerCase());
    if (operator == 'ew') return obj[field]?.toString().toLowerCase().endsWith(value?.toString().toLowerCase());
    if (operator == 'new') return obj[field]?.toString().toLowerCase().endsWith(value?.toString().toLowerCase());
    return false;
}

function aggregateTest(obj, aggregator, tests) {
    return tests.reduce((acc, test) => {
        if (aggregator == 'or') {
            acc = acc || runTest(obj, test);
        } else {
            acc = acc && runTest(obj, test);
        }
        return acc;
    }, aggregator == 'and');    
}
module.exports = { runStep, runTest, aggregateTest }


function runStep(data, step) {
    if (step.type == 'count') return data.length;
    if (step.type == 'sum') return data.reduce( (acc,it) =>  acc + (isNaN(it[step.field]) ? 0 : Number(it[step.field])) , 0);
    if (step.type == 'function') return step.fn.call(step, data);

    if (step.type == 'groupby') {
        return data.reduce( (acc, it) => {
            const key = it[step.field]?.toLowerCase();
            if (!key) return acc;
            if (!acc.hasOwnProperty(key)) acc[key] = [];
            acc[key].push(it);
            return acc;
        }, {});
    }
    if (step.type == 'filter') {
        return data.filter(it => {
            if (step.operator == 'in') return step.value.indexOf(it[step.field]) >= 0;
            if (step.operator == 'eq') return it[step.field] == step.value;
            if (step.operator == 'neq') return it[step.field] != step.value;
            if (step.operator == 'ct') return it[step.field]?.toLowerCase().indexOf(step.value?.toLowerCase()) >= 0;
            if (step.operator == 'nct') return it[step.field]?.toLowerCase().indexOf(step.value?.toLowerCase()) < 0;
            if (step.operator == 'sw') return it[step.field]?.toLowerCase().startsWith(step.value?.toLowerCase());
            if (step.operator == 'nsw') return it[step.field]?.toLowerCase().startsWith(step.value?.toLowerCase());
            if (step.operator == 'ew') return it[step.field]?.toLowerCase().endsWith(step.value?.toLowerCase());
            if (step.operator == 'new') return it[step.field]?.toLowerCase().endsWith(step.value?.toLowerCase());
        });
    }
}

module.exports = { runStep }
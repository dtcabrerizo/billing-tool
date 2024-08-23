const path = require('path');
const xlsx = require('xlsx');
const { parse } = require('csv-parse/sync');

const AWS = require('../../libs/clouds/AWS');
const AzureEA = require('../../libs/clouds/AZURE-EA');
const AzureCSP = require('../../libs/clouds/AZURE-CSP');
const AzureNewEA = require('../../libs/clouds/AZURE-NEW-EA');
const AzureCSPLight = require('../../libs/clouds/AZURE-CSP-LIGHT');
const AzureCSPNovo = require('../../libs/clouds/AZURE-CSP-NOVO');
const { log } = require('../util');

const cliProgress = require('cli-progress');

const Processors = [
    new AWS(),
    new AzureEA,
    new AzureCSP(),
    new AzureNewEA(),
    new AzureCSPLight(),
    new AzureCSPNovo
];

const progressBar = new cliProgress.SingleBar({
    clearOnComplete: false,
    format: ' {bar} | {count} registros | {value}/{total} ({percentage}%) | {duration_formatted} | {eta_formatted} '
}, cliProgress.Presets.shades_grey);

const billing = (req, res, next) => {
    let data, processor;


    log(`Recebido arquivo: ${req.files.billing.name} de ${req.client.remoteAddress}`);

    // Variável para armazenar a lista de serviços no formato de planilha do Excel
    let sheet;

    // Se foi enviado um csv, obtem os dados diretamente
    if (path.extname(req.files.billing.name) == '.csv') {

        progressBar.start(req.files.billing.size, 0);
        let recordCount = 0;

        // Extrai os registros do CSV
        const records = parse(req.files.billing.data, {
            columns: true,
            cast: (value, context) => {
                if (value === null || value === '') return null;
                if (isNaN(value)) return value;
                return Number(value);
            },
            trim: true,
            bom: true,
            onRecord: (record, context) => {
                progressBar.update(context.bytes, { count: ++recordCount });
                return record;
            }
        });

        progressBar.stop();

        // Cria uma planilha temporária para processar os serviços
        // sheet = xlsx.utils.json_to_sheet(records, { cellStyles: false });
        data = records;
        processor = Processors.find(proc => proc.A1Cell == Object.keys(records?.[0])?.[0])

    } else {
        // Abre arquivo Excel do billing
        const file = xlsx.read(req.files.billing.data, { raw: true, cellHTML: false, cellFormula: false });

        // Procura planilha pelo valor da célula A1 por processador de billing
        sheet = Object.values(file.Sheets).find(i => Processors.some(proc => proc.A1Cell == (i?.A1?.w || i?.A1?.v)));

        // Se não encontrou a planilha de billing retorna erro
        if (!sheet) throw new Error('Planilha não encontrada');

        log('Planilha identificada...');

        // Procura processador de billing pelo valor da célula A1
        // TODO: Esse processo está duplicado, não valeu o esforço refazer
        processor = Processors.find(proc => proc.A1Cell == (sheet?.A1?.w || sheet?.A1?.v));

        // Se não encontrou processador de billing retorna erro
        if (!processor) throw new Error('Processador não encontrado');

        log(`Processador identificado: ${processor.type}`);

        // Remove espaços dos headers para evitar problema
        const headerCols = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1', 'AA1', 'AB1', 'AC1', 'AD1', 'AE1', 'AF1', 'AG1', 'AH1', 'AI1', 'AJ1', 'AK1', 'AL1', 'AM1', 'AN1', 'AO1', 'AP1', 'AQ1', 'AR1', 'AS1', 'AT1', 'AU1', 'AV1', 'AW1', 'AX1', 'AY1', 'AZ1']
        headerCols.forEach(h => {
            if (sheet[h]?.w) sheet[h].w = sheet[h].w.trim();
            if (sheet[h]?.v) sheet[h].v = sheet[h].v.trim();

        });

        console.time('sheet_to_json');

        // Extrai dados da planilha
        data = xlsx.utils.sheet_to_json(sheet, { raw: true, rawNumbers: true });
        console.timeEnd('sheet_to_json');
    }


    
    return { data, processor };

}

module.exports = billing;
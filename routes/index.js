const path = require('path');
const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');

const AWS = require('../libs/AWS');
const AzureEA = require('../libs/AZURE-EA');
const AzureCSP = require('../libs/AZURE-CSP');
const AzureNewEA = require('../libs/AZURE-NEW-EA');
const AzureCSPLight = require('../libs/AZURE-CSP-LIGHT');
const AzureCSPNovo = require('../libs/AZURE-CSP-NOVO');

const Processors = [
  new AWS(), 
  new AzureEA, 
  new AzureCSP(), 
  new AzureNewEA(),
  new AzureCSPLight(),
  new AzureCSPNovo
];

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async function (req, res, next) {
  try {

    if (!req.files?.billing) throw new Error('Nenhum arquivo enviado');

    console.log(`Recebido arquivo: ${req.files.billing.name} de ${req.client.remoteAddress}`);

    // Abre arquivo Excel do billing
    const file = xlsx.read(req.files.billing.data);

    // Procura planilha pelo valor da célula A1 por processador de billing
    const sheet = Object.values(file.Sheets).find(i => Processors.some(proc => proc.A1Cell == (i?.A1?.w || i?.A1?.v)));
    
    // Se não encontrou a planilha de billing retorna erro
    if (!sheet) throw new Error('Planilha não encontrada');
    
    // Procura processador de billing pelo valor da célula A1
    // TODO: Esse processo está duplicado, não valeu o esforço refazer
    const processor = Processors.find(proc => proc.A1Cell == (sheet?.A1?.w || sheet?.A1?.v));
    
    // Se não encontrou processador de billing retorna erro
    if (!processor) throw new Error('Processador não encontrado');
    
    // Remove espaços dos headers para evitar problema
    const headerCols = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1', 'X1', 'Y1', 'Z1', 'AA1', 'AB1', 'AC1', 'AD1', 'AE1', 'AF1', 'AG1', 'AH1', 'AI1', 'AJ1', 'AK1', 'AL1', 'AM1', 'AN1', 'AO1', 'AP1', 'AQ1', 'AR1', 'AS1', 'AT1', 'AU1', 'AV1', 'AW1', 'AX1', 'AY1', 'AZ1']
    headerCols.forEach(h => { 
      if (sheet[h]?.w) sheet[h].w = sheet[h].w.trim(); 
      if (sheet[h]?.v) sheet[h].v = sheet[h].v.trim(); 
    
    });

    // Extrai dados da planilha
    const data = xlsx.utils.sheet_to_json(sheet, { raw: true, rawNumbers: true });
    
    // Opções de execução
    const options = {
      isFebruary: req.body.chkfeb == 'on'
    };

    // Executa processador de billing
    const result = processor.run(data, options);

    // Renderiza página de resultados
    return res.render('result', { ...result, type: processor.type, fileName: req.files.billing.name });

  } catch (error) {
    next(error);
  }

});

module.exports = router;

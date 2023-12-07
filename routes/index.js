const express = require('express');
const router = express.Router();

const package = require('../package.json');

const Dollar = require('../libs/dollar');

const billing = require('../libs/procs/billing');
const oci = require('../libs/procs/oci');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '"Bee"lling Tool', version: package.version });
});

router.post('/', async function (req, res, next) {
  try {

    let fn;

    if (req.body.billing_type == 'AWS+AZURE') {
      fn = billing;
    } else if (req.body.billing_type == 'OCI') {
      fn = oci;
    } else {
      throw new Error('Invalid billing type');
    }
    
    const { data, processor } = fn(req);

    // Se não encontrou processador de billing retorna erro
    if (!processor) throw new Error('Processador não encontrado');

    // Opções de execução
    const options = {
      isFebruary: req.body.chkfeb == 'on',
      ...req.body
    };

    // Executa processador de billing
    const result = processor.run(data, options);

    // Renderiza página de resultados
    return res.render('result', { title: '"Bee"lling Tool', ...result, type: processor.type, files: req.files, options, version: package.version, Dollar });

  } catch (error) {
    next(error);
  }

});

router.post('/OCI', (req, res, next) => {
  res.end('recebido');
})


module.exports = router;

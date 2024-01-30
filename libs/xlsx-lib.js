const ExcelJS = require('exceljs');
const { log } = require('./util');

const excel = new ExcelJS.Workbook();

class XLSXLib {
    workbook = null;

    static async create(buffer) {
        const tmp = new XLSXLib();
        tmp.workbook = await excel.xlsx.load(buffer);
        return tmp;
    }

    trySetSheet(fn) {
        this.sheet = fn(this.workbook);
        return this.sheet == null;
    }

    async getData() {
        log('XLSX-LIB::Getdata');
        if (!this.sheet) throw new Error('Nenhuma planilha foi selecionada');

        // Obtém as colunas que estão os campos que precisam ser usados
        const headerRow = this.sheet.getRow(1);

        const headers = [];
        headerRow.eachCell((cell, colNumber) => headers[colNumber] = cell.value);

        // console.log('Processando Headers...');
        // headerRow.eachCell(cell => {
        //     const cellHeader = cell.value;
        //     const cellColumn = cell.address.replace(/\d/g, '');
        //     headers.push({ cellHeader, cellColumn });
        // });

        const data = [];
        console.log('Obtendo Dados...');
        this.sheet.eachRow((row, rowId) => {
            if (rowId === 1) return;
            const d = {};
            row.eachCell((cell, colNumber) => {
                d[headers[colNumber]] = cell.value;
            });
            data.push(d);
        });
        return data;

        // const chunks = (a, size) =>
        //     Array.from(
        //         new Array(Math.ceil(a.length / size)),
        //         (_, i) => a.slice(i * size, i * size + size)
        //     );

        // const chunkSize = Math.ceil(this.sheet.rowCount / 10);

        // console.log(`RowCount: ${this.sheet.rowCount}, ChuckSize: ${chunkSize}`);
        // const rows = this.sheet.getRows(2, this.sheet.rowCount);
        // const dataChunks = chunks(rows, chunkSize);



        // // return new Promise(
        // //     (resolve, reject) => {
        // //         const worker = new Worker(__filename, { workerData: { dataChunks, headers } });
        // //         worker.on('message', resolve);
        // //         worker.on('error', reject);
        // //         worker.on('exit', code => {
        // //             if (code !== 0) reject(new Error(`Worker finalizou com código ${code}`));
        // //         })
        // //     }
        // // );


        // console.log(`Processando ${dataChunks.length} chuncks de ${chunkSize} registros`);

        // const data = [];
        // dataChunks.forEach((chunck, chunkId) => {
        //     chunck.forEach( (row, rowId) => {
        //         // console.log(`  #${chunkId} ${rowId}/${chunk.length}`);

        //         const d = headers.reduce((h, { cellHeader, cellColumn }) => {
        //             h[cellHeader] = row.getCell(cellColumn).value;
        //             // const cell = row._cells.find(cell => cell && cell._address.toString().startsWith(cellColumn));
        //             // if (cell) h[cellHeader] = cell._value.model.value;
        //             return h;
        //         }, {});
        //         data.push(d);
        //     });
        // });

        // return data;
    }

}


module.exports = XLSXLib;




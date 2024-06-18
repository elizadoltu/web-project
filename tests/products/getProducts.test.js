const getProductByBarcode = require("../../server/apis/getProductByBarcode");
const barcodes = ['4056489186267', '4056489166221', '5942218001118'];

async function runTests() {
    console.log('Running tests...');

    for (let barcode of barcodes) {
        try {
            const product = await getProductByBarcode(barcode);
            console.log(`Product details for barcode ${barcode}:`);
            console.log(product);
        } catch (err) {
            console.error(`Error fetching product for barcode ${barcode}: `, err.message);
        }
    }
}

module.exports = { runTests };

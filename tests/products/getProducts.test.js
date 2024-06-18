const getAllProducts = require("../../server/apis/getProductByBarcode");
const barcodes = ['4056489186267', '4056489166221', '5942218001118'];

function runTests() {
    console.log('Running tests...');

    barcodes.forEach((barcode) => {
        getAllProducts(barcode, (err, product) => {
            if (err) {
                console.error(`Error fetching product for barcode ${barcode}: `, err.message);
            } else {
                console.log(`Product details for barcode ${barcode}:`);
                console.log(product);
            }
        });
    });
}

module.exports = { runTests };
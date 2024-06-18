const https = require("https");

function getProductByBarcode(barcode) {
    return new Promise((resolve, reject) => {
        const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=product_name`;

        https.get(url, (res) => {
            let data = '';
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                if (res.statusCode === 200) {
                    try {
                        const product = JSON.parse(data);
                        resolve(product);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`Request failed with status code ${res.statusCode}`));
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = getProductByBarcode;

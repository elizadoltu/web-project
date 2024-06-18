const https = require("https");

function getProductByBarcode(barcode, callback) {
  const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=product_name`;

  https.get(url, (res) => {
    let data = " ";
    res.on("data", (chunck) => {
      data += chunck;
    });
    res.on("end", () => {
      if (res.statusCode === 200) {
        try {
          const product = JSON.parse(data);
          callback(null, product);
        } catch (error) {
          callback(error);
        }
      } else {
        callback(
          new Error(`Request failed with status code ${res.statusCode}`)
        );
      }
    });
  }).on('error', (error) => {
    callback(error);
  });
}

module.exports = getProductByBarcode;

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/getBarcodes')
        .then(response => response.json())
        .then(data => {
            const barcodeButtonsContainer = document.getElementById('barcodeButtons');

            data.forEach(barcodeObj => {
                const barcode = barcodeObj.barcode;  

                const button = document.createElement('button');
                button.textContent = barcode;
                button.className = 'button';
                button.addEventListener('click', () => {
                    fetchProductDetails(barcode);
                });

                barcodeButtonsContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error fetching barcodes:', error));

    function fetchProductDetails(barcode) {
        fetch(`/api/products?barcode=${barcode}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(productData => {
                if (productData.status === 1) {
                    const productName = productData.product.product_name;
                    console.log(`Product Name for ${barcode}: ${productName}`);
                } else {
                    console.log(`No product found for barcode ${barcode}`);
                }
            })
            .catch(error => console.error(`Error fetching product details for ${barcode}:`, error));
    }
});

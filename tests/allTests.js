const { runTests: runDataBaseTests } = require('./database/database.test');
const { runTests: runProductsTests } = require('./products/getProducts.test');
const { runTests: runUsersTests } = require('./users/users.test');

function runAllTests() {
    console.log('Running all tests...');
    runDataBaseTests();
    runProductsTests();
    runUsersTests();
}

runAllTests();
const http = require('http');

function testFetchUsersAPI(callback) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/users',
        method: 'GET',
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const users = JSON.parse(data);
            callback(null, users);
        });
    });

    req.on('error', (error) => {
        callback(error);
    });

    req.end();
}

function runTests() {
    console.log('Running tests...');

    testFetchUsersAPI((err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
        } else {
            if (Array.isArray(users)) {
                console.log('Test passed: API returned users');
            } else {
                console.error('Test failed: API did not return users');
            }
        }
    });
}

runTests();

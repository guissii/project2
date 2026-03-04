const jwt = require('jsonwebtoken');
const http = require('http');

// Generate an admin token
const token = jwt.sign({ id: 'some-admin-id', role: 'admin' }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '1h' });

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/admin/users',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    }
};

const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`BODY: ${data}`);
    });
});

req.on('error', e => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();

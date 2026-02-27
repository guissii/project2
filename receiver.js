const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.writeFileSync('extracted_links.json', body);
            console.log('Successfully saved to extracted_links.json');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            process.exit(0);
        });
    } else {
        res.writeHead(405);
        res.end();
    }
});

server.listen(9999, '127.0.0.1', () => {
    console.log('Listening for data on http://127.0.0.1:9999');
});

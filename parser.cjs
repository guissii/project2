const fs = require('fs');
const content = fs.readFileSync('pc1_curl.txt', 'utf8');
const links = [];
const regex = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
let match;
while ((match = regex.exec(content)) !== null) {
    const href = match[1];
    if (href.endsWith('.pdf') || href.endsWith('.doc') || href.endsWith('.docx') || href.endsWith('.zip') || href.endsWith('.rar')) {
        links.push({
            href: href.startsWith('http') ? href : `http://www.pc1.ma/${href.replace(/^\//, '')}`,
            text: match[2].replace(/<[^>]*>?/gm, '').trim()
        });
    }
}
fs.writeFileSync('parsed_links.json', JSON.stringify(links, null, 2));
console.log(`Trouvé ${links.length} liens de documents.`);

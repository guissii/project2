import fs from 'fs';
import * as cheerio from 'cheerio';

const content = fs.readFileSync('pc1_curl.txt', 'utf8');

// Load HTML with Cheerio
const $ = cheerio.load(content);

const links = [];
$('a').each((i, el) => {
    const a = $(el);
    const href = a.attr('href');
    if (!href) return;

    const lowerHref = href.toLowerCase();
    if (lowerHref.endsWith('.pdf') || lowerHref.endsWith('.doc') || lowerHref.endsWith('.docx') || lowerHref.endsWith('.zip') || lowerHref.endsWith('.rar')) {
        links.push({
            url: href.startsWith('http') ? href : `http://www.pc1.ma/${href.replace(/^\//, '')}`,
            name: a.text().trim().replace(/[^a-zA-Z0-9éèàê]/g, '_') || href.split('/').pop()
        });
    }
});

fs.writeFileSync('parsed_cheerio.json', JSON.stringify(links, null, 2));
console.log(`Trouvé ${links.length} liens avec Cheerio.`);

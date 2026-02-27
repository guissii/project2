const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        // Définir un user-agent pour éviter le blocage 403
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto('http://www.pc1.ma/2bacfr.html', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const data = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            return links
                .map(a => ({
                    text: a.innerText.trim().replace(/\n/g, ' '),
                    href: a.href,
                    className: a.className
                }))
                .filter(link => link.href && link.href.trim() !== '');
        });

        fs.writeFileSync('pc1_links.json', JSON.stringify({ success: true, count: data.length, data: data }, null, 2));
        await browser.close();
    } catch (e) {
        fs.writeFileSync('pc1_links.json', JSON.stringify({ success: false, error: e.message, stack: e.stack }, null, 2));
        process.exit(1);
    }
})();

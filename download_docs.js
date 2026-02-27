import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const targetUrl = 'http://www.pc1.ma/2bacfr.html';
const downloadDir = path.join(process.cwd(), 'downloads');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(dest);

        protocol.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

(async () => {
    console.log("🚀 Lancement de Puppeteer...");
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    try {
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log(`🌐 Navigation vers ${targetUrl}...`);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        console.log("🔍 Extraction des liens de documents...");
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a'));
            const docs = [];
            anchors.forEach(a => {
                const href = a.href;
                if (!href) return;

                const lowerHref = href.toLowerCase();
                if (lowerHref.endsWith('.pdf') || lowerHref.endsWith('.doc') || lowerHref.endsWith('.docx') || lowerHref.endsWith('.zip') || lowerHref.endsWith('.rar')) {
                    docs.push({
                        url: href,
                        name: a.innerText.trim().replace(/[^a-zA-Z0-9éèàê]/g, '_') || href.split('/').pop()
                    });
                }
            });
            return docs;
        });

        console.log(`✅ ${links.length} documents trouvés.`);

        // Enregistrer la liste des liens
        fs.writeFileSync(path.join(downloadDir, 'links.json'), JSON.stringify(links, null, 2));

        let successCount = 0;
        console.log("⬇️ Début du téléchargement...");

        // Télécharger tous les fichiers
        for (const [index, link] of links.entries()) {
            const ext = link.url.split('.').pop() || 'pdf';
            let fileName = `${index + 1}_${link.name.substring(0, 50)}.${ext}`;
            const destPath = path.join(downloadDir, fileName.replace(/[<>:"/\\|?*]+/g, '_'));

            console.log(`⏳ [${index + 1}/${links.length}] Téléchargement de ${fileName}...`);
            try {
                await downloadFile(link.url, destPath);
                console.log(`✅ Succès: ${fileName}`);
                successCount++;
            } catch (err) {
                console.error(`❌ Échec: ${fileName} - ${err.message}`);
            }
        }

        console.log(`🎉 Processus terminé. ${successCount} fichiers téléchargés dans le dossier 'downloads'.`);

    } catch (error) {
        console.error("❌ Erreur critique:", error.message);
    } finally {
        await browser.close();
    }
})();

import fs from 'fs';
import path from 'path';

const url = 'http://www.pc1.ma/2bacfr.html';
const destDir = path.join(process.cwd(), 'downloads');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

async function scrape() {
    console.log(`📡 Récupération de l'URL : ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let html = await response.text();
        console.log(`✅ Page téléchargée, taille: ${html.length} caractères.`);

        const docs = [];
        const regex = /href\s*=\s*["']([^"']+\.(?:pdf|doc|docx|zip|rar))["'][^>]*>(?:<[^>]+>)*([^<]+)</gi;
        let match;

        while ((match = regex.exec(html)) !== null) {
            let fileUrl = match[1].trim();
            const fileName = match[2].trim().replace(/[^a-zA-Z0-9éèàê]/g, '_');

            if (!fileUrl.startsWith('http')) {
                fileUrl = `http://www.pc1.ma/${fileUrl.replace(/^\.\//, '')}`;
            }

            docs.push({ url: fileUrl, name: fileName || fileUrl.split('/').pop() });
        }

        // Extraction par autre pattern pour pc1.ma (souvent les liens sont just des <a href="lien.pdf">)
        const aTags = html.match(/<a[^>]+href\s*=\s*["']([^"']+\.(?:pdf|doc|docx|zip|rar))["'][^>]*>([\s\S]*?)<\/a>/gi);
        if (aTags) {
            for (const a of aTags) {
                const hrefMatch = a.match(/href\s*=\s*["']([^"']+)["']/i);
                if (hrefMatch) {
                    let fileUrl = hrefMatch[1].trim();
                    if (!fileUrl.startsWith('http')) {
                        fileUrl = `http://www.pc1.ma/${fileUrl.replace(/^\.\//, '')}`;
                    }
                    const text = a.replace(/<[^>]+>/g, '').trim().replace(/[\r\n]+/g, ' ').replace(/[^a-zA-Z0-9éèàê ]/g, '_');
                    if (!docs.find(d => d.url === fileUrl)) {
                        docs.push({ url: fileUrl, name: text || fileUrl.split('/').pop() });
                    }
                }
            }
        }

        console.log(`📄 Trouvé ${docs.length} liens de documents.`);

        if (docs.length === 0) {
            console.log("Aperçu du HTML pour débogage:");
            console.log(html.substring(0, 1000));
            return;
        }

        let successCount = 0;
        for (const [index, doc] of docs.entries()) {
            const ext = doc.url.split('.').pop();
            const safeName = (doc.name || 'document').substring(0, 50).trim();
            const fileName = `${index + 1}_${safeName}.${ext}`;
            const filePath = path.join(destDir, fileName);

            console.log(`⏳ [${index + 1}/${docs.length}] Téléchargement de ${fileName}...`);

            try {
                const fileRes = await fetch(doc.url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
                if (!fileRes.ok) throw new Error(`Status ${fileRes.status}`);

                const buffer = await fileRes.arrayBuffer();
                fs.writeFileSync(filePath, Buffer.from(buffer));
                console.log(`✅ Succès.`);
                successCount++;
            } catch (err) {
                console.error(`❌ Échec: ${err.message}`);
            }
        }

        console.log(`🎉 Processus terminé: ${successCount} fichiers téléchargés.`);

    } catch (e) {
        console.error("❌ Erreur critique:", e.message);
    }
}

scrape();

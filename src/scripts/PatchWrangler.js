import fs from 'node:fs';
import path from 'node:path';

try {
    const configPath = path.resolve('dist/server/.prerender/wrangler.json');
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (config.assets && config.assets.binding === 'ASSETS') {
            // Rimuove il blocco assets che causa l'errore "ASSETS is reserved" in Pages
            delete config.assets;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
            console.log('✓ Successo: wrangler.json patchato rimuovendo il binding ASSETS riservato.');
        }
    } else {
        console.log('w/ Info: wrangler.json non trovato in dist/server/.prerender/ (nessuna patch necessaria).');
    }
} catch (error) {
    console.error('✗ Errore durante il patching di wrangler.json:', error);
}

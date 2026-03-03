const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/i18n/messages');
const enFile = path.join(localesDir, 'en.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

const localeFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json') && file !== 'en.json');

function syncKeys(source, target) {
    let updated = false;
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = Array.isArray(source[key]) ? [] : {};
                updated = true;
            }
            if (syncKeys(source[key], target[key])) {
                updated = true;
            }
        } else {
            if (!(key in target)) {
                target[key] = source[key];
                updated = true;
            }
        }
    }
    return updated;
}

localeFiles.forEach(file => {
    const filePath = path.join(localesDir, file);
    const targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (syncKeys(enData, targetData)) {
        fs.writeFileSync(filePath, JSON.stringify(targetData, null, 4), 'utf8');
        console.log(`Synced ${file}`);
    } else {
        console.log(`No changes for ${file}`);
    }
});

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedFiles = 0;

walkDir('./src', function (filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace "PT Indonesian Visas Agency" NOT followed by "™"
        const regex = /PT Indonesian Visas Agency(?!\™)/g;

        if (regex.test(content)) {
            const newContent = content.replace(regex, 'PT Indonesian Visas Agency™');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated:', filePath);
            modifiedFiles++;
        }
    }
});

console.log(`\nSuccessfully updated ${modifiedFiles} files with the registered trademark symbol.`);

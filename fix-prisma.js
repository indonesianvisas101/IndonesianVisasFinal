const fs = require('fs');

const path = './prisma/schema.prisma';
let content = fs.readFileSync(path, 'utf8');

// Replace model/enum blocks to inject @@schema("public")
// We look for the closing brace '}' of models and enums and inject it before if it doesn't exist
const lines = content.split('\n');
let modified = [];
let inBlock = false;
let blockType = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^(model|enum)\s+\w+\s*\{/)) {
        inBlock = true;
        blockType = line.startsWith('model') ? 'model' : 'enum';
        modified.push(line);
        continue;
    }

    if (inBlock && line.trim() === '}') {
        // Check if previous lines already have @@schema
        let hasSchema = false;
        for (let j = modified.length - 1; j >= 0; j--) {
            if (modified[j].includes('@@schema')) {
                hasSchema = true;
                break;
            }
            if (modified[j].match(/^(model|enum)\s/)) break; // Start of block
        }

        if (!hasSchema) {
            modified.push('  @@schema("public")');
        }
        inBlock = false;
    }

    modified.push(line);
}

fs.writeFileSync(path, modified.join('\n'));
console.log('Appended @@schema("public") to all models and enums');

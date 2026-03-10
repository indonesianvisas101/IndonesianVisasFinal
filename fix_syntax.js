const fs = require('fs');
const file = '/Users/bayu/Documents/ANTIGRAVITY/IndonesianVisas/src/components/application/StepPayment.tsx';
let content = fs.readFileSync(file, 'utf8');

// The multi_replace_file_content tool previously added literal \ characters before `$` or `{` by accident 
// because I passed slashes in my replacement string. Let's globally replace \` with ` and \$ with $ etc.
// But we have to be careful not to break legitimate React code.
// Looking at the exact errors:
// \`Traveler_\${index + 1}_\${key}\` was created -> should be `Traveler_${index + 1}_${key}`
// \`${personalInfo.firstName} \${personalInfo.lastName}\` -> `${personalInfo.firstName} ${personalInfo.lastName}`

content = content.replace(/\\`([^`]+)\\`/g, '`$1`');
content = content.replace(/\\\$\{([^}]+)\}/g, '${$1}');

fs.writeFileSync(file, content);
console.log("Syntax fixed");

const fs = require('fs');
let content = fs.readFileSync('src/components/Explorations.tsx', 'utf8');

content = content.replace(/text-white\/([0-9]+)/g, 'text-[rgba(var(--text-base-rgb),0.$1)]');
content = content.replace(/text-white(?![a-zA-Z0-9_-])/g, 'text-[var(--text)]');

fs.writeFileSync('src/components/Explorations.tsx', content);

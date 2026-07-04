const fs = require('fs');
let content = fs.readFileSync('src/components/SelectedWorks.tsx', 'utf8');

// Fix the bad regex replacement
content = content.replace(/text-\[var\(--text\)\]\/!([0-9]+)/g, 'text-[rgba(var(--text-base-rgb),0.$1)]');
content = content.replace(/text-\[var\(--text\)\] opacity-([0-9]+)/g, 'text-[rgba(var(--text-base-rgb),0.$1)]');

fs.writeFileSync('src/components/SelectedWorks.tsx', content);

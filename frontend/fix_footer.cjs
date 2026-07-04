const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Replace specific background
content = content.replace('bg-[#060608] text-white', 'bg-white/80 dark:bg-[#060608] text-[var(--text)] dark:text-white backdrop-blur-3xl');

// Handle opacities for text-white
content = content.replace(/text-white\/([0-9.]+)/g, 'text-[rgba(var(--text-base-rgb),$1)] dark:text-white/$1');
// Handle raw text-white
content = content.replace(/text-white(?![a-zA-Z0-9_/-])/g, 'text-[var(--text)] dark:text-white');

// Handle opacities for bg-white
content = content.replace(/bg-white\/([0-9.]+)/g, 'bg-[rgba(var(--text-base-rgb),$1)] dark:bg-white/$1');

// Handle opacities for border-white
content = content.replace(/border-white\/([0-9.]+)/g, 'border-[rgba(var(--text-base-rgb),$1)] dark:border-white/$1');

fs.writeFileSync('src/components/Footer.tsx', content);

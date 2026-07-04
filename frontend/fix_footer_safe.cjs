const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Container
content = content.replace('bg-[#060608] text-white', 'bg-white/80 dark:bg-[#060608] text-[var(--text)] dark:text-white backdrop-blur-3xl');

// Helper to convert "white" classes to theme-aware classes
function convert(match, prefix, amount, arbitrary) {
    if (arbitrary) {
        // e.g. text-white/[0.022] -> text-[rgba(var(--text-base-rgb),0.022)] dark:text-white/[0.022]
        return `${prefix}-[rgba(var(--text-base-rgb),${arbitrary})] dark:${match}`;
    } else if (amount) {
        // e.g. text-white/35 -> text-[rgba(var(--text-base-rgb),0.${amount})] dark:text-white/${amount}
        // Handle 100/raw cases differently if needed, but in Footer they are 8, 15, 25, 35, 70, 80 etc.
        let alpha = amount.length === 1 ? `0.0${amount}` : `0.${amount}`;
        // special cases where length > 2 could be '100' or similar, but let's assume they are standard 0-100 values
        if (amount === '100') alpha = '1';
        return `${prefix}-[rgba(var(--text-base-rgb),${alpha})] dark:${match}`;
    } else {
        // e.g. text-white
        return `${prefix}-[var(--text)] dark:${match}`;
    }
}

content = content.replace(/(text|bg|border)-white(?:\/(\d+))?(?:\/\[([0-9.]+)\])?/g, convert);

fs.writeFileSync('src/components/Footer.tsx', content);

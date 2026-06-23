const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Use regex to find className="..." and replace colors inside
    content = content.replace(/className=(["'])(.*?)\1|className=\{`(.*?)`\}/g, (match, quote, p2, p3) => {
        let classStr = p2 !== undefined ? p2 : p3;
        
        // Skip if button or colored background
        if (classStr.includes('bg-brand') || 
            classStr.includes('bg-blue') || 
            classStr.includes('bg-violet') || 
            classStr.includes('bg-pink') || 
            classStr.includes('from-') || 
            classStr.includes('to-') ||
            classStr.includes('bg-emerald') ||
            classStr.includes('bg-[#') ||
            classStr.includes('text-transparent')) {
            return match;
        }

        // Replace text-white that are not prefixed with hover:, focus:, etc (simple heuristic)
        // Also don't touch dark:text-white if it already exists
        let newClassStr = classStr
            .replace(/(?<!\S)text-white(?!\S)/g, 'text-text-primary dark:text-white')
            .replace(/(?<!\S)text-white\/70(?!\S)/g, 'text-text-secondary dark:text-white/70')
            .replace(/(?<!\S)text-white\/80(?!\S)/g, 'text-text-secondary dark:text-white/80')
            .replace(/(?<!\S)text-white\/50(?!\S)/g, 'text-muted dark:text-white/50')
            .replace(/(?<!\S)text-gray-200(?!\S)/g, 'text-text-primary dark:text-gray-200')
            .replace(/(?<!\S)text-gray-300(?!\S)/g, 'text-text-secondary dark:text-gray-300')
            .replace(/(?<!\S)text-gray-400(?!\S)/g, 'text-muted dark:text-gray-400')
            // Also fix some backgrounds that are always dark
            .replace(/(?<!\S)bg-gray-800(?!\S)/g, 'bg-surface-2 dark:bg-gray-800')
            .replace(/(?<!\S)bg-gray-900(?!\S)/g, 'bg-surface dark:bg-gray-900')
            .replace(/(?<!\S)bg-black\/20(?!\S)/g, 'bg-black/5 dark:bg-black/20')
            .replace(/(?<!\S)bg-black\/50(?!\S)/g, 'bg-black/10 dark:bg-black/50')
            .replace(/(?<!\S)bg-white\/10(?!\S)/g, 'bg-black/5 dark:bg-white/10')
            .replace(/(?<!\S)border-white\/10(?!\S)/g, 'border-black/5 dark:border-white/10');

        // cleanup duplicates if any
        newClassStr = newClassStr.replace(/dark:text-white dark:text-white/g, 'dark:text-white');

        if (p2 !== undefined) {
            return `className=${quote}${newClassStr}${quote}`;
        } else {
            return `className={\`${newClassStr}\`}`;
        }
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${path.basename(file)}`);
    }
});

console.log("Done upgrading colors!");

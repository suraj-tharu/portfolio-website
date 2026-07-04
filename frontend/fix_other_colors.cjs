const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Users/ACER/OneDrive/Documents/Desktop/my project/frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([^)]+))?\)/g, (match, r, g, b, a) => {
        if (parseInt(r) > 220 && parseInt(g) > 220 && parseInt(b) > 220) {
            if (a) return `rgba(var(--text-base-rgb), ${a})`;
            return `rgb(var(--text-base-rgb))`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
console.log('Done');

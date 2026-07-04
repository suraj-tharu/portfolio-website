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

    // Replace rgba(255,255,255, X) or rgba(255, 255, 255, X)
    content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/g, 'rgba(var(--text-base-rgb),');
    
    // Replace '#fff' and '#ffffff' with 'var(--white)'
    content = content.replace(/['"]#fff['"]/gi, "'var(--white)'");
    content = content.replace(/['"]#ffffff['"]/gi, "'var(--white)'");

    // Replace #fff inside template literals or strings where not surrounded by quotes directly
    // Look for `#fff` not followed by a hex char
    content = content.replace(/(?<![a-zA-Z0-9])#fff(?![a-zA-Z0-9])/gi, 'var(--white)');
    content = content.replace(/(?<![a-zA-Z0-9])#ffffff(?![a-zA-Z0-9])/gi, 'var(--white)');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
console.log('Done');

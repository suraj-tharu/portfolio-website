const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
 // Might not be available

// We can just use basic regex and string manipulation since jsdom isn't guaranteed.
// Better yet, just use RegExp.

let newHtml = html;

// Extract Style
const styleRegex = /<style>([\s\S]*?)<\/style>/i;
const styleMatch = newHtml.match(styleRegex);
if (styleMatch) {
  fs.writeFileSync('style.css', styleMatch[1].trim());
  newHtml = newHtml.replace(styleRegex, '<link rel="stylesheet" href="style.css">');
}

// Extract Inline Scripts
const scriptRegex = /<script(?![^>]*src=)>([\s\S]*?)<\/script>/gi;
let appJsContent = '';
let match;
let scriptCount = 0;

while ((match = scriptRegex.exec(newHtml)) !== null) {
  const content = match[1].trim();
  if (content) {
    if (content.includes('tailwind.config')) {
      fs.writeFileSync('tailwind-config.js', content);
      newHtml = newHtml.replace(match[0], '<script src="tailwind-config.js"></script>');
    } else {
      appJsContent += `\n// --- Extracted Script ${++scriptCount} ---\n${content}\n`;
      newHtml = newHtml.replace(match[0], ''); // Will add app.js at the end
    }
  }
}

if (appJsContent) {
  fs.writeFileSync('app.js', appJsContent.trim());
  // insert <script src="app.js"></script> before </body>
  newHtml = newHtml.replace('</body>', '  <script src="app.js"></script>\n</body>');
}

fs.writeFileSync('index.html', newHtml);
console.log('Extraction complete.');

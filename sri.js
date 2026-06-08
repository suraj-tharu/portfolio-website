const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

let html = fs.readFileSync('index.html', 'utf8');

const regex = /<(script|link)([^>]+)(src|href)="([^"]+)"([^>]*)>/g;
let match;
let urls = new Set();

while ((match = regex.exec(html)) !== null) {
  const url = match[4];
  if (url.startsWith('https://')) {
    urls.add(url);
  }
}

async function fetchAndHash(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        const hash = crypto.createHash('sha384').update(buffer).digest('base64');
        resolve(`sha384-${hash}`);
      });
    }).on('error', reject);
  });
}

async function processHtml() {
  for (const url of urls) {
    try {
      console.log(`Hashing ${url}...`);
      const hash = await fetchAndHash(url);
      
      // Update HTML
      const urlRegex = new RegExp(`(<(?:script|link)[^>]+(?:src|href)="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*)(>)`, 'g');
      html = html.replace(urlRegex, (match, p1, p2) => {
        if (!p1.includes('integrity=')) {
          return `${p1} integrity="${hash}" crossorigin="anonymous"${p2}`;
        }
        return match;
      });
    } catch (e) {
      console.error(`Failed to hash ${url}`, e.message);
    }
  }
  
  // Add rel="noopener noreferrer" to target="_blank"
  html = html.replace(/target="_blank"(?!.*rel="noopener)/g, 'target="_blank" rel="noopener noreferrer"');
  
  fs.writeFileSync('index.html', html);
  console.log('Finished updating index.html with SRI and rel attributes.');
}

processHtml();

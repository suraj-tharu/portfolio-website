const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Create an absolute file URL to the local resume.html
    const filePath = path.resolve(__dirname, 'resume.html');
    console.log(`Loading file: ${filePath}`);
    
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    
    // Set PDF options for A4 page, with margins to ensure good spacing
    const pdfPath = path.resolve(__dirname, 'Suraj_Tharu_CV.pdf');
    console.log(`Generating PDF at: ${pdfPath}`);
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true, // IMPORTANT: Prints background colors/images
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm'
      }
    });

    await browser.close();
    console.log('PDF generation complete!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
})();

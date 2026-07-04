const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1 & 2 & 3 & 5: Update Light Mode Variables
css = css.replace(
  /\.light\s*{[^}]*}/s,
  `.light {
    /* Backgrounds — Pearl Alabaster, warm velvety feel */
    --bg: #FCFCFC;
    --surface: #F7F7F8;
    --surface-2: #F0F0F2;
    --surface-3: #E8E8EB;

    /* Text — Refined off-black and sophisticated charcoal */
    --text: #1A1A1A;
    --text-secondary: #4A4A4A;
    --muted: #737373;
    --text-base-rgb: 26, 26, 26;
    --white: #1A1A1A;

    /* Borders — Ultra-thin Platinum */
    --stroke: #EAEAEA;
    --stroke-strong: #DDDDDD;

    /* Brand / Accent — Deep Obsidian */
    --brand: #1A1A1A;
    --brand-light: #333333;
    --brand-dark: #000000;
    --brand-rgb: 26, 26, 26;

    /* Accent — Champagne Gold + Soft Rose Gold */
    --accent: #C5A059;
    --accent-2: #D1A3A4;
    --accent-2-rgb: 209, 163, 164;

    /* Additional premium accents */
    --accent-cyan: #0284C7;
    --accent-emerald: #059669;

    /* Status */
    --success: #059669;
    --warning: #D97706;
    --error: #DC2626;
  }`
);

// 7: Refined Selection Color for Light Mode
css = css.replace(
  /\.light ::selection\s*{\s*background:[^;]+;\s*color:[^;]+;\s*}/,
  `.light ::selection {
    background: rgba(197, 160, 89, 0.15); /* Soft Champagne Gold */
    color: var(--text);
  }`
);

// 9: Warmer Ambient Orbs for Light Mode
css = css.replace(
  /\.light body::after\s*{[^}]*}/,
  `.light body::after {
    content: "";
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: -1;
    background: 
      radial-gradient(circle at 15% 50%, rgba(197, 160, 89, 0.04), transparent 30%),
      radial-gradient(circle at 85% 30%, rgba(209, 163, 164, 0.03), transparent 30%);
  }`
);

// 6: Rose Gold Subtle Gradient for Light Mode
css = css.replace(
  /\.light \.accent-gradient\s*{[^}]*}/,
  `.light .accent-gradient {
    background-image: linear-gradient(135deg, #C5A059 0%, #E5E4E2 50%, #D1A3A4 100%);
  }`
);

// Update Light Hero Heading to elegant gold/champagne
css = css.replace(
  /\.light \.hero-heading\s*{[^}]*}/,
  `.light .hero-heading {
    background: linear-gradient(160deg, #9C7B3C 0%, #C5A059 45%, #E5E4E2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }`
);

// Light brand glow
css = css.replace(
  /\.light \.brand-glow\s*{[^}]*}/,
  `.light .brand-glow {
    box-shadow: 0 0 20px rgba(197, 160, 89, 0.2), 0 0 40px rgba(197, 160, 89, 0.08);
  }`
);
css = css.replace(
  /\.light \.brand-glow-strong\s*{[^}]*}/,
  `.light .brand-glow-strong {
    box-shadow: 0 0 30px rgba(197, 160, 89, 0.3), 0 0 80px rgba(197, 160, 89, 0.1), 0 4px 20px rgba(0, 0, 0, 0.05);
  }`
);

// 4: Soft Glow Box Shadows for Glass Cards (Light Mode)
css = css.replace(
  /\.light \.glass-card\s*{[^}]*}/,
  `.light .glass-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%);
    border-color: rgba(197,160,89,0.15);
  }`
);
css = css.replace(
  /\.light \.glass-card:hover\s*{[^}]*}/,
  `.light .glass-card:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(253,253,254,0.95) 100%);
    border-color: rgba(197,160,89,0.3);
    box-shadow: 0 16px 50px rgba(197, 160, 89, 0.08), 0 0 0 1px rgba(197, 160, 89, 0.2);
  }`
);

// 8: Silky Scrollbar for Light Mode
css = css.replace(
  /\.light ::-webkit-scrollbar-thumb\s*{\s*background:[^;]+;\s*box-shadow:[^;]+;\s*}/,
  `.light ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #E5E4E2, #C5A059);
  box-shadow: 0 0 8px rgba(197, 160, 89, 0.15);
}`
);
css = css.replace(
  /\.light ::-webkit-scrollbar-thumb:hover\s*{\s*background:[^;]+;\s*}/,
  `.light ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #D1A3A4, #C5A059);
}`
);

// 10: Button Shimmer Gold for Light Mode
const shimmerTarget = `.btn-shimmer-gold {
  background: linear-gradient(
    90deg,
    #f59e0b 0%, #fbbf24 30%, #fde68a 50%, #f59e0b 70%, #d97706 100%
  );
  background-size: 200% auto;
  animation: shimmer-gold 3s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`;

const lightShimmer = `
.light .btn-shimmer-gold {
  background: linear-gradient(
    90deg,
    #9c7b3c 0%, #c5a059 30%, #e5e4e2 50%, #c5a059 70%, #9c7b3c 100%
  );
  background-size: 200% auto;
  animation: shimmer-gold 3s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`;

if (css.includes(shimmerTarget) && !css.includes('.light .btn-shimmer-gold')) {
  css = css.replace(shimmerTarget, shimmerTarget + "\\n" + lightShimmer);
}

fs.writeFileSync(cssPath, css);
console.log("Light mode luxury updates applied.");

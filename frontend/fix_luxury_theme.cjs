const fs = require('fs');
const path = require('path');

const timelinePath = path.join(__dirname, 'src', 'components', 'AcademicTimeline.tsx');
const skillsPath = path.join(__dirname, 'src', 'components', 'SkillsVisualization.tsx');

let timeline = fs.readFileSync(timelinePath, 'utf8');

// Inject variables into TIMELINE_CSS
const timelineVars = `
  :root, .dark {
    --lux-surface-rgb: 8, 8, 14;
    --lux-card-bg: rgba(10, 10, 16, 0.6);
    --lux-text-muted: rgba(232, 232, 232, 0.55);
    --lux-text-soft: rgba(232, 232, 232, 0.4);
    --lux-text-strong: rgba(232, 232, 232, 0.8);
  }
  .light {
    --lux-surface-rgb: 252, 252, 254;
    --lux-card-bg: rgba(255, 255, 255, 0.75);
    --lux-text-muted: rgba(60, 60, 80, 0.7);
    --lux-text-soft: rgba(60, 60, 80, 0.6);
    --lux-text-strong: rgba(15, 15, 26, 0.9);
  }
`;

timeline = timeline.replace('const TIMELINE_CSS = `', 'const TIMELINE_CSS = `' + timelineVars);

// Replace hardcoded colors in Timeline
timeline = timeline.replace(/rgba\(8,8,14,0\.96\)/g, 'rgba(var(--lux-surface-rgb), 0.96)');
timeline = timeline.replace(/rgba\(8,8,14,0\.95\)/g, 'rgba(var(--lux-surface-rgb), 0.95)');
timeline = timeline.replace(/rgba\(10,10,16,0\.6\)/g, 'var(--lux-card-bg)');
timeline = timeline.replace(/rgba\(232,232,232,0\.55\)/g, 'var(--lux-text-muted)');
timeline = timeline.replace(/rgba\(232,232,232,0\.4\)/g, 'var(--lux-text-soft)');
timeline = timeline.replace(/rgba\(232,232,232,0\.45\)/g, 'var(--lux-text-soft)');
timeline = timeline.replace(/rgba\(232,232,232,0\.35\)/g, 'var(--lux-text-soft)');
timeline = timeline.replace(/rgba\(232,232,232,0\.8\)/g, 'var(--lux-text-strong)');
timeline = timeline.replace(/rgba\(232,232,232,0\.15\)/g, 'rgba(var(--text-base-rgb), 0.15)');

fs.writeFileSync(timelinePath, timeline);

let skills = fs.readFileSync(skillsPath, 'utf8');

const skillsVars = `
  :root, .dark {
    --lux-surface-rgb: 10, 5, 25;
    --lux-surface-alt: 6, 4, 14;
    --lux-card-bg: rgba(10, 10, 16, 0.6);
    --lux-text-muted: rgba(232, 232, 232, 0.32);
    --lux-text-soft: rgba(232, 232, 232, 0.25);
    --lux-text-strong: rgba(232, 232, 232, 0.85);
  }
  .light {
    --lux-surface-rgb: 252, 252, 254;
    --lux-surface-alt: 245, 245, 250;
    --lux-card-bg: rgba(255, 255, 255, 0.75);
    --lux-text-muted: rgba(60, 60, 80, 0.6);
    --lux-text-soft: rgba(60, 60, 80, 0.5);
    --lux-text-strong: rgba(15, 15, 26, 0.9);
  }
`;

skills = skills.replace('const CSS = `', 'const CSS = `' + skillsVars);

// Replace hardcoded colors in Skills
skills = skills.replace(/rgba\(10,5,20,0\.96\)/g, 'rgba(var(--lux-surface-rgb), 0.96)');
skills = skills.replace(/rgba\(6,4,14,0\.98\)/g, 'rgba(var(--lux-surface-alt), 0.98)');
skills = skills.replace(/rgba\(10,5,25,0\.95\)/g, 'rgba(var(--lux-surface-rgb), 0.95)');
skills = skills.replace(/#1a1020/g, 'var(--surface-3)');
skills = skills.replace(/#080812/g, 'var(--surface)');
skills = skills.replace(/rgba\(232,232,232,0\.35\)/g, 'var(--lux-text-muted)');
skills = skills.replace(/rgba\(232,232,232,0\.32\)/g, 'var(--lux-text-muted)');
skills = skills.replace(/rgba\(232,232,232,0\.25\)/g, 'var(--lux-text-soft)');
skills = skills.replace(/rgba\(232,232,232,0\.3\)/g, 'var(--lux-text-soft)');
skills = skills.replace(/rgba\(232,232,232,0\.85\)/g, 'var(--lux-text-strong)');
skills = skills.replace(/rgba\(232,232,232,0\.8\)/g, 'var(--lux-text-strong)');
skills = skills.replace(/rgba\(232,232,232,0\.38\)/g, 'var(--lux-text-muted)');

fs.writeFileSync(skillsPath, skills);

console.log('Fixed luxury theme files');

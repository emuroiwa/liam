const fs = require('fs');
const glob = require('glob'); // we don't have glob, let's use standard fs recursion

const files = [
  'app/page.tsx',
  'components/tabs/PointsTab.tsx',
  'components/tabs/RulesTab.tsx',
  'components/tabs/RewardsTab.tsx',
  'components/tabs/BoredomBusterTab.tsx',
  'app/globals.css'
];

const replacements = {
  'bg-gray-50': 'bg-gray-50 dark:bg-gray-900',
  'text-gray-900': 'text-gray-900 dark:text-gray-100',
  'text-gray-800': 'text-gray-800 dark:text-gray-200',
  'text-gray-700': 'text-gray-700 dark:text-gray-300',
  'text-gray-600': 'text-gray-600 dark:text-gray-400',
  'text-gray-500': 'text-gray-500 dark:text-gray-400',
  'text-gray-400': 'text-gray-400 dark:text-gray-500',
  'border-gray-50': 'border-gray-50 dark:border-gray-800',
  'border-gray-100': 'border-gray-100 dark:border-gray-800',
  'border-gray-200': 'border-gray-200 dark:border-gray-700',
  'border-gray-300': 'border-gray-300 dark:border-gray-600',
  'bg-gray-100': 'bg-gray-100 dark:bg-gray-800',
  'bg-white': 'bg-white dark:bg-gray-800',
  
  // Specific colors in RulesTab & others
  'text-purple-900': 'text-purple-900 dark:text-purple-200',
  'bg-purple-50': 'bg-purple-50 dark:bg-purple-900/30',
  
  'bg-amber-50': 'bg-amber-50 dark:bg-amber-900/30',
  'text-amber-800': 'text-amber-800 dark:text-amber-200',
  
  'bg-slate-50': 'bg-slate-50 dark:bg-slate-800/50',
  'text-slate-700': 'text-slate-700 dark:text-slate-300',
  
  'bg-red-50 ': 'bg-red-50 dark:bg-red-900/30 ',
  'bg-red-50/50': 'bg-red-50/50 dark:bg-red-900/20',
  'text-red-700': 'text-red-700 dark:text-red-300',
  
  'border-green-100': 'border-green-100 dark:border-green-900',
  'border-green-200': 'border-green-200 dark:border-green-800',
  'bg-green-50/50': 'bg-green-50/50 dark:bg-green-900/20',
  
  'bg-blue-50': 'bg-blue-50 dark:bg-blue-900/30',
  'text-blue-900': 'text-blue-900 dark:text-blue-200',
  'border-blue-200': 'border-blue-200 dark:border-blue-800',
  
  'border-orange-200': 'border-orange-200 dark:border-orange-800',
  'bg-orange-50': 'bg-orange-50 dark:bg-orange-900/30',
  'text-orange-600': 'text-orange-600 dark:text-orange-300',
  
  'border-purple-200': 'border-purple-200 dark:border-purple-800',
};

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // First avoid double replacements if run multiple times
    for (let key in replacements) {
      if (!replacements[key].includes(key)) continue; // safeguard
    }
    
    // Replace all keys with values
    for (let key in replacements) {
       // use regex with word boundary to avoid bg-gray-500 matching bg-gray-50
       // but watch out for /50 and other characters.
       const regex = new RegExp(key.replace(/[/.]/g, '\\$&') + '(?![\\w-])', 'g');
       content = content.replace(regex, replacements[key]);
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

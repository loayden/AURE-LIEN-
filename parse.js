const fs = require('fs');
const parser = require('@babel/parser');
const code = fs.readFileSync('app/account/page.tsx', 'utf-8');
try {
  parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  print("No syntax error found by Babel.");
} catch (e) {
  console.log(e.message, e.loc);
  const lines = code.split('\n');
  const line = e.loc.line - 1;
  console.log("Context:");
  for(let i = Math.max(0, line - 5); i <= Math.min(lines.length - 1, line + 5); i++) {
    console.log(`${i+1}: ${lines[i]}`);
  }
}

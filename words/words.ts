import fs from 'fs';

const data = fs.readFileSync('words/data.txt', 'utf8');
const output: string[] = [];

for (const item of data.split(/\n/)) {
  output.push(item.trim().toLowerCase());
}

fs.writeFileSync('words/output.txt', output.toString());

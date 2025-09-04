const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../dist/server.js');
const dest = path.join(__dirname, '../dist/server.cjs');

console.log('Source:', src);
console.log('Destination:', dest);

if (!fs.existsSync(src)) {
  console.error('Source file does not exist:', src);
  process.exit(1);
}

fs.rename(src, dest, (err) => {
  if (err) {
    console.error('Rename failed:', err);
    process.exit(1);
  } else {
    console.log('Rename successful!');
  }
});
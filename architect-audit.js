const fs = require('fs');
const path = require('path');

const mapDirectory = (dir) => {
  if (!fs.existsSync(dir)) return null;
  const stats = fs.statSync(dir);
  if (!stats.isDirectory()) return null;

  const result = { name: path.basename(dir), type: 'directory', children: [] };
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const child = mapDirectory(fullPath);
      if (child) result.children.push(child);
    } else {
      result.children.push({ name: file, type: 'file' });
    }
  });
  return result;
};

const map = mapDirectory('./src');
fs.writeFileSync('.architect/map.json', JSON.stringify(map, null, 2));
console.log('Architect Audit Complete: .architect/map.json generated.');

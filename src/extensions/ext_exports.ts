import path from 'path';
import fs from 'fs/promises';

const filepath = path.resolve('./src/extensions/icon.svg');
const svgContent = async () => await fs.readFile(filepath, 'utf-8');
export const icon = svgContent().toString();

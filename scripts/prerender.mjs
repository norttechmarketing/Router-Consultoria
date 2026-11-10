import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '../.router-ssr/src.js';

const path = new URL('../dist/index.html', import.meta.url);
const template = await readFile(path, 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error('Elemento raiz ausente.');
await writeFile(path, template.replace(marker, () => '<div id="root">' + renderToString(createElement(App)) + '</div>'));

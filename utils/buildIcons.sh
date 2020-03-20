#!/usr/bin/env node

/**
 * Create Icons example
 */

var fs = require('fs');

var xargs = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function()
{
  var chunk = process.stdin.read();

  if (chunk !== null)
  {
    xargs += chunk;
  }
});

process.stdin.on('end', function()
{
  const lines = xargs.split("\n");

  const imports = ["import React from 'react';"];
  const childs = [];

  lines.forEach((line) =>
  {
    if ((m = /(.*)\.jsx$/.exec(line)) !== null)
    {
      const child = m[1]
        .split('/')
        .map(path => path.charAt(0).toUpperCase() + path.slice(1))
        .join('')
        .replace(/[^a-z]/i, '');

      imports.push(`import ${child} from '../../../${m[1]}';`);
      childs.push(`
        <div className="col-1-5">
        <${child} className="w-6 h-6" />
          <div className="mt-1 text-gray text-xs">${m[1].replace('src/icon/', '')}</div>
        </div>
      `);
    }
  });

  const jsxContent = `
    ${imports.join("\n")}

    const Example = () =>
    (
      <div className="grid-4-4 text-center">
        ${childs.join("\n")}
      </div>
    );

    export default Example;
  `;

  const collectionName = lines[0].split("/")[2];

  fs.writeFileSync(`./examples/src/icon/${collectionName}.jsx`, jsxContent);
});

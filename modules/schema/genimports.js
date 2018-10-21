/* eslint no-console: off */
/* eslint-env node, browser */

// This program populates the schema data.js which includes the full JSON
// schema content

const path = require('path');
const walk = require('walk');
const fs = require('fs');

const OUTPUT_PATH = 'src/data.js';

function main() {
  const schemaDir = path.resolve(__dirname);

  const schemaMap = loadAllSchemas(schemaDir);

  const outputPath = path.join(schemaDir, OUTPUT_PATH);

  dumpSchemas(schemaMap, outputPath);
}

function loadAllSchemas(schemaDir) {
  const schemaMap = {};
  const schemaOptions = {
    listeners: {
      file(fpath, stat, next) {
        if (stat.name.endsWith('.schema.json')) {
          // Build the path to the matching schema
          const fullPath = path.join(fpath, stat.name);
          const relPath = path.relative(schemaDir, fullPath);

          try {
            const cleanedPath = relPath
              .replace(/\//g, '_')
              .replace(/\./g, '_')
              .replace(/-/g, '_')
              .replace(/__/g, '_');
            const identifier = snakeToCamel(cleanedPath);
            schemaMap[identifier] = {
              relPath,
              data: loadSchema(fullPath)
            };
          } catch (e) {
            console.log(`Error loading schema: ${relPath} ${e}`);
          }
        }
        next();
      }
    }
  };

  walk.walkSync(schemaDir, schemaOptions);

  return schemaMap;
}

function dumpSchemas(schemaMap, outputPath) {
  const keys = Object.keys(schemaMap).sort();

  let contents = '// DO NOT EDIT - run "node genimports.js" to remake\n\n';

  for (const key of keys) {
    const item = schemaMap[key];
    contents += `import ${key} from '../${item.relPath}';\n`;
  }

  contents += '\nexport const SCHEMA_DATA = {\n';
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const item = schemaMap[key];

    let trailer = ',';
    if (index === keys.length - 1) {
      trailer = '';
    }

    contents += `  '${item.relPath}': ${key}${trailer}\n`;
  }
  contents += '};\n';

  fs.writeFileSync(outputPath, contents);
}

function loadSchema(schemaPath) {
  let schema = {};
  try {
    const schemaContents = fs.readFileSync(schemaPath);

    schema = JSON.parse(schemaContents);
  } catch (e) {
    throw new Error(`Error parsing: ${schemaPath} ${e}`);
  }

  return schema;
}

function snakeToCamel(s) {
  return s.replace(/(\_\w)/g, m => m[1].toUpperCase());
}

// Invoke
main();

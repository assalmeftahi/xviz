/* eslint no-console: off */
/* eslint-env node, browser */

import * as path from 'path';
import * as walk from 'walk';
import * as fs from 'fs';

import {parse as jsonlintParse} from 'jsonlint';

import {newAjv} from './validator';

export function validateExampleFiles(schemaDir, examplesDir) {
  const validator = newAjv();

  let valid = loadAllSchemas(validator, schemaDir);

  if (valid) {
    valid = validateFiles(validator, examplesDir, true);
  }

  return valid;
}

export function validateInvalidFiles(schemaDir, invalidDir) {
  const validator = newAjv();

  let valid = loadAllSchemas(validator, schemaDir);

  if (valid) {
    valid = validateFiles(validator, invalidDir, false);
  }

  return valid;
}

export function loadValidator(schemaDir) {
  const validator = newAjv();

  const valid = loadAllSchemas(validator, schemaDir);

  if (!valid) {
    const error = `Could not load all schemas from: ${schemaDir}`;
    throw error;
  }

  return validator;
}

class ParseError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ParseError);
  }
}

function loadAllSchemas(validator, schemaDir) {
  let valid = true;
  const schemaOptions = {
    listeners: {
      file(fpath, stat, next) {
        if (stat.name.endsWith('.schema.json')) {
          // Build the path to the matching schema
          const fullPath = path.join(fpath, stat.name);
          const relPath = path.relative(schemaDir, fullPath);

          try {
            loadSchema(validator, schemaDir, relPath);
          } catch (e) {
            if (e instanceof ParseError) {
              valid = false;
              console.log(`${e.message}`);
            } else {
              console.log(`${fullPath}:0: error loading ${e.message}`);
              valid = false;
            }
          }
        }
        next();
      }
    }
  };

  walk.walkSync(schemaDir, schemaOptions);

  return valid;
}

function loadSchema(validator, schemaDir, relativePath) {
  // Load the Schema
  const schemaPath = path.join(schemaDir, relativePath);

  console.log(`Load: ${relativePath}`);

  const schema = parseJSONFile(schemaPath);

  validator.addSchema(schema, relativePath);
}

function validateFiles(validator, examplesDir, expectGood) {
  let valid = true;
  const options = {
    listeners: {
      file(fpath, stat, next) {
        if (!stat.name.endsWith('~')) {
          // Build the path to the matching schema
          const examplePath = path.join(fpath, stat.name);
          try {
            valid = valid & validateFile(validator, examplesDir, examplePath, expectGood);
          } catch (e) {
            if (e instanceof ParseError) {
              valid = false;
              console.log(`${e.message}`);
            } else {
              console.log(`${examplePath}:0: error validating: ${e.message}`);
              valid = false;
            }
          }
        }
        next();
      }
    }
  };

  walk.walkSync(examplesDir, options);

  return valid;
}

// eslint-disable-next-line max-statements
function validateFile(validator, examplesDir, examplePath, expectGood) {
  const exampleRelPath = path.relative(examplesDir, examplePath);
  let schemaRelPath = exampleRelPath.replace('.json', '.schema.json');

  // Load the JSON to validate
  const data = parseJSONFile(examplePath);

  // Lookup the schema and validate
  // Lets see if we in a schema directory instead
  const directorySchema = `${path.dirname(exampleRelPath)}.schema.json`;
  let validate = validator.getSchema(directorySchema);

  if (validate === undefined) {
    validate = validator.getSchema(schemaRelPath);
  } else {
    schemaRelPath = directorySchema;
  }

  if (validate === undefined) {
    console.log(
      `ERROR: While checking: ${examplePath}, failed to load: ${schemaRelPath} and: ${directorySchema}`
    );
    return false;
  }

  const valid = validate(data);

  if (expectGood) {
    if (!valid) {
      console.log(`Schema: ${schemaRelPath}`);
      console.log(`${examplePath}:0: failed to validate`);
      console.log(validate.errors);
    } else {
      console.log(`Pass: ${examplePath}`);
    }

    return valid;
  }

  // expectGood == false
  if (valid) {
    console.log(`Schema: ${schemaRelPath}`);
    console.log(`${examplePath}:0: validated when it should not have`);
  } else {
    console.log(`Pass: ${examplePath}`);
  }
  return !valid;
}

export function parseJSONFile(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');

  let data;
  try {
    data = JSON.parse(contents);
  } catch (e) {
    try {
      jsonlintParse(contents);
    } catch (egood) {
      // Ugly hack to get the line number out of the jsonlint error
      const lineRegex = /line ([0-9]+)/g;
      const results = lineRegex.exec(egood.message);
      let line = 0;
      if (results !== null) {
        line = parseInt(results[1], 10);
      }

      // Return the best error we can
      throw new ParseError(`${filePath}:${line}: ${egood}`);
    }
  }

  return data;
}

// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {XVIZValidator} from '@xviz/schema';
import test from 'tape-catch';
import path from 'path';

import {loadJSON} from '../../../modules/schema/scripts/parse-json';
import EXAMPLES from './examples.json';

test('validateXVIZExamples', t => {
  // Do it by directory path first
  const schemaDir = path.join(__dirname, '..', '..', '..', 'modules', 'schema');

  const examplesDir = path.join(schemaDir, 'examples');
  const invalidDir = path.join(schemaDir, 'invalid');

  validateFiles(examplesDir, EXAMPLES.examples, t.doesNotThrow)
    .then(() => {
      validateFiles(invalidDir, EXAMPLES.invalid, t.throws);
    })
    .then(t.end);
});

function validateFiles(dir, filePaths, assert) {
  const validator = new XVIZValidator();

  filePaths = filePaths.map(filePath => path.join(dir, filePath));

  return Promise.all(filePaths.map(loadJSON)).then(jsons => {
    let index = 0;
    for (const data of jsons) {
      const relPath = path.relative(dir, filePaths[index]);
      const schemaPath = path.dirname(relPath);

      assert(() => validator.validate(schemaPath, data), relPath);
      index++;
    }
  });
}

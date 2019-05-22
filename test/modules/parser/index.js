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

// Set up a configuration (TODO/OSS - this should be a neutral config)
import './config/xviz-config.spec';

import './synchronizers/log-synchronizer.spec';
import './synchronizers/stream-synchronizer.spec';
import './synchronizers/xviz-stream-buffer.spec';

import './parsers/filter-vertices.spec';
import './parsers/parse-log-metadata.spec';
import './parsers/parse-xviz-message-sync.spec';
import './parsers/parse-xviz-message.spec';
import './parsers/parse-vehicle-pose.spec';
import './parsers/parse-xviz-pose.spec';
import './parsers/parse-xviz-stream.spec';
import './parsers/serialize.spec';
import './parsers/xviz-v2-common.spec';

import './styles/xviz-style-property.spec';
import './styles/xviz-style-parser.spec';

import './objects/base-object.spec';
import './objects/sdv.spec';
import './objects/xviz-object.spec';
import './objects/xviz-object-collection.spec';

import './utils/worker-utils.spec';
import './utils/search.spec';

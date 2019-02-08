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

/* eslint-disable camelcase */
import Color from 'color';
import log from '../utils/log';

/* Utils for type check */
function getColor(value) {
  if (typeof value === 'string') {
    try {
      const color = Color.rgb(value).array();
      if (Number.isFinite(color[3])) {
        color[3] *= 255;
      }
      return color;
    } catch (error) {
      return null;
    }
  }
  if (Array.isArray(value) && Number.isFinite(value[0])) {
    return value;
  }
  return null;
}

function getNumber(value) {
  switch (typeof value) {
    case 'string':
      value = Number(value);
      return isNaN(value) ? null : value;

    case 'number':
      return value;

    default:
      return null;
  }
}

function getBool(value) {
  switch (typeof value) {
    case 'boolean':
      return value;

    case 'string':
      return value.toLowerCase() !== 'false';

    case 'number':
      return Boolean(value);

    default:
      return null;
  }
}

const IDENTITY = x => x;
const PROPERTY_FORMATTERS = {
  opacity: getNumber,

  stroked: getBool,
  filled: getBool,
  extruded: getBool,
  wireframe: getBool,
  height: getNumber,

  stroke_color: getColor,
  fill_color: getColor,

  size: getNumber,
  angle: getNumber,
  text_anchor: String,
  alignment_baseline: String,

  radius: getNumber,
  radius_min_pixels: getNumber,
  radius_max_pixels: getNumber,

  stroke_width: getNumber,
  stroke_width_min_pixels: getNumber,
  stroke_width_max_pixels: getNumber
};

const DEFAULT_STYLES = {
  opacity: 1,

  stroked: true,
  filled: true,
  extruded: false,
  wireframe: false,
  height: 0,

  stroke_color: [255, 255, 255],
  fill_color: [255, 255, 255],

  size: 12,
  angle: 0,
  text_anchor: 'middle',
  alignment_baseline: 'center',

  radius: 1,
  radius_min_pixels: 0,
  radius_max_pixels: Number.MAX_SAFE_INTEGER,

  stroke_width: 0.1,
  stroke_width_min_pixels: 0,
  stroke_width_max_pixels: Number.MAX_SAFE_INTEGER
};

export default class XVIZStyleProperty {
  static getDefault(key) {
    return DEFAULT_STYLES[key];
  }

  static formatValue(key, value) {
    const formatter = PROPERTY_FORMATTERS[key] || IDENTITY;
    return formatter(value);
  }

  constructor(key, value) {
    this.key = key;

    const formatter = PROPERTY_FORMATTERS[key] || IDENTITY;
    this._value = formatter(value);

    if (this._value === null && Array.isArray(value)) {
      if (value.length > 1) {
        this._value = value.map(formatter);
        this._valueCount = value.length;
      } else {
        this._value = formatter(value[0]);
      }
    }
    if (this._value === null) {
      log.error(`illegal ${key} value: ${value}`);
    }
  }

  getValue(context) {
    if (this._valueCount) {
      const index = (context.index || 0) % this._valueCount;
      return this._value[index];
    }
    return this._value;
  }
}

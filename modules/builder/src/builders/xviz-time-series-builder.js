import {CATEGORY} from './constant';
import XVIZBaseBuilder from './xviz-base-builder';

/**
 * XVIZTimeSeriesBuilder manages time_series data by `time` and `id` and stores
 * the the array of single stream value entries.
 *
 * This is the shape returned from getData()
 *
 * [
 *   {
 *     timestamp: x,
 *     values: [
 *       ['a', 1]
 *       ['b', 2]
 *     ],
 *     object_id: '123'
 *   },
 *   {
 *     timestamp: y,
 *     values: [
 *       ['a', 1]
 *       ['b', 4]
 *     ]
 *   }
 * ]
 */
export default class XVIZTimeSeriesBuilder extends XVIZBaseBuilder {
  constructor(props) {
    super({
      ...props,
      category: CATEGORY.time_series
    });

    // Stores time_series data by timestamp then id
    // They will then be group when constructing final object
    this._data = new Map();

    // inflight builder data
    this._id = null;
    this._value = null;
    this._timestamp = null;
  }

  id(identifier) {
    this.validatePropSetOnce('_id');
    this._id = identifier;
    return this;
  }

  value(value) {
    this.validatePropSetOnce('_value');

    if (value instanceof Array) {
      this.validateError('Input `value` must be single value');
    }

    this._value = value;
    return this;
  }

  timestamp(timestamp) {
    this.validatePropSetOnce('_timestamp');

    if (timestamp instanceof Array) {
      this.validateError('Input `timestamp` must be a single value');
    }

    this._timestamp = timestamp;
    return this;
  }

  getData() {
    this._flush();
    if (this._data.size === 0) {
      return null;
    }

    const timeSeriesData = [];
    for (const [timestamp, ids] of this._data) {
      for (const [id, values] of ids) {
        const entry = {
          timestamp,
          values
        };

        if (id !== null) {
          entry.object_id = id; // eslint-disable-line camelcase
        }

        timeSeriesData.push(entry);
      }
    }

    return timeSeriesData;
  }

  // Lookup by timestamp, then id to store [streamId, value]
  _addTimestampEntry() {
    if (!this._dataPending()) {
      return;
    }

    const entry = [this._streamId, this._value];

    const tsEntry = this._data.get(this._timestamp);
    if (tsEntry) {
      // We have timestamp, now get id
      const idEntry = tsEntry.get(this._id);
      if (idEntry) {
        // append entry to existing array
        idEntry.push(entry);
      } else {
        // create new mapping of id -> array of entries
        tsEntry.set(this._id, [entry]);
      }
    } else {
      // No timestamp entry
      // create new id -> arrry of entries
      const idEntry = new Map();
      idEntry.set(this._id, [entry]);
      // create timestamp entry
      this._data.set(this._timestamp, idEntry);
    }
  }

  _dataPending() {
    return this._value !== null || this._timestamp !== null || this._id !== null;
  }

  _validate() {
    if (this._dataPending()) {
      super._validate();

      if (this._value === null) {
        this.validateWarn(`Stream ${this._streamId} value is not provided.`);
      }
      if (this._timestamp === null) {
        this.validateWarn(`Stream ${this._streamId} timestamp is not provided.`);
      }
    }
  }

  _flush() {
    this._validate();

    this._addTimestampEntry();
    this._reset();
  }

  // reset the inflight values
  _reset() {
    this._id = null;
    this._value = null;
    this._timestamp = null;
  }
}

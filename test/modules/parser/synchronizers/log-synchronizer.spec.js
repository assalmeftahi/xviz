import {LogSynchronizer, setXVIZSettings} from '@xviz/parser';
import tape from 'tape-catch';

import {resetXVIZConfigAndSettings} from '../config/config-utils';

// xviz data uses snake_case
/* eslint-disable camelcase */

const LOGS = {
  log1: [
    {attributes: {transmission_time: 100}, value: 1},
    {attributes: {transmission_time: 101}},
    {attributes: {transmission_time: 200}, value: 2},
    {attributes: {transmission_time: 300}, value: 3}
  ],
  log2: [
    {time: 50, value: 10},
    {time: 100, value: 20},
    {time: 101},
    {time: 250, value: 30},
    {time: 300.1, value: 40}
  ]
};

// Same as other log synchronizer test, keep in sync
const TEST_CASES = [
  {time: 0}, // out of range too early
  {time: 100, log1: 1, log2: 20}, // both in range
  {time: 102, log1: 'empty_entry', log2: 'empty_entry'}, // empty entry
  {time: 200, log1: 2}, // one in range
  {time: 3000}, // out of range too late
  {time: -1000}, // out of range way too early
  {time: 0}, // re-check
  {time: 300.1, log1: 3, log2: 40} // both in time window
];

tape('LogSynchronizer#constructor', t => {
  const logSynchronizer = new LogSynchronizer(LOGS);
  t.ok(logSynchronizer instanceof LogSynchronizer, 'Constructed');
  t.end();
});

tape('LogSynchronizer#setTime', t => {
  const logSynchronizer = new LogSynchronizer(LOGS);
  logSynchronizer.setTime(10);
  t.equals(logSynchronizer.getTime(), 10, 'Set and retrieved time');
  t.end();
});

tape('LogSynchronizer#getData', t => {
  resetXVIZConfigAndSettings();
  setXVIZSettings({TIME_WINDOW: 3});
  const logSynchronizer = new LogSynchronizer(LOGS);

  for (const tc of TEST_CASES) {
    const {time, log1, log2} = tc;
    logSynchronizer.setTime(time);
    const data = logSynchronizer.getLogSlice();
    t.comment(`Set time to ${time}`);
    if (log1) {
      if (log1 === 'empty_entry') {
        t.equals(data.streams.log1.value, undefined, 'Got correct empty entry for log1');
      } else {
        t.equals(data.streams.log1.value, log1, 'Got correct log1 value');
      }
    } else {
      t.equals(data.streams.log1, undefined, 'Got undefined log1 value');
    }

    if (log2) {
      if (log2 === 'empty_entry') {
        t.equals(data.streams.log2.value, undefined, 'Got correct empty entry for log2');
      } else {
        t.equals(data.streams.log2.value, log2, 'Got correct log2 value');
      }
    } else {
      t.equals(data.streams.log2, undefined, 'Got undefined log2 value');
    }
  }

  t.end();
});

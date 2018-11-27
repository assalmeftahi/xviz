import test from 'tape-catch';
import {insertTimestamp} from '@xviz/builder/utils';

test('insertTimestamps#insert new entry', t => {
  const timestamps = [1, 2, 5];
  const values = [
    {
      points: [
        {
          points: [1, 2, 3]
        }
      ]
    },
    {
      points: [
        {
          points: [4, 5, 6]
        }
      ]
    },
    {
      points: [
        {
          points: [7, 8, 9]
        }
      ]
    }
  ];

  const ts = 3;
  const value = {
    points: [10, 11, 12]
  };

  const expectedValues = [...values];
  expectedValues.splice(2, 0, {points: [value]});

  insertTimestamp(timestamps, values, ts, 'points', value);

  t.deepEqual(timestamps, [1, 2, 3, 5], 'timestamps match expected output');
  t.deepEqual(values, expectedValues, 'timestamps match expected output');
  t.end();
});

test('insertTimestamps#insert new entry at beginning', t => {
  const timestamps = [2, 3, 5];
  const values = [
    {
      points: [
        {
          points: [1, 2, 3]
        }
      ]
    },
    {
      points: [
        {
          points: [4, 5, 6]
        }
      ]
    },
    {
      points: [
        {
          points: [7, 8, 9]
        }
      ]
    }
  ];

  const ts = 1;
  const value = {
    points: [10, 11, 12]
  };

  const expectedValues = [{points: [value]}, ...values];

  insertTimestamp(timestamps, values, ts, 'points', value);

  t.deepEqual(timestamps, [1, 2, 3, 5], 'timestamps match expected output');
  t.deepEqual(values, expectedValues, 'timestamps match expected output');
  t.end();
});

test('insertTimestamps#insert new entry at end', t => {
  const timestamps = [1, 2, 3];
  const values = [
    {
      points: [
        {
          points: [1, 2, 3]
        }
      ]
    },
    {
      points: [
        {
          points: [4, 5, 6]
        }
      ]
    },
    {
      points: [
        {
          points: [7, 8, 9]
        }
      ]
    }
  ];

  const ts = 5;
  const value = {
    points: [10, 11, 12]
  };

  const expectedValues = [...values, {points: [value]}];

  insertTimestamp(timestamps, values, ts, 'points', value);

  t.deepEqual(timestamps, [1, 2, 3, 5], 'timestamps match expected output');
  t.deepEqual(values, expectedValues, 'timestamps match expected output');
  t.end();
});

test('insertTimestamps#append existing entry', t => {
  const timestamps = [1, 2, 5];
  const values = [
    {
      points: [
        {
          points: [1, 2, 3]
        }
      ]
    },
    {
      points: [
        {
          points: [4, 5, 6]
        }
      ]
    },
    {
      points: [
        {
          points: [7, 8, 9]
        }
      ]
    }
  ];

  const ts = 2;
  const value = {
    points: [10, 11, 12]
  };

  // Deep copy input
  const expectedValues = JSON.parse(JSON.stringify(values));
  expectedValues[1].points.push(value);

  insertTimestamp(timestamps, values, ts, 'points', value);

  t.deepEqual(timestamps, [1, 2, 5], 'timestamps match expected output');
  t.deepEqual(values, expectedValues, 'timestamps match expected output');
  t.end();
});

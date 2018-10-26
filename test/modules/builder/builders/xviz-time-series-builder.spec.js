/* eslint-disable camelcase */
import test from 'tape-catch';
import XVIZTimeSeriesBuilder from '@xviz/builder/builders/xviz-time-series-builder';
import {default as XVIZBuilderValidator} from '@xviz/builder/builders/xviz-validator';
import {XVIZValidator} from '@xviz/schema';

const schemaValidator = new XVIZValidator();

const validator = new XVIZBuilderValidator({
  validateWarn: msg => {
    throw new Error(msg);
  },
  validateError: msg => {
    throw new Error(msg);
  }
});

test('XVIZTimeSeriesBuilder#default-ctor', t => {
  /* eslint-disable no-unused-vars */
  const builder = new XVIZTimeSeriesBuilder({});
  t.end();
  /* eslint-enable no-unused-vars */
});

test('XVIZTimeSeriesBuilder#null getData', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  const data = builder.stream('/test').getData();

  t.equal(data, null, 'XVIZTimeSeriesBuilder returns null if no data');
  t.end();
});

test('XVIZTimeSeriesBuilder#single entry', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  builder
    .stream('/test')
    .timestamp(20)
    .value(1);

  const expected = [
    {
      timestamp: 20,
      streams: ['/test'],
      values: {doubles: [1]}
    }
  ];
  const data = builder.getData();

  t.deepEqual(data, expected, 'XVIZTimeSeriesBuilder single entry matches expected output');
  data.forEach(d => schemaValidator.validate('core/timeseries_state', d));
  t.end();
});

test('XVIZTimeSeriesBuilder#multiple entry same ts', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  builder
    .stream('/test')
    .timestamp(20)
    .value(1);

  builder
    .stream('/foo')
    .timestamp(20)
    .value(2);

  const expected = [
    {
      timestamp: 20,
      streams: ['/test', '/foo'],
      values: {
        doubles: [1, 2]
      }
    }
  ];
  const data = builder.getData();

  t.deepEqual(
    data,
    expected,
    'XVIZTimeSeriesBuilder multiple entry same ts matches expected output'
  );
  data.forEach(d => schemaValidator.validate('core/timeseries_state', d));
  t.end();
});

test('XVIZTimeSeriesBuilder#multiple entry different ts', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  builder
    .stream('/test')
    .timestamp(20)
    .value(1);

  builder
    .stream('/foo')
    .timestamp(30)
    .value(2);

  builder
    .stream('/bar')
    .timestamp(20)
    .value(3);

  const expected = [
    {
      timestamp: 20,
      streams: ['/test', '/bar'],
      values: {
        doubles: [1, 3]
      }
    },
    {
      timestamp: 30,
      streams: ['/foo'],
      values: {
        doubles: [2]
      }
    }
  ];
  const data = builder.getData();

  t.deepEqual(
    data,
    expected,
    'XVIZTimeSeriesBuilder multiple entry different ts matches expected output'
  );
  data.forEach(d => schemaValidator.validate('core/timeseries_state', d));
  t.end();
});

test('XVIZTimeSeriesBuilder#all types with id', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  builder
    .stream('/int')
    .timestamp(20)
    .value(1)
    .id('1');

  builder
    .stream('/string')
    .timestamp(20)
    .value('good')
    .id('2');

  builder
    .stream('/number')
    .timestamp(20)
    .value(100.1)
    .id('3');

  builder
    .stream('/bool')
    .timestamp(20)
    .value(false)
    .id('4');

  const expected = [
    {
      timestamp: 20,
      object_id: '1',
      streams: ['/int'],
      values: {
        // TODO: figure out to support ints the first, a user could
        // supply 1, then 1.5, and that would be double.
        doubles: [1]
      }
    },
    {
      timestamp: 20,
      object_id: '2',
      streams: ['/string'],
      values: {
        strings: ['good']
      }
    },
    {
      timestamp: 20,
      object_id: '3',
      streams: ['/number'],
      values: {
        doubles: [100.1]
      }
    },
    {
      timestamp: 20,
      object_id: '4',
      streams: ['/bool'],
      values: {
        bools: [false]
      }
    }
  ];
  const data = builder.getData();

  t.deepEqual(
    data,
    expected,
    'XVIZTimeSeriesBuilder multiple entry different ts matches expected output'
  );
  data.forEach(d => schemaValidator.validate('core/timeseries_state', d));
  t.end();
});

test('XVIZTimeSeriesBuilder#throwing cases', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});

  t.throws(
    () => builder.value('1').getData(),
    /is missing/,
    'XVIZTimeSeriesBuilder throws when streamId is not provided'
  );
  builder._reset();

  builder.stream('/test');

  t.throws(
    () => builder.id('1').id('2'),
    /already set/,
    'XVIZTimeSeriesBuilder throw when trying to set id multiple times'
  );
  builder._reset();

  t.throws(
    () => builder.timestamp(1).timestamp(1),
    /already set/,
    'XVIZTimeSeriesBuilder throw when trying to set timestamp multiple times'
  );
  builder._reset();

  t.throws(
    () => builder.value('1').value('2'),
    /already set/,
    'XVIZTimeSeriesBuilder throw when trying to set value multiple times'
  );
  builder._reset();

  t.throws(
    () => builder.timestamp(['1']),
    /single value/,
    'XVIZTimeSeriesBuilder throws when passing an array to timestamp()'
  );
  builder._reset();

  t.throws(
    () => builder.value(['1']),
    /single value/,
    'XVIZTimeSeriesBuilder throws when passing an array to value()'
  );
  builder._reset();

  t.throws(
    () => builder.value('1').getData(),
    /not provided/,
    'XVIZTimeSeriesBuilder throws when timestamp is not provided'
  );
  builder._reset();

  t.throws(
    () =>
      builder
        .stream('/test')
        .timestamp(1)
        .getData(),
    /not provided/,
    'XVIZTimeSeriesBuilder throws when value is not provided'
  );
  builder._reset();

  t.end();
});

test('XVIZTimeSeriesBuilder#single entry id', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  builder
    .stream('/test')
    .timestamp(20)
    .value(1)
    .id('123');

  const expected = [
    {
      timestamp: 20,
      object_id: '123',
      streams: ['/test'],
      values: {
        doubles: [1]
      }
    }
  ];
  const data = builder.getData();

  t.deepEqual(data, expected, 'XVIZTimeSeriesBuilder single entry id matches expected output');
  t.end();
});

test('XVIZTimeSeriesBuilder#multiple entry id same ts', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  builder
    .stream('/test')
    .timestamp(20)
    .value(1)
    .id('123');

  builder
    .stream('/foo')
    .timestamp(20)
    .value(2)
    .id('123');

  const expected = [
    {
      timestamp: 20,
      object_id: '123',
      streams: ['/test', '/foo'],
      values: {
        doubles: [1, 2]
      }
    }
  ];
  const data = builder.getData();

  t.deepEqual(
    data,
    expected,
    'XVIZTimeSeriesBuilder multiple entry id same ts matches expected output'
  );
  data.forEach(d => schemaValidator.validate('core/timeseries_state', d));
  t.end();
});

test('XVIZTimeSeriesBuilder#multiple entry different id ts', t => {
  const builder = new XVIZTimeSeriesBuilder({validator});
  builder
    .stream('/test')
    .timestamp(20)
    .value(1)
    .id('123');

  builder
    .stream('/foo')
    .timestamp(30)
    .value(2)
    .id('123');

  builder
    .stream('/bar')
    .timestamp(20)
    .value(3)
    .id('987');

  const expected = [
    {
      timestamp: 20,
      object_id: '123',
      streams: ['/test'],
      values: {
        doubles: [1]
      }
    },
    {
      timestamp: 20,
      object_id: '987',
      streams: ['/bar'],
      values: {
        doubles: [3]
      }
    },
    {
      timestamp: 30,
      object_id: '123',
      streams: ['/foo'],
      values: {
        doubles: [2]
      }
    }
  ];
  const data = builder.getData();

  t.deepEqual(
    data,
    expected,
    'XVIZTimeSeriesBuilder multiple entry different ts matches expected output'
  );
  data.forEach(d => schemaValidator.validate('core/timeseries_state', d));
  t.end();
});

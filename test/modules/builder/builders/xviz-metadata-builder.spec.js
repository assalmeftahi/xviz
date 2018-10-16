/* eslint-disable camelcase */
import test from 'tape-catch';
import {Matrix4} from 'math.gl';
import {XVIZMetadataBuilder} from '@xviz/builder';

test('XVIZMetadataBuilder#default-ctor', t => {
  const xb = new XVIZMetadataBuilder();
  t.ok(xb, 'Created new XVIZMetadataBuilder');
  t.end();
});

test('XVIZMetadataBuilder#build-with-transformMatrix-array', t => {
  const xb = new XVIZMetadataBuilder();
  xb.startTime(0)
    .endTime(1)
    .stream('/test/stream')
    .category('primitive')
    .type('circle')
    .coordinate('test-coordinate')
    .transformMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    .styleClassDefault({color: [255, 0, 0]})
    .styleClass('test-style', {color: [0, 255, 0]});

  const metadata = xb.getMetadata();

  t.comment(JSON.stringify(metadata));

  const expected = {
    type: 'metadata',
    streams: {
      '/test/stream': {
        category: 'primitive',
        type: 'circle',
        coordinate: 'test-coordinate',
        transform: new Matrix4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
      }
    },
    styles: {
      '/test/stream': {
        '*': {
          color: [255, 0, 0]
        },
        'test-style': {
          color: [0, 255, 0]
        }
      }
    },
    start_time: 0,
    end_time: 1
  };

  t.deepEqual(
    metadata,
    expected,
    'XVIZMetadataBuilder build with transformMatrix matches expected output'
  );
  t.end();
});

test('XVIZMetadataBuilder#build-with-transformMatrix-matrix4', t => {
  const matrix = new Matrix4().translate([1, 2, 3]);
  const xb = new XVIZMetadataBuilder();
  xb.startTime(0)
    .endTime(1)
    .stream('/test/stream')
    .category('primitive')
    .type('circle')
    .coordinate('test-coordinate')
    .transformMatrix(matrix);

  const metadata = xb.getMetadata();

  t.comment(JSON.stringify(metadata));

  const expected = {
    type: 'metadata',
    streams: {
      '/test/stream': {
        category: 'primitive',
        type: 'circle',
        coordinate: 'test-coordinate',
        transform: new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1])
      }
    },
    styles: {},
    start_time: 0,
    end_time: 1
  };

  t.deepEqual(
    metadata,
    expected,
    'XVIZMetadataBuilder build with transformMatrix matches expected output'
  );
  t.end();
});

test('XVIZMetadataBuilder#build-with-pose', t => {
  const xb = new XVIZMetadataBuilder();
  xb.startTime(0)
    .endTime(1)
    .stream('/test/stream')
    .category('primitive')
    .type('polygon')
    .pose({x: 1, y: 2, z: 3});

  const metadata = xb.getMetadata();

  t.comment(JSON.stringify(metadata));

  const expected = {
    type: 'metadata',
    streams: {
      '/test/stream': {
        category: 'primitive',
        type: 'polygon',
        transform: new Matrix4([1, 0, -0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1])
      }
    },
    styles: {},
    start_time: 0,
    end_time: 1
  };

  t.deepEqual(metadata, expected, 'XVIZMetadataBuilder build with pose matches expected output');
  t.end();
});

test('XVIZMetadataBuilder#multiple-streams', t => {
  const xb = new XVIZMetadataBuilder();
  xb.startTime(0)
    .endTime(1)
    .stream('/test-stream/1')
    .category('primitive')
    .stream('/test-stream/2')
    .category('variable');

  const metadata = xb.getMetadata();

  t.comment(JSON.stringify(metadata));

  const expected = {
    type: 'metadata',
    streams: {
      '/test-stream/1': {
        category: 'primitive'
      },
      '/test-stream/2': {
        category: 'variable'
      }
    },
    styles: {},
    start_time: 0,
    end_time: 1
  };

  t.deepEqual(
    metadata,
    expected,
    'XVIZMetadataBuilder mulitple streams build matches expected output'
  );
  t.end();
});

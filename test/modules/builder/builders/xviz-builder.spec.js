/* eslint-disable camelcase */
import test from 'tape-catch';
import {XVIZBuilder} from '@xviz/builder';
import {XVIZValidator} from '@xviz/schema';

import base64js from 'base64-js';

const schemaValidator = new XVIZValidator();
const PRIMARY_POSE_STREAM = '/vehicle_pose';

const DEFAULT_POSE = {
  timestamp: 1.0,
  mapOrigin: {longitude: 1.1, latitude: 2.2, altitude: 3.3},
  position: [11, 22, 33],
  orientation: [0.11, 0.22, 0.33]
};

function setupPose(builder) {
  const {longitude, latitude, altitude} = DEFAULT_POSE.mapOrigin;
  builder
    .pose(PRIMARY_POSE_STREAM)
    .timestamp(DEFAULT_POSE.timestamp)
    .mapOrigin(longitude, latitude, altitude)
    .position(...DEFAULT_POSE.position)
    .orientation(...DEFAULT_POSE.orientation);
}

test('XVIZBuilder#default-ctor', t => {
  /* eslint-disable no-unused-vars */
  const builder = new XVIZBuilder({});
  t.end();
  /* eslint-enable no-unused-vars */
});

test('XVIZBuilder#single-pose', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder single pose matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#multiple-poses', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  builder
    .pose('/vehicle-pose-2')
    .timestamp(2.0)
    .mapOrigin(4.4, 5.5, 6.6)
    .position(44, 55, 66)
    .orientation(0.44, 0.55, 0.66);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE,
          '/vehicle-pose-2': {
            timestamp: 2.0,
            mapOrigin: {longitude: 4.4, latitude: 5.5, altitude: 6.6},
            position: [44, 55, 66],
            orientation: [0.44, 0.55, 0.66]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder single pose matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#polygon', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const verts = [[0, 0, 0], [4, 0, 0], [4, 3, 0]];

  builder
    .primitive('/test/polygon')
    .polygon(verts)
    .id('1')
    .style({
      fill_color: [255, 0, 0]
    });

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/polygon': {
            polygons: [
              {
                base: {
                  style: {
                    fill_color: [255, 0, 0]
                  },
                  object_id: '1'
                },
                vertices: verts
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder pose and polygon match expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#points', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const points = [[0, 0, 0], [4, 0, 0], [4, 3, 0]];
  const colors = [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255]];

  builder
    .primitive('/test/points')
    .points(points)
    .id('1')
    .colors(colors);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/points': {
            points: [
              {
                base: {
                  object_id: '1'
                },
                points,
                colors
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder points match expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#single-stream-multiple-polygons', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const verts1 = [[1, 2, 3], [0, 0, 0], [2, 3, 4]];
  const verts2 = [[0, 0, 0], [4, 0, 0], [4, 3, 0]];

  builder
    .primitive('/test/polygon')
    .polygon(verts1)
    .style({
      fill_color: [255, 0, 0]
    })
    .polygon(verts2)
    .style({
      fill_color: [0, 255, 0]
    });

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/polygon': {
            polygons: [
              {
                base: {
                  style: {
                    fill_color: [255, 0, 0]
                  }
                },
                vertices: verts1
              },
              {
                base: {
                  style: {
                    fill_color: [0, 255, 0]
                  }
                },
                vertices: verts2
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder multiple polygon match expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#polyline', t => {
  const builder = new XVIZBuilder({streams: {}}, [], {});
  setupPose(builder);

  const verts = [[0, 0, 0], [4, 0, 0], [4, 3, 0]];

  builder.primitive('/test/polyline').polyline(verts);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/polyline': {
            polylines: [
              {
                vertices: verts
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder polyline matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#circle', t => {
  const builder = new XVIZBuilder({streams: {}}, [], {});
  setupPose(builder);

  const pos = [4, 3, 0];
  builder.primitive('/test/circle').circle(pos, 5);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/circle': {
            circles: [
              {
                center: pos,
                radius_m: 5
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder circle matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#text', t => {
  const builder = new XVIZBuilder({streams: {}}, [], {});
  setupPose(builder);

  const pos = [4, 3, 0];
  builder
    .primitive('/test/text')
    .text('test message')
    .position(pos);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/text': {
            texts: [
              {
                text: 'test message',
                position: pos
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder text matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#stadium', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const pos = [[4, 3, 0], [8, 6, 0]];

  builder.primitive('/test/stadium').stadium(pos[0], pos[1], 5);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/stadium': {
            stadiums: [
              {
                start: pos[0],
                end: pos[1],
                radius_m: 5
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder stadium matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#image', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const imageData = base64js.fromByteArray(Uint8Array.from([1, 2, 3, 4]));

  builder
    .primitive('/test/image')
    .image(imageData)
    .dimensions(2, 2)
    .position([10, 10, 0]);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        primitives: {
          '/test/image': {
            images: [
              {
                width_px: 2,
                height_px: 2,
                data: imageData,
                position: [10, 10, 0]
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder image matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#variable', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  builder.variable('/test/variables').values([1.1, 2.0]);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        variables: {
          '/test/variables': {
            variables: [
              {
                values: [1.1, 2.0]
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder variable matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#multiple-variables', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  builder.variable('/test/variables_1').values([1.1, 2.0]);

  builder.variable('/test/variables_2').values([2.0, 1.1]);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        variables: {
          '/test/variables_1': {
            variables: [
              {
                values: [1.1, 2.0]
              }
            ]
          },
          '/test/variables_2': {
            variables: [
              {
                values: [2.0, 1.1]
              }
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder multiple variables match expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#time_series', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const ts1 = 1.0;
  const ts2 = 1.0;

  builder
    .timeSeries('/test/time_series_1')
    .timestamp(ts1)
    .value(1.0);

  builder
    .timeSeries('/test/time_series_2')
    .timestamp(ts2)
    .value(2.0);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        time_series: [
          {
            timestamp: ts1,
            values: [['/test/time_series_1', 1.0], ['/test/time_series_2', 2.0]]
          }
        ]
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder variable matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#futures-single-primitive', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);

  const streamId = '/test/polygon';
  const verts = [[0, 0, 0], [4, 0, 0], [4, 3, 0]];
  const ts = 1.0;

  builder
    .primitive(streamId)
    .polygon(verts)
    .timestamp(ts);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        future_instances: {
          [streamId]: {
            timestamps: [ts],
            primitives: [
              [
                {
                  vertices: verts
                }
              ]
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder single primitive futures matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

test('XVIZBuilder#futures-multiple-primitive', t => {
  const builder = new XVIZBuilder();
  setupPose(builder);
  const streamId = '/test/polygon';

  const verts1 = [[1, 2, 3], [0, 0, 0], [2, 3, 4]];
  const verts2 = [[0, 0, 0], [4, 0, 0], [4, 3, 0]];
  const ts1 = 2.0;
  const ts2 = 1.0;

  builder
    .primitive(streamId)
    .timestamp(ts1)
    .polygon(verts1)
    .style({
      fill_color: [255, 0, 0]
    })
    .polygon(verts2)
    .timestamp(ts2);

  const expected = {
    update_type: 'snapshot',
    updates: [
      {
        timestamp: 1.0,
        poses: {
          [PRIMARY_POSE_STREAM]: DEFAULT_POSE
        },
        future_instances: {
          [streamId]: {
            timestamps: [ts2, ts1],
            primitives: [
              [
                {
                  vertices: verts2
                }
              ],
              [
                {
                  base: {
                    style: {
                      fill_color: [255, 0, 0]
                    }
                  },
                  vertices: verts1
                }
              ]
            ]
          }
        }
      }
    ]
  };

  const frame = builder.getFrame();
  t.deepEqual(frame, expected, 'XVIZBuilder multiple primitives futures matches expected output');
  schemaValidator.validate('session/state_update', frame);
  t.end();
});

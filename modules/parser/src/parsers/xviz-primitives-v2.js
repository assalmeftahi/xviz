/* global URL, Blob */
import {filterVertices} from './filter-vertices';
import {PRIMITIVE_CAT} from './parse-xviz-stream';
import base64js from 'base64-js';

function aliasId(primitive) {
  if (primitive && primitive.base && primitive.base.object_id) {
    primitive.id = primitive.base.object_id;
  }
}

// TODO - tests for all primitive types
export default {
  text: {
    category: PRIMITIVE_CAT.FEATURE,
    validate: primitive => true,
    normalize: primitive => {
      aliasId(primitive);
    }
  },
  // eslint-disable-next-line camelcase
  tree_table: {
    category: PRIMITIVE_CAT.COMPONENT,
    validate: primitive => true,
    normalize: primitive => {
      aliasId(primitive);
    }
  },
  circle: {
    category: PRIMITIVE_CAT.FEATURE,
    validate: (primitive, streamName, time) => primitive.center,
    normalize: primitive => {
      aliasId(primitive);
    }
  },
  polyline: {
    category: PRIMITIVE_CAT.FEATURE,
    validate: (primitive, streamName, time) => primitive.vertices && primitive.vertices.length >= 2,
    normalize: primitive => {
      // z is required by filterVertices
      primitive.vertices.forEach(v => {
        v[2] = v[2] || 0;
      });
      // Filter out identical vertices to make sure we don't get rendering artifacts
      // in the path layer
      // TODO - handle this directly in deck.gl PathLayer
      primitive.vertices = filterVertices(primitive.vertices);
      aliasId(primitive);
    }
  },
  polygon: {
    category: PRIMITIVE_CAT.FEATURE,
    validate: (primitive, streamName, time) => primitive.vertices && primitive.vertices.length >= 3,
    normalize: primitive => {
      // This is a polygon primitive which per XVIZ protocol implicitly says
      // that the provided path is closed. Push a copy of first vert to end of array.
      // Array comparison turns out to be expensive. Looks like the polygon returned
      // from XVIS is never closed - worst case we end up with a duplicate end vertex,
      // which will not break the polygon layer.
      primitive.vertices.push(primitive.vertices[0]);
      aliasId(primitive);
    }
  },
  point: {
    category: PRIMITIVE_CAT.POINTCLOUD,
    validate: (primitive, streamName, time) => primitive.points && primitive.points.length > 0,
    normalize: primitive => {
      // Alias XVIZ 2.0 to normalized vertices field.
      primitive.vertices = primitive.points;
      aliasId(primitive);
    }
  },
  image: {
    category: PRIMITIVE_CAT.IMAGE,
    validate: (primitive, streamName, time) => primitive.data,
    normalize: primitive => {
      let imageData = primitive.data;
      if (typeof primitive.data === 'string') {
        imageData = base64js.toByteArray(imageData);
      }
      // format is not part of v2 spec
      const imgType = primitive.format ? `image/${primitive.format}` : null;
      const blob = new Blob([imageData], {type: imgType});
      primitive.imageUrl = URL.createObjectURL(blob);
      if (primitive.position) {
        primitive.vertices = primitive.position;
      }
      aliasId(primitive);
    }
  }
};

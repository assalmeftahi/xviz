/* eslint-disable max-depth */
export function normalizeXvizPrimitive(
  PRIMITIVE_PROCCESSOR,
  primitive,
  objectIndex,
  streamName,
  time,
  postProcessPrimitive
) {
  // as normalizeXvizPrimitive is called for each primitive of every frame
  // it is intentional to mutate the primitive in place
  // to avoid frequent allocate/discard and improve performance

  const {
    // common
    type,
    // line2d, polygon2d
    vertices,
    // circle2d
    center
  } = primitive;

  const {enableZOffset, validate, normalize} = PRIMITIVE_PROCCESSOR[type];

  // Apply a small offset to 2d geometries to battle z fighting
  if (enableZOffset) {
    const zOffset = objectIndex * 1e-6;
    if (vertices) {
      // TODO(twojtasz): this is pretty bad for memory, backend must
      // set all 3 values otherwise we allocate and cause heavy GC
      // TODO - this looks like it could be handled with a model matrix?
      for (let i = 0; i < vertices.length; i++) {
        // Flatten the data for now
        vertices[i][2] = zOffset;
      }
    }
    if (center && center.length === 2) {
      center[2] = zOffset;
    }
  }

  // validate
  if (!validate(primitive, streamName, time)) {
    return null;
  }

  // process
  if (normalize) {
    normalize(primitive);
  }

  // post process
  if (postProcessPrimitive) {
    postProcessPrimitive(primitive);
  }

  return primitive;
}
/* eslint-enable max-depth */

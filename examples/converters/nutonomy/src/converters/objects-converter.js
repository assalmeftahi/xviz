/* eslint-disable camelcase */
import {parseJsonFile} from '../common';

import {loadObjects} from '../parsers/parse-objects';

export const OBJECT_PALATTE = {
  ['/human/pedestrian/adult']: {
    fill_color: '#FEC56480',
    stroke_color: '#FEC564'
  },
  ['/human/pedestrian/child']: {
    fill_color: '#FEC56480',
    stroke_color: '#FEC564'
  },
  ['/human/pedestrian/wheelchair']: {
    fill_color: '#FEC56480',
    stroke_color: '#FEC564'
  },
  ['/human/pedestrian/personal_mobility']: {
    fill_color: '#FEC56480',
    stroke_color: '#FEC564'
  },
  ['/human/pedestrian/police_officer']: {
    fill_color: '#FEC56480',
    stroke_color: '#FEC564'
  },
  ['/human/pedestrian/construction_worker']: {
    fill_color: '#FEC56480',
    stroke_color: '#FEC564'
  },
  ['/human/pedestrian/stroller']: {
    fill_color: '#FEC56480',
    stroke_color: '#FEC564'
  },
  ['/animal']: {
    fill_color: '#D6A00080',
    stroke_color: '#D6A000'
  },
  ['/vehicle/car']: {
    fill_color: '#7DDDD780',
    stroke_color: '#7DDDD7'
  },
  ['/vehicle/motorcycle']: {
    fill_color: '#EEA2AD80',
    stroke_color: '#EEA2AD'
  },
  ['/vehicle/bicycle']: {
    fill_color: '#DA70BF80',
    stroke_color: '#DA70BF'
  },
  ['/vehicle/bus/bendy']: {
    fill_color: '#267E6380',
    stroke_color: '#267E63'
  },
  ['/vehicle/bus/rigid']: {
    fill_color: '#267E6380',
    stroke_color: '#267E63'
  },
  ['/vehicle/truck']: {
    fill_color: '#267E6380',
    stroke_color: '#267E63'
  },
  ['/vehicle/construction']: {
    fill_color: '#267E6380',
    stroke_color: '#267E63'
  },
  ['/vehicle/emergency/ambulance']: {
    fill_color: '#BE4A4780',
    stroke_color: '#BE4A47'
  },
  ['/vehicle/emergency/police']: {
    fill_color: '#BE4A4780',
    stroke_color: '#BE4A47'
  },
  ['/vehicle/trailer']: {
    fill_color: '#267E6380',
    stroke_color: '#267E63'
  },
  ['/movable_object/barrier']: {
    fill_color: '#6495ED80',
    stroke_color: '#6495ED'
  },
  ['/movable_object/trafficcone']: {
    fill_color: '#6495ED80',
    stroke_color: '#6495ED'
  },
  ['/movable_object/pushable_pullable']: {
    fill_color: '#6495ED80',
    stroke_color: '#6495ED'
  },
  ['/movable_object/debris']: {
    fill_color: '#6495ED80',
    stroke_color: '#6495ED'
  },
  ['/static_object/bicycle_rack']: {
    fill_color: '#8B887880',
    stroke_color: '#8B8878'
  }
};

export default class ObjectsConverter {
  constructor(rootDir, streamFile) {
    this.rootDir = rootDir;
    this.streamFile = streamFile;
    this.objectsByFrame = {};
    this.timestamps = [];

    this.OBJECTS = '/objects/objects';
    this.OBJECTS_TRACKING_POINT = '/objects/tracking_point';
    this.OBJECTS_TRAJECTORY = '/objects/trajectory';
    this.OBJECTS_LABEL = '/objects/label';
  }

  load({staticData, frames}) {
    this.frames = frames;

    const objects = parseJsonFile(this.rootDir, this.streamFile);
    this.objectsByFrame = loadObjects(objects, staticData.instances);
  }

  convertFrame(frameIndex, xvizBuilder) {
    const frameToken = this.frames[frameIndex].token;

    // objects of given sample
    const objects = this.objectsByFrame[frameToken];

    if (objects) {
      Object.keys(objects).forEach((objectToken, i) => {
        const object = objects[objectToken];

        xvizBuilder
          .primitive(this.OBJECTS)
          .polygon(object.vertices)
          .classes([object.category])
          .style({
            height: object.size[2]
          })
          .id(object.token);

        xvizBuilder
          .primitive(this.OBJECTS_TRACKING_POINT)
          .circle([object.x, object.y, object.z])
          .id(object.token);
      });

      Object.values(objects).forEach(object => {
        const objectTrajectory = this._getObjectTrajectory(
          object,
          frameIndex,
          Math.min(frameIndex + 50, this.frames.length)
        );

        xvizBuilder.primitive(this.OBJECTS_TRAJECTORY).polyline(objectTrajectory);
      });
    }
  }

  getMetadata(xvizMetaBuilder, {staticData}) {
    const xb = xvizMetaBuilder;
    xb.stream(this.OBJECTS)
      .category('primitive')
      .type('polygon')
      .coordinate('IDENTITY')

      .streamStyle({
        extruded: true,
        wireframe: true,
        fill_color: '#00000080'
      });

    Object.values(staticData.categories).forEach(category => {
      xb.styleClass(category.streamName, OBJECT_PALATTE[category.streamName]);
    });

    xb.stream(this.OBJECTS_TRACKING_POINT)
      .category('primitive')
      .type('circle')
      .streamStyle({
        radius: 0.2,
        fill_color: '#FFFF00'
      })
      .coordinate('IDENTITY');

    xb.stream(this.OBJECTS_TRAJECTORY)
      .category('primitive')
      .type('polyline')
      .streamStyle({
        stroke_color: '#FEC557',
        stroke_width: 0.1,
        stroke_width_min_pixels: 1
      })
      .coordinate('IDENTITY');
  }

  _getObjectTrajectory(targetObject, startFrame, endFrame) {
    const trajectory = [];
    for (let i = startFrame; i < endFrame; i++) {
      const startFrameToken = this.frames[startFrame].token;
      const startObject = this.objectsByFrame[startFrameToken][targetObject.instance_token];

      const frameToken = this.frames[i].token;
      const frameObject = this.objectsByFrame[frameToken][targetObject.instance_token];
      if (!frameObject) {
        return trajectory;
      }

      trajectory.push([frameObject.x, frameObject.y, startObject.z]);
    }
    return trajectory;
  }
}

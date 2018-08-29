export default class XVIZMetadataBuilder {
  constructor() {
    this.data = {
      streams: {},
      cameras: {},
      styles: {}
    };

    this.stream_id = null;
    this.tmp_stream = {};

    this.camera_name = null;
    this.tmp_camera = null;
  }

  startTime(time) {
    this.data.start_time = time;
    return this;
  }

  endTime(time) {
    this.data.end_time = time;
    return this;
  }

  stream(stream_id) {
    if (this.stream_id) {
      this._flush();
    }

    this.stream_id = stream_id;
    return this;
  }

  category(cat) {
    this.tmp_stream.category = cat;
    return this;
  }

  type(t) {
    this.tmp_stream.type = t;
    return this;
  }

  unit(u) {
    this.tmp_stream.unit = u;
    return this;
  }

  coordinate(t) {
    this.tmp_stream.coordinate = t;
    return this;
  }

  pose(p) {
    this.tmp_stream.pose = p;
    return this;
  }

  camera(name, info) {
    if (this.camera_name) {
      this._flush();
    }

    this.camera_name = name;
    this.tmp_camera = info;
    return this;
  }

  styleClassDefault(style) {
    this.styleClass('*', style);
    return this;
  }

  styleClass(className, style) {
    if (!this.data.styles[this.stream_id]) {
      this.data.styles[this.stream_id] = {
        [className]: style
      };
    } else {
      this.data.styles[this.stream_id][className] = style;
    }
    return this;
  }

  getMetadata() {
    this._flush();

    return {
      type: 'metadata',
      ...this.data
    };
  }

  _flush() {
    if (this.stream_id) {
      this.data.streams[this.stream_id] = this.tmp_stream;
    }

    if (this.camera_name) {
      this.data.cameras[this.camera_name] = this.tmp_camera;
    }

    this._reset();
  }

  _reset() {
    this.stream_id = null;
    this.tmp_stream = {};
  }
}

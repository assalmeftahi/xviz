# Session Protocol Specification

XVIZ can be used to visualize data from a running system. In this contexts a client connects to a
server and establishes a session. At the start of the session the available streams and parameters
are setup.

## Session Message Types

These describe client server communication to start and manage sessions.

### Session Start (from Client)

Sent by the client to the service or encoded as URL parameters. When the server gets this message it
will start streaming data to the client as soon as it can.

Common Parameters:

| Name             | Type     | Description                                                   |
| ---------------- | -------- | ------------------------------------------------------------- |
| `version`        | `string` | Protocol version, for example `2.0.0`                         |
| `profile`        | `string` | The backend configuration, defines what streams you will get. |
| `session_type`   | `string` | Type of session being opened up.                              |
| `message_format` | `string` | Format the data will be represented in.                       |

**session_type** - valid values:

- `live` - send data in real time
- `log` - show data from a log
- `unbuffered_log` - data is sent back in at the same rate it was logged

**message_format** - valid values:

- `json` - JSON types encoded as UT8 strings.
- `binary` - Our GLB based binary container format.

### Session Metadata (to Client)

Sent to client upon connection

| Name             | Type                              | Description                                                                                                                                                                                                                                        |
| ---------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`        | `string`                          | Protocol version, for example `2.0.0`                                                                                                                                                                                                              |
| `streams`        | `map<stream_id, stream_metadata>` | Stream information                                                                                                                                                                                                                                 |
| `cameras`        | `map<string, camera_info>`        | Camera information indexed by camera name.                                                                                                                                                                                                         |
| `stream_aliases` | `map<stream_id, stream_id>`       | Map from an old to new stream names so the "schema" of streams can evolve without the client code being changed. Even though this will be used infrequently having it in place allows seamless backend change without having to update the client. |
| `ui_config`      | `map<string, ui_panel_info>`      | Declarative UI panel configuration.                                                                                                                                                                                                                |

#### Log Specific Metadata fields

The following parameters are specific to log sessions and in metadata messages when a log session is
created.

| Name           | Type               | Description                                 |
| -------------- | ------------------ | ------------------------------------------- |
| `map_info`     | `map_metadata`     | Information about an applicable map, if any |
| `log_info`     | `log_metadata`     | Information about the log                   |
| `vehicle_info` | `vehicle_metadata` | Vehicle type/platform info                  |

**map_info** - currently unspecified

**log_info** - currently unspecified

**vehicle_info** - currently unspecified

## Data Messages

### State Update

This is a collection of stream sets for all extractor output.

| Name          | Type                             | Description                                       |
| ------------- | -------------------------------- | ------------------------------------------------- |
| `update_type` | `enum { snapshot, incremental }` | Whether we have a complete or incremental update. |
| `updates`     | `list<stream_set>`               |                                                   |

Here is a JSON example showing an incremental update that contains a single Stream Set, which itself
has just the single `/object/polygon` containing a

```
{
    "update_type": "incremental",
    "updates": [
        {
            "timestamp": 1001.3,
            "primitives": [
                {
                    "name": "/object/polygon",
                    "primitives": [
                        {
                            "vertices": [[9, 15, 3], [20, 13, 3], [20, 5, 3]]
                        }
                    ]
                }
            ]
        }
    ]
}
```

## Request Messages

### Reconfigure (WARNING: unstable feature)

Reconfigure messages allow for a client to change the configuration of a XVIZ server, affecting all
future requests for data from the server. This in turn enables a client to enable or disable
expensive to compute or transmit features.

A typical source for reconfigure messages would be a user selecting a new value in a
[declarative ui select component](/docs/protocol-schema/declarative-ui.md#select-warning-unstable-feature-).
Which would send a `delta` reconfigure message to the server.

| Name            | Type                   | Description                                       |
| --------------- | ---------------------- | ------------------------------------------------- |
| `update_type`   | `enum { full, delta }` | Whether we have a complete or incremental update. |
| `config_update` | `object`               | A JSON patch or full configuration update.        |

## Core Types

### Stream Metadata

Metadata provides information about the structure of a stream. Ideally redundant information is
removed from streams and put into metadata packets that are sent at the start of streaming or when a
reconfiguration happens.

| Name                 | Type                              | Description                                                                                                                                                |
| -------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`             | `string`                          | URL for where this stream comes from. Allowing you to fetch the data from S3 for example. An empty string means it comes through the standard XVIZ stream. |
| `coordinate`         | `optional<enum{ frames }>`        | Defaults to IDENTITY, defines the coordinate frame for the data in the stream                                                                              |
| `transform`          | `4x4`                             | 4x4 matrix for `VEHICLE_RELATIVE`                                                                                                                          |
| `transform_callback` | `string`                          | Callback function name for `DYNAMIC`                                                                                                                       |
| `units`              | `string`                          | For variable and time series data this lets the user know what kind of data they are looking at.                                                           |
| `value_map`          | `optional<enum{ stream values }>` | A list of all of the values that will be sent on the stream. The indexes of the values are used to translate them into numeric values for plotting.        |
| `style_info`         | `map<class_id, style>`            | Describes how the data should be rendered.                                                                                                                 |
| `category`           | `enum{ category }`                | What kind of data is on this stream, see the matching type field for details.                                                                              |
| `scalar_type`        | `enum{ scalar-types }`            | The kind of value for `time_series` or `variable`                                                                                                          |
| `primitive_type`     | `enum{ primitive_types }`         | What is the exact primitive                                                                                                                                |
| `ui_primitive_type`  | `enum{ ui_primitive_types }`      | The only valid type is "treetable" right now.                                                                                                              |
| `annotation_type`    | `enum{ annotation_types }`        | The only valid type is "visual" right now.                                                                                                                 |

Frames:

- `IDENTITY` - data in meters, apply no transform to the data before display
- `GEOGRAPHIC` - data in lat/lon/altitude
- `VEHICLE_RELATIVE` - the data is relative to primary vehicle, with an optional additional
  transform
- `DYNAMIC` - name of a function which returns the needed transform at runtime

Category:

- `primitive`
- `time_series`
- `variable`
- `annotation`
- `future_instance`
- `pose`
- `ui_primitive`

Scalar types:

- `float`
- `in32`
- `string`
- `bool`

Primitive types:

- `circle`
- `image`
- `point`
- `polygon`
- `polyline`
- `stadium`
- `text`

### Camera Info

Everything you need to display and deeply integrate video into a 3D application.

| Name                       | Type               | Description                                                                                                         |
| -------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `human_name`               | `string`           | Readable camera name                                                                                                |
| `source`                   | `string`           | either URL or "<internal>" (in XVIZ stream)                                                                         |
| `vehicle_position`         | `3x1 float vector` | Translation offset from vehicle position to camera position                                                         |
| `vehicle_orientation`      | `3x3 float matrix` | Rotation offset from vehicle position to camera position                                                            |
| `pixel_width`              | `int`              | Width of the raw camera images                                                                                      |
| `pixel_height`             | `int`              | Height of the raw camera images                                                                                     |
| `rectification_projection` | `3x3 float matrix` | Transform raw pixel coordinates to rectified coordinates (use in a shader, reference). Also called a "homography".  |
| `gl_projection`            | `4x4 float matrix` | Goes from 3D world coordinates to rectified image coordinates. Use with OpenGL to draw 3D data on top of the image. |

### UI Panel Info

UI configuration that comes with the data explaining how best to display it.

| Name             | Type                     | Description                                     |
| ---------------- | ------------------------ | ----------------------------------------------- |
| `name`           | `string`                 | Unique name for the panel                       |
| `needed_streams` | `list<stream_id>`        | What streams are needed to populate this panel. |
| `config`         | `string, declarative ui` | Declarative UI panel configuration              |

See [declarative ui specification](/docs/protocol-schema/declarative-ui.md) to learn more.

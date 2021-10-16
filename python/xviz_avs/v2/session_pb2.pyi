# @generated by generate_proto_mypy_stubs.py.  Do not edit!
import sys
from google.protobuf.descriptor import (
    Descriptor as google___protobuf___descriptor___Descriptor,
    EnumDescriptor as google___protobuf___descriptor___EnumDescriptor,
    FileDescriptor as google___protobuf___descriptor___FileDescriptor,
)

from google.protobuf.internal.containers import (
    RepeatedCompositeFieldContainer as google___protobuf___internal___containers___RepeatedCompositeFieldContainer,
    RepeatedScalarFieldContainer as google___protobuf___internal___containers___RepeatedScalarFieldContainer,
)

from google.protobuf.internal.enum_type_wrapper import (
    _EnumTypeWrapper as google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper,
)

from google.protobuf.message import (
    Message as google___protobuf___message___Message,
)

from google.protobuf.struct_pb2 import (
    Struct as google___protobuf___struct_pb2___Struct,
)

from typing import (
    Iterable as typing___Iterable,
    Mapping as typing___Mapping,
    MutableMapping as typing___MutableMapping,
    NewType as typing___NewType,
    Optional as typing___Optional,
    Text as typing___Text,
    cast as typing___cast,
)

from typing_extensions import (
    Literal as typing_extensions___Literal,
)

from xviz.v2.core_pb2 import (
    StreamSet as xviz___v2___core_pb2___StreamSet,
)

from xviz.v2.style_pb2 import (
    StyleClass as xviz___v2___style_pb2___StyleClass,
    StyleStreamValue as xviz___v2___style_pb2___StyleStreamValue,
)


builtin___bool = bool
builtin___bytes = bytes
builtin___float = float
builtin___int = int


DESCRIPTOR: google___protobuf___descriptor___FileDescriptor = ...

SessionTypeValue = typing___NewType('SessionTypeValue', builtin___int)
type___SessionTypeValue = SessionTypeValue
SessionType: _SessionType
class _SessionType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[SessionTypeValue]):
    DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
    SESSION_TYPE_INVALID = typing___cast(SessionTypeValue, 0)
    LIVE = typing___cast(SessionTypeValue, 1)
    LOG = typing___cast(SessionTypeValue, 2)
    UNBUFFERED_LOG = typing___cast(SessionTypeValue, 3)
SESSION_TYPE_INVALID = typing___cast(SessionTypeValue, 0)
LIVE = typing___cast(SessionTypeValue, 1)
LOG = typing___cast(SessionTypeValue, 2)
UNBUFFERED_LOG = typing___cast(SessionTypeValue, 3)
type___SessionType = SessionType

class Start(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    MessageFormatValue = typing___NewType('MessageFormatValue', builtin___int)
    type___MessageFormatValue = MessageFormatValue
    MessageFormat: _MessageFormat
    class _MessageFormat(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[Start.MessageFormatValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        START_MESSAGE_FORMAT_INVALID = typing___cast(Start.MessageFormatValue, 0)
        JSON = typing___cast(Start.MessageFormatValue, 1)
        BINARY = typing___cast(Start.MessageFormatValue, 2)
    START_MESSAGE_FORMAT_INVALID = typing___cast(Start.MessageFormatValue, 0)
    JSON = typing___cast(Start.MessageFormatValue, 1)
    BINARY = typing___cast(Start.MessageFormatValue, 2)
    type___MessageFormat = MessageFormat

    version: typing___Text = ...
    profile: typing___Text = ...
    session_type: type___SessionTypeValue = ...
    message_format: type___Start.MessageFormatValue = ...
    log: typing___Text = ...

    def __init__(self,
        *,
        version : typing___Optional[typing___Text] = None,
        profile : typing___Optional[typing___Text] = None,
        session_type : typing___Optional[type___SessionTypeValue] = None,
        message_format : typing___Optional[type___Start.MessageFormatValue] = None,
        log : typing___Optional[typing___Text] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"log",b"log",u"message_format",b"message_format",u"profile",b"profile",u"session_type",b"session_type",u"version",b"version"]) -> None: ...
type___Start = Start

class TransformLog(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    id: typing___Text = ...
    start_timestamp: builtin___float = ...
    end_timestamp: builtin___float = ...
    desired_streams: google___protobuf___internal___containers___RepeatedScalarFieldContainer[typing___Text] = ...

    def __init__(self,
        *,
        id : typing___Optional[typing___Text] = None,
        start_timestamp : typing___Optional[builtin___float] = None,
        end_timestamp : typing___Optional[builtin___float] = None,
        desired_streams : typing___Optional[typing___Iterable[typing___Text]] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"desired_streams",b"desired_streams",u"end_timestamp",b"end_timestamp",u"id",b"id",u"start_timestamp",b"start_timestamp"]) -> None: ...
type___TransformLog = TransformLog

class StateUpdate(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    UpdateTypeValue = typing___NewType('UpdateTypeValue', builtin___int)
    type___UpdateTypeValue = UpdateTypeValue
    UpdateType: _UpdateType
    class _UpdateType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[StateUpdate.UpdateTypeValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        STATE_UPDATE_UPDATE_TYPE_INVALID = typing___cast(StateUpdate.UpdateTypeValue, 0)
        SNAPSHOT = typing___cast(StateUpdate.UpdateTypeValue, 1)
        INCREMENTAL = typing___cast(StateUpdate.UpdateTypeValue, 2)
        COMPLETE_STATE = typing___cast(StateUpdate.UpdateTypeValue, 3)
        PERSISTENT = typing___cast(StateUpdate.UpdateTypeValue, 4)
    STATE_UPDATE_UPDATE_TYPE_INVALID = typing___cast(StateUpdate.UpdateTypeValue, 0)
    SNAPSHOT = typing___cast(StateUpdate.UpdateTypeValue, 1)
    INCREMENTAL = typing___cast(StateUpdate.UpdateTypeValue, 2)
    COMPLETE_STATE = typing___cast(StateUpdate.UpdateTypeValue, 3)
    PERSISTENT = typing___cast(StateUpdate.UpdateTypeValue, 4)
    type___UpdateType = UpdateType

    update_type: type___StateUpdate.UpdateTypeValue = ...

    @property
    def updates(self) -> google___protobuf___internal___containers___RepeatedCompositeFieldContainer[xviz___v2___core_pb2___StreamSet]: ...

    def __init__(self,
        *,
        update_type : typing___Optional[type___StateUpdate.UpdateTypeValue] = None,
        updates : typing___Optional[typing___Iterable[xviz___v2___core_pb2___StreamSet]] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"update_type",b"update_type",u"updates",b"updates"]) -> None: ...
type___StateUpdate = StateUpdate

class TransformLogDone(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    id: typing___Text = ...

    def __init__(self,
        *,
        id : typing___Optional[typing___Text] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"id",b"id"]) -> None: ...
type___TransformLogDone = TransformLogDone

class TransformPointInTime(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    id: typing___Text = ...
    query_timestamp: builtin___float = ...
    desired_streams: google___protobuf___internal___containers___RepeatedScalarFieldContainer[typing___Text] = ...

    def __init__(self,
        *,
        id : typing___Optional[typing___Text] = None,
        query_timestamp : typing___Optional[builtin___float] = None,
        desired_streams : typing___Optional[typing___Iterable[typing___Text]] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"desired_streams",b"desired_streams",u"id",b"id",u"query_timestamp",b"query_timestamp"]) -> None: ...
type___TransformPointInTime = TransformPointInTime

class Reconfigure(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    UpdateTypeValue = typing___NewType('UpdateTypeValue', builtin___int)
    type___UpdateTypeValue = UpdateTypeValue
    UpdateType: _UpdateType
    class _UpdateType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[Reconfigure.UpdateTypeValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        RECONFIGURE_UPDATE_TYPE_INVALID = typing___cast(Reconfigure.UpdateTypeValue, 0)
        DELTA = typing___cast(Reconfigure.UpdateTypeValue, 1)
        FULL = typing___cast(Reconfigure.UpdateTypeValue, 2)
    RECONFIGURE_UPDATE_TYPE_INVALID = typing___cast(Reconfigure.UpdateTypeValue, 0)
    DELTA = typing___cast(Reconfigure.UpdateTypeValue, 1)
    FULL = typing___cast(Reconfigure.UpdateTypeValue, 2)
    type___UpdateType = UpdateType

    update_type: type___Reconfigure.UpdateTypeValue = ...

    @property
    def config_update(self) -> google___protobuf___struct_pb2___Struct: ...

    def __init__(self,
        *,
        update_type : typing___Optional[type___Reconfigure.UpdateTypeValue] = None,
        config_update : typing___Optional[google___protobuf___struct_pb2___Struct] = None,
        ) -> None: ...
    def HasField(self, field_name: typing_extensions___Literal[u"config_update",b"config_update"]) -> builtin___bool: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"config_update",b"config_update",u"update_type",b"update_type"]) -> None: ...
type___Reconfigure = Reconfigure

class Metadata(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    class StreamsEntry(google___protobuf___message___Message):
        DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
        key: typing___Text = ...

        @property
        def value(self) -> type___StreamMetadata: ...

        def __init__(self,
            *,
            key : typing___Optional[typing___Text] = None,
            value : typing___Optional[type___StreamMetadata] = None,
            ) -> None: ...
        def HasField(self, field_name: typing_extensions___Literal[u"value",b"value"]) -> builtin___bool: ...
        def ClearField(self, field_name: typing_extensions___Literal[u"key",b"key",u"value",b"value"]) -> None: ...
    type___StreamsEntry = StreamsEntry

    class CamerasEntry(google___protobuf___message___Message):
        DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
        key: typing___Text = ...

        @property
        def value(self) -> type___CameraInfo: ...

        def __init__(self,
            *,
            key : typing___Optional[typing___Text] = None,
            value : typing___Optional[type___CameraInfo] = None,
            ) -> None: ...
        def HasField(self, field_name: typing_extensions___Literal[u"value",b"value"]) -> builtin___bool: ...
        def ClearField(self, field_name: typing_extensions___Literal[u"key",b"key",u"value",b"value"]) -> None: ...
    type___CamerasEntry = CamerasEntry

    class StreamAliasesEntry(google___protobuf___message___Message):
        DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
        key: typing___Text = ...
        value: typing___Text = ...

        def __init__(self,
            *,
            key : typing___Optional[typing___Text] = None,
            value : typing___Optional[typing___Text] = None,
            ) -> None: ...
        def ClearField(self, field_name: typing_extensions___Literal[u"key",b"key",u"value",b"value"]) -> None: ...
    type___StreamAliasesEntry = StreamAliasesEntry

    class UiConfigEntry(google___protobuf___message___Message):
        DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
        key: typing___Text = ...

        @property
        def value(self) -> type___UIPanelInfo: ...

        def __init__(self,
            *,
            key : typing___Optional[typing___Text] = None,
            value : typing___Optional[type___UIPanelInfo] = None,
            ) -> None: ...
        def HasField(self, field_name: typing_extensions___Literal[u"value",b"value"]) -> builtin___bool: ...
        def ClearField(self, field_name: typing_extensions___Literal[u"key",b"key",u"value",b"value"]) -> None: ...
    type___UiConfigEntry = UiConfigEntry

    version: typing___Text = ...

    @property
    def streams(self) -> typing___MutableMapping[typing___Text, type___StreamMetadata]: ...

    @property
    def cameras(self) -> typing___MutableMapping[typing___Text, type___CameraInfo]: ...

    @property
    def stream_aliases(self) -> typing___MutableMapping[typing___Text, typing___Text]: ...

    @property
    def ui_config(self) -> typing___MutableMapping[typing___Text, type___UIPanelInfo]: ...

    @property
    def log_info(self) -> type___LogInfo: ...

    def __init__(self,
        *,
        version : typing___Optional[typing___Text] = None,
        streams : typing___Optional[typing___Mapping[typing___Text, type___StreamMetadata]] = None,
        cameras : typing___Optional[typing___Mapping[typing___Text, type___CameraInfo]] = None,
        stream_aliases : typing___Optional[typing___Mapping[typing___Text, typing___Text]] = None,
        ui_config : typing___Optional[typing___Mapping[typing___Text, type___UIPanelInfo]] = None,
        log_info : typing___Optional[type___LogInfo] = None,
        ) -> None: ...
    def HasField(self, field_name: typing_extensions___Literal[u"log_info",b"log_info"]) -> builtin___bool: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"cameras",b"cameras",u"log_info",b"log_info",u"stream_aliases",b"stream_aliases",u"streams",b"streams",u"ui_config",b"ui_config",u"version",b"version"]) -> None: ...
type___Metadata = Metadata

class Error(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    message: typing___Text = ...

    def __init__(self,
        *,
        message : typing___Optional[typing___Text] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"message",b"message"]) -> None: ...
type___Error = Error

class StreamMetadata(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    CategoryValue = typing___NewType('CategoryValue', builtin___int)
    type___CategoryValue = CategoryValue
    Category: _Category
    class _Category(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[StreamMetadata.CategoryValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        STREAM_METADATA_CATEGORY_INVALID = typing___cast(StreamMetadata.CategoryValue, 0)
        PRIMITIVE = typing___cast(StreamMetadata.CategoryValue, 1)
        TIME_SERIES = typing___cast(StreamMetadata.CategoryValue, 2)
        VARIABLE = typing___cast(StreamMetadata.CategoryValue, 3)
        ANNOTATION = typing___cast(StreamMetadata.CategoryValue, 4)
        FUTURE_INSTANCE = typing___cast(StreamMetadata.CategoryValue, 5)
        POSE = typing___cast(StreamMetadata.CategoryValue, 6)
        UI_PRIMITIVE = typing___cast(StreamMetadata.CategoryValue, 7)
    STREAM_METADATA_CATEGORY_INVALID = typing___cast(StreamMetadata.CategoryValue, 0)
    PRIMITIVE = typing___cast(StreamMetadata.CategoryValue, 1)
    TIME_SERIES = typing___cast(StreamMetadata.CategoryValue, 2)
    VARIABLE = typing___cast(StreamMetadata.CategoryValue, 3)
    ANNOTATION = typing___cast(StreamMetadata.CategoryValue, 4)
    FUTURE_INSTANCE = typing___cast(StreamMetadata.CategoryValue, 5)
    POSE = typing___cast(StreamMetadata.CategoryValue, 6)
    UI_PRIMITIVE = typing___cast(StreamMetadata.CategoryValue, 7)
    type___Category = Category

    ScalarTypeValue = typing___NewType('ScalarTypeValue', builtin___int)
    type___ScalarTypeValue = ScalarTypeValue
    ScalarType: _ScalarType
    class _ScalarType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[StreamMetadata.ScalarTypeValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        STREAM_METADATA_SCALAR_TYPE_INVALID = typing___cast(StreamMetadata.ScalarTypeValue, 0)
        FLOAT = typing___cast(StreamMetadata.ScalarTypeValue, 1)
        INT32 = typing___cast(StreamMetadata.ScalarTypeValue, 2)
        STRING = typing___cast(StreamMetadata.ScalarTypeValue, 3)
        BOOL = typing___cast(StreamMetadata.ScalarTypeValue, 4)
    STREAM_METADATA_SCALAR_TYPE_INVALID = typing___cast(StreamMetadata.ScalarTypeValue, 0)
    FLOAT = typing___cast(StreamMetadata.ScalarTypeValue, 1)
    INT32 = typing___cast(StreamMetadata.ScalarTypeValue, 2)
    STRING = typing___cast(StreamMetadata.ScalarTypeValue, 3)
    BOOL = typing___cast(StreamMetadata.ScalarTypeValue, 4)
    type___ScalarType = ScalarType

    PrimitiveTypeValue = typing___NewType('PrimitiveTypeValue', builtin___int)
    type___PrimitiveTypeValue = PrimitiveTypeValue
    PrimitiveType: _PrimitiveType
    class _PrimitiveType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[StreamMetadata.PrimitiveTypeValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        STREAM_METADATA_PRIMITIVE_TYPE_INVALID = typing___cast(StreamMetadata.PrimitiveTypeValue, 0)
        CIRCLE = typing___cast(StreamMetadata.PrimitiveTypeValue, 1)
        IMAGE = typing___cast(StreamMetadata.PrimitiveTypeValue, 2)
        POINT = typing___cast(StreamMetadata.PrimitiveTypeValue, 3)
        POLYGON = typing___cast(StreamMetadata.PrimitiveTypeValue, 4)
        POLYLINE = typing___cast(StreamMetadata.PrimitiveTypeValue, 5)
        STADIUM = typing___cast(StreamMetadata.PrimitiveTypeValue, 6)
        TEXT = typing___cast(StreamMetadata.PrimitiveTypeValue, 7)
    STREAM_METADATA_PRIMITIVE_TYPE_INVALID = typing___cast(StreamMetadata.PrimitiveTypeValue, 0)
    CIRCLE = typing___cast(StreamMetadata.PrimitiveTypeValue, 1)
    IMAGE = typing___cast(StreamMetadata.PrimitiveTypeValue, 2)
    POINT = typing___cast(StreamMetadata.PrimitiveTypeValue, 3)
    POLYGON = typing___cast(StreamMetadata.PrimitiveTypeValue, 4)
    POLYLINE = typing___cast(StreamMetadata.PrimitiveTypeValue, 5)
    STADIUM = typing___cast(StreamMetadata.PrimitiveTypeValue, 6)
    TEXT = typing___cast(StreamMetadata.PrimitiveTypeValue, 7)
    type___PrimitiveType = PrimitiveType

    UIPrimitiveTypeValue = typing___NewType('UIPrimitiveTypeValue', builtin___int)
    type___UIPrimitiveTypeValue = UIPrimitiveTypeValue
    UIPrimitiveType: _UIPrimitiveType
    class _UIPrimitiveType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[StreamMetadata.UIPrimitiveTypeValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        STREAM_METADATA_UI_PRIMITIVE_TYPE_INVALID = typing___cast(StreamMetadata.UIPrimitiveTypeValue, 0)
        TREETABLE = typing___cast(StreamMetadata.UIPrimitiveTypeValue, 1)
    STREAM_METADATA_UI_PRIMITIVE_TYPE_INVALID = typing___cast(StreamMetadata.UIPrimitiveTypeValue, 0)
    TREETABLE = typing___cast(StreamMetadata.UIPrimitiveTypeValue, 1)
    type___UIPrimitiveType = UIPrimitiveType

    AnnotationTypeValue = typing___NewType('AnnotationTypeValue', builtin___int)
    type___AnnotationTypeValue = AnnotationTypeValue
    AnnotationType: _AnnotationType
    class _AnnotationType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[StreamMetadata.AnnotationTypeValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        STREAM_METADATA_ANNOTATION_TYPE_INVALID = typing___cast(StreamMetadata.AnnotationTypeValue, 0)
        VISUAL = typing___cast(StreamMetadata.AnnotationTypeValue, 1)
    STREAM_METADATA_ANNOTATION_TYPE_INVALID = typing___cast(StreamMetadata.AnnotationTypeValue, 0)
    VISUAL = typing___cast(StreamMetadata.AnnotationTypeValue, 1)
    type___AnnotationType = AnnotationType

    CoordinateTypeValue = typing___NewType('CoordinateTypeValue', builtin___int)
    type___CoordinateTypeValue = CoordinateTypeValue
    CoordinateType: _CoordinateType
    class _CoordinateType(google___protobuf___internal___enum_type_wrapper____EnumTypeWrapper[StreamMetadata.CoordinateTypeValue]):
        DESCRIPTOR: google___protobuf___descriptor___EnumDescriptor = ...
        STREAM_METADATA_COORDINATE_TYPE_INVALID = typing___cast(StreamMetadata.CoordinateTypeValue, 0)
        GEOGRAPHIC = typing___cast(StreamMetadata.CoordinateTypeValue, 1)
        IDENTITY = typing___cast(StreamMetadata.CoordinateTypeValue, 2)
        DYNAMIC = typing___cast(StreamMetadata.CoordinateTypeValue, 3)
        VEHICLE_RELATIVE = typing___cast(StreamMetadata.CoordinateTypeValue, 4)
    STREAM_METADATA_COORDINATE_TYPE_INVALID = typing___cast(StreamMetadata.CoordinateTypeValue, 0)
    GEOGRAPHIC = typing___cast(StreamMetadata.CoordinateTypeValue, 1)
    IDENTITY = typing___cast(StreamMetadata.CoordinateTypeValue, 2)
    DYNAMIC = typing___cast(StreamMetadata.CoordinateTypeValue, 3)
    VEHICLE_RELATIVE = typing___cast(StreamMetadata.CoordinateTypeValue, 4)
    type___CoordinateType = CoordinateType

    source: typing___Text = ...
    units: typing___Text = ...
    category: type___StreamMetadata.CategoryValue = ...
    scalar_type: type___StreamMetadata.ScalarTypeValue = ...
    primitive_type: type___StreamMetadata.PrimitiveTypeValue = ...
    ui_primitive_type: type___StreamMetadata.UIPrimitiveTypeValue = ...
    annotation_type: type___StreamMetadata.AnnotationTypeValue = ...
    coordinate: type___StreamMetadata.CoordinateTypeValue = ...
    transform: google___protobuf___internal___containers___RepeatedScalarFieldContainer[builtin___float] = ...
    transform_callback: typing___Text = ...

    @property
    def stream_style(self) -> xviz___v2___style_pb2___StyleStreamValue: ...

    @property
    def style_classes(self) -> google___protobuf___internal___containers___RepeatedCompositeFieldContainer[xviz___v2___style_pb2___StyleClass]: ...

    def __init__(self,
        *,
        source : typing___Optional[typing___Text] = None,
        units : typing___Optional[typing___Text] = None,
        category : typing___Optional[type___StreamMetadata.CategoryValue] = None,
        scalar_type : typing___Optional[type___StreamMetadata.ScalarTypeValue] = None,
        primitive_type : typing___Optional[type___StreamMetadata.PrimitiveTypeValue] = None,
        ui_primitive_type : typing___Optional[type___StreamMetadata.UIPrimitiveTypeValue] = None,
        annotation_type : typing___Optional[type___StreamMetadata.AnnotationTypeValue] = None,
        stream_style : typing___Optional[xviz___v2___style_pb2___StyleStreamValue] = None,
        style_classes : typing___Optional[typing___Iterable[xviz___v2___style_pb2___StyleClass]] = None,
        coordinate : typing___Optional[type___StreamMetadata.CoordinateTypeValue] = None,
        transform : typing___Optional[typing___Iterable[builtin___float]] = None,
        transform_callback : typing___Optional[typing___Text] = None,
        ) -> None: ...
    def HasField(self, field_name: typing_extensions___Literal[u"stream_style",b"stream_style"]) -> builtin___bool: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"annotation_type",b"annotation_type",u"category",b"category",u"coordinate",b"coordinate",u"primitive_type",b"primitive_type",u"scalar_type",b"scalar_type",u"source",b"source",u"stream_style",b"stream_style",u"style_classes",b"style_classes",u"transform",b"transform",u"transform_callback",b"transform_callback",u"ui_primitive_type",b"ui_primitive_type",u"units",b"units"]) -> None: ...
type___StreamMetadata = StreamMetadata

class CameraInfo(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    human_name: typing___Text = ...
    source: typing___Text = ...
    vehicle_position: google___protobuf___internal___containers___RepeatedScalarFieldContainer[builtin___float] = ...
    vehicle_orientation: google___protobuf___internal___containers___RepeatedScalarFieldContainer[builtin___float] = ...
    pixel_width: builtin___float = ...
    pixel_height: builtin___float = ...
    rectification_projection: google___protobuf___internal___containers___RepeatedScalarFieldContainer[builtin___float] = ...
    gl_projection: google___protobuf___internal___containers___RepeatedScalarFieldContainer[builtin___float] = ...

    def __init__(self,
        *,
        human_name : typing___Optional[typing___Text] = None,
        source : typing___Optional[typing___Text] = None,
        vehicle_position : typing___Optional[typing___Iterable[builtin___float]] = None,
        vehicle_orientation : typing___Optional[typing___Iterable[builtin___float]] = None,
        pixel_width : typing___Optional[builtin___float] = None,
        pixel_height : typing___Optional[builtin___float] = None,
        rectification_projection : typing___Optional[typing___Iterable[builtin___float]] = None,
        gl_projection : typing___Optional[typing___Iterable[builtin___float]] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"gl_projection",b"gl_projection",u"human_name",b"human_name",u"pixel_height",b"pixel_height",u"pixel_width",b"pixel_width",u"rectification_projection",b"rectification_projection",u"source",b"source",u"vehicle_orientation",b"vehicle_orientation",u"vehicle_position",b"vehicle_position"]) -> None: ...
type___CameraInfo = CameraInfo

class UIPanelInfo(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    name: typing___Text = ...
    needed_streams: google___protobuf___internal___containers___RepeatedScalarFieldContainer[typing___Text] = ...

    @property
    def config(self) -> google___protobuf___struct_pb2___Struct: ...

    def __init__(self,
        *,
        name : typing___Optional[typing___Text] = None,
        needed_streams : typing___Optional[typing___Iterable[typing___Text]] = None,
        config : typing___Optional[google___protobuf___struct_pb2___Struct] = None,
        ) -> None: ...
    def HasField(self, field_name: typing_extensions___Literal[u"config",b"config"]) -> builtin___bool: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"config",b"config",u"name",b"name",u"needed_streams",b"needed_streams"]) -> None: ...
type___UIPanelInfo = UIPanelInfo

class LogInfo(google___protobuf___message___Message):
    DESCRIPTOR: google___protobuf___descriptor___Descriptor = ...
    start_time: builtin___float = ...
    end_time: builtin___float = ...

    def __init__(self,
        *,
        start_time : typing___Optional[builtin___float] = None,
        end_time : typing___Optional[builtin___float] = None,
        ) -> None: ...
    def ClearField(self, field_name: typing_extensions___Literal[u"end_time",b"end_time",u"start_time",b"start_time"]) -> None: ...
type___LogInfo = LogInfo

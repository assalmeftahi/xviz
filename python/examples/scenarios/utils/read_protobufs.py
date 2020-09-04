from pathlib import Path

from google.protobuf.json_format import MessageToDict
from google.protobuf.message import DecodeError
from protobuf_APIs import collector_pb2, gandalf_pb2, falconeye_pb2, radar_pb2, camera_pb2

from .image import extract_image
from .com_manager import MqttConst


def deserialize_collector_output(file_path):
    try:
        collector_output = collector_pb2.CollectorOutputSlim()
        collector_output.ParseFromString(Path(file_path).read_bytes())
        is_slim_output = True
        
    except DecodeError as e:
        collector_output = collector_pb2.CollectorOutput()
        collector_output.ParseFromString(Path(file_path).read_bytes())
        is_slim_output = False
        
    return collector_output, is_slim_output


def extract_collector_output_slim(collector_ouput):
    if 'frame'in collector_output.data:
        frame = extract_image(collector_output.data['frame'])
    else:
        print('missing frame from collector output')
        frame = None
    
    if 'camera_output' in collector_output.data:
        camera_output = camera_pb2.CameraOutput()
        camera_output.ParseFromString(collector_output.data[MqttConst.CAMERA_TOPIC])
        camera_output = MessageToDict(camera_output, including_default_value_fields=True)
    else:
        print('missing camera output from collector output')
        camera_output = None

    if MqttConst.RADAR_TOPIC in collector_ouput.data:
        radar_output = radar_pb2.RadarOutput()
        radar_output.ParseFromString(collector_output.data[MqttConst.RADAR_TOPIC])
        radar_output = MessageToDict(radar_output, including_default_value_fields=True)
    else:
        radar_output = None
    
    if MqttConst.TRACKS_TOPIC in collector_ouput.data:
        tracking_output = falconeye_pb2.TrackingOutput()
        tracking_output.ParseFromString(collector_output.data[MqttConst.TRACKS_TOPIC])
        tracking_output = MessageToDict(tracking_output, including_default_value_fields=True)
    else:
        tracking_output = None

    if 'collector/data/machine_state' in collector_ouput.data:
        machine_state = gandalf_pb2.MachineState()
        machine_state.ParseFromString(collector_output.data['collector/data/machine_state'])
        machine_state = MessageToDict(machine_state, including_default_value_fields=True)
    else:
        machine_state = None

    return frame, camera_output, radar_output, tracking_output, machine_state


def extract_collector_output(collector_output):
    if collector_output.frame:
        frame = extract_image(collector_output.frame)
    else:
        print('missing frame from collector output')
        frame = None

    if collector_output.camera_output:
        camera_output = camera_pb2.CameraOutput()
        camera_output.ParseFromString(collector_output.camera_output)
        camera_output = MessageToDict(camera_output, including_default_value_fields=True)
    else:
        print('missing camera output from collector output')
        camera_output = None

    if collector_output.radar_output:
        radar_output = radar_pb2.RadarOutput()
        radar_output.ParseFromString(collector_output.radar_output)
        radar_output = MessageToDict(radar_output, including_default_value_fields=True)
    else:
        radar_output = None

    if collector_output.tracking_output:
        tracking_output = falconeye_pb2.TrackingOutput()
        tracking_output.ParseFromString(collector_output.tracking_output)
        tracking_output = MessageToDict(tracking_output, including_default_value_fields=True)
    else:
        tracking_output = None

    if collector_output.machine_state:
        machine_state = gandalf_pb2.MachineState()
        machine_state.ParseFromString(collector_output.machine_state)
        machine_state = MessageToDict(machine_state, including_default_value_fields=True)
    else:
        machine_state = None

    return frame, camera_output, radar_output, tracking_output, machine_state

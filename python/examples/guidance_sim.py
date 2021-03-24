import sys
import time
import math
from pathlib import Path
import matplotlib.pyplot as plt
from scenarios.utils.filesystem import get_collector_instances, load_config
from scenarios.utils.read_protobufs import deserialize_collector_output, \
    extract_collector_output_slim
from scenarios.utils.gis import lonlat_to_utm, get_wheel_angle

sys.path.append(str(Path(__file__).parents[2] / 'SmartHP-v2'))
from smarthp.gnc.guidance import Guidance, CTEGuidanceTask


plt.rcParams['figure.figsize'] = [16, 10]
plt.rcParams['savefig.facecolor'] = 'black'
plt.rcParams['figure.facecolor'] = 'black'
plt.rcParams['figure.edgecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'black'
plt.rcParams['axes.edgecolor'] = 'white'
plt.rcParams['axes.labelcolor'] = 'white'
plt.rcParams['axes.titlecolor'] = 'white'
plt.rcParams['xtick.color'] = 'white'
plt.rcParams['ytick.color'] = 'white'
# plt.rcParams['legend.facecolor'] = 'white'
plt.rcParams['text.color'] = 'white'
plt.rcParams["figure.autolayout"] = True


def get_planned_path(collector_instances):
    for collector_instance in collector_instances:

        collector_output, is_slim_output = deserialize_collector_output(
            collector_instance)

        if is_slim_output:
            _, _, _, _, _, _, planned_path, _, _, _ \
                = extract_collector_output_slim(collector_output)
        else:
            print('collector file is not campatible for running guidance sim')

        if planned_path is not None:
            if planned_path.size > 0:
                return planned_path.reshape(-1, 2)

    print('planned path never found in collector file')
    return None


def get_value_list(dict_list, k):
    '''
    return list of values for given key from a list of dicts
    '''
    return list(map(lambda x: x[k], dict_list))


def main():
    configfile = Path(__file__).parent \
        / 'scenarios' / 'collector-scenario-config.yaml'
    collector_config = load_config(str(configfile))

    collector_output_file = collector_config['collector_output_file']
    extract_directory = collector_config['extract_directory']
    collector_instances = get_collector_instances(collector_output_file,
                                                  extract_directory)

    if collector_config['IVT']:
        configfile = Path(__file__).parents[3] / 'Global-Configs' / \
            'Tractors' / 'John-Deere' / '8RIVT_WHEEL.yaml'
    else:
        configfile = Path(__file__).parents[3] / 'Global-Configs' / \
            'Tractors' / 'John-Deere' / '8RPST_WHEEL.yaml'

    global_config = load_config(str(configfile))

    planned_path = get_planned_path(collector_instances)
    waypoints = list(map(tuple, planned_path))

    guidance_states = []
    control_signals = []

    for collector_instance in collector_instances:

        collector_output, is_slim_output = deserialize_collector_output(
            collector_instance)

        if is_slim_output:
            _, _, _, _, machine_state, _, _, _, control_signal, _ \
                = extract_collector_output_slim(collector_output)
        else:
            print('collector file is not campatible for running guidance sim')
            return

        if machine_state is not None:
            utm_zone = machine_state['opState']['refUtmZone']
            vehicle_states = machine_state['vehicleStates']
            tractor_state_updated = False
            for vehicle, state in vehicle_states.items():
                if vehicle == 'tractor':
                    tractor_state = state
                    tractor_state_updated = True
                    break
            if not tractor_state_updated:
                continue
        else:
            continue
        
        tractor_theta = (90 - tractor_state['heading']) * math.pi / 180
        tractor_easting, tractor_northing = lonlat_to_utm(
            tractor_state['longitude'],
            tractor_state['latitude'],
            utm_zone,
        )
        guidance_state = dict(
            utm_pos=(tractor_easting, tractor_northing),
            heading=tractor_state['heading'],
            veh_speed=tractor_state['speed'],
        )
        guidance_states.append(guidance_state)

        if control_signal is not None:
            control_signals.append(control_signal)

    simulated_control_signals = simulate_guidance(guidance_states,
                                                  waypoints, global_config)

    fig, ax = plt.subplots()

    tractor_pos = get_value_list(guidance_states, 'utm_pos')

    ax.plot(*zip(*waypoints), label='planned path')
    ax.plot(*zip(*tractor_pos), label='tractor position')

    ax.set_aspect('equal')
    ax.set_title('Path Tracking')
    ax.set_xlabel('utm easting')
    ax.set_ylabel('utm northing')
    ax.legend()

    plt.show()
    plt.close()

    fig, ax = plt.subplots(nrows=1, ncols=2)

    wheel_base = global_config['guidance']['wheel_base']

    actual_commanded_speeds = get_value_list(control_signals, 'setSpeed')
    actual_commanded_curvatures = get_value_list(control_signals, 'commandCurvature')
    actual_commanded_wheel_angles = list(map(
        lambda x: get_wheel_angle(x, wheel_base) * 180 / math.pi,
        actual_commanded_curvatures))

    simulated_commanded_speeds = get_value_list(simulated_control_signals,
                                                'set_speed')
    simulated_commanded_curvatures = get_value_list(simulated_control_signals,
                                                'curvature')
    simulated_commanded_wheel_angles = list(map(
        lambda x: get_wheel_angle(x, wheel_base) * 180 / math.pi,
        simulated_commanded_curvatures))

    ax[0].plot(actual_commanded_speeds, label='actual command')
    ax[0].plot(simulated_commanded_speeds, label='simulated command')
    ax[1].plot(actual_commanded_wheel_angles, label='actual command')
    ax[1].plot(simulated_commanded_wheel_angles, label='simulated command')

    ax[0].set_title('Speed Control')
    ax[0].set_xlabel('discrete timesteps ~0.1s')
    ax[0].set_ylabel('commanded speed (m/s)')
    ax[0].legend()

    ax[1].set_title('Steering Control')
    ax[1].set_xlabel('discrete timesteps ~0.1s')
    ax[1].set_ylabel('commanded wheel angles (degrees)')
    ax[1].legend()

    plt.show()
    plt.close()


def simulate_guidance(guidance_states, waypoints, global_config):
    guidance = Guidance()
    route_task = CTEGuidanceTask(
        waypoints,
        config=global_config,
        stop_on_target=True)
    guidance.add_task(route_task)
    guidance.start_pending()
    guidance.set_config(global_config)

    control_commands = []

    delay = 1. / global_config['guidance_loop_rate']
    for gs in guidance_states:
        t = time.time()

        control_command = guidance.run(gs)
        if control_command is None:
            control_command = {
                'set_speed': 0.0,
                'curvature': 0.0,
            }
        control_commands.append(control_command)

        dt = time.time() - t
        if dt >= delay:
            print('guidance simulation loop took too long: ', dt)
        else:
            time.sleep(delay - dt)

    return control_commands

if __name__ == '__main__':
    main()
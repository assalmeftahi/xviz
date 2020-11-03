import math
import functools as ft
import utm
import numpy as np


def lonlat_array_to_local(tractor_state, utm_zone, arr):
    lon, lat = arr[:, 0], arr[:, 1]
    utm_array = np.array(list(map(
        ft.partial(lonlat_to_utm, zone=utm_zone),
        lon, lat
    )))

    return utm_array_to_local(tractor_state, utm_zone, utm_array)


def utm_array_to_local(tractor_state, utm_zone, arr):
    translate_x, translate_y = arr[:, 0], arr[:, 1]
    tractor_x, tractor_y = lonlat_to_utm(tractor_state['longitude'], tractor_state['latitude'], utm_zone)
    xy_array = np.array(list(map(
        ft.partial(utm_to_local, tractor_x, tractor_y, tractor_state['heading']),
        translate_x, translate_y
    )))

    return xy_array
    

def transform_combine_to_local(combine_state, tractor_state, utm_zone):
    combine_x, combine_y = lonlat_to_utm(combine_state['longitude'], combine_state['latitude'], utm_zone)
    tractor_x, tractor_y = lonlat_to_utm(tractor_state['longitude'], tractor_state['latitude'], utm_zone)
    dx, dy = utm_to_local(tractor_x, tractor_y, tractor_state['heading'], combine_x, combine_y)

    return dx, dy


def lonlat_to_utm(lon, lat, zone):
    zone_number, zone_letter = parse_utm_zone(zone)
    converted = utm.from_latlon(
        lat, lon,
        force_zone_number=zone_number,
        force_zone_letter=zone_letter
    )

    return converted[0], converted[1]  # only return easting, northing


def parse_utm_zone(zone):
    if not zone:
        return None, None
    index = 0
    zone_num = ''
    while zone[index].isdigit():
        zone_num += zone[index]
        index += 1

    return int(zone_num), zone[index]


def utm_to_local(reference_x, reference_y, heading, translate_x, translate_y):
    theta = (math.pi / 2.0) - (heading * math.pi / 180.0)
    dx_a = translate_x - reference_x
    dy_a = translate_y - reference_y
    dx = (math.cos(theta) * dx_a) + (math.sin(theta) * dy_a)
    dy = -(math.sin(theta) * dx_a) + (math.cos(theta) * dy_a)

    return dx, dy


def get_combine_region(gps_x, gps_y, theta, combine_length, combine_width,
                       header_length, header_width, combine_gps_to_center):
    half_combine_length = combine_length / 2.0
    half_combine_width = combine_width / 2.0
    half_header_width = header_width / 2.0
    center_to_header_front = half_combine_length + header_length

    center_x, center_y = get_relative_xy(gps_x, gps_y, -combine_gps_to_center, 0.0, theta)

    front_head_left = get_relative_xy(center_x, center_y, center_to_header_front, half_header_width, theta)
    front_head_right = get_relative_xy(center_x, center_y, center_to_header_front, -half_header_width, theta)
    back_head_left = get_relative_xy(center_x, center_y, half_combine_length, half_header_width, theta)
    back_head_right = get_relative_xy(center_x, center_y, half_combine_length, -half_header_width, theta)
    front_body_left = get_relative_xy(center_x, center_y, half_combine_length, half_combine_width, theta)
    front_body_right = get_relative_xy(center_x, center_y, half_combine_length, -half_combine_width, theta)
    back_left = get_relative_xy(center_x, center_y, -half_combine_length, half_combine_width, theta)
    back_right = get_relative_xy(center_x, center_y, -half_combine_length, -half_combine_width, theta)

    return np.row_stack((
        front_head_left,
        front_head_right,
        back_head_right,
        front_body_right,
        back_right,
        back_left,
        front_body_left,
        back_head_left,
        front_head_left
    ))


def get_relative_xy(X, Y, dx, dy, theta):
    return (X + dx*math.cos(theta) - dy*math.sin(theta),
            Y + dx*math.sin(theta) + dy*math.cos(theta))


def polar_to_cartesian(theta, r):
    return (r * math.cos(theta), r * math.sin(theta))


def euclidean_distance(x0, y0, x1, y1):
    return math.sqrt((x1-x0)**2 + (y1-y0)**2)

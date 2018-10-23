import json
import socket
import sys
from six.moves import urllib


HEADERS = {'Accept': 'application/json',
           'Content-Type': 'application/json',
           'User-Agent': 'magicboard-' + socket.gethostname(),
           'ET-Client-Name': 'magicboard-' + socket.gethostname(),
           'ET-Client-ID': socket.gethostname()}

GRAPHQL_ENDPOINT = "https://api.entur.org/journeyplanner/2.0/index/graphql"
CONNECT_TIMEOUT_SECONDS = 15


def to_node(type, message):
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    sys.stdout.flush()


def send_graphql_query(variables, min_coordinates, max_coordinates):
    query = """
    {
        bikeRentalStationsByBbox(
            minimumLatitude:""" + str(min_coordinates.latitude) + """,
            minimumLongitude:""" + str(min_coordinates.longitude) + """,
            maximumLatitude:""" + str(max_coordinates.latitude) + """,
            maximumLongitude:""" + str(max_coordinates.longitude) + """){
                id,
                name,
                description,
                latitude,
                longitude,
                bikesAvailable,
                spacesAvailable
        }  
    }
    """

    data = {'query': query, 'variables': variables}
    req = urllib.request.Request(GRAPHQL_ENDPOINT, json.dumps(data).encode('utf-8'), HEADERS)
    response = urllib.request.urlopen(req, timeout=CONNECT_TIMEOUT_SECONDS)

    return response.read().decode('utf-8')


def find_close_stations():
    import geopy.distance
    from geopy.distance import VincentyDistance

    longitude = sys.argv[1]
    latitude = sys.argv[2]
    max_distance = float(sys.argv[3])

    origin = geopy.Point(latitude, longitude)

    min_coordinates = VincentyDistance(meters=max_distance).destination(origin, 225)
    max_coordinates = VincentyDistance(meters=max_distance).destination(origin, 45)

    return send_graphql_query({}, min_coordinates, max_coordinates)


def create_geojson():
    stations = json.loads(find_close_stations())

    stations = stations["data"]["bikeRentalStationsByBbox"]

    features = []
    for station in stations:
        sum_bikes = station["bikesAvailable"] + station["spacesAvailable"]

        station_geojson = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [station["longitude"], station["latitude"]]}, "properties": {"title": station["name"] + "\n" + str(station["bikesAvailable"]) + "/" + str(sum_bikes) + " bikes available", "icon": "citybike"}}
        features.append(station_geojson)

    stations_geojson = {"type": "FeatureCollection", "features": features}
    to_node("stations", stations_geojson)


create_geojson()

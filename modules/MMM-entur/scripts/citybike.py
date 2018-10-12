import json
import socket
import sys
from six.moves import urllib


HEADERS = {'Accept': 'application/json',
           'Content-Type': 'application/json',
           'User-Agent': 'python-code-example-' + socket.gethostname(),
           'ET-Client-Name': 'python-code-example-' + socket.gethostname(),
           'ET-Client-ID': socket.gethostname()}

GRAPHQL_ENDPOINT = "https://api.entur.org/journeyplanner/2.0/index/graphql"
CONNECT_TIMEOUT_SECONDS = 15


def to_node(type, message):
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    sys.stdout.flush()


def sendGraphqlQuery(variables):
    query = """
    {
      bikeRentalStations
      {
        id,
        name,
        description,
        bikesAvailable,
        spacesAvailable,
        realtimeOccupancyAvailable,
        allowDropoff,
        networks,
        longitude,
        latitude
      }
    }
    """
    data = {'query': query, 'variables': variables}

    req = urllib.request.Request(GRAPHQL_ENDPOINT, json.dumps(data).encode('utf-8'), HEADERS)

    response = urllib.request.urlopen(req, timeout=CONNECT_TIMEOUT_SECONDS)
    return response.read().decode('utf-8')


def findCloseStations(stations):
    import geopy.distance

    close_stations = []

    longitude = sys.argv[1]
    latitude = sys.argv[2]
    max_distance = float(sys.argv[3])

    stations = json.loads(stations)
    for station in stations["data"]["bikeRentalStations"]:
        distance = geopy.distance.vincenty((latitude, longitude), (station["latitude"], station["longitude"])).m
        if distance <= max_distance:
            close_stations.append(station)

    return close_stations


response = sendGraphqlQuery({})
to_node("stations", findCloseStations(response))


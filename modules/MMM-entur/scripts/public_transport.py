import geopy.distance
from geopy.distance import VincentyDistance
import sys
import socket
import json
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


def send_graphql_query(min_coordinates, max_coordinates):
    query = """
    {
        stopPlacesByBbox(
            minimumLatitude:""" + str(min_coordinates.latitude) + """,
            minimumLongitude:""" + str(min_coordinates.longitude) + """,
            maximumLatitude:""" + str(max_coordinates.latitude) + """,
            maximumLongitude:""" + str(max_coordinates.longitude) + """)
        
        {    
            id,
            name,
            latitude,
            longitude,
            estimatedCalls(numberOfDepartures: 5) {     
                realtime
                aimedArrivalTime
                aimedDepartureTime
                expectedArrivalTime
                expectedDepartureTime
                date
            
        
            destinationDisplay {
                frontText
            }
            
            serviceJourney {
                journeyPattern {
                    line {
                        id
                        name
                        transportMode
                        }
                    }
                }
            }
        }
    }
    """


    data = {'query': query}

    req = urllib.request.Request(GRAPHQL_ENDPOINT, json.dumps(data).encode('utf-8'), HEADERS)

    response = urllib.request.urlopen(req, timeout=CONNECT_TIMEOUT_SECONDS)
    return response.read().decode('utf-8')


def create_geojson(stations):
    stations = stations["data"]["stopPlacesByBbox"]

    features = []
    for station in stations:
        transport_mode_list = []

        if(station["estimatedCalls"] == []):
            continue


        for estimated_calls in station["estimatedCalls"]:
            transport_mode = estimated_calls["serviceJourney"]["journeyPattern"]["line"]["transportMode"]
            if transport_mode not in transport_mode_list:
                transport_mode_list.append(transport_mode)

        if(len(transport_mode_list) > 1):
            icon = "mixed"
        elif(len(transport_mode_list) == 1):
            icon = transport_mode_list[0]

        else:
            icon = None

        station_geojson = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [station["longitude"], station["latitude"]]}, "properties": {"title": station["name"], "icon": icon}}

        features.append(station_geojson)

    stations_geojson = {"type": "FeatureCollection", "features": features}
    to_node("stations", stations_geojson)
    return features



latitude, longitude = 59.916674, 10.762450

max_distance = 1000

origin = geopy.Point(latitude, longitude)

min_coordinates = VincentyDistance(meters=max_distance).destination(origin, 225)
max_coordinates = VincentyDistance(meters=max_distance).destination(origin, 45)
response = json.loads(send_graphql_query(min_coordinates, max_coordinates))


geojson = create_geojson(response)

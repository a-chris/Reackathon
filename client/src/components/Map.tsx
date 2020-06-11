import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';
import * as _ from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Hackathon, Location } from '../models/Models';
import { GOOGLE_KEY } from '../utils/constants';

type MapProps = {
    hackathons?: Hackathon[];
    style?: {};
};

const defaultMapStyle = {
    height: '100%',
    width: '50%',
};

const center = {
    lat: 41.69246,
    lng: 12.5736108,
};

export function MapContainer(props: MapProps) {
    const history = useHistory();
    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback((map) => {
        console.log('TCL: MapContainer -> map', map);
        // const bounds = new window.google.maps.LatLngBounds();
        // map.fitBounds(bounds);
        // setMap(map);
    }, []);

    const onUnmount = React.useCallback((map) => {
        setMap(null);
    }, []);

    const onMarkerClustererClick = (markerClusterer: any) => {
        const clickedMarkers = markerClusterer.getMarkers();
        console.log(`Current clicked markers length: ${clickedMarkers.length}`);
        console.log(clickedMarkers);
    };

    const onMarkerClick = (id: string) => {
        history.push('/hackathons/' + id);
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_KEY} id={_.uniqueId('gmaps-')}>
            <GoogleMap
                mapContainerStyle={props.style || defaultMapStyle}
                center={center}
                zoom={6}
                onLoad={onLoad}
                onUnmount={onUnmount}>
                {props.hackathons != null && (
                    <MarkerClusterer
                        onClick={onMarkerClustererClick}
                        averageCenter
                        enableRetinaIcons
                        gridSize={30}
                        minimumClusterSize={2}>
                        {(clusterer) =>
                            props.hackathons != null &&
                            props.hackathons.map((h) => (
                                <Marker
                                    key={createKey(h.location)}
                                    position={getPosition(h.location)}
                                    clusterer={clusterer}
                                    onClick={() => onMarkerClick(h._id)}
                                />
                            ))
                        }
                    </MarkerClusterer>
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default React.memo(MapContainer);

function getPosition(location: Location): any {
    return {
        lat: location.lat,
        lng: location.long,
    };
}

function createKey(location: Location): string {
    return `${location.lat}${location.long}`;
}

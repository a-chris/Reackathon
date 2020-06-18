import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';
import _ from 'lodash';
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

function MapContainer(props: MapProps) {
    const history = useHistory();

    const onMarkerClick = (id: string) => {
        history.push('/hackathons/' + id);
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_KEY} id={_.uniqueId('gmaps-')}>
            <GoogleMap mapContainerStyle={props.style || defaultMapStyle} center={center} zoom={6}>
                {props.hackathons != null && (
                    <MarkerClusterer
                        averageCenter
                        enableRetinaIcons
                        gridSize={30}
                        minimumClusterSize={2}>
                        {(clusterer) =>
                            props.hackathons != null &&
                            props.hackathons.map((h, index) => (
                                <Marker
                                    key={_.uniqueId(index.toString())}
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

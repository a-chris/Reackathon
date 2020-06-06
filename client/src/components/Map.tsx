import React from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { useHistory } from 'react-router-dom';
import { compose, withHandlers, withProps } from 'recompose';
import { Hackathon } from '../models/Models';
import { GOOGLE_KEY } from '../utils/constants';

type MapProps = {
    hackathons?: Hackathon[];
    style?: {};
};

const defaultMapStyle = {
    height: `100%`,
    width: '50%',
};

export function MapContainer({ hackathons, style }: MapProps) {
    const history = useHistory();

    const MyMapComponent = compose(
        withProps({
            googleMapURL:
                'https://maps.googleapis.com/maps/api/js?key=' +
                GOOGLE_KEY +
                '&libraries=geometry,drawing,places',
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={style || defaultMapStyle} />,
            mapElement: <div style={{ height: `100%` }} />,
        }),
        withHandlers({
            onMarkerClustererClick: () => (markerClusterer: any) => {
                const clickedMarkers = markerClusterer.getMarkers();
                console.log(`Current clicked markers length: ${clickedMarkers.length}`);
                console.log(clickedMarkers);
            },
        }),
        withScriptjs,
        withGoogleMap
    )((props: any) => (
        <GoogleMap
            defaultZoom={6}
            defaultCenter={{
                lat: 41.69246,
                lng: 12.5736108,
            }}>
            <MarkerClusterer
                onClick={props.onMarkerClustererClick}
                averageCenter
                enableRetinaIcons
                gridSize={30}
                minimumClusterSize={2}>
                {hackathons?.map((hackathons, index) => (
                    <Marker
                        key={hackathons.name + index}
                        onClick={() => history.push('/hackathons/' + hackathons._id)}
                        position={{
                            lat: hackathons.location.lat,
                            lng: hackathons.location.long,
                        }}
                    />
                ))}
            </MarkerClusterer>
        </GoogleMap>
    ));
    return <MyMapComponent />;
}

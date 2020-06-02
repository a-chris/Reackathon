import React from 'react';
import { useHistory } from 'react-router-dom';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { withProps, compose, withHandlers } from 'recompose';
import { GOOGLE_KEY } from '../utils/constants';
import { withGoogleMap, GoogleMap, withScriptjs, Marker } from 'react-google-maps';
import { Hackathon } from '../models/Models';
// import Geocode from "react-geocode";
// Geocode.setApiKey("AIzaSyDGe5vjL8wBmilLzoJ0jNIwe9SAuH2xS_0");
// Geocode.enableDebug();

type MapProps = {
    hackathons: Hackathon[] | undefined;
    style?: { width: string };
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
            containerElement: (
                <div style={{ height: `100%`, width: style?.width ? style.width : '50%' }} />
            ),
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

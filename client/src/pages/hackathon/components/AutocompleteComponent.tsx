import { Input } from '@chakra-ui/core';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import _ from 'lodash';
import React from 'react';
import { GOOGLE_KEY } from '../../../utils/constants';

type AutocompleteComponentProps = {
    id?: string;
    onPlaceChanged: (location: any, missingData: string[] | []) => void;
};

const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    administrative_area_level_2: 'short_name',
    administrative_area_level_3: 'short_name',
    country: 'long_name',
    postal_code: 'short_name',
};

const locationFieldsMapping = {
    street_number: 'number',
    route: 'street',
    locality: 'city',
    administrative_area_level_3: 'city',
    administrative_area_level_2: 'province',
    administrative_area_level_1: 'region',
    country: 'country',
    postal_code: 'zip_code',
};

export default function AutocompleteComponent(props: AutocompleteComponentProps) {
    const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete>();

    function onLoad(autocompleteRes: google.maps.places.Autocomplete) {
        setAutocomplete(autocompleteRes);
    }

    function onPlaceChanged() {
        if (autocomplete != null) {
            const autocompletePlace = autocomplete.getPlace();
            const locationData: any = {};
            const missingData = [];

            // address fields
            autocompletePlace?.address_components?.forEach((component) =>
                component.types.forEach((field) => {
                    if (componentForm.hasOwnProperty(field)) {
                        const componentField = (componentForm as any)[field];
                        const fieldName = (locationFieldsMapping as any)[field];
                        locationData[fieldName] = (component as any)[componentField];
                    }
                })
            );

            _.forEach(locationFieldsMapping, (field: string) =>
                locationData[field] == null ? missingData.push(field) : null
            );

            // location coordinates
            if (autocompletePlace.geometry) {
                locationData.lat = autocompletePlace.geometry.location.lat();
                locationData.long = autocompletePlace.geometry.location.lng();
            } else {
                missingData.push('long', 'lat');
            }

            props.onPlaceChanged(locationData, missingData);
        } else {
            console.warn('Autocomplete is not loaded yet!');
        }
    }

    return (
        <LoadScript
            googleMapsApiKey={GOOGLE_KEY}
            id={_.uniqueId('gmaps-')}
            libraries={['places']}
            language='it'>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Input
                    id={props.id || 'autocompleteLocation'}
                    placeholder='cerca...'
                    defaultValue={''}
                    onChange={() => props.onPlaceChanged(undefined, [])}
                />
            </Autocomplete>
        </LoadScript>
    );
}

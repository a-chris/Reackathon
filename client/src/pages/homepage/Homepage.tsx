import React from 'react';
import { MapContainer } from '../../components/Map';
import { getHackathons } from '../../services/HackathonService';
import { Hackathon } from '../../models/Models';
import { Stack, PseudoBox, Grid, Box, Heading } from '@chakra-ui/core';
import { Link } from 'react-router-dom';

const initialFilter = { country: 'Italy' };

export default function Homepage() {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>();
    const [cities, setCities] = React.useState<Set<String>>(new Set());

    React.useEffect(() => {
        getHackathons(initialFilter).then((hackathons) => {
            setHackathons(hackathons);
            setCities(new Set(hackathons.map((el) => el.location.city)));
        });
    }, []);

    return (
        <PseudoBox w={'100%'} h={'100%'}>
            <Stack w={'100%'} h={'100%'} isInline spacing={8} bg='#000000'>
                <MapContainer hackathons={hackathons} />
                <Stack>
                    <PseudoBox>Trova l'Hackathon più adatto a te!</PseudoBox>
                </Stack>
            </Stack>
            {cities.size > 0 && (
                <PseudoBox p={8}>
                    <Heading as='h2' p={5}>
                        Scopri le città con i prossimi Hackathon
                    </Heading>
                    <Grid templateColumns={'repeat(' + cities.size + ', 1fr)'} gap={6}>
                        {[...cities]?.map((city, index) => (
                            <Link to={'hackathons?city=' + city} key={index}>
                                <Box w='20%' h='10' bg='blue.500' verticalAlign='middle'>
                                    <p>{city}</p>
                                </Box>
                            </Link>
                        ))}
                    </Grid>
                </PseudoBox>
            )}
        </PseudoBox>
    );
}

import React from 'react';
import { MapContainer } from '../../components/Map';
import { getHackathons } from '../../services/HackathonService';
import { Hackathon } from '../../models/Models';
import { Stack, PseudoBox, Grid, Box, Heading, Image } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import { yellow } from '../../utils/colors';

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
        <Box w={'100%'} h={'100%'}>
            <Box h={'100%'} bg={yellow}>
                {cities.size > 0 && (
                    <Box p={8}>
                        <Heading as='h2' p={10}>
                            Scopri le città con i prossimi Hackathon
                        </Heading>
                        <Grid templateColumns={'repeat(4, 1fr)'} gap={6} alignItems='center'>
                            {[...cities]?.map((city, index) => (
                                <Link to={'hackathons?city=' + city} key={index}>
                                    <Box w='100%' bg='blue.200' verticalAlign='middle'>
                                        <Image
                                            src={'./images/cities/' + city.toLowerCase() + '.jpg'}
                                            fallbackSrc='./images/cities/city.jpg'
                                            alt={'immagine della città di ' + city}
                                        />
                                        <Heading as='h3'>{city}</Heading>
                                        {console.log(
                                            "url('./images/cities/" + city.toLowerCase() + ".jpg')"
                                        )}
                                    </Box>
                                </Link>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
            <Box w={'100%'} h={'100%'} display={{ md: 'flex' }}>
                <Stack>
                    <PseudoBox>Trova l'Hackathon più adatto a te!</PseudoBox>
                </Stack>
            </Box>
            <Box>
                <Heading as='h3' p={10}>
                <MapContainer
                    hackathons={hackathons}
                    style={{ width: '100%', minHeight: '100vh' }}
                />
                    Stai organizzando un Hackathon?
                </Heading>
                <Heading as='h4'>
                    Registrati sulla piattaforma e dai visibilità al tuo Hackathon
                </Heading>
            </Box>
        </Box>
    );
}

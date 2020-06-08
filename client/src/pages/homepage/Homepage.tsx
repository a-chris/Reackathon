import { Box, Button, Flex, Heading, Select, SimpleGrid, Stack } from '@chakra-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MapContainer } from '../../components/Map';
import { Hackathon, HackathonStatus } from '../../models/Models';
import { getHackathons } from '../../services/HackathonService';
import colors from '../../utils/colors';

const initialFilter = { country: 'Italy', status: HackathonStatus.PENDING };

const CITY_TO_SHOW = 6;

const BackgroundImageStyleProps = {
    w: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
};

export default function Homepage() {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>();
    const [cities, setCities] = React.useState<Set<string>>(new Set());
    const [selectedCity, setSelectedCity] = React.useState<string>();

    React.useEffect(() => {
        getHackathons(initialFilter).then((hackathons) => {
            setHackathons(hackathons);
            setCities(new Set(hackathons.map((el) => el.location.city)));
        });
    }, []);

    const citiesToDisplay = [...cities]?.slice(0, Math.min(CITY_TO_SHOW, cities.size));

    const onFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event?.target;
        if (value != null) {
            setSelectedCity(value);
        }
    };

    return (
        <StyledContainer>
            <FlexContainer>
                <SimpleResponsiveGrid>
                    <Flex alignSelf='center' color={colors.white} pr={0}>
                        <Stack p={[50, 45, 35, 30]} textAlign='center'>
                            <Heading as='h1' size='2xl' m='auto'>
                                Entra nel mondo degli Hackathon!
                            </Heading>
                            <Heading p='5%' as='h2' fontSize='xl'>
                                Entra a far parte della piattaforma di Hackathon numero uno.
                                <br />
                                Iscriviti ad un Hackathon, crea il tuo team ed esprimi il tuo
                                talento!
                            </Heading>
                        </Stack>
                    </Flex>
                    <Box bg={colors.white} w='70%' h='100%' m='auto' borderRadius='md'>
                        <Flex textAlign='center'>
                            <Stack spacing={8} p='8%' w='100%'>
                                <Heading as='h2' size='lg' p={5}>
                                    Trova l'Hackathon che fa per te
                                </Heading>
                                <Box>
                                    <label>
                                        Seleziona una città
                                        <Select
                                            onChange={onFilterChange}
                                            placeholder='Seleziona una città'>
                                            {Array.from(cities).map((city) => (
                                                <option key={city} value={city} label={city} />
                                            ))}
                                        </Select>
                                    </label>
                                    <Link
                                        to={
                                            selectedCity != null
                                                ? `/hackathons?city=${selectedCity}`
                                                : '/hackathons'
                                        }>
                                        <StyledBlueButton>Vai</StyledBlueButton>
                                    </Link>
                                </Box>
                            </Stack>
                        </Flex>
                    </Box>
                </SimpleResponsiveGrid>
            </FlexContainer>
            <Box>
                {cities.size > 0 && (
                    <Box p={10} pb='10%' pt={30}>
                        <Heading as='h2' p={10}>
                            Scopri le città con i prossimi Hackathon
                        </Heading>
                        <SimpleGrid
                            columns={[1, Math.min(2, cities.size), Math.min(3, cities.size)]}
                            spacing={5}
                            alignItems='center'>
                            {citiesToDisplay.map((city, index) => (
                                <Link to={`hackathons?city=${city}`} key={index}>
                                    <StyledBlueBox
                                        verticalAlign='middle'
                                        maxW='500px'
                                        m='auto'
                                        borderRadius='md'
                                        border={`2px solid ${colors.blue_night}`}
                                        boxShadow={`-1px 2px 10px ${colors.blue_night}`}>
                                        <Box
                                            h={'200px'}
                                            bg={colors.blue_light}
                                            backgroundImage={`url('./images/cities/${city.toLowerCase()}.jpg')`}
                                            backgroundPosition='bottom'
                                            {...BackgroundImageStyleProps}
                                        />
                                        <Heading as='h3' size='lg'>
                                            {city}
                                        </Heading>
                                    </StyledBlueBox>
                                </Link>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}
            </Box>
            <StyledBlueBox>
                <SimpleResponsiveGrid>
                    <MapContainer
                        hackathons={hackathons}
                        style={{ width: '100%', minHeight: '90vh' }}
                    />
                    <Flex alignSelf='center' p='8%'>
                        <Heading as='h3' size='xl' m='auto'>
                            Oppure cerca i prossimi Hackathon direttamente sulla mappa
                        </Heading>
                    </Flex>
                </SimpleResponsiveGrid>
            </StyledBlueBox>
            <Box p='5%'>
                <Heading as='h3' size='xl' p={10}>
                    Stai organizzando un Hackathon?
                </Heading>
                <Heading as='h4' size='md' m={2}>
                    <p>Registrati sulla piattaforma e dai visibilità al tuo evento</p>
                    <Link to='/signup'>
                        <StyledBlueButton>Registrati</StyledBlueButton>
                    </Link>
                </Heading>
            </Box>
            <StyledBlueBox p='2%' textAlign='left'>
                ©Copyright 2020 - Giada Boccali &bull; Antonio Christian Toscano
            </StyledBlueBox>
        </StyledContainer>
    );
}

const FlexContainer: React.FC<{}> = (props) => {
    return (
        <Flex
            alignItems='center'
            justifyContent='center'
            h='fit-content'
            p='10% 0'
            backgroundImage="url('./images/background/space-min.jpg')"
            {...BackgroundImageStyleProps}>
            {props.children}
        </Flex>
    );
};

const SimpleResponsiveGrid: React.FC<{}> = (props) => {
    return (
        <SimpleGrid h='100%' columns={[1, 1, 2, 2]}>
            {props.children}
        </SimpleGrid>
    );
};

const StyledContainer = styled(Box)`
    text-align: center;
`;

const StyledBlueButton = styled(Button).attrs({
    bg: colors.blue_night,
    color: colors.white,
    margin: 5,
    pl: '2.5rem',
    pr: '2.5rem',
    rounded: 'md',
})``;

const StyledBlueBox = styled(Box).attrs({
    bg: colors.blue_night,
    color: colors.white,
})``;

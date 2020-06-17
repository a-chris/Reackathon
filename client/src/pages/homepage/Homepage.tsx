import { Box, Button, Flex, Heading, Select, SimpleGrid, Stack } from '@chakra-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MapContainer from '../../components/Map';
import { Hackathon, HackathonStatus } from '../../models/Models';
import { getAvailableCities } from '../../services/FilterService';
import { getHackathons } from '../../services/HackathonService';
import colors from '../../utils/colors';
import { BoxFullHeightAfterHeader } from '../../components/Common';
import { AppContext } from '../../AppContext';

const initialFilter = { country: 'Italy', status: HackathonStatus.PENDING };

const CITY_TO_SHOW = 6;

const BackgroundImageStyleProps = {
    w: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
};

export default function Homepage() {
    const appContext = React.useContext(AppContext);
    const [hackathons, setHackathons] = React.useState<Hackathon[]>();
    const [cities, setCities] = React.useState<string[]>([]);
    const [selectedCity, setSelectedCity] = React.useState<string>();

    React.useEffect(() => {
        getAvailableCities().then((cities) => setCities(cities));
        getHackathons(initialFilter).then((hackathons) => {
            setHackathons(hackathons);
        });
    }, []);

    const citiesToDisplay = [...cities]?.slice(0, Math.min(CITY_TO_SHOW, cities.length));

    const onFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event?.target;
        if (value != null) {
            setSelectedCity(value);
        }
    };

    const isLogged = appContext.state?.user != null;

    return (
        <StyledContainer>
            <BoxFullHeightAfterHeader isLogged={isLogged}>
                <FlexContainer>
                    <SimpleResponsiveGrid>
                        <Flex alignSelf='center' color={colors.white} pr={0}>
                            <Stack p={[50, 45, 35, 30]} textAlign='center'>
                                <Heading
                                    as='h1'
                                    size='2xl'
                                    m='auto'
                                    textShadow={`2px 1px 5px ${colors.black}`}>
                                    Entra nel mondo degli Hackathon!
                                </Heading>
                                <Box p='5%'>
                                    <Heading
                                        as='h2'
                                        fontSize='xl'
                                        textShadow={`4px 4px 10px ${colors.black}`}>
                                        Entra a far parte della piattaforma di Hackathon numero uno.
                                        <br />
                                        Iscriviti ad un Hackathon, crea il tuo team ed esprimi il
                                        tuo talento!
                                    </Heading>
                                </Box>
                            </Stack>
                        </Flex>
                        <Box bg={colors.white} w='70%' m='auto' borderRadius='md'>
                            <Flex>
                                <Stack spacing={8} p='8%' w='100%'>
                                    <Heading as='h2' size='lg' p={5}>
                                        Trova l'Hackathon che fa per te
                                    </Heading>
                                    <Box>
                                        <Box textAlign='left'>
                                            <label>
                                                <b>Seleziona una città:</b>
                                                <Select onChange={onFilterChange} placeholder='-'>
                                                    {Array.from(cities).map((city) => (
                                                        <option
                                                            key={city}
                                                            value={city}
                                                            label={city}
                                                        />
                                                    ))}
                                                </Select>
                                            </label>
                                        </Box>
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
            </BoxFullHeightAfterHeader>
            <Box>
                {cities?.length > 0 && (
                    <Box p={10} pb='10%' pt={30}>
                        <Heading as='h2' p={10}>
                            Scopri le città con i prossimi Hackathon
                        </Heading>
                        <SimpleGrid
                            columns={[1, Math.min(2, cities.length), Math.min(3, cities.length)]}
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
                    <Box
                        borderTop={`1px solid ${colors.blue_night}`}
                        borderBottom={`1px solid ${colors.blue_night}`}>
                        <MapContainer
                            hackathons={hackathons}
                            style={{ width: '100%', minHeight: '90vh' }}
                        />
                    </Box>
                    <Flex alignSelf='center' p='8%'>
                        <Heading
                            as='h3'
                            size='xl'
                            m='auto'
                            textShadow={`2px 1px 5px ${colors.black}`}>
                            Oppure cerca i prossimi Hackathon direttamente sulla mappa
                        </Heading>
                    </Flex>
                </SimpleResponsiveGrid>
            </StyledBlueBox>
            {!isLogged ? (
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
            ) : (
                <Box p='5%'>
                    <Heading as='h3' size='xl' p={10}>
                        Hai già aggiornato il tuo profilo?
                    </Heading>
                    <Heading as='h4' size='md' m={2}>
                        <p>Controlla subito le informazioni che hai inserito!</p>
                        <Link to={`/profile/${appContext.state?.user?.username}`}>
                            <StyledBlueButton>Profilo</StyledBlueButton>
                        </Link>
                    </Heading>
                </Box>
            )}
            <StyledBlueBox p='2%' textAlign='left'>
                ©Copyright 2020 - Giada Boccali &bull; Antonio Christian Toscano
            </StyledBlueBox>
        </StyledContainer>
    );
}

const FlexContainer: React.FC<{}> = (props) => {
    return (
        <Flex
            minHeight='inherit'
            alignItems='center'
            justifyContent='center'
            p='10% 0'
            backgroundColor={colors.blue_night}
            backgroundImage="url('./images/background/space-min.jpg')"
            {...BackgroundImageStyleProps}>
            {props.children}
        </Flex>
    );
};

const SimpleResponsiveGrid = styled(SimpleGrid).attrs({
    h: '100%',
    columns: [1, 1, 2, 2],
})``;

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
    _hover: { bg: colors.blue_light },
})``;

const StyledBlueBox = styled(Box).attrs({
    bg: colors.blue_night,
    color: colors.white,
})``;

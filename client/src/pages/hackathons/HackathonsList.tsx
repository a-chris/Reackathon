import {
    Accordion,
    AccordionHeader,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Checkbox,
    Flex,
    FormLabel,
    Heading,
    Input,
    Select,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/core';
import queryString from 'query-string';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import {
    BoxFullHeightAfterHeader,
    BoxWithSpacedChildren,
    StyledLinkRouter,
} from '../../components/Common';
import MapContainer from '../../components/Map';
import { Hackathon, HackathonStatus } from '../../models/Models';
import { getAvailableCities } from '../../services/FilterService';
import { getHackathons } from '../../services/HackathonService';
import colors from '../../utils/colors';
import { toDateString } from '../../utils/functions';

type RouteParams = {
    organization?: string;
    city?: string;
    province?: string;
    region?: string;
    country?: string;
    from?: string;
    to?: string;
    status?: HackathonStatus;
    user?: string;
};

const ROUTE_PARAMS = new Set([
    'organization',
    'city',
    'province',
    'region',
    'country',
    'from',
    'to',
    'status',
    'user',
]);

const HACKATHON_STATUSES = {
    pending: 'In attesa',
    started: 'In corso',
    finished: 'Concluso',
    archived: 'Cancellato',
};

export default function HackathonsList() {
    const appContext = React.useContext(AppContext);
    const history = useHistory();
    const location = useLocation();
    const [hackathons, setHackathons] = React.useState<Hackathon[]>();
    const [availableCities, setAvailableCities] = React.useState<string[]>([]);
    const [filters, setFilters] = React.useState<RouteParams>(
        sanitizeRouteParams(queryString.parse(location.search))
    );

    React.useEffect(() => {
        getAvailableCities().then((cities) => setAvailableCities(cities));
    }, []);

    React.useEffect(() => {
        getHackathons(filters).then((hackathons) => setHackathons(hackathons));
    }, [filters]);

    const onChangeFilter = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name != null && value != null) {
            const sanitizedValue = value === '' ? undefined : value;
            setFilters((curr) => ({ ...curr, [name]: sanitizedValue }));
        }
    };

    const onChangeOwnHackathons = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        const username = appContext.state?.user?.username;
        if (checked != null && username != null) {
            setFilters((curr) => ({ ...curr, user: checked ? username : undefined }));
            if (queryString.parse(location.search)?.user != null) {
                history.push('/hackathons');
            }
        }
    };

    const isLogged = appContext.state?.user != null;

    return (
        <BoxFullHeightAfterHeader
            isLogged={isLogged}
            h={[
                'calc(100vh - 3.2rem)',
                'calc(100vh - 3.2rem)',
                isLogged ? 'calc(100vh - 6.5rem)' : 'calc(100vh - 4rem)',
            ]}>
            <SimpleGrid w='100%' minH='inherit' h='inherit' columns={[1, 1, 2, 2]}>
                <Stack p={[25, 25, 15, 5]} overflowY='auto'>
                    <Box textAlign='center'>
                        <Heading as='h1' size='xl' color={colors.blue_light} p={1}>
                            Hackathons
                        </Heading>
                    </Box>
                    <Accordion allowToggle defaultIndex={[]}>
                        <AccordionItem>
                            <AccordionHeader>
                                <Box flex='1'>
                                    <Heading as='h2' size='md' textAlign='center'>
                                        Filtri
                                    </Heading>
                                </Box>
                                <AccordionIcon />
                            </AccordionHeader>
                            <AccordionPanel>
                                <Flex wrap='wrap'>
                                    <FormLabel pl={1}>
                                        <b>Città:</b>
                                        <Select
                                            minW='212px'
                                            placeholder='-'
                                            name='city'
                                            onChange={onChangeFilter}>
                                            {availableCities.map((city) => (
                                                <option value={city} key={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormLabel>
                                    <FormLabel pl={1}>
                                        <b>Stato:</b>
                                        <Select
                                            minW='212px'
                                            placeholder='-'
                                            name='status'
                                            onChange={onChangeFilter}>
                                            {Object.entries(HACKATHON_STATUSES).map((e) => (
                                                <option value={e[0]} key={e[0]}>
                                                    {e[1]}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormLabel>
                                    <FormLabel pl={1}>
                                        <b>Data di inizio:</b>
                                        <Input
                                            type='date'
                                            name='from'
                                            onChange={onChangeFilter}
                                            minW='212px'
                                        />
                                    </FormLabel>
                                    <FormLabel pl={1}>
                                        <b>Data di fine:</b>
                                        <Input
                                            type='date'
                                            name='to'
                                            onChange={onChangeFilter}
                                            minW='212px'
                                        />
                                    </FormLabel>
                                    {isLogged && (
                                        <Checkbox
                                            size='lg'
                                            pt='15px'
                                            variantColor='orange'
                                            defaultIsChecked={filters.user != null}
                                            onChange={onChangeOwnHackathons}>
                                            I tuoi hackathon
                                        </Checkbox>
                                    )}
                                </Flex>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <BoxWithSpacedChildren space='15px'>
                        {hackathons == null ? null : hackathons.length === 0 ? (
                            <Text textAlign='center'>Nessun hackathon trovato.</Text>
                        ) : (
                            hackathons.map((hackathon, index) => (
                                <Box
                                    p={2}
                                    color='gray.500'
                                    border={'2px solid ' + colors.gray}
                                    textAlign='left'
                                    key={index}>
                                    <Link key={hackathon._id} to={'hackathons/' + hackathon._id}>
                                        <Heading as='h2' size='lg' color={colors.gray_darker}>
                                            {hackathon.name}
                                        </Heading>
                                        <Text color={colors.gray_light}>
                                            {hackathon.description.substring(0, 150)}...
                                        </Text>

                                        <Box mt={1} mb={1}>
                                            <Text
                                                fontSize='sm'
                                                fontWeight='semibold'
                                                color={colors.gray_dark}>
                                                {toDateString(hackathon.startDate)} -{' '}
                                                {toDateString(hackathon.endDate)}
                                            </Text>
                                        </Box>
                                    </Link>
                                    <Box mt={1} mb={1}>
                                        Creato da{' '}
                                        <StyledLinkRouter
                                            to={`/profile/${hackathon.organization.username}`}>
                                            <b>{hackathon.organization.name}</b>
                                        </StyledLinkRouter>
                                    </Box>
                                    <Link to={'hackathons/' + hackathon._id}>
                                        <Flex alignItems='baseline' justifyContent='space-between'>
                                            <Box
                                                color={colors.gray_dark}
                                                fontWeight='semibold'
                                                letterSpacing='wide'
                                                fontSize='xs'
                                                textTransform='uppercase'>
                                                {hackathon.location.city} &bull;{' '}
                                                {hackathon.location.country}
                                            </Box>
                                            {StatusBadge(hackathon)}
                                        </Flex>
                                    </Link>
                                </Box>
                            ))
                        )}
                    </BoxWithSpacedChildren>
                </Stack>
                <Box w='100%' d={{ xs: 'none', md: 'block' }}>
                    <MapContainer
                        hackathons={hackathons}
                        style={{ height: '100%', width: '100%' }}
                    />
                </Box>
            </SimpleGrid>
        </BoxFullHeightAfterHeader>
    );
}
// HackathonsList.whyDidYouRender = true;

function sanitizeRouteParams(params: any): RouteParams {
    let newParams: any = {};
    Object.entries(params)
        .filter((e) => ROUTE_PARAMS.has(e[0]))
        .forEach((e) => {
            newParams[e[0]] = e[1];
        });
    return newParams;
}

function StatusBadge(hackathon: Hackathon) {
    const status = hackathon.status;
    const maxAttendants = hackathon.attendantsRequirements.maxNum;
    const actualAttendants = hackathon.attendants.length;
    let color = 'green';
    let text = '';

    switch (status) {
        case HackathonStatus.PENDING:
            if (!maxAttendants || (maxAttendants && actualAttendants < maxAttendants)) {
                color = 'yellow';
                text = 'iscrizioni aperte';
            } else {
                color = 'red';
                text = 'iscrizioni chiuse';
            }
            break;
        case HackathonStatus.STARTED:
            color = 'green';
            text = 'in corso';
            break;
        case HackathonStatus.FINISHED:
            color = 'red';
            text = 'concluso';
            break;
        case HackathonStatus.ARCHIVED:
            color = 'red';
            text = 'Annullato';
            break;
    }
    if (text === '') return;

    return (
        <Badge rounded='full' mr={3} variantColor={color}>
            {text}
        </Badge>
    );
}

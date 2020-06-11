import { Badge, Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/core';
import queryString from 'query-string';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import MapContainer from '../../components/Map';
import { Hackathon, HackathonStatus } from '../../models/Models';
import { getHackathons } from '../../services/HackathonService';
import colors from '../../utils/colors';
import { toDateString } from '../../utils/functions';

type RouteParams = {
    organization?: string;
    city?: string;
    province?: string;
    district?: string;
    country?: string;
    from?: string;
    to?: string;
    status?: HackathonStatus;
};

const ROUTE_PARAMS = new Set([
    'organization',
    'city',
    'province',
    'district',
    'country',
    'from',
    'to',
    'status',
]);

export default function HackathonsList() {
    const location = useLocation();
    const appContext = React.useContext(AppContext);
    const [hackathons, setHackathons] = React.useState<Hackathon[]>([]);
    const [filters, setFilters] = React.useState<RouteParams>(
        sanitizeRouteParams(queryString.parse(location.search))
    );

    // TODO: use this when we will add the filters in this page
    // React.useEffect(() => {
    //     const urlFilters = sanitizeRouteParams(queryString.parse(location.search));
    //     setFilters((curr) => {
    //         // add or replace organization id with logged organization id
    //         if (appContext.state?.user?.role === UserRole.ORGANIZATION) {
    //             urlFilters.organization = appContext.state.user._id;
    //         }
    //         return { ...curr, ...urlFilters };
    //     });
    // }, [location, appContext.state]);

    React.useEffect(() => {
        getHackathons(filters).then((hackathons) => setHackathons(hackathons));
    }, [filters]);

    return (
        <Box w='100%' h='90%'>
            <SimpleGrid w='100%' h='100%' columns={[1, 1, 2]}>
                <Stack p={[25, 25, 15, 5]} overflowY='auto'>
                    <Box textAlign='center'>
                        <Heading as='h1' size='xl' color={colors.blue_light} p={1}>
                            Hackathons
                        </Heading>
                    </Box>
                    {hackathons.map((hackathon, index) => (
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
                                <Box d='flex' alignItems='baseline' justifyContent='space-between'>
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
                                </Box>
                            </Link>
                        </Box>
                    ))}
                </Stack>
                <Box w='100%' p={2}>
                    <MapContainer
                        hackathons={hackathons}
                        style={{ height: '100%', width: '100%' }}
                    />
                </Box>
            </SimpleGrid>
        </Box>
    );
}
HackathonsList.whyDidYouRender = true;

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
    }
    if (text === '') return;

    return (
        <Badge rounded='full' mr={3} variantColor={color}>
            {text}
        </Badge>
    );
}

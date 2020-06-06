import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, Badge, Stack, Heading, SimpleGrid } from '@chakra-ui/core';
import { Hackathon, HackathonStatus } from '../../models/Models';
import { getHackathons } from '../../services/HackathonService';
import queryString from 'query-string';
import { MapContainer } from '../../components/Map';
import { red_light, gray, gray_dark } from '../../utils/colors';

type RouteParams = {
    city?: string;
    province?: string;
    district?: string;
    country?: string;
    from?: string;
    to?: string;
    status?: HackathonStatus;
};

const ROUTE_PARAMS = new Set(['city', 'province', 'district', 'country', 'from', 'to', 'status']);

export default function HackathonsList() {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>([]);
    const [filters, setFilters] = React.useState<RouteParams>();
    const location = useLocation();

    React.useEffect(() => {
        const urlFilters = sanitizeRouteParams(queryString.parse(location.search));
        setFilters((curr) => {
            const val = { ...curr, ...urlFilters };
            return val;
        });
    }, [, location]);

    React.useEffect(() => {
        getHackathons(filters).then((hackathons) => setHackathons(hackathons));
    }, [filters]);

    return (
        <Box w={'100%'} h={'90%'}>
            <SimpleGrid w={'100%'} h={'100%'} columns={[1, 1, 2]}>
                <Stack p={[25, 25, 15, 5]} overflowY='auto'>
                    <Box color={red_light}>
                        <Heading as='h2' size='lg'>
                            Hackathons
                        </Heading>
                    </Box>
                    {hackathons.map((hackathon, index) => (
                        <Box
                            key={index}
                            p={2}
                            color='gray.500'
                            border={'2px solid ' + gray}
                            textAlign='left'>
                            <Link key={hackathon._id} to={'hackathons/' + hackathon._id}>
                                <Heading as='h3' size='lg'>
                                    {hackathon.name}
                                </Heading>
                                <Box color='gray.400'>{hackathon.description}</Box>
                                <Box d='flex' alignItems='baseline' justifyContent='space-between'>
                                    <Box
                                        color={gray_dark}
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
                <Box w={'100%'} p={2}>
                    <MapContainer
                        hackathons={hackathons}
                        style={{ height: '100%', width: '100%' }}
                    />
                </Box>
            </SimpleGrid>
        </Box>
    );
}

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
                text = 'iscriviti';
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
        <Badge variant='outline' rounded='full' mr={3} variantColor={color}>
            {text}
        </Badge>
    );
}

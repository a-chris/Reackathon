import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import { Hackathon } from '../../models/Models';
import { getHackathons } from '../../services/HackathonService';

export default function HackathonsList() {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>([]);

    React.useEffect(() => {
        getHackathons().then((hackathons) => setHackathons(hackathons));
    }, []);

    return (
        <Box p={15}>
            <Box w='30%' color='red.500'>
                <Text as='h2'>Hackathons</Text>
            </Box>
            <Box w='70%' color='gray.500'></Box>
        </Box>
    );
}

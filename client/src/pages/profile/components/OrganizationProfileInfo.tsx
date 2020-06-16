import React from 'react';
import { Hackathon } from '../../../models/Models';
import HackathonsTimeline from './HackathonsTimeline';
import { getHackathons } from '../../../services/HackathonService';
import { Box, Heading, Flex, Button, Icon } from '@chakra-ui/core';
import { Link } from 'react-router-dom';

interface ExperienceProps {
    userId?: string;
    isProfileOwner: boolean;
}

export default function OrganizationProfileInfo(props: ExperienceProps) {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>();

    React.useEffect(() => {
        const filters = { organization: props.userId };
        getHackathons(filters).then((hackathons) => {
            setHackathons(hackathons);
        });
    }, [props.userId]);

    return (
        <Box w='80%'>
            <Heading as='h3' size='md' p={2}>
                Hackathon organizzati
            </Heading>
            {props.isProfileOwner && (
                <Flex justify='center'>
                    <Link to='/hackathons/create'>
                        <Button mb='15px'>
                            Crea un hackathon
                            <Icon name='add' ml={2} />
                        </Button>
                    </Link>
                </Flex>
            )}
            {hackathons != null && hackathons.length > 0 && (
                <HackathonsTimeline hackathons={hackathons} />
            )}
        </Box>
    );
}

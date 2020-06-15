import React from 'react';
import {
    Box,
    Button,
    Heading,
    SimpleGrid,
    StatLabel,
    StatNumber,
    StatHelpText,
    Stack,
} from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Hackathon, HackathonStatus, Statistics } from '../../models/Models';
import { getOrganizationHackathons, getStatistics } from '../../services/HackathonService';
import colors from '../../utils/colors';
import { BoxFullHeightAfterHeader } from '../../components/Common';

export default function OrganizationBoard() {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>();
    const [stats, setStats] = React.useState<Statistics>();

    React.useEffect(() => {
        getOrganizationHackathons().then((hackathons) => {
            setHackathons(hackathons);
        });
        getStatistics().then((stats) => {
            setStats(stats);
        });
    }, []);

    const message = boardMessage(hackathons);

    return (
        <BoxFullHeightAfterHeader isLogged={true}>
            <FlexContainer>
                <Box p={25} pb='5%' textAlign='center'>
                    <Heading as='h1' size='2xl' pb={10}>
                        {message.heading}
                    </Heading>
                    <Heading as='h2' size='xl' pb={10}>
                        {message.subHeading}
                    </Heading>
                    <Link to={message.linkTo}>
                        <Button
                            variant='outline'
                            color={colors.white}
                            bg={colors.blue_night}
                            size='lg'
                            _hover={{ bg: colors.blue_light }}
                            p={5}>
                            Vai
                        </Button>
                    </Link>
                </Box>
                <SimpleGrid columns={[1, 2, 4, null]} textAlign='center' w='80%' spacing={8}>
                    {stats != null && (
                        <>
                            <StyledStat>
                                <StyledStatLabel>Hackathon organizzati</StyledStatLabel>
                                <StatNumber>{stats.totalHackathons}</StatNumber>
                                <StatHelpText>in totale</StatHelpText>
                            </StyledStat>

                            <StyledStat>
                                <StyledStatLabel>Prossimi Hackathon</StyledStatLabel>
                                <StatNumber>{stats.pendingHackathons}</StatNumber>
                                <StatHelpText>non ancora iniziati</StatHelpText>
                            </StyledStat>

                            <StyledStat>
                                <StyledStatLabel>Numero iscritti totali</StyledStatLabel>
                                <StatNumber>{stats.totalHackathons}</StatNumber>
                                <StatHelpText>a tutti gli Hackathon</StatHelpText>
                            </StyledStat>

                            <StyledStat>
                                <StyledStatLabel>Premi in denato assegnati</StyledStatLabel>
                                <StatNumber>{stats.totalPrize}</StatNumber>
                                <StatHelpText>destinati ai vincitori</StatHelpText>
                            </StyledStat>
                        </>
                    )}
                </SimpleGrid>
            </FlexContainer>
        </BoxFullHeightAfterHeader>
    );
}

const hackathonStatus = (id?: string) => ({
    empty: {
        heading: 'Nessun Hackathon inserito',
        subHeading: 'Creane uno adesso!',
        linkTo: '/hackathons/create',
    },
    started: {
        heading: 'Hai un Hackathon in corso',
        subHeading: 'Controllane lo stato!',
        linkTo: `/hackathons/${id}`,
    },
    pending: {
        heading: 'Hai un Hackathon in programma',
        subHeading: 'Controlla ora le iscrizioni!',
        linkTo: `/hackathons/${id}`,
    },
});

function boardMessage(hackathons?: Hackathon[]) {
    if (hackathons != null && hackathons.length > 0) {
        const startedHackathon = hackathons.find(
            (hackathon) => hackathon.status === HackathonStatus.STARTED
        );
        if (startedHackathon != null) {
            return hackathonStatus(startedHackathon._id).started;
        } else {
            const pendingHackathon = hackathons.find(
                (hackathon) => hackathon.status === HackathonStatus.PENDING
            );
            if (pendingHackathon != null) {
                return hackathonStatus(pendingHackathon._id).pending;
            }
        }
    }
    return hackathonStatus().empty;
}

const FlexContainer = styled(Stack).attrs({
    alignItems: 'center',
    h: 'fit-content',
    p: '20px 0',
    mt: '2px',
    flexWrap: 'wrap-reverse',
    bg: colors.white,
})``;

const StyledStat = styled(Box).attrs({
    bg: colors.white,
})`
    border: 1px solid ${colors.blue_light};
    box-shadow: 1px 1px 5px ${colors.blue_light};
`;

const StyledStatLabel = styled(StatLabel).attrs({
    fontSize: 'xl',
    p: 1,
})``;

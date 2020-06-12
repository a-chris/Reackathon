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
import { getHackathons, getStatistics } from '../../services/HackathonService';
import colors from '../../utils/colors';

export default function OrganizationBoard() {
    const [hackathons, setHackathons] = React.useState<Hackathon[]>();
    const [stats, setStats] = React.useState<Statistics>();

    React.useEffect(() => {
        getHackathons().then((hackathons) => {
            setHackathons(hackathons);
        });
        getStatistics().then((stats) => {
            setStats(stats);
        });
    }, []);

    return (
        <>
            <FlexContainer>
                <SimpleGrid columns={[2, 2, 4, null]} textAlign='center' w='80%' spacing={8}>
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
                <Box p={20} textAlign='center'>
                    {boardMessage(hackathons)}
                </Box>
            </FlexContainer>

            <StyledBlueBox p='2%'>
                ©Copyright 2020 - Giada Boccali &bull; Antonio Christian Toscano
            </StyledBlueBox>
        </>
    );
}

function boardMessage(hackathons?: Hackathon[]) {
    let heading = 'Nessun Hackathon inserito';
    let subHeading = 'Creane uno adesso!';
    let linkTo = '/hackathons/create';

    if (hackathons != null && hackathons.length > 0) {
        const currentHackathon = hackathons.find(
            (hackathon) => hackathon.status === HackathonStatus.STARTED
        );

        if (currentHackathon != null) {
            heading = 'Hai un Hackathon in corso';
            subHeading = 'Controllane lo stato!';
            linkTo = `/hackathons/${currentHackathon._id}`;
        } else {
            const pendingHackathon = hackathons.find(
                (hackathon) => hackathon.status === HackathonStatus.PENDING
            );

            if (pendingHackathon != null) {
                heading = 'Hai un Hackathon in programma';
                subHeading = 'Controlla ora le iscrizioni!';
                linkTo = `/hackathons/${pendingHackathon._id}`;
            }
        }
    }

    return (
        <>
            <Heading as='h1' size='xl' pb={5}>
                {heading}
            </Heading>
            <Heading as='h2' size='lg' pb={5}>
                {subHeading}
            </Heading>
            <Link to={linkTo}>
                <Button variant='outline' bg={colors.white} color={colors.blue_night} p={5}>
                    Vai
                </Button>
            </Link>
        </>
    );
}

const FlexContainer = styled(Stack).attrs({
    alignItems: 'center',
    h: 'fit-content',
    p: '1% 0',
})``;

const StyledBlueBox = styled(Box).attrs({
    bg: colors.blue_night,
    color: colors.white,
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

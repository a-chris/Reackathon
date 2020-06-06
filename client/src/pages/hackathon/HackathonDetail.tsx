import React from 'react';
import { useParams } from 'react-router-dom';
import { Hackathon, Attendant } from '../../models/Models';
import {
    getHackathon,
    subscribeToHackathon,
    unsubscribeToHackathon,
} from '../../services/HackathonService';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import {
    Box,
    Heading,
    SimpleGrid,
    Stack,
    CircularProgress,
    CircularProgressLabel,
    PseudoBox,
    Flex,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Button,
    Icon,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Tabs,
    Select,
    Divider,
} from '@chakra-ui/core';
import { gray_dark, gold, blue_night, white } from '../../utils/colors';
import moment from 'moment';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';

type RouteParams = {
    id: string;
};

type AttendantsProgress = {
    text: String;
    value: number;
};

function toDateString(date: Date) {
    return moment(date).format('DD/MM/YYYY');
}

function toTimeString(date: Date) {
    return moment(date).format('HH:mm');
}

const HackathonTabs = ['Informazioni', 'Iscritti'];

export default function HackathonDetail() {
    const appContext = React.useContext(AppContext);
    const [hackathonData, setHackathonData] = React.useState<Hackathon>();
    const [attendant, setAttendant] = React.useState<Attendant | undefined>(undefined);
    const params = useParams<RouteParams>();
    const idHackathon = params.id;

    React.useEffect(() => {
        getHackathon(idHackathon).then((hackathon) => setHackathonData(hackathon));
    }, [idHackathon]);

    React.useEffect(() => {
        if (appContext.state?.user != null) {
            const attendant = hackathonData?.attendants.find(
                (attendant) => attendant.user._id == appContext.state!.user!._id
            );
            setAttendant(attendant);
            console.log(appContext.state.user._id);
        }
    }, [hackathonData, appContext]);

    const onHackathonSubscribe = React.useCallback(() => {
        subscribeToHackathon(idHackathon)
            .then((hackathon) => setHackathonData(hackathon))
            .catch((error) => console.log(error));
    }, [idHackathon]);

    const onHackathonUnsubscibe = React.useCallback(() => {
        unsubscribeToHackathon(idHackathon)
            .then((hackathon) => setHackathonData(hackathon))
            .catch((error) => console.log(error));
    }, [idHackathon]);

    return hackathonData == null ? (
        <div />
    ) : (
        <OverlappedBoxes
            mainStackStyle={{ width: ['90%'] }}
            TopContent={() => (
                <Box p='1%'>
                    <SimpleGrid columns={[1, 1, 3, 3]} textAlign='left'>
                        <Stack>
                            <Heading as='h2' size='xl'>
                                {hackathonData.name}
                            </Heading>
                            <Stack
                                isInline
                                color={gray_dark}
                                fontWeight='semibold'
                                letterSpacing='wide'
                                fontSize='md'>
                                <PseudoBox textTransform='capitalize'>
                                    {hackathonData.location.street} {hackathonData.location.number}{' '}
                                    &bull; {hackathonData.location.city} &bull;{' '}
                                    {hackathonData.location.country}
                                </PseudoBox>
                            </Stack>
                        </Stack>
                        <StyledDateContainer>
                            <Icon name='calendar' size='1.5em' color={gold} />
                            <Box textAlign='center'>
                                <PseudoBox>
                                    Dal <b>{toDateString(hackathonData.startDate)}</b>, ore{' '}
                                    <b>{toTimeString(hackathonData.startDate)}</b>
                                </PseudoBox>
                                <PseudoBox>
                                    Al <b>{toDateString(hackathonData.endDate)}</b>, ore{' '}
                                    <b>{toTimeString(hackathonData.endDate)}</b>
                                </PseudoBox>
                            </Box>
                        </StyledDateContainer>
                        <Flex alignItems='center' justifyContent='flex-end'>
                            {appContext.state?.user != null && attendant != null ? (
                                <Stack>
                                    <StyledBlueButton onClick={onHackathonUnsubscibe}>
                                        Disiscriviti
                                    </StyledBlueButton>
                                    {attendant.group == null && (
                                        <StyledBlueButton onClick={() => console.log('click')}>
                                            Crea gruppo
                                        </StyledBlueButton>
                                    )}
                                </Stack>
                            ) : (
                                <StyledBlueButton onClick={onHackathonSubscribe}>
                                    Iscriviti
                                </StyledBlueButton>
                            )}
                        </Flex>
                    </SimpleGrid>
                </Box>
            )}
            BottomContent={() => (
                <Box>
                    <Tabs isFitted p='1%'>
                        <TabList mb='1em'>
                            {HackathonTabs.map((tabTitle) => (
                                <Tab key={`tab-${tabTitle}`}>{tabTitle}</Tab>
                            ))}
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Information hackathon={hackathonData} />
                            </TabPanel>
                            <TabPanel>
                                <Attendants attendants={hackathonData.attendants} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            )}
        />
    );
}

const Information: React.FC<{ hackathon: Hackathon }> = ({ hackathon }) => {
    const progressValue = hackathon.attendantsRequirements.maxNum
        ? (hackathon.attendants.length * 100) / hackathon.attendantsRequirements.maxNum
        : hackathon.attendants.length % 10;

    return (
        <StyledBottomBoxContainer>
            <Heading as='h3' size='md'>
                Descrizione dell'evento
            </Heading>
            <Text>{hackathon.description}</Text>

            <Divider borderColor={gold} />

            <Heading as='h3' size='md'>
                Informazioni sugli iscritti
            </Heading>
            {/* <Flex align-items='center'> */}
            <SimpleGrid columns={[2, 2, 4, 4]}>
                <Stat>
                    <StatNumber>{hackathon.attendants.length}</StatNumber>
                    <StatLabel>Iscritti attuali</StatLabel>
                </Stat>
                <Stat>
                    {hackathon.attendantsRequirements.maxNum != null ? (
                        <StatNumber>{hackathon.attendantsRequirements.maxNum}</StatNumber>
                    ) : (
                        <StatNumber>&#8734;</StatNumber>
                    )}
                    <StatLabel>Posti disponibili</StatLabel>
                    {!hackathon.attendantsRequirements.maxNum && (
                        <StatHelpText>Illimitati</StatHelpText>
                    )}
                    {hackathon.attendantsRequirements.maxNum && (
                        <StatHelpText>Limitati</StatHelpText>
                    )}
                </Stat>
                <Stat>
                    <StatNumber>{hackathon.attendantsRequirements.minNum || 0}</StatNumber>
                    <StatLabel>Numero minimo iscritti</StatLabel>
                    <StatHelpText>Per avviare l'Hackathon</StatHelpText>
                </Stat>
                <CircularProgress
                    alignSelf='center'
                    value={progressValue}
                    color='yellow'
                    thickness={0.5}
                    size='120px'>
                    <CircularProgressLabel>{hackathon.attendants.length}</CircularProgressLabel>
                </CircularProgress>
            </SimpleGrid>

            {/* </Flex> */}

            <Divider borderColor={gold} />
            <Heading as='h3' size='md'>
                Requisiti richiesti per partecipare
            </Heading>
            <Text>{hackathon.attendantsRequirements.description}</Text>
            <Divider borderColor={gold} />

            <Heading as='h3' size='md'>
                Premio
            </Heading>
            <Text>€ {hackathon.prize.amount} in denaro</Text>
            <Text>{hackathon.prize.extra}</Text>
        </StyledBottomBoxContainer>
    );
};

const Attendants: React.FC<{ attendants: Attendant[] }> = ({ attendants }) => {
    return (
        <StyledBottomBoxContainer>
            {attendants.length === 0 ? (
                <Text fontSize='lg'>Ancora nessun iscritto</Text>
            ) : (
                <Box></Box>
            )}
        </StyledBottomBoxContainer>
    );
};

const StyledDateContainer = styled(Stack).attrs({
    isInline: true,
})`
    font-size: 90%;
    letter-spacing: 1px;
    padding: 5px;
    align-items: center;
    justify-content: center;
`;

const StyledBottomBoxContainer = styled(Box).attrs({
    pt: '1rem',
    pb: '2rem',
    pl: ['5%', '15%'],
    pr: ['5%', '15%'],
})`
    & > * {
        padding-bottom: 5px;
    }
`;

const StyledBlueButton = styled(Button).attrs({
    bg: blue_night,
    color: white,
    margin: 5,
    pl: '2.5rem',
    pr: '2.5rem',
    rounded: 'md',
})``;

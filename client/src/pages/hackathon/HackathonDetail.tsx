import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    CircularProgressLabel,
    Divider,
    Flex,
    Heading,
    Icon,
    PseudoBox,
    SimpleGrid,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tag,
} from '@chakra-ui/core';
import moment from 'moment';
import styled from 'styled-components';
import * as _ from 'lodash';
import { AppContext } from '../../AppContext';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import { Attendant, Hackathon } from '../../models/Models';
import {
    getHackathon,
    subscribeToHackathon,
    unsubscribeToHackathon,
} from '../../services/HackathonService';
import colors, { getRandomVariantColorString } from '../../utils/colors';

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
                (attendant) => attendant.user._id === appContext.state!.user!._id
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
                                color={colors.gray_dark}
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
                            <Icon name='calendar' size='1.5em' color={colors.gold} />
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
                            {appContext.state?.user != null &&
                                (attendant != null ? (
                                    <Stack>
                                        <StyledBlueButtonPadded onClick={onHackathonUnsubscibe}>
                                            Disiscriviti
                                        </StyledBlueButtonPadded>
                                        {attendant.group == null && (
                                            <StyledBlueButtonPadded
                                                onClick={() => console.log('click')}>
                                                Crea gruppo
                                            </StyledBlueButtonPadded>
                                        )}
                                    </Stack>
                                ) : (
                                    <StyledBlueButtonPadded onClick={onHackathonSubscribe}>
                                        Iscriviti
                                    </StyledBlueButtonPadded>
                                ))}
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
                                <Attendants
                                    attendants={hackathonData.attendants}
                                    isUserLogged={appContext.state?.user != null}
                                />
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

            <Divider borderColor={colors.gold} />

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

            <Divider borderColor={colors.gold} />
            <Heading as='h3' size='md'>
                Requisiti richiesti per partecipare
            </Heading>
            <Text>{hackathon.attendantsRequirements.description}</Text>
            <Divider borderColor={colors.gold} />

            <Heading as='h3' size='md'>
                Premio
            </Heading>
            <Text>€ {hackathon.prize.amount} in denaro</Text>
            <Text>{hackathon.prize.extra}</Text>
        </StyledBottomBoxContainer>
    );
};

const Attendants: React.FC<{ attendants: Attendant[]; isUserLogged: boolean }> = ({
    attendants,
    isUserLogged,
}) => {
    // const [filterGroup];
    const orderedAttendants = _.orderBy(attendants, ['group'], ['asc']);
    return (
        <StyledBottomBoxContainer>
            {attendants.length === 0 ? (
                <Text fontSize='lg'>Ancora nessun iscritto</Text>
            ) : (
                <Box>
                    {orderedAttendants.map((attendant, index) => (
                        <Link to={`/profile/${attendant.user.username}`} key={index}>
                            <StyledAttendantBox>
                                <StyledAttendantInfoBox>
                                    <Box>
                                        <Heading as='h3' size='md'>
                                            {attendant.user.username}
                                        </Heading>
                                        <StyledBadgeFlex>
                                            <Icon name='star' size='12px' />
                                            <Text>{attendant.user.badge?.win}</Text>

                                            <Icon name='moon' size='12px' ml={2} />
                                            <Text>{attendant.user.badge?.partecipation}</Text>
                                        </StyledBadgeFlex>
                                    </Box>
                                    <Stack
                                        isInline
                                        textAlign={['center', 'center', 'left']}
                                        alignItems='center'>
                                        {attendant.group != null ? (
                                            <Text>Membro di un gruppo</Text>
                                        ) : (
                                            <Text>Utente senza gruppo</Text>
                                        )}
                                        {isUserLogged && (
                                            <StyledBlueButton size='sm'>
                                                Invia richiesta
                                            </StyledBlueButton>
                                        )}
                                    </Stack>
                                </StyledAttendantInfoBox>

                                <Box>
                                    {_.take(
                                        attendant.user.skills?.filter((skill) => skill.length < 30),
                                        5
                                    ).map((skill, index) => (
                                        <Tag
                                            size='lg'
                                            m='2px'
                                            variantColor={getRandomVariantColorString()}
                                            key={index}>
                                            {skill}
                                        </Tag>
                                    ))}
                                </Box>
                            </StyledAttendantBox>
                        </Link>
                    ))}
                </Box>
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
    bg: colors.blue_night,
    color: colors.white,
    rounded: 'md',
})``;

const StyledBlueButtonPadded = styled(StyledBlueButton).attrs({
    margin: 5,
    pl: '2.5rem',
    pr: '2.5rem',
})``;

const StyledAttendantBox = styled(Box).attrs({
    p: '2%',
})`
    border: 1px solid ${colors.blue_night};
`;

const StyledAttendantInfoBox = styled(Box).attrs({
    pb: ['10px', '10px', '4px'],
    display: { md: 'flex' },
})`
    justify-content: space-between;
`;

const StyledBadgeFlex = styled(Flex)`
    align-items: center;
    & > * {
        margin: 2px;
    }
    & > p {
        color: ${colors.gray_dark};
    }
`;

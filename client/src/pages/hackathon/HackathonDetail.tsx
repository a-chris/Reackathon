import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    PseudoBox,
    SimpleGrid,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Badge,
    useToast,
} from '@chakra-ui/core';
import { useEffectOnce } from 'react-use';
import { AppContext } from '../../AppContext';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import { Attendant, Hackathon, UserRole, HackathonStatus } from '../../models/Models';
import {
    getHackathon,
    subscribeToHackathon,
    unsubscribeToHackathon,
    changeHackathonStatus,
} from '../../services/HackathonService';
import socketClient from '../../socket/socket';
import SocketEvent, { HackathonSocketData } from '../../socket/SocketEvent';
import colors from '../../utils/colors';
import { Attendants, StyledBlueButtonPadded } from './components/AttendantsList';
import { Information } from './components/HackathonInformation';
import {
    StyledDateContainer,
    StyledBlueButton,
    StyledTitleBox,
} from './components/StyledComponents';
import { toDateString, toTimeString } from '../../utils/functions';

type RouteParams = {
    id: string;
};

const HackathonTabs = ['Informazioni', 'Iscritti'];

const statusToString = (status: HackathonStatus) => {
    switch (status) {
        case HackathonStatus.PENDING:
            return 'non ancora iniziato';
        case HackathonStatus.STARTED:
            return 'in corso';
        case HackathonStatus.FINISHED:
            return 'concluso';
    }
};

export default function HackathonDetail() {
    const appContext = React.useContext(AppContext);
    const params = useParams<RouteParams>();
    const toast = useToast();
    const hackathonId = params.id;
    const [hackathonData, setHackathonData] = React.useState<Hackathon>();
    const [attendant, setAttendant] = React.useState<Attendant | undefined>(undefined);
    const [isAlertOpen, setAlertOpen] = React.useState<boolean>();
    const cancelRef = React.useRef<HTMLElement>(null);

    useEffectOnce(() => {
        if (appContext.state?.user?.role === 'ORGANIZATION') {
            socketClient.emit('org_room', appContext.state.user.username);
        }
    });

    React.useEffect(() => {
        if (appContext.state?.user?.role === 'ORGANIZATION') {
            socketClient.on(appContext.state.user.username, (data: HackathonSocketData) => {
                if (data.event === SocketEvent.USER_SUB) {
                    toast({
                        position: 'top-right',
                        title: 'Nuova notifica',
                        description: 'Un nuovo utente si è iscritto.',
                        status: 'success',
                        isClosable: true,
                    });
                } else {
                    toast({
                        position: 'top-right',
                        title: 'Nuova notifica',
                        description: 'Un utente si è disiscritto.',
                        status: 'info',
                        isClosable: true,
                    });
                }
                if (hackathonId === data.id) {
                    // Update the current hackathon
                    console.log('UPDATE HACKATHON');
                    getHackathon(data.id).then((hackathon) => setHackathonData(hackathon));
                }
            });
        }
    }, [appContext.state, hackathonId, toast]);

    const onAlertClose = () => setAlertOpen(false);

    React.useEffect(() => {
        getHackathon(hackathonId).then((hackathon) => setHackathonData(hackathon));
    }, [hackathonId]);

    React.useEffect(() => {
        if (appContext.state?.user != null && appContext.state?.user.role === UserRole.CLIENT) {
            const attendant = hackathonData?.attendants.find(
                (attendant) => attendant.user._id === appContext.state!.user!._id
            );
            setAttendant(attendant);
        }
    }, [hackathonData, appContext]);

    const onHackathonSubscribe = React.useCallback(() => {
        subscribeToHackathon(hackathonId)
            .then((hackathon) => setHackathonData(hackathon))
            .catch((error) => console.log(error));
    }, [hackathonId]);

    const onHackathonUnsubscibe = React.useCallback(() => {
        setAlertOpen(false);
        unsubscribeToHackathon(hackathonId)
            .then((hackathon) => setHackathonData(hackathon))
            .catch((error) => console.log(error));
    }, [hackathonId]);

    const onChangeStatus = React.useCallback(
        (status: HackathonStatus) => {
            changeHackathonStatus(hackathonId, status)
                .then((hackathon) => setHackathonData(hackathon))
                .catch((error) => console.log(error));
        },
        [hackathonId]
    );

    const onAssignPrize = React.useCallback(() => {}, []);

    const getHackathonButtons = React.useCallback(() => {
        const currentUser = appContext.state?.user;

        if (
            currentUser == null ||
            (currentUser.role === UserRole.ORGANIZATION &&
                currentUser._id !== hackathonData?.organization._id)
        ) {
            return;
        }

        if (currentUser.role === UserRole.CLIENT) {
            if (attendant == null) {
                return (
                    <StyledBlueButtonPadded onClick={onHackathonSubscribe}>
                        Iscriviti
                    </StyledBlueButtonPadded>
                );
            } else {
                return (
                    <Stack>
                        {attendant.group == null && <Text>Crea una squadra!</Text>}
                        <StyledBlueButtonPadded onClick={() => setAlertOpen(true)}>
                            Disiscriviti
                        </StyledBlueButtonPadded>
                    </Stack>
                );
            }
        } else {
            return (
                <Stack>
                    {hackathonData?.status === HackathonStatus.PENDING && (
                        <StyledBlueButtonPadded
                            onClick={() => onChangeStatus(HackathonStatus.STARTED)}>
                            Avvia
                        </StyledBlueButtonPadded>
                    )}
                    {hackathonData?.status === HackathonStatus.STARTED && (
                        <StyledBlueButtonPadded
                            onClick={() => onChangeStatus(HackathonStatus.FINISHED)}>
                            Concludi
                        </StyledBlueButtonPadded>
                    )}
                    {hackathonData?.status !== HackathonStatus.ARCHIVED ? (
                        hackathonData?.status !== HackathonStatus.FINISHED ? (
                            <Menu>
                                <MenuButton
                                    alignItems='center'
                                    p='0'
                                    rounded='md'
                                    border={`1px solid ${colors.blue_night}`}>
                                    Gestisci
                                    <Icon name='chevron-down' ml='2px' size='26px' p='0' />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem alignItems='center'>
                                        <Link to={`/hackathons/update/${hackathonId}`}>
                                            Modifica
                                            <Icon name='external-link' ml='2px' size='20px' />
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        alignItems='center'
                                        onClick={() => onChangeStatus(HackathonStatus.ARCHIVED)}
                                        color={colors.red_dark}>
                                        Cancella evento
                                        <Icon name='warning-2' ml='2px' size='20px' />
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <StyledBlueButton onClick={onAssignPrize}>
                                Assegna premi
                            </StyledBlueButton>
                        )
                    ) : (
                        <Heading as='h2' size='lg' color={colors.red_dark}>
                            Cancellato
                        </Heading>
                    )}
                </Stack>
            );
        }
    }, [appContext.state?.user, attendant, hackathonData]);

    return hackathonData == null || cancelRef == null ? (
        <div />
    ) : (
        <Box>
            <OverlappedBoxes
                mainStackStyle={{ width: ['90%'] }}
                TopContent={() => (
                    <StyledTitleBox>
                        <Heading as='h1' size='xl'>
                            {hackathonData.name}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3, 3]} textAlign='left'>
                            <Stack>
                                <Stack
                                    isInline
                                    color={colors.gray_dark}
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='md'>
                                    <PseudoBox textTransform='capitalize'>
                                        {hackathonData.location.street}{' '}
                                        {hackathonData.location.number} &bull;{' '}
                                        {hackathonData.location.city} &bull;{' '}
                                        {hackathonData.location.country}
                                    </PseudoBox>
                                </Stack>
                                <Badge variantColor='green' m='auto'>
                                    Hackathon {statusToString(hackathonData.status)}
                                </Badge>
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
                            <Flex
                                alignItems='center'
                                justifyContent={['center', 'center', 'flex-end']}>
                                {getHackathonButtons()}
                            </Flex>
                        </SimpleGrid>
                    </StyledTitleBox>
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
                                        currentAttendant={attendant}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                )}
            />

            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}>
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Stai per cancellarti dall'Hackathon
                    </AlertDialogHeader>

                    <AlertDialogBody>Sei sicuro di voler procedere?</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onAlertClose}>
                            Annulla
                        </Button>
                        <Button variantColor='red' onClick={onHackathonUnsubscibe} ml={3}>
                            Disiscriviti
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    );
}

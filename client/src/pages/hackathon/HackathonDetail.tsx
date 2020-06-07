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
} from '@chakra-ui/core';
import moment from 'moment';
import { AppContext } from '../../AppContext';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import { Attendant, Hackathon, User, UserRole, HackathonStatus } from '../../models/Models';
import {
    getHackathon,
    subscribeToHackathon,
    unsubscribeToHackathon,
    changeHackathonStatus,
} from '../../services/HackathonService';
import colors from '../../utils/colors';
import { Attendants, StyledBlueButtonPadded } from './components/AttendantsList';
import { Information } from './components/HackathonInformation';
import {
    StyledDateContainer,
    StyledBlueButton,
    StyledTitleBox,
} from './components/StyledComponents';

type RouteParams = {
    id: string;
};

function toDateString(date: Date) {
    return moment(date).format('DD/MM/YYYY');
}

function toTimeString(date: Date) {
    return moment(date).format('HH:mm');
}

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
    const idHackathon = params.id;
    console.log(idHackathon);

    const [hackathonData, setHackathonData] = React.useState<Hackathon>();
    const [attendant, setAttendant] = React.useState<Attendant | undefined>(undefined);
    const [isAlertOpen, setAlertOpen] = React.useState<boolean>();
    const cancelRef = React.useRef<HTMLElement>(null);

    const onAlertClose = () => setAlertOpen(false);

    React.useEffect(() => {
        getHackathon(idHackathon).then((hackathon) => setHackathonData(hackathon));
    }, [idHackathon]);

    React.useEffect(() => {
        if (appContext.state?.user != null && appContext.state?.user.role === UserRole.CLIENT) {
            const attendant = hackathonData?.attendants.find(
                (attendant) => attendant.user._id === appContext.state!.user!._id
            );
            setAttendant(attendant);
        }
    }, [hackathonData, appContext]);

    const onHackathonSubscribe = React.useCallback(() => {
        subscribeToHackathon(idHackathon)
            .then((hackathon) => setHackathonData(hackathon))
            .catch((error) => console.log(error));
    }, [idHackathon]);

    const onHackathonUnsubscibe = React.useCallback(() => {
        setAlertOpen(false);
        unsubscribeToHackathon(idHackathon)
            .then((hackathon) => setHackathonData(hackathon))
            .catch((error) => console.log(error));
    }, [idHackathon]);

    const onChangeStatus = React.useCallback(
        (status: HackathonStatus) => {
            changeHackathonStatus(idHackathon, status)
                .then((hackathon) => setHackathonData(hackathon))
                .catch((error) => console.log(error));
        },
        [idHackathon]
    );

    const onAssignPrize = React.useCallback(() => {}, []);

    function getHackathonButtons(currentUser: User | undefined, attendant: Attendant | undefined) {
        if (currentUser == null) return;

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
                                <MenuButton as={Button}>
                                    Gestisci
                                    <Icon name='chevron-down' pl='2px' size='28px' p='0' />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>
                                        <Link to={`/hackathons/update/${idHackathon}`}>
                                            Modifica
                                            <Icon name='external-link' pl='2px' />
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => onChangeStatus(HackathonStatus.ARCHIVED)}
                                        color={colors.red_dark}>
                                        Cancella evento
                                        <Icon name='warning-2' pl='2px' />
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <StyledBlueButton onClick={onAssignPrize}>
                                Assegna premi
                            </StyledBlueButton>
                        )
                    ) : (
                        <Heading as='h3' size='lg' color={colors.red_dark}>
                            Cancellato
                        </Heading>
                    )}
                </Stack>
            );
        }
    }

    return hackathonData == null || cancelRef == null ? (
        <div />
    ) : (
        <Box>
            <OverlappedBoxes
                mainStackStyle={{ width: ['90%'] }}
                TopContent={() => (
                    <StyledTitleBox>
                        <Heading as='h2' size='xl'>
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
                                <Badge
                                    variant='outline'
                                    variantColor='green'
                                    w='fit-content'
                                    m='auto'>
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
                                {getHackathonButtons(appContext.state?.user, attendant)}
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

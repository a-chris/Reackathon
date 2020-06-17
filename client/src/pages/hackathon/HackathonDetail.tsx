import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PseudoBox,
    Select,
    SimpleGrid,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
} from '@chakra-ui/core';
import _ from 'lodash';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';
import { BoxFullHeightAfterHeader } from '../../components/Common';
import ConfirmDialog from '../../components/ConfirmDialog';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import { Attendant, Hackathon, HackathonStatus, UserRole } from '../../models/Models';
import {
    changeHackathonStatus,
    getHackathon,
    subscribeToHackathon,
} from '../../services/HackathonService';
import socketClient from '../../socket/socket';
import SocketEvent from '../../socket/SocketEvent';
import colors from '../../utils/colors';
import { toDateString, toTimeString } from '../../utils/functions';
import { AttendantsList, StyledBlueButtonPadded } from './components/AttendantsList';
import { Information } from './components/HackathonInformation';
import { StyledTitleBox } from './components/StyledComponents';

type RouteParams = {
    id: string;
};

const HACKATHONS_TABS = ['Informazioni', 'Iscritti'];

const hackathonStatusToString = {
    [HackathonStatus.PENDING]: {
        text: 'non ancora iniziato',
        color: 'yellow',
    },
    [HackathonStatus.STARTED]: {
        text: 'in corso',
        color: 'green',
    },
    [HackathonStatus.FINISHED]: {
        text: 'concluso',
        color: 'red',
    },
    [HackathonStatus.ARCHIVED]: {
        text: 'cancellato',
        color: 'red',
    },
};

export default function HackathonDetail() {
    const appContext = React.useContext(AppContext);
    const params = useParams<RouteParams>();
    const hackathonId = params.id;
    const [hackathonData, setHackathonData] = React.useState<Hackathon>();
    const [attendant, setAttendant] = React.useState<Attendant | undefined>(undefined);
    const [isAlertOpen, setAlertOpen] = React.useState<boolean>(false);
    const [isArchiveAlertOpen, setArchiveAlertOpen] = React.useState<boolean>(false);
    const cancelRef = React.useRef<HTMLElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure(); // winner dialog

    React.useEffect(() => {
        if (appContext.state?.user?.role === 'ORGANIZATION') {
            socketClient.on(SocketEvent.NEW_ATTENDANT, (data: any) => {
                if (hackathonId === data?.id) {
                    // Update the current hackathon
                    console.log('UPDATE HACKATHON');
                    getHackathon(data.id).then((hackathon) => setHackathonData(hackathon));
                }
            });
        }
    }, [appContext.state, hackathonId]);

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

    const onChangeStatus = React.useCallback(
        (status: HackathonStatus) => {
            changeHackathonStatus(hackathonId, status)
                .then((hackathon) => setHackathonData(hackathon))
                .catch((error) => console.log(error));
        },
        [hackathonId]
    );

    const onHackathonFinish = React.useCallback(
        (winnerGroup: number) => {
            changeHackathonStatus(hackathonId, HackathonStatus.FINISHED, winnerGroup)
                .then((hackathon) => setHackathonData(hackathon))
                .catch((error) => console.log(error));
        },
        [hackathonId]
    );

    const getHackathonButtons = () => {
        const currentUser = appContext.state?.user;
        if (
            currentUser == null ||
            (currentUser.role === UserRole.ORGANIZATION &&
                currentUser._id !== hackathonData?.organization._id)
        ) {
            return;
        }

        if (currentUser.role === UserRole.CLIENT) {
            return attendant == null ? (
                <StyledBlueButtonPadded onClick={() => setAlertOpen(true)}>
                    Iscriviti
                </StyledBlueButtonPadded>
            ) : (
                <Badge ml='1' fontSize='0.8em' variantColor='green'>
                    <Text fontSize='md' fontWeight='bold'>
                        ISCRITTO
                    </Text>
                </Badge>
            );
        } else {
            return (
                <Stack spacing={2}>
                    {hackathonData?.status === HackathonStatus.PENDING && (
                        <>
                            <StyledBlueButtonPadded
                                onClick={() => onChangeStatus(HackathonStatus.STARTED)}>
                                Avvia
                            </StyledBlueButtonPadded>
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
                                    <Link to={`/hackathons/update/${hackathonId}`}>
                                        <MenuItem alignItems='center'>
                                            Modifica
                                            <Icon name='external-link' ml='2px' size='20px' />
                                        </MenuItem>
                                    </Link>
                                    <MenuItem
                                        alignItems='center'
                                        onClick={() => setArchiveAlertOpen(true)}
                                        color={colors.red_dark}>
                                        Cancella evento
                                        <Icon name='warning-2' ml='2px' size='20px' />
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    )}
                    {hackathonData?.status === HackathonStatus.STARTED && (
                        <StyledBlueButtonPadded onClick={onOpen}>Concludi</StyledBlueButtonPadded>
                    )}
                    {hackathonData?.status === HackathonStatus.ARCHIVED && (
                        <Heading as='h2' size='lg' color={colors.red_dark}>
                            Archiviato
                        </Heading>
                    )}
                    {hackathonData?.status === HackathonStatus.FINISHED && (
                        <Heading as='h2' size='lg' color={colors.yellow}>
                            Concluso
                        </Heading>
                    )}
                </Stack>
            );
        }
    };

    return hackathonData == null || cancelRef == null ? (
        <div />
    ) : (
        <BoxFullHeightAfterHeader isLogged={appContext.state?.user != null}>
            <ContainerWithBackgroundImage>
                <OverlappedBoxes
                    mainStackStyle={{ width: ['90%', '85%', '70%', '65%'] }}
                    topBoxStyle={{
                        pl: ['2%', '2%', '5%', '5%'],
                        pr: ['2%', '2%', '5%', '5%'],
                        pt: '15px',
                        pb: '15px',
                    }}
                    TopContent={() => (
                        <StyledTitleBox>
                            <Heading as='h1' size='xl'>
                                {hackathonData.name}
                            </Heading>
                            <SimpleGrid columns={[1, 1, 2, 2]} textAlign='left'>
                                <Stack>
                                    <Stack
                                        isInline
                                        color={colors.gray_dark}
                                        fontWeight='500'
                                        letterSpacing='wide'
                                        fontSize='md'>
                                        <PseudoBox textTransform='capitalize'>
                                            {hackathonData.location.street}{' '}
                                            {hackathonData.location.number} &bull;{' '}
                                            {hackathonData.location.city} &bull;{' '}
                                            {hackathonData.location.country}
                                        </PseudoBox>
                                    </Stack>

                                    <StyledDateContainer>
                                        <PseudoBox pr={10}>
                                            <Stack isInline spacing='4' pb={1}>
                                                <Icon
                                                    name='calendar'
                                                    size='1.3em'
                                                    color={colors.red}
                                                />
                                                <Heading as='h2' size='sm'>
                                                    Inizio
                                                </Heading>
                                            </Stack>
                                            <Text pl={1}>
                                                {toDateString(hackathonData.startDate)}, ore{' '}
                                                {toTimeString(hackathonData.startDate)}
                                            </Text>
                                        </PseudoBox>
                                        <PseudoBox>
                                            <Stack isInline spacing='4' pb={1}>
                                                <Icon
                                                    name='calendar'
                                                    size='1.3em'
                                                    color={colors.red}
                                                />
                                                <Heading as='h2' size='sm'>
                                                    Fine
                                                </Heading>
                                            </Stack>
                                            <Text>
                                                {toDateString(hackathonData.endDate)}, ore{' '}
                                                {toTimeString(hackathonData.endDate)}
                                            </Text>
                                        </PseudoBox>
                                    </StyledDateContainer>
                                </Stack>

                                <Flex
                                    alignItems='center'
                                    justifyContent={['center', 'center', 'flex-end']}
                                    wrap='wrap'
                                    pr={[null, null, '8%', '8%']}>
                                    <Stack spacing={3} alignItems='center'>
                                        <Badge
                                            variantColor={
                                                hackathonStatusToString[hackathonData.status].color
                                            }
                                            mt='2'>
                                            Hackathon{' '}
                                            {hackathonStatusToString[hackathonData.status].text}
                                        </Badge>
                                        {getHackathonButtons()}
                                    </Stack>
                                </Flex>
                            </SimpleGrid>
                        </StyledTitleBox>
                    )}
                    BottomContent={() => (
                        <Box>
                            <Tabs isFitted p='1%'>
                                <TabList mb='1em'>
                                    {HACKATHONS_TABS.map((tabTitle) => (
                                        <Tab key={`tab-${tabTitle}`}>{tabTitle}</Tab>
                                    ))}
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Information hackathon={hackathonData} />
                                    </TabPanel>
                                    <TabPanel>
                                        <AttendantsList
                                            attendants={hackathonData.attendants}
                                            currentAttendant={attendant}
                                        />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    )}
                />
                <ConfirmDialog
                    isOpen={isAlertOpen}
                    title='Sei sicuro di volerti iscrivere?'
                    onClose={() => setAlertOpen(false)}
                    onConfirm={onHackathonSubscribe}
                />
                <ConfirmDialog
                    isOpen={isArchiveAlertOpen}
                    title="Sei sicuro di voler cancellare l'Hackathon? Questa operazione è irreversibile."
                    onClose={() => setArchiveAlertOpen(false)}
                    onConfirm={() => onChangeStatus(HackathonStatus.ARCHIVED)}
                />
                <WinnerDialog
                    isOpen={isOpen}
                    attendants={hackathonData.attendants}
                    onClose={onClose}
                    onConfirm={onHackathonFinish}
                />
            </ContainerWithBackgroundImage>
        </BoxFullHeightAfterHeader>
    );
}

interface WinnerDialogProps {
    attendants: Attendant[];
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (groupId: number) => void;
}

function WinnerDialog(props: WinnerDialogProps) {
    const [selectedGroup, setSelectedGroup] = React.useState<any>();
    const groups = _.groupBy(props.attendants, (a) => a.group) as object;

    const onChangeWinner = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event?.target;
        if (value != null) {
            setSelectedGroup(value);
        }
    };

    const onConfirm = () => {
        setSelectedGroup(null);
        props.onClose();
        props.onConfirm(selectedGroup);
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Concludi Hackathon</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Select placeholder='Gruppo vincitore' onChange={onChangeWinner}>
                        {Object.entries(groups).map((e) => (
                            <option value={e[0]} key={e[0]}>
                                Gruppo #{e[0]}:{' '}
                                {e[1].map((a: Attendant) => a.user.username).join(', ')}
                            </option>
                        ))}
                    </Select>
                </ModalBody>

                <ModalFooter>
                    <Button variant='outline' variantColor='red' mr={3} onClick={props.onClose}>
                        ANNULLA
                    </Button>
                    <Button
                        variant='solid'
                        variantColor='green'
                        isDisabled={selectedGroup == null}
                        onClick={onConfirm}>
                        CONFERMA
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

const ContainerWithBackgroundImage = styled(Box).attrs({
    backgroundImage: "url('./images/background/space-min.jpg')",
    w: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    h: 'fit-content',
    minH: 'inherit',
    backgroundPosition: 'bottom',
})``;

const StyledDateContainer = styled(Flex).attrs({
    pt: ['8px', '8px', '10px', '10px'],
    pb: ['10px', '10px', '20px', '20px'],
    pr: 0,
})`
    font-size: 90%;
    letter-spacing: 1px;
    align-items: center;
    flex-wrap: wrap;
`;

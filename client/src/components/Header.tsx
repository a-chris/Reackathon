import {
    Box,
    Button,
    ButtonGroup,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    Icon,
    Stack,
    Tag,
    Text,
    useDisclosure,
} from '@chakra-ui/core';
import { Howl } from 'howler';
import _ from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCounter } from 'react-use';
import styled from 'styled-components';
import { AppContext } from '../AppContext';
import { Attendant, UserRole } from '../models/Models';
import { acceptInvite, declineInvite, getUserAttendants } from '../services/AttendantService';
import { logout } from '../services/AuthService';
import socketClient from '../socket/socket';
import SocketEvent from '../socket/SocketEvent';
import colors from '../utils/colors';
import { Logo } from './Logo';
import { StyledLinkRouter } from './Common';

type InviteData = {
    inviteId: string;
    from: string;
    hackathonId: string;
    hackathon: string;
    date: Date;
    status: 'pending' | 'accepted' | 'declined';
};

type MenuItem = {
    name: string;
    path: string;
    role: UserRole[] | undefined;
    action?: () => void;
};

const ACTION_MENU_ITEMS: MenuItem[] = [
    {
        name: 'Dashboard',
        path: '/org',
        role: [UserRole.ORGANIZATION],
    },
    {
        name: 'I tuoi Hackathon',
        path: '/hackathons',
        role: [UserRole.CLIENT],
    },
    {
        name: 'Crea Hackathon',
        path: '/hackathons/create',
        role: [UserRole.ORGANIZATION],
    },
    {
        name: 'Lista Hackathon',
        path: '/hackathons',
        role: [UserRole.CLIENT, UserRole.ORGANIZATION],
    },
    {
        name: 'Classifica',
        path: '/ranking',
        role: [UserRole.CLIENT],
    },
];

const notificationSound = new Howl({
    src: [require('./../resources/sound/pop.mp3')],
});

export default function Header() {
    const history = useHistory();
    const appContext = React.useContext(AppContext);
    const { isOpen, onOpen, onClose } = useDisclosure(); // drawer
    const drawerRef = React.useRef<HTMLElement>(null);
    const [invites, setInvites] = React.useState<InviteData[]>([]);
    const [isHamburgerMenuOpen, setHamburgerMenuOpen] = React.useState<boolean>(false);
    const [invitesChanged, { inc }] = useCounter(0);

    React.useEffect(() => {
        if (appContext.state?.user?.role === UserRole.CLIENT) {
            const userId = appContext.state.user?._id;
            socketClient.on(SocketEvent.NEW_INVITE, () => {
                if (userId != null) {
                    console.log('UPDATE INVITES');
                    notificationSound.play();
                    getUserAttendants(userId).then((attendants) => {
                        setInvites(mapAttendantsToInvitesData(attendants));
                    });
                }
            });
        }
    }, [appContext.state]);

    React.useEffect(() => {
        const userId = appContext.state?.user?._id;
        const isClient = appContext.state?.user?.role === 'CLIENT';
        if (userId != null && isClient) {
            getUserAttendants(userId).then((attendants) => {
                setInvites(mapAttendantsToInvitesData(attendants));
            });
        }
    }, [appContext.state, invitesChanged]);

    const onLogout = React.useCallback(() => {
        if (appContext.state?.user) {
            logout(appContext.state.user).then(() => {
                if (appContext?.onLogout != null) {
                    appContext.onLogout();
                }
            });
        }
    }, [appContext]);

    function onMenuClick(path: string) {
        setHamburgerMenuOpen(false);
        if (path === '/hackathons' && appContext.state?.user?.role === 'CLIENT') {
            history.push({ pathname: path, search: `?user=${appContext.state.user.username}` });
        } else {
            history.push(path);
        }
    }

    const onHamburgerMenuToogle = () => setHamburgerMenuOpen(!isHamburgerMenuOpen);

    const onAcceptInvite = (inviteId: string) => {
        acceptInvite(inviteId).then(() => inc(1));
    };

    const onDeclineInvite = (inviteId: string) => {
        declineInvite(inviteId).then(() => inc(1));
    };

    const actionsMenu = React.useMemo(() => {
        const currentRole = appContext.state?.user?.role;
        return ACTION_MENU_ITEMS.filter(
            (el) => el.role === currentRole || (currentRole && el.role?.includes(currentRole))
        );
    }, [appContext.state]);

    const isLogged = appContext.state?.user != null;
    const isClient = appContext.state?.user?.role === 'CLIENT';
    const pendingInvites = invites.filter((invite) => invite.status === 'pending').length;

    return (
        <StyledNavBar isSecondMenuShown={isLogged}>
            <Stack isInline justify='space-between' align='center'>
                <Logo />
                <Box
                    display={['flex', 'flex', 'none', 'none']}
                    justifyContent='flex-end'
                    marginRight={0}>
                    {isLogged && isClient && (
                        <Button
                            variant='ghost'
                            leftIcon={() => <Icon name='bell' mr={0} />}
                            size='md'
                            pr={3}
                            aria-label='notifiche'
                            ref={drawerRef}
                            onClick={onOpen}>
                            {pendingInvites > 0 && (
                                <Box color={colors.red} fontSize='xs' fontWeight='900' pt={1}>
                                    {pendingInvites}
                                </Box>
                            )}
                        </Button>
                    )}
                    <Button
                        onClick={onHamburgerMenuToogle}
                        variant='ghost'
                        minW='fit-content'
                        pl={2}
                        pr={2}>
                        <svg
                            fill={colors.blue_night}
                            width='20px'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'>
                            <title>Menu</title>
                            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
                        </svg>
                    </Button>
                </Box>
                <Flex
                    justify='flex-end'
                    flexWrap='wrap'
                    display={['none', 'none', 'block', 'block']}>
                    {isLogged ? (
                        <>
                            <StyledHeaderButton
                                color={colors.red}
                                onClick={() =>
                                    onMenuClick(`/profile/${appContext?.state?.user?.username}`)
                                }>
                                {appContext?.state?.user?.username}
                            </StyledHeaderButton>
                            <StyledHeaderButton color={colors.blue_light} onClick={onLogout}>
                                Logout
                            </StyledHeaderButton>
                        </>
                    ) : (
                        <>
                            <StyledHeaderButton
                                color={colors.red}
                                onClick={() => onMenuClick('/login')}>
                                Login
                            </StyledHeaderButton>
                            <StyledHeaderButton
                                color={colors.blue_light}
                                onClick={() => onMenuClick('/signup')}>
                                Registrati
                            </StyledHeaderButton>
                        </>
                    )}
                    {isLogged && isClient && (
                        <StyledHeaderButton
                            leftIcon={() => <Icon name='bell' mr={0} />}
                            aria-label='notifiche'
                            ref={drawerRef}
                            onClick={onOpen}>
                            {pendingInvites > 0 && (
                                <Box color={colors.red} fontSize='xs' fontWeight='900' pt={1}>
                                    {pendingInvites}
                                </Box>
                            )}
                        </StyledHeaderButton>
                    )}
                </Flex>
            </Stack>
            <Box display={['none', 'none', 'block', 'block']}>
                {actionsMenu && actionsMenu?.length > 0 && (
                    <StyledMenu>
                        <ButtonGroup spacing={3}>
                            {actionsMenu?.map((el, index) => (
                                <Button
                                    key={el.path + index}
                                    h='1.8em'
                                    pl={6}
                                    pr={6}
                                    variant='outline'
                                    color={index % 2 === 0 ? colors.blue_light : colors.red}
                                    borderColor={index % 2 === 0 ? colors.blue_light : colors.red}
                                    onClick={() => onMenuClick(el.path)}>
                                    {el.name}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </StyledMenu>
                )}
            </Box>

            {isLogged && isClient && (
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={onClose}
                    finalFocusRef={drawerRef}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Notifiche</DrawerHeader>
                        <DrawerBody>
                            {invites?.map((invite, index) => (
                                <InviteItem
                                    inviteData={invite}
                                    onAccept={onAcceptInvite}
                                    onDecline={onDeclineInvite}
                                    key={index}
                                />
                            ))}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            )}

            {isHamburgerMenuOpen && (
                <Drawer
                    isOpen={isHamburgerMenuOpen}
                    placement='right'
                    onClose={onHamburgerMenuToogle}
                    finalFocusRef={drawerRef}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody>
                            <Stack>
                                <Heading as='h1' size='sm' color={colors.red}>
                                    Account
                                </Heading>
                                {isLogged ? (
                                    <>
                                        <StyledHamburgerHeaderButton
                                            onClick={() =>
                                                onMenuClick(
                                                    `/profile/${appContext?.state?.user?.username}`
                                                )
                                            }>
                                            {appContext?.state?.user?.username}
                                        </StyledHamburgerHeaderButton>
                                        <StyledHamburgerHeaderButton onClick={onLogout}>
                                            Logout
                                        </StyledHamburgerHeaderButton>
                                    </>
                                ) : (
                                    <>
                                        <StyledHamburgerHeaderButton
                                            onClick={() => onMenuClick('/login')}>
                                            Login
                                        </StyledHamburgerHeaderButton>
                                        <StyledHamburgerHeaderButton
                                            onClick={() => onMenuClick('/signup')}>
                                            Registrati
                                        </StyledHamburgerHeaderButton>
                                    </>
                                )}
                                {actionsMenu && actionsMenu?.length > 0 && (
                                    <>
                                        <Heading
                                            as='h1'
                                            size='sm'
                                            mt={3}
                                            mb={2}
                                            color={colors.blue_night}>
                                            Naviga
                                        </Heading>
                                        <Stack>
                                            {actionsMenu?.map((el) => (
                                                <StyledHamburgerHeaderButton
                                                    key={el.path}
                                                    onClick={() => onMenuClick(el.path)}>
                                                    {el.name}
                                                </StyledHamburgerHeaderButton>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            )}
        </StyledNavBar>
    );
}

interface InviteItemProps {
    inviteData: InviteData;
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
}

function InviteItem(props: InviteItemProps) {
    return (
        <Box border={`2px solid ${colors.gray_dark}`} p={2}>
            <Text>
                L'utente{' '}
                <StyledLinkRouter
                    to={`/profile/${props.inviteData.from}`}
                    linkColor={colors.red}
                    linkWeight='500'>
                    {props.inviteData.from}
                </StyledLinkRouter>{' '}
                ti ha invitato a far parte del suo gruppo.
            </Text>
            <Text pt={2}>
                Hackathon:{' '}
                <StyledLinkRouter
                    to={`/hackathons/${props.inviteData.hackathonId}`}
                    linkColor={colors.red}
                    linkWeight='500'>
                    {props.inviteData.hackathon}
                </StyledLinkRouter>
            </Text>
            <Flex justifyContent='flex-end' pt={2}>
                {props.inviteData.status === 'pending' && (
                    <>
                        <Button
                            size='sm'
                            variantColor='green'
                            onClick={() => props.onAccept(props.inviteData.inviteId)}>
                            ACCETTA
                        </Button>
                        <Button
                            size='sm'
                            onClick={() => props.onDecline(props.inviteData.inviteId)}>
                            RIFIUTA
                        </Button>
                    </>
                )}
                {props.inviteData.status === 'accepted' && (
                    <Tag variantColor='green'>ACCETTATO</Tag>
                )}
                {props.inviteData.status === 'declined' && <Tag variantColor='red'>RIFIUTATO</Tag>}
            </Flex>
        </Box>
    );
}

function mapAttendantsToInvitesData(attendants: Attendant[]): InviteData[] {
    const invites = attendants.flatMap(
        (a) =>
            a.invites?.map((i) => ({
                inviteId: i._id,
                from: i.from.user.username,
                hackathonId: a.hackathon._id,
                hackathon: a.hackathon.name,
                date: i.date,
                status: i.status,
            })) || []
    );
    return _.orderBy(invites, ['date'], ['desc']);
}

interface NavBarProps {
    isSecondMenuShown: boolean;
}

const StyledNavBar = styled(Box).attrs((props: NavBarProps) => ({
    pt: ['10px', '5px', '0px', null],
    pb: '5px',
    pl: ['5px', '10px', '20px', '25px'],
    pr: ['5px', '10px', '20px', '25px'],
    height: ['3.2rem', '3.2rem', props.isSecondMenuShown ? '6.5rem' : '4rem', null],
}))<NavBarProps>`
    width: 100%;
    overflow: hidden;
    text-align: left;
    box-shadow: 0px 0px 4px ${colors.blue_light};
`;

const StyledMenu = styled.div`
    text-align: left;
    padding-bottom: 5px;
`;

const StyledHeaderButton = styled(Button).attrs({
    mr: 1,
    pl: '5px',
    pr: '5px',
    h: '1.8em',
    variant: 'ghost',
})``;

const StyledHamburgerHeaderButton = styled(Button).attrs({
    pl: '5px',
    m: 1,
    h: '1.8em',
    w: 'fit-content',
    variant: 'ghost',
})``;

// const StyledLink = styled(Link)`
//     color: ${colors.red};
//     font-weight: 500;
//     :hover {
//         text-decoration: underline;
//     }
// `;

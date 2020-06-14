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
    IconButton,
    Stack,
    Tag,
    Text,
    useDisclosure,
} from '@chakra-ui/core';
import _ from 'lodash';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCounter } from 'react-use';
import styled from 'styled-components';
import { AppContext } from '../AppContext';
import { Attendant, UserRole } from '../models/Models';
import { acceptInvite, declineInvite, getUserAttendants } from '../services/AttendantService';
import { logout } from '../services/AuthService';
import colors from '../utils/colors';

type InviteData = {
    inviteId: string;
    from: string;
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
        name: 'Crea',
        path: '/hackathons/create',
        role: [UserRole.ORGANIZATION],
    },
    {
        name: 'Lista Hackathon',
        path: '/hackathons',
        role: [UserRole.ORGANIZATION],
    },
    {
        name: 'I tuoi Hackathon',
        path: '/hackathons',
        role: [UserRole.CLIENT],
    },
    {
        name: 'Classifica',
        path: '/ranking',
        role: [UserRole.CLIENT, UserRole.ORGANIZATION],
    },
];

export default function Header() {
    const history = useHistory();
    const appContext = React.useContext(AppContext);
    const { isOpen, onOpen, onClose } = useDisclosure(); // drawer
    const drawerRef = React.useRef<HTMLElement>(null);
    const [invites, setInvites] = React.useState<InviteData[]>([]);
    const [invitesChanged, { inc }] = useCounter(0);

    React.useEffect(() => {
        const userId = appContext.state?.user?._id;
        if (userId != null) {
            getUserAttendants(userId).then((attendants) => {
                setInvites(mapAttendantsToInvitesData(attendants));
            });
        }
    }, [appContext.state, invitesChanged]);

    const onLogout = React.useCallback(() => {
        if (appContext.state?.user) {
            logout(appContext.state.user).then((success) => {
                if (appContext?.onLogout != null) {
                    appContext.onLogout();
                    // push the user to the homepage
                    history.push('/');
                }
            });
        }
    }, [appContext, history]);

    function onMenuClick(path: string) {
        history.push(path);
    }

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

    return (
        <StyledNavBar>
            <Stack isInline justify='space-between' align='center'>
                <Link to='/'>
                    <StyledLogo>
                        <span style={{ color: `${colors.blue_light}` }}>reac</span>
                        <span style={{ color: `${colors.red}` }}>kathon</span>
                    </StyledLogo>
                </Link>
                <Flex justify='flex-end' flexWrap='wrap'>
                    {isLogged ? (
                        <>
                            <StyledHeaderButton
                                color={colors.red}
                                onClick={() =>
                                    onMenuClick(`/profile/${appContext?.state?.user?.username}`)
                                }>
                                Profilo
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
                        <IconButton
                            variant='ghost'
                            icon='bell'
                            size='lg'
                            aria-label='notifiche'
                            ref={drawerRef}
                            onClick={onOpen}
                        />
                    )}
                </Flex>
            </Stack>
            {actionsMenu && actionsMenu?.length > 0 && (
                <StyledMenu>
                    <ButtonGroup spacing={3}>
                        {actionsMenu?.map((el, index) => (
                            <Button
                                key={el.path}
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
        <Box border={`3px solid ${colors.gray_dark}`}>
            <Text>{props.inviteData.from} ti ha invitato nel suo gruppo.</Text>
            <Text>Hackathon: {props.inviteData.hackathon}</Text>
            <Flex>
                {props.inviteData.status === 'pending' && (
                    <>
                        <Button size='sm' onClick={() => props.onAccept(props.inviteData.inviteId)}>
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
                hackathon: a.hackathon.name,
                date: i.date,
                status: i.status,
            })) || []
    );
    return _.orderBy(invites, ['date'], ['desc']);
}

const StyledNavBar = styled(Box).attrs({
    pt: '5px',
    pb: '5px',
    pl: ['6px', '10px', '20px', '25px'],
    pr: ['2px', '10px', '20px', '25px'],
})`
    height: 15vh;
    width: 100%;
    overflow: hidden;
    text-align: left;
    box-shadow: 0px 0px 4px ${colors.blue_light};
`;

const StyledMenu = styled.div`
    text-align: left;
    padding-bottom: 5px;
`;

const StyledLogo = styled(Box).attrs({
    fontSize: ['26px', '28px', '48px', '48px'],
})`
    font-family: 'Expansiva';
    font-weight: 400;
    margin: 0;
`;

const StyledHeaderButton = styled(Button).attrs({
    mr: 1,
    pl: '5px',
    pr: '5px',
    h: '1.8em',
    variant: 'ghost',
})``;

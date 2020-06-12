import { Box, Button, ButtonGroup, Flex, Stack } from '@chakra-ui/core';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../AppContext';
import { UserRole } from '../models/Models';
import { logout } from '../services/AuthService';
import colors from '../utils/colors';

type MenuItem = {
    name: string;
    path: string;
    role: UserRole[] | undefined;
    action?: () => void;
};

const actionMenuItems: MenuItem[] = [
    {
        name: 'Dashboard',
        path: '/org',
        role: [UserRole.ORGANIZATION],
    },
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
        role: [UserRole.CLIENT],
    },
];

export default function Header() {
    const history = useHistory();
    const appContext = React.useContext(AppContext);
    const [currentRole, setCurrentRole] = React.useState<UserRole | undefined>(
        appContext.state?.user?.role
    );
    const [authMenu, setAuthMenu] = React.useState<MenuItem[]>();
    const [actionsMenu, setActionsMenu] = React.useState<MenuItem[]>();

    React.useEffect(() => {
        const currentRole = appContext.state?.user?.role;
        setCurrentRole(currentRole);
        setActionsMenu(
            actionMenuItems.filter(
                (el) => el.role === currentRole || (currentRole && el.role?.includes(currentRole))
            )
        );
        setAuthMenu(
            authMenuItems.filter(
                (el) => el.role === currentRole || (currentRole && el.role?.includes(currentRole))
            )
        );
    }, [appContext.state?.user]);

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
    }, [appContext.state?.user, history]);

    const authMenuItems: MenuItem[] = React.useMemo(
        () => [
            {
                name: 'Login',
                path: '/login',
                role: undefined,
            },
            {
                name: 'Registrati',
                path: '/signup',
                role: undefined,
            },
            {
                name: 'Profilo',
                path: `/profile/${appContext?.state?.user?.username}`,
                role: [UserRole.CLIENT, UserRole.ORGANIZATION],
            },
            {
                name: 'Logout',
                path: '/',
                role: [UserRole.CLIENT, UserRole.ORGANIZATION],
                action: () => onLogout(),
            },
        ],
        [appContext, onLogout]
    );

    function onMenuClick(path: string) {
        history.push(path);
    }

    return (
        <StyledNavBar>
            <Stack isInline justify='space-between' align='center'>
                <Link to='/'>
                    <StyledLogo>
                        <StyledLogoOrange>reac</StyledLogoOrange>
                        <StyledLogoRed>kathon</StyledLogoRed>
                    </StyledLogo>
                </Link>
                <Flex justify='flex-end' flexWrap='wrap'>
                    {authMenu?.map((el, index) => (
                        <Button
                            mr={1}
                            pl='5px'
                            pr='5px'
                            key={el.path}
                            h='1.8em'
                            variant='ghost'
                            color={index % 2 === 0 ? colors.gold : colors.blue_light}
                            onClick={() => (el.action ? el.action() : onMenuClick(el.path))}>
                            {el.name}
                        </Button>
                    ))}
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
                                color={index % 2 === 0 ? colors.blue_light : colors.gold}
                                borderColor={index % 2 === 0 ? colors.blue_light : colors.gold}
                                onClick={() => onMenuClick(el.path)}>
                                {el.name}
                            </Button>
                        ))}
                    </ButtonGroup>
                </StyledMenu>
            )}
        </StyledNavBar>
    );
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
    font-family: Expansiva;
    font-weight: 400;
    margin: 0;
`;

const StyledLogoOrange = styled.span`
    color: ${colors.blue_light};
`;

const StyledLogoRed = styled.span`
    color: ${colors.gold};
`;

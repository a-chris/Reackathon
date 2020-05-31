import React from 'react';
import { Stack, Button, ButtonGroup } from '@chakra-ui/core';
import { red_dark, red_light, orange, yellow, orange_dark, gray, white } from '../../utils/colors';
import styled from 'styled-components';
import { useHistory, Link } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { UserRole } from '../../models/Models';
import { logout } from '../../services/LoginService';

const menuItems: { name: string; path: string }[] = [
    {
        name: 'Crea',
        path: '/hackathons/create',
    },
    {
        name: 'Lista',
        path: '/hackathons',
    },
];

export default function Header() {
    const history = useHistory();
    const appContext = React.useContext(AppContext);
    const currenRole = appContext.state?.user?.role;

    function onMenuClick(path: string) {
        history.push(path);
    }

    const onLogout = React.useCallback(() => {
        if (appContext.state?.user) {
            logout(appContext.state.user).then((success) => {
                if (appContext?.onLogout != null) {
                    appContext.onLogout();
                }
            });
        }
    }, [appContext]);

    const loginMenu: {
        name: string;
        path: string;
        role: UserRole[] | undefined;
        action?: () => void;
    }[] = [
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
            path: '/profile',
            role: [UserRole.CLIENT, UserRole.ORGANIZATION],
        },
        {
            name: 'Logout',
            path: '/',
            role: [UserRole.CLIENT, UserRole.ORGANIZATION],
            action: () => onLogout(),
        },
    ];

    return (
        <StyledNavBar>
            <Stack>
                <Stack isInline justify='space-between' align='center'>
                    <Link to='/'>
                        <StyledLogo>
                            <StyledLogoOrange>reac</StyledLogoOrange>
                            <StyledLogoRed>kathon</StyledLogoRed>
                        </StyledLogo>
                    </Link>
                    <div>
                        {loginMenu
                            .filter(
                                (el) =>
                                    el.role === currenRole ||
                                    (currenRole && el.role?.includes(currenRole))
                            )
                            .map((el, index) => (
                                <Button
                                    key={el.path}
                                    h='1.8em'
                                    variant='ghost'
                                    // color={white}
                                    color={index % 2 === 0 ? yellow : orange_dark}
                                    // boxShadow={'-3px 4px 3px ' + gray}
                                    onClick={() =>
                                        el.action ? el.action() : onMenuClick(el.path)
                                    }>
                                    {el.name}
                                </Button>
                            ))}
                    </div>
                </Stack>
                {appContext.state?.user?.role === UserRole.ORGANIZATION && (
                    <StyledMenu>
                        <ButtonGroup spacing={3}>
                            {menuItems.map((el, index) => (
                                <Button
                                    key={el.path}
                                    h='1.8em'
                                    pl={6}
                                    pr={6}
                                    // variant='outline'
                                    color={white}
                                    bg={index % 2 === 0 ? yellow : orange_dark}
                                    boxShadow={'-3px 4px 3px ' + gray}
                                    onClick={() => onMenuClick(el.path)}>
                                    {el.name}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </StyledMenu>
                )}
            </Stack>
        </StyledNavBar>
    );
}

const StyledNavBar = styled.div`
    width: 100%;
    overflow: hidden;
    text-align: left;
    padding: 5px 25px;
    box-shadow: 0px 0px 4px ${red_dark};
`;

const StyledMenu = styled.div`
    text-align: left;
`;

const StyledLogo = styled.h1`
    font-family: Expansiva;
    font-size: 300%;
`;

const StyledLogoOrange = styled.span`
    color: ${orange};
`;

const StyledLogoRed = styled.span`
    color: ${red_light};
`;

import { Button, ButtonGroup, Stack } from '@chakra-ui/core';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../AppContext';
import { UserRole } from '../models/Models';
import { logout } from '../services/AuthService';
import colors from '../utils/colors';

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
            path: `/profile/${appContext?.state?.user?.username}`,
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
                                    // color={colors.white}
                                    color={index % 2 === 0 ? colors.yellow : colors.orange_dark}
                                    // boxShadow={'-3px 4px 3px ' + colors.gray}
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
                                    color={colors.white}
                                    bg={index % 2 === 0 ? colors.yellow : colors.orange_dark}
                                    boxShadow={'-3px 4px 3px ' + colors.gray}
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
    box-shadow: 0px 0px 4px ${colors.red_dark};
`;

const StyledMenu = styled.div`
    text-align: left;
`;

const StyledLogo = styled.h1`
    font-family: Expansiva;
    font-size: 300%;
`;

const StyledLogoOrange = styled.span`
    color: ${colors.orange};
`;

const StyledLogoRed = styled.span`
    color: ${colors.red_light};
`;

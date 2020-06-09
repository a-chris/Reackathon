import { Button, ButtonGroup, Stack, Box, Flex } from '@chakra-ui/core';
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
                    // push the user to the homepage
                    history.push('/');
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
                    <Flex justify='flex-end' flexWrap='wrap'>
                        {loginMenu
                            .filter(
                                (el) =>
                                    el.role === currenRole ||
                                    (currenRole && el.role?.includes(currenRole))
                            )
                            .map((el, index) => (
                                <Button
                                    mr={1}
                                    pl='5px'
                                    pr='5px'
                                    key={el.path}
                                    h='1.8em'
                                    variant='ghost'
                                    // color={colors.white}
                                    color={index % 2 === 0 ? colors.gold : colors.blue_light}
                                    // boxShadow={'-3px 4px 3px ' + colors.gray}
                                    onClick={() =>
                                        el.action ? el.action() : onMenuClick(el.path)
                                    }>
                                    {el.name}
                                </Button>
                            ))}
                    </Flex>
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
                                    variant='outline'
                                    // color={colors.white}
                                    color={index % 2 === 0 ? colors.blue_light : colors.gold}
                                    borderColor={index % 2 === 0 ? colors.blue_light : colors.gold}
                                    // boxShadow={'-3px 4px 3px ' + colors.gray}
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

const StyledNavBar = styled(Box).attrs({
    pt: '5px',
    pl: ['6px', '10px', '20px', '25px'],
    pr: ['2px', '10px', '20px', '25px'],
})`
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

import React from 'react';
import { Stack, Button, ButtonGroup } from '@chakra-ui/core';
import { red_dark, red_light, orange, yellow, orange_dark, gray, white } from '../../utils/colors';
import styled from 'styled-components';

const menuItems: { name: string; path: string }[] = [
    {
        name: 'Crea',
        path: '/hackathon/1',
    },
    {
        name: 'Lista',
        path: '/hackathons',
    },
];

export default function Header() {

    const onMenuClick = (path: string) => {};

    return (
        <StyledNavBar>
            <Stack>
                <StyledLogo>
                    <StyledLogoOrange>reac</StyledLogoOrange>
                    <StyledLogoRed>kathon</StyledLogoRed>
                </StyledLogo>
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
            </Stack>
        </StyledNavBar>
    );
}

const StyledNavBar = styled.div`
    width: 100%;
    overflow: hidden;
    text-align: left;
    padding-left: 25px;
    padding-bottom: 5px;
    box-shadow: 0px 0px 4px ${red_dark};
`;

const StyledMenu = styled.div`
    text-align: left;
`;

const StyledLogo = styled.h1`
    font-family: Expansiva;
    font-size: 2.5em;
`;

const StyledLogoOrange = styled.span`
    color: ${orange};
`;

const StyledLogoRed = styled.span`
    color: ${red_light};
`;

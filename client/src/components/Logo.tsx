import { Box } from '@chakra-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../utils/colors';

export function Logo() {
    return (
        <Link to='/'>
            <StyledLogo>
                <span className='logo' style={{ color: colors.blue_light }}>
                    reac
                </span>
                <span className='logo' style={{ color: colors.red }}>
                    kathon
                </span>
            </StyledLogo>
        </Link>
    );
}

const StyledLogo = styled(Box).attrs({
    fontSize: ['26px', '28px', '46px', '46px'],
})`
    font-family: 'Expansiva';
    font-weight: 400;
    margin: 0;
`;

import { Stack, Image } from '@chakra-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../utils/colors';

type LogoProps = {
    withLogoImage?: boolean;
};

export function Logo(props: LogoProps) {
    return (
        <Link to='/'>
            <StyledLogo>
                {props.withLogoImage && (
                    <Image src='/logo.png' size={['26px', '28px', '46px', '46px']} alt='logo' />
                )}
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

const StyledLogo = styled(Stack).attrs({
    fontSize: ['26px', '28px', '46px', '46px'],
    isInline: true,
    alignItems: 'center',
})`
    font-family: 'Expansiva';
    font-weight: 400;
    margin: 0;
`;

import { Box, Button, Stack } from '@chakra-ui/core';
import styled from 'styled-components';
import colors from '../../../utils/colors';

export const StyledTitleBox = styled(Box).attrs({
    pt: '1rem',
    pb: '0.5rem',
    pl: ['2%', '2%'],
    pr: ['2%', '2%'],
})``;

export const StyledBottomBoxContainer = styled(Box).attrs({
    pt: '1rem',
    pb: '2rem',
    pl: ['5%', '15%'],
    pr: ['5%', '15%'],
})`
    & > * {
        padding-bottom: 5px;
    }
`;

export const StyledBlueButton = styled(Button).attrs({
    bg: colors.blue_night,
    color: colors.white,
    rounded: 'md',
})``;

export const StyledDateContainer = styled(Stack).attrs({
    isInline: true,
})`
    font-size: 90%;
    letter-spacing: 1px;
    padding: 5px;
    align-items: center;
    justify-content: center;
`;

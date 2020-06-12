import { Box, FormLabel } from '@chakra-ui/core';
import styled from 'styled-components';

interface BoxWithSpacedChildrenProps {
    space: string;
}

export const BoxWithSpacedChildren = styled(Box)<BoxWithSpacedChildrenProps>`
    & > * {
        margin-bottom: ${(props) => props.space};
    }
`;

interface AlignmentProps {
    translateY?: string;
}

export const StyledCenteredContainer = styled(Box)<AlignmentProps>`
    position: absolute;
    top: 50%;
    transform: translateY(${(props) => props?.translateY});
    width: 100%;
    text-align: center;
`;

export const StyledLabel = styled(FormLabel)`
    width: 100%;
    font-size: 80%;
    padding-bottom: 0px;
`;

export const StyledUserBox = styled(Box).attrs({
    p: '2%',
    m: 1,
})`
    border-width: 2px;
    border-style: solid;
`;

export const StyledResponsiveFlex = styled(Box).attrs({
    pb: ['10px', '10px', '4px'],
    display: { md: 'flex' },
})`
    justify-content: space-between;
`;

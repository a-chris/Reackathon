import { Box } from '@chakra-ui/core';
import styled from 'styled-components';

interface BoxWithSpacedChildrenProps {
    space: string;
}

interface AlignmentProps {
    translateY?: string;
}

export const BoxWithSpacedChildren = styled(Box)<BoxWithSpacedChildrenProps>`
    & > * {
        margin-bottom: ${(props) => props.space};
    }
`;

export const StyledCenteredContainer = styled(Box)<AlignmentProps>`
    position: absolute;
    top: 50%;
    transform: translateY(${(props) => props?.translateY});
    width: 100%;
    text-align: center;
`;

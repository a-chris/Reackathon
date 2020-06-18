import { Box, FormLabel } from '@chakra-ui/core';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import colors from '../utils/colors';

interface BoxWithSpacedChildrenProps {
    space: string;
}

interface UserLoginProps {
    isLogged: boolean;
}

export const BoxFullHeightAfterHeader = styled(Box).attrs((props: UserLoginProps) => ({
    minHeight: [
        'calc(100vh - 3.2rem)',
        'calc(100vh - 3.2rem)',
        props.isLogged ? 'calc(100vh - 6.5rem)' : 'calc(100vh - 4rem)',
    ],
}))<UserLoginProps>`
    width: 100%;
`;

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
    m: 3,
    rounded: 'md',
})`
    border-width: 2px;
    border-style: solid;
    box-shadow: 1px 1px 3px ${colors.gray_dark};
`;

export const StyledResponsiveFlex = styled(Box).attrs({
    pb: ['10px', '10px', '4px'],
    display: { md: 'flex' },
})`
    justify-content: space-between;
`;

interface TextProps {
    linkcolor?: string;
    linkweight?: string;
}

export const StyledLinkRouter = styled(Link)<TextProps>`
    color: ${(props) => (props?.linkcolor ? props.linkcolor : 'inherit')};
    font-weight: ${(props) => (props?.linkweight ? props.linkweight : 'inherit')};
    :hover {
        text-decoration: underline;
    }
`;

export const ContainerWithBackgroundImage = styled(Box).attrs({
    backgroundImage: "url('./images/background/europe2.jpg')",
    w: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    h: 'fit-content',
    minH: 'inherit',
    backgroundPosition: 'bottom',
})``;

import React from 'react';
import { User } from '../models/Models';
import { Flex, Text, Box } from '@chakra-ui/core';
import styled from '@emotion/styled';
import colors from '../utils/colors';
import { BsShieldFill, BsFillAwardFill } from 'react-icons/bs';

export default function UserBadge(props: { user: User; styleProps?: object }) {
    return (
        <StyledBadgeFlex {...props.styleProps}>
            <Box as={BsFillAwardFill} size='16px' color={colors.orange} />
            <Text>{props.user.badge?.win}</Text>

            <Box as={BsShieldFill} size='16px' ml={2} />
            <Text>{props.user.badge?.partecipation}</Text>
        </StyledBadgeFlex>
    );
}

const StyledBadgeFlex = styled(Flex)`
    align-items: center;
    & > * {
        margin: 2px;
    }
    & > p {
        color: ${colors.gray_dark};
    }
`;

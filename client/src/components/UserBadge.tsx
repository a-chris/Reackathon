import React from 'react';
import { User } from '../models/Models';
import { Icon, Flex, Text } from '@chakra-ui/core';
import styled from '@emotion/styled';
import colors from '../utils/colors';

export default function UserBadge(props: { user: User; styleProps?: object }) {
    return (
        <StyledBadgeFlex {...props.styleProps}>
            <Icon name='star' size='12px' />
            <Text>{props.user.badge?.win}</Text>

            <Icon name='moon' size='12px' ml={2} />
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

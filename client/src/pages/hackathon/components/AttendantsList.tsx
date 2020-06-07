import React from 'react';
import colors, { getRandomVariantColorString, getRandomColorString } from '../../../utils/colors';
import { Attendant } from '../../../models/Models';
import _ from 'lodash';
import { Box, Stack, Avatar, Heading, Icon, Tag, Flex, Text } from '@chakra-ui/core';
import { StyledBottomBoxContainer, StyledBlueButton } from './StyledComponents';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

type AttendantsProps = {
    attendants: Attendant[];
    currentAttendant?: Attendant;
};

export const Attendants: React.FC<AttendantsProps> = ({ attendants, currentAttendant }) => {
    const orderedAttendants = _.orderBy(attendants, ['group'], ['asc']);
    const groupsColorMapping = _.uniq(
        attendants
            .filter((attendant) => attendant.group != null)
            .map((attendant) => attendant.group)
    ).map((groupNumber: number) => ({ group: groupNumber, color: getRandomColorString() }));

    return (
        <StyledBottomBoxContainer>
            {attendants.length === 0 ? (
                <Text fontSize='lg'>Ancora nessun iscritto</Text>
            ) : (
                <Box>
                    {orderedAttendants.map((attendant, index) => (
                        <StyledAttendantBox
                            borderColor={getColor(attendant.group, groupsColorMapping)}
                            key={index}>
                            <StyledAttendantInfoBox>
                                <Box>
                                    <Link to={`/profile/${attendant.user.username}`}>
                                        <Stack isInline alignItems='center'>
                                            <Avatar
                                                name={attendant.user.username}
                                                src={attendant.user.avatar}
                                                pr='3px'
                                            />
                                            <Heading as='h3' size='md'>
                                                {attendant.user.username}
                                            </Heading>
                                        </Stack>
                                    </Link>
                                    <StyledBadgeFlex>
                                        <Icon name='star' size='12px' />
                                        <Text>{attendant.user.badge?.win}</Text>

                                        <Icon name='moon' size='12px' ml={2} />
                                        <Text>{attendant.user.badge?.partecipation}</Text>
                                    </StyledBadgeFlex>
                                </Box>
                                <Stack
                                    isInline
                                    textAlign={['center', 'center', 'left']}
                                    alignItems='center'
                                    spacing='2px'>
                                    {attendant.group != null ? (
                                        <Text>Gruppo #{attendant.group}</Text>
                                    ) : (
                                        <Text>Utente senza gruppo</Text>
                                    )}
                                    {currentAttendant &&
                                        getGroupButtons(currentAttendant, attendant)}
                                </Stack>
                            </StyledAttendantInfoBox>

                            <Box>
                                {_.take(
                                    attendant.user.skills?.filter((skill) => skill.length < 30),
                                    5
                                ).map((skill, index) => (
                                    <Tag
                                        size='lg'
                                        m='2px'
                                        variantColor={getRandomVariantColorString()}
                                        key={index}>
                                        {skill}
                                    </Tag>
                                ))}
                            </Box>
                        </StyledAttendantBox>
                    ))}
                </Box>
            )}
        </StyledBottomBoxContainer>
    );
};

function getColor(
    group: number | undefined,
    groupsColorMapping: { group: number; color: string }[]
) {
    return group == null
        ? getRandomColorString()
        : _.values(groupsColorMapping).find((obj) => obj.group === group)?.color;
}

function getGroupButtons(currentAttendant: Attendant, attendantInList: Attendant) {
    let text = '';
    if (attendantInList.user._id === currentAttendant.user._id) {
        return null;
    }
    if (currentAttendant.group == null && attendantInList.group == null) {
        text = 'Crea gruppo';
    } else if (currentAttendant.group == null && attendantInList.group != null) {
        text = 'Unisciti al gruppo';
    } else if (currentAttendant.group != null && attendantInList.group != null) {
        text = 'Invita nel tuo gruppo';
    }
    if (text) return <StyledBlueButton size='sm'>{text}</StyledBlueButton>;
    return;
}

const StyledAttendantBox = styled(Box).attrs({
    p: '2%',
    m: 1,
})`
    border-width: 2px;
    border-style: solid;
`;

const StyledAttendantInfoBox = styled(Box).attrs({
    pb: ['10px', '10px', '4px'],
    display: { md: 'flex' },
})`
    justify-content: space-between;
`;

const StyledBadgeFlex = styled(Flex)`
    align-items: center;
    & > * {
        margin: 2px;
    }
    & > p {
        color: ${colors.gray_dark};
    }
`;

export const StyledBlueButtonPadded = styled(StyledBlueButton).attrs({
    pl: '2.5rem',
    pr: '2.5rem',
})``;

import React from 'react';
import { getRandomVariantColorString, getRandomColorString } from '../../../utils/colors';
import { Attendant } from '../../../models/Models';
import _ from 'lodash';
import { Box, Stack, Avatar, Heading, Tag, Text } from '@chakra-ui/core';
import { StyledBottomBoxContainer, StyledBlueButton } from './StyledComponents';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import UserBadge from '../../../components/UserBadge';
import { StyledResponsiveFlex, StyledUserBox } from '../../../components/Common';

type AttendantsProps = {
    attendants: Attendant[];
    currentAttendant?: Attendant;
};

type GroupColor = {
    group: number;
    color: string;
};

export const Attendants: React.FC<AttendantsProps> = ({ attendants, currentAttendant }) => {
    const [orderedAttendants, setOrderedAttendants] = React.useState<Attendant[]>();
    const [groupsColorMapping, setGroupsColorMapping] = React.useState<GroupColor[]>();

    React.useEffect(() => {
        const orderedAttendants = _.orderBy(attendants, ['group'], ['asc']);
        const groupsColorMapping = _.uniq(
            attendants
                .filter((attendant) => attendant.group != null)
                .map((attendant) => attendant.group)
        ).map((groupNumber: number) => ({ group: groupNumber, color: getRandomColorString() }));

        setOrderedAttendants(orderedAttendants);
        setGroupsColorMapping(groupsColorMapping);
    }, [attendants, currentAttendant]);

    return (
        <StyledBottomBoxContainer>
            {attendants.length === 0 ? (
                <Text fontSize='lg'>Ancora nessun iscritto</Text>
            ) : (
                <Box>
                    {orderedAttendants?.map((attendant, index) => (
                        <StyledUserBox
                            borderColor={getColor(attendant.group, groupsColorMapping)}
                            key={index}>
                            <StyledResponsiveFlex>
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
                                    <UserBadge user={attendant.user} />
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
                            </StyledResponsiveFlex>

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
                        </StyledUserBox>
                    ))}
                </Box>
            )}
        </StyledBottomBoxContainer>
    );
};

function getColor(group: number | undefined, groupsColorMapping: GroupColor[] | undefined) {
    return group == null || groupsColorMapping == null
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

export const StyledBlueButtonPadded = styled(StyledBlueButton).attrs({
    pl: '2.5rem',
    pr: '2.5rem',
})``;

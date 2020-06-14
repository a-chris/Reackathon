import { Avatar, Badge, Box, Heading, Stack, Tag, Text } from '@chakra-ui/core';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledResponsiveFlex, StyledUserBox } from '../../../components/Common';
import UserBadge from '../../../components/UserBadge';
import { Attendant } from '../../../models/Models';
import { inviteAttendantToGroup } from '../../../services/AttendantService';
import { getRandomColorString, getRandomVariantColorString } from '../../../utils/colors';
import { StyledBlueButton, StyledBottomBoxContainer } from './StyledComponents';

type AttendantsProps = {
    attendants: Attendant[];
    currentAttendant?: Attendant;
};

export const AttendantsList: React.FC<AttendantsProps> = ({ attendants, currentAttendant }) => {
    const [orderedAttendants, setOrderedAttendants] = React.useState<Attendant[]>();
    const [invitedAttendants, setInvitedAttendants] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        setOrderedAttendants(_.orderBy(attendants, ['group'], ['asc']));
    }, [attendants, currentAttendant]);

    const onInviteAttendant = (toId: string) => {
        if (currentAttendant?._id != null) {
            inviteAttendantToGroup(currentAttendant?._id, toId).then((result) => {
                setInvitedAttendants((curr) => new Set([...curr, toId]));
            });
        }
    };

    const colors: string[] = React.useMemo(() => {
        const tmpColors: string[] = [];
        for (let i = 0; i < attendants.length; i++) {
            const attendant = attendants[i];
            if (i === 0 || attendant.group == null) {
                tmpColors.push(getRandomColorString());
            } else if (attendant.group === attendants[i - 1].group) {
                tmpColors.push(tmpColors[i - 1]);
            } else {
                tmpColors.push('');
            }
        }
        return tmpColors;
    }, [attendants]);

    return (
        <StyledBottomBoxContainer>
            {attendants.length === 0 ? (
                <Text fontSize='lg'>Ancora nessun iscritto</Text>
            ) : (
                <Box>
                    {orderedAttendants?.map((attendant, index) => (
                        <StyledUserBox borderColor={colors[index]} key={index}>
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
                                        getGroupButton(
                                            currentAttendant,
                                            attendant,
                                            invitedAttendants,
                                            onInviteAttendant
                                        )}
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

function getGroupButton(
    currentAttendant: Attendant,
    attendantInList: Attendant,
    invitedAttendants: Set<string>,
    onInvite: (toId: string) => void
) {
    if (attendantInList.user._id === currentAttendant.user._id) {
        return null;
    }

    let text = '';
    const alreadyInvited =
        attendantInList.invites?.find((invite) => (invite.from as any) === currentAttendant._id) !=
            null || invitedAttendants.has(attendantInList._id);
    if (alreadyInvited) {
        return (
            <Badge ml='1' fontSize='0.8em' variantColor='green'>
                <Text fontSize='md' fontWeight='bold'>
                    INVITATO
                </Text>
            </Badge>
        );
    } else if (currentAttendant.group == null && attendantInList.group == null) {
        text = 'Crea gruppo';
    } else if (currentAttendant.group != null && attendantInList.group == null) {
        text = 'Invita nel tuo gruppo';
    }
    if (text)
        return (
            <StyledBlueButton size='sm' onClick={() => onInvite(attendantInList._id)}>
                {text}
            </StyledBlueButton>
        );
    return;
}

export const StyledBlueButtonPadded = styled(StyledBlueButton).attrs({
    pl: '2.5rem',
    pr: '2.5rem',
})``;

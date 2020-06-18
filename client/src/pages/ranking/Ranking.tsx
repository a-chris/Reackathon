import { Avatar, Box, Flex, Heading, Radio, RadioGroup, Stack, Tag, Text } from '@chakra-ui/core';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledUserBox, StyedLinkRouter as StyledLinkRouter } from '../../components/Common';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import UserBadge from '../../components/UserBadge';
import { User } from '../../models/Models';
import { getUsersRanking } from '../../services/UserService';
import colors, { getRandomColorString, getRandomVariantColorString } from '../../utils/colors';

export default function Ranking() {
    const [users, setUsers] = React.useState<User[]>();
    const [order, setOrder] = React.useState('win');

    React.useEffect(() => {
        getUsersRanking(order).then((users) => {
            const userSanitized = users.map((user) => {
                const userSkills = _.take(
                    user.skills?.filter((skill) => skill.length < 30),
                    5
                );
                user.skills = userSkills;
                return user;
            });
            setUsers(userSanitized);
        });
    }, [order]);

    const onChangeRadioOrder = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrder(e.target.value);
    };

    return (
        <OverlappedBoxes
            mainStackStyle={{ w: ['90%', '90%', '60%', '55%'] }}
            topBoxStyle={{ bg: colors.blue_night, w: '85%' }}
            TopContent={() => (
                <Heading
                    as='h1'
                    h='100%'
                    color={colors.white}
                    size='xl'
                    textAlign='center'
                    p='25px'
                    verticalAlign='middle'>
                    Classifica degli utenti
                </Heading>
            )}
            BottomContent={() => (
                <Box p={5}>
                    {users == null || users?.length === 0 ? (
                        <Heading as='h2' p='20' size='lg'>
                            Nessun utente registrato sulla piattaforma
                        </Heading>
                    ) : (
                        <Box>
                            <Flex alignItems='center' p='2' justifyContent='center'>
                                <Text as='label' pr={2} fontSize='md' fontWeight='500'>
                                    Ordina per:
                                </Text>
                                <RadioGroup
                                    id='order'
                                    onChange={onChangeRadioOrder}
                                    value={order}
                                    spacing={2}
                                    verticalAlign='center'
                                    isInline>
                                    <Radio value='win' size='sm' variantColor='red'>
                                        Vittorie
                                    </Radio>
                                    <Radio value='partecipation' size='sm' variantColor='red'>
                                        Partecipazioni
                                    </Radio>
                                </RadioGroup>
                            </Flex>
                            {users?.map((user, index) => (
                                <StyledUserBox
                                    borderColor={getRandomColorString()}
                                    key={index}
                                    pb={2}>
                                    <Stack isInline alignItems='center' verticalAlign='middle'>
                                        <Heading as='h2' size='lg'>
                                            {index + 1}°
                                        </Heading>
                                        <Flex
                                            wrap='wrap'
                                            justifyContent='center'
                                            alignItems='center'
                                            pl={5}>
                                            <Avatar
                                                name={user.username}
                                                src={user.avatar}
                                                textAlign='center'
                                                size='lg'
                                            />
                                            <Stack ml={5}>
                                                <StyledLinkRouter to={`/profile/${user.username}`}>
                                                    <Heading as='h3' size='md'>
                                                        {user.username}
                                                    </Heading>
                                                </StyledLinkRouter>
                                                <Text>{user.name}</Text>
                                            </Stack>
                                        </Flex>
                                    </Stack>
                                    <Flex
                                        wrap='wrap'
                                        justifyContent='space-between'
                                        alignItems='center'
                                        p={1}
                                        pb={0}>
                                        <Box pr={1}>
                                            <UserBadge user={user} />
                                        </Box>

                                        <Box>
                                            {user.skills?.map((skill, index) => (
                                                <Tag
                                                    size='lg'
                                                    m='2px'
                                                    variantColor={getRandomVariantColorString()}
                                                    key={index}>
                                                    {skill}
                                                </Tag>
                                            ))}
                                        </Box>
                                    </Flex>
                                </StyledUserBox>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
        />
    );
}

import { Avatar, Box, Button, Flex, Heading, Stack, Text, useDisclosure } from '@chakra-ui/core';
import React, { ChangeEvent } from 'react';
import { useParams } from 'react-router';
import 'react-vertical-timeline-component/style.min.css';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import UserBadge from '../../components/UserBadge';
import { Experience, User, UserRole } from '../../models/Models';
import {
    getUserDetail,
    saveClientExperiences,
    saveClientSkills,
    uploadAvatar,
} from '../../services/UserService';
import colors from '../../utils/colors';
import ClientProfileInfo from './components/ClientProfileInfo';
import OrganizationProfileInfo from './components/OrganizationProfileInfo';
import SignupModal from './components/SignupModal';
import { BoxFullHeightAfterHeader, ContainerWithBackgroundImage } from '../../components/Common';

export default function Profile() {
    const { username } = useParams();
    const appContext = React.useContext(AppContext);
    const [user, setUser] = React.useState<User>();
    const [hasPendingRemove, setHasPendingRemove] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    React.useEffect(() => {
        getUserDetail(username)
            .then((user) => {
                setUser(user);
            })
            .catch((reason) => {
                if (reason.response.status === 401) {
                    onOpen();
                }
            });
    }, [onOpen, username]);

    const onAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event?.target;
        if (files?.length === 1) {
            uploadAvatar(username, files[0]).then((user) => {
                if (user != null) setUser(user);
            });
        }
    };

    const onRemoveExperience = (index: number) => {
        if (user?.experiences != null && !hasPendingRemove) {
            setHasPendingRemove(true);
            const updatedExperiences = user.experiences.filter((exp, i) => i !== index);
            saveClientExperiences(username, updatedExperiences).then((updatedUser) => {
                setUser(updatedUser);
                setHasPendingRemove(false);
            });
        }
    };

    const onSaveExperiences = (experiences: Experience[]) => {
        saveClientExperiences(username, experiences).then((updatedUser) => {
            setUser(updatedUser);
        });
    };

    const onAddExperiences = (newExperiences: Experience[]) => {
        // user can't be null at this point
        const experiencesToSave = [...user?.experiences!, ...newExperiences];
        onSaveExperiences(experiencesToSave);
    };

    const onSaveSkills = (skills: string[]) => {
        saveClientSkills(username, skills).then((user) => {
            if (user != null) setUser(user);
        });
    };

    const isProfileOwner = username === appContext?.state?.user?.username;
    const avatarUrl = user?.avatar != null ? 'avatar/' + user?.avatar : undefined;

    return (
        <BoxFullHeightAfterHeader isLogged={appContext.state?.user != null}>
            <ContainerWithBackgroundImage>
                <OverlappedBoxes
                    mainStackStyle={{ w: ['90%', '90%', '70%', '70%'] }}
                    topBoxStyle={{ w: ['90%', '90%', '80%', '80%'], p: 2 }}
                    TopContent={() => (
                        <Flex
                            align='center'
                            justify='space-evenly'
                            flexWrap='wrap'
                            textAlign='center'>
                            <Stack direction='column'>
                                <Avatar
                                    size='xl'
                                    name={'avatar/' + user?.name}
                                    src={avatarUrl}
                                    color={colors.white}
                                    bg={colors.red}
                                />
                                {isProfileOwner && (
                                    <UploadButton size='xs' fontSize='sm'>
                                        <label>
                                            <input type='file' onChange={onAvatarUpload} />
                                            Carica foto
                                        </label>
                                    </UploadButton>
                                )}
                            </Stack>
                            <Box pl={'1'} minW='60%'>
                                <Heading as='h1' size='xl'>
                                    {user?.username}
                                </Heading>
                                {user?.badge && (
                                    <UserBadge
                                        user={user}
                                        styleProps={{ m: 'auto', w: 'fit-content' }}
                                    />
                                )}
                                <Heading as='h2' size='lg' fontWeight='500'>
                                    {user?.name}
                                </Heading>
                                <Text>{user?.email}</Text>
                            </Box>
                        </Flex>
                    )}
                    BottomContent={() => (
                        <>
                            {user?.role != null && (
                                <Stack align='center' pt='10px'>
                                    {user?.role === UserRole.CLIENT ? (
                                        <ClientProfileInfo
                                            user={user}
                                            isProfileOwner={isProfileOwner}
                                            onRemoveExperience={onRemoveExperience}
                                            onSaveExperiences={onSaveExperiences}
                                            onAddExperiences={onAddExperiences}
                                            onSaveSkills={onSaveSkills}
                                        />
                                    ) : (
                                        <OrganizationProfileInfo
                                            userId={user?._id}
                                            isProfileOwner={isProfileOwner}
                                        />
                                    )}
                                </Stack>
                            )}
                        </>
                    )}
                />
                <SignupModal isOpen={isOpen} onClose={onClose} />
            </ContainerWithBackgroundImage>
        </BoxFullHeightAfterHeader>
    );
}

const UploadButton = styled(Button)`
    label {
        width: 100%;
        height: 100%;
        transform: translateY(10%);
        cursor: pointer;
    }

    input {
        display: none;
    }
`;

import { Avatar, Box, Button, Divider, Flex, Stack, Text, useDisclosure } from '@chakra-ui/core';
import React, { ChangeEvent } from 'react';
import { useParams } from 'react-router';
import 'react-vertical-timeline-component/style.min.css';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';
import { Experience, User } from '../../models/Models';
import {
    getUserDetail,
    saveClientExperiences,
    saveClientSkills,
    uploadAvatar,
} from '../../services/UserService';
import colors from '../../utils/colors';
import ExperienceModal from './components/ExperiencesModal';
import ExperiencesTimeline from './components/ExperiencesTimeline';
import SkillsComponent from './components/SkillsComponent';

export default function Profile() {
    const { username } = useParams();
    const appContext = React.useContext(AppContext);
    const [user, setUser] = React.useState<User>();
    const [isEditingSkills, setIsEditingSkills] = React.useState(false);
    const [hasPendingRemove, setHasPendingRemove] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    React.useEffect(() => {
        getUserDetail(username).then((userDetail) => {
            setUser(userDetail);
        });
    }, [username]);

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
        console.log('TCL: onSaveExperiences -> experiencesToSave', experiencesToSave);
        onSaveExperiences(experiencesToSave);
    };

    const onCancelExperiencesAdding = React.useCallback(() => {
        onClose();
    }, [onClose]);

    const onEditSkills = () => {
        setIsEditingSkills(true);
    };

    const onCancelSkillsEditing = () => {
        setIsEditingSkills(false);
    };

    const onSaveSkills = (skills: string[]) => {
        setIsEditingSkills(false);
        saveClientSkills(username, skills).then((user) => {
            if (user != null) setUser(user);
        });
    };

    const isProfileOwner = username === appContext?.state?.user?.username;

    // TODO: improve this
    const avatarUrl =
        user?.avatar != null ? 'http://localhost:5000/avatar/' + user?.avatar : undefined;

    return (
        <Flex w='100%' minH='100%' bg={colors.gray_light} align='center' direction='column' pb='20'>
            <Flex w='80%' align='center' justify='center' direction='row'>
                <Flex bg='green.300' direction='column'>
                    <Avatar size='xl' name={user?.name} src={avatarUrl} />
                    {isProfileOwner && (
                        <UploadButton variantColor='teal' size='xs'>
                            <label>
                                <input type='file' onChange={onAvatarUpload} />
                                upload
                            </label>
                        </UploadButton>
                    )}
                </Flex>
                <Box w='70%' bg='blue.300' pl={['5', '10', '20']}>
                    <Text fontSize='xl'>{user?.username}</Text>
                    <Text fontSize='lg'>{user?.name}</Text>
                    <Text>{user?.email}</Text>
                </Box>
            </Flex>
            <Stack w='90%' align='center' boxShadow='0px 2px 5px black'>
                <SkillsComponent
                    skills={user?.skills ?? []}
                    canBeEdited={isProfileOwner}
                    isEditable={isEditingSkills}
                    onCancel={onCancelSkillsEditing}
                    onEdit={onEditSkills}
                    onSave={onSaveSkills}
                />
                <Divider w='95%' />
                <Box w='80%'>
                    {isProfileOwner && (
                        <Flex justify='center'>
                            <Button mb='15px' onClick={onOpen}>
                                Aggiungi esperienze
                            </Button>
                        </Flex>
                    )}
                    {user?.experiences != null && user?.experiences?.length > 0 && (
                        <ExperiencesTimeline
                            canBeEdited={isProfileOwner}
                            experiences={user.experiences}
                            onSave={onSaveExperiences}
                            onRemove={onRemoveExperience}
                        />
                    )}
                </Box>
            </Stack>
            {isProfileOwner && (
                <ExperienceModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSave={onAddExperiences}
                    onCancel={onCancelExperiencesAdding}
                />
            )}
        </Flex>
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

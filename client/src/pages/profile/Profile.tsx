import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Stack,
    Text,
    useDisclosure,
    Heading,
    Icon,
} from '@chakra-ui/core';
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
import OverlappedBoxes from '../../components/OverlappedBoxes';
import UserBadge from '../../components/UserBadge';

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
        user?.avatar != null ? 'http:localhost:5000/avatar/' + user?.avatar : undefined;

    return (
        <OverlappedBoxes
            mainStackStyle={{ w: ['90%', '90%', '70%', '70%'] }}
            topBoxStyle={{ w: ['90%', '90%', '80%', '80%'], p: 2 }}
            TopContent={() => (
                <Flex align='center' justify='space-evenly' flexWrap='wrap' textAlign='center'>
                    <Stack direction='column'>
                        <Avatar size='xl' name={user?.name} src={avatarUrl} />
                        {isProfileOwner && (
                            <UploadButton variantColor='teal' size='xs'>
                                <label>
                                    <input type='file' onChange={onAvatarUpload} />
                                    upload
                                </label>
                            </UploadButton>
                        )}
                    </Stack>
                    <Box pl={'1'} minW='60%'>
                        <Heading as='h1' size='xl'>
                            {user?.username}
                        </Heading>
                        {user?.badge && (
                            <UserBadge user={user} styleProps={{ m: 'auto', w: 'fit-content' }} />
                        )}
                        <Heading as='h2' size='lg' fontWeight='500'>
                            {user?.name}
                        </Heading>
                        <Text>{user?.email}</Text>
                    </Box>
                </Flex>
            )}
            BottomContent={() => (
                <Stack align='center' pt='10px'>
                    {/* <Stack align='center' boxShadow='0px 2px 5px black'> */}
                    <SkillsComponent
                        skills={user?.skills ?? []}
                        canBeEdited={isProfileOwner}
                        isEditable={isEditingSkills}
                        onCancel={onCancelSkillsEditing}
                        onEdit={onEditSkills}
                        onSave={onSaveSkills}
                    />
                    <Divider w='95%' borderColor={colors.gold} />
                    <Box w='80%'>
                        <Heading as='h3' size='md' p={2}>
                            Esperienze
                        </Heading>
                        {isProfileOwner && (
                            <Flex justify='center'>
                                <Button mb='15px' onClick={onOpen}>
                                    Aggiungi esperienze
                                    <Icon name='add' ml={2} />
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
                    {isProfileOwner && (
                        <ExperienceModal
                            isOpen={isOpen}
                            onClose={onClose}
                            onSave={onAddExperiences}
                            onCancel={onCancelExperiencesAdding}
                        />
                    )}
                </Stack>
            )}
        />
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

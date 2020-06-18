import { Box, Button, Divider, Flex, Heading, Icon, useDisclosure, Text } from '@chakra-ui/core';
import React from 'react';
import { Experience, User } from '../../../models/Models';
import colors from '../../../utils/colors';
import ExperienceModal from './ExperiencesModal';
import ExperiencesTimeline from './ExperiencesTimeline';
import SkillsComponent from './SkillsComponent';

interface ExperienceProps {
    user: User | undefined;
    isProfileOwner: boolean;
    onRemoveExperience: (index: number) => void;
    onSaveExperiences: (newExperiences: Experience[]) => void;
    onAddExperiences: (newExperiences: Experience[]) => void;
    onSaveSkills: (skills: string[]) => void;
}

export default function ClientProfileInfo(props: ExperienceProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isEditingSkills, setIsEditingSkills] = React.useState(false);

    const onEditSkills = () => {
        setIsEditingSkills(true);
    };

    const onCancelExperiencesAdding = React.useCallback(() => {
        onClose();
    }, [onClose]);

    const onCancelSkillsEditing = () => {
        setIsEditingSkills(false);
    };

    const onAddExperiences = (newExperiences: Experience[]) => {
        onClose();
        props.onAddExperiences(newExperiences);
    };

    const onSaveSkills = (skills: string[]) => {
        setIsEditingSkills(false);
        props.onSaveSkills(skills);
    };

    return (
        <>
            <SkillsComponent
                skills={props.user?.skills ?? []}
                canBeEdited={props.isProfileOwner}
                isEditable={isEditingSkills}
                onCancel={onCancelSkillsEditing}
                onEdit={onEditSkills}
                onSave={onSaveSkills}
            />
            <Divider w='95%' borderColor={colors.red} />
            <Box w='80%'>
                <Heading as='h3' size='md' p={2}>
                    Esperienze
                </Heading>
                {props.isProfileOwner && (
                    <Flex justify='center'>
                        <Button mb='15px' onClick={onOpen}>
                            Aggiungi esperienze
                            <Icon name='add' ml={2} />
                        </Button>
                    </Flex>
                )}
                {props.user?.experiences != null && props.user?.experiences?.length > 0 ? (
                    <ExperiencesTimeline
                        canBeEdited={props.isProfileOwner}
                        experiences={props.user.experiences}
                        onSave={props.onSaveExperiences}
                        onRemove={props.onRemoveExperience}
                    />
                ) : (
                    <Text pb={5}>Ancora nessuna esperienza.</Text>
                )}
            </Box>
            {props.isProfileOwner && (
                <ExperienceModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSave={onAddExperiences}
                    onCancel={onCancelExperiencesAdding}
                />
            )}
        </>
    );
}

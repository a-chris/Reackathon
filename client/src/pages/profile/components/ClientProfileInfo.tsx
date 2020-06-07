import React from 'react';
import SkillsComponent from './SkillsComponent';
import { Divider, Box, Heading, Flex, Button, Icon, useDisclosure } from '@chakra-ui/core';
import colors from '../../../utils/colors';
import ExperiencesTimeline from './ExperiencesTimeline';
import HackathonsTimeline from './HackathonsTimeline';
import ExperienceModal from './ExperiencesModal';
import { User, Experience } from '../../../models/Models';

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
            <Divider w='95%' borderColor={colors.gold} />
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
                {props.user?.experiences != null && props.user?.experiences?.length > 0 && (
                    <ExperiencesTimeline
                        canBeEdited={props.isProfileOwner}
                        experiences={props.user.experiences}
                        onSave={props.onSaveExperiences}
                        onRemove={props.onRemoveExperience}
                    />
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

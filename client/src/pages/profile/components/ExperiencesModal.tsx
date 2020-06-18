import {
    Button,
    Divider,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stat,
    StatHelpText,
    StatLabel,
} from '@chakra-ui/core';
import * as _ from 'lodash';
import moment from 'moment';
import React, { ChangeEvent } from 'react';
import 'react-vertical-timeline-component/style.min.css';
import styled from 'styled-components';
import { BoxWithSpacedChildren } from '../../../components/Common';
import { Experience } from '../../../models/Models';

const initialExperience = {
    role: '',
    company: '',
};

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: (e: any) => void;
    onSave: (exps: Experience[]) => void;
    onCancel: () => void;
}

export default function ExperienceModal(props: ExperienceModalProps) {
    const [newExperiences, setNewExperiences] = React.useState<Experience[]>([]);
    const [experienceInEditing, setExperienceInEditing] = React.useState<Experience>(
        initialExperience
    );

    const onAddExperience = () => {
        setNewExperiences((curr) => [{ ...experienceInEditing }, ...curr]);
        // reset the current experience in editing
        setExperienceInEditing(initialExperience);
    };

    const onRemoveExperience = (exp: Experience) => {
        setNewExperiences((curr) => _.without(curr, exp));
    };

    const onSave = React.useCallback(() => {
        props.onSave(newExperiences);
        // reset the already added experiences
        setNewExperiences([]);
    }, [newExperiences, props]);

    const onCancel = React.useCallback(() => {
        props.onCancel();
        // reset the already added experiences
        setNewExperiences([]);
    }, [props]);

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setExperienceInEditing((curr) => ({
                ...curr,
                [name]: value,
            }));
        }
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Aggiungi delle esperienze di lavoro</ModalHeader>
                <ModalBody>
                    <EditableTimelineEvent
                        onChangeValue={onChangeValue}
                        key={newExperiences.length}
                    />
                    <Flex justify='center'>
                        <Button variantColor='blue' mr={3} onClick={onAddExperience}>
                            AGGIUNGI
                        </Button>
                    </Flex>
                    <Divider />
                    <BoxWithSpacedChildren space='10px'>
                        {newExperiences?.map((e, index) => (
                            <Flex
                                dir='column'
                                border='1px'
                                borderRadius='md'
                                borderColor='gray.300'
                                p={5}
                                key={index}>
                                <Stat>
                                    <StatLabel>Ruolo: {e?.role}</StatLabel>
                                    <StatLabel>Azienda: {e?.company}</StatLabel>
                                    <StatHelpText>
                                        Periodo: {formatExperiencePeriod(e)}
                                    </StatHelpText>
                                </Stat>
                                <IconButton
                                    aria-label='Delete this work experience'
                                    icon='delete'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => onRemoveExperience(e)}
                                />
                            </Flex>
                        ))}
                    </BoxWithSpacedChildren>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' onClick={onCancel}>
                        ANNULLA
                    </Button>
                    <Button
                        variantColor='blue'
                        mr={3}
                        onClick={onSave}
                        isDisabled={newExperiences.length === 0}>
                        SALVA
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

type EditableTimelineEventProps = {
    onChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
};

function EditableTimelineEvent({ onChangeValue }: EditableTimelineEventProps) {
    return (
        <BoxWithSpacedChildren space='20px'>
            <InputGroup>
                <StyledInputLeftAddon children='Ruolo:' />
                <Input type='text' roundedLeft='0' name='role' onChange={onChangeValue} />
            </InputGroup>
            <InputGroup>
                <StyledInputLeftAddon children='Azienda:' />
                <Input type='text' roundedLeft='0' name='company' onChange={onChangeValue} />
            </InputGroup>
            <InputGroup>
                <StyledInputLeftAddon children='Inizio:' />
                <Input type='date' roundedLeft='0' name='from' onChange={onChangeValue} />
            </InputGroup>
            <InputGroup>
                <StyledInputLeftAddon children='Fine:' />
                <Input type='date' roundedLeft='0' name='to' onChange={onChangeValue} />
            </InputGroup>
        </BoxWithSpacedChildren>
    );
}

const StyledInputLeftAddon = styled(InputLeftAddon)`
    width: 100px;
`;

function formatExperiencePeriod(exp: Experience) {
    const outputFormat = 'MMMM/yyyy';
    const from = moment(exp?.from).locale('it').format(outputFormat);
    const to = moment(exp?.to).locale('it').format(outputFormat);
    return `${_.capitalize(from)} - ${_.capitalize(to)}`;
}

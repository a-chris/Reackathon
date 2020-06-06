import {
    Box,
    Button,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Tag,
    Text,
} from '@chakra-ui/core';
import React, { ChangeEvent } from 'react';
import { getRandomVariantColorString } from '../../../utils/colors';

interface SkillsComponentProps {
    skills: string[];
    canBeEdited: boolean;
    isEditable: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: (skills: string[]) => void;
}

export default function SkillsComponent(props: SkillsComponentProps) {
    const [skills, setSkills] = React.useState<string[]>(props.skills);

    React.useEffect(() => {
        setSkills(props.skills);
    }, [props]);

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setSkills((curr) => {
                const newSkills = [...curr];
                newSkills[+name] = value;
                return newSkills;
            });
        }
    };

    const onAdd = () => {
        setSkills((curr) => [...curr, '']);
    };

    const onRemove = (indexToRemove: number) => {
        setSkills((curr) => curr.filter((s, i) => i !== indexToRemove));
    };

    const onSave = () => {
        props.onSave(skills.filter((skill) => skill.length > 0));
    };

    return (
        <Box w='100%'>
            <Flex>
                <Text>Competenze:</Text>
                <Stack spacing={4} isInline>
                    {skills.map((skill, index) =>
                        props.isEditable ? (
                            <InputGroup key={index}>
                                <Input
                                    size='sm'
                                    name={index.toString()}
                                    value={skill}
                                    onChange={onChangeValue}
                                />
                                <InputRightElement width='4rem'>
                                    <IconButton
                                        size='xs'
                                        variant='solid'
                                        aria-label='elimina competenza'
                                        icon='delete'
                                        onClick={() => onRemove(index)}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        ) : (
                            <Tag size='lg' variantColor={getRandomVariantColorString()} key={index}>
                                {skill}
                            </Tag>
                        )
                    )}
                    {props.isEditable && (
                        <IconButton
                            isRound
                            icon='add'
                            size='sm'
                            aria-label='Aggiungi una nuova competenza'
                            onClick={onAdd}
                        />
                    )}
                </Stack>
            </Flex>
            {props.canBeEdited && (
                <>
                    {props.isEditable ? (
                        <Flex>
                            <Button mb='15px' onClick={props.onCancel}>
                                ANNULLA
                            </Button>
                            <Button mb='15px' onClick={onSave}>
                                SALVA
                            </Button>
                        </Flex>
                    ) : (
                        <Button mb='15px' onClick={props.onEdit}>
                            Modifica competenze
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
}

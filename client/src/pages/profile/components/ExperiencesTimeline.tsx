import { Box, Button, Flex, IconButton, Input, Text } from '@chakra-ui/core';
import * as _ from 'lodash';
import moment from 'moment';
import React, { ChangeEvent } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import styled from 'styled-components';
import { BoxWithSpacedChildren } from '../../../components/Common';
import { Experience } from '../../../models/Models';
import colors, { getRandomColorHex, getTextContrast } from '../../../utils/colors';

interface ExperiencesTimelineProps {
    canBeEdited: boolean;
    experiences: Experience[];
    onRemove: (index: number) => void;
    onSave: (experiences: Experience[]) => void;
}

export default function ExperiencesTimeline(props: ExperiencesTimelineProps) {
    const [areEditable, setAreEditable] = React.useState<boolean[]>([]);
    const [experiences, setExperiences] = React.useState<Experience[]>(props.experiences);

    React.useEffect(() => {
        setExperiences(props.experiences);
        setAreEditable(props.experiences.map(() => false));
    }, [props]);

    const onEdit = (index: number) => {
        setAreEditable((curr) => curr.map((c, i) => (i === index ? !c : c)));
    };

    const onBlurValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            const nameParts = name.split('.');
            const indexToUpdate = +nameParts[0];
            const keyToUpdate = nameParts[1];
            setExperiences((curr) => {
                const newExperiences = [...curr];
                newExperiences[indexToUpdate] = {
                    ...newExperiences[indexToUpdate],
                    [keyToUpdate]: value,
                };
                return newExperiences;
            });
        }
    };

    const experiencesCount = experiences.length;
    const elementColors = React.useMemo(() => {
        return experiences.map(() => {
            const bg = getRandomColorHex();
            const textColor = getTextContrast(bg);

            return { bg: bg, textColor: textColor };
        });
        /*
         *   Used to keep the same colors after a re-render
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [experiencesCount]);

    return (
        <StyledBox w='100%' pb='20px'>
            <VerticalTimeline layout='2-columns' className='vertical-timeline-custom-line'>
                {experiences.map((exp, index) => (
                    <VerticalTimelineElement
                        className='vertical-timeline-element'
                        contentStyle={{
                            background: elementColors[index].bg,
                            color: elementColors[index].textColor,
                            padding: '10px 20px',
                        }}
                        contentArrowStyle={{
                            borderRight: '7px solid ' + colors.black_almost,
                        }}
                        iconStyle={{
                            boxShadow: `0 0 0 4px ${colors.black}, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)`,
                            backgroundColor: elementColors[index].bg,
                        }}
                        date={areEditable[index] ? undefined : formatExperiencePeriod(exp)}
                        dateClassName='date-color'
                        key={index}>
                        <Flex justify='space-between' wrap='wrap' maxW='100%'>
                            {areEditable[index] ? (
                                <BoxWithSpacedChildren
                                    space='10px'
                                    color={colors.black}
                                    maxW='inherit'>
                                    <Input
                                        size='sm'
                                        placeholder='Ruolo'
                                        name={`${index}.role`}
                                        defaultValue={exp?.role}
                                        onBlur={onBlurValue}
                                    />
                                    <Input
                                        size='sm'
                                        placeholder='Azienda'
                                        name={`${index}.company`}
                                        defaultValue={exp?.company}
                                        onBlur={onBlurValue}
                                    />
                                    <Input
                                        size='sm'
                                        placeholder='Data inizio'
                                        type='date'
                                        name={`${index}.from`}
                                        defaultValue={exp?.from?.toString().substring(0, 10)}
                                        onBlur={onBlurValue}
                                    />
                                    <Input
                                        size='sm'
                                        placeholder='Data fine'
                                        type='date'
                                        name={`${index}.to`}
                                        defaultValue={exp?.to?.toString().substring(0, 10)}
                                        onBlur={onBlurValue}
                                    />
                                </BoxWithSpacedChildren>
                            ) : (
                                <Box pb='10px'>
                                    <Text>{exp?.role}</Text>
                                    <Text>{exp?.company}</Text>
                                </Box>
                            )}
                            {props.canBeEdited && (
                                <Flex direction='column' justify='space-between'>
                                    <Flex pb={2}>
                                        <IconButton
                                            color={colors.black}
                                            bg={colors.white}
                                            isRound
                                            size='sm'
                                            variant='ghost'
                                            aria-label='modifica esperienza lavorativa'
                                            icon='edit'
                                            onClick={() => onEdit(index)}
                                        />
                                        <Box w='15px' />
                                        <IconButton
                                            color={colors.black}
                                            bg={colors.white}
                                            isRound
                                            size='sm'
                                            variant='ghost'
                                            aria-label='elimina experienza lavorativa'
                                            icon='delete'
                                            onClick={() => props.onRemove(index)}
                                        />
                                    </Flex>
                                    {areEditable[index] && (
                                        <Flex direction='row-reverse'>
                                            <Button
                                                color={colors.black}
                                                onClick={() => props.onSave(experiences)}>
                                                SALVA
                                            </Button>
                                        </Flex>
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </StyledBox>
    );
}

const StyledBox = styled(Box)`
    .vertical-timeline.vertical-timeline-custom-line::before {
        background: ${colors.black_almost};
    }

    .date-color {
        @media only screen and (min-width: 1170px) {
            color: ${colors.black};
            padding-left: 10px;
        }
    }
`;

function formatExperiencePeriod(exp: Experience) {
    const outputFormat = 'MMMM/yyyy';
    const from = moment(exp?.from).locale('it').format(outputFormat);
    const to = moment(exp?.to).locale('it').format(outputFormat);
    return `${_.capitalize(from)} - ${_.capitalize(to)}`;
}

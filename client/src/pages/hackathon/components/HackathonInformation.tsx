import {
    CircularProgress,
    CircularProgressLabel,
    Divider,
    Heading,
    SimpleGrid,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
} from '@chakra-ui/core';
import React from 'react';
import { Hackathon } from '../../../models/Models';
import colors from '../../../utils/colors';
import { StyledBottomBoxContainer } from './StyledComponents';

export const Information: React.FC<{ hackathon: Hackathon }> = ({ hackathon }) => {
    const progressValue = hackathon.attendantsRequirements.maxNum
        ? (hackathon.attendants.length * 100) / hackathon.attendantsRequirements.maxNum
        : hackathon.attendants.length % 10;

    return (
        <StyledBottomBoxContainer>
            <Heading as='h2' size='md'>
                Descrizione dell'evento
            </Heading>
            <Text>{hackathon.description}</Text>

            <Divider borderColor={colors.red} />

            <Heading as='h2' size='md'>
                Informazioni sugli iscritti
            </Heading>
            <SimpleGrid columns={[2, 2, 4, 4]}>
                <Stat>
                    <StatNumber>{hackathon.attendants.length}</StatNumber>
                    <StatLabel>Iscritti attuali</StatLabel>
                </Stat>
                <Stat>
                    {hackathon.attendantsRequirements.maxNum != null ? (
                        <StatNumber>{hackathon.attendantsRequirements.maxNum}</StatNumber>
                    ) : (
                        <StatNumber>&#8734;</StatNumber>
                    )}
                    <StatLabel>Posti disponibili</StatLabel>
                    {!hackathon.attendantsRequirements.maxNum && (
                        <StatHelpText>Illimitati</StatHelpText>
                    )}
                    {hackathon.attendantsRequirements.maxNum && (
                        <StatHelpText>Limitati</StatHelpText>
                    )}
                </Stat>
                <Stat>
                    <StatNumber>{hackathon.attendantsRequirements.minNum || 0}</StatNumber>
                    <StatLabel>Numero minimo iscritti</StatLabel>
                    <StatHelpText>Per avviare l'Hackathon</StatHelpText>
                </Stat>
                <CircularProgress
                    alignSelf='center'
                    value={progressValue}
                    color='yellow'
                    thickness={0.5}
                    size='120px'>
                    <CircularProgressLabel>{hackathon.attendants.length}</CircularProgressLabel>
                </CircularProgress>
            </SimpleGrid>

            <Divider borderColor={colors.red} />
            <Heading as='h2' size='md'>
                Requisiti richiesti per partecipare
            </Heading>
            <Text>{hackathon.attendantsRequirements.description}</Text>
            <Divider borderColor={colors.red} />

            <Heading as='h2' size='md'>
                Premio
            </Heading>
            <Text>€ {hackathon.prize.amount} in denaro</Text>
            <Text>{hackathon.prize.extra}</Text>
        </StyledBottomBoxContainer>
    );
};

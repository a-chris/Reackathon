import {
    Accordion,
    AccordionHeader,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    PseudoBox,
    Stack,
    Text,
    Textarea,
    Flex,
    Divider,
    Heading,
} from '@chakra-ui/core';
import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';
import { HackathonStatus, NewHackathon, UserRole } from '../../models/Models';
import { createHackathon, getHackathon } from '../../services/HackathonService';
import colors from '../../utils/colors';

const AccordionHeaderStyle = {
    fontWeight: '700',
    bg: colors.blue_night,
    color: colors.white,
    borderRadius: 3,
};

const initialPrizeData = {
    amount: 0,
    extra: '',
};

function initialHackathonData() {
    const date = moment();
    return {
        name: '',
        description: '',
        attendantsRequirements: {
            description: '',
        },
        startDate: date.add(7, 'days').toDate(),
        endDate: date.add(1, 'days').toDate(),
        location: undefined,
        prize: initialPrizeData,
        status: HackathonStatus.PENDING,
    };
}

type Props = { id?: string };

export default function HackathonManagement() {
    const appContext = React.useContext(AppContext);
    const params = useParams<Props>();
    const hackathonId = params.id;
    const history = useHistory();

    const [hackathonData, setHackathonData] = React.useState<NewHackathon>(initialHackathonData());
    const [loading, setLoading] = React.useState<boolean>(false);
    const [allValuesValid, setAllValuesValid] = React.useState<boolean>(false);
    const [dateError, setDateError] = React.useState<boolean>(false);
    const [groupError, setGroupError] = React.useState<boolean>(false);
    const [attensantsNumError, setAttensantsNumError] = React.useState<boolean>(false);
    //TODO optional add min max errors and validation
    const [missingData, setMissingData] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (hackathonId) {
            getHackathon(hackathonId).then((hackathon) => {
                setHackathonData(hackathon);
                console.log('HackathonManagement -> hackathon', hackathon);
            });
        }
    }, [hackathonId]);

    React.useEffect(() => {
        const allValid =
            _.every(new Set([dateError, groupError, attensantsNumError])) &&
            missingData.length === 0;
        setAllValuesValid(allValid);
    }, [dateError, groupError, attensantsNumError, missingData]);

    React.useEffect(() => {
        const missingFields = Object.entries(hackathonData)
            .filter((el) => el[1] === undefined || el[1] === '')
            .map((el) => el[0]);
        if (hackathonData.location?.street == null) missingFields.push('street');
        if (hackathonData.location?.number == null) missingFields.push('number');
        if (hackathonData.location?.city == null) missingFields.push('city');
        if (hackathonData.location?.province == null) missingFields.push('province');
        if (hackathonData.location?.zip_code == null) missingFields.push('zip_code');
        if (hackathonData.location?.country == null) missingFields.push('country');

        setMissingData(missingFields);
    }, [hackathonData]);

    React.useEffect(() => {
        if (appContext.state?.user && appContext.state?.user.role === UserRole.ORGANIZATION) {
            setHackathonData((curr) => ({ ...curr, organization: appContext.state!.user }));
        }
    }, [appContext.state]);

    React.useEffect(() => {
        if (hackathonData.startDate && hackathonData.endDate) {
            const tomorrow = moment().add(1, 'days');
            let error =
                moment(hackathonData.startDate) < tomorrow ||
                moment(hackathonData.startDate) >= moment(hackathonData.endDate);
            setDateError(error);
        }
    }, [hackathonData.startDate, hackathonData.endDate]);

    React.useEffect(() => {
        setAttensantsNumError(
            validateRange(
                hackathonData.attendantsRequirements.minNum,
                hackathonData.attendantsRequirements.maxNum
            )
        );
        setGroupError(
            validateRange(
                hackathonData.attendantsRequirements.minGroupComponents,
                hackathonData.attendantsRequirements.maxGroupComponents
            )
        );
    }, [hackathonData.attendantsRequirements]);

    const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({ ...curr, [name]: value }));
        }
    };

    const onChangeRequirements = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({
                ...curr,
                attendantsRequirements: { ...curr.attendantsRequirements, [name]: value },
            }));
        }
    };

    const onChangePrize = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({ ...curr, prize: { ...curr.prize, [name]: value } }));
        }
    };

    const onChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({
                ...curr,
                location: { ...curr.location, [name]: value },
            }));
        }
    };

    const onTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;

        if (name != null && value != null && new Set(['startDate', 'endDate']).has(name)) {
            setHackathonData((curr) => {
                const newDate = new Date(name === 'startDate' ? curr.startDate : curr.endDate);
                const hours = value.substring(0, 2);
                const minutes = value.substring(3, 5);
                newDate.setHours(+hours);
                newDate.setMinutes(+minutes);

                return { ...curr, [name]: newDate };
            });
        }
    };

    const onDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;

        if (name != null && value != null && new Set(['startDate', 'endDate']).has(name)) {
            setHackathonData((curr) => {
                const newDate = new Date(name === 'startDate' ? curr.startDate : curr.endDate);
                const day = new Date(value).getDate();
                const month = new Date(value).getMonth();
                const year = new Date(value).getFullYear();
                newDate.setDate(day);
                newDate.setMonth(month);
                newDate.setFullYear(year);

                return { ...curr, [name]: newDate };
            });
        }
    };

    const onHackathonCreation = React.useCallback(() => {
        setLoading(true);
        createHackathon(hackathonData)
            .then((hackathon) => {
                setLoading(false);
                history.push(`/hackathons/${hackathon._id}`);
            })
            .catch((error) => console.log(error));
    }, [hackathonData, history]);

    return (
        <StyledHackathonContainer>
            <PseudoBox as='h1' fontSize='1.8em' fontWeight='semibold' m={3}>
                {hackathonId ? 'Modifica' : 'Creazione'} Hackathon
            </PseudoBox>

            <Accordion defaultIndex={[0]} allowMultiple>
                <StyledAccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1'>Descrizione dell'evento</Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired>
                            <FormLabel htmlFor='name'>Nome dell'evento</FormLabel>
                            <Input
                                id='name'
                                name='name'
                                value={hackathonData.name}
                                onChange={onChangeValue}
                                placeholder='clicca per modificare...'
                                border={'1px solid ' + colors.gray}
                                borderRadius='0.25em'
                                p={2}
                                pl={4}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel htmlFor='description'>Descrizione</FormLabel>
                            <Textarea
                                id='description'
                                name='description'
                                placeholder='clicca per modificare...'
                                value={hackathonData.description}
                                onChange={onChangeValue}
                            />
                        </FormControl>
                    </AccordionPanel>
                </StyledAccordionItem>

                <StyledAccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1'>Orari e location</Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isInvalid={dateError}>
                            <Stack>
                                <Box display={{ md: 'flex' }}>
                                    <StyleDataDiv>
                                        <FormControl isRequired p={1}>
                                            <FormLabel htmlFor='startDate'>
                                                Data di inizio
                                            </FormLabel>
                                            <Input
                                                size='sm'
                                                placeholder='Data inizio'
                                                type='date'
                                                name='startDate'
                                                id='startDate'
                                                onChange={onDateChange}
                                                value={moment(hackathonData.startDate).format(
                                                    'yyyy-MM-DD'
                                                )}
                                            />
                                        </FormControl>

                                        <FormControl isRequired p={1}>
                                            <FormLabel htmlFor='startTime'>Ora di inizio</FormLabel>
                                            <Input
                                                size='sm'
                                                placeholder='Ora di inizio'
                                                type='time'
                                                name='startDate'
                                                id='startTime'
                                                onChange={onTimeChange}
                                                value={moment(hackathonData.startDate).format(
                                                    'HH:mm'
                                                )}
                                            />
                                        </FormControl>
                                    </StyleDataDiv>

                                    <StyleDataDiv>
                                        <FormControl isRequired p={1}>
                                            <FormLabel htmlFor='endDate'>Data di fine</FormLabel>
                                            <Input
                                                size='sm'
                                                placeholder='Data fine'
                                                type='date'
                                                name='endDate'
                                                id='endDate'
                                                onChange={onDateChange}
                                                value={moment(hackathonData.endDate).format(
                                                    'yyyy-MM-DD'
                                                )}
                                            />
                                        </FormControl>

                                        <FormControl isRequired p={1}>
                                            <FormLabel htmlFor='endTime'>Ora di fine</FormLabel>
                                            <Input
                                                size='sm'
                                                placeholder='Ora di fine'
                                                type='time'
                                                name='endDate'
                                                id='endTime'
                                                onChange={onTimeChange}
                                                value={moment(hackathonData.endDate).format(
                                                    'HH:mm'
                                                )}
                                            />
                                        </FormControl>
                                    </StyleDataDiv>
                                </Box>
                                <FormErrorMessage>
                                    {`L'Hackathon deve essere creato almeno un giorno prima dell'inizio dell'evento,\
                                     e la data di inizio deve essere inferiore a quella di fine.`}
                                </FormErrorMessage>
                            </Stack>

                            <Divider borderColor={colors.gold} />

                            <Heading as='h2' size='md'>
                                Indirizzo
                            </Heading>
                            <Flex wrap='wrap'>
                                <FormControl isRequired p={1}>
                                    <FormLabel htmlFor='street'>Vai</FormLabel>
                                    <Input
                                        id='street'
                                        name='street'
                                        defaultValue={hackathonData.location?.street || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>

                                <FormControl isRequired p={1}>
                                    <FormLabel htmlFor='number'>Numero</FormLabel>
                                    <Input
                                        id='number'
                                        name='number'
                                        type='number'
                                        defaultValue={hackathonData.location?.number || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>

                                <FormControl isRequired p={1}>
                                    <FormLabel htmlFor='city'>Città</FormLabel>
                                    <Input
                                        id='city'
                                        name='city'
                                        defaultValue={hackathonData.location?.city || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>
                                <FormControl isRequired p={1}>
                                    <FormLabel htmlFor='province'>Provincia</FormLabel>
                                    <Input
                                        id='province'
                                        name='province'
                                        defaultValue={hackathonData.location?.province || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>

                                <FormControl isRequired p={1}>
                                    <FormLabel htmlFor='country'>Stato</FormLabel>
                                    <Input
                                        id='country'
                                        name='country'
                                        defaultValue={hackathonData.location?.country || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>

                                <FormControl isRequired p={1}>
                                    <FormLabel htmlFor='zip_code'>CAP</FormLabel>
                                    <Input
                                        id='zip_code'
                                        name='zip_code'
                                        defaultValue={hackathonData.location?.zip_code || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>
                            </Flex>

                            <Text pt={5}>
                                Inserisci anche longitudine e latitudine del luogo per vederlo sulle
                                mappe del sito.
                            </Text>
                            <Flex>
                                <FormControl p={1}>
                                    <FormLabel htmlFor='lat'>Latitudine</FormLabel>
                                    <Input
                                        id='lat'
                                        name='lat'
                                        type='number'
                                        defaultValue={hackathonData.location?.lat || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>
                                <FormControl p={1}>
                                    <FormLabel htmlFor='long'>Longitudine</FormLabel>
                                    <Input
                                        id='long'
                                        name='long'
                                        type='number'
                                        defaultValue={hackathonData.location?.long || ''}
                                        onChange={onChangeLocation}
                                        placeholder='clicca per modificare...'
                                    />
                                </FormControl>
                            </Flex>
                        </FormControl>
                    </AccordionPanel>
                </StyledAccordionItem>

                <StyledAccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1'>Requisiti per partecipare</Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl>
                            <FormLabel htmlFor='requirements_description'>
                                Requisiti richiesti ai partecipanti
                            </FormLabel>
                            <Textarea
                                id='requirements_description'
                                name='description'
                                placeholder='clicca per modificare...'
                                value={hackathonData.attendantsRequirements.description}
                                onChange={onChangeRequirements}
                            />
                        </FormControl>

                        <FormControl pr={4} isInvalid={attensantsNumError}>
                            <Box display={{ md: 'flex' }}>
                                <Stack pr={2}>
                                    <FormLabel htmlFor='minNum'>
                                        Numero minimo di partecipanti
                                    </FormLabel>
                                    <Input
                                        id='minNum'
                                        name='minNum'
                                        type='number'
                                        placeholder='-'
                                        value={hackathonData.attendantsRequirements.minNum || ''}
                                        onChange={onChangeRequirements}
                                    />
                                </Stack>
                                <Stack>
                                    <FormLabel htmlFor='maxNum'>
                                        Numero massimo di partecipanti
                                    </FormLabel>
                                    <Input
                                        id='maxNum'
                                        name='maxNum'
                                        type='number'
                                        placeholder='-'
                                        value={hackathonData.attendantsRequirements.maxNum || ''}
                                        onChange={onChangeRequirements}
                                    />
                                </Stack>
                            </Box>
                            <FormErrorMessage>
                                Il numero mimino non può essere più grande del numero massimo di
                                partecipanti
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl pr={4} isInvalid={groupError}>
                            <Box display={{ md: 'flex' }}>
                                <Stack pr={2}>
                                    <FormLabel htmlFor='minGroupComponents'>
                                        Numero minimo di componenti per squadra
                                    </FormLabel>
                                    <Input
                                        id='minGroupComponents'
                                        name='minGroupComponents'
                                        type='number'
                                        placeholder='-'
                                        value={
                                            hackathonData.attendantsRequirements
                                                .minGroupComponents || ''
                                        }
                                        onChange={onChangeRequirements}
                                    />
                                </Stack>
                                <Stack>
                                    <FormLabel htmlFor='maxGroupComponents'>
                                        Numero massimo di componenti per squadra
                                    </FormLabel>
                                    <Input
                                        id='maxGroupComponents'
                                        name='maxGroupComponents'
                                        type='number'
                                        placeholder='-'
                                        value={
                                            hackathonData.attendantsRequirements
                                                .maxGroupComponents || ''
                                        }
                                        onChange={onChangeRequirements}
                                    />
                                </Stack>
                            </Box>
                            <FormErrorMessage>
                                Il numero mimino non può essere più grande del numero massimo di
                                componenti per gruppo
                            </FormErrorMessage>
                        </FormControl>
                    </AccordionPanel>
                </StyledAccordionItem>

                <StyledAccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1'>Premi</Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired>
                            <FormLabel htmlFor='amount'>Premio in denaro</FormLabel>
                            <NumberInput step={5} defaultValue={0} min={0}>
                                <NumberInputField
                                    id='amount'
                                    name='amount'
                                    onChange={onChangePrize}
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl pr={4}>
                            <FormLabel htmlFor='extra'>Altre informazioni</FormLabel>
                            <Input
                                id='extra'
                                name='extra'
                                value={hackathonData.prize.extra}
                                onChange={onChangePrize}
                            />
                        </FormControl>
                    </AccordionPanel>
                </StyledAccordionItem>
            </Accordion>

            <Box textAlign='center'>
                <Button
                    isLoading={loading}
                    isDisabled={!allValuesValid}
                    m={3}
                    mb={0}
                    borderColor={colors.blue_night}
                    color={colors.black}
                    border='2px'
                    variant='outline'
                    onClick={onHackathonCreation}
                    type='button'>
                    Salva
                </Button>
                {!allValuesValid && (
                    <Text>
                        <small>Inserisci tutte le informazioni richieste per poter procedere</small>
                    </Text>
                )}
            </Box>
        </StyledHackathonContainer>
    );
}

function validateRange(min?: number, max?: number): boolean {
    if (min && max) return +min > +max;
    return false;
}

const StyledHackathonContainer = styled.div`
    background-color: ${colors.white};
    margin: 2%;
    border: 3px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
`;

const StyledAccordionItem = styled(AccordionItem)`
    padding-bottom: 5px;
`;

const StyleDataDiv = styled.div`
    padding: 8px;
`;

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
    PseudoBox,
    Text,
    Textarea,
    Stack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/core';
import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { AppContext } from '../../AppContext';
import { HackathonStatus, NewHackathon, User } from '../../models/Models';
// TODO find a better solution
import { fakeLocation } from '../../models/TempDemoModels';
import { createHackathon, getHackathon } from '../../services/HackathonService';
import colors from '../../utils/colors';
import { useParams, useHistory } from 'react-router-dom';

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

function initialHackathonData(user: User) {
    const date = moment();
    return {
        name: '',
        description: '',
        attendantsRequirements: {
            description: '',
        },
        organization: user,
        startDate: date.add(7, 'days').toDate(),
        endDate: date.add(1, 'days').toDate(),
        location: fakeLocation, //TODO remove fake value
        prize: initialPrizeData,
        status: HackathonStatus.PENDING,
    };
}

type Props = { id?: string };

export default function HackathonManagement() {
    const appContext = React.useContext(AppContext);
    const params = useParams<Props>();
    const idHackathon = params.id;
    const history = useHistory();

    const [hackathonData, setHackathonData] = React.useState<NewHackathon>(
        initialHackathonData(appContext.state!.user!)
    );
    const [loading, setLoading] = React.useState<boolean>(false);
    const [allValuesValid, setAllValuesValid] = React.useState<boolean>(false);
    const [dateError, setDateError] = React.useState<boolean>(false);
    const [missingData, setMissingData] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (idHackathon) {
            getHackathon(idHackathon).then((hackathon) => {
                setHackathonData(hackathon);
                console.log('HackathonManagement -> hackathon', hackathon);
            });
        }
    }, [idHackathon]);

    React.useEffect(() => {
        const allValid = _.every(new Set([dateError])) && missingData.length === 0;
        setAllValuesValid(allValid);
    }, [dateError, missingData]);

    React.useEffect(() => {
        setMissingData(
            Object.entries(hackathonData)
                .filter((el) => el[1] === undefined || el[1] === '')
                .map((el) => el[0])
        );
    }, [hackathonData]); //TODO optimize

    React.useEffect(() => {
        if (hackathonData.startDate && hackathonData.endDate) {
            const tomorrow = moment().add(1, 'days');
            let error =
                moment(hackathonData.startDate) < tomorrow ||
                moment(hackathonData.startDate) >= moment(hackathonData.endDate);
            setDateError(error);
        }
    }, [hackathonData.startDate, hackathonData.endDate]);

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
            <PseudoBox as='h1' fontSize='1.8em' fontWeight='semibold' m={3} textAlign='left'>
                {idHackathon ? 'Modifica' : 'Creazione'} Hackathon
            </PseudoBox>

            <Accordion defaultIndex={[0]} allowMultiple>
                <StyledAccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Descrizione dell'evento
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='name'>Nome dell'evento</FormLabel>
                            <Input
                                id='name'
                                name='name'
                                textAlign='left'
                                value={hackathonData.name}
                                onChange={onChangeValue}
                                placeholder='clicca per modificare...'
                                border={'1px solid ' + colors.gray}
                                borderRadius='0.25em'
                                p={2}
                                pl={4}
                            />
                        </FormControl>

                        <FormControl isRequired textAlign='left'>
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
                        <Box flex='1' textAlign='left'>
                            Orari e location
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isInvalid={dateError}>
                            <Stack>
                                <Box display={{ md: 'flex' }}>
                                    <StyleDataDiv>
                                        <FormControl isRequired textAlign='left' p={1}>
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

                                        <FormControl isRequired textAlign='left' p={1}>
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
                                        <FormControl isRequired textAlign='left' p={1}>
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

                                        <FormControl isRequired textAlign='left' p={1}>
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
                            <FormControl isRequired textAlign='left'>
                                <FormLabel htmlFor='location'>Luogo</FormLabel>
                                <Input
                                    id='location'
                                    name='location'
                                    textAlign='left'
                                    defaultValue={Object.entries(hackathonData.location).map(
                                        (v: any) => v[1]
                                    )} //TODO add address autocomplete
                                    isReadOnly={true}
                                    // onChange={onChangeValue}
                                    placeholder='clicca per modificare...'
                                    p={2}
                                    pl={4}
                                />
                            </FormControl>
                        </FormControl>
                    </AccordionPanel>
                </StyledAccordionItem>

                <StyledAccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Requisiti per partecipare
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='description'>
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

                        <Box display={{ md: 'flex' }}>
                            <FormControl textAlign='left' pr={4}>
                                <FormLabel htmlFor='startDate'>
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
                            </FormControl>

                            <FormControl textAlign='left'>
                                <FormLabel htmlFor='startDate'>
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
                            </FormControl>
                        </Box>
                    </AccordionPanel>
                </StyledAccordionItem>

                <StyledAccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Premi
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='startDate'>Premio in denaro</FormLabel>
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

                        <FormControl textAlign='left' pr={4}>
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
        </StyledHackathonContainer>
    );
}

const StyledHackathonContainer = styled.div`
    background-color: ${colors.white};
    margin: 2%;
    border: 3px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
`;

const StyledAccordionItem = styled(AccordionItem)`
    padding-bottom: 5px;
`;

const StyleDataDiv = styled.div`
    padding: 8px;
`;

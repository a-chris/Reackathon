import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import * as _ from 'lodash';
import moment from 'moment';
import {
    PseudoBox,
    Stack,
    Accordion,
    AccordionItem,
    AccordionHeader,
    Box,
    AccordionIcon,
    AccordionPanel,
    Textarea,
    Input,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Text,
} from '@chakra-ui/core';
import 'react-datepicker/dist/react-datepicker.css';
import { AppContext } from '../../AppContext';
import { createHackathon } from '../../services/HackathonService';
import { User, Location, HackathonStatus, NewHackathon } from '../../models/Models';
// TODO find a better solution
import { fakeOrganization, fakeLocation } from '../../models/TempDemoModels';
import { yellow, gray, orange_light, white } from '../../utils/colors';

const AccordionHeaderStyle = {
    fontWeight: '700',
    bg: yellow,
    borderRadius: 5,
};

const initialPrizeData = {
    amount: 0,
    extra: '',
};

const initialHackathonData = (user: User = fakeOrganization) => {
    const date = moment();
    return {
        name: '',
        description: '',
        organization: user,
        startDate: date.add(7, 'days').toDate(),
        endDate: date.add(1, 'days').toDate(),
        attendants: [],
        location: fakeLocation, //TODO remove fake value
        prize: initialPrizeData,
        status: HackathonStatus.PENDING,
    };
};

export default function HackathonManagement() {
    const appContext = React.useContext(AppContext);
    const [hackathonData, setHackathonData] = React.useState<NewHackathon>(
        initialHackathonData(appContext.state!.user)
    );
    const [loading, setLoading] = React.useState<boolean>(false);
    const [allValuesValid, setAllValuesValid] = React.useState<boolean>(false); //TODO add validation effect and set initial value to false
    const [dateError, setDateError] = React.useState<boolean>(false);
    const [missingData, setMissingData] = React.useState<string[]>([]);
    // const [prizeError, setPrizeError] = React.useState<boolean>(false);

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
    }, [hackathonData]);

    React.useEffect(() => {
        if (hackathonData.startDate && hackathonData.endDate) {
            const tomorrow = moment().add(1, 'days').toDate().getTime();
            let error =
                hackathonData.startDate.getTime() < tomorrow ||
                hackathonData.startDate.getTime() >= hackathonData.endDate.getTime();
            setDateError(error);
        }
    }, [hackathonData.startDate, hackathonData.endDate]);

    const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({ ...curr, [name]: value }));
        }
    };

    const onChangePrize = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setHackathonData((curr) => ({ ...curr, prize: { ...curr.prize, [name]: value } }));
        }
    };

    const onDateChange = (date: Date, name: string) => {
        setHackathonData((curr) => ({ ...curr, [name]: date }));
    };

    const onHackathonCreation = React.useCallback(() => {
        setLoading(true);
        createHackathon(hackathonData)
            .then((hackathon) => {
                setLoading(false);
                console.log(hackathon);
            })
            .catch((error) => console.log(error));
    }, [hackathonData]);

    return (
        <StyledHackathonContainer>
            <PseudoBox fontSize='1.8em' fontWeight='semibold' m={3} textAlign='left'>
                Creazione dell'Hackathon
            </PseudoBox>

            <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
                <AccordionItem>
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
                                border={'1px solid ' + gray}
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
                </AccordionItem>

                <AccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Orari e location
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isInvalid={dateError}>
                            <Box display={{ md: 'flex' }}>
                                <FormControl isRequired textAlign='left' pr={4}>
                                    <FormLabel htmlFor='startDate'>Data di inizio</FormLabel>
                                    <StyleDataPickerDiv>
                                        <DatePicker
                                            id='startDate'
                                            showTimeSelect
                                            showTimeInput
                                            selected={hackathonData.startDate}
                                            onChange={(date: Date) =>
                                                onDateChange(date, 'startDate')
                                            }
                                            dateFormat='dd/MM/yyyy HH:mm'
                                        />
                                    </StyleDataPickerDiv>
                                </FormControl>
                                <FormControl isRequired textAlign='left'>
                                    <FormLabel htmlFor='endDate'>Data di fine</FormLabel>
                                    <StyleDataPickerDiv>
                                        <DatePicker
                                            id='endDate'
                                            showTimeSelect
                                            showTimeInput
                                            selected={hackathonData.endDate}
                                            onChange={(date: Date) => onDateChange(date, 'endDate')}
                                            dateFormat='dd/MM/yyyy HH:mm'
                                        />
                                    </StyleDataPickerDiv>
                                </FormControl>

                                <FormErrorMessage>
                                    {`L'Hackathon deve essere creato almeno un giorno prima dell'inizio dell'evento,\
                                     e la data di inizio deve essere inferiore a quella di fine.`}
                                </FormErrorMessage>
                            </Box>
                            <FormControl isRequired textAlign='left'>
                                <FormLabel htmlFor='location'>Luogo</FormLabel>
                                <Input
                                    id='location'
                                    name='location'
                                    textAlign='left'
                                    defaultValue={Object.entries(hackathonData.location).map(
                                        (v: any) => v[1]
                                    )}
                                    isReadOnly={true}
                                    // onChange={onChangeValue}
                                    placeholder='clicca per modificare...'
                                    p={2}
                                    pl={4}
                                />
                            </FormControl>
                        </FormControl>
                        <Stack>{/* TODO add google autocomplete */}</Stack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Premi
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <FormControl isRequired textAlign='left'>
                            <FormLabel htmlFor='startDate'>Premio in denaro</FormLabel>
                            <Input
                                id='amount'
                                name='amount'
                                type='number'
                                value={hackathonData.prize.amount}
                                onChange={onChangePrize}
                            />
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
                </AccordionItem>
            </Accordion>

            <Button
                isLoading={loading}
                isDisabled={!allValuesValid}
                m={3}
                mb={0}
                borderColor={orange_light}
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
    background-color: ${white};
    margin: 2%;
    border: 3px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
`;

const StyleDataPickerDiv = styled.div`
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    width: fit-content;
    padding: 8px;
`;

const StyledLabel = styled.label`
    font-weight: 400;
`;

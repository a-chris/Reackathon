import React from 'react';
import {
    Editable,
    EditablePreview,
    EditableInput,
    Flex,
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
} from '@chakra-ui/core';
import styled from 'styled-components';
import { User, Location } from '../../models/Models';
import { yellow, gray, orange_light } from '../../utils/colors';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// TODO find a better solution
import { fakeOrganization, fakeUser, fakeLocation, fakePrize } from '../../models/TempDemoModels';

const AccordionHeaderStyle = {
    fontWeight: '700',
    bg: yellow,
};

type Prize = {
    amount: number;
    extra: string;
};

type Hackathon = {
    name: string;
    description: string;
    organization: User;
    startDate: Date;
    endDate: Date;
    attendants: User[] | [];
    location: Location;
    prize: Prize;
};

export default function HackathonDetail() {
    // TODO it's possible to use Hackathon class?
    const [hackathonData, setHackathonData] = React.useState<Hackathon>({
        name: '',
        description: '',
        organization: fakeOrganization,
        startDate: new Date(),
        endDate: new Date(),
        attendants: [fakeUser],
        location: fakeLocation,
        prize: fakePrize,
    });

    const onTitleChange = (value: string) => {
        setHackathonData((curr) => ({ ...curr, name: value }));
    };

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

    const onDataChange = (date: Date, name: string) => {
        setHackathonData((curr) => ({ ...curr, [name]: date }));
    };

    console.log(hackathonData);

    return (
        <StyledHackathonContainer>
            <PseudoBox fontSize='1.8em' fontWeight='semibold' m={3}>
                Dettagli dell'Hackathon
            </PseudoBox>

            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <AccordionHeader {...AccordionHeaderStyle}>
                        <Box flex='1' textAlign='left'>
                            Descrizione dell'evento
                        </Box>
                        <AccordionIcon />
                    </AccordionHeader>
                    <AccordionPanel pb={4}>
                        <Stack textAlign='left' m={2}>
                            <StyledLabel>Nome dell'evento</StyledLabel>
                            <Editable
                                textAlign='left'
                                value={hackathonData.name}
                                onChange={onTitleChange}
                                placeholder='clicca per modificare...'
                                border={'1px solid ' + gray}
                                borderRadius='0.25em'
                                p={2}
                                pl={4}>
                                <EditablePreview />
                                <EditableInput />
                            </Editable>
                        </Stack>

                        <Stack textAlign='left' m={2}>
                            <StyledLabel> Descrizione</StyledLabel>
                            <Textarea
                                name='description'
                                placeholder='clicca per modificare...'
                                value={hackathonData.description}
                                onChange={onChangeValue}
                            />
                        </Stack>
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
                        <Box display={{ md: 'flex' }}>
                            <Stack textAlign='left' m={2}>
                                <StyledLabel> Data di inizio</StyledLabel>
                                <StyleDataPickerDiv>
                                    <DatePicker
                                        showTimeSelect
                                        showTimeInput
                                        selected={hackathonData.startDate}
                                        onChange={(date: Date) => onDataChange(date, 'startDate')}
                                        dateFormat='Pp'
                                    />
                                </StyleDataPickerDiv>
                            </Stack>
                            <Stack textAlign='left' m={2}>
                                <StyledLabel>Data di fine</StyledLabel>
                                <StyleDataPickerDiv>
                                    <DatePicker
                                        showTimeSelect
                                        showTimeInput
                                        selected={hackathonData.endDate}
                                        onChange={(date: Date) => onDataChange(date, 'endDate')}
                                        dateFormat='Pp'
                                    />
                                </StyleDataPickerDiv>
                            </Stack>
                            <Stack>{/* TODO add google autocomplete */}</Stack>
                        </Box>
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
                        <Stack textAlign='left' m={2}>
                            <StyledLabel> Premio in denaro</StyledLabel>
                            <Input
                                name='amount'
                                value={hackathonData.prize.amount}
                                onChange={onChangePrize}
                            />
                        </Stack>
                        <Stack textAlign='left' m={2}>
                            <StyledLabel> Altre informazioni</StyledLabel>
                            <Input
                                name='extra'
                                value={hackathonData.prize.extra}
                                onChange={onChangePrize}
                            />
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <Button m={3} mb={0} borderColor={orange_light} border='2px' variant='outline'>
                Salva
            </Button>
        </StyledHackathonContainer>
    );
}

const StyledHackathonContainer = styled.div`
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

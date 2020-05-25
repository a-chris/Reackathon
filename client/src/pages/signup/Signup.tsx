import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Link,
    Radio,
    RadioGroup,
    Stack,
    Text,
} from '@chakra-ui/core';
import * as _ from 'lodash';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../App';
import { isUserRole, UserRole } from '../../models/Models';
import { signup, SignupData, usernameAlreadyExists } from '../../services/LoginService';

const initialSignupData = {
    username: '',
    password: '',
    role: UserRole.CLIENT,
    email: '',
    name: '',
};

const MIN_PASSWORD_LENGTH = 6;

export default function Signup() {
    const appContext = React.useContext(AppContext);
    const [signupData, setSignupData] = React.useState<SignupData>(initialSignupData);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [usernameError, setUsernameError] = React.useState<string>('');
    const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
    const [passwordError, setPasswordError] = React.useState<boolean>(false);
    const [passwordConfirmError, setPasswordConfirmError] = React.useState<boolean>(false);
    const [allValuesValid, setAllValuesValid] = React.useState<boolean>(false);

    React.useEffect(() => {
        const allValid = _.every(new Set([passwordError, passwordConfirmError, usernameError]));
        setAllValuesValid(allValid);
    }, [passwordError, passwordConfirmError, usernameError]);

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setSignupData((curr) => ({ ...curr, [name]: value }));
        }
    };

    const onRoleChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        if (isUserRole(value)) {
            setSignupData((curr) => ({ ...curr, role: UserRole[value] }));
        }
    };

    const validatePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        setPasswordError(value?.length > 0 && value?.length < MIN_PASSWORD_LENGTH);
    };

    const validateConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        setPasswordConfirmError(value !== signupData.password);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((curr) => !curr);
    };

    const validateUsername = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        if (value?.length > 0) {
            usernameAlreadyExists(value).then((alreadyExists) => {
                setUsernameError(alreadyExists ? 'Username già in uso.' : '');
            });
        }
    };

    const onSignup = React.useCallback(() => {
        console.log(signupData);
        setLoading(true);
        signup(signupData)
            .then((user) => {
                setLoading(false);
                if (appContext?.onLoggedIn != null) {
                    appContext.onLoggedIn(user);
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [appContext, signupData]);

    return (
        <StyledLoginContainer>
            <Stack spacing={'-70px'} width={['90%', '80%', '50%', '40%']} m='auto'>
                <Box
                    overflow='visible'
                    borderWidth='1px'
                    rounded='md'
                    w='90%'
                    h='100px'
                    m='auto'
                    bg='#319795'
                    zIndex={1}>
                    <Heading h='100%' as='h1' size='xl' p='25px' verticalAlign='middle'>
                        Registrazione
                    </Heading>
                </Box>
                <Box overflow='hidden' borderWidth='1px' rounded='md' pt='70px'>
                    <Stack spacing={3} p={8}>
                        <FormControl isRequired isInvalid={usernameError.length > 0}>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='sun' />} />
                                <Input
                                    type='text'
                                    placeholder='Username'
                                    defaultValue=''
                                    variant='flushed'
                                    name='username'
                                    onChange={onChangeValue}
                                    onBlur={validateUsername}
                                />
                                {signupData?.username?.length > 0 && (
                                    <InputRightElement
                                        children={
                                            usernameError ? (
                                                <Icon name='not-allowed' color='red.500' />
                                            ) : (
                                                <Icon name='check' color='green.500' />
                                            )
                                        }
                                    />
                                )}
                            </InputGroup>
                            <FormErrorMessage>{usernameError}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={passwordError}>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='lock' />} />
                                <Input
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder='Password'
                                    defaultValue=''
                                    pr='4.5rem'
                                    variant='flushed'
                                    name='password'
                                    onChange={onChangeValue}
                                    onBlur={validatePassword}
                                />
                                <InputRightElement width='4.5rem'>
                                    <IconButton
                                        h='1.75rem'
                                        size='sm'
                                        onClick={togglePasswordVisibility}
                                        aria-label={passwordVisible ? 'Hide' : 'Show'}
                                        icon={passwordVisible ? 'view' : 'view-off'}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                                {`La password deve essere lunga almeno ${MIN_PASSWORD_LENGTH} caratteri.`}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={passwordConfirmError}>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='lock' />} />
                                <Input
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder='Password di conferma'
                                    defaultValue=''
                                    pr='4.5rem'
                                    variant='flushed'
                                    name='passwordConfirm'
                                    onBlur={validateConfirmPassword}
                                />
                                <InputRightElement width='4.5rem'>
                                    <IconButton
                                        h='1.75rem'
                                        size='sm'
                                        onClick={togglePasswordVisibility}
                                        aria-label={passwordVisible ? 'Hide' : 'Show'}
                                        icon={passwordVisible ? 'view' : 'view-off'}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>Le password non coincidono.</FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='email' />} />
                                <Input
                                    type='text'
                                    placeholder='Email'
                                    defaultValue=''
                                    variant='flushed'
                                    name='email'
                                    onChange={onChangeValue}
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='spinner' />} />
                                <Input
                                    type='text'
                                    placeholder='Nome'
                                    defaultValue=''
                                    variant='flushed'
                                    name='name'
                                    onChange={onChangeValue}
                                />
                            </InputGroup>
                        </FormControl>
                        <RadioGroup
                            isInline
                            value={signupData.role.toString()}
                            name='role'
                            onChange={onRoleChangeValue}>
                            <Radio value='CLIENT'>Partecipante</Radio>
                            <Radio value='ORGANIZATION'>Organizzatore</Radio>
                        </RadioGroup>
                    </Stack>
                    <Button
                        isDisabled={!allValuesValid}
                        variantColor='teal'
                        isLoading={loading}
                        type='submit'
                        onClick={onSignup}>
                        Registrati
                    </Button>
                    <Text p={3} fontSize='0.9em'>
                        <Link color='teal.500' href='#/login'>
                            Oppure accedi.
                        </Link>
                    </Text>
                </Box>
            </Stack>
        </StyledLoginContainer>
    );
}

// TODO change vh to fix smart
const StyledLoginContainer = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

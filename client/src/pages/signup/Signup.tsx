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
    Radio,
    RadioGroup,
    Stack,
    Text,
} from '@chakra-ui/core';
import * as _ from 'lodash';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { StyledLabel } from '../../components/Common';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import { isUserRole, UserRole } from '../../models/Models';
import { signup, SignupData, usernameAlreadyExists } from '../../services/AuthService';
import colors from '../../utils/colors';

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
    const [passwordConfirmError, setPasswordConfirmError] = React.useState<boolean>();
    const [allValuesValid, setAllValuesValid] = React.useState<boolean>(false);
    const [missingData, setMissingData] = React.useState<string[]>([]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    React.useEffect(() => {
        const allValid =
            _.every([!passwordError, !passwordConfirmError, !usernameError]) &&
            missingData.length === 0;
        setAllValuesValid(allValid);
    }, [passwordError, passwordConfirmError, usernameError, missingData]);

    React.useEffect(() => {
        setMissingData(
            Object.entries(signupData)
                .filter((el) => el[1] === undefined || el[1] === '')
                .map((el) => el[0])
        );
    }, [signupData]);

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
        if (passwordConfirmError == null) {
            setPasswordConfirmError(true);
        } else {
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
        }
    }, [appContext, signupData, passwordConfirmError]);

    return (
        <OverlappedBoxes
            mainStackStyle={{ width: ['90%', '80%', '50%', '40%'] }}
            topBoxStyle={{ bg: colors.blue_night }}
            TopContent={() => (
                <Heading
                    h='100%'
                    as='h1'
                    size='xl'
                    p='25px'
                    textAlign='center'
                    color={colors.white}>
                    Registrazione
                </Heading>
            )}
            BottomContent={() => (
                <Box>
                    <Stack spacing={3} p={8}>
                        <form>
                            <FormControl isInvalid={usernameError.length > 0} isRequired>
                                <StyledLabel htmlFor='username'>Username</StyledLabel>
                                <InputGroup size='md'>
                                    <InputLeftElement children={<Icon name='sun' />} />
                                    <Input
                                        type='text'
                                        placeholder='Username'
                                        defaultValue=''
                                        variant='flushed'
                                        name='username'
                                        id='username'
                                        onChange={onChangeValue}
                                        autoComplete='username'
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
                            <FormControl isInvalid={passwordError} isRequired>
                                <StyledLabel htmlFor='password'>Password</StyledLabel>
                                <InputGroup size='md'>
                                    <InputLeftElement children={<Icon name='lock' />} />
                                    <Input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder='Password'
                                        defaultValue=''
                                        pr='4.5rem'
                                        variant='flushed'
                                        name='password'
                                        id='password'
                                        autoComplete='new-password'
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
                            <FormControl isInvalid={passwordConfirmError} isRequired>
                                <StyledLabel htmlFor='passwordConfirm'>
                                    Conferma Password
                                </StyledLabel>
                                <InputGroup size='md'>
                                    <InputLeftElement children={<Icon name='lock' />} />
                                    <Input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder='Password di conferma'
                                        defaultValue=''
                                        pr='4.5rem'
                                        variant='flushed'
                                        name='passwordConfirm'
                                        id='passwordConfirm'
                                        autoComplete='new-password'
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
                        </form>
                        <FormControl isRequired>
                            <StyledLabel htmlFor='email'>Email</StyledLabel>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='email' />} />
                                <Input
                                    type='text'
                                    placeholder='Email'
                                    defaultValue=''
                                    variant='flushed'
                                    name='email'
                                    id='email'
                                    onChange={onChangeValue}
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl isRequired>
                            <StyledLabel htmlFor='name'>Nome e Cognome</StyledLabel>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='spinner' />} />
                                <Input
                                    type='text'
                                    placeholder='Nome'
                                    defaultValue=''
                                    variant='flushed'
                                    name='name'
                                    id='name'
                                    onChange={onChangeValue}
                                />
                            </InputGroup>
                        </FormControl>
                        <RadioGroup
                            isInline
                            value={signupData.role.toString()}
                            name='role'
                            textAlign='center'
                            onChange={onRoleChangeValue}>
                            <Radio value='CLIENT' variantColor='red'>
                                Partecipante
                            </Radio>
                            <Radio value='ORGANIZATION' variantColor='red'>
                                Organizzatore
                            </Radio>
                        </RadioGroup>
                    </Stack>
                    <Box textAlign='center'>
                        <Button
                            isDisabled={!allValuesValid}
                            bg={colors.blue_night}
                            _hover={{ bg: colors.blue_light }}
                            color={colors.white}
                            isLoading={loading}
                            type='submit'
                            onClick={onSignup}>
                            Registrati
                        </Button>
                    </Box>
                    <Text p={3} fontSize='0.9em' textAlign='center'>
                        Oppure{' '}
                        <Link to='/login'>
                            <span style={{ color: colors.red }}>
                                <b>accedi</b>
                            </span>
                        </Link>
                    </Text>
                </Box>
            )}
        />
    );
}

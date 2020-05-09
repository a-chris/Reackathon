import {
    Box,
    Button,
    FormControl,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Link,
    Stack,
    Text,
} from '@chakra-ui/core';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../App';
import { login, LoginData } from '../../services/LoginService';

export default function Signup() {
    const appContext = React.useContext(AppContext);
    const [loginData, setLoginData] = React.useState<LoginData>({ username: '', password: '' });

    const [loading, setLoading] = React.useState<boolean>(false);
    const [pwdVisible, setPwdVisible] = React.useState<boolean>(false);
    const [pwdError, setError] = React.useState<boolean>(false);

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setLoginData((curr) => ({ ...curr, [name]: value }));
        }
    };

    const validatePwd = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        if (value.length > 0 && value.length < 6) {
            setError(true);
        } else {
            setError(false);
        }
    };

    function togglePwdVisibility() {
        setPwdVisible(!pwdVisible);
    }

    return (
        <StyledLoginContainer>
            <Stack spacing={'-70px'} width={['90%', '80%', '50%', '30%']} m='auto'>
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
                        <FormControl>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='spinner' />} />
                                <Input
                                    type='text'
                                    placeholder='Username'
                                    defaultValue=''
                                    variant='flushed'
                                    name='username'
                                    onChange={onChangeValue}
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl isInvalid={pwdError}>
                            <InputGroup size='md'>
                                <InputLeftElement children={<Icon name='lock' />} />
                                <Input
                                    type={pwdVisible ? 'text' : 'password'}
                                    placeholder='Password'
                                    defaultValue=''
                                    pr='4.5rem'
                                    variant='flushed'
                                    name='password'
                                    onChange={onChangeValue}
                                    onBlur={validatePwd}
                                />
                                <InputRightElement width='4.5rem'>
                                    {pwdVisible ? (
                                        <IconButton
                                            h='1.75rem'
                                            size='sm'
                                            onClick={togglePwdVisibility}
                                            aria-label='Hide'
                                            icon='view-off'
                                        />
                                    ) : (
                                        <IconButton
                                            h='1.75rem'
                                            size='sm'
                                            onClick={togglePwdVisibility}
                                            aria-label='Show'
                                            icon='view'
                                        />
                                    )}
                                </InputRightElement>
                            </InputGroup>
                            {/* <FormErrorMessage>
                            La password deve essere lunga almeno 6 caratteri
                        </FormErrorMessage> */}
                        </FormControl>
                    </Stack>

                    <Button
                        variantColor='teal'
                        isLoading={loading}
                        type='submit'
                        onClick={() => {
                            setLoading(true);
                            login(loginData)
                                .then((user) => {
                                    if (appContext?.onLoggedIn != null) {
                                        appContext.onLoggedIn(user);
                                        setLoading(false);
                                    }
                                })
                                .catch(() => setLoading(false));
                        }}>
                        Login
                    </Button>
                    <Text p={3} fontSize='0.9em'>
                        Oppure <Link color='teal.500'>registrati</Link>
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

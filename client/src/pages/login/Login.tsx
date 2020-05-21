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
import { white, orange, orange_dark, orange_light, black } from '../../utils/colors';

export default function Login() {
    const appContext = React.useContext(AppContext);
    const [loginData, setLoginData] = React.useState<LoginData>({ username: '', password: '' });

    const [loading, setLoading] = React.useState<boolean>(false);
    const [pwdVisible, setPwdVisible] = React.useState<boolean>(false);

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setLoginData((curr) => ({ ...curr, [name]: value }));
        }
    };

    function togglePwdVisibility() {
        setPwdVisible(!pwdVisible);
    }

    const onLogin = React.useCallback(() => {
        setLoading(true);
        login(loginData)
            .then((user) => {
                setLoading(false);
                if (appContext?.onLoggedIn != null) {
                    appContext.onLoggedIn(user);
                }
            })
            .catch(() => setLoading(false));
    }, [appContext, loginData]);

    return (
        <StyledLoginContainer>
            <Stack spacing={'-70px'} width={['90%', '80%', '50%', '40%']} m='auto'>
                <Box
                    overflow='visible'
                    borderWidth='1px'
                    borderColor={orange_dark}
                    rounded='md'
                    w='90%'
                    h='100px'
                    m='auto'
                    bg={orange_light}
                    zIndex={1}>
                    <Heading
                        h='100%'
                        as='h1'
                        size='xl'
                        p='25px'
                        color={white}
                        verticalAlign='middle'
                        boxShadow={'0px 2px 5px' + orange_dark}>
                        Login
                    </Heading>
                </Box>
                <Box overflow='hidden' borderWidth='1px' rounded='md' pt='70px' bg={white}>
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
                        <FormControl>
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
                                    // onBlur={validatePwd}
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
                        bg={orange_light}
                        color={white}
                        isLoading={loading}
                        type='submit'
                        margin={3}
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
                        Accedi
                    </Button>
                    <Text p={5} fontSize='0.9em'>
                        Oppure <Link color={orange}>registrati</Link>
                    </Text>
                </Box>
            </Stack>
        </StyledLoginContainer>
    );
}

// TODO change vh to fix smart
const StyledLoginContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

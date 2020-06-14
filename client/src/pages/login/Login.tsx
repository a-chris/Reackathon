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
    Stack,
    Text,
} from '@chakra-ui/core';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { StyledCenteredContainer, StyledLabel } from '../../components/Common';
import OverlappedBoxes from '../../components/OverlappedBoxes';
import { login, LoginData } from '../../services/AuthService';
import colors from '../../utils/colors';

export default function Login() {
    const appContext = React.useContext(AppContext);
    const [loginData, setLoginData] = React.useState<LoginData>({ username: '', password: '' });

    const [loading, setLoading] = React.useState<boolean>(false);
    const [pwdVisible, setPwdVisible] = React.useState<boolean>(false);
    const [isLoginInvalid, setLoginInvalid] = React.useState<boolean>(false);

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setLoginData((curr) => ({ ...curr, [name]: value }));
            setLoginInvalid(false);
        }
    };

    function togglePwdVisibility() {
        setPwdVisible(!pwdVisible);
    }

    const onLogin = React.useCallback(() => {
        if (loginData.password == null || loginData.username == null) {
            setLoginInvalid(true);
        } else {
            setLoading(true);
            login(loginData)
                .then((user) => {
                    setLoading(false);
                    if (appContext?.onLoggedIn != null) {
                        appContext.onLoggedIn(user);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setLoginInvalid(true);
                });
        }
    }, [appContext, loginData]);

    return (
        <StyledCenteredContainer translateY='-40%'>
            <OverlappedBoxes
                mainStackStyle={{ width: ['90%', '80%', '50%', '40%'] }}
                removeDefaultPadding
                topBoxStyle={{ bg: colors.blue_night }}
                TopContent={() => (
                    <Heading
                        h='100%'
                        as='h1'
                        size='xl'
                        p='25px'
                        color={colors.white}
                        verticalAlign='middle'>
                        Login
                    </Heading>
                )}
                BottomContent={() => (
                    <Box>
                        <Stack spacing={3} p={8}>
                            <FormControl isInvalid={isLoginInvalid}>
                                <StyledLabel htmlFor='username'>Username</StyledLabel>
                                <InputGroup size='md'>
                                    <InputLeftElement children={<Icon name='spinner' />} />
                                    <Input
                                        type='text'
                                        placeholder='Username'
                                        defaultValue=''
                                        variant='flushed'
                                        name='username'
                                        id='username'
                                        onChange={onChangeValue}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl isInvalid={isLoginInvalid}>
                                <StyledLabel htmlFor='password'>Password</StyledLabel>
                                <InputGroup size='md'>
                                    <InputLeftElement children={<Icon name='lock' />} />
                                    <Input
                                        type={pwdVisible ? 'text' : 'password'}
                                        placeholder='Password'
                                        defaultValue=''
                                        pr='4.5rem'
                                        variant='flushed'
                                        name='password'
                                        id='password'
                                        onChange={onChangeValue}
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
                                <FormErrorMessage>Username o password non validi</FormErrorMessage>
                            </FormControl>
                        </Stack>

                        <Button
                            bg={colors.blue_night}
                            color={colors.white}
                            isLoading={loading}
                            type='submit'
                            margin={3}
                            onClick={onLogin}>
                            Accedi
                        </Button>
                        <Text p={5} fontSize='0.9em'>
                            Oppure{' '}
                            <Link to='/signup'>
                                <span style={{ color: colors.red }}>
                                    <b>registrati</b>
                                </span>
                            </Link>
                        </Text>
                    </Box>
                )}
            />
        </StyledCenteredContainer>
    );
}

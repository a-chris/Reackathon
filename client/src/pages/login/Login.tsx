import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Stack,
} from '@chakra-ui/core';
import React, { ChangeEvent } from 'react';
import { AppContext } from '../../App';
import { login, LoginData } from '../../services/LoginService';

export default function Login() {
    const appContext = React.useContext(AppContext);
    const [loginData, setLoginData] = React.useState<LoginData>({ username: '', password: '' });

    const [pwdVisible, setPwdVisible] = React.useState<boolean>(false);
    const [pwdError, setError] = React.useState<boolean>(false);

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event?.target;
        if (name != null && value != null) {
            setLoginData((curr) => ({ ...curr, [name]: value }));
        }
    };

    // TODO: only for signup
    // const validatePwd = (event: ChangeEvent<HTMLInputElement>) => {
    //     const { value } = event?.target;
    //     if (value.length > 0 && value.length < 6) {
    //         setError(true);
    //     } else {
    //         setError(false);
    //     }
    // };

    function togglePwdVisibility() {
        setPwdVisible(!pwdVisible);
    }

    console.log(loginData);

    return (
        <Stack spacing={'-70px'} width={['90%', '80%', '50%', '40%']} m='auto'>
            <Box
                overflow='visible'
                borderWidth='1px'
                rounded='md'
                w='90%'
                h='100px'
                m='auto'
                bg='#e91e63'
                zIndex={1}>
                Login
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
                                // onBlur={validatePwd}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={togglePwdVisibility}>
                                    {pwdVisible ? 'Nascondi' : 'Mostra'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                            La password deve essere lunga almeno 6 caratteri
                        </FormErrorMessage>
                    </FormControl>
                </Stack>
                <Button
                    variantColor='teal'
                    isLoading={false}
                    type='submit'
                    onClick={() => {
                        login(loginData).then((user) => {
                            if (appContext?.onLoggedIn != null) {
                                appContext.onLoggedIn(user);
                            }
                        });
                    }}>
                    Login
                </Button>
            </Box>
        </Stack>
    );
}

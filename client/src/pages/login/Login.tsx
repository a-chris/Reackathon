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

type ChangeElem = ChangeEvent<HTMLInputElement>;

export default function Login() {
    const appContext = React.useContext(AppContext);

    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [pwdVisible, setPwdVisible] = React.useState<boolean>(false);
    const [pwdError, setError] = React.useState<boolean>(false);

    React.useEffect(() => {
        setError(false);
    }, [password]);

    const setValue = (event: ChangeEvent<HTMLInputElement>, callback: Function) => {
        const value = event.target.value;
        callback(value);
    };

    const validatePwd = () => {
        if (password.length > 0 && password.length < 6) {
            setError(true);
        }
    };

    function togglePwdVisibility() {
        setPwdVisible(!pwdVisible);
    }

    console.log('login refreshed');

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
                                value={username}
                                variant='flushed'
                                onChange={(e: ChangeElem) => setValue(e, setUsername)}
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl isInvalid={pwdError}>
                        <InputGroup size='md'>
                            <InputLeftElement children={<Icon name='lock' />} />
                            <Input
                                type={pwdVisible ? 'text' : 'password'}
                                placeholder='Password'
                                value={password}
                                pr='4.5rem'
                                variant='flushed'
                                onChange={(e: ChangeElem) => setValue(e, setPassword)}
                                onBlur={validatePwd}
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
                        console.log('clicked');
                        if (appContext.onLogin != null) {
                            appContext.onLogin();
                        }
                    }}>
                    Login
                </Button>
            </Box>
        </Stack>
    );
}

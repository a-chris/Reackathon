import React, { useState, ChangeEvent, useEffect, useContext } from 'react';
import {
    Box,
    Stack,
    Input,
    InputRightElement,
    Button,
    InputGroup,
    InputLeftElement,
    Icon,
    FormControl,
    FormErrorMessage,
} from '@chakra-ui/core';
import { AuthContext } from '../App';


type ChangeElem = ChangeEvent<HTMLInputElement>;

export default function Login(): JSX.Element {
    const context = useContext(AuthContext)

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pwdVisible, setPwdVisible] = useState<boolean>(false);
    const [pwdError, setError] = useState<boolean>(false);

    const setValue = (event: ChangeElem, callback: Function) => {
        const value = event.target.value;
        callback(value);
    };

    useEffect(() => {
        setError(false);
    }, [password]);

    const validatePwd = () => {
        if (password.length > 0 && password.length < 6) {
            setError(true);
        }
    };

    function togglePwdVisibility() {
        setPwdVisible(!pwdVisible);
    }

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
                <Button variantColor='teal' isLoading={false} type='submit' >
                    Login
                </Button>
            </Box>
        </Stack>
    );
}

import React from 'react';
import { Box, Stack, Input } from '@chakra-ui/core';

export default function Login() {
    return (
        <Stack
            spacing={'-70px'}
            // p={100}
            width={[
                '90%',
                '80%',
                '50%',
                '40%',
            ]}
            m='auto'>
            <Box
                overflow='visible'
                borderWidth='1px'
                rounded='md'
                w='90%'
                h='100px'
                m='auto'
                bg='#e91e63'
                zIndex={1}>
                box sopra
            </Box>
            <Box overflow='hidden' borderWidth='1px' rounded='lg' pt='70px'>
                <Stack spacing={3} p={8}>
                    <Input variant='flushed' placeholder='Username' />
                    <Input variant='flushed' placeholder='Nome e cognome' />
                    {/* <InputLeftElement children={<Icon name="phone" color="gray.300" />} /> */}
                    <Input type='phone' variant='flushed' placeholder='Phone number' />
                </Stack>
            </Box>
        </Stack>
    );
}

import {
    Flex,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/core';
import React from 'react';
import { Logo } from '../../../components/Logo';
import colors from '../../../utils/colors';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignupModal(props: SignupModalProps) {
    return (
        <Modal size='xl' isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Logo />
                <ModalHeader>Ops, sembra che tu non sia iscritto a Reackathon!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex d='column' textAlign='center'>
                        <Logo />
                        <Text>
                            Per visualizzare il profilo di un altro utente è necessario registrarsi,
                            cosa aspetti?
                        </Text>
                        <Text>
                            <Link style={{ color: colors.red }} href='/signup'>
                                <b>registrati adesso</b>
                            </Link>{' '}
                            oppure{' '}
                            <Link style={{ color: colors.red }} href='/login'>
                                <b>accedi</b>
                            </Link>
                        </Text>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

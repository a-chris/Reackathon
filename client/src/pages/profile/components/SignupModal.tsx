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
import { BoxWithSpacedChildren } from '../../../components/Common';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignupModal(props: SignupModalProps) {
    return (
        <Modal size='xl' isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent w='90%'>
                <ModalHeader pt={10} textAlign='center'>
                    <Flex justifyContent='center'>
                        <Logo withLogoImage={true} />
                    </Flex>
                    <Text p={5} pl={8} pr={8} pt='20px'>
                        Ops, sembra che tu non sia iscritto a Reackathon!
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody p={5}>
                    <Flex d='column' textAlign='center'>
                        <BoxWithSpacedChildren space='20px'>
                            <Text pl={8} pr={8}>
                                Per visualizzare il profilo di un altro utente è necessario
                                registrarsi, cosa aspetti?
                            </Text>
                            <Text>
                                <Link style={{ color: colors.red }} href='/signup'>
                                    <b>Registrati adesso</b>
                                </Link>{' '}
                                oppure{' '}
                                <Link style={{ color: colors.red }} href='/login'>
                                    <b>accedi</b>
                                </Link>
                            </Text>
                        </BoxWithSpacedChildren>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

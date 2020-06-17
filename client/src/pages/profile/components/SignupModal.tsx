import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import colors from '../../../utils/colors';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignupModal(props: SignupModalProps) {
    console.log('TCL: SignupModal -> props', props);
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sembra che tu non sia iscritto a Reackathon!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>
                        Per visualizzare il profilo di un altro utente è necessario registrarsi,
                        cosa aspetti?
                    </Text>
                    <Link to='/signup'>
                        <span style={{ color: colors.red }}>
                            <b>registrati adesso</b>
                        </span>
                    </Link>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

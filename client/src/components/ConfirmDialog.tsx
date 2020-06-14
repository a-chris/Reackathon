import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/core';
import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    content?: string;
    onClose: () => void;
    onCancel?: () => void;
    onConfirm: () => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const cancelRef = React.useRef<HTMLElement>(null);

    return (
        <AlertDialog isOpen={props.isOpen} leastDestructiveRef={cancelRef} onClose={props.onClose}>
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    {props.title}
                </AlertDialogHeader>
                {props.content && <AlertDialogBody>{props.content}</AlertDialogBody>}
                <AlertDialogFooter>
                    <Button
                        variantColor='red'
                        ref={cancelRef}
                        onClick={props.onCancel || props.onClose}>
                        Annulla
                    </Button>
                    <Button
                        onClick={() => {
                            props.onConfirm();
                            props.onClose();
                        }}
                        ml={3}>
                        Conferma
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

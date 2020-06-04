import React from 'react';
import { Stack, Box, BoxProps, StackProps } from '@chakra-ui/core';
import { white, blue_night, gray } from '../utils/colors';

type Boxes = {
    TopContent: () => JSX.Element;
    BottomContent: () => JSX.Element;
    mainStackStyle?: StackProps;
    topBoxStyle?: BoxProps;
    bottomBoxStyle?: BoxProps;
};

export default function OverlappedBoxes(props: Boxes) {
    return (
        <Stack
            spacing='-70px'
            width={['90%', '80%', '50%', '40%']}
            m='auto'
            pt='5%'
            pb='5%'
            {...props.mainStackStyle}>
            <Box
                overflow='visible'
                borderWidth='1px'
                borderColor={blue_night}
                bg={white}
                rounded='md'
                w='90%'
                h='100px'
                minH='fit-content'
                m='auto'
                zIndex={1}
                {...props.topBoxStyle}>
                {props.TopContent()}
            </Box>
            <Box
                overflow='hidden'
                borderWidth='1px'
                rounded='md'
                pt='70px'
                bg={white}
                {...props.bottomBoxStyle}>
                {props.BottomContent()}
            </Box>
        </Stack>
    );
}

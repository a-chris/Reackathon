import { Box, BoxProps, Stack, StackProps } from '@chakra-ui/core';
import React from 'react';
import colors from '../utils/colors';

type Boxes = {
    TopContent: () => JSX.Element;
    BottomContent: () => JSX.Element;
    mainStackStyle?: StackProps;
    topBoxStyle?: BoxProps;
    bottomBoxStyle?: BoxProps;
    removeDefaultPadding?: boolean;
};

export default function OverlappedBoxes(props: Boxes) {
    return (
        <Stack
            spacing='-70px'
            width={['90%', '80%', '50%', '40%']}
            m='auto'
            {...(props.removeDefaultPadding ? {} : { pt: '5%', pb: '5%' })}
            {...props.mainStackStyle}>
            <Box
                overflow='visible'
                borderWidth='1px'
                borderColor={colors.black}
                bg={colors.white}
                rounded='md'
                w='90%'
                minH='fit-content'
                m='auto'
                zIndex={1}
                {...props.topBoxStyle}>
                {props.TopContent()}
            </Box>
            <Box
                overflow='hidden'
                borderWidth='3px'
                rounded='md'
                pt='70px'
                bg={colors.white}
                {...props.bottomBoxStyle}>
                {props.BottomContent()}
            </Box>
        </Stack>
    );
}

import React from 'react';
import { AppContext } from '../../AppContext';
import { BoxFullHeightAfterHeader } from '../../components/Common';
import { Heading, Flex, Button, Box } from '@chakra-ui/core';
import colors from '../../utils/colors';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const errorText = 'Ops, pagina non trovata.';
const TIMEOUT = 100;

export default function PageNotFound() {
    const appContext = React.useContext(AppContext);
    const [shownText, setShownText] = React.useState<string>('|');

    React.useEffect(() => {
        if (shownText.replace('|', '') !== errorText) {
            setTimeout(() => {
                setShownText((curr) => errorText.substr(0, curr.length) + '|');
            }, TIMEOUT);
        } else {
            setShownText(errorText);
        }
    }, [shownText]);

    const isLogged = appContext.state?.user != null;

    return (
        <BoxFullHeightAfterHeader isLogged={isLogged}>
            <StyledContainerWithBackground>
                <Flex alignItems='center' justify='center' minH='inherit'>
                    <Box textAlign='center'>
                        <Heading
                            as='h1'
                            size='2xl'
                            color={colors.white}
                            pb={5}
                            textShadow={`2px 1px 5px ${colors.black}`}>
                            {shownText}
                        </Heading>
                        <Link to='/'>
                            <Button
                                variant='outline'
                                color={colors.red}
                                borderColor={colors.red}
                                bg={colors.white}>
                                Torna alla home
                            </Button>
                        </Link>
                    </Box>
                </Flex>
            </StyledContainerWithBackground>
        </BoxFullHeightAfterHeader>
    );
}

const StyledContainerWithBackground = styled(Box).attrs({
    backgroundColor: colors.gray_smoke,
    backgroundImage: "url('./images/background/error.jpg')",
    w: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    h: '100%',
    minH: 'inherit',
    backgroundPosition: 'center',
})``;

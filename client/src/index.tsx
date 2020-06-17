import { ThemeProvider } from '@chakra-ui/core';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';
import axe from 'react-axe';
import ReactDOM from 'react-dom';
import App from './App';
import { customTheme } from './fonts/theme';
import './index.css';

if (process.env.NODE_ENV !== 'production') {
    axe(React, ReactDOM, 2000);
}

whyDidYouRender(React, {
    trackHooks: true,
    logOnDifferentValues: false,
    titleColor: 'green',
    diffNameColor: 'darkturquoise',
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={customTheme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

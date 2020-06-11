import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';
import axe from 'react-axe';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

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
        <App />,
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

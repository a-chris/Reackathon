import { CSSReset, theme, ThemeProvider } from '@chakra-ui/core';
import axios from 'axios';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { User } from './models/Models';
import Login from './pages/login/Login';
import { LOGIN_ACTION } from './utils/constants';

interface AppStore {
    state?: AppState;
    onLoggedIn?: (user: User) => void;
}

interface AppState {
    authRequest?: boolean;
    username?: string;
}

interface Action {
    type: LOGIN_ACTION;
    payload?: any;
}

/**
 * Debug
 */
axios.interceptors.request.use((request) => {
    console.log('Starting Request', request);
    return request;
});

axios.interceptors.response.use((response) => {
    console.log('Response:', response);
    return response;
});

export const AppContext = React.createContext<AppStore>({});

const reducer = (state: AppState, action: Action): AppState => {
    console.log('TCL: App -> state', state);
    console.log('TCL: App -> action', action);
    switch (action.type) {
        case LOGIN_ACTION.LOGIN_REQUEST:
            return { ...state };
        case LOGIN_ACTION.LOGGED_IN:
            return {
                ...state,
                username: action.payload,
            };
        case LOGIN_ACTION.LOGIN_FAIL:
            return {
                ...state,
                username: undefined,
            };
        default:
            return state;
    }
};

export default function App() {
    const [state, dispatch] = React.useReducer(reducer, {});

    const onLoggedIn = React.useCallback((user: User) => {
        dispatch({ type: LOGIN_ACTION.LOGGED_IN, payload: user });
    }, []);

    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <AppContext.Provider value={{ state, onLoggedIn }}>
                    <CSSReset />
                    <Router>
                        <Switch>
                            <Route exact path='/' render={() => <Login />} />
                            <Route path='/login' render={() => <div>Login</div>} />
                        </Switch>
                    </Router>
                </AppContext.Provider>
            </ThemeProvider>
        </div>
    );
}

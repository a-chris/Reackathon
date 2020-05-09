import { CSSReset, theme, ThemeProvider } from '@chakra-ui/core';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import { get } from './services/http';
import { LOGIN_ACTION } from './utils/constants';

interface AppStore {
    state?: AppState;
    dispatch?: React.Dispatch<Action>;
    onLogin?: () => void;
}

interface AppState {
    authRequest?: boolean;
    username?: string;
}

interface Action {
    type: LOGIN_ACTION;
    payload?: any;
}

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

    console.log('app refreshed');

    const onLogin = React.useCallback(() => {
        get('https://httpbin.org/get')
            .then((res: any) => dispatch({ type: LOGIN_ACTION.LOGGED_IN, payload: res }))
            .catch(() => dispatch({ type: LOGIN_ACTION.LOGIN_FAIL }));
    }, []);

    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <AppContext.Provider value={{ state, dispatch, onLogin }}>
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

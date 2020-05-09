import React, { useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core';
import Login from './user/Login';
import { loginActions } from './utils/constants';
import { get } from './utils/http';

interface AppStore {
    authRequest?: boolean;
    username?: string;
    dispatch?: React.Dispatch<Action>;
}

interface Action {
    type: loginActions;
    payload?: any;
}

interface LoginParams {
    username: string;
    password: string;
}

export const initialState = {
    authRequest: false,
};

export const AuthContext = React.createContext<AppStore>(initialState);

function App() {
    const [state, dispatch] = useReducer((state: AppStore, action: Action): AppStore => {
        switch (action.type) {
            case loginActions.LOGIN_REQUEST:
                get('https://httpbin.org/get')
                    .then((res: any) => dispatch({ type: loginActions.LOGGED_IN, payload: res }))
                    .catch(() => dispatch({ type: loginActions.LOGIN_FAIL }));
                return { ...state };
            case loginActions.LOGGED_IN:
                return {
                    ...state,
                    username: action.payload,
                };
            case loginActions.LOGIN_FAIL:
                return {
                    ...state,
                    username: undefined,
                };
        }
        return state;
    }, initialState);

    // function login(data: LoginParams) {
    //     dispatch({ type: loginActions.LOGIN_REQUEST });
    //     get('https://httpbin.org/get')
    //         .then((res: any) => dispatch({ type: loginActions.LOGGED_IN, payload: res }))
    //         .catch(() => dispatch({ type: loginActions.LOGIN_FAIL }));
    // }

    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <AuthContext.Provider value={state}>
                    <CSSReset />
                    <Router>
                        <Switch>
                            <Route exact path='/' render={() => <Login />} />
                            <Route path='/login' render={() => <div>Login</div>} />
                        </Switch>
                    </Router>
                </AuthContext.Provider>
            </ThemeProvider>
        </div>
    );
}

export default App;

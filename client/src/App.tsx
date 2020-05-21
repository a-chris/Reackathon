import { CSSReset, theme, ThemeProvider } from '@chakra-ui/core';
import axios from 'axios';
import React from 'react';
import { HashRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import './App.css';
import { User, UserRole } from './models/Models';
import PageNotFound from './pages/errors/PageNotFound';
import HackathonsList from './pages/hackathons/HackathonsList';
import Homepage from './pages/homepage/Homepage';
import Login from './pages/login/Login';
import OrganizationBoard from './pages/organization/OrganizationBoard';
import Signup from './pages/signup/Signup';
import { LOGIN_ACTION } from './utils/constants';
import HackathonDetail from './pages/hackathon/HackathonDetail';
import Header from './pages/login/Header';

interface AppStore {
    state?: AppState;
    onLoggedIn?: (user: User) => void;
}

interface AppState {
    authRequest?: boolean;
    username?: string;
    user?: User;
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
                user: action.payload,
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
                    <Header />
                    <HashRouter>
                        <Switch>
                            <Route exact path='/' component={Homepage} />
                            <RestrictedRoute
                                exact
                                path='/login'
                                component={Login}
                                user={state.user}
                            />
                            <RestrictedRoute
                                exact
                                path='/signup'
                                component={Signup}
                                user={state.user}
                            />
                            <RestrictedRoute
                                exact
                                path='/org'
                                component={OrganizationBoard}
                                user={state.user}
                                allowedFor={[UserRole.ORGANIZATION]}
                            />
                            <Route exact path='/hackathons' component={HackathonsList} />
                            <Route exact path='/hackathon/:id' component={HackathonDetail} />
                            <Route component={PageNotFound} />
                        </Switch>
                    </HashRouter>
                </AppContext.Provider>
            </ThemeProvider>
        </div>
    );
}

interface RestrictedRouteProps extends RouteProps {
    user?: User;
    allowedFor?: UserRole[];
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({ user, allowedFor, ...restOfProps }) => {
    let canRoute = false;
    if (user?.role != null && allowedFor != null) {
        canRoute = allowedFor.includes(user.role);
    } else if (user?.role == null && allowedFor == null) {
        canRoute = true;
    }
    const { component, ...rest } = restOfProps;
    return canRoute ? (
        <Route {...restOfProps} />
    ) : (
        <Route {...rest} render={() => <Redirect to='/' />} />
    );
};

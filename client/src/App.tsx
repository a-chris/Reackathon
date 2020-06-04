import { CSSReset, theme, ThemeProvider } from '@chakra-ui/core';
import axios from 'axios';
import React from 'react';
import { HashRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import './App.css';
import { reducer, AppContext } from './AppContext';
import { User, UserRole } from './models/Models';
import PageNotFound from './pages/errors/PageNotFound';
import HackathonsList from './pages/hackathons/HackathonsList';
import Homepage from './pages/homepage/Homepage';
import Login from './pages/login/Login';
import OrganizationBoard from './pages/organization/OrganizationBoard';
import Signup from './pages/signup/Signup';
import { LOGIN_ACTION } from './utils/constants';
import HackathonManagement from './pages/hackathon/HackathonManagement';
import Header from './pages/homepage/Header';
import { getUserInfo } from './services/LoginService';
import HackathonDetail from './pages/hackathon/HackathonDetail';
import Profile from './pages/profile/Profile';

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

export default function App() {
    const [state, dispatch] = React.useReducer(reducer, {});

    React.useEffect(() => {
        const loginInfo = localStorage.getItem('loginInfo');
        let username = null;
        if (loginInfo) {
            username = JSON.parse(loginInfo).username;
        }
        if (username) {
            getUserInfo(username)
                .then((user) => onLoggedIn(user))
                .catch(() => onLogout());
        }
    }, []);

    const onLoggedIn = React.useCallback((user: User) => {
        dispatch({ type: LOGIN_ACTION.LOGGED_IN, payload: user });
    }, []);

    const onLogout = React.useCallback(() => {
        dispatch({ type: LOGIN_ACTION.LOGOUT });
    }, []);

    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <AppContext.Provider value={{ state, onLoggedIn, onLogout }}>
                    <CSSReset />
                    <HashRouter>
                        <Header />
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
                            <RestrictedRoute
                                exact
                                path='/hackathons/create'
                                component={HackathonManagement}
                                user={state.user}
                                allowedFor={[UserRole.ORGANIZATION]}
                            />
                            <Route exact path='/hackathons/:id' component={HackathonDetail} />
                            <Route path='/hackathons' component={HackathonsList} />
                            <Route exact path='/profile' component={Profile} />
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

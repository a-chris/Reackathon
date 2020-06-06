import { CSSReset, theme, ThemeProvider } from '@chakra-ui/core';
import moment from 'moment';
import 'moment/locale/it';
import React from 'react';
import { HashRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import './App.css';
import { AppContext, reducer } from './AppContext';
import Header from './components/Header';
import './config/AxiosConfig';
import { User, UserRole } from './models/Models';
import PageNotFound from './pages/errors/PageNotFound';
import HackathonDetail from './pages/hackathon/HackathonDetail';
import HackathonManagement from './pages/hackathon/HackathonManagement';
import HackathonsList from './pages/hackathons/HackathonsList';
import Homepage from './pages/homepage/Homepage';
import Login from './pages/login/Login';
import OrganizationBoard from './pages/organization/OrganizationBoard';
import Profile from './pages/profile/Profile';
import Signup from './pages/signup/Signup';
import { getUserInfo } from './services/AuthService';
import { LOGIN_ACTION } from './utils/constants';

/*
 * Set moment language to italian for the whole application
 */
moment.locale('it');

export default function App() {
    const [state, dispatch] = React.useReducer(reducer, {});

    const onLoggedIn = React.useCallback((user: User) => {
        dispatch({ type: LOGIN_ACTION.LOGGED_IN, payload: user });
    }, []);

    const onLogout = React.useCallback(() => {
        dispatch({ type: LOGIN_ACTION.LOGOUT });
    }, []);

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
    }, [onLoggedIn, onLogout]);

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
                            <Route exact path='/profile/:username' component={Profile} />
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

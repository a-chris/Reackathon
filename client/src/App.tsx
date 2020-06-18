import { CSSReset, useToast } from '@chakra-ui/core';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/it';
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { HashRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
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
import Ranking from './pages/ranking/Ranking';
import Signup from './pages/signup/Signup';
import { getLocalUser } from './services/UserService';
import socketClient from './socket/socket';
import SocketEvent from './socket/SocketEvent';
import { LOGIN_ACTION } from './utils/constants';

/*
 * Set moment language to italian for the whole application
 */
moment.locale('it');

export default function App() {
    const [state, dispatch] = React.useReducer(reducer, {});
    const toast = useToast();
    console.log('TCL: App -> state', state);

    React.useEffect(() => {
        if (state.user == null) {
            if (socketClient?.connected) {
                socketClient?.disconnect();
            }
            return;
        }
        socketClient.open();
        socketClient.on('connect', () => {
            console.log('SOCKET CONNECTED');
            if (state.user != null) {
                socketClient.emit('join_room', state.user.username);
                console.log('TCL: App -> join_room');
            }
        });
        if (state.user.role === 'ORGANIZATION') {
            socketClient.on(SocketEvent.NEW_ATTENDANT, (data: any) => {
                toast({
                    position: 'bottom-right',
                    title: data?.hackathonName != null ? `${data.hackathonName}` : 'Nuova notifica',
                    description: 'Un nuovo utente si è iscritto.',
                    status: 'success',
                    isClosable: true,
                });
            });
        }
        return () => {
            socketClient.disconnect();
        };
    }, [state.user, toast]);

    axios.interceptors.response.use((response) => {
        if (response.status === 500) {
            toast({
                position: 'bottom-right',
                title: 'Sembra ci sia stato un problema',
                status: 'error',
                isClosable: true,
            });
        }
        return response;
    });

    const onLoggedIn = React.useCallback((user: User) => {
        dispatch({ type: LOGIN_ACTION.LOGGED_IN, payload: user });
    }, []);

    const onLogout = React.useCallback(() => {
        dispatch({ type: LOGIN_ACTION.LOGOUT });
    }, []);

    React.useEffect(() => {
        const localUser = getLocalUser();
        if (localUser != null) {
            onLoggedIn(localUser);
        } else {
            onLogout();
        }
    }, [onLoggedIn, onLogout]);

    const onAcceptCookie = React.useCallback(() => {
        localStorage.setItem('cookie', 'true');
    }, []);

    const cookieAccepted = localStorage.getItem('cookie') === 'true';

    return (
        <div className='App'>
            {!cookieAccepted && (
                <CookieConsent debug={true} buttonText='Ho capito' onAccept={onAcceptCookie}>
                    Questo sito utilizza i cookie per migliorare l'esperienza utente.
                </CookieConsent>
            )}

            <div role='main'>
                <AppContext.Provider value={{ state, onLoggedIn, onLogout }}>
                    <CSSReset />
                    <HashRouter>
                        <Header />
                        <Switch>
                            <Route exact path='/' component={Homepage} />
                            <RestrictedRoute exact path='/login' component={Login} />
                            <RestrictedRoute exact path='/signup' component={Signup} />
                            <RestrictedRoute
                                exact
                                path='/org'
                                component={OrganizationBoard}
                                allowedFor={[UserRole.ORGANIZATION]}
                            />
                            <RestrictedRoute
                                exact
                                path='/hackathons/create'
                                component={HackathonManagement}
                                allowedFor={[UserRole.ORGANIZATION]}
                            />
                            <RestrictedRoute
                                exact
                                path='/hackathons/update/:id'
                                component={HackathonManagement}
                                allowedFor={[UserRole.ORGANIZATION]}
                            />
                            <Route exact path='/hackathons/:id' component={HackathonDetail} />
                            <Route path='/hackathons' component={HackathonsList} />
                            <Route exact path='/profile/:username' component={Profile} />
                            <Route exact path='/ranking' component={Ranking} />
                            <Route component={PageNotFound} />
                        </Switch>
                    </HashRouter>
                </AppContext.Provider>
            </div>
        </div>
    );
}
App.whyDidYouRender = true;

interface RestrictedRouteProps extends RouteProps {
    allowedFor?: UserRole[];
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({ allowedFor, ...restOfProps }) => {
    const user = getLocalUser();
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

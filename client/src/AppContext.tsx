import React from 'react';
import { User } from './models/Models';
import { setLocalUser } from './services/UserService';
import socketClient from './socket/socket';
import { LOGIN_ACTION } from './utils/constants';

export interface AppStore {
    state?: AppState;
    onLoggedIn?: (user: User) => void;
    onLogout?: () => void;
}

export interface AppState {
    user?: User;
}

export interface Action {
    type: LOGIN_ACTION;
    payload?: any;
}

export const AppContext = React.createContext<AppStore>({});

export const reducer = (state: AppState, action: Action): AppState => {
    if (process.env.NODE_ENV === 'development') {
        console.log('TCL: App -> state', state);
        console.log('TCL: App -> action', action);
    }
    switch (action.type) {
        case LOGIN_ACTION.LOGIN_REQUEST:
            return { ...state };
        case LOGIN_ACTION.LOGGED_IN:
            setLocalUser(action.payload);
            return {
                ...state,
                user: action.payload,
            };
        case LOGIN_ACTION.LOGIN_FAIL:
            setLocalUser(null);
            return {
                ...state,
                user: undefined,
            };
        case LOGIN_ACTION.LOGOUT:
            socketClient.disconnect();
            setLocalUser(null);
            return {
                ...state,
                user: undefined,
            };
        default:
            return state;
    }
};

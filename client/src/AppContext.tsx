import React from 'react';
import { LOGIN_ACTION } from './utils/constants';
import { User } from './models/Models';

export interface AppStore {
    state?: AppState;
    onLoggedIn?: (user: User) => void;
    onLogout?: () => void;
}

export interface AppState {
    authRequest?: boolean;
    username?: string;
    user?: User;
}

export interface Action {
    type: LOGIN_ACTION;
    payload?: any;
}

export const AppContext = React.createContext<AppStore>({});

export const reducer = (state: AppState, action: Action): AppState => {
    console.log('TCL: App -> state', state);
    console.log('TCL: App -> action', action);
    switch (action.type) {
        case LOGIN_ACTION.LOGIN_REQUEST:
            return { ...state };
        case LOGIN_ACTION.LOGGED_IN:
            localStorage.setItem(
                'loginInfo',
                JSON.stringify({ username: action.payload.username })
            );
            return {
                ...state,
                user: action.payload,
            };
        case LOGIN_ACTION.LOGIN_FAIL:
            localStorage.removeItem('loginInfo');
            return {
                ...state,
                user: undefined,
            };
        case LOGIN_ACTION.LOGOUT:
            localStorage.removeItem('loginInfo');
            return {
                ...state,
                user: undefined,
            };
        default:
            return state;
    }
};

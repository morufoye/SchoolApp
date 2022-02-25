import {useMutation} from '@apollo/client';
import PropTypes from 'prop-types';
import React, {createContext, useContext, useReducer} from 'react';
import * as resolvers from '../service/api';
import {useIdleTimer} from "react-idle-timer";
import {removeItem, saveState, setItem} from "../service/local-storage"

export const AuthContext = createContext();

export const MODAL_MODES = {
    ADD: 'add',
    EDIT: 'edit',
    CONFIRM_DELETE: 'confirm_delete',
};

const initialState = {
    MODAL_MODES,
    serverErrors: null,
    modalMode: null,
    showFormModal: false,
    successMessage: '',
    authDat: null,
    authError: null,
    isLoading: true,
    isLoaded: false,
    isLoggedIn: false,
    isAdmin: false,
    token: '',
    currentUser: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_MODAL_MODE': {
            return {...state, modalMode: action.payload};
        }
        case 'SET_FORM_MODAL': {
            return {...state, showFormModal: action.payload};
        }
        case 'SET_CURRENT_USER':
            return {...state, ...action.payload};
        case 'SET_SUCCESS_MESSAGE':
            return {...state, successMessage: action.payload};
        case 'SET_ERROR': {
            console.log("action.payload", action.payload)
            return {...state, serverErrors: action.payload};
        }
        case 'RESET': {
            return initialState;
        }
        default:
            throw new Error('Invalid action');
    }
};

function AuthProvider(props) {
    console.log("props", props)

    const { children } = props
    const [state, dispatch] = useReducer(reducer, initialState);

    const idleTimeout = 30 * 60000 //30min

    let idleTimeoutChecker;
    const {getLastActiveTime} = useIdleTimer({
        idleTimeout,
    });

    const setError = (type, payload) => {
        dispatch({
            type: 'SET_ERROR',
            payload,
        });
    };

    const setData = (type, payload) => {
        dispatch({
            type,
            payload,
        });
    };

    const resetState = () => {
        setData('RESET');
    };

    // If user is logged in, logout after 30 minutes of inactivity
    // useEffect(() => {
    //     const { isLoggedIn } = state;
    //     if (!isLoggedIn) {
    //         idleTimeoutChecker = undefined;
    //         return;
    //     }
    //
    //     if (idleTimeoutChecker) {
    //         return;
    //     }
    //
    //     idleTimeoutChecker = setInterval(() => {
    //         const elapsed = new Date().getTime() - getLastActiveTime();
    //
    //         if (elapsed >= idleTimeout) {
    //             logout();
    //             const history = useHistory();
    //             history.replace('/');
    //         }
    //     }, 10000);
    // });

    // Login User
    const [login] = useMutation(
        resolvers.LOGIN,
        {
            onError: (requestError) => {
                setError(
                    'SET_ERROR',
                    requestError?.message ?? 'Unknown Error.',
                );
            },
            onCompleted: (loginResponse) => {
                if (loginResponse?.login) {
                    const {user, accessToken} = loginResponse?.login;
                    setItem("currentUser", user)
                    setItem("token", accessToken)
                    saveState(state)
                    setData('SET_CURRENT_USER', {
                        currentUser: user, token: accessToken,
                        isLoggedIn: true, isLoading: false,
                        isLoaded: true,
                    });
                }
            },
        },
    );

    // Register User
    const [createUser] = useMutation(
        resolvers.REGISTER,
        {
            onError: (requestError) => {
                console.log("requestError", requestError)
                setError(
                    'SET_ERROR',
                    requestError?.message ?? 'Unknown Error.',
                );
            },
            onCompleted: (registerResponse) => {
                if (registerResponse?.createUser) {
                    const {user, errors} = registerResponse?.createUser;
                    if(errors?.length) {
                        console.log("errors[0].message", errors)
                        setError(
                            'SET_ERROR',
                            errors[0]?.message ?? 'Unknown Error.',
                        );
                    } else {
                        setItem("currentUser", user)
                        setData('SET_CURRENT_USER', {
                            isLoading: false,
                            accessToken: true,
                            serverErrors: null,
                        });
                    }
                }
            },
        },
    );

    const logout = () => {
        try {
            removeItem('token');
            removeItem('state');
            removeItem('currentUser');
            //  Auth.signOut();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('Error signout', e);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                setData,
                setError,
                resetState,
                login,
                createUser,
                logout,
                ...props,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

AuthProvider.propTypes = {
    children: PropTypes.element.isRequired,
};

// Custom hook that shorthands the context!
export const useCurrentUser = () => useContext(AuthContext);


// import { gql, useLazyQuery, useMutation } from '@apollo/client';
// import PropTypes from 'prop-types';
// import React, { createContext, useEffect, useState } from 'react';
// import { useIdleTimer } from 'react-idle-timer';
// import { useHistory } from 'react-router-dom';
// import {
//     currentAuthenticatedUser,
//     getToken,
//     logout,
//     login,
// } from "../service/auth-service";
// import * as resolvers from '../service/api';
//
//
// export const CURRENT_USER = gql`
//     query Me {
//         me {
//             id
//             email
//             firstName
//             lastName
//         }
//     }
// `;
//
// export const UserContext = createContext();
//
// export default function UserProvider({ children }) {
//     const [authDat, setAuthDat] = useState(null);
//     const [authError, setAuthError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isLoaded, setIsLoaded] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//
//     const idleTimeout = 30 * 60000 //30min
//
//     let idleTimeoutChecker;
//     const { getLastActiveTime } = useIdleTimer({
//         idleTimeout,
//     });
//
//     const [getMe, { data }] = useLazyQuery(CURRENT_USER, {
//         onError(error) {
//             const unauthenticatedError = error?.graphQLErrors?.find(
//                 (e) => e.extensions?.code === 'UNAUTHENTICATED',
//             );
//             if (unauthenticatedError) {
//                 setAuthError({ error: error.message, code: 'UNAUTHENTICATED' });
//                 setIsLoading(false);
//             }
//         },
//     });
//
//     const [login] = useMutation(
//         resolvers.LOGIN,
//         {
//             onError: (requestError) => {
//                 setError(
//                     'ADD_EQUIPMENT_ASSOCIATION',
//                     requestError.message ?? 'Unknown Error.',
//                 );
//             },
//             onCompleted: () => {
//                 refetch();
//                 setData('SET_FORM_MODAL', false);
//                 setError('ADD_EQUIPMENT_ASSOCIATION', '');
//             },
//         },
//     );
//
//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const oAuthData = await currentAuthenticatedUser();
//                 setAuthDat(oAuthData);
//                 setCurrentUser(oAuthData);
//                 setIsAdmin(oAuthData?.roles?.indexOf('ADMIN') >= 0);
//             } catch (err) {
//                 setAuthError({ error: err.message, code: 'NOSESSION' });
//                 setIsLoading(false);
//             }
//         };
//         checkAuth();
//     }, []);
//
//     // Auth provider has successfully authenticated user.
//     // Go grab user profile. // Me/
//     useEffect(() => {
//         if (authDat?.id) {
//             getMe();
//         }
//     }, [authDat, getMe]);
//
//     // Upon successful load of /Me set it to the context state (currentUser)
//     useEffect(() => {
//         if (!data?.me) return;
//         // Remove schema name (GraphQL specific)
//         const { __typename, ...rest } = data.me;
//
//         // Merge oAuth data with profile data.
//         setCurrentUser((preVal) => ({ ...preVal, ...rest }));
//         setIsLoggedIn(true);
//         setIsLoaded(true);
//         setIsLoading(false);
//     }, [data]);
//
//     // If user is logged in, logout after 30 minutes of inactivity
//     // useEffect(() => {
//     //     if (!isLoggedIn) {
//     //         idleTimeoutChecker = undefined;
//     //         return;
//     //     }
//     //
//     //     if (idleTimeoutChecker) {
//     //         return;
//     //     }
//     //
//     //     idleTimeoutChecker = setInterval(() => {
//     //         const elapsed = new Date().getTime() - getLastActiveTime();
//     //
//     //         if (elapsed >= idleTimeout) {
//     //             logout();
//     //             const history = useHistory();
//     //             history.replace('/');
//     //         }
//     //     }, 10000);
//     // });
//
//     return (
//         <UserContext.Provider
//             value={{
//                 isLoaded,
//                 isLoggedIn,
//                 isLoading,
//                 authError,
//                 isAdmin,
//                 currentUser,
//                 logout,
//                 getToken,
//                 login,
//             }}
//         >
//             {children}
//         </UserContext.Provider>
//     );
// }
//
// UserProvider.propTypes = {
//     children: PropTypes.element.isRequired,
// };

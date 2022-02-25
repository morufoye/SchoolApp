// import localStorage from './local-storage';
// const { removeItem, setItem } = localStorage;
// import jwt from 'jwt-decode' // import dependency
//
//
// const formUserObject = (authResp) => {
//    // const { payload } = authResp.signInUserSession.idToken;
//     const token = authResp.data.token;
//     const payload = jwt(token); // decode your token here
//     //localStorage.setItem('token', token);
//
//     return {
//         id,
//         email: payload.email,
//         name: `${payload.firstName} ${payload.lastName}`,
//         roles: payload['linkedEntities']["roles"],
//         token,
//     };
// };
//
// export const currentAuthenticatedUser = async () => {
//     try {
//       //  return formUserObject(loggedInUser);
//     } catch (err) {
//         console.log('Error : ', err);
//         throw new Error('Error on get current user (currentAuthenticatedUser)');
//     }
// };
//
// /**
//  * @deprecated Will get deprecated in next version (2.0)
//  * Will be deleted in version 3.0.
//  * @param {*} redirectProps
//  * @returns User object
//  */
// export const checkLogin = async (redirectProps) => {
//     window.LOG_LEVEL = 'DEBUG';
//     try {
//        // const loggedInUser = await Auth.currentAuthenticatedUser();
//        // return formUserObject(loggedInUser);
//     } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log('Error on get current user (checkLogin)', e);
//     }
//
//     // if (redirectProps && redirectProps !== null) {
//     //     setItem('redirectProps', redirectProps);
//     // }
//     try {
//       //  await Auth.federatedSignIn(federationConfig);
//     } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log('Error logging in (checkLogin)', e);
//     }
//
//     return undefined;
// };
//
// export const logout = () => {
//     try {
//         removeItem('redirectProps');
//       //  Auth.signOut();
//     } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log('Error signout', e);
//     }
// };
//
// export const login = async (provider) => {
//     try {
//        // await Auth.federatedSignIn({provider});
//        // return await Auth.currentAuthenticatedUser();
//     } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log('Error sign in', e);
//         throw e;
//     }
// };
//
//
// export const getToken = async () => {
//    // const session = await Auth.currentSession();
//   //  return session.accessToken.jwtToken;
// };
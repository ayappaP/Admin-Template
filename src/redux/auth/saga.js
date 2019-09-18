
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER
} from '../actions';

import {
    loginUserSuccess,
    registerUserSuccess
} from './actions';
import { Auth } from 'aws-amplify';
import { NotificationManager } from "../../components/common/react-notifications";


const createNotification = (msg, req) => {
    NotificationManager.primary(
        req,
        msg,
        5000,
        null,
        null,
    );
}

const loginWithEmailPasswordAsync = async (email, password) =>
    await Auth.signIn({
        username: email,
        password
    })
        .then((res) => res)
        .catch((err) => err)

const loginWithNewPasswordAsync = async (confirmUser, newPass) =>
    await Auth.completeNewPassword(
        confirmUser,
        newPass
    )
        .then((user) => user)
        .catch((err) => err)


function* loginWithEmailPassword({ payload }) {
    const { email, password, newPass } = payload.user;
    // we're getting email, password from login page & email, password , newPass from register page 
    // both the pages has same function - loginWithEmailPassword
    const { history } = payload;
    if (!newPass) {       // if newPass (new password ) is not present - normal login flow 
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (loginUser.code == "NotAuthorizedException") {
            createNotification('Invalid Email or Password', 'Enter valid email and password')
        }
        if (loginUser.challengeName == "NEW_PASSWORD_REQUIRED") {
            createNotification('You are login first time', 'Enter your email, temporary password and new password')
            history.history.push('/user/register');
        }
        if (loginUser.attributes.sub) {
            localStorage.setItem('user_id', loginUser.attributes.sub);
            yield put(loginUserSuccess(loginUser));
            createNotification('Success', 'Login completed successfully')
            history.history.push('/app/orders');
        } else {
            console.log('login failed :', loginUser)
        }
    } else {     // if newPass is present - new password login flow
        const confirmUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (confirmUser.message == 'Incorrect username or password.') {
            createNotification('Enter valid Temporary password', 'Temporary password is incorrect')
        } else {
            const user = yield call(loginWithNewPasswordAsync, confirmUser, newPass);
            if (user.code == 'InvalidPasswordException') {
                createNotification('New password does not valid', 'Enter a new password with atleast one capital letter, small letter, numbers and symbols')
            } else {
                createNotification('New password updated successfully', 'Login again with your new password')
                history.history.push('/user/login');
            }
        }

    }
}

const registerWithEmailPasswordAsync = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

function* registerWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload
    try {
        const registerUser = yield call(registerWithEmailPasswordAsync, email, password);
        if (!registerUser.message) {
            localStorage.setItem('user_id', registerUser.user.uid);
            yield put(registerUserSuccess(registerUser));
            history.push('/')
        } else {
            console.log('register failed :', registerUser.message)
        }
    } catch (error) {
        console.log('register error : ', error)
    }
}



const logoutAsync = async (history) => {
    await auth.signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
}

function* logout({ payload }) {
    const { history } = payload
    try {
        yield call(logoutAsync, history);
        localStorage.removeItem('user_id');
    } catch (error) {
    }
}



export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}


export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser)
    ]);
}

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
import { ConsoleLogger } from '@aws-amplify/core';


const createNotification = (msg, req) => {
    NotificationManager.primary(
        req,
        msg,
        5000,
        null,
        null,
    );
}

const loginWithEmailPasswordAsync = async (user, code) =>
    await Auth.confirmSignIn(user, code)
        .then((res) => res)
        .catch((err) => err)

const loginWithNewPasswordAsync = async (confirmUser) =>
    await Auth.completeNewPassword(
        confirmUser,
        'Arokiya@123'
    )
        .then((user) => user)
        .catch((err) => err)



function* loginWithEmailPassword({ payload }) {
    // console.log(payload)
    const { user, code } = payload;
    // const { phone, password } = payload.user;
    const { history } = payload;
    const confirmUser = yield call(loginWithEmailPasswordAsync, user, code);
    // console.log("confirmUser",confirmUser)
    if (confirmUser.code == "CodeMismatchException") {
        createNotification('Code Invalid', 'Enter valid OTP')
    } else if (confirmUser) {
        createNotification("Success", 'Login completed')
        localStorage.setItem('role', confirmUser.signInUserSession.idToken.payload["custom:role"])
        localStorage.setItem('user', confirmUser);
        yield put(loginUserSuccess(confirmUser));
        setTimeout(()=>{
            history.history.push('/');
            window.location.reload()
        },2000)
    }

    // payload.setUser(confirmUser)
    // payload.setOtp(true)
    // if(confirmUser.challengeName == "NEW_PASSWORD_REQUIRED")
    // {
    //     const loginUser = yield call(loginWithNewPasswordAsync, confirmUser);
    //     console.log(loginUser)
    //     history.history.push('/user/forgot-password')
    // }

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
    // await auth.signOut().then(authUser => authUser).catch(error => error);
    // history.push('/')
    Auth.signOut().then(() => {
        localStorage.clear()
        createNotification('User logged out successfully', 'Login again to show orders page')
        this.props.history.push("/user/login")
    }).catch(console.log);

}

function* logout({ payload }) {
    const { history } = payload
    try {
        yield call(logoutAsync, history);
        // localStorage.removeItem('user_id');
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
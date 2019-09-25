import React, { Component, useState } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Formik } from 'formik'

import { loginUser } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

import { Auth } from 'aws-amplify'
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


const UserLogin = (values, props, setOtp, setUser) => {
  // props.loginUser(values, props, setOtp, setUser)
  const { phone, password } = values;
  createNotification('Enter OTP')
  Auth.signIn({
    username: phone,
    password
  })
    .then((user) => {
      console.log(user)
      setOtp(true)
      setUser(user)
    })
    .catch((err) => console.log(err))
}


const confirmSignIn = ({ code }, props, user) => {
  // console.log(user)
  // console.log(code)
  props.loginUser( user, code, props )
  // Auth.confirmSignIn(user, code)
  //   .then((res) => {
  //     console.log(res)
  //     setOtp(false)
  //   })
  //   .catch((err) => console.log(err))
}

// const { phone, password } = values
// console.log(values)
// Auth.signIn({
//   username: phone,
//   password
// })
//   .then((user) => {
//     console.log(user)
//     // if (user.challengeName == "NEW_PASSWORD_REQUIRED") {
//     //   createNotification('User not confirmed', 'Enter Phone number & temporary password')
//     //   props.history.push('/user/register')
//     // }

//   })
//   .catch((err) => {
//     console.log('err', err)
//     if (err.code == "UserNotFoundException") {
//       createNotification('User not found', 'Create user')
//     } else if (err.code == "NotAuthorizedException"){
//       createNotification('User initial login', 'Enter temporary password')
//       props.history.push('/user/register')
//     }
//   })



const Login = (props) => {
  const [otp, setOtp] = useState(false)
  const [user, setUser] = useState([])
  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
            <p className="white mb-0">
              Please use your credentials to login.
                <br />
              If you are not a member, please{" "}
              <NavLink to={`/user/register`} className="white">
                register
                </NavLink>
              .
              </p>
          </div>
          <div className="form-side">
            <NavLink to={`/`} className="white">
              <span className="logo-single" />
            </NavLink>
            <CardTitle className="mb-4">
              <IntlMessages id="user.login-title" />
            </CardTitle>

            {!otp ?
              (<Formik id="signin" initialValues={{ phone: '', password: 'Arokiya@123' }} onSubmit={(val) => UserLogin(val, props, setOtp, setUser)}>
                {props => (
                  <Form onSubmit={props.handleSubmit}>
                    <Label className="form-group has-float-label mb-4">
                      <Input required name='phone' type="tel" onChange={props.handleChange} value={props.values.phone} />
                      <IntlMessages id="user.phone" />
                    </Label>

                    <div className="d-flex justify-content-between align-items-center">
                      {/* <Button
                        type='button'
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                        onClick={() => this.props.history.push('/user/register')}
                      >
                        <IntlMessages id="user.create-super" />
                      </Button> */}
                      <Button
                        type='submit'
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                      >
                        <IntlMessages id="user.login-otp" />
                      </Button>
                    </div>
                  </Form>
                )}</Formik>)
              :
              (<Formik id="otp" initialValues={{ code: '' }} onSubmit={(val) => confirmSignIn(val, props, user)} >
                {props =>
                  <Form onSubmit={props.handleSubmit}>
                    <Label className="form-group has-float-label mb-4">
                      <Input required name='code' type="text" onChange={props.handleChange} value={props.values.code} />
                      <IntlMessages id="user.otp" />
                    </Label>
                    <div className="d-flex justify-content-between align-items-center">
                      {/* <Button
                        type='button'
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                        onClick={() => this.props.history.push('/user/register')}
                      >
                        <IntlMessages id="user.create-super" />
                      </Button> */}
                      <Button
                        type='submit'
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                      >
                        <IntlMessages id="user.login-title" />
                      </Button>
                    </div>

                  </Form>}
              </Formik>)}
          </div>
        </Card>
      </Colxx>
    </Row>
  );
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(
  mapStateToProps,
  {
    loginUser
  }
)(Login);

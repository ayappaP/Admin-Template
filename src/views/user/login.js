import React, { Component, useState } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Formik } from 'formik'

import { loginUser } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

import { Auth } from 'aws-amplify'


const UserLogin = (values, props) => {
  props.loginUser(values, props)
}


const Login = (props) => {
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

            <Formik initialValues={{ email: '', password: '' }} onSubmit={(val) => UserLogin(val, props)}>
              {props => (
                <Form onSubmit={props.handleSubmit}>
                  <Label className="form-group has-float-label mb-4">
                    <Input required name='email' type="email" onChange={props.handleChange} value={props.values.email} />
                    <IntlMessages id="user.email" />
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    <Input required name='password' type="password" onChange={props.handleChange} value={props.values.password} />
                    <IntlMessages
                      id="user.password"
                    />
                  </Label>
                  <div className="d-flex justify-content-between align-items-center">
                    <NavLink to={`/user/forgot-password`}>
                      <IntlMessages id="user.forgot-password-question" />
                    </NavLink>
                    <Button
                      type='submit'
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      <IntlMessages id="user.login-button" />
                    </Button>
                  </div>
                </Form>
              )}</Formik>
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

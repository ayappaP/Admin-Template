import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../../redux/actions";

import { Formik } from 'formik';
import { Auth } from 'aws-amplify'


import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";


const setDetails = (values, props) => {
  props.loginUser(values, props)
}


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: ""
    };
  }

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
              <p className="white mb-0">
                Please use this form to register. <br />
                If you are a member, please{" "}
                <NavLink to={`/user/login`} className="white">
                  login
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.set-new-password" />
              </CardTitle>
              <Formik initialValues={{ email: '', password: '', newPass: '' }}
                onSubmit={(val) => setDetails(val, this.props)}>
                {props =>
                  <Form onSubmit={props.handleSubmit}>
                    <Label className="form-group has-float-label mb-4">
                      <Input required type="email" name='email' onChange={props.handleChange} value={props.values.email} />
                      <IntlMessages id="user.email" />
                    </Label>
                    <Label className="form-group has-float-label mb-4">
                      <Input required type="password" name='password' onChange={props.handleChange} value={props.values.password} />
                      <IntlMessages
                        id="user.temp-password"
                      />
                    </Label>

                    <Label className="form-group has-float-label mb-4">
                      <Input required type="password" name='newPass' onChange={props.handleChange} value={props.values.newPass} />
                      <IntlMessages
                        id="user.new-password"
                      />
                    </Label>
                    <div className="d-flex justify-content-end align-items-center">
                      <Button
                        type='submit'
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                      >
                        <IntlMessages id="user.next-button" />
                      </Button>
                    </div>
                  </Form>
                }</Formik>

            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
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
)(Register);

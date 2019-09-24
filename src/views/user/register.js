import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../../redux/actions";

import { Formik, setNestedObjectValues } from 'formik';
import { Auth } from 'aws-amplify'

import {
  FormikReactSelect,
} from "../../containers/form-validations/FormikFields";
import {
  CardBody,
  FormGroup,
  CustomInput
} from "reactstrap";
import Dropdown from "react-dropdown";
import Select from "react-select";
import client from "../../queries/client";
import fetchShops from "../../queries/fetchShops";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
// import { listenerCount } from "cluster";
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


const setDetails = (values, props) => {
  // props.loginUser(values, props)
  const { phone, password, shop } = values
  Auth.signUp({
    username: phone,
    password,
    attributes: {
      'custom:shopName': shop.label,
      'custom:shopId': shop.value,
    }
  })
    .then((user) => {
      // console.log(user)
      localStorage.setItem('phone', phone)
      createNotification('Super admin created', 'Login with your OTP')
      props.history.push('/user/login')
    })
    .catch((err) => console.log(err))
}


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      shopName: []
    };
  }


  componentDidMount() {
    this.fetchShops();
  }

  fetchShops = () => {
    const query = fetchShops();
    client(query)
      .then(res => {
        // console.log("add user shops", res.data.shop);
        this.setState({ shopName: res.data.shop });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { shopName } = this.state
    const listShop = shopName.map(shop => ({
      value: shop.id,
      label: shop.shopName
    }));
    // console.log(listShop)
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
                <IntlMessages id="user.set-new-super-admin" />
              </CardTitle>
              <Formik initialValues={{ phone: '', password: 'Arokiya@123', shop: [] }}
                onSubmit={(val) =>
                  // console.log(val)
                  setDetails(val, this.props)
                }>
                {props =>
                  <Form onSubmit={props.handleSubmit}>
                    <Label className="form-group has-float-label mb-4">
                      <Input required type="text" name='phone' onChange={props.handleChange} value={props.values.phone} />
                      <IntlMessages id="user.phone" />
                    </Label>
                    <Label className="form-group has-float-label mb-4">
                      <Select
                        components={{ Input: CustomSelectInput }}
                        className="react-select"
                        classNamePrefix="react-select"
                        value={props.values.shop}
                        name="shop"
                        id='shop'
                        onChange={(e) => props.setFieldValue('shop', e)}
                        options={listShop}
                      >{

                        }
                      </Select>
                    </Label>
                    {/* <Label className="form-group has-float-label mb-4">
                      <IntlMessages id="pages.shopName" />
                      <Dropdown
                        name="shop"
                        options={listShop}
                        value={props.values.shop}
                        onChange={props.handleChange}
                        placeholder="Select Shop"
                      /></Label>
                    <Label className="form-group has-float-label mb-4">
                      <IntlMessages id="pages.shopId" />

                      <Input name="shopId" disabled
                      // value={selectValue}
                      /></Label> */}

                    {/* <Label className="form-group has-float-label mb-4">
                      <Input required type="password" name='tempPass' onChange={props.handleChange} value={props.values.tempPass} />
                      <IntlMessages id="pages.user-password" />
                    </Label> */}
                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        type='button'
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                        onClick={() => this.props.history.push('/user/login')}
                      >
                        <IntlMessages id="user.login-back" />
                      </Button>
                      <Button
                        type='submit'
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                      >
                        <IntlMessages id="user.register" />
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

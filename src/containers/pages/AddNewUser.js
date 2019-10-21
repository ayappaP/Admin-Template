import React from "react";
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
  Label
} from "reactstrap";
import { Auth } from "aws-amplify";
import Select from "react-select";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import client from "../../queries/client";
import updateOrderProducts from "../../queries/updateOrderProducts";
import fetchShops from "../../queries/fetchShops";
import { Formik } from 'formik'
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



class AddNewUser extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      productList: [],
      shopName: [],
      selectedOption: "",
      selectValue: "",
      name: "",
      email: "",
      success: "",
      error: "",
      userRole: ""
    };
    this.onSelect = this.onSelect.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchShops();
    Auth.currentAuthenticatedUser()
      .then(res => {
        // console.log(res)
        this.setState({ userRole: res.attributes["custom:role"] })
      })
      .catch((err) => console.log(err))
  }

  fetchShops = () => {
    const query = fetchShops();
    client(query)
      .then(res => {
        this.setState({ shopName: res.data.shop });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onSelect(option) {
    const selectedOption = option.label;
    const selectedValue = option.value;
    this.setState({
      selectValue: selectedValue,
      selectedOption: selectedOption
    });
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  done() {
    window.location.reload();
  }

  close = () => {
    this.setState(prevState => ({
      nestedModal: !prevState.nestedModal,
      closeAll: false
    }));
  };

  submit = (values) => {
    Auth.currentAuthenticatedUser().then(res => {
      // const res = { attributes: { "custom:role": 'Super' } }
      const userRole = res.attributes["custom:role"];
      const shopId = userRole == "Super" ? values.shopId : res.attributes["custom:shopId"];
      const shopName = userRole == "Super" ? values.shopName : res.attributes["custom:shopName"];
      const data = {
        name: values.name,
        phone: `+44${values.phone}`,
        role: values.role,
        shopName: shopName,
        shopId: shopId,
      };
      // console.log("data", data);

      Auth.signUp({
        username: data.phone,
        password: 'Arokiya@123',
        attributes: {
          'name': data.name,
          'custom:shopName': data.shopName,
          'custom:shopId': data.shopId,
          'custom:role': data.role
        }
      })
        .then((user) => {
          console.log(user)
          createNotification('User created successfully')
          this.props.onClose();
        })
        .catch((err) => {
          console.log(err)
          if (err.code == "UsernameExistsException") {
            createNotification('User already exsits', err.message)
          } else if (err.code == "InvalidParameterException") {
            createNotification('Please check your phone number', err.message)
          }
        })

      // const url =
      //   "https://743rzka0ah.execute-api.eu-west-2.amazonaws.com/dev/createAdminUser";
      // fetch(url, {
      //   method: "POST",
      //   body: JSON.stringify(data),
      //   headers: {
      //     "Content-Type": "application/json"
      //   }
      // })
      //   .then(res => res.json())
      //   .then(response => {
      //     if (response.message == "Admin User created") {
      //       this.setState(prevState => ({
      //         success: response.message,
      //         nestedModal: !prevState.nestedModal
      //       }));
      //     } else {
      //       this.setState(prevState => ({
      //         error: response.error.message,
      //         nestedModal: !prevState.nestedModal
      //       }));
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    }).catch((err) => console.log(err));
  }

  render() {
    const { modalOpen, toggleModal, categories, order, onClose } = this.props;
    const {
      shopName,
      selectValue,
      selectedOption,
      success,
      error,
      userRole
    } = this.state;
    const listRole = ['Owner', 'Staff']
    const listShop = shopName.map(shop => ({
      value: shop.id,
      label: shop.shopName
    }));
    const closeBtn = (
      <button className="close" onClick={onClose}>
        &times;
      </button>
    );

    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal} close={closeBtn}>
          <h3>
            <IntlMessages id="user.create" />
          </h3>
        </ModalHeader>

        <Formik initialValues={{ name: '', phone: '', role: '', shopName: '', shopId: '' }}
          onSubmit={(val) => this.submit(val)}>
          {props =>
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
                  <IntlMessages id="pages.user-name" />
                </Label>
                <Input
                  name="name"
                  placeholder='Enter staff name'
                  value={props.values.name}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="pages.user-phone" />
                </Label>
                <Input
                  type='tel'
                  name="phone"
                  placeholder='Enter 10-digit phone number'
                  maxLength='10'
                  minLength='10'
                  value={props.values.phone}
                  onChange={props.handleChange}
                />
                {/* <Label className="mt-4">
            <IntlMessages id="pages.user-password" />
          </Label>
          <Input /> */}


                <Label className="mt-4">
                  <IntlMessages id="pages.role" />
                </Label>
                <Dropdown
                  name="shopName"
                  options={listRole}
                  value={props.values.role}
                  onChange={(e) => props.setFieldValue('role', e.value)}
                  placeholder="Select role"
                />
                {/* {userRole == 'Super' ?
                  <><Label className="mt-4">
                    <IntlMessages id="pages.shopName" />
                  </Label>
                    <Dropdown
                      name="shopName"
                      options={listShop}
                      value={props.values.shopName}
                      onChange={(e) => {
                        props.setFieldValue('shopName', e.label)
                        props.setFieldValue('shopId', e.value)
                      }}
                      placeholder="Select Shop"
                    /> </> : null} */}
                {/* <Label className="mt-4">
                  <IntlMessages id="pages.shopId" />
                </Label>
                <Input name="shopId" disabled value={props.values.shop} /> */}
              </ModalBody>

              <ModalFooter>
                <Button color="secondary" outline onClick={onClose}>
                  <IntlMessages id="pages.cancel" />
                </Button>
                <Button
                  type='submit'
                  color="primary"
                  disabled={props.isSubmitting || !props.values.name || !props.values.phone || !props.values.role}
                // onClick={props.handleSubmit}
                >
                  <IntlMessages id="pages.submit" />
                </Button>{" "}
              </ModalFooter>
            </Form>
          }
        </Formik>

        <Modal
          isOpen={this.state.nestedModal}
          toggle={this.toggleNested}
          onClosed={
            this.state.closeAll ? this.toggleNestedContainer : undefined
          }
        >
          {success ? (
            <ModalBody>
              <h3>{success}</h3>
            </ModalBody>
          ) : (
              <ModalBody>
                <h3>{error}</h3>
              </ModalBody>
            )}
          {/* {error ? (
            <ModalBody>{error}</ModalBody>
          ) : (
            <ModalBody>{error}</ModalBody>
          )} */}
          <ModalFooter>
            <Button color="primary" onClick={this.done}>
              Done
            </Button>
            <Button color="secondary" onClick={this.close}>
              Back
            </Button>
          </ModalFooter>
        </Modal>
      </Modal>
    );
  }
}

export default AddNewUser;

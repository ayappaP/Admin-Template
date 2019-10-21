import React, { Component } from "react";
import { connect } from "react-redux";
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form
} from "reactstrap";
import Select from "react-select";
import { Formik } from "formik";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";
import addShop from "../../../queries/addShop";
import client from "../../../queries/client";
import { addTodoItem } from "../../../redux/actions";

class AddNewShop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      detail: "",
      label: {},
      labelColor: "",
      category: {},
      status: "PENDING",
      shopName: "",
      contact: "",
      businessHours: "",
      coverage: "",
      addressRoad: "",
      addressTown: "",
      addressNumber: "",
      addressPostCode: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  addNetItem = () => {
    const newItem = {
      title: this.state.title,
      detail: this.state.detail,
      label: this.state.label.value,
      labelColor: this.state.label.color,
      category: this.state.category.value,
      status: this.state.status
    };
    this.props.addTodoItem(newItem);
    this.props.toggleModal();
    this.setState({
      title: "",
      detail: "",
      label: {},
      category: {},
      status: "PENDING"
    });
  };

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  submit = values => {
    // console.log(values)
    const query = addShop(values);
    client(query)
      .then(res => {
        console.log("insert shop", res);
        // this.setState({
        //   shops: res.data.shop
        // });
        this.props.reloadShopList()
        this.props.onClose()
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { labels, categories } = this.props.todoApp;
    const { toggleModal, modalOpen, onClose } = this.props;
    console.log("props",onClose)
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id="Add new" />
        </ModalHeader>
        <Formik
          initialValues={{
            shopName: "",
            shopCode: "",
            contact: "",
            businessHours: "",
            coverage: "",
            addressRoad: "",
            addressTown: "",
            addressNumber: "",
            addressPostCode: "",
            contactName:"",
            contactNumber:""
          }}
          onSubmit={val => this.submit(val)}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
                  <IntlMessages id="organization.name" />
                </Label>
                <Input
                  name="shopName"
                  value={props.values.shopName}
                  onChange={props.handleChange}
                />
                {/* <Label className="mt-4">
                  <IntlMessages id="shop.code" />
                </Label>
                <Input
                  name="shopCode"
                  value={props.values.shopCode}
                  onChange={props.handleChange}
                /> */}
                <Label className="mt-4">
                  <IntlMessages id="organization.address" />
                </Label>
                <Input
                  name="addressRoad"
                  value={props.values.addressRoad}
                  onChange={props.handleChange}
                />
                {/* <Label className="mt-4">
                  <IntlMessages id="organization.addressTown" />
                </Label>
                <Input
                  name="addressTown"
                  value={props.values.addressTown}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="organization.addressNumber" />
                </Label>
                <Input
                  name="addressNumber"
                  value={props.values.addressNumber}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="organization.addressPostCode" />
                </Label>
                <Input
                  name="addressPostCode"
                  value={props.values.addressPostCode}
                  onChange={props.handleChange}
                /> */}
                <Label className="mt-4">
                  <IntlMessages id="organization.contactName" />
                </Label>
                <Input
                  name="contactName"
                  value={props.values.contactName}
                  onChange={props.handleChange}
                />
                {/* <Label className="mt-4">
                  <IntlMessages id="shop.contactNumber" />
                </Label>
                <Input
                  name="contactNumber"
                  value={props.values.contactNumber}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="shop.businessHours" />
                </Label>
                <Input
                  name="businessHours"
                  value={props.values.businessHours}
                  onChange={props.handleChange}
                />

                <Label className="mt-4">
                  <IntlMessages id="shop.coverage" />
                </Label>
                <Input
                  name="coverage"
                  value={props.values.coverage}
                  onChange={props.handleChange}
                /> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  type={"button"}
                  color="secondary"
                  outline
                  onClick={onClose}
                >
                  <IntlMessages id="todo.cancel" />
                </Button>
                <Button type={"submit"} color="primary">
                  <IntlMessages id="todo.submit" />
                </Button>{" "}
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

const mapStateToProps = ({ todoApp }) => {
  return {
    todoApp
  };
};
export default connect(
  mapStateToProps,
  {
    addTodoItem
  }
)(AddNewShop);

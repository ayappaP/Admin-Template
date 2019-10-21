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
  Form,
  Label
} from "reactstrap";
import { Formik } from "formik";
import IntlMessages from "../../../helpers/IntlMessages";
import updateShop from "../../../queries/updateShop";
import client from "../../../queries/client";
import { addTodoItem } from "../../../redux/actions";
import shopsListView from "./shopsListView";

class ViewShopModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      detail: "",
      label: {},
      labelColor: "",
      category: {},
      status: "PENDING"
    };
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

  submit = values => {
    console.log(values);
    const query = updateShop(values);
    client(query)
      .then(res => {
        console.log("update organization", res);
        this.props.reloadShopList();
        this.props.onClose();
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { labels, categories } = this.props.todoApp;
    const {
      toggleModalValue,
      toggleModal,
      shops,
      onClose,
      modalOpenValue,
      ListOrganizationData
    } = this.props;
    console.log("modal", shops);
    // const address = shops.address.postcode
    //   ? `${shops.address.postcode} ${shops.address.town} ${shops.address.number} ${shops.address.road} `
    //   : "Not Available";

    return (
      <Modal
        isOpen={modalOpenValue}
        toggle={toggleModalValue}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModalValue}>
          <IntlMessages id="Update" />
        </ModalHeader>
        <Formik
          initialValues={{
            // shopName: shops.shopName,
            // shopCode: shops.code,
            // contactName: shops.contact.name,
            // contactNumber: shops.contact.number,
            // businessHours: shops.businessHours,
            // coverage: shops.coverage,
            // addressRoad: shops.address.road,
            // addressTown: shops.address.town,
            // addressNumber: shops.address.number,
            // addressPostCode: shops.address.postcode,
            // shopId: shops.id
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
                  value={ListOrganizationData.organizationName}
                  onChange={props.handleChange}
                />
                {/* <Label className="mt-4">
                  <IntlMessages id="organization.code" />
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
                  value={ListOrganizationData.address}
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
                  value={ListOrganizationData.contactName}
                  onChange={props.handleChange}
                />
                {/* <Label className="mt-4">
                  <IntlMessages id="organization.contactNumber" />
                </Label>
                <Input
                  name="contactNumber"
                  value={props.values.contactNumber}
                  onChange={props.handleChange}
                />

                <Label className="mt-4">
                  <IntlMessages id="organization.businessHours" />
                </Label>
                <Input
                  name="businessHours"
                  value={props.values.businessHours}
                  onChange={props.handleChange}
                />

                <Label className="mt-4">
                  <IntlMessages id="organization.coverage" />
                </Label>
                <Input
                  name="coverage"
                  value={props.values.coverage}
                  onChange={props.handleChange}
                /> */}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={onClose}>
                  <IntlMessages id="todo.cancel" />
                </Button>
                <Button color="primary" type={"submit"}>
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
)(ViewShopModal);

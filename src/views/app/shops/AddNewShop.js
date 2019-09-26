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
      address: "",
      contact: "",
      businessHours: "",
      coverage: "",
      addressRoad: "",
      addressTown:"",
      addressNumber:"",
      addressPostCode:""
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
    console.log(values);
  };

  render() {
    const { labels, categories } = this.props.todoApp;
    const { toggleModal, modalOpen, onClose } = this.props;
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id="shop.add.name" />
        </ModalHeader>
        <Formik
          initialValues={{
            shopName: "",
            address: "",
            contact: "",
            businessHours: "",
            coverage: "",
            addressRoad: "",
            addressTown:"",
            addressNumber:"",
            addressPostCode:""
          }}
          onSubmit={val => this.submit(val)}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
                  <IntlMessages id="pages.shopName" />
                </Label>
                <Input
                  name="shopName"
                  value={props.values.shopName}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="pages.address" />
                </Label>
                <Input
                  name="addressRoad"
                  value={props.values.addressRoad}
                  onChange={props.handleChange}
                />
                  <Label className="mt-4">
                  <IntlMessages id="pages.address" />
                </Label>
                <Input
                  name="addressTown"
                  value={props.values.addressRoad}
                  onChange={props.handleChange}
                />
                  <Label className="mt-4">
                  <IntlMessages id="pages.address" />
                </Label>
                <Input
                  name="addressNumber"
                  value={props.values.addressRoad}
                  onChange={props.handleChange}
                />
                  <Label className="mt-4">
                  <IntlMessages id="pages.address" />
                </Label>
                <Input
                  name="addressPostCode"
                  value={props.values.addressRoad}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="pages.contact" />
                </Label>
                <Input
                  name="contact"
                  value={props.values.contact}
                  onChange={props.handleChange}
                />

                <Label className="mt-4">
                  <IntlMessages id="pages.businessHours" />
                </Label>
                <Input
                  name="businessHours"
                  value={props.values.businessHours}
                  onChange={props.handleChange}
                />

                <Label className="mt-4">
                  <IntlMessages id="pages.coverage" />
                </Label>
                <Input
                  name="coverage"
                  value={props.values.coverage}
                  onChange={props.handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={onClose}>
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

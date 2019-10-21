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
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";
import { Formik } from 'formik';

import { addTodoItem } from "../../../redux/actions";


class AddNewOrder extends Component {
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

  render() {
    const { labels, categories } = this.props.todoApp;
    const { modalOpenValue, toggleModalValue, onClose } = this.props;
    return (
      <Modal
        isOpen={modalOpenValue}
        toggle={toggleModalValue}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModalValue}>
          <IntlMessages id="Add new" />
        </ModalHeader>
        <Formik
          initialValues={{ productName: '', price: '', quantity: '', unitWeight: '' }}
          onSubmit={(values) => console.log(values)}
        >{props => <Form onSubmit={props.handleSubmit}>

          <ModalBody>
            <Label className="mt-4">
              <IntlMessages id="pages.item" />
            </Label>
            <Input name='productName' type='text' value={props.values.productName}
              onChange={props.handleChange} />
            <Label className="mt-4">
              <IntlMessages id="pages.count" />
            </Label>
            <Input name='price' type='text' value={props.values.price}
              onChange={props.handleChange} />
            <Label className="mt-4">
              <IntlMessages id="pages.total" />
            </Label>
            <Input name='quantity' type='text' value={props.values.quantity}
              onChange={props.handleChange} />
            <Label className="mt-4">
              <IntlMessages id="pages.deliveryDate" />
            </Label>
            <Input name='unitWeight' type='text' value={props.values.unitWeight}
              onChange={props.handleChange} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={onClose}>
              <IntlMessages id="todo.cancel" />
            </Button>
            <Button type='submit' color="primary" 
            // onClick={() => this.addNetItem()}
            >
              <IntlMessages id="todo.submit" />
            </Button>{" "}
          </ModalFooter>
        </Form>}
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
)(AddNewOrder);

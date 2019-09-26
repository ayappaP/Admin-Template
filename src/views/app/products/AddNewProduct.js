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
import { Formik } from 'formik'

import { addTodoItem } from "../../../redux/actions";


class AddNewProduct extends Component {
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
    const { modalOpen, toggleModal } = this.props;
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id="product.new" />
        </ModalHeader>
        <Formik
          initialValues={{ productName: '', description: '', price: '', unitWeight: '', category: '' }}
          onSubmit={(values) => console.log(values)}
        >{props => <Form onSubmit={props.handleSubmit}>
          <ModalBody>
            <Label className="mt-4">
              <IntlMessages id="product.name" />
            </Label>
            <Input name='productName' type='text' value={props.values.productName}
              onChange={props.handleChange} />
            <Label className="mt-4">
              <IntlMessages id="product.description" />
            </Label>
            <Input name='description' type='text' value={props.values.description}
              onChange={props.handleChange} />
            <Label className="mt-4">
              <IntlMessages id="product.price" />
            </Label>
            <Input name='price' type='text' value={props.values.price}
              onChange={props.handleChange} />
            <Label className="mt-4">
              <IntlMessages id="product.unitWeight" />
            </Label>
            <Input name='unitWeight' type='text' value={props.values.unitWeight}
              onChange={props.handleChange} />
            <Label className="mt-4">
              <IntlMessages id="product.categoryName" />
            </Label>
            <Input name='category' type='text' value={props.values.category}
              onChange={props.handleChange} />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={toggleModal}>
              <IntlMessages id="todo.cancel" />
            </Button>
            <Button type='submit' color="primary"
            // onClick={() => this.addNetItem()}
            >
              <IntlMessages id="todo.submit" />
            </Button>{" "}
          </ModalFooter>
        </Form>}</Formik>
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
)(AddNewProduct);

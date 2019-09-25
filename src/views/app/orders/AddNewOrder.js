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
  Label
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";

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
    const { modalOpenValue, toggleModalValue,onClose } = this.props;
    return (
      <Modal
        isOpen={modalOpenValue}
        toggle={toggleModalValue}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModalValue}>
          <IntlMessages id="order.add.name" />
        </ModalHeader>
        <ModalBody>
        <Label className="mt-4">
                <IntlMessages id="pages.product-name" />
              </Label>
              <Input />
              <Label className="mt-4">
                <IntlMessages id="pages.price" />
              </Label>
              <Input />
              <Label className="mt-4">
                <IntlMessages id="pages.quantity" />
              </Label>
              <Input />
              <Label className="mt-4">
                <IntlMessages id="pages.unitWeight" />
              </Label>
              <Input />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={onClose}>
            <IntlMessages id="todo.cancel" />
          </Button>
          <Button color="primary" onClick={() => this.addNetItem()}>
            <IntlMessages id="todo.submit" />
          </Button>{" "}
        </ModalFooter>
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

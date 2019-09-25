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

class ViewTransactionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      detail: "",
      label: {},
      labelColor: "",
      category: {},
      status: "PENDING",
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
    const { toggleModalValue, modalOpenValue, transaction, onClose } = this.props;
    console.log("modal", transaction.date);
    const transactionDate = transaction.date.slice(0, 10)
    return (
      <Modal
        isOpen={modalOpenValue}
        // toggle={toggleModalValue}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModalValue}>
          <IntlMessages id="transaction.name" />
        </ModalHeader>
        <ModalBody>
          <Label className="mt-4">
            <IntlMessages id="transaction.from" />
          </Label>
          <Input value={transaction.from} disabled/>
          <Label className="mt-4">
            <IntlMessages id="transaction.to" />
          </Label>
          <Input value={transaction.to} disabled/>
          <Label className="mt-4">
            <IntlMessages id="transaction.date" />
          </Label>
          <Input value={transactionDate} disabled/>
          <Label className="mt-4">
            <IntlMessages id="transaction.type"/>
          </Label>
          <Input value={transaction.type} disabled/>
          <Label className="mt-4">
            <IntlMessages id="transaction.amount" />
          </Label>
          <Input value={transaction.amount} disabled/>
        </ModalBody>
        {/* <ModalFooter>
          <Button color="secondary" outline onClick={onClose}>
            <IntlMessages id="todo.cancel" />
          </Button>
          <Button color="primary" onClick={() => this.addNetItem()}>
            <IntlMessages id="todo.submit" />
          </Button>{" "}
        </ModalFooter> */}
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
)(ViewTransactionModal);

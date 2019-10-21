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

class ViewUserModal extends Component {
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
    const { toggleModalValue, toggleModal, user, onClose } = this.props;


    return (
      <Modal
        isOpen={toggleModalValue}
        toggle={toggleModalValue}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModalValue}>
          <IntlMessages id="user.update" />
        </ModalHeader>
        <ModalBody>
          <Label className="mt-4">
            <IntlMessages id="pages.user-name" />
          </Label>
          <Input value= {user.name == null ? "NA" : user.name} />
          <Label className="mt-4">
            <IntlMessages id="pages.user-phone" />
          </Label>
          <Input value= {user.phone} />
          <Label className="mt-4">
            <IntlMessages id="user.role" />
          </Label>
          <Input value= {user.role} />
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
)(ViewUserModal);

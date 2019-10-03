import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import updateOffer from "../../queries/updateOffer";
import client from "../../../queries/client";
import addOffer from "../../../queries/addOffer";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";

import { addTodoItem } from "../../../redux/actions";

class AddNewCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      detail: "",
      label: {},
      labelColor: "",
      category: {},
      status: "PENDING",
      startDateLabelTop: null,
      startDate: null,
      endDate: null
    };
  }
  submit = values => {
    console.log("submitted", values);

    const query = addOffer(values);
    client(query)
      .then(res => {
        console.log("res offer insert", res);
        this.props.refetchOfferList();
        this.props.onClose();
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChangeLabelTop = selectedOptionLabelTop => {
    this.setState({ selectedOptionLabelTop });
  };

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
    const { labels, categories, onClose } = this.props.todoApp;
    const { modalOpen, toggleModal } = this.props;
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id="offer.new" />
        </ModalHeader>
        <Formik
          initialValues={{ offerTitle: "", startDate: null, endDate: null }}
          onSubmit={val => this.submit(val)}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
                  <IntlMessages id="offer.title" />
                </Label>
                <Input
                  name="offerTitle"
                  value={props.values.offerTitle}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="offer.startDate" />
                </Label>
                <DatePicker
                  name={"startDate"}
                  selected={props.values.startDate}
                  onChange={selectedDate => {
                    props.setFieldValue("startDate", selectedDate);
                  }}
                />
                {/* <Input
                 // type='tel'
                  name="startDate"
                  value={props.values.startDate}
                  onChange={props.handleChange}
                /> */}
                {/* <Label className="mt-4">
            <IntlMessages id="pages.user-password" />
          </Label>
          <Input /> */}
                <Label className="mt-4">
                  <IntlMessages id="offer.endDate" />
                </Label>
                <DatePicker
                  name={"endDate"}
                  selected={props.values.endDate}
                  onChange={selectedDate => {
                    props.setFieldValue("endDate", selectedDate);
                  }}
                />
                {/* <Input
                 // type='tel'
                  name="endDate"
                  value={props.values.endDate}
                  onChange={props.handleChange}
                /> */}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={()=>{this.props.onClose()}}>
                  <IntlMessages id="pages.cancel" />
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={props.isSubmitting}
                  // onClick={props.handleSubmit}
                >
                  <IntlMessages id="pages.submit" />
                </Button>{" "}
              </ModalFooter>
              {/* 
                <ModalFooter>
                <Button color="secondary" outline onClick={onClose}>
                  <IntlMessages id="pages.cancel" />
                </Button>
                <Button
                  type='submit'
                  color="primary"
                  disabled={props.isSubmitting}
                // onClick={props.handleSubmit}
                >
                  <IntlMessages id="pages.submit" />
                </Button>{" "}
              </ModalFooter> */}
            </Form>
          )}
        </Formik>

        {/*         
        <ModalBody>
        <Label className="mt-4">
            <IntlMessages id="offer.title" />
          </Label>
          <Input />
          <Label className="mt-4">
            <IntlMessages id="offer.startDate" />
          </Label>
          <Input />
          <Label className="mt-4">
            <IntlMessages id="offer.endDate" />
          </Label>
          <Input />

        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggleModal}>
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
)(AddNewCarousel);

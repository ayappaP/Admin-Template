import React, { Component } from "react";
import { connect } from "react-redux";
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
import moment from "moment";
import Select from "react-select";
import client from "../../../queries/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";
import updateOffer from "../../../queries/updateOffer";

import { addTodoItem } from "../../../redux/actions";
import { Formik } from 'formik'

class UpdateOfferModal extends Component {
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
  submit = (values) => {
    console.log("submitted",values)
    const {offerTitle,startDate,endDate}= values;
      const query = updateOffer(this.props.offer.id,offerTitle,startDate,endDate);
      client(query)
        .then(res => {
          console.log("res offer update",res)
          this.props.refetchOfferList();
          this.props.onClose();
        })
        .catch(error => {
          console.log(error);
        });
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
    // const { labels, categories } = this.props.todoApp;
    const { modalOpenValue, toggleModal, offer,onClose} = this.props;
    return (
      <Modal
        isOpen={modalOpenValue}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id="offer.new" />
        </ModalHeader>
        <Formik initialValues={{ offerTitle: offer.offerTitle, startDate: moment (offer.startDate), endDate:moment(offer.endDate) }}
          onSubmit={(val) => this.submit(val)}>
          {props =>
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
                      onChange={(selectedDate)=>{props.setFieldValue("startDate", selectedDate)}}
                    />
              
           <Label className="mt-4">
                  <IntlMessages id="offer.endDate" />
                </Label>
                <DatePicker
                       name={"endDate"}
                      selected={props.values.endDate}
                      onChange={(selectedDate)=>{props.setFieldValue("endDate",selectedDate)}}
                    />
               
                </ModalBody>
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
                  <IntlMessages id="offer.update" />
                </Button>{" "}
        </ModalFooter>

              
            </Form>
          }
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
)(UpdateOfferModal);

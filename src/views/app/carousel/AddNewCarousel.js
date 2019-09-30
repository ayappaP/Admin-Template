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
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";
import { Formik } from 'formik'

import { addTodoItem } from "../../../redux/actions";

import { Storage } from 'aws-amplify'

class AddNewCarousel extends Component {
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

  addNewCarousel = (e) => {
    const file = e.target.files[0];
    const url =
      "https://743rzka0ah.execute-api.eu-west-2.amazonaws.com/dev/uploadCarosuel";
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: file,
      // header: {
      //   // "Access-Control-Allow-Origin": "*"
      // }
    })
      .then(res => res.json())
      .then((response) => console.log(response))
      .catch((err) => console.log(err))

    // console.log(file)
    // Storage.put(file.name, file, {
    //   contentType: 'image/png',
    // })
    //   .then(result => console.log('result', result))
    //   .catch(err => console.log('err', err));
    // const newItem = {
    //   title: this.state.title,
    //   detail: this.state.detail,
    //   label: this.state.label.value,
    //   labelColor: this.state.label.color,
    //   category: this.state.category.value,
    //   status: this.state.status
    // };
    // this.props.addTodoItem(newItem);
    // this.props.toggleModal();
    // this.setState({
    //   title: "",
    //   detail: "",
    //   label: {},
    //   category: {},
    //   status: "PENDING"
    // });
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
          <IntlMessages id="carousel.title" />
        </ModalHeader>
        <Formik initialValues={{ alt: '', imageUrl: '' }}
          onSubmit={(values) => console.log(values)}>
          {props =>
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
                  <IntlMessages id="carousel.alt" />
                </Label>
                <Input type='text' />
                <Label className="mt-4">
                  <IntlMessages id="carousel.UploadImage" />
                </Label>
                <Input type="file" onChange={(e) => this.addNewCarousel(e)} />

                {/* <Label className="mt-4">
            <IntlMessages id="todo.category" />
          </Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            options={categories.map((x, i) => {
              return { label: x, value: x, key: i };
            })}
            value={this.state.category}
            onChange={val => {
              this.setState({ category: val });
            }}
          />
          <Label className="mt-4">
            <IntlMessages id="todo.label" />
          </Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            options={labels.map((x, i) => {
              return {
                label: x.label,
                value: x.label,
                key: i,
                color: x.color
              };
            })}
            value={this.state.label}
            onChange={val => {
              this.setState({ label: val });
            }}
          />

          <Label className="mt-4">
            <IntlMessages id="todo.status" />
          </Label>
          <CustomInput
            type="radio"
            id="exCustomRadio"
            name="customRadio"
            label="COMPLETED"
            checked={this.state.status === "COMPLETED"}
            onChange={event => {
              this.setState({
                status: event.target.value === "on" ? "COMPLETED" : "PENDING"
              });
            }}
          />
          <CustomInput
            type="radio"
            id="exCustomRadio2"
            name="customRadio2"
            label="PENDING"
            defaultChecked={this.state.status === "PENDING"}
            onChange={event => {
              this.setState({
                status: event.target.value !== "on" ? "COMPLETED" : "PENDING"
              });
            }}
          /> */}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={toggleModal}>
                  <IntlMessages id="todo.cancel" />
                </Button>
                <Button type='submit' color="primary"
                //  onClick={() => this.addNewCarousel()}
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
)(AddNewCarousel);

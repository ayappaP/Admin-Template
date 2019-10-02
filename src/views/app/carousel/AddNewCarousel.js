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
import addCarousel from '../../../queries/addCarousel';
import client from "../../../queries/client";

import { Storage } from 'aws-amplify'
import { NotificationManager } from "../../../components/common/react-notifications";


const createNotification = (msg, req) => {
  NotificationManager.primary(
    req,
    msg,
    5000,
    null,
    null,
  );
}

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

  addNewCarousel = async (e, props) => {
    const file = e.target.files[0];
    // console.log(file)
    const fileName = file.name;
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      // console.log(reader)
    });

    console.log(await toBase64(file));
    const image = await toBase64(file)
    const url =
      "https://743rzka0ah.execute-api.eu-west-2.amazonaws.com/dev/uploadCarosuel";
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        image: image,
        key: fileName,
        bucket: "www.arokiya.com/images/carousel"
      }),
    })
      .then(res => res.json())
      .then((response) => {
        if (response.code == 1) {
          props.setFieldValue('imageUrl', response.Url)
        }
      })
      .catch((err) => console.log(err))
  };

  onSubmit = (values) => {
    const query = addCarousel(values)
    client(query)
      .then(res => {
        console.log(res);
        createNotification('Success', 'Carousel added');
        this.props.reloadCarousel();
        this.props.onClose();
      })
      .catch(error => {
        console.log(error);
      });
  }

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
          onSubmit={(values) => this.onSubmit(values)}>
          {props =>
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
                  <IntlMessages id="carousel.alt" />
                </Label>
                <Input name='alt' type='text' value={props.values.alt} onChange={props.handleChange} />
                <Label className="mt-4">
                  <IntlMessages id="carousel.UploadImage" />
                </Label>
                <Input name='imageUrl' type="file" onChange={(e) => this.addNewCarousel(e, props)} />

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
                  disabled={props.isSubmitting}
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

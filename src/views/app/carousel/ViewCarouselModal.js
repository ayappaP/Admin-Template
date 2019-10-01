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
  Form,
  Label
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";
import { Formik } from 'formik';

import updateCarousel from '../../../queries/updateCarousel';
import client from "../../../queries/client";
import { addTodoItem } from "../../../redux/actions";
import { __values } from "tslib";
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

class ViewCarouselModal extends Component {
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

  editCarousel = async (e, props, carousel) => {
    const file = e.target.files[0];
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    // console.log(await toBase64(file));
    const image = await toBase64(file)
    const fileName = carousel.imageUrl.split('carousel/')
    const url =
      "https://743rzka0ah.execute-api.eu-west-2.amazonaws.com/dev/uploadCarosuel";
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        image: image,
        key: fileName[1],
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

  onSubmit = (values, carousel) => {
    const query = updateCarousel(values, carousel);
    client(query)
      .then(res => {
        console.log(res);
        createNotification('Carousel updated successFully', 'Refresh webpage')
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { labels, categories } = this.props.todoApp;
    const { toggleModalValue, toggleModal, carousel, onClose, modalOpenValue } = this.props;
    console.log("modal", carousel);
    return (
      <Modal
        isOpen={modalOpenValue}
        toggle={toggleModalValue}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModalValue}>
          <IntlMessages id="carousel.update" />
        </ModalHeader>
        <Formik
          initialValues={{ alt: '', imageUrl: '', index: carousel.index }}
          onSubmit={(val) => this.onSubmit(val, carousel)}
        >
          {props =>
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
                  <IntlMessages id="carousel.alt" />
                </Label>
                <Input name='alt' type='text' placeholder={carousel.alt} value={props.values.alt} onChange={props.handleChange} />
                <Label className="mt-4">
                  <IntlMessages id="carousel.image" />
                </Label>
                <img
                  style={{ width: "100%" }}
                  src={carousel.imageUrl}
                  alt={carousel.alt}
                />

                <Label className="mt-4">
                  <IntlMessages id="carousel.UploadImage" />
                </Label>
                <Input type="file" name='imageUrl' onChange={(e) => this.editCarousel(e, props, carousel)} />

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
                <Button type='button' color="secondary" outline onClick={onClose}>
                  <IntlMessages id="todo.cancel" />
                </Button>
                <Button type='submit' color="primary" disabled={props.isSubmitting} >
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
)(ViewCarouselModal);

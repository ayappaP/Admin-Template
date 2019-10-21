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
import fetchCategoryName from "../../../queries/fetchCategoryName";
import client from "../../../queries/client";
import { Formik } from "formik";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import IntlMessages from "../../../helpers/IntlMessages";
import { addTodoItem } from "../../../redux/actions";
import updateProduct from "../../../queries/updateProduct";
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
      categoryName: [],
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

  componentDidMount() {
    this.fetchCategoryName();
  }

  fetchCategoryName = () => {
    const query = fetchCategoryName();
    client(query)
      .then(res => {
        console.log("cat name", res);
        this.setState({ categoryName: res.data.category });
      })
      .catch(error => {
        console.log(error);
      });
  };

  editproduct = async (e, props, secondaryData) => {
    const file = e.target.files[0];
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    // console.log(await toBase64(file));
    const image = await toBase64(file)
    const fileName = secondaryData.imageUrl.split('images/')
    const url =
      "https://743rzka0ah.execute-api.eu-west-2.amazonaws.com/dev/uploadCarosuel";
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        image: image,
        key: fileName[1],
        bucket: "www.arokiya.com/images"
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

  submit = values => {
    console.log(values);
    const query = updateProduct(values);
    client(query)
      .then(res => {
        console.log("update shop", res);
        createNotification('Succes', 'Product details updated')
        this.props.reloadProductList();
        this.props.onClose();
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { labels, categories } = this.props.todoApp;
    const {
      toggleModalValue,
      toggleModal,
      onClose,
      selectedsecondaryData,
      modalOpenValue
    } = this.props;
    const { categoryName } = this.state;
    console.log("selectedsecondaryData", selectedsecondaryData);
    const listCategory = categoryName.map(category => ({
      value: category.categoryId,
      label: category.name
    }));

    return (
      <Modal
        isOpen={modalOpenValue}
        toggle={toggleModalValue}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModalValue}>
          <IntlMessages id="Update" />
        </ModalHeader>
        <Formik
          initialValues={{
            // category: secondaryData.categoryName,
            // categoryId: secondaryData.categoryId,
            // brand: secondaryData.brand,
            // distributor: secondaryData.distributor,
            // productName: secondaryData.englishName,
            // description: secondaryData.description,
            // price: secondaryData.price,
            // offerPrice: secondaryData.offerPrice,
            // wholeSalePrice: secondaryData.wholesalePrice,
            // unitWeight: secondaryData.unitWeight,
            // offerProduct: secondaryData.offerProduct,
            // sellable: secondaryData.sellable,
            // productId: secondaryData.id,
            // imageUrl: ''
          }}
          onSubmit={val => this.submit(val)}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                {/* <Label className="mt-4">
                  <IntlMessages id="secondaryData.categoryName" />
                </Label>
                <Dropdown
                  name="category"
                  options={listCategory}
                  value={props.values.categoryId}
                  onChange={selected => {
                    props.setFieldValue("category", selected.label);
                    props.setFieldValue("categoryId", selected.value);
                  }}
                  placeholder="Select Category"
                /> */}
                {/* <Label className="mt-4">
                  <IntlMessages id="Brand" />
                </Label>
                <Input
                  name="brand"
                  type="text"
                  value={props.values.brand}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="Distributor" />
                </Label>
                <Input
                  name="distributor"
                  type="text"
                  value={props.values.distributor}
                  onChange={props.handleChange}
                /> */}

                <Label className="mt-4">
                  <IntlMessages id="secondary.title" />
                </Label>
                <Input
                  name="productName"
                  type="text"
                  value={selectedsecondaryData.title}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="secondary.description" />
                </Label>
                <Input
                  name="description"
                  type="text"
                  value={selectedsecondaryData.description}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="secondary.price" />
                </Label>
                <Input
                  name="price"
                  type="text"
                  value={selectedsecondaryData.price}
                  onChange={props.handleChange}
                />
                
                <Label className="mt-4">
                  <IntlMessages id="secondary.rating" />
                </Label>
                <Input
                  name="wholeSalePrice"
                  type="text"
                  value={selectedsecondaryData.rating}
                  onChange={props.handleChange}
                />

               
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={onClose}>
                  <IntlMessages id="todo.cancel" />
                </Button>
                <Button color="primary" type={"submit"}>
                  <IntlMessages id="todo.submit" />
                </Button>{" "}
              </ModalFooter>
            </Form>
          )}
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

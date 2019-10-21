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
import fetchCategoryName from "../../../queries/fetchCategoryName";
import IntlMessages from "../../../helpers/IntlMessages";
import { Formik } from "formik";
import addProduct from "../../../queries/addProduct";
import client from "../../../queries/client";
import { addTodoItem } from "../../../redux/actions";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
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


class AddNewProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      detail: "",
      label: {},
      labelColor: "",
      category: {},
      status: "PENDING",
      categoryName: [],
      selectedOption: "",
      selectValue: ""
    };
    this.onSelect = this.onSelect.bind(this);
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

  onSelect(option) {
    const selectedOption = option.label;
    const selectedValue = option.value;
    this.setState({
      selectValue: selectedValue,
      selectedOption: selectedOption
    });
  }

  addNewProduct = async (e, props) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    const image = await toBase64(file)
    const url =
      "https://743rzka0ah.execute-api.eu-west-2.amazonaws.com/dev/uploadCarosuel";
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        image: image,
        key: fileName,
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
    const query = addProduct(values);
    client(query)
      .then(res => {
        console.log("insert prod", res);
        createNotification('Success', 'New product added')
        this.props.reloadProductList();
        this.props.onClose();
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { labels, categories } = this.props.todoApp;
    const { modalOpen, toggleModal } = this.props;
    const { categoryName } = this.state;

    const listCategory = categoryName.map(category => ({
      value: category.categoryId,
      label: category.name
    }));

    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal}>
          <IntlMessages id="secondary.new" />
        </ModalHeader>
        <Formik
          initialValues={{
            category: "",
            categoryId: "",
            brand: "",
            distributor: "",
            productName: "",
            description: "",
            price: "",
            offerPrice: "",
            wholeSalePrice: "",
            unitWeight: "",
            offerProduct: false,
            sellable: false,
            imageUrl: ''
          }}
          onSubmit={val => this.submit(val)}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                {/* <Label className="mt-4">
                  <IntlMessages id="product.categoryName" />
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
                <Label className="mt-4">
                  <IntlMessages id="secondary.title" />
                </Label>
                <Input
                  name="brand"
                  type="text"
                  value={props.values.brand}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="secondary.description" />
                </Label>
                <Input
                  name="distributor"
                  type="text"
                  value={props.values.distributor}
                  onChange={props.handleChange}
                />

                <Label className="mt-4">
                  <IntlMessages id="secondary.price" />
                </Label>
                <Input
                  name="productName"
                  type="text"
                  value={props.values.productName}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="secondary.rating" />
                </Label>
                <Input
                  name="description"
                  type="text"
                  value={props.values.description}
                  onChange={props.handleChange}
                />
                {/* <Label className="mt-4">
                  <IntlMessages id="product.price" />
                </Label>
                <Input
                  name="price"
                  type="text"
                  value={props.values.price}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="Offer Product" />
                </Label>
                <Switch
                  name="offerProduct"
                  className="custom-switch custom-switch-primary"
                  onChange={checked =>
                    props.setFieldValue("offerProduct", checked)
                  }
                  checked={props.values.offerProduct}
                />

                {props.values.offerProduct == true ? (
                  <div>
                    <Label className="mt-4">
                      <IntlMessages id="Offer price" />
                    </Label>
                    <Input
                      name="offerPrice"
                      type="text"
                      value={props.values.offerPrice}
                      onChange={props.handleChange}
                    />
                  </div>
                ) : null}
                <Label className="mt-4">
                  <IntlMessages id="Wholesale Price" />
                </Label>
                <Input
                  name="wholeSalePrice"
                  type="text"
                  value={props.values.wholeSalePrice}
                  onChange={props.handleChange}
                />

                <Label className="mt-4">
                  <IntlMessages id="product.unitWeight" />
                </Label>
                <Input
                  name="unitWeight"
                  type="text"
                  value={props.values.unitWeight}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="Sellable" />
                </Label>

                <Switch
                  name="sellable"
                  className="custom-switch custom-switch-primary"
                  onChange={checked => props.setFieldValue("sellable", checked)}
                  checked={props.values.sellable}
                />
                <Label className="mt-4">
                  <IntlMessages id="product.image-upload" />
                </Label>
                <Input type='file' name='imageUrl'
                  onChange={(e) => this.addNewProduct(e, props)} /> */}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={toggleModal}>
                  <IntlMessages id="todo.cancel" />
                </Button>
                <Button
                  type="submit"
                  color="primary"
                // onClick={() => this.addNetItem()}
                >
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
)(AddNewProduct);

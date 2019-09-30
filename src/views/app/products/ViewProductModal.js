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

  submit = values => {
    console.log(values);
    const query = updateProduct(values);
    client(query)
      .then(res => {
        console.log("update shop", res);
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
      product,
      modalOpenValue
    } = this.props;
    const { categoryName } = this.state;
    console.log("product", product);
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
          <IntlMessages id="product.update" />
        </ModalHeader>
        <Formik
          initialValues={{
            category: product.categoryName,
            categoryId: product.categoryId,
            brand: product.brand,
            distributor: product.distributor,
            productName: product.englishName,
            description: product.description,
            price: product.price,
            offerPrice: product.offerPrice,
            wholeSalePrice: product.wholesalePrice,
            unitWeight: product.unitWeight,
            offerProduct: product.offerProduct,
            sellable: product.sellable,
            productId: product.id
          }}
          onSubmit={val => this.submit(val)}
        >
          {props => (
            <Form onSubmit={props.handleSubmit}>
              <ModalBody>
                <Label className="mt-4">
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
                />
                <Label className="mt-4">
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
                />

                <Label className="mt-4">
                  <IntlMessages id="product.name" />
                </Label>
                <Input
                  name="productName"
                  type="text"
                  value={props.values.productName}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
                  <IntlMessages id="product.description" />
                </Label>
                <Input
                  name="description"
                  type="text"
                  value={props.values.description}
                  onChange={props.handleChange}
                />
                <Label className="mt-4">
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

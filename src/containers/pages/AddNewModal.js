import React from "react";
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
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import client from "../../queries/client";
import updateOrderProducts from "../../queries/updateOrderProducts";
class AddNewModal extends React.Component {
  constructor(props) {
    super();
    console.log("===");
    this.state = {
      loading: false,
      productList: []
    };
  }

  componentDidMount() {
    const { primaryData } = this.props;
    // console.log("test", order);
    // if (order && order.products && order.products.length) {
      this.setState({ productList: primaryData });
    // }
  }

  decrementQuantity = data => {
    const { productList } = this.state;
    let newProductList = [];
    if (data.quantity == 1) {
      newProductList = productList.filter(c => c.id != data.id);
    } else {
      newProductList = productList.map(c => {
        if (c.id == data.id) {
          return {
            ...c,
            quantity: c.quantity - 1
          };
        } else {
          return c;
        }
      });
    }
    this.setState({ productList: newProductList });
  };

  incrementQuantity = data => {
    const { productList } = this.state;
    const newProductList = productList.map(c => {
      if (c.id == data.id) {
        return {
          ...c,
          quantity: c.quantity + 1
        };
      } else {
        return c;
      }
    });
    this.setState({ productList: newProductList });
  };

  handleQuantityChange = (productId, value) => {
    const { productList } = this.state;
    const newProductList =
      productList &&
      productList.map(product => {
        if (product.id === productId) {
          product.quantity = Number(value);
          return product;
        } else {
          return product;
        }
      });
    this.setState({ productList: newProductList });
  };

  handleUpdateProducts = () => {
    this.setState({ loading: true });
    const { productList } = this.state;
    const total = productList.reduce((res, item) => {
      const { quantity } = item;
      return res + quantity * item.price;
    }, 0);

    const updateQuery = updateOrderProducts(
      this.props.order.id,
      this.state.productList,
      total.toFixed(2)
    );
    client(updateQuery)
      .then(res => {
        console.log("update", res);
        this.props.toggleModal()
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log("Error ", error);
        this.setState({ loading: false });
      });
  };

  render() {
    const { modalOpen, toggleModal, categories, primaryData, onClose } = this.props;
   
    console.log("primaryData", primaryData);
    const closeBtn = (
      <button className="close" onClick={onClose}>
        &times;
      </button>
    );

    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        wrapClassName="modal-right"
        backdrop="static"
      >
        <ModalHeader toggle={toggleModal} close={closeBtn}>
          {/* <h3>Order Number: {primaryData && primaryData.id}</h3> */}
          Update
        </ModalHeader>
        {/* {primaryData &&
          products.map((product, index) => ( */}
            <ModalBody>
              {/* <Label>
                <h4>Item({index})</h4>
              </Label>
              <br /> */}
              <Label>
                {/* <img
                  style={{ height: 174, paddingLeft: 50 }}
                  src={order && product.imageUrl}
                  alt={order && product.imageUrl}
                /> */}
              </Label>
              <br />
              <Label className="mt-4">
                <IntlMessages id="pages.id" />
              </Label>
              <Input disabled value={primaryData.id} />
              <Label className="mt-4">
                <IntlMessages id="pages.total" />
              </Label>
              <Input value={primaryData.total}/>
              <Label className="mt-4">
                <IntlMessages id="pages.count" />
              </Label>
              <Input value={primaryData.count}/>
             
              {/* <div className="row" style={{ paddingLeft: 71 }}>
                <div>
                  <button
                    aria-label="Decrease Value"
                    className="value-button"
                    id="decrease"
                    value="Decrease Value"
                    style={{ cursor: "pointer" }}
                    // onClick={() => this.decrementQuantity(product)}
                    onClick={() => this.decrementQuantity(primaryData.count)}
                  >
                    -
                  </button>
                </div>
                <div>
                  <Input
                    style={{ height: 10, width: 50 }}
                    // value={order && product.quantity}
                    onChange={e => {
                      // this.handleQuantityChange(product.id, e.target.value);
                      this.handleQuantityChange(primaryData.id,e.target.value);
                    }}
                  />
                </div>
                <div>
                  <button
                    aria-label="increase Value"
                    className="value-button"
                    id="increase"
                    value="Increase Value"
                    style={{ cursor: "pointer" }}
                    // onClick={() => this.incrementQuantity(product)}
                    onClick={() => this.incrementQuantity(primaryData.count)}
                  >
                    +
                  </button>
                </div>
              </div> */}
              {/* <input
                          // className={classes.qtyInput}
                          type="number"
                          // value={row.quantity}
                          // onChange={e => {
                          //   this.handleQuantityChange(row.id, e.target.value);
                          // }}
                        /> */}
              <br />
              <Label className="mt-4">
                <IntlMessages id="pages.deliveryDate" />
              </Label>
              <Input value={primaryData.deliveryDate}/>
              <hr />
              {/* <Select
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-name"
          options={categories}
        />
        <Label className="mt-4">
          <IntlMessages id="pages.description" />
        </Label>
        <Input type="textarea" name="text" id="exampleText" />
        <Label className="mt-4">
          <IntlMessages id="pages.status" />
        </Label>
        <CustomInput
          type="radio"
          id="exCustomRadio"
          name="customRadio"
          label="ON HOLD"
        />
        <CustomInput
          type="radio"
          id="exCustomRadio2"
          name="customRadio"
          label="PROCESSED"
        /> */}
            </ModalBody>
          {/* ))} */}
        <ModalFooter>
          <Button color="secondary" outline onClick={onClose}>
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button color="primary" onClick={this.handleUpdateProducts}>
            <IntlMessages id="pages.update" />
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddNewModal;

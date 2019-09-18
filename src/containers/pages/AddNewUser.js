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
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from "../../helpers/IntlMessages";
import client from "../../queries/client";
import updateOrderProducts from "../../queries/updateOrderProducts";
import fetchShops from "../../queries/fetchShops";
class AddNewUser extends React.Component {
  constructor(props) {
    super();
    console.log("===", props);
    this.state = {
      loading: false,
      productList: [],
      shopName: [],
      selectedOption:"",
      selectValue:""
    };
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.fetchShops();
  }

  fetchShops = () => {
    const query = fetchShops();
    client(query)
      .then(res => {
        console.log("add user shops", res.data.shop);
        this.setState({ shopName: res.data.shop });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onSelect(option) {
    const selectedOption = option.label  
    const selectedValue = option.value;
    this.setState({ selectValue: selectedValue, selectedOption:selectedOption });
  }

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
        this.props.toggleModal();
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log("Error ", error);
        this.setState({ loading: false });
      });
  };

  render() {
    const { modalOpen, toggleModal, categories, order, onClose } = this.props;
    const { shopName,selectValue,selectedOption } = this.state;
    console.log("selectValue", selectValue);
    const listShop = shopName.map(shop => ({
      value: shop.id,
      label: shop.shopName
    }));
    console.log("listshop", listShop);
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
          <h3>Create User</h3>
        </ModalHeader>

        <ModalBody>
          <Label className="mt-4">
            <IntlMessages id="pages.user-name" />
          </Label>
          <Input />
          <Label className="mt-4">
            <IntlMessages id="pages.user-email" />
          </Label>
          <Input />
          <Label className="mt-4">
            <IntlMessages id="pages.user-password" />
          </Label>
          <Input />

          <Label className="mt-4">
            <IntlMessages id="pages.shopName" />
          </Label>
          <Dropdown
            options={listShop}
            value={selectedOption}
            onChange={this.onSelect}
            placeholder="Select Shop"
          />
          <Label className="mt-4">
            <IntlMessages id="pages.shopId" />
          </Label>
          <Input disabled value={selectValue}/>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={onClose}>
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button color="primary" onClick={this.handleUpdateProducts}>
            <IntlMessages id="pages.submit" />
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddNewUser;

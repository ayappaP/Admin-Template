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
      selectedOption: "",
      selectValue: "",
      name: "",
      email: "",
      success: "",
      error: ""
    };
    this.onSelect = this.onSelect.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    const selectedOption = option.label;
    const selectedValue = option.value;
    this.setState({
      selectValue: selectedValue,
      selectedOption: selectedOption
    });
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  done() {
    window.location.reload();
  }

  close = () => {
    this.setState(prevState => ({
      nestedModal: !prevState.nestedModal,
      closeAll: false
    }));
  };

  submit() {
    const data = {
      name: this.state.name,
      email: this.state.email,
      shopName: this.state.selectedOption,
      shopId: this.state.selectValue
    };
    console.log("data", data);
    const url =
      "https://743rzka0ah.execute-api.eu-west-2.amazonaws.com/dev/createAdminUser";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log("resssss", response);
        if (response.message == "Admin User created") {
          this.setState(prevState => ({
            success: response.message,
            nestedModal: !prevState.nestedModal
           
          }));
        } else {
          this.setState(prevState => ({
            error: response.error.message,
            nestedModal: !prevState.nestedModal
           
          }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { modalOpen, toggleModal, categories, order, onClose } = this.props;
    const {
      shopName,
      selectValue,
      selectedOption,
      success,
      error
    } = this.state;
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
          <Input
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <Label className="mt-4">
            <IntlMessages id="pages.user-email" />
          </Label>
          <Input
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          {/* <Label className="mt-4">
            <IntlMessages id="pages.user-password" />
          </Label>
          <Input /> */}

          <Label className="mt-4">
            <IntlMessages id="pages.shopName" />
          </Label>
          <Dropdown
            name="shopName"
            options={listShop}
            value={selectedOption}
            onChange={this.onSelect}
            placeholder="Select Shop"
          />
          <Label className="mt-4">
            <IntlMessages id="pages.shopId" />
          </Label>
          <Input name="shopId" disabled value={selectValue} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={onClose}>
            <IntlMessages id="pages.cancel" />
          </Button>
          <Button
            color="primary"
            disabled={
              (!this.state.email,
              !this.state.name,
              !this.state.selectedOption,
              !this.state.selectValue)
            }
            onClick={this.submit}
          >
            <IntlMessages id="pages.submit" />
          </Button>{" "}
        </ModalFooter>

        <Modal
          isOpen={this.state.nestedModal}
          toggle={this.toggleNested}
          onClosed={
            this.state.closeAll ? this.toggleNestedContainer : undefined
          }
        >
          {success ? (
            <ModalBody><h3>{success}</h3></ModalBody>
          ) : (
            <ModalBody><h3>{error}</h3></ModalBody>
          )}
          {/* {error ? (
            <ModalBody>{error}</ModalBody>
          ) : (
            <ModalBody>{error}</ModalBody>
          )} */}
          <ModalFooter>
            <Button color="primary" onClick={this.done}>
              Done
            </Button>
            <Button color="secondary" onClick={this.close}>
              Back
            </Button>
          </ModalFooter>
        </Modal>
      </Modal>
    );
  }
}

export default AddNewUser;

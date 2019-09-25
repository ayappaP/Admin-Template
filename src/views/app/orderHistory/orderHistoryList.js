import React, { Component, Fragment } from "react";
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  ButtonDropdown,
  CustomInput
} from "reactstrap";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";

import {
  getTodoList,
  getTodoListWithOrder,
  getTodoListSearch,
  selectedTodoItemsChange
} from "../../../redux/actions";
import OrderHistory from "./orderHistory";
// import ViewOfferModal from "./ViewOfferModal";

import TodoApplicationMenu from "../../../containers/applications/TodoApplicationMenu";
import client from "../../../queries/client";
import fetchOrderHistory from "../../../queries/fetchOrderHistory";
// import AddNewOffer from "./AddNewOffer";

class OrderHistoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      modalOpen: false,
      lastChecked: null,
      orderHistory: [],
      displayOptionsIsOpen: false
    };
  }

  componentDidMount() {
    this.fetchOrderHistory();
    this.props.getTodoList();
  }

  fetchOrderHistory = () => {
    // Auth.currentAuthenticatedUser()
    //   .then(res => {
    //     console.log("auth",res)
    //const shopId = res.attributes["custom:shopId"];
    const query = fetchOrderHistory();
    client(query)
      .then(res => {
        console.log("resss history", res);
        this.setState({
          orderHistory: res.data.order
        });
      })
      .catch(error => {
        console.log(error);
      });
    // })
    // .catch(console.log);
  };

  toggleDisplayOptions = () => {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  toggleModalValue = item => {
    this.setState({
      modalOpenValue: !this.state.modalOpenValue,
      selectedOffer: item
    });
  };

  toggleSplit = () => {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  };

  changeOrderBy = column => {
    this.props.getTodoListWithOrder(column);
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.props.getTodoListSearch(e.target.value);
    }
  };

  handleCheckChange = (event, id) => {
    if (this.state.lastChecked == null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = Object.assign([], this.props.todoApp.selectedItems);
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.props.selectedTodoItemsChange(selectedItems);

    if (event.shiftKey) {
      var items = this.props.todoApp.todoItems;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.props.selectedTodoItemsChange(selectedItems);
    }
    return;
  };
  handleClose = () => {
    this.setState({ modalOpenValue: false, selectedOffer: null });
  };
  handleChangeSelectAll = () => {
    if (this.props.todoApp.loading) {
      if (
        this.props.todoApp.selectedItems.length >=
        this.props.todoApp.todoItems.length
      ) {
        this.props.selectedTodoItemsChange([]);
      } else {
        this.props.selectedTodoItemsChange(
          this.props.todoApp.todoItems.map(x => x.id)
        );
      }
    }
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }

  render() {
    const {
      todoItems,
      searchKeyword,
      loading,

      orderColumn,
      orderColumns,
      selectedItems
    } = this.props.todoApp;

    const { messages } = this.props.intl;

    const { modalOpen, offer, modalOpenValue, orderHistory } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>
                <IntlMessages id="menu.orderHistory" />
              </h1>
            
              <Breadcrumb match={this.props.match} />
            </div>

            <Separator className="mb-5" />
            <Row>
              {loading ? (
                orderHistory &&
                orderHistory.map((item, index) => (
                  <OrderHistory
                    key={`todo_item_${index}`}
                    item={item}
                    isSelected={
                      loading ? selectedItems.includes(item.id) : false
                    }
                  />
                ))
              ) : (
                <div className="loading" />
              )}
            </Row>
          </Colxx>
        </Row>
        {/* {this.state.selectedOffer && (
          <ViewOfferModal
            modalOpenValue={modalOpenValue}
            toggleModalValue={this.toggleModalValue}
            offer={this.state.selectedOffer}
            onClose={this.handleClose}
          />
        )} */}

        {/* <AddNewOffer toggleModal={this.toggleModal} modalOpen={modalOpen} /> */}
      </Fragment>
    );
  }
}
const mapStateToProps = ({ todoApp }) => {
  return {
    todoApp
  };
};
export default injectIntl(
  connect(
    mapStateToProps,
    {
      getTodoList,
      getTodoListWithOrder,
      getTodoListSearch,
      selectedTodoItemsChange
    }
  )(OrderHistoryList)
);

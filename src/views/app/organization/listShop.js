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
import ShopsListView from "./shopsListView";
import AddNewShop from "./AddNewShop";
import ViewShopModal from "./ViewShopModal";
import {ListOrganizationData} from "../../../data/organizationData"
import TodoApplicationMenu from "../../../containers/applications/TodoApplicationMenu";
import client from "../../../queries/client";
import fetchShops from "../../../queries/fetchShops";

class ListShop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      modalOpenValue: false,
      lastChecked: null,
      ListOrganizationData,
      shops: [],
      displayOptionsIsOpen: false
    };
  }

  componentDidMount() {
    this.fetchShops();
    this.props.getTodoList();
  }

  fetchShops = () => {
    // Auth.currentAuthenticatedUser()
    //   .then(res => {
    //     console.log("auth",res)
    //const shopId = res.attributes["custom:shopId"];
    const query = fetchShops();
    client(query)
      .then(res => {
        console.log("resss shop", res);
        this.setState({
          shops: res.data.shop
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
      selectedItem: item
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
    this.setState({ modalOpenValue: false,modalOpen:false, selectedItem: null });
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

    const { modalOpen, ListOrganizationData, modalOpenValue } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>
                <IntlMessages id="menu.organization" />
              </h1>
              {loading && (
                <div className="text-zero top-right-button-container">
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button"
                    onClick={this.toggleModal}
                  >
                    <IntlMessages id="todo.add-new" />
                  </Button>{" "}
                  {/* <ButtonDropdown
                    isOpen={this.state.dropdownSplitOpen}
                    toggle={this.toggleSplit}
                  >
                    <div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
                      <CustomInput
                        className="custom-checkbox mb-0 d-inline-block"
                        type="checkbox"
                        id="checkAll"
                        checked={selectedItems.length >= todoItems.length}
                        onClick={() => this.handleChangeSelectAll()}
                        onChange={() => this.handleChangeSelectAll()}
                        label={
                          <span
                            className={`custom-control-label ${
                              selectedItems.length > 0 &&
                              selectedItems.length < todoItems.length
                                ? "indeterminate"
                                : ""
                            }`}
                          />
                        }
                      />
                    </div>
                    <DropdownToggle
                      caret
                      color="primary"
                      className="dropdown-toggle-split btn-lg"
                    />
                    <DropdownMenu right>
                      <DropdownItem>
                        <IntlMessages id="todo.action" />
                      </DropdownItem>
                      <DropdownItem>
                        <IntlMessages id="todo.another-action" />
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown> */}
                </div>
              )}
              <Breadcrumb match={this.props.match} />
            </div>

            <Separator className="mb-5" />
            <Row>
              {loading ? (
                ListOrganizationData.map((item, index) => (
                  <ShopsListView
                    key={`todo_item_${index}`}
                    ListOrganizationData={item}
                    toggleModalValue={() => this.toggleModalValue(item)}
                    handleCheckChange={this.handleCheckChange}
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
        {this.state.selectedItem && (
          <ViewShopModal
            modalOpenValue={modalOpenValue}
            toggleModalValue={this.handleClose}
            ListOrganizationData={this.state.selectedItem}
            onClose={this.handleClose}
            reloadShopList={this.fetchShops}
          />
        )}
        {/* {loading && <TodoApplicationMenu />} */}
        <AddNewShop
          toggleModal={this.toggleModal}
          modalOpen={modalOpen}
          onClose={this.handleClose}
          reloadShopList={this.fetchShops}
        />
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
  )(ListShop)
);

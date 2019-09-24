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
import CarouselListView from "./carouselListView";
import AddNewCarousel from "./AddNewCarousel";
import ViewCarouselModal from "./ViewCarouselModal";

import TodoApplicationMenu from "../../../containers/applications/TodoApplicationMenu";
import client from "../../../queries/client"
import fetchCarousel from "../../../queries/fetchCarousel"


class ListCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      modalOpen:false,
      lastChecked: null,
      carousel:[],
      displayOptionsIsOpen: false
    };
  }

  componentDidMount() {
    this.fetchCarousel();
    this.props.getTodoList();
  }

  fetchCarousel = () => {
    // Auth.currentAuthenticatedUser()
    //   .then(res => {
    //     console.log("auth",res)
    //const shopId = res.attributes["custom:shopId"];
    const query = fetchCarousel();
    client(query)
      .then(res => {
        console.log("resss car",res)
        this.setState({
          carousel: res.data.carousel
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
    this.setState({ modalOpenValue: false, selectedItem: null });
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

    const { modalOpen,carousel,modalOpenValue } = this.state;
    return (
      <Fragment>
        <Row >
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>
                <IntlMessages id="menu.carousel" />
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

            {/* <div className="mb-2">
              <Button
                color="empty"
                className="pt-0 pl-0 d-inline-block d-md-none"
                onClick={this.toggleDisplayOptions}
              >
                <IntlMessages id="todo.display-options" />{" "}
                <i className="simple-icon-arrow-down align-middle" />
              </Button>
              <Collapse
                id="displayOptions"
                className="d-md-block"
                isOpen={this.state.displayOptionsIsOpen}
              >
                <div className="d-block mb-2 d-md-inline-block">
                  <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                    <DropdownToggle caret color="outline-dark" size="xs">
                      <IntlMessages id="todo.orderby" />
                      {orderColumn ? orderColumn.label : ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {orderColumns.map((o, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => this.changeOrderBy(o.column)}
                          >
                            {o.label}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                    <input
                      type="text"
                      name="keyword"
                      id="search"
                      placeholder={messages["menu.search"]}
                      defaultValue={searchKeyword}
                      onKeyPress={e => this.handleKeyPress(e)}
                    />
                  </div>
                </div>
              </Collapse>
            </div> */}
            <Separator className="mb-5" />
            <Row>
              {loading ? (
                carousel.map((item, index) => (
                  <CarouselListView
                    key={`todo_item_${index}`}
                    item={item}
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
            <ViewCarouselModal
              modalOpenValue={modalOpenValue}
              toggleModalValue={this.toggleModalValue}
              carousel={this.state.selectedItem}
              onClose={this.handleClose}
            />
          )}
        {/* {loading && <TodoApplicationMenu />} */}
        <AddNewCarousel toggleModal={this.toggleModal} modalOpen={modalOpen} />
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
  )(ListCarousel)
);

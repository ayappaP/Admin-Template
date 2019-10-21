import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Auth } from "aws-amplify";
import axios from "axios";
import client from "../../../queries/client";
import fetchStaff from "../../../queries/fetchStaff";
import fetchAllStaff from "../../../queries/fetchAllStaff";
import { servicePath } from "../../../constants/defaultValues";
import UserDataListView from "../../../containers/pages/UserDataListView";
import Pagination from "../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import UserListPageHeading from "../../../containers/pages/UserListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
import AddNewUser from "../../../containers/pages/AddNewUser";
import ViewUserModal from "./ViewUserModal";
import {userData} from "../../../data/userData"
//import { SubscriptionClient } from "subscriptions-transport-ws";
// import gql from "graphql-tag";

function collect(props) {
  return { data: props.data };
}
const apiUrl = servicePath + "/cakes/paging";

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require("mousetrap");
    this.startSubscription = false;
    this.state = {
      displayMode: "list",
      orders: [],
      users: [],
      selectedPageSize: 10,
      userData,
      orderOptions: [
        { column: "title", label: "Product Name" },
        { column: "category", label: "Category" },
        { column: "status", label: "Status" }
      ],
      pageSizes: 10,

      categories: [
        { label: "Cakes", value: "Cakes", key: 0 },
        { label: "Cupcakes", value: "Cupcakes", key: 1 },
        { label: "Desserts", value: "Desserts", key: 2 }
      ],

      selectedOrderOption: { column: "title", label: "Product Name" },
      dropdownSplitOpen: false,
      modalOpen: false,
      modalOpenValue: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: "",
      selectedItems: [],
      lastChecked: null,
      userCount: 0,
      isLoading: false
    };
  }
  componentDidMount() {
    this.dataListRender();
    this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });
    this.fetchStaff();
  }

  fetchStaff = () => {
    Auth.currentAuthenticatedUser()
      .then(res => {
        console.log("auth", res);
        const shopId = res.attributes["custom:shopId"];
        console.log("shopId", shopId);
        const role = res.attributes["custom:role"];
        console.log("role", role);
        let query = fetchStaff(shopId);
        if ((role == "Super")) {
          query = fetchAllStaff();
        } 
        client(query)
          .then(res => {
            this.setState({
              users: res.data.staff,
              userCount: res.data.staff.length
            });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(console.log);
  };

  componentWillUnmount() {
    this.mouseTrap.unbind("ctrl+a");
    this.mouseTrap.unbind("command+a");
    this.mouseTrap.unbind("ctrl+d");
    this.mouseTrap.unbind("command+d");
  }

  toggleModal = users => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedUser: users
    });
  };
  toggleModalValue = users => {
    this.setState({
      modalOpenValue: !this.state.modalOpenValue,
      selectedUser: users
    });
  };
  handleClose = () => {
    this.setState({
      modalOpen: false,
      modalOpenValue: false,
      selectedUser: null
    });
    this.fetchStaff();
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        )
      },
      () => this.dataListRender()
    );
  };
  changePageSize = size => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.dataListRender()
    );
  };
  changeDisplayMode = mode => {
    this.setState({
      displayMode: mode
    });
    return false;
  };
  onChangePage = page => {
    this.setState(
      {
        currentPage: page
      },
      () => this.fetchStaff()
    );
  };

  onSearchKey = e => {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.dataListRender()
      );
    }
  };

  onCheckItem = (event, id) => {
    if (
      event.target.tagName === "A" ||
      (event.target.parentElement && event.target.parentElement.tagName === "A")
    ) {
      return true;
    }
    if (this.state.lastChecked === null) {
      this.setState({
        lastChecked: id
      });
    }

    let selectedItems = this.state.selectedItems;
    if (selectedItems.includes(id)) {
      selectedItems = selectedItems.filter(x => x !== id);
    } else {
      selectedItems.push(id);
    }
    this.setState({
      selectedItems
    });

    if (event.shiftKey) {
      var items = this.state.items;
      var start = this.getIndex(id, items, "id");
      var end = this.getIndex(this.state.lastChecked, items, "id");
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...items.map(item => {
          return item.id;
        })
      );
      selectedItems = Array.from(new Set(selectedItems));
      this.setState({
        selectedItems
      });
    }
    document.activeElement.blur();
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  handleChangeSelectAll = isToggle => {
    if (this.state.selectedItems.length >= this.state.items.length) {
      if (isToggle) {
        this.setState({
          selectedItems: []
        });
      }
    } else {
      this.setState({
        selectedItems: this.state.items.map(x => x.id)
      });
    }
    document.activeElement.blur();
    return false;
  };

  dataListRender() {
    const {
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    } = this.state;
    axios
      .get(
        `${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`
      )
      .then(res => {
        return res.data;
      })
      .then(data => {
        this.setState({
          totalPage: data.totalPage,
          items: data.data,
          selectedItems: [],
          totalItemCount: data.totalItem,
          isLoading: true
        });
      });
  }

  onContextMenuClick = (e, data, target) => {
    console.log(
      "onContextMenuClick - selected items",
      this.state.selectedItems
    );
    console.log("onContextMenuClick - action : ", data.action);
  };

  onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!this.state.selectedItems.includes(clickedProductId)) {
      this.setState({
        selectedItems: [clickedProductId]
      });
    }

    return true;
  };

  render() {
    const {
      currentPage,
      items,
      displayMode,
      selectedPageSize,
      totalItemCount,
      selectedOrderOption,
      selectedItems,
      orderOptions,
      pageSizes,
      modalOpen,
      modalOpenValue,
      users,
      userCount,
      userData,
      categories
    } = this.state;

    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * userCount;
    console.log("endIndex", endIndex);
    const totalPageSize = Math.ceil(userCount / pageSizes);
    console.log("totalPageSize", totalPageSize);
    const orders = this.state.orders;
    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <UserListPageHeading
            heading="menu.users"
            displayMode={displayMode}
            changeDisplayMode={this.changeDisplayMode}
            handleChangeSelectAll={this.handleChangeSelectAll}
            changeOrderBy={this.changeOrderBy}
            changePageSize={this.changePageSize}
            selectedPageSize={selectedPageSize}
            //totalItemCount={totalItemCount}
            userCount={userCount}
            selectedOrderOption={selectedOrderOption}
            match={match}
            startIndex={startIndex}
            endIndex={endIndex}
            selectedItemsLength={selectedItems ? selectedItems.length : 0}
            itemsLength={this.state.orders ? this.state.orders.length : 0}
            onSearchKey={this.onSearchKey}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            toggleModal={this.toggleModal}
          />

          <AddNewUser
            modalOpen={modalOpen}
            toggleModal={this.handleClose}
            order={this.state.selectedOrder}
            onClose={this.handleClose}
          />
          <Row>
            {userData.map(users => {
              // console.log("items",this.state.items)
              // console.log("orders",this.state.orders)
              if (this.state.displayMode === "imagelist") {
                return (
                  <ImageListView
                    key={users.id}
                    users={users}
                    isSelect={this.state.selectedItems.includes(users.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                );
              } else if (this.state.displayMode === "thumblist") {
                return (
                  <ThumbListView
                    key={users.id}
                    users={users}
                    isSelect={this.state.selectedItems.includes(users.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                );
              } else {
                return (
                  <UserDataListView
                    key={users.id}
                    users={users}
                    isSelect={this.state.selectedItems.includes(users.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                    toggleModal={() => this.toggleModal(users)}
                    toggleModalValue={() => this.toggleModalValue(users)}
                    order={this.state.selectedOrder}
                  />
                );
              }
            })}{" "}
            <Pagination
              currentPage={this.state.currentPage}
              totalPageSize={totalPageSize}
              onChangePage={i => this.onChangePage(i)}
            />
            {this.state.selectedUser && (
              <ViewUserModal
                modalOpenValue={modalOpenValue}
                toggleModalValue={this.handleClose}
                user={this.state.selectedUser}
                onClose={this.handleClose}
              />
            )}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default ListUsers;

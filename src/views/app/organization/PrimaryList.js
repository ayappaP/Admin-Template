import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Auth } from "aws-amplify";

import axios from "axios";
import client from "../../../queries/client";
import fetchOrganizations from "../../../queries/fetchOrganizations";
import fetchAllOrders from "../../../queries/fetchAllOrders";
import { servicePath } from "../../../constants/defaultValues";
import DataListView from "./DataListView";
import Pagination from "./Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import ListPageHeading from "./ListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
import PrimaryUpdateModal from "./PrimaryUpdateModal";
import AddNewPrimary from "./AddNewPrimary";
import { SubscriptionClient } from "subscriptions-transport-ws";
import gql from "graphql-tag";
import { NotificationManager } from "../../../components/common/react-notifications";
// import { primaryData } from "../../../data/primaryData";

function collect(props) {
  return { data: props.data };
}

// const GRAPHQL_ENDPOINT = "wss://arokiya.7zero.com/v1/graphql";

const createNotification = (msg, req) => {
  NotificationManager.primary(req, msg, 5000, null, null);
};

// const wsclient = new SubscriptionClient(
//   process.env.REACT_APP_GATSBY_GRAPHQL_SUBSCRIPTION_ENDPOINT,
//   {
//     reconnect: true,
//     connectionParams: {
//       headers: {
//         // "x-hasura-admin-secret": "9J8q3FCeFH63Rzqb"
//         "x-hasura-admin-secret":
//           process.env.REACT_APP_GATSBY_X_HASURA_ADMIN_SECRET
//       }
//     }
//   }
// );

class Orders extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require("mousetrap");
    this.startSubscription = false;
    this.state = {
      displayMode: "list",
      orders: [],
      primaryData:[],
      selectedPageSize: 5,
      orderOptions: [
        { column: "desc", label: "Latest" },
        { column: "asc", label: "Older" },
      ],
      pageSizes: [5, 10],

      categories: [
        { label: "Cakes", value: "Cakes", key: 0 },
        { label: "Cupcakes", value: "Cupcakes", key: 1 },
        { label: "Desserts", value: "Desserts", key: 2 }
      ],

      selectedOrderOption: { column: "asc", label: "Older" },
      dropdownSplitOpen: false,
      modalOpen: false,
      modalOpenValue: false,
      currentPage: 1,
      totalItemCount: 0,
      totalPage: 1,
      search: null,
      primaryTotalCount: 0,
      selectedItems: [],
      lastChecked: null,
      isLoading: false
    };
  }
  componentDidMount() {
    // this.dataListRender();
    this.mouseTrap.bind(["ctrl+a", "command+a"], () =>
      this.handleChangeSelectAll(false)
    );
    this.mouseTrap.bind(["ctrl+d", "command+d"], () => {
      this.setState({
        selectedItems: []
      });
      return false;
    });
    this.fetchPrimary();
    // wsclient
    //   .request({
    //     query: gql`
    //       subscription {
    //         order(
    //           where: { reference: { _is_null: false } }
    //           order_by: { createdAt: desc }
    //           limit: 1
    //         ) {
    //           id
    //           createdAt
    //           total
    //         }
    //       }
    //     `
    //   })
    //   .subscribe({
    //     next: result => {
    //       if (this.startSubscription) {
    //         // console.log(result)
    //         this.showBrowserNotification();
    //         // this.props.changeOpenSnackBar();
    //         createNotification("You have new order");
    //         this.fetchPrimary();
    //       } else {
    //         this.startSubscription = true;
    //       }
    //     },
    //     complete: () => {
    //       console.log("completed");
    //     },
    //     error: error => {
    //       console.log(error);
    //     }
    //   });
  }

  fetchPrimary = () => {
    Auth.currentAuthenticatedUser()
      .then(res => {
        const {search, selectedPageSize,currentPage, selectedOrderOption } = this.state;
        // console.log(search)
        const shopId = res.attributes["custom:shopId"];
        const role = res.attributes["custom:role"];

        const offset = (currentPage - 1) * selectedPageSize;
        const searchString = search ? `"%${search}%"` : null;

        let query = fetchOrganizations(searchString , selectedPageSize, offset, selectedOrderOption.column);
        if (role == "Super") {
          query = fetchOrganizations(searchString , selectedPageSize, offset, selectedOrderOption.column);
        }
        client(query)
          .then(res => {
            // console.log(res)
            this.setState({
              primaryData: res.data.organization,
              primaryTotalCount: res.data.organization_aggregate.aggregate.count,
              isLoading: true,
              totalItemCount: res.data.organization_aggregate.aggregate.count 
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

  toggleModal = primaryData  => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedPrimaryData: primaryData  
    });
  };
  toggleModalValue = primaryData   => {
    this.setState({
      modalOpenValue: !this.state.modalOpenValue,
      selectedPrimaryData: primaryData  
    });
  };

  handleClose = () => {
    this.setState({
      modalOpenValue: false,
      modalOpen: false,
      selectedPrimaryData: null
    });
  };

  changeOrderBy = column => {
    this.setState(
      {
        selectedOrderOption: this.state.orderOptions.find(
          x => x.column === column
        ),
        currentPage: 1
      },
      () => this.fetchPrimary()
    );
  };
  changePageSize = size => {
    this.setState(
      {
        selectedPageSize: size,
        currentPage: 1
      },
      () => this.fetchPrimary()
    );
  };
  changeDisplayMode = mode => {
    this.setState({
      displayMode: mode
    });
    return false;
  };
  onChangePage = page => {
    // console.log("page", page);
    this.setState(
      {
        currentPage: page
      },
      () => this.fetchPrimary()
    );
  };

  onSearchKey = e => {
    if (e.key === "Enter") {
      this.setState(
        {
          search: e.target.value.toLowerCase()
        },
        () => this.fetchPrimary()
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
    // const {
    //   selectedPageSize,
    //   currentPage,
    //   selectedOrderOption,
    //   search
    // } = this.state;
    // axios
    //   .get(
    //     `${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`
    //   )
    //   .then(res => {
    //     // console.log("data res", res);
    //     return res.data;
    //   })
    //   .then(data => {
    //     this.setState({
    //       // totalPage: data.totalPage,
    //       items: data.data,
    //       selectedItems: [],
    //       totalItemCount: data.totalItem,
    //       isLoading: true
    //     });
    //   });
  }

  onContextMenuClick = (e, data, target) => {
    // console.log(
    //   "onContextMenuClick - selected items",
    //   this.state.selectedItems
    // );
    // console.log("onContextMenuClick - action : ", data.action);
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

  showBrowserNotification = () => {
    // if (Notification.permission != "granted") {
    //   alert("You have a new order");
    // }
    console.log("notification");
    new Notification("You have a new order", { tag: "newOrderNotification" });
    // } else if (Notification.permission !== "denied") {
    //     Notification.requestPermission(function (status) {
    //         if (status === "granted") {
    //             new Notification("You have a new order", { tag: 'newOrderNotification' })
    //         }
    //     });
    // }
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
      totalPage,
      orderOptions,
      pageSizes,
      modalOpen,
      modalOpenValue,
      primaryTotalCount,
      categories,
      primaryData
    } = this.state;
    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    const endIndex = currentPage * selectedPageSize;
    const totalPageSize = Math.ceil(primaryTotalCount / selectedPageSize);
    // const orders = primaryData;
    // console.log("orders",primaryData)
    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <ListPageHeading
            heading="menu.organization"
            displayMode={displayMode}
            changeDisplayMode={this.changeDisplayMode}
            handleChangeSelectAll={this.handleChangeSelectAll}
            changeOrderBy={this.changeOrderBy}
            changePageSize={this.changePageSize}
            selectedPageSize={selectedPageSize}
            totalItemCount={totalItemCount}
            primaryTotalCount={primaryTotalCount}
            toggleModal
            selectedOrderOption={selectedOrderOption}
            match={match}
            startIndex={startIndex}
            endIndex={endIndex}
            selectedItemsLength={selectedItems ? selectedItems.length : 0}
            itemsLength={this.state.orders ? this.state.orders.length : 0}
            onSearchKey={this.onSearchKey}
            orderOptions={orderOptions}
            pageSizes={pageSizes}
            toggleModalValue={this.toggleModalValue}
          />
          {this.state.selectedPrimaryData && (
            <PrimaryUpdateModal
              modalOpen={modalOpen}
              toggleModal={this.toggleModal}
              categories={categories}
              primaryData={this.state.selectedPrimaryData}
              onClose={this.handleClose}
            />
          )}
          <AddNewPrimary
            modalOpenValue={modalOpenValue}
            toggleModalValue={this.toggleModalValue}
            primaryData ={this.state.selectedProduct}
            onClose={this.handleClose}
          />
          <Row>
            {primaryData.map(primaryData => {
              // console.log("items",this.state.items)
              // console.log("orders",this.state.orders)
              if (this.state.displayMode === "imagelist") {
                return (
                  <ImageListView
                    key={primaryData.id}
                    primaryData={primaryData}
                    isSelect={this.state.selectedItems.includes(primaryData.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                );
              } else if (this.state.displayMode === "thumblist") {
                return (
                  <ThumbListView
                    key={primaryData.id}
                    primaryData={primaryData}
                    isSelect={this.state.selectedItems.includes(primaryData.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                );
              } else {
                return (
                  <DataListView
                    key={primaryData.id}
                    primaryData={primaryData}
                    isSelect={this.state.selectedItems.includes(primaryData.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                    toggleModal={() => this.toggleModal(primaryData)}
                    order={this.state.selectedPrimaryData}
                  />
                );
              }
            })}{" "}
            <Pagination
              currentPage={this.state.currentPage}
              totalPage={totalPageSize}
              onChangePage={i => this.onChangePage(i)}
            />
            {/* <ContextMenuContainer
              onContextMenuClick={this.onContextMenuClick}
              onContextMenu={this.onContextMenu}
            /> */}
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default Orders;

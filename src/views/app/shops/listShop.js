import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Auth } from "aws-amplify";
import axios from "axios";
import client from "../../../queries/client";
import fetchShops from "../../../queries/fetchShops";
import { servicePath } from "../../../constants/defaultValues";
import ShopsListView from "./shopsListView";
import Pagination from "../../../containers/pages/Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import UserListPageHeading from "../../../containers/pages/UserListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
import AddNewShop from "../../../containers/pages/AddNewShop";
import { SubscriptionClient } from "subscriptions-transport-ws";
import IntlMessages from "../../../helpers/IntlMessages";
import gql from "graphql-tag";

function collect(props) {
  return { data: props.data };
}
const apiUrl = servicePath + "/cakes/paging";

class ListShop extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require("mousetrap");
    this.startSubscription = false;
    this.state = {
      displayMode: "list",
      orders: [],
      products: [],
      shops:[],
      selectedPageSize: 10,
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
    this.fetchShops();
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
    
  }

  fetchShops = () => {
    const query = fetchShops();
    client(query)
      .then(res => {
        console.log("res shop", res);
        this.setState({
          shops: res.data.shop
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillUnmount() {
    this.mouseTrap.unbind("ctrl+a");
    this.mouseTrap.unbind("command+a");
    this.mouseTrap.unbind("ctrl+d");
    this.mouseTrap.unbind("command+d");
  }

  toggleModal = shop => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedOrder: shop
    });
  };

  handleClose = () => {
    this.setState({ modalOpen: false, selectedOrder: null });
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
      () => this.fetchUsers()
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
      users,
      userCount,
      products,
      shops,
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
        <h1>
                <IntlMessages id="menu.shops" />
              </h1>
             {/* <Button
                    color="primary"
                    size="lg"
                    className="top-right-button"
                    onClick={this.toggleModal}
                  >
                    <IntlMessages id="todo.add-new" />
                  </Button>{" "} */}
        

            <AddNewShop
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            categories={categories}
            order={this.state.selectedOrder}
            onClose={this.handleClose}
          />  
          <Row>
            {shops.map(shops => {
               console.log("shops===>",shops)
              // console.log("orders",this.state.orders)
              if (this.state.displayMode === "imagelist") {
                return (
                  <ImageListView
                    key={shops.id}
                    shops={shops}
                    isSelect={this.state.selectedItems.includes(shops.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                );
              } else if (this.state.displayMode === "thumblist") {
                return (
                  <ThumbListView
                    key={shops.id}
                    shops={shops}
                    isSelect={this.state.selectedItems.includes(shops.id)}
                    collect={collect}
                    onCheckItem={this.onCheckItem}
                  />
                );
              } else {
                return (
                  <ShopsListView
                    key={shops.id}
                    shops={shops}
                    isSelect={this.state.selectedItems.includes(shops.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                    toggleModal={() => this.toggleModal(shops)}
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
export default ListShop;

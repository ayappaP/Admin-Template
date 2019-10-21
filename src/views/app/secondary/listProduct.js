import React, { Component, Fragment } from "react";
import { Row, Button } from "reactstrap";
import { Auth } from "aws-amplify";
import axios from "axios";
import client from "../../../queries/client";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import fetchProducts from "../../../queries/fetchProducts";
import allProductsCount from "../../../queries/allProductsCounts";
import { servicePath } from "../../../constants/defaultValues";
import ProductListView from "./productListView";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import IntlMessages from "../../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import Pagination from "./Pagination";
import ContextMenuContainer from "../../../containers/pages/ContextMenuContainer";
import UserListPageHeading from "../../../containers/pages/UserListPageHeading";
import ImageListView from "../../../containers/pages/ImageListView";
import ThumbListView from "../../../containers/pages/ThumbListView";
import ViewProductModal from "./ViewProductModal";
import AddNewProduct from "./AddNewProduct";
import AddNewUser from "../../../containers/pages/AddNewUser";
import { SubscriptionClient } from "subscriptions-transport-ws";
import gql from "graphql-tag";
import ListPageHeading from "../../../containers/pages/ListPageHeading";
import { ListSecondaryData } from "../../../data/secondaryData"

function collect(props) {
  return { data: props.data };
}
const apiUrl = servicePath + "/cakes/paging";

class ListProduct extends Component {
  constructor(props) {
    super(props);
    this.mouseTrap = require("mousetrap");
    this.startSubscription = false;
    this.state = {
      displayMode: "list",
      orders: [],
      products: [],
      ListSecondaryData,
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
    this.fetchTotalCount();
    this.fetchProducts();
  }

  fetchTotalCount = () => {
    // Fetch all products
    const countQuery = allProductsCount();
    client(countQuery)
      .then(res => {
        // console.log("all products", res);
        const total = res.data.product ? res.data.product.length : 0;
        this.setState({
          totalItemCount: total,
          totalPage: Math.round(total / 10),
          isLoading: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  fetchProducts = () => {
    const { currentPage, totalItemCount, totalPage } = this.state;
    const offset = (currentPage - 1) * 10;

    const query = fetchProducts(offset);
    client(query)
      .then(res => {
        console.log("res products", res);
        this.setState({
          products: res.data.product
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

  toggleModal = ListSecondaryData => {
   
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedsecondaryData: ListSecondaryData
    });
  };
  toggleModalValue = item => {
    console.log(ListSecondaryData)
    this.setState({
      modalOpenValue: !this.state.modalOpenValue,
      selectedsecondaryData: item
    });
  };
  handleClose = () => {
    this.setState({ modalOpenValue: false,modalOpen: false, selectedsecondaryData: null });
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
      () => this.fetchProducts()
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
    //     return res.data;
    //   })
    //   .then(data => {
    //     this.setState({
    //       totalPage: data.totalPage,
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
      products,
      ListSecondaryData,
      isLoading,
      categories
    } = this.state;

    const { match } = this.props;
    const startIndex = (currentPage - 1) * selectedPageSize;
    // console.log("startIndex", startIndex);
    const endIndex = currentPage * userCount;
    // console.log("endIndex", endIndex);
    const totalPageSize = Math.ceil(userCount / pageSizes);
    // console.log("totalPageSize", totalPageSize);
    const orders = this.state.orders;
    return !this.state.isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>
                <IntlMessages id="menu.secondary" />
              </h1>
              {isLoading && (
                <div className="text-zero top-right-button-container">
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button"
                    onClick={this.toggleModal}
                  >
                    <IntlMessages id="todo.add-new" />
                  </Button>{" "}
                </div>
              )}
              <Breadcrumb match={this.props.match} />
            </div>

            <Separator className="mb-5" />
            <Row>
              {isLoading ? (
                // products &&
                ListSecondaryData.map((ViewSecondaryData, index) => (
                  <ProductListView
                    key={ListSecondaryData.id}
                    ListSecondaryData={ViewSecondaryData}
                    toggleModalValue={() => this.toggleModalValue(ViewSecondaryData)}
                    isSelect={this.state.selectedItems.includes(ListSecondaryData.id)}
                    onCheckItem={this.onCheckItem}
                    collect={collect}
                    // toggleModal={() => this.toggleModal(ViewSecondaryData)}
                    order={this.state.selectedsecondaryData}
                  />
                ))
              ) : (
                <div className="loading" />
              )}
            </Row>
          </Colxx>
        </Row>
        {this.state.selectedsecondaryData && (
          <ViewProductModal
            modalOpenValue={modalOpenValue}
            toggleModalValue={this.toggleModalValue}
            selectedsecondaryData={this.state.selectedsecondaryData}
            reloadProductList={this.fetchProducts}
            onClose={this.handleClose}
          />
         )} 
        <Pagination
          currentPage={this.state.currentPage}
          totalPage={this.state.totalPage}
          onChangePage={i => this.onChangePage(i)}
        />

        <AddNewProduct
          toggleModal={this.toggleModal}
          modalOpen={modalOpen}
          reloadProductList={this.fetchProducts}
          onClose={this.handleClose}
        />
      </Fragment>
    );
  }
}
export default ListProduct;

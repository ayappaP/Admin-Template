import React from "react";
import { Card, CustomInput, Badge } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../components/common/CustomBootstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import client from "../../queries/client";
import updateOrderStatus from '../../queries/updateOrderStatus';
// const DataListView = ({
//   product,
//   isSelect,
//   collect,
//   onCheckItem,
//   toggleModal,
//   order
// }) =>

class DataListView extends React.Component{
  constructor(props) {
    super()
    this.state = {
        product: props.product,
    }
    this.onSelect = this.onSelect.bind(this)
}


  onSelect(option) {
    const selectStatus = option.label
    // console.log("select", selectStatus)
    const orderID = this.props.product.reference
    const UpdateStatus = updateOrderStatus(selectStatus, orderID)
    client(UpdateStatus).then(res => {
        const product = { ...this.state.product, status: selectStatus }
           console.log("update res",res)
        this.setState({ product })
    }).catch((error) => {
        console.log(error)
    });
}

render(){
const { 
  // product,
    isSelect,
    collect,
    onCheckItem,
    toggleModal,
    order,
  selectStatus
  } = this.props
  const product =this.state.product
  const dateTime =
    product.createdAt.slice(0, 10) + " / " + product.createdAt.slice(11, 19);
  const address = `${product.address.city} ${product.address.region} ${product.address.address} ${product.address.address2} ${product.address.postcode}`;

  return (
    <Colxx xxs="12" className="mb-3">
      <ContextMenuTrigger id="menu_id" data={product.id} collect={collect}>
        <Card
          onClick={event => onCheckItem(event, product.id)}
          className={classnames("d-flex flex-row", {
            active: isSelect
          })}
        >
          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
            <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
              {/* <NavLink to={`?p=${product.id}`} className="w-40 w-sm-100"> */}
              <Badge color={product.statusColor} pill onClick={toggleModal}>
                {product.reference}
              </Badge>
              {/* </NavLink> */}
              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                {product.type}
              </p>
              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                {dateTime}
              </p>
              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                {product.products && product.products.length
                  ? product.products[0].quantity
                  : 0}
              </p>
              <p className="mb-1 text-muted text-small w-15 w-sm-100">
                {product.type == "COLLECTION" ? "-" : address}
              </p>
              <div className="w-15 w-sm-100">
                {/* <p className="list-item-heading mb-1 truncate">
                  {product.status}
                </p> */}
                
                <div>
                  <Dropdown
                    options={
                      product.type == "DELIVERY"
                        ? ["PICKED", "DISPATCHED", "DELIVERED"]
                        : ["PICKED", "COLLECTED"]
                    }
                    value={product.status}
                    onChange={this.onSelect}
                    placeholder="Select Status"
                  />
                </div>
              </div>
            </div>
            {/* <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
              <CustomInput
                className="item-check mb-0"
                type="checkbox"
                id={`check_${product.id}`}
                checked={isSelect}
                onChange={() => {}}
                label=""
              />
            </div> */}
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
}
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView);

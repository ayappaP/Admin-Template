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
import updateOrderStatus from "../../queries/updateOrderStatus";
// const DataListView = ({
//   product,
//   isSelect,
//   collect,
//   onCheckItem,
//   toggleModal,
//   order
// }) =>

class DataListView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      primaryData: props.primaryData
    };
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(option) {
    const selectStatus = option.label;
    // console.log("select", selectStatus)
    const orderID = this.props.product.reference;
    const UpdateStatus = updateOrderStatus(selectStatus, orderID);
    client(UpdateStatus)
      .then(res => {
        const product = { ...this.state.product, status: selectStatus };
        console.log("update res", res);
        this.setState({ product });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const {
      primaryData,
      isSelect,
      collect,
      onCheckItem,
      toggleModal,
      order,
      selectStatus
    } = this.props;

    // const primaryData = this.state.primaryData;
    console.log("props", primaryData);
    // const dateTime =
    //   product.createdAt.slice(0, 10) + " / " + product.createdAt.slice(11, 19);
    // const address = `${product.address.city} ${product.address.region} ${product.address.address} ${product.address.address2} ${product.address.postcode}`;

    return (
      <Colxx xxs="12" className="mb-3">
        <ContextMenuTrigger id="menu_id" data={primaryData.id} collect={collect}>
          <Card
            onClick={event => onCheckItem(event, primaryData.id)}
            className={classnames("d-flex flex-row", {
              active: isSelect
            })}
          >
            <div className="pl-2 d-flex flex-grow-1 min-width-zero">
              <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                {/* <NavLink to={`?p=${primaryData.id}`} className="w-40 w-sm-100"> */}

                <Badge color={primaryData.statusColor} pill onClick={toggleModal}>
                  {primaryData.id}
                </Badge>
                {/* </NavLink> */}
                <p
                  className="mb-1 text-muted text-small w-15 w-sm-100"
                  onClick={toggleModal}
                >
                  {primaryData.count}
                </p>
                <p
                  className="mb-1 text-muted text-small w-15 w-sm-100"
                  onClick={toggleModal}
                >
                    {primaryData.total}
                </p>
                <p
                  className="mb-1 text-muted text-small w-15 w-sm-100"
                  onClick={toggleModal}
                >
                   {primaryData.deliveryDate}
                </p>
                <p
                  className="mb-1 text-muted text-small w-15 w-sm-100"
                  onClick={toggleModal}
                >
                  {/* {primaryData.type == "COLLECTION" ? "-" : address} */}
                </p>
              </div>
              {/* <div
                className="w-15 w-sm-100"
                style={{ marginTop: 20, marginRight: 20 }}
              >
                <div>
                  <Dropdown
                    options={
                      primaryData.type == "DELIVERY"
                        ? ["PICKED", "DISPATCHED", "DELIVERED"]
                        : ["PICKED", "COLLECTED"]
                    }
                    value={primaryData.status}
                    onChange={this.onSelect}
                    placeholder="Select Status"
                  />
                </div>
              </div> */}
            </div>
          </Card>
        </ContextMenuTrigger>
      </Colxx>
    );
  }
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView);

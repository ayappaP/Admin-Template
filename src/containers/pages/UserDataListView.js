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
import fetchUsers from "../../queries/fetchUsers";
// const UserDataListView = ({
//   product,
//   isSelect,
//   collect,
//   onCheckItem,
//   toggleModal,
//   order
// }) =>

class UserDataListView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      users: props.users
    };
    // this.onSelect = this.onSelect.bind(this)
  }

  //   onSelect(option) {
  //     const selectStatus = option.label
  //     // console.log("select", selectStatus)
  //     const orderID = this.props.product.reference
  //     const UpdateStatus = updateOrderStatus(selectStatus, orderID)
  //     client(UpdateStatus).then(res => {
  //         const product = { ...this.state.product, status: selectStatus }
  //            console.log("update res",res)
  //         this.setState({ product })
  //     }).catch((error) => {
  //         console.log(error)
  //     });
  // }

  render() {
    const {
      // product,
      isSelect,
      collect,
      onCheckItem,
      toggleModal,
      toggleModalValue,
      order,
      users,
      selectStatus
    } = this.props;
    // const dateTime =
    //   product.createdAt.slice(0, 10) + " / " + product.createdAt.slice(11, 19);
    // const address = `${product.address.city} ${product.address.region} ${product.address.address} ${product.address.address2} ${product.address.postcode}`;

    return (
      <Colxx xxs="12" className="mb-3">
        <ContextMenuTrigger id="menu_id" data={users.id} collect={collect}>
          <Card
            onClick={toggleModalValue}
            className={classnames("d-flex flex-row", {
              active: isSelect
            })}
          >
            <div className="pl-2 d-flex flex-grow-1 min-width-zero">
              <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                  {users.name == null ? "NA" : users.name}
                </p>
                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                  {users.phone}
                </p>
                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                  {users.role}
                </p>
              </div>
            </div>
          </Card>
        </ContextMenuTrigger>
      </Colxx>
    );
  }
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(UserDataListView);

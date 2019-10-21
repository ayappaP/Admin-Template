import React from "react";
import { Card, CustomInput, Badge } from "reactstrap";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { ContextMenuTrigger } from "react-contextmenu";
import { Colxx } from "../../../components/common/CustomBootstrap";
import "react-dropdown/style.css";

// const ProductListView = ({
//   product,
//   isSelect,
//   collect,
//   onCheckItem,
//   toggleModal,
//   order
// }) =>

class ShopsListView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      ListOrganizationData: props.ListOrganizationData
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
      toggleModalValue,
      order,
      products,
      ListOrganizationData,
      selectStatus
    } = this.props;

    // const dateTime =
    //   product.createdAt.slice(0, 10) + " / " + product.createdAt.slice(11, 19);
    // const address = ListOrganizationData.address.postcode
    //   ? `${ListOrganizationData.address.postcode} ${ListOrganizationData.address.town} ${ListOrganizationData.address.number} ${ListOrganizationData.address.road} `
    //   : "Not Available";

    return (
      <Colxx xxs="12" className="mb-3">
        <ContextMenuTrigger id="menu_id" data={ListOrganizationData.id} collect={collect}>
          <Card
             onClick={toggleModalValue}
            className={classnames("d-flex flex-row", {
              active: isSelect
            })}
          >
            <div className="pl-2 d-flex flex-grow-1 min-width-zero">
              <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                  {ListOrganizationData.organizationName}
                </p>
                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                  {ListOrganizationData.contactName}
                </p>
                <p className="mb-1 text-muted text-small w-15 w-sm-100">
                  {ListOrganizationData.address}
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
export default React.memo(ShopsListView);

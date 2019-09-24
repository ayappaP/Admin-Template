import React,{Component} from "react";
import { Card, CardBody, Badge, CustomInput } from "reactstrap";
import { NavLink } from "react-router-dom";

import { Colxx } from "../../../components/common/CustomBootstrap";

// const CarouselListView = ({ item, handleCheckChange, isSelected }) => {
  class OfferListView extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        title: "",
        detail: "",
        label: {},
        labelColor: "",
        category: {},
        status: "PENDING"
      };
    }
    render(){
      const {item,toggleModalValue} =this.props
  return (
    <Colxx xxs="12">
      <Card className="card d-flex mb-3" onClick={toggleModalValue}>
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
          <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.offerTitle}
            </p>
            <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.startDate}
            </p>
            <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.endDate}
            </p>
           
            {/* <p className="mb-1 text-muted text-small w-15 w-xs-100">
              {item.createDate}
            </p>
            <div className="w-15 w-xs-100">
              <Badge color={item.labelColor} pill>
                {item.label}
              </Badge>
            </div> */}
          </CardBody>
          {/* <div className="custom-control custom-checkbox pl-1 align-self-center mr-4">
            <CustomInput
              className="itemCheck mb-0"
              type="checkbox"
              id={`check_${item.id}`}
              checked={isSelected}
              onChange={event => handleCheckChange(event, item.id)}
              label=""
            />
          </div> */}
        </div>
        {/* <div className="card-body pt-1">
          <p className="mb-0">{item.detail}</p>
        </div> */}
      </Card>
    </Colxx>
  );
};
}
export default React.memo(OfferListView);

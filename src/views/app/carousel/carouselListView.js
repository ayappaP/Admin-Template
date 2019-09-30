import React, { Component } from "react";
import { Card, CardBody, Badge, CustomInput } from "reactstrap";
import { NavLink } from "react-router-dom";

import { Colxx } from "../../../components/common/CustomBootstrap";

// const CarouselListView = ({ item, handleCheckChange, isSelected }) => {
class CarouselListView extends Component {
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
  render() {
    const { item, toggleModalValue } = this.props
    return (
      <Colxx xxs="12">
        <Card className="card d-flex mb-3" onClick={toggleModalValue}>
          <div className="d-flex flex-grow-1 min-width-zero">
            <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
              <NavLink
                to="#"
                id={`toggler${item.id}`}
                className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
              >
                <span className="align-middle d-inline-block">
                  <img
                    style={{ height: 93 }}
                    src={item.imageUrl}
                    alt={item.alt}
                  />
                </span>
              </NavLink>
              <p className="mb-1 text-muted text-small w-15 w-xs-100">
                {item.alt}
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
export default React.memo(CarouselListView);

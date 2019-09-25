import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const OrderHistoryList = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './orderHistoryList')
);

const OrderHistory = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/`} />
      <Route
        path={`${match.url}`}
        render={props => <OrderHistoryList {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default OrderHistory;

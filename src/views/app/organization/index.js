import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ListShop = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './listShop')
);

const Shops = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/`} />
      <Route
        path={`${match.url}`}
        render={props => <ListShop {...props} />}
      />
      {/* <Redirect to="/error" /> */}
    </Switch>
  </Suspense>
);
export default Shops;
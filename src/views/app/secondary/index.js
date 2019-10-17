import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ListProduct = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './listProduct')
);

const Products = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/`} />
      <Route
        path={`${match.url}`}
        render={props => <ListProduct {...props} />}
      />
      {/* <Redirect to="/error" /> */}
    </Switch>
  </Suspense>
);
export default Products;
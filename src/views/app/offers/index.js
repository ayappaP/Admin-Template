import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ListOffer = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './listOffers')
);

const Offers = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/`} />
      <Route
        path={`${match.url}`}
        render={props => <ListOffer {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Offers;

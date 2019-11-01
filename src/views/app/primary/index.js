import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const PrimaryList = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './PrimaryList')
);

const Dashboards = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/`} />
      <Route
        path={`${match.url}`}
        render={props => <PrimaryList {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Dashboards;

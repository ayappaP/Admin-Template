import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const CreateUsers = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './users')
);

const Users = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/`} />
      <Route
        path={`${match.url}`}
        render={props => <CreateUsers {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Users;
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const ListCarousel = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './listCarousel')
);

const Carousel = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/`} />
      <Route
        path={`${match.url}`}
        render={props => <ListCarousel {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);

export default Carousel;

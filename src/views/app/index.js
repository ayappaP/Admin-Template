import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Orders = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './orders')
);
const ListUsers = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './listUsers')
);
const Carousel = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './carousel')
);
const Products = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './products')
);
const Shops = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './shops')
);
const BlankPage = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './blank-page')
);

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
            <Switch>
            <Redirect
                exact
                from={`${match.url}`}
                to={`${match.url}/orders`}
              />
              {/* <Redirect
                exact
                from={`${match.url}/`}
                to={`${match.url}/dashboards`}
              /> */}
               <Route
                path={`${match.url}/orders`}
                render={props => <Orders {...props} />}
              />
              <Route
                path={`${match.url}/listUsers`}
                render={props => <ListUsers {...props} />}
              />
              <Route
                path={`${match.url}/carousel`}
                render={props => <Carousel {...props} />}
              />
              <Route
                path={`${match.url}/shops`}
                render={props => <Shops {...props} />}
              />
                <Route
                path={`${match.url}/products`}
                render={props => <Products {...props} />}
              />
              <Route
                path={`${match.url}/blank-page`}
                render={props => <BlankPage {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);

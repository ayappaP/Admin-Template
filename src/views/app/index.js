import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';
import Products from './products';

const Orders = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './orders')
);
const ListUsers = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './listUsers')
);
const Carousel = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './carousel')
);
const Offers = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './offers')
);
const Transactions = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './transactions')
);
const Dashboards = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './dashboards')
);
const Pages = React.lazy(() =>
  import(/* webpackChunkName: "pages" */ './pages')
);
const Applications = React.lazy(() =>
  import(/* webpackChunkName: "applications" */ './applications')
);
const Ui = React.lazy(() => import(/* webpackChunkName: "ui" */ './ui'));
const Menu = React.lazy(() => import(/* webpackChunkName: "menu" */ './menu'));
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
                path={`${match.url}/products`}
                render={props => <Products {...props} />}
              />
              <Route
                path={`${match.url}/offers`}
                render={props => <Offers {...props} />}
              />
               <Route
                path={`${match.url}/transactions`}
                render={props => <Transactions {...props} />}
              />
              <Route
                path={`${match.url}/dashboards`}
                render={props => <Dashboards {...props} />}
              />
              <Route
                path={`${match.url}/carousel`}
                render={props => <Applications {...props} />}
              />
              <Route
                path={`${match.url}/pages`}
                render={props => <Pages {...props} />}
              />
              <Route
                path={`${match.url}/ui`}
                render={props => <Ui {...props} />}
              />
              <Route
                path={`${match.url}/menu`}
                render={props => <Menu {...props} />}
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

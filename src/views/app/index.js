import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Primary = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './primary')
);
const Secondary = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './secondary')
);
const Organization = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './organization')
);
const User = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './user')
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
                to={`${match.url}/primary`}
              />
              {/* <Redirect
                exact
                from={`${match.url}/`}
                to={`${match.url}/dashboards`}
              /> */}
              <Route
                path={`${match.url}/primary`}
                render={props => <Primary {...props} />}
              />
              <Route
                path={`${match.url}/secondary`}
                render={props => <Secondary {...props} />}
              />
              <Route
                path={`${match.url}/organization`}
                render={props => <Organization {...props} />}
              />
              <Route
                path={`${match.url}/user`}
                render={props => <User {...props} />}
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

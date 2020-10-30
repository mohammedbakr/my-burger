import React, { Component, Suspense } from 'react'
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import Layout from './containers/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Logout from './containers/Auth/Logout/Logout';
import * as actionCreators from './store/actions'
import Spinner from './components/UI/Spinner/Spinner';

const asyncCheckout = React.lazy(() => import('./containers/Checkout/Checkout'));
const asyncOrders = React.lazy(() => import('./containers/Orders/Orders'));
const asyncAuth = React.lazy(() => import('./containers/Auth/Auth'));

export class App extends Component {
  componentDidMount() {
    this.props.onAuthCheckState()
  }

  render() {
    let routes = (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/auth" component={asyncAuth} />
          <Route exact path="/" component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    )

    if (this.props.isAuth) {
      routes = (
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/checkout" component={asyncCheckout} />
            <Route path="/orders" component={asyncOrders} />
            <Route path="/logout" component={Logout} />
            <Route path="/auth" component={asyncAuth} />
            <Route path="/" exact component={BurgerBuilder} />
            <Redirect to="/" />
          </Switch>
        </Suspense>
      )
    }

    return (
      <div>
        <Layout>
          {routes}            
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthCheckState: () => dispatch(actionCreators.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))


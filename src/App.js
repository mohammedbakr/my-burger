import React, { useEffect, Suspense } from 'react'
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

function App (props) {
  useEffect(() => {
    props.onAuthCheckState()
    // eslint-disable-next-line
  }, [])

  let routes = (
    <Switch>
      <Route path="/auth" component={asyncAuth} />
      <Route exact path="/" component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  )

  if (props.isAuth) {
    routes = (
      <Switch>
        <Route path="/checkout" component={asyncCheckout} />
        <Route path="/orders" component={asyncOrders} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<Spinner />}>
          {routes}
        </Suspense>           
      </Layout>
    </div>
  )
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


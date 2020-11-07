import React, { useState } from 'react'
import { connect } from 'react-redux'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'

import classes from './Layout.module.css'

function Layout (props) {
  const [sideDrawer, setSideDrawer] = useState(false)

  const sideDrawerClosedHandler = () => {
    setSideDrawer(false)
  }

  const sideDrawerToggleHandler = () => {
    setSideDrawer(!sideDrawer)
  }

  return (
    <React.Fragment>
      <Toolbar
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}
      />
      <SideDrawer
        isAuth={props.isAuthenticated}
        open={sideDrawer}
        closed={sideDrawerClosedHandler}
      />
      <main className={classes.Content}>
        {props.children}
      </main>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null // return true or false
  }
}

export default connect(mapStateToProps)(Layout)

import React from 'react'
import classes from './Layout.module.css'

function Layout(props) {
  return (
    <React.Fragment>
      <div>toolbar, backlog, sidedrawer</div>
      <main className={classes.content}>
        {props.children}
      </main>
    </React.Fragment>
  )
}

export default Layout

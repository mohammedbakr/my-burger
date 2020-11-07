import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as actionCreators from '../../../store/actions'

function Logout (props) {
  const { onLogout } = props
  useEffect(() => {
    onLogout()
  }, [onLogout])

  return <Redirect to="/" />
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actionCreators.logout())
  }
}

export default connect(null, mapDispatchToProps)(Logout)

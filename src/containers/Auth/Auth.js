import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Spinner from '../../components/UI/Spinner/Spinner'
import classes from './Auth.module.css'
import * as actionCreators from '../../store/actions/index'
import { updateObject, checkValidity } from '../../shared/utility'

function Auth (props) {
  const [controls, setControls] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your email'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    passwoed: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    },
  })
  const [formIsValid, setFormIsValid] = useState(false)
  const [isSignup, setIsSignup] = useState(true)

  useEffect(() => {
    if (!props.buildingBurger && props.authRedirectPath !== '/') {
      props.onSetAuthRedirectPath()
    }
    // eslint-disable-next-line
  }, [])

  const inputChangeHandler = (e, element) => {
    const updatedControls = updateObject(controls, {
      [element]: updateObject(controls[element], {
        value: e.target.value,
        valid: checkValidity(e.target.value, controls[element].validation),
        touched: true
      })
    })

    let formIsValid = true
    for (const key in updatedControls) {
      formIsValid = updatedControls[key].valid && formIsValid
    }

    setControls(updatedControls)
    setFormIsValid(formIsValid)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    props.onAuth(controls.email.value, controls.passwoed.value, isSignup)
  }

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup)
  }

  const formelementsarray = []
  for (const key in controls) {
    formelementsarray.push({
      id: key, // name, street, zip...
      config: controls[key] // value of name, street , zip....
    })
  }

  let form = formelementsarray.map(formElement => 
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(e) => inputChangeHandler(e, formElement.id)}
    />
  )

  if (props.loading) {
    form = <Spinner />
  }

  let errorMessage = null
  if (props.error) {
    errorMessage = <p>{props.error.message}</p>
  }

  let authRedirect = null
  if (props.isAuth) {
    authRedirect = <Redirect to={props.authRedirectPath} />
  }

  return (
    <div className={classes.Auth} onSubmit={submitHandler}>
      {authRedirect}
      {errorMessage}
      <form>
        {form}
        <Button btnType="Success" disabled={!formIsValid}>SUBMIT</Button>
      </form>
      <Button btnType="Danger" clicked={switchAuthModeHandler}>
        SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null, // return true or false
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToState = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actionCreators.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actionCreators.setAuthRedirectPath('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToState)(Auth)

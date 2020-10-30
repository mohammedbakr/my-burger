import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Spinner from '../../components/UI/Spinner/Spinner'

import classes from './Auth.module.css'

import * as actionCreators from '../../store/actions/index'
import { Redirect } from 'react-router-dom'

class Auth extends Component {
  state = {
    controls: {
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
    },
    formIsValid: false,
    isSignup: true
  }

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath()
    }
  }

  inputChangeHandler = (e, element) => {
    const updatedControls = {...this.state.controls}
    const updatedControlsElement = {...updatedControls[element]}
    updatedControlsElement.value = e.target.value
    updatedControlsElement.valid = this.checkValidity(updatedControlsElement.value, updatedControlsElement.validation)
    updatedControlsElement.touched = true
    updatedControls[element] = updatedControlsElement

    let formIsValid = true
    for (const key in updatedControls) {
      formIsValid = updatedControls[key].valid && formIsValid
    }

    this.setState({controls: updatedControls, formIsValid: formIsValid})
  }

  checkValidity = (value, rules) => {
    let isValid = true

    if (!rules) {
      return true
    }

    if (rules.required) {
      // returns true or false
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
      // eslint-disable-next-line
      const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      isValid = pattern.test(value) && isValid
    }

    return isValid
  }

  submitHandler = (e) => {
    e.preventDefault()
    this.props.onAuth(this.state.controls.email.value, this.state.controls.passwoed.value, this.state.isSignup)
  }

  switchAuthModeHandler = () => {
    this.setState({isSignup: !this.state.isSignup})
  }

  render() {
    const formelementsarray = []
    for (const key in this.state.controls) {
      formelementsarray.push({
        id: key, // name, street, zip...
        config: this.state.controls[key] // value of name, street , zip....
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
        changed={(e) => this.inputChangeHandler(e, formElement.id)}
      />
    )

    if (this.props.loading) {
      form = <Spinner />
    }

    let errorMessage = null
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>
    }

    let authRedirect = null
    if (this.props.isAuth) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

    return (
      <div className={classes.Auth} onSubmit={this.submitHandler}>
        {authRedirect}
        {errorMessage}
        <form>
          {form}
          <Button btnType="Success" disabled={!this.state.formIsValid}>SUBMIT</Button>
        </form>
        <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
          SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
        </Button>
      </div>
    )
  }
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

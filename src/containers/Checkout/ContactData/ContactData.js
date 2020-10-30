import React, { Component } from 'react'
import { connect } from 'react-redux'

import Button from '../../../components/UI/Button/Button'
import axios from '../../../axios-orders'

import classes from './ContactData.module.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actionCreators from '../../../store/actions'

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
          isNumeric: true
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ]
        },
        value: 'fastest',
        validation: {},
        valid: true
      }
    },
    formIsValid: false,
  }

  orderHandler = (e) => {
    e.preventDefault()
    const formData = {}
    for (const key in this.state.orderForm) {
      formData[key] = this.state.orderForm[key].value
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price.toFixed(2),
      orderDtata: formData,
      userId: this.props.userId
    }

    // reach to server
    this.props.onOrderBurger(order, this.props.token)
  }

  inputChangeHandler = (e, element) => {
    const updatedOrderForm = {...this.state.orderForm}
    const updatedFormElement = {...updatedOrderForm[element]}
    updatedFormElement.value = e.target.value
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
    updatedFormElement.touched = true
    updatedOrderForm[element] = updatedFormElement

    let formIsValid = true
    for (const key in updatedOrderForm) {
      formIsValid = updatedOrderForm[key].valid && formIsValid
    }

    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
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

    if (rules.isNumeric) {
      const pattern = /^\d+$/
      isValid = pattern.test(value) && isValid
    }

    return isValid
  }

  render() {
    // turning object to array
    const formelementsarray = []
    for (const key in this.state.orderForm) {
      formelementsarray.push({
        id: key, // name, street, zip...
        config: this.state.orderForm[key] // value of name, street , zip....
      })
    }
    
    let form = (
      <form onSubmit={this.orderHandler}>
        {
          formelementsarray.map(formElement => (
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
          ))
        }
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    )
    if (this.props.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderDtata, token) => dispatch(actionCreators.purchaseBurger(orderDtata, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))

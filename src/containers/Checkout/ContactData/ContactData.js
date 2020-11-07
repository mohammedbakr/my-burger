import React, { useState } from 'react'
import { connect } from 'react-redux'

import Button from '../../../components/UI/Button/Button'
import axios from '../../../axios-orders'

import classes from './ContactData.module.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actionCreators from '../../../store/actions'
import { updateObject, checkValidity } from '../../../shared/utility'

function ContactData (props) {
  const [orderForm, setOrderForm] = useState({
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
  },)
  const [formIsValid, setFormIsValid] = useState(false)

  const orderHandler = (e) => {
    e.preventDefault()
    const formData = {}
    for (const key in orderForm) {
      formData[key] = orderForm[key].value
    }
    const order = {
      ingredients: props.ingredients,
      price: props.price.toFixed(2),
      orderDtata: formData,
      userId: props.userId
    }

    // reach to server
    props.onOrderBurger(order, props.token)
  }

  const inputChangeHandler = (e, element) => {
    const updatedFormElement = updateObject(orderForm[element], {
      value: e.target.value,
      valid: checkValidity(e.target.value, orderForm[element].validation),
      touched: true
    })
    const updatedOrderForm = updateObject(orderForm, {
      [element]: updatedFormElement
    })

    let formIsValid = true
    for (const key in updatedOrderForm) {
      formIsValid = updatedOrderForm[key].valid && formIsValid
    }

    setOrderForm(updatedOrderForm)
    setFormIsValid(formIsValid)
  }

  // turning object to array
  const formelementsarray = []
  for (const key in orderForm) {
    formelementsarray.push({
      id: key, // name, street, zip...
      config: orderForm[key] // value of name, street , zip....
    })
  }
  
  let form = (
    <form onSubmit={orderHandler}>
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
            changed={(e) => inputChangeHandler(e, formElement.id)}
          />
        ))
      }
      <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
    </form>
  )
  if (props.loading) {
    form = <Spinner />
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  )
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

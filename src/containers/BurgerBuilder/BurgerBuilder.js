import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Burger from '../../components/Burger/Burger'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Modal from '../../components/UI/Modal/Modal'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actionCreators from '../../store/actions'

function BurgerBuilder (props) {
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    props.onInitIngredients()
    // eslint-disable-next-line
  }, [])

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)

    return sum > 0
  }

  const purchasingHandler = () => {
    if (props.isAuth) {
      setPurchasing(true)
    } else {
      props.onSetAuthRedirectPath('/checkout')
      props.history.push('/auth')
    }
  }

  const purchasingCancelHandler = () => {
    setPurchasing(false)
  }

  const purchasingContinueHandler = () => {
    props.onInitPurchase()
    props.history.push('/checkout');
  }

  // {salad: true, meat: false, ...}
  const disabledInfo = {
    ...props.ingredients
  }
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0
  }

  let orderSummary = null 
  let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

  if (props.ingredients) {
    burger = (
      <React.Fragment>
        <Burger ingredients={props.ingredients} />
        <BuildControls
          ingredientAdded={props.onIngredientAdded} 
          ingredientRemoved={props.onIngredientRemoved}
          disabled={disabledInfo}
          purchaseable={updatePurchaseState(props.ingredients)}
          ordered={purchasingHandler}
          isAuth={props.isAuth}
          price={props.totalPrice}
        />
      </React.Fragment>
    )
    orderSummary = (
      <OrderSummary
        ingredients={props.ingredients}
        purchasingCanceled={purchasingCancelHandler}
        purchasingContinued={purchasingContinueHandler}
        price={props.totalPrice}
      />
    )
  }

  return (
    <React.Fragment>
      <Modal show={purchasing} modalClosed={purchasingCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </React.Fragment>
  )
}

const mapstateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuth: state.auth.token !== null // return true or flase
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingredientName) => dispatch(actionCreators.addIngredient(ingredientName)),
    onIngredientRemoved: (ingredientName) => dispatch(actionCreators.removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(actionCreators.initIngredients()),
    onInitPurchase: () => dispatch(actionCreators.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
  }
}

export default connect(mapstateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))

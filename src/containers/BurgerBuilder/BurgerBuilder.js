import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

  const dispatch = useDispatch()
  const ingredients = useSelector(state => state.burgerBuilder.ingredients)
  const totalPrice = useSelector(state => state.burgerBuilder.totalPrice)
  const error = useSelector(state => state.burgerBuilder.error)
  const isAuth = useSelector(state => state.auth.token !== null) // returns true or flase

  const onIngredientAdded = (ingredientName) => dispatch(actionCreators.addIngredient(ingredientName))
  const onIngredientRemoved = (ingredientName) => dispatch(actionCreators.removeIngredient(ingredientName))
  const onInitIngredients = useCallback(() => dispatch(actionCreators.initIngredients()),  [dispatch])
  const onInitPurchase = () => dispatch(actionCreators.purchaseInit())
  const onSetAuthRedirectPath = (path) => dispatch(actionCreators.setAuthRedirectPath(path))

  useEffect(() => {
    onInitIngredients()
  }, [onInitIngredients])

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
    if (isAuth) {
      setPurchasing(true)
    } else {
      onSetAuthRedirectPath('/checkout')
      props.history.push('/auth')
    }
  }

  const purchasingCancelHandler = () => {
    setPurchasing(false)
  }

  const purchasingContinueHandler = () => {
    onInitPurchase()
    props.history.push('/checkout');
  }

  // {salad: true, meat: false, ...}
  const disabledInfo = {
    ...ingredients
  }
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0
  }

  let orderSummary = null 
  let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />

  if (ingredients) {
    burger = (
      <React.Fragment>
        <Burger ingredients={ingredients} />
        <BuildControls
          ingredientAdded={onIngredientAdded} 
          ingredientRemoved={onIngredientRemoved}
          disabled={disabledInfo}
          purchaseable={updatePurchaseState(ingredients)}
          ordered={purchasingHandler}
          isAuth={isAuth}
          price={totalPrice}
        />
      </React.Fragment>
    )
    orderSummary = (
      <OrderSummary
        ingredients={ingredients}
        purchasingCanceled={purchasingCancelHandler}
        purchasingContinued={purchasingContinueHandler}
        price={totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios)

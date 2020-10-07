import React, { Component } from 'react'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Burger from '../../components/Burger/Burger'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Modal from '../../components/UI/Modal/Modal'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES ={
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totlaPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('https://my-burger-7d79b.firebaseio.com/ingredients.json')
      .then(response => this.setState({ingredients: response.data}))
      .catch(error => this.setState({error: true}))
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)

    this.setState({
      purchaseable: sum > 0
    })
  }

  addIngredientsHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    const updatedCount = oldCount + 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount
    const priceAddition = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totlaPrice
    const newPrice = oldPrice + priceAddition
    this.setState({
      totlaPrice: newPrice,
      ingredients: updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientsHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    if (oldCount <= 0) return
    const updatedCount = oldCount - 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount
    const priceDeduction = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totlaPrice
    const newPrice = oldPrice - priceDeduction
    this.setState({
      totlaPrice: newPrice,
      ingredients: updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients)
  }

  purchasingHandler = () => {
    this.setState({purchasing: true})
  }

  purchasingCancelHandler = () => {
    this.setState({purchasing: false})
  }

  purchasingContinueHandler = () => {
    // alert('You continue..!')
    this.setState({loading: true})
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totlaPrice.toFixed(2),
      customer: {
        name: 'Brown',
        address: {
          street: 'teststreet 1',
          zipCode: '123456',
          country: 'USA'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }

    axios.post('orders.json', order)
      .then(response => 
        this.setState({loading: false, purchasing: false})  
      )
      .catch(error => 
        this.setState({loading: false, purchasing: false})  
      )
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    // {salad: true, meat: false, ...}

    let orderSummary = null 
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (this.state.ingredients) {
      burger = (
        <React.Fragment>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientsHandler} 
            ingredientRemoved={this.removeIngredientsHandler}
            disabled={disabledInfo}
            purchaseable={this.state.purchaseable}
            ordered={this.purchasingHandler}
            price={this.state.totlaPrice}
          />
        </React.Fragment>
      )
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchasingCanceled={this.purchasingCancelHandler}
          purchasingContinued={this.purchasingContinueHandler}
          price={this.state.totlaPrice}
        />
      )
    }

    if (this.state.loading) {
      // orderSummary = <Spinner />
    }

    return (
      <React.Fragment>
        <Modal show={this.state.purchasing} modalClosed={this.purchasingCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </React.Fragment>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios)

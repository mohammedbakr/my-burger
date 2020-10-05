import React, { Component } from 'react'
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {
  render() {
    const ingredientSummary = Object.keys(this.props.ingredients)
    .map(igKey => {
      return (
        <li key={igKey}>
          <strong><span style={{textTransform: 'capitalize'}}>{igKey} </span></strong>
          {this.props.ingredients[igKey]}
        </li>
      )
    })

    return (
      <React.Fragment>
        <h3>Your Order</h3>
        <p>A delicious burger with following ingredients</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p>Continue with Ckecout...!</p>
        <p><strong>Total Price: </strong>{this.props.price.toFixed(2)}</p>
        <Button btnType="Danger" clicked={this.props.purchasingCanceled}>CANCEL</Button>
        <Button btnType="Success" clicked={this.props.purchasingContinued}>CONTINUE</Button>
      </React.Fragment>
    )
  }
}

export default OrderSummary

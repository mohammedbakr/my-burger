import React from 'react'
import Button from '../../UI/Button/Button'

function OrderSummary(props) {
  const ingredientSummary = Object.keys(props.ingredients)
    .map(igKey => {
      return (
        <li key={igKey}>
          <strong><span style={{textTransform: 'capitalize'}}>{igKey} </span></strong>
          {props.ingredients[igKey]}
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
      <p><strong>Total Price: </strong>{props.price.toFixed(2)}</p>
      <Button btnType="Danger" clicked={props.purchasingCanceled}>CANCEL</Button>
      <Button btnType="Success" clicked={props.purchasingContinued}>CONTINUE</Button>
    </React.Fragment>
  )
}

export default OrderSummary

import React from 'react'

import classes from './Order.module.css'

function Order(props) {
  const ingredients = []
  for (const key in props.ingredients) {
    ingredients.push({
      name: key,
      amount: props.ingredients[key]
    })
  }

  const ingredient = ingredients.map(ig => {
    return <span
        style={{
          textTransform: 'capitalize',
          display: 'inline-block',
          margin: '0 8px',
          border: '1px solid #ccc',
          padding: '5px'
        }}
        key={ig.name}
      >{ig.name}({ig.amount})</span>
  })

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredient}</p>
      <p>Price: <strong>USD {props.price}</strong></p>
    </div>
  )
}

export default Order

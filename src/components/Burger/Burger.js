import React from 'react'
import BurgerIngredients from './BurgerIngredients/BurgerIngredients'

import classes from './Burger.module.css'

function Burger(props) {
  // Turning an object with key values pairs to an array
  let transformedIngredients = Object.keys(props.ingredients) // Turning keys of object to an array
    .map(igKey => { // igKey = ingredientsKey
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <BurgerIngredients key={igKey + i} type={igKey} />
      })
    })
    .reduce((arr, el) => {
      return arr.concat(el)
    }, [])

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start addidng ingredients!</p>
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredients type="bread-top" />
      {transformedIngredients}
      <BurgerIngredients type="bread-bottom" />
    </div>
  )
}

export default Burger

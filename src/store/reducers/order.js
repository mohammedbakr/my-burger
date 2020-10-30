import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  orders: [],
  loading: false,
  purchased: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      // example of using utility.js file to organize the structure more
      return updateObject(state, { purchased: false })
    case actionTypes.PURCHASE_BURGER_START:
      return updateObject(state, { purchased: true })
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      const newOrder = updateObject(action.orderData, { id: action.id })
      return updateObject(state, {
        loading: false,
        purchased: true,
        orders: state.orders.concat(newOrder)
      })
    case actionTypes.PURCHASE_BURGER_FAIL:
      return {
        ...state,
        loading: false,
      }
    case actionTypes.FETCH_ORDERS_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.orders
      }
    case actionTypes.FETCH_ORDERS_FAIL:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

export default reducer
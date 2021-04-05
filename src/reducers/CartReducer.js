import * as Actions from '../actions/ActionTypes';
const CartReducer = (
  state = {
    isLoding: false,
    sub_total: 0,
    promo: undefined,
    promo_id: 0,
    total_amount: 0,
    promo_amount: 0,
    address: 0,
    addressText: null,
    delivery_date: undefined,
    special_request: undefined,
    isConfirmOrder: 0,
    date: true,
  },
  action,
) => {
  switch (action.type) {
    case Actions.CALCULATE_PRICING:
      return Object.assign({}, state, {
        isLoding: false,
      });
    case Actions.SUB_TOTAL:
      return Object.assign(
        {},
        state,
        // console.log('SUB_TOTAL'),
        {
          sub_total: action.data,
        },
      );
    case Actions.PROMO:
      return Object.assign({}, state, {
        promo: action.data,
        promo_id: action.data.id,
      });
    case Actions.TOTAL:
      return Object.assign(
        {},
        state,
        // console.log('total_amount',total_amount.total),
        {
          promo_amount: action.data.promo_amount,
          total_amount: action.data.total,
          isLoding: false,
        },
      );
    case Actions.SELECT_ADDRESS:
      return Object.assign(
        {},
        state,
        //  console.log('SELECT_ADDRESS', action),
        {
          address: action.data.id,
          addressText: action.data.address,
        },
      );
    case Actions.SELECT_DATE:
      return Object.assign({}, state, {
        delivery_date: action.data,
      });
    case Actions.SHOW_EDIT_BTN:
      return Object.assign({}, state, {
        date: action.data,
      });
    case Actions.SPECIAL_REQUEST:
      return Object.assign({}, state, {
        special_request: action.data,
      });
    case Actions.CONFIRM_ORDER:
      return Object.assign({}, state, {
        ...state,
        isConfirmOrder: 1,
      });
    case Actions.CONFIRM_ORDER_EDIT:
      return Object.assign(
        {},
        state,
        console.log('CONFIRM_ORDER_EDIT', action.data),
        {
          ...state,
          isConfirmOrder: action.data,
        },
      );
    case Actions.RESET:
      return Object.assign({}, state, {
        isLoding: false,
        sub_total: 0,
        promo: undefined,
        promo_id: 0,
        total_amount: 0,
        promo_amount: 0,
        address: 0,
        total_KGS: 0,
        total_items: 0,
        isConfirmOrder: 0,
        delivery_date: undefined,
        date: true,
      });
    default:
      return state;
  }
};

export default CartReducer;

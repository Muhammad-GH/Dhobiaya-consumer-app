import * as Actions from '../actions/ActionTypes';
const PaymentReducer = (
  state = {
    isLoding: false,
    error: undefined,
    data: undefined,
    message: undefined,
    status: undefined,
  },
  action,
) => {
  switch (action.type) {
    case Actions.ORDER_SERVICE_PENDING:
      return Object.assign({}, state, {
        isLoding: true,
      });
    case Actions.ORDER_SERVICE_ERROR:
      return Object.assign({}, state, {
        isLoding: false,
        error: action.error,
      });
    case Actions.ORDER_SERVICE_SUCCESS:
      return Object.assign({}, state, {
        isLoding: false,
        data: action.data,
      });

    default:
      return state;
  }
};

export default PaymentReducer;

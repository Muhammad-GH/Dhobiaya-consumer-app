import * as Actions from '../actions/ActionTypes';
const HomeReducer = (
  state = {
    isLoding: false,
    error: undefined,
    data: [],
    message: undefined,
    status: undefined,
    cart_count: undefined,
  },
  action,
) => {
  switch (action.type) {
    case Actions.HOME_SERVICE_PENDING:
      return Object.assign({}, state, {
        isLoding: true,
      });
    case Actions.HOME_SERVICE_ERROR:
      return Object.assign({}, state, {
        isLoding: false,
        error: action.error,
      });
    case Actions.HOME_SERVICE_SUCCESS:
      if (action.data.status != 1) {
        return Object.assign({}, state, {
          isLoding: false,
          status: action.data.status,
          message: action.data.message,
          cart_count: state.cart_count,
        });
      } else {
        return Object.assign({}, state, {
          isLoding: false,
          status: action.data.status,
          message: action.data.message,
          data: action.data.result,
          cart_count: state.cart_count,
        });
      }
    default:
      return state;
  }
};

export default HomeReducer;

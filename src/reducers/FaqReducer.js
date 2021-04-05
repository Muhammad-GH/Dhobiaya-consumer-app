import * as Actions from '../actions/ActionTypes';
const FaqReducer = (
  state = {
    isLoding: false,
    error: undefined,
    data: [],
    message: undefined,
    status: undefined,
  },
  action,
) => {
  switch (action.type) {
    case Actions.FAQ_LIST_PENDING:
      return Object.assign({}, state, {
        isLoding: true,
      });
    case Actions.FAQ_LIST_ERROR:
      return Object.assign({}, state, {
        isLoding: false,
        error: action.error,
      });
    case Actions.FAQ_LIST_SUCCESS:
      if (action.data.status != 1) {
        return Object.assign({}, state, {
          isLoding: false,
          status: action.data.status,
          message: action.data.message,
        });
      } else {
        return Object.assign({}, state, {
          isLoding: false,
          status: action.data.status,
          message: action.data.message,
          data: action.data.result,
        });
      }
    default:
      return state;
  }
};

export default FaqReducer;
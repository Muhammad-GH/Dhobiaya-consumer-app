import * as Actions from '../actions/ActionTypes';
const ProductReducer = (
  state = {
    cart_count: undefined,
    cart_items: [],
    deleteCount: 0,
    total_items: 0,
    total_KGS: 0,
    isLoding: false,
    error: undefined,
    data: undefined,
    dataHome: [],
    message: undefined,
    status: undefined,
  },
  action,
) => {
  switch (action.type) {
    case Actions.PRODUCT_LIST_PENDING:
      return Object.assign({}, state, {
        ...state,
        isLoding: true,
        // cart_count: state.cart_count
      });
    case Actions.PRODUCT_LIST_ERROR:
      return Object.assign({}, state, {
        ...state,
        isLoding: false,
        error: action.error,
        cart_items: state.cart_items,
      });
    case Actions.PRODUCT_LIST_SUCCESS:
      if (action.data.status != 1) {
        return Object.assign({}, state, {
          ...state,
          isLoding: false,
          status: action.data.status,
          message: action.data.message,
          data: action.data.result,
          cart_items: action.data,
          // cart_count: state.cart_count
        });
      } else {
        if (action.data.result.length == 0) {
          action.data.result = 0;
        }
        return Object.assign({}, state, {
          ...state,
          isLoding: false,
          status: action.data.status,
          message: action.data.message,
          data: action.data.result,
          cart_count: state.cart_count,
          // cart_items: action.data,
        });
      }
    // case Actions.HOME_SERVICE_SUCCESS:
    //     if (action.data.status != 1) {
    //         return Object.assign({}, state, {
    //             isLoding: false,
    //             status: action.data.status,
    //             message: action.data.message,
    //             cart_items: state.cart_items
    //         });
    //     } else {
    //         return Object.assign({}, state, {
    //             isLoding: false,
    //             status: action.data.status,
    //             message: action.data.message,
    //             dataHome: action.data.result,
    //             cart_items: state.cart_items
    //         });
    //     }
    case Actions.ADD_TO_CART:
      return Object.assign({}, state, {
        ...state,
        cart_items: action.data,
        cart_count: Object.keys(action.data).length,
      });
    case Actions.ADD_TO_CART_FOR_DELETE:
      return Object.assign({}, state, {
        // ...state,
        // cart_items: action.data,
        deleteCount: state.deleteCount + 1,
        // cart_count: Object.keys(action.data).length
      });
    case Actions.ADD_TO_CART_FOR_UNDELETE:
      return Object.assign(
        {},
        state,
        // console.log('ADD_TO_CART_FOR_UNDELETE'),
        {
          ...state,
          // cart_items: action.data,
          deleteCount: state.deleteCount - 1,
          // cart_count: Object.keys(action.data).length
        },
      );
    case Actions.SERVICE_ID:
      return Object.assign({}, state, {
        ...state,
        total_items: action.data,
        // cart_count: state.cart_count
      });
    case Actions.ADD_TOTAL_ITEMS_PLUS:
      return Object.assign({}, state, {
        ...state,
        data: state.data,
        total_items: state.total_items + 1,
        // cart_count: state.cart_count
      });
    case Actions.ADD_TOTAL_ITEMS_MINUS:
      return Object.assign({}, state, {
        ...state,
        data: state.data,
        total_items: state.total_items - 1,
        // total_items: action.data,
        // cart_count: state.cart_count
      });
    case Actions.TOTAL_ITEMS_DELETE:
      return Object.assign(
        {},
        state,
        // console.log("TOTAL_ITEMS_DELETE-->",action.data),
        {
          ...state,
          data: state.data,
          total_items: action.data,
        },
      );
    case Actions.TOTAL_KG_DELETE:
      return Object.assign(
        {},
        state,
        // console.log("TOTAL_KG_DELETE-->",action.data),
        {
          // ...state,
          // data: state.data,
          total_KGS: action.data,
          // cart_count: state.cart_count
        },
      );
    case Actions.ADD_TOTAL_KG:
      return Object.assign({}, state, {
        total_KGS: action.data,
      });
    case Actions.GETTOTALITEMANDKGS:
      // console.log('====',action.data)
      return Object.assign(
        {},
        state,
        // console.log('GETTOTALITEMANDKGS', state.total_KGS),
        // console.log('GETTOTALITEMANDKGS', state.total_items),
        {
          total_KGS: state.total_KGS,
          total_items: state.total_items,
        },
      );
    case Actions.PRODUCT_RESET:
      return Object.assign({}, state, {
        // ...state,
        total_KGS: 0,
        total_items: 0,
        cart_items: [],
        cart_count: undefined,
      });
    case Actions.PRODUCT_LIST_RESET:
      return Object.assign({}, state, {
        data: undefined,
      });
    default:
      return state;
  }
};

export default ProductReducer;

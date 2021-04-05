import * as ActionTypes from './ActionTypes';

export const serviceActionPending = () => ({
  type: ActionTypes.PRODUCT_LIST_PENDING,
});

export const serviceActionError = (error) => ({
  type: ActionTypes.PRODUCT_LIST_ERROR,
  error: error,
});

export const serviceActionSuccess_Home = (data) => ({
  type: ActionTypes.HOME_SERVICE_SUCCESS,
  data: data,
});
export const serviceActionSuccess = (data) => ({
  type: ActionTypes.PRODUCT_LIST_SUCCESS,
  data: data,
});

export const addToCart = (data) => ({
  type: ActionTypes.ADD_TO_CART,
  data: data,
});
export const addToCartfordelete = (data) => ({
  type: ActionTypes.ADD_TO_CART_FOR_DELETE,
  data: data,
});
export const addToCartforUndelete = (data) => ({
  type: ActionTypes.ADD_TO_CART_FOR_UNDELETE,
  data: data,
});

export const service_id = (data) => ({
  type: ActionTypes.SERVICE_ID,
  data: data,
});
export const addTotalItemsPlus = (data) => ({
  type: ActionTypes.ADD_TOTAL_ITEMS_PLUS,
  data: data,
});
export const addTotalItemsMinus = (data) => ({
  type: ActionTypes.ADD_TOTAL_ITEMS_MINUS,
  data: data,
});
export const totalItemsDelete = (data) => ({
  type: ActionTypes.TOTAL_ITEMS_DELETE,
  data: data,
});
export const totalKGsDelete = (data) => ({
  type: ActionTypes.TOTAL_KG_DELETE,
  data: data,
});
export const addTotalKg = (data) => ({
  type: ActionTypes.ADD_TOTAL_KG,
  data: data,
});

export const productReset = () => ({
  type: ActionTypes.PRODUCT_RESET,
});

export const productListReset = () => ({
  type: ActionTypes.PRODUCT_LIST_RESET,
});

export const getTotalItemAndKgs = () => ({
  type: ActionTypes.GETTOTALITEMANDKGS,
});

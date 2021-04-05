import * as ActionTypes from './ActionTypes';

export const subTotal = (data) => ({
  type: ActionTypes.SUB_TOTAL,
  data: data,
});

export const total = (data) => ({
  type: ActionTypes.TOTAL,
  data: data,
});

export const promo = (data) => ({
  type: ActionTypes.PROMO,
  data: data,
});

export const calculatePricing = () => ({
  type: ActionTypes.CALCULATE_PRICING,
});

export const selectAddress = (data) => ({
  type: ActionTypes.SELECT_ADDRESS,
  data: data,
});

export const selectDate = (data) => ({
  type: ActionTypes.SELECT_DATE,
  data: data,
});

export const ConfirmOrder = () => ({
  type: ActionTypes.CONFIRM_ORDER,
});
export const ConfirmOrderEdit = () => ({
  type: ActionTypes.CONFIRM_ORDER_EDIT,
});
export const reset = () => ({
  type: ActionTypes.RESET,
});

export const specialRequest = (data) => ({
  type: ActionTypes.SPECIAL_REQUEST,
  data: data,
});
export const showEditBtn = (data) => ({
  type: ActionTypes.SHOW_EDIT_BTN,
  data: data,
});

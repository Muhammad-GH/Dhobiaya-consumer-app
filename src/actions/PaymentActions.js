import * as ActionTypes from './ActionTypes';

export const orderServicePending = () => ({
  type: ActionTypes.ORDER_SERVICE_PENDING,
});

export const orderServiceError = (error) => ({
  type: ActionTypes.ORDER_SERVICE_ERROR,
  error: error,
});

export const orderServiceSuccess = (data) => ({
  type: ActionTypes.ORDER_SERVICE_SUCCESS,
  data: data,
});

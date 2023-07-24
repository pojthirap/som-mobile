const initialState = {
  dataEmail: '',
  dataEmail_loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'EMAIL_JOB_FOR_PLANTRIPI_SUCCESS':
      return {
        ...state,
        dataEmail_loading: false,
        dataEmail: action.payload,
      };
    default:
      return state;
  }
};

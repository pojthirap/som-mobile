const initialState = {
    dataSelect: '',
    dataSelect_Loding: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_DATA_SUCCESS':
      return {
        ...state,
        dataSelect: action.payload,
        dataSelect_Loding: false,
      };
      
    default:
      return state;
  }
};
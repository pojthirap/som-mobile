const initialState = {
    dataUserProfile: '',
    dataUserProfile_Loding: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
      case 'GET_USER_SUCCESS':
          return {
            ...state,
            dataUserProfile: action.payload,
            dataUserProfile_Loding: false,
          };
    //  case 'RESET':
    //      return {
    //          ...state,
    //          dataUserProfile: '',
    //          dataUserProfile_Loding: true,
    //      }
      default:
        return state;
    }
  };
const initialState = {
    lovKeyword: '',
    lovKeyword_Loding: true,
    lovKeywordDay: '',
    lovKeywordDay_Loding: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CONFIGLOV_ACCOUNT_SUCCESS':
      return {
        ...state,
        lovKeyword: action.payload,
        lovKeyword_Loding: false,
      };
    case 'CONFIGLOV_ACCOUNT_DAY_SUCCESS':
        return {
          ...state,
          lovKeywordDay: action.payload,
          lovKeywordDay_Loding: false,
        };
      
    default:
      return state;
  }
};
const initialState = {
    lovKeyword: '',
    lovKeyword_Loding: true,
    lovKeywordDay: '',
    lovKeywordDay_Loding: true,
    lovKeywordPlanStatus: '',
    lovKeywordPlanStatus_Loading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CONFIGLOV_SUCCESS':
      return {
        ...state,
        lovKeyword: action.payload,
        lovKeyword_Loding: false,
      };
    case 'CONFIGLOV_DAY_SUCCESS':
        return {
          ...state,
          lovKeywordDay: action.payload,
          lovKeywordDay_Loding: false,
        };
    case 'CONFIGLOV_PLANSTATUS_SUCCESS':
      return {
        ...state,
        lovKeywordPlanStatus: action.payload,
        lovKeywordPlanStatus_Loading: false,
      };
    case 'RESET_CONFIGLOV_PLANSTATUS':
      return {
        ...state,
        lovKeywordPlanStatus: '',
        lovKeywordPlanStatus_Loading: true,
      };
      
    default:
      return state;
  }
};
const initialState = {
    dataOther:'',
    dataOther_Loading: true,
    dataOtherErrorMSG: '',
    dataOtherErrorMSG_Loading: true,
    clone_success: false,
    clone_Error: false,
    clone_Error_msg:''
};


export default (state = initialState, action) => {
  switch (action.type) {
    case 'MY_OTHER_DATA_SUCCESS':
        return {
          ...state,
          dataOther:action.payload,
          dataOther_Loading: false,
          dataOtherErrorMSG: '',
          dataOtherErrorMSG_Loading: true
        };
    case 'MY_OTHER_DATA_FAIL':
      return {
        ...state,
        dataOtherErrorMSG: action.payload,
        dataOtherErrorMSG_Loading: false,
        dataOther:'',
        dataOther_Loading: true
      };
    case 'CLONE_OTHER_DATA_SUCCESS':
      return {
        ...state,
        clone_success: true,
        clone_Error: false
      };
    case 'CLONE_OTHER_DATA_FAIL':
      return {
        ...state,
        clone_Error_msg:action.payload,
        clone_success: true,
        clone_Error: true
      };
    case 'RESET':
        return {
            ...state,
            dataOther:'',
            dataOther_Loading: true,
            clone_success: false,
            clone_Error: false,
            clone_Error_msg:'',
            dataOtherErrorMSG: '',
            dataOtherErrorMSG_Loading: true,
        };
    case 'RESET_LODING':
        return {
            ...state,
            dataOther_Loading: true,
            clone_success: false,
            clone_Error: false,
            clone_Error_msg:'',
            dataOtherErrorMSG: '',
            dataOtherErrorMSG_Loading: true,
        };

    default:
      return state;
  }
};
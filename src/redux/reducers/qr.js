const initialState = {
    meter: null,
    is_loading:false,
    is_success:false,
    is_meter_page:false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'QR_LOAD':
        return {
          ...state,
          is_loading: true,
        };
    case 'QR_SUCCESS':
      return {
        ...state,
        meter: action.payload,
        is_success:true,
        is_loading: false,
        is_meter_page:true,
      };
      case 'RESET_QR_SUCCESS':
        return {
          ...state,
          is_success:false,
          is_meter_page:false,
        };
      case 'QR_FALIED':
        return {
          ...state,
          is_loading: false,
          is_meter_page:false,
        };
        case 'QR_RESET':
            return {
              ...state,
              meter:null,
              is_loading: false,
        };
        case 'QR_RESET_METER_PAGE':
          return {
            ...state,
            is_meter_page: false,
            is_loading: false,
      };
    default:
      return state;
  }
};
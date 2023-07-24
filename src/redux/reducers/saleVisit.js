const initialState = {
    isTemplateBack:false,
    planTrip:null,
    plantTripChecking:null,
    isCheckout:false,
    completeTrip:[],
    reloadTask:false,
};


export default (state = initialState, action) => {
    switch (action.type) {
      case 'TEMPLATE_BACK':
          return {
            ...state,
            isTemplateBack: true
          };
      case 'TEMPLATE_RESET':
          return {
              ...state,
              isTemplateBack: false,
          };
       case 'SET_PLANT_TRIP':
          return {
              ...state,
              planTrip:action.payload
          };
        case 'SET_CHECK_PLANT':
            return {
                ...state,
                plantTripChecking:action.payload
        };
        case 'RESET_PLANTRIP':
          return {
              ...state,
              planTrip:null
          };
        case 'SET_CHECKOUT':
            return {
                ...state,
                isCheckout:true
            };
        case 'RESET_CHECKOUT':
            return {
                ...state,
                isCheckout:false
        };
        case 'RESET_NEWTRIP':
          return {
              ...state,
              isTemplateBack:false,
              planTrip:null,
              plantTripChecking:null,
              isCheckout:false,
      };
      case 'UPDATE_TRIP':
        return {
          ...state,
          completeTrip:action.payload
  };
      case 'RESET_ALL':
        return {
            ...state,
            isTemplateBack:false,
            planTrip:null,
            isCheckout:false,
            completeCount:[],
            reloadTask:false
    };
    case 'SET_RELOAD_TASK':
      return {
          ...state,
          reloadTask:true
  };
    case 'RESET_RELOAD_TASK':
      return {
          ...state,
          reloadTask:false
  };
      default:
        return state;
    }
  };
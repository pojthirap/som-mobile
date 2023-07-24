const initialState = {
    data: '',
    qr_loading: true,
    customer: [],
    customer_loading: true,
    remove_loading: false,
    gasoline: '',
    gasoline_loading: true,
    addMeterloadingSuccess: false,
    addMeterloadingError: false,
    remove_error: false,
    metererrorMSG: '',

    location: '',
    location_loading: true,
    province: '',
    province_loading: true,
    locationtype: [],
    locationtype_loading: true,
    addLocationloadingSuccess: false,
    addLocationloadingError: false,
    removeLoc_loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'QR_CUSTOMER_SUCCESS':
      return {
        ...state,
        customer_loading: false,
        customer: action.payload,
        // remove_loading: false
      };
    case 'QR_DATA_SUCCESS':
      return {
        ...state,
        qr_loading: false,
        data: action.payload,
        remove_loading: false,
        addMeterloadingSuccess: false,
        addMeterloadingError: false,
        remove_loading: false,
        remove_error: false,
      };
    case 'SEARCHGASOLINE_SUCCESS':
      return {
        ...state,
        gasoline: action.payload,
        gasoline_loading: false,
        addMeterloadingSuccess: false
      };
    case 'ADDMETER_SUCCESS':
      return {
        ...state,
        qr_loading: false,
        addMeterloadingSuccess: true,
        addMeterloadingError: false
      };
    case 'ADDMETER_FAIL':
      return {
        ...state,
        metererrorMSG: action.payload,
        qr_loading: false,
        addMeterloadingSuccess: true,
        addMeterloadingError: true
      }; 
    case 'UPDMETER_SUCCESS':
      return {
        ...state,
        qr_loading: false,
        remove_loading: false,
        addMeterloadingSuccess: true,
        addMeterloadingError: false
      }; 
    case 'UPDMETER_FAIL':
      return {
        ...state,
        metererrorMSG: action.payload,
        qr_loading: false,
        addMeterloadingSuccess: true,
        addMeterloadingError: true
      }; 
    case 'QR_REMOVE_SUCCESS':
      return {
        ...state,
        qr_loading: false,
        remove_loading: true,
      };
    case 'QR_REMOVE_ERROR':
      return {
        ...state,
        metererrorMSG: action.payload,
        qr_loading: false,
        addMeterloadingError: false,
        remove_loading: true,
        remove_error: true
      };
  
    // location Screen
    case 'SEARCHPROVINCE_SUCCESS': 
      return {
        ...state,
        province: action.payload,
        province_loading: false
      };
    case 'SEARCHLOCATIONTYPE_SUCCESS':
    return {
      ...state,
      locationtype: action.payload,
      locationtype_loading: false
    };  
    case 'LOCATION_DATA_SUCCESS':
    return {
      ...state,
      location: action.payload,
      location_loading: false,
      addLocationloadingSuccess: false,
      addLocationloadingError: false,
      removeLoc_loading: false,
      removeLoc_error: false,
    };  
    case 'ADDLOCATION_SUCCESS':
      return {
      ...state,
      location_loading: true,
      addLocationloadingSuccess: true,
      addLocationloadingError: false
    };
    case 'ADDLOCATION_FAIL':
      return {
        ...state,
        location_loading: false,
        locationerrorMSG: action.payload,
        addLocationloadingSuccess: true,
        addLocationloadingError: true
      }; 
    case 'UPDLOCATION_SUCCESS':
      return {
        ...state,
        location_loading: true,
        removeLoc_loading: false,
        addLocationloadingSuccess: true,
        addLocationloadingError: false,
      }; 
    case 'UPDLOCATION_FAIL':
      return {
        ...state,
        locationerrorMSG: action.payload,
        location_loading: true,
        addLocationloadingSuccess: true,
        addLocationloadingError: true
      }; 
    case 'LOCATION_REMOVE_SUCCESS':
      return {
        ...state,
        location_loading: true,
        removeLoc_loading: true,
        removeLoc_error: false,
      };
    case 'LOCATION_REMOVE_ERROR':
      return {
        ...state,
        qr_loading: false,
        locationerrorMSG: action.payload,
        removeLoc_loading: true,
        removeLoc_error: true
      };

    case 'RESET_MASTERLOC':
      return {
        ...state,
        data: '',
        qr_loading: true,
        customer: [],
        customer_loading: true,
        remove_loading: false,
        gasoline_loading: true,
        addMeterloadingSuccess: false,
        addMeterloadingError: false,
        remove_error: false,
        location_loading: true,
        province_loading: true,
        locationtype_loading: true,
        addLocationloadingSuccess: false,
        addLocationloadingError: false,
        removeLoc_loading: false,
        removeLoc_error: false,
      };
    case 'RESET_MSGERROR':
      return {
        ...state,
        metererrorMSG: '',
        locationerrorMSG: '',
        addMeterloadingSuccess: false,
        addMeterloadingError: false,
        addLocationloadingSuccess: false,
        addLocationloadingError: false,
        remove_loading: false,
        remove_error: false,
        removeLoc_loading: false,
        removeLoc_error: false,
      };
    case 'RESET_MASTERQR':
      return {
        ...state,
        data: '',
        qr_loading: true,
        customer: [],
        customer_loading: true,
        remove_loading: false,
        gasoline: '',
        gasoline_loading: true,
        addMeterloadingSuccess: false,
        addMeterloadingError: false,
        remove_error: false,
        metererrorMSG: '',
        location: '',
        location_loading: true,
        province: '',
        province_loading: true,
        locationtype: [],
        locationtype_loading: true,
        addLocationloadingSuccess: false,
        addLocationloadingError: false,
        removeLoc_loading: false,
        removeLoc_error: false,
      };

    default:
      return state;
  }
};

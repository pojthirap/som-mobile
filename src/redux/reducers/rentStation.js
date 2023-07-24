const initialState = {
    dataRent:'',
    dataRent_Loading: true,
    dataRentErrorMSG: '',
    dataRentErrorMSG_Loading: true,
    dataRentInTerritory:'',
    dataRentInTerritory_Loding: true,
    dataRentInTerritoryErrorMSG: '',
    dataRentInTerritoryErrorMSG_Loding: true,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case 'MY_RENT_DATA_SUCCESS':
        return {
            ...state,
            dataRent:action.payload,
            dataRent_Loading: false,
            dataRentErrorMSG: '',
            dataRentErrorMSG_Loading: true
        };
    case 'MY_RENT_DATA_FAIL':
        return {
            ...state,
            dataRentErrorMSG: action.payload,
            dataRentErrorMSG_Loading: false,
            dataRent: '',
            dataRent_Loading: true
        };
    case 'INTERRITORY_RENT_DATA_SUCCESS':
        return {
            ...state,
            dataRentInTerritory:action.payload,
            dataRentInTerritory_Loding: false,
            dataRentInTerritoryErrorMSG: '',
            dataRentInTerritoryErrorMSG_Loding: true,
        };
    case 'INTERRITORY_RENT_DATA_FAIL':
        return {
            ...state,
            dataRentInTerritoryErrorMSG: action.payload,
            dataRentInTerritoryErrorMSG_Loding: false,
            dataRentInTerritory: '',
            dataRentInTerritory_Loding: true
        };
    case 'RESET':
        return {
            ...state,
            dataRent:'',
            dataRent_Loading: true,
            dataRentErrorMSG: '',
            dataRentErrorMSG_Loading: true,
            dataRentInTerritory:'',
            dataRentInTerritory_Loding: true,
            dataRentInTerritoryErrorMSG: '',
            dataRentInTerritoryErrorMSG_Loding: true,
        };

    default:
      return state;
  }
};
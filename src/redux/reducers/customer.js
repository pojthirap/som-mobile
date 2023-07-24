const initialState = {
    dataCustomer: null,
    isLoading: true,
    dataCustomerErrorMSG: '',
    isLoadingCustomerErrorMSG: true,
    dataTerritory: null,
    dataTerritoryErrorMSG: '',
    isLoadingTerritoryErrorMSG: true,
    customerPage:1,
    customerLegth:9,
    pagingCustomer:[],
    isCustomerLoading: false,
    isTERRITORYLoading:false,
    territoryPage:1,
    territoryLegth:9,
    pagingTerritory:[],
    customerPage:1,
    territoryPage:1,

};


export default (state = initialState, action) => {
  switch (action.type) {
    case 'CUSTOMER_LOADING':
        return {
          ...state,
          isLoading: true,
          dataCustomerErrorMSG: '',
          isLoadingCustomerErrorMSG: true
        };
    case 'CUSTOMER_SUCCESS':
      return {
        ...state,
        dataCustomer: action.payload,
        isLoading: false,
        dataCustomerErrorMSG: '',
        isLoadingCustomerErrorMSG: true
      };
      case 'CUSTOMER_FALIED':
      return {
        ...state,
        dataCustomerErrorMSG: action.payload,
        isLoadingCustomerErrorMSG: false,
        dataCustomer: null,
        isLoading: true,
      };
      case 'CUSTOMER_PAGE':
        return {
          ...state,
          customerPage: action.payload,
        };
      case 'TERRITORY_PAGE':
          return {
            ...state,
            territoryPage: action.payload,
      };
      case 'TERRITORY_LOADING':
        return {
          ...state,
          isLoading: true,
          dataTerritoryErrorMSG: '',
          isLoadingTerritoryErrorMSG: true,
        };
    case 'TERRITORY_SUCCESS':
      return {
        ...state,
        dataTerritory: action.payload,
        isLoading: false,
        dataTerritoryErrorMSG: '',
        isLoadingTerritoryErrorMSG: true,
      };
      case 'TERRITORY_FALIED':
      return {
        ...state,
        dataTerritoryErrorMSG: action.payload,
        isLoadingTerritoryErrorMSG: false,
        dataTerritory: null,
        isLoading: true,
      };
    default:
      return state;
  }
};
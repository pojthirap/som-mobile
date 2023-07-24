const initialState = {
    dataSalesOrder: '',
    dataSalesOrder_Loading: true,
    dataCusSalesOrder:'',
    dataCusSalesOrder_Loading:true,
    dataDocType:'',
    dataDocType_Loading:true,
    dataSaleArea:'',
    dataSaleArea_Loading:true,
    dataShipTo:'',
    dataShipTo_Loading:true,
    dataCusCreate:'',
    dataCusCreate_Loading:true,
    createdSaleOrderErrorMSG: '',
    createdSaleOrderData:'',
    createdSaleOrderloadingSuccess: false,
    createdSaleOrderloadingError: false,
    removeSaledata_Loading:false,
    removeErrorMSG: '',
    dataProductByPlant: '',
    dataProductByPlant_Loading: true,
    dataProductConversion: '',
    dataProductConversion_Loading: true,
    orderReasonData:'',
    orderReasonData_Loading:true,
    companyData:'',
    companyData_Loading:true,
    plantData:'',
    plantData_Loading:true,
    plantDataErrorMSG:'',
    plantDataloadingSuccess: false,
    plantDataloadingError: false,
    shipPointData:'',
    shipPointData_Loading:true,
    shipPointDataErrorMSG:'',
    shipPointDataloadingSuccess: false,
    shipPointDataloadingError: false,
    saleOrderById : '',
    saleOrderById_Loading:true,
    updateDataListProduct: '',
    updateDataListProduct_Loading: true,
    incotermData:'',
    incotermData_Loading: true,
    changeData:'',
    changeData_Loading: true,
    simulateErrorMSG:'',
    simulateSuccessMSG:'',
    simulateloadingSuccess: false,
    simulateloadingError: false,
    createdByQuaErrorMSG: '',
    createdByQuaData:'',
    createdByQualoadingSuccess: false,
    createdByQualoadingError: false,
    dataProductByCustSale: '',
    dataProductByCustSale_Loading: true,
    notifyOverviewData: '',
    notifyOverviewData_Loading: true,

}

export default (state = initialState, action) => {
    switch (action.type) {
      case 'SALES_ORDER_DATA_SUCCESS':
          return {
            ...state,
            dataSalesOrder:action.payload,
            dataSalesOrder_Loading: false
          };
      case 'CUS_SALES_ORDER_DATA_SUCCESS':
        return {
          ...state,
          dataCusSalesOrder: action.payload,
          dataCusSalesOrder_Loading: false
        };
      case 'DOC_TYPE_DATA_SUCCESS':
        return {
          ...state,
          dataDocType: action.payload,
          dataDocType_Loading: false
        };
      case 'SALE_AREA_DATA_SUCCESS':
        return {
          ...state,
          dataSaleArea: action.payload,
          dataSaleArea_Loading: false
        };
      case 'SHIP_TO_DATA_SUCCESS':
        return {
          ...state,
          dataShipTo: action.payload,
          dataShipTo_Loading: false
        };
      case 'CUS_CREATE_DATA_SUCCESS':
        return {
          ...state,
          dataCusCreate: action.payload,
          dataCusCreate_Loading: false
        };
      case 'CREATE_SALE_ORDER_SUCCESS':
        return {
          ...state,
          createdSaleOrderData: action.payload,
          createdSaleOrderloadingSuccess: true,
          createdSaleOrderloadingError: false,
        };
      case 'CREATE_SALE_ORDER_FAIL':
        return {
          ...state,
          createdSaleOrderErrorMSG: action.payload,
          createdSaleOrderloadingSuccess: true,
          createdSaleOrderloadingError: true,
      };
      case 'REMOVE_SALE_ORDER_SUCCESS':
        return {
          ...state,
          removeSaledata_Loading: true,
        };
      case 'REMOVE_SALE_ORDER_ERROR':
        return {
          ...state,
          removeErrorMSG: action.payload,
          removeSaledata_Loading: true,
        };
        case 'ORDER_REASON_DATA_SUCCESS':
          return {
            ...state,
            orderReasonData: action.payload,
            orderReasonData_Loading: false,
          };
      case 'RESET_ERROR':
        return {
          ...state,
          createdSaleOrderErrorMSG: '',
          createdSaleOrderloadingSuccess: false,
          createdSaleOrderloadingError: false,
          createdByQuaErrorMSG: '',
          createdByQualoadingSuccess: false,
          createdByQualoadingError: false,
      };
      case 'COMPANY_DATA_SUCCESS':
        return {
          ...state,
          companyData:action.payload,
          companyData_Loading:false,
      };
      case 'PLANT_DATA_SUCCESS':
        return {
          ...state,
          plantData:action.payload,
          plantData_Loading:false,
          plantDataloadingSuccess: true,
          plantDataloadingError: false,
      };
      case 'PLANT_DATA_FAIL':
        return {
          ...state,
          plantDataErrorMSG:action.payload,
          plantDataloadingSuccess: true,
          plantDataloadingError: true,
      };
      case 'RESET_PLANT_DATA_FAIL':
        return {
          ...state,
          plantDataErrorMSG:'',
          plantDataloadingSuccess: false,
          plantDataloadingError: false,
      };
      case 'SHIPPOINT_DATA_SUCCESS':
        return {
          ...state,
          shipPointData:action.payload,
          shipPointData_Loading:false,
          shipPointDataloadingSuccess: true,
          shipPointDataloadingError: false,
      };
      case 'SHIPPOINT_DATA_FAIL':
        return {
          ...state,
          shipPointDataErrorMSG:'',
          shipPointDataloadingSuccess: true,
          shipPointDataloadingError: true,
      };
      case 'RESET_SHIPPOINT_DATA_FAIL':
        return {
          ...state,
          shipPointDataErrorMSG:'',
          shipPointDataloadingSuccess: false,
          shipPointDataloadingError: false,
      };
      case 'SALE_ORDER_BY_ID_DATA_SUCCESS':
        return {
          ...state,
          saleOrderById:action.payload,
          saleOrderById_Loading:false,
      };
      case 'RESET':
          return {
              ...state,
              dataSalesOrder: '',
              dataSalesOrder_Loading: true,
              dataCusSalesOrder:'',
              dataCusSalesOrder_Loading:true,
              dataDocType:'',
              dataDocType_Loading:true,
              dataSaleArea:'',
              dataSaleArea_Loading:true,
              dataShipTo:'',
              dataShipTo_Loading:true,
              dataCusCreate:'',
              dataCusCreate_Loading:true,
              createdSaleOrderErrorMSG: '',
              createdSaleOrderData:'',
              createdSaleOrderloadingSuccess: false,
              createdSaleOrderloadingError: false,
              removeSaledata_Loading:false,
              removeErrorMSG: '',
              orderReasonData:'',
              orderReasonData_Loading:true,
              companyData:'',
              companyData_Loading:true,
              plantData:'',
              plantData_Loading:true,
              shipPointData:'',
              shipPointData_Loading:true,
              saleOrderById : '',
              saleOrderById_Loading:true,
              incotermData:'',
              incotermData_Loading: true,
              dataSaleOrderDocFlow: '',
              dataSaleOrderDocFlow_Loading: true,
              changeData:'',
              changeData_Loading: true,
              simulateErrorMSG:'',
              simulateSuccessMSG:'',
              simulateloadingSuccess: false,
              simulateloadingError: false,
              createdByQuaErrorMSG: '',
              createdByQuaData:'',
              createdByQualoadingSuccess: false,
              createdByQualoadingError: false,
          };
      case 'PRODUCTBYPLANT_DATA_SUCCESS':
        return {
          ...state,
          dataProductByPlant: action.payload,
          dataProductByPlant_Loading: false,
        };
      case 'PRODUCTCONVERS_DATA_SUCCESS':
        return {
          ...state,
          dataProductConversion: action.payload,
          dataProductConversion_Loading: false,
          dataProductByPlant_Loading: true,
        };
      case 'UPDATEDATALIST_SUCCESS':
        return {
          ...state,
          updateDataListProduct: action.payload,
          updateDataListProduct_Loading: false,
        };
      case 'ICOTERM_DATA_SUCCESS':
        return {
          ...state,
          incotermData: action.payload,
          incotermData_Loading: false,
        };
      case 'DOCFLOW_DATA_SUCCESS':
        return {
          ...state,
          dataSaleOrderDocFlow: action.payload,
          dataSaleOrderDocFlow_Loading: false,
        };
      case 'CHANGE_DATA_SUCCESS':
        return {
          ...state,
          changeData: action.payload,
          changeData_Loading: false,
        };
      case 'SIMULATE_SALE_ORDER_SUCCESS':
        return {
          ...state,
          simulateloadingSuccess: true,
          simulateloadingError: false,
          simulateSuccessMSG:action.payload,
      };
      case 'SIMULATE_SALE_ORDER_FAIL':
        return {
          ...state,
          simulateErrorMSG:action.payload,
          simulateloadingSuccess: true,
          simulateloadingError: true,
      };
      case 'CREATE_BY_QUA_SUCCESS':
        return {
          ...state,
          createdByQuaData: action.payload,
          createdByQualoadingSuccess: true,
          createdByQualoadingError: false,
        };
      case 'CREATE_BY_QUA_FAIL':
        return {
          ...state,
          createdByQuaErrorMSG: action.payload,
          createdByQualoadingSuccess: true,
          createdByQualoadingError: true,
      };
      case 'PRODUCTBYCUSTSALE_DATA_SUCCESS':
        return {
          ...state,
          dataProductByCustSale: action.payload,
          dataProductByCustSale_Loading: false,
        };
      case 'RESET_LODING_SAVE':
        return{
          ...state,
          simulateloadingSuccess: false
        }
      case 'NOTIFY_OVERVIEW_SUCCESS':
        return {
          ...state,
          notifyOverviewData: action.payload,
          notifyOverviewData_Loading: false,
        };
  
      default:
        return state;
    }
  };
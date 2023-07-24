import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from 'react-native'

import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

export const getCustomer = (custCode = null) => async dispatch => {
  const response = await axios.post(URL.searchCustomer, {
      searchOption: 0,
      searchOrder: 0,
      startRecord: 0,
      length: 0,
      pageNo: 0,
      model: {
        custCode
  }})    

  if (response.data.errorCode == 'S_SUCCESS') {
    let addCustomerLabel = response.data.data.records.map((cust, index) => {
        return {...cust, value: index, label: cust.custNameTh, codeNameLabel: cust.custCode +' : '+ cust.custNameTh +' '+ cust.addressFullnm}
    })
    dispatch({
      type: 'CUS_SALES_ORDER_DATA_SUCCESS',
      payload: addCustomerLabel,
    });
    return true
  } else {
    Alert.alert('', response.data.errorMessage)
    return true
  }
};

export const getSalesOrder = (data, toDate,fromDate,page = 1) => async dispatch => {

  let sendFromDate =  data.fromDate ? data.fromDate : data.toDate ? dayjs(data.toDate).subtract(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : ''
  let sentToDate = data.toDate ? data.toDate : data.fromDate ?  dayjs(data.fromDate).add(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : ''

  const response = await axios.post(URL.searchSaleOrder, {
        "searchOption": 0,
        "searchOrder": 0,
        "startRecord": 0,
        "length": 10,
        "pageNo": page,
        "model": {
          "fromDate": fromDate ? fromDate : sendFromDate ? sendFromDate : null,
          "toDate": toDate ? toDate : sentToDate ? sentToDate : null,
          "custCode": data && data.custCode ? `${data.custCode}` : null,
          "somOrderNo": data && data.somOrderNo ? `${data.somOrderNo}` : null 
        }
      })    
  
    if (response.data.errorCode == 'S_SUCCESS') {
  
      let salesOrderData = response.data.data
      dispatch({
        type: 'RESET',
      });
      dispatch({
        type: 'SALES_ORDER_DATA_SUCCESS',
        payload: salesOrderData,
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
      return true
    }
  };

  export const getDocType = () => async dispatch => {
    const response = await axios.post(URL.searchOrderDocType,{
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {
  
      }
      })    
  
    if (response.data.errorCode == 'S_SUCCESS') {
      let docTypeData = response.data.data.records.map((typeCode, index) => {
        return {...typeCode, value: index, label: typeCode.docTypeCode+' : '+typeCode.docTypeNameTh}
    })
      dispatch({
        type: 'DOC_TYPE_DATA_SUCCESS',
        payload: docTypeData,
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
      return true
    }
  };

export const getSaleArea = (custCode,page = 1) => async dispatch => {
    const response = await axios.post(URL.searchCustomerSaleByCustCode,{
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 5,
      "pageNo": page,
      "model": {
        "custCode": `${custCode}`
      }
      })    
  
    if (response.data.errorCode == 'S_SUCCESS') {
      let saleAreaData = response.data.data
      dispatch({
        type: 'SALE_AREA_DATA_SUCCESS',
        payload: saleAreaData,
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
      return true
    }
  };

export const getShipTo = (custSaleId) => async dispatch => {
    const response = await axios.post(URL.searchShipToByCustSaleId,{
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {
        "custSaleId": `${custSaleId}`
      }
      })    
  
    if (response.data.errorCode == 'S_SUCCESS') {
    let shipToData = response.data.data.records.map((data, index) => {
      return {...data, value: index, label: data.custCode+' : '+data.custNameTh}
  })
      dispatch({
        type: 'SHIP_TO_DATA_SUCCESS',
        payload: shipToData,
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
    }
  };

  export const getCustomerForCreate = (custCode = null) => async dispatch => {
    const response = await axios.post(URL.searchCustomer, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
          custCode
    }})    
  
    if (response.data.errorCode == 'S_SUCCESS') {
      let addCustomerLabel = response.data.data.records.map((cust, index) => {
          return {...cust, value: index, label: cust.custNameTh, codeNameLabel: cust.custCode +' : '+ cust.custNameTh +' '+ cust.addressFullnm}
      })

      dispatch({
        type: 'CUS_CREATE_DATA_SUCCESS',
        payload: addCustomerLabel,
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
      return true
    }
  };

export const createSaleOrder = (data,custSaleId,saleAreaData,shipToCustCode) => async dispatch => { 
    const response = await axios.post(URL.createSaleOrder, {
      "saleOrder": {
        "custCode": data && data.custCode ? `${data.custCode}` : null,
        "docTypeCode":data && data.docTypeCode ? `${data.docTypeCode}` : null,
        "shipToCustPartnerId": data && data.custPartnerId ? `${data.custPartnerId}` : null,
        "shipToCustCode": shipToCustCode ? `${shipToCustCode}` : null, 
        "description": data && data.description ? `${data.description}` : null,
        "deliveryDte": data && data.deliveryDate ? data.deliveryDate : null,
        "contactPerson": data && data.contactPerson ? `${data.contactPerson}` : null,
        "remark": data && data.remark ? `${data.remark}` : null,
        "custSaleId": custSaleId ? `${custSaleId}` : null,
        "orgCode":saleAreaData ? `${saleAreaData.orgCode}`:null,
        "divisionCode":saleAreaData ? `${saleAreaData.divisionCode}`:null,
        "channelCode":saleAreaData ? `${saleAreaData.channelCode}`:null,
      }
    })    
  
    if (response.data.errorCode == 'S_SUCCESS') {
      dispatch({
        type: 'RESET',
      });
      let SaleOrder = response.data.data
      dispatch({
        type: 'CREATE_SALE_ORDER_SUCCESS',
        payload: SaleOrder,
      });
      return true
    } else {
      dispatch({
        type: 'CREATE_SALE_ORDER_FAIL',
        payload: response.data.errorMessage,
      });
      return true
    }
  };

  export const actionClear = () => async dispatch => {
    dispatch({
      type: 'RESET_ERROR',
    });
  };

  export const cancelSaleOrder = (data) => async dispatch => {
    const response = await axios.post(URL.cancelSaleOrder, {
        "orderId": data && data.orderId ? `${data.orderId}` : null,
        "sapOrderNo":  data && data.sapOrderNo ? `${data.sapOrderNo}` : null
      })    
    if (response.data.errorCode == 'S_SUCCESS') {
      dispatch({
        type: 'RESET',
      });
      dispatch({
        type: 'REMOVE_SALE_ORDER_SUCCESS',
      });
      return true
    } else {
      dispatch({
        type: 'REMOVE_SALE_ORDER_ERROR',
        payload: response.data.errorMessage,
      });
      return true
    }
  };

  export const getOrderReason = () => async dispatch => {
    const response = await axios.post(URL.searchOrderReason, {
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {}
    })    
    if (response.data.errorCode == 'S_SUCCESS') {
      let orderResson = response.data.data.records.map((reasonCode, index) => {
        return {...reasonCode, value: index, label: reasonCode.reasonNameTh}
      })
      dispatch({
        type: 'ORDER_REASON_DATA_SUCCESS',
        payload: orderResson
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
    }
  };

  export const getCompany = (custCode) => async dispatch => {
    const response = await axios.post(URL.searchCompany, {
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {
        "custCode": custCode ? `${custCode}` : null
      }
    })    
    if (response.data.errorCode == 'S_SUCCESS') {
      let company = response.data.data
      let addCompanyLabel = response.data.data.records.map((company, index) => {
        return {...company, codeNameLabel: company.companyCode +' : '+ company.companyNameTh}
      })

      dispatch({
        type: 'COMPANY_DATA_SUCCESS',
        // payload: company
        payload: addCompanyLabel
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
    }
  };

  export const getPlant = (CompanyCode) => async dispatch => {
    const response = await axios.post(URL.searchPlantByCompanyCode, {
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {
        "companyCode" : CompanyCode ? `${CompanyCode}` : null
      }
    })    

    dispatch({
      type: 'RESET_PLANT_DATA_FAIL',
    });
    if (response.data.errorCode == 'S_SUCCESS') {
      let plant = response.data.data.records.map((plant, index) => {
        return {...plant, index: index, label: plant.plant +' : '+ plant.name2}
      })
      dispatch({
        type: 'PLANT_DATA_SUCCESS',
        payload: plant
      });
      return true
     } else {
       dispatch({
         type: 'PLANT_DATA_FAIL',
         payload: response.data.errorMessage,
       });
    }
  };

  export const getShipPoint = (PlantCode, saleAreaData) => async dispatch => {
    const response = await axios.post(URL.searchShippingPointByPlantCode, {
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {
        "plantCode" : PlantCode ? `${PlantCode}` : null,
        "shippingConditions" : `${saleAreaData}`
      }
    })  
    
    dispatch({
      type: 'RESET_SHIPPOINT_DATA_FAIL',
    });
    if (response.data.errorCode == 'S_SUCCESS') {
      let ShipPoint = response.data.data
      dispatch({
        type: 'SHIPPOINT_DATA_SUCCESS',
        payload: ShipPoint
      });
      return true
    } else {
       dispatch({
         type: 'SHIPPOINT_DATA_FAIL',
         payload: response.data.errorMessage,
       });
    }
  };

  export const getSaleOrderByOrderId = (orderId) => async dispatch => {
    const response = await axios.post(URL.getSaleOrderByOrderId, {
      "searchOption": 0,
      "searchOrder": 0,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {
        "orderId": orderId ? `${orderId}` : null
      }
    })    
    if (response.data.errorCode == 'S_SUCCESS') {
      let saleOrder = response.data.data.records
      dispatch({
        type: 'SALE_ORDER_BY_ID_DATA_SUCCESS',
        payload: saleOrder
      });
      return true
    } else {
      Alert.alert('', response.data.errorMessage)
    }
  };


  export const searchProductByCustSaleId = (dataSelect) => async dispatch => {
    // let plantCode = SH05
    const response = await axios.post(URL.searchProductByCustSaleId, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
          CustSaleId: `${dataSelect}`
    }})   
      
    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'PRODUCTBYCUSTSALE_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
      Alert.alert('', response.data.errorMessage)
    }
};

export const searchProductConversion = (dataPlanCode) => async dispatch => {

    const response = await axios.post(URL.searchProductConversion, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            prodCode: dataPlanCode.prodCode
    }})   
      
    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'PRODUCTCONVERS_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
      Alert.alert('', response.data.errorMessage)
    }
};

export const updSaleOrderProduct = (overViewData,dataMainSlectOrder, typeSubmit, dataProducInTable, tabChange) => async dispatch => {

    const response = await axios.post(typeSubmit == "TYPE_SUBMIT_CHANGE" ? URL.delSaleOrder : URL.updSaleOrder, {
        typeSubmit: `${typeSubmit}`,
        changeTabDesc: tabChange ? `${tabChange}` : `No Change`,
        saleOrder: {
            orderId: `${dataMainSlectOrder.orderId}`,
            quotationNo: `${dataMainSlectOrder.quotationNo}`,
            custCode: `${overViewData.data.overViewRef.custCode}`,
            somOrderNo: `${dataMainSlectOrder.somOrderNo}`,
            somOrderDte: `${dataMainSlectOrder.somOrderDte}`,
            sapOrderNo: `${dataMainSlectOrder.sapOrderNo}`,
            simulateDtm: dataMainSlectOrder.simulateDtm != null ? `${dataMainSlectOrder.simulateDtm}` : "",
            pricingDtm: dataMainSlectOrder.pricingDtm != null ? `${dataMainSlectOrder.pricingDtm}` : "",
            priceDate: `${dataMainSlectOrder.priceDate}`,
            priceTime: `${dataMainSlectOrder.priceTime}`,
            docTypeCode: `${overViewData.data.overViewRef.docTypeCode}`,
            shipToCustPartnerId: `${overViewData.data.overViewRef.shipToCustPartnerId}`,
            description: `${overViewData.data.overViewRef.description}`,
            deliveryDte: `${overViewData.data.overViewRef.delDtm}`,
            saleRep: `${dataMainSlectOrder.saleRep}`,
            groupCode: `${dataMainSlectOrder.groupCode}`,
            orgCode: `${overViewData.data.overViewRef.orgCode}`,
            channelCode: `${overViewData.data.overViewRef.channelCode}`,
            divisionCode: `${overViewData.data.overViewRef.divisionCode}`,
            priceList: overViewData.data.overViewRef.priceList ? `${overViewData.data.overViewRef.priceList}` : null,
            territory: `${dataMainSlectOrder.territory}`,
            contactPerson: `${overViewData.data.overViewRef.contactPerson}`,
            remark: `${overViewData.data.overViewRef.remark}`,
            reasonCode: overViewData.data.overViewRef.reasonCode != null ? `${overViewData.data.overViewRef.reasonCode}` : null,
            reasonReject: `${dataMainSlectOrder.reasonReject}`,
            netValue: dataMainSlectOrder.netValue != null ? `${dataMainSlectOrder.netValue}` : "",
            tax: dataMainSlectOrder.tax != null ? `${dataMainSlectOrder.tax}` : "",
            total: dataMainSlectOrder.total != null ? `${dataMainSlectOrder.total}` : "",
            paymentTerm: `${dataMainSlectOrder.paymentTerm}`,
            incoterm: `${overViewData.data.overViewRef.incoterm}`,
            plantCode: `${overViewData.data.overViewRef.plantCode}`,
            shipCode: `${overViewData.data.overViewRef.shipPoint}`,
            saleSup: `${dataMainSlectOrder.saleSup}`,
            orderStatus: `${dataMainSlectOrder.orderStatus}`,
            creditStatus: `${dataMainSlectOrder.creditStatus}`,
            sapMsg: `${dataMainSlectOrder.sapMsg}`,
            sapStatus: `${dataMainSlectOrder.sapStatus}`,
            sapOrderDte: dataMainSlectOrder.sapOrderDte != null ? `${dataMainSlectOrder.sapOrderDte}` : "",
            custSaleId: `${overViewData.data.overViewRef.custSaleId}`,
            shipToCustCode: `${overViewData.data.overViewRef.shipToCustCode}`,
            companyCode:`${overViewData.data.overViewRef.companyCode}`,
            poNo: `${overViewData.data.overViewRef.poNo}`,
        },
        items: dataProducInTable        
    })   
    dispatch({
      type: 'RESET_LODING_SAVE'
    });   
    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'SIMULATE_SALE_ORDER_SUCCESS',
            payload: typeSubmit == "TYPE_SUBMIT_CHANGE" ? "" : response.data.data.records[0].sO_Message,
        });
        return true
    }else{
        dispatch({
          type: 'SIMULATE_SALE_ORDER_FAIL',
          payload: response.data.errorMessage,
        });
      return true
    }
};

export const updDataNewOfSaleOrder = (dataNewUpd) => async dispatch => {
  
    let dataListProduct = dataNewUpd
    dispatch({
        type: 'UPDATEDATALIST_SUCCESS',
        payload: dataListProduct,
    });
   
};

export const getIcoterm = () => async dispatch => {
  const response = await axios.post(URL.searchOrderIncoterm, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {}
  })    
  if (response.data.errorCode == 'S_SUCCESS') {
    let Incoterm = response.data.data.records.map((data, index) => {
      return {...data, value: index, label: data.incotermCode+' : '+data.description
      }
    })
    dispatch({
      type: 'ICOTERM_DATA_SUCCESS',
      payload: Incoterm
    });
    return true
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const searchSaleOrderDocFlow = (dataSearchDocFlow) => async dispatch => {

  const response = await axios.post(URL.searchSaleOrderDocFlow, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 0,
    model: {
      sapOrderNo: dataSearchDocFlow.sapOrderNo,
      orgCode: dataSearchDocFlow.orgCode,
      channelCode: dataSearchDocFlow.channelCode,
      divisionCode: dataSearchDocFlow.divisionCode,
      docTypeCode: dataSearchDocFlow.docTypeCode,
      somOrderNo: dataSearchDocFlow.somOrderNo,
      somOrderDte: dataSearchDocFlow.somOrderDte
      // sapOrderNo: "3000525703",
      // orgCode: "1102",
      // channelCode: "30",
      // divisionCode: "10",
      // docTypeCode: "",
      // somOrderNo: "",
      // somOrderDte: "2021-07-05T00:00:00",
  }})   
    
  if (response.data.errorCode == 'S_SUCCESS') {
      dispatch({
          type: 'DOCFLOW_DATA_SUCCESS',
          payload: response.data.data.records,
      });
      return true
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getChange = (orderId,page = 1) => async dispatch => {
  const response = await axios.post(URL.searchSaleOrderChangeLog, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 10,
    "pageNo": page,
    "model": {
      "orderId": orderId ? `${orderId}` : null
    }
  })    
  if (response.data.errorCode == 'S_SUCCESS') {
    let change = response.data.data
    dispatch({
      type: 'CHANGE_DATA_SUCCESS',
      payload: change
    });
    return true
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const createSaleOrderByQuotationNo = (quotationNo) => async dispatch => { 
  if(!quotationNo) return
  const response = await axios.post(URL.createSaleOrderByQuotationNo, {
      "quotationNo": `${quotationNo}`
    }
  )    

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'RESET',
    });
    let SaleOrder = response.data.data
    dispatch({
      type: 'CREATE_BY_QUA_SUCCESS',
      payload: SaleOrder,
    });
    return true
  } else {
    dispatch({
      type: 'CREATE_BY_QUA_FAIL',
      payload: response.data.errorMessage,
    });
    return true
  }
};

export const getNotifyTabOverview = (orderId) => async dispatch => {
  const response = await axios.post(URL.getNotifyTabOverview, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 0,
    model: {
      orderId: `${orderId}`
    }
})    
  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'NOTIFY_OVERVIEW_SUCCESS',
      payload: response.data.data.records
    });
    return true
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};
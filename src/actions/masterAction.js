import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from 'react-native'

import axios from '../api/Axios';
import { URL } from '../api/url';
import { AsyncStorage } from 'react-native';
import { ACTION } from '../utility/enum';
import dayjs from 'dayjs';

// QR Master Screen
export const getQRCustomer = (custCode = null) => async dispatch => {
  const response = await axios.post(URL.searchCustomer, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 0,
    model: {
      custCode
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    let addCustomerLabel = response.data.data.records.map((cust, index) => {
      return { ...cust, value: index, label: cust.custCode + ' : ' + cust.custNameTh }
    })
    dispatch({
      type: 'RESET_MASTERQR',
    });
    dispatch({
      type: 'QR_CUSTOMER_SUCCESS',
      payload: addCustomerLabel,
    });
    return true
  } else {
    Alert.alert('', response.data.errorMessage)
    return true
  }
};
export const getQRCustomerByCustCode = async (custCode = null) => {
  const response = await axios.post(URL.searchCustomer, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 0,
    model: {
      custCode
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let addCustomerLabel = response.data.data.records.map((cust, index) => {
      return { ...cust, value: index, label: cust.custCode + ' : ' + cust.custNameTh }
    })
    let CustomerLabel = response.data.data.records.find(res => res.custCode === custCode)
    return CustomerLabel
  } else {
    Alert.alert('', response.data.errorMessage)
    return null
  }
};

export const getQRAction = ({ page = 1, custCode, cust }, flagActive) => async dispatch => {
  const response = await axios.post(URL.searchGasolineByCust, {
    searchOption: 0,
    searchOrder: 1,
    startRecord: 0,
    length: 10,
    pageNo: page,
    model: {
      custCode: custCode ? custCode : cust ? cust : null,
      custName: null,
      activeFlag: flagActive == "Y" ? `${flagActive}` : null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let qrMaster = response.data.data.records.map((qrMaster, index) => {
      let activeFlagStatus = ''
      if (qrMaster.activeFlagMeter == "Y") {
        activeFlagStatus = 'ใช้งาน'
      }
      if (qrMaster.activeFlagMeter == "N") {
        activeFlagStatus = 'ไม่ใช้งาน'
      }
      return {
        ...qrMaster,
        value: index,
        activeFlagStatus: activeFlagStatus,
        lastUpdate: dayjs(qrMaster.updateDtm).format('DD/MM/YYYY HH:mm:ss')
      }
    })
    dispatch({
      type: 'QR_DATA_SUCCESS',
      payload: { ...response.data.data, records: qrMaster },
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getSearchGasolineAction = ({ custCode }) => async dispatch => {
  const response = await axios.post(URL.searchGasoline, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 0,
    model: {
      gasId: null,
      gasNameTh: null,
      gasNameEn: null,
      activeFlag: "Y",
      gasCode: null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'SEARCHGASOLINE_SUCCESS',
      payload: response.data.data,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const addMeterAction = (data, customer, cust) => async dispatch => {
  const response = await axios.post(URL.addMeter, {
    meterId: data.meterId,
    gasId: JSON.stringify(data.gasId),
    custCode: cust.custCode,
    dispenserNo: data.dispenserNo,
    nozzleNo: data.nozzleNo,
    qrcode: data.qrcode,
    activeFlag: "Y"
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'ADDMETER_SUCCESS',
      payload: response.data.data,
    });
    dispatch(getSearchGasolineAction({ custCode: custCode }))
  } else {
    dispatch({
      type: 'ADDMETER_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const updateMeterAction = (customer, meter, updateData, checked) => async dispatch => {

  const response = await axios.post(URL.updMeter, {
    custCode: customer.custCode,
    custNameTh: customer.custNameTh,
    custNameEn: customer.custNameEn,
    dispenserNo: JSON.stringify(meter.dispenserNo),
    nozzleNo: JSON.stringify(meter.nozzleNo),
    gasId: JSON.stringify(updateData.gasId),
    meterId: JSON.stringify(meter.meterId),
    activeFlag: `${checked}`,
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'UPDMETER_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'ADDMETER_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const cancelMeter = (meterId) => async dispatch => {
  const response = await axios.post(URL.cancelMeter, {
    meterId: JSON.stringify(meterId)
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'QR_REMOVE_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'QR_REMOVE_ERROR',
      payload: response.data.errorMessage,
    });
  }
};

// Location Screen
export const searchProvinceAction = (addressProspect) => async dispatch => {
  let checkProvinceCode = addressProspect && addressProspect.provinceCode ? addressProspect.provinceCode : null

  const response = await axios.post(URL.searchProvince, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 1,
    model: {
      provinceCode: checkProvinceCode,
      // activeFlag: active ? active : null
      activeFlag: "Y"
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    let provList = response.data.data.records.map((province, index) => {
      return { ...province, value: province.provinceCode, label: province.provinceNameTh }
    })

    dispatch({
      type: 'SEARCHPROVINCE_SUCCESS',
      payload: provList,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const searchLocTypeAction = () => async dispatch => {
  const response = await axios.post(URL.searchLocType, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 1,
    model: {
      activeFlag: "Y"
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    let locType = response.data.data.records.map((locationtype, index) => {
      return { ...locationtype, value: locationtype.locTypeId, label: locationtype.locTypeNameTh }
    })

    dispatch({
      type: 'SEARCHLOCATIONTYPE_SUCCESS',
      payload: locType,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getLocAction = (data, flagActive) => async dispatch => {
  const response = await axios.post(URL.searchLoc, {
    searchOption: 0,
    searchOrder: 1,
    startRecord: 0,
    length: 10,
    pageNo: data.page || 1,
    model: {
      locId: null,
      locTypeId: data.locTypeId ? JSON.stringify(data.locTypeId) : null,
      locCode: null,
      locNameTh: data.locNameTh || null,
      locNameEn: null,
      provinceCode: data.provinceCode || null,
      activeFlag: flagActive == "Y" ? `${flagActive}` : null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let lotLongs = response.data.data.records.map((latlong, index) => {
      let activeFlagStatus = ''
      if (latlong.activeFlag == "Y") {
        activeFlagStatus = 'ใช้งาน'
      }
      if (latlong.activeFlag == "N") {
        activeFlagStatus = 'ไม่ใช้งาน'
      }
      return {
        ...latlong,
        value: index,
        lotLongs: latlong.latitude + ' , ' + latlong.longitude,
        nameSaleVosotPlan: latlong.locNameTh,
        activeFlagStatus: activeFlagStatus
      }
    })
    dispatch({
      type: 'RESET_MASTERLOC'
    });
    dispatch({
      type: 'LOCATION_DATA_SUCCESS',
      payload: { ...response.data.data, records: lotLongs },
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getLocActionForCreatePlan = (data, flagActive) => async dispatch => {
  const response = await axios.post(URL.searchLoc, {
    searchOption: 0,
    searchOrder: 1,
    startRecord: 0,
    length: 0,
    pageNo: 0,
    model: {
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let lotLongs = response.data.data.records.map((latlong, index) => {
      let activeFlagStatus = ''
      if (latlong.activeFlag == "Y") {
        activeFlagStatus = 'ใช้งาน'
      }
      if (latlong.activeFlag == "N") {
        activeFlagStatus = 'ไม่ใช้งาน'
      }
      return {
        ...latlong,
        value: index,
        lotLongs: latlong.latitude + ' , ' + latlong.longitude,
        nameSaleVosotPlan: latlong.locNameTh,
        activeFlagStatus: activeFlagStatus
      }
    })
    dispatch({
      type: 'RESET_MASTERLOC'
    });
    dispatch({
      type: 'LOCATION_DATA_SUCCESS',
      payload: { ...response.data.data, records: lotLongs },
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const addLocAction = (data) => async dispatch => {
  const response = await axios.post(URL.addLoc, {
    locId: data.locId,
    locTypeId: `${data.locTypeId}`,
    locCode: data.locCode,
    locNameTh: data.locNameTh,
    locNameEn: data.locNameEn ? data.locNameEn : "",
    provinceCode: data.provinceCode,
    latitude: data.latitude,
    longitude: data.longitude,
    activeFlag: "Y",
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'ADDLOCATION_SUCCESS',
      payload: response.data.data,
    });
    dispatch(getLocAction({}));
  } else {
    dispatch({
      type: 'ADDLOCATION_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const updLocAction = (updateData, data, checked) => async dispatch => {

  const response = await axios.post(URL.updLoc, {
    locId: `${updateData.locId}`,
    locTypeId: `${data.locTypeId}`,
    locCode: updateData.locCode,
    locNameTh: data.locNameTh,
    locNameEn: data.locNameEn ? data.locNameEn : "",
    provinceCode: data.provinceCode,
    latitude: data.latitude,
    longitude: data.longitude,
    activeFlag: `${checked}`,
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'UPDLOCATION_SUCCESS',
      payload: response.data.data,
    });
    dispatch(getLocAction({}));
  } else {
    dispatch({
      type: 'ADDMETER_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const cancelLocation = (locId) => async dispatch => {
  const response = await axios.post(URL.cancelLoc, {
    locId: JSON.stringify(locId)
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'QR_REMOVE_SUCCESS',
      payload: response.data.data,
    });
    dispatch(getLocAction({}));
  } else {
    dispatch({
      type: 'LOCATION_REMOVE_ERROR',
      payload: response.data.errorMessage,
    });
  }
};

export const actionClear = () => async dispatch => {
  dispatch({
    type: 'RESET_MSGERROR',
  });
};
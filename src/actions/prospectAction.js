import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../api/Axios';
import { URL } from '../api/url';
import { AsyncStorage } from 'react-native';
import { ACTION } from '../utility/enum';
import { Alert } from 'react-native';

function paginate(array, page_size, page_number) {
  if (array)
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export const getMyProspect = (accName, status) => async dispatch => {
  let checkStatus = status && (status.indexOf('99') == -1) ? status : ''
  const response = await axios.post(URL.searchMyAccount, {
    "searchOption": 0,
    "searchOrder": 1,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "accName": accName || null,
      "prospectType": "0",
      "prospectStatusLst": checkStatus || []
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let page_count = response.data.data.totalRecords / 8;
    let pages = []
    for (let i = 0; i < page_count; i++) {
      pages.push({ page: i, items: paginate(response.data.data.records, 8, i + 1) });
    }
    response.data.data.item = pages
    dispatch({
      type: 'RESET_PROSPECT'
    });
    let prosData = response.data.data;
    dispatch({
      type: 'MY_PROS_DATA_SUCCESS',
      payload: prosData,
    });
  } else {
    dispatch({
      type: 'MY_PROS_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const getReccomentBUProspect = (accName, status) => async dispatch => {
  let checkStatus = status && (status.indexOf('99') == -1) ? status : '';
  const response = await axios.post(URL.searchProspectRecommend, {
    "searchOption": 0,
    "searchOrder": 1,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "empId": null,
      "prospAccId": null,
      "accName": accName || null,
      "brandId": null,
      "custCode": null,
      "identifyId": null,
      "accGroupRef": null,
      "sourceType": null,
      "activeFlag": null,
      "buId": null,
      "prospectStatus": null,
      "saleRepId": null,
      "prospectType": "0",
      "prospectStatusLst": checkStatus || []
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let page_count = response.data.data.totalRecords / 8;
    let pages = []
    for (let i = 0; i < page_count; i++) {
      pages.push({ page: i, items: paginate(response.data.data.records, 8, i + 1) });
    }
    response.data.data.item = pages
    let reccomentBUProsData = response.data.data;
    dispatch({
      type: 'RECBU_PROS_DATA_SUCCESS',
      payload: reccomentBUProsData,
    });
  } else {
    dispatch({
      type: 'RECBU_PROS_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const getTerritoryProspect = (accName, status) => async dispatch => {
  let checkStatus = status && (status.indexOf('99') == -1) ? status : '';

  const response = await axios.post(URL.searchAccountInTerritory, {
    "searchOption": 0,
    "searchOrder": 1,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "empId": null,
      "prospAccId": null,
      "accName": accName || null,
      "brandId": null,
      "custCode": null,
      "identifyId": null,
      "accGroupRef": null,
      "sourceType": null,
      "activeFlag": null,
      "buId": null,
      "prospectStatus": null,
      "saleRepId": null,
      "prospectType": "0",
      "prospectStatusLst": checkStatus || []
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let page_count = response.data.data.totalRecords / 8;
    let pages = []
    for (let i = 0; i < page_count; i++) {
      pages.push({ page: i, items: paginate(response.data.data.records, 8, i + 1) });
    }
    response.data.data.item = pages
    let InTerritoryData = response.data.data;
    dispatch({
      type: 'TERRITORY_PROS_DATA_SUCCESS',
      payload: InTerritoryData,
    });
  } else {
    dispatch({
      type: 'TERRITORY_PROS_DATA_FAIL',
      payload: response.data.errorMessage
    });
  }
};

// Create prospect Screen
export const getBrand = () => async dispatch => {
  const response = await axios.post(URL.searchBrand, {
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

    let brandDrop = response.data.data.records.map((brand, index) => {
      return { ...brand, value: brand.brandId, label: brand.brandNameTh }
    })

    dispatch({
      type: 'BRAND_DATA_SUCCESS',
      payload: brandDrop,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getDistrict = (province) => async dispatch => {
  let checkProvinceCode = province ? province.provinceCode : null

  const response = await axios.post(URL.searchDistrict, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 1,
    model: {
      provinceCode: checkProvinceCode,
      activeFlag: "Y"
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    let district = response.data.data.records.map((district, index) => {
      return { ...district, value: district.districtId, label: district.districtNameTh }
    })

    dispatch({
      type: 'DISTRICT_DATA_SUCCESS',
      payload: district,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getSubdistrict = (district) => async dispatch => {
  let checkDistrictCode = district ? district.districtCode : null

  const response = await axios.post(URL.searchSubDistrict, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 1,
    model: {
      districtCode: checkDistrictCode,
      activeFlag: "Y"
    }
  })
  if (response.data.errorCode == 'S_SUCCESS') {

    let subdistrict = response.data.data.records.map((subdistrict, index) => {
      return { ...subdistrict, value: subdistrict.subdistrictId, label: subdistrict.subdistrictNameTh }
    })

    dispatch({
      type: 'SUBDISTRICT_DATA_SUCCESS',
      payload: subdistrict,
    });
  } else {
    dispatch({
      type: 'SUBDISTRICT_DATA_ERROR',
      payload: response.data.errorMessage,
    });
  }
};

export const addProspect = (data) => async dispatch => {

  let dataAddress = data.address.data;
  let dataContactInfo = data.contactInfo.data;
  let vatNumber = data.identifyId && data.vatNumber ? `${data.identifyId}-${data.vatNumber}` : null;
  let identifyIdNumber = data.identifyId ? `${data.identifyId}` : null;

  const response = await axios.post(URL.createProspect, {
    prospectAccountModel: {
      accName: data.accName ? data.accName : null,
      brandId: data.brandId ? `${data.brandId}` : null,
      // identifyId: data.identifyId ? data.identifyId : null,
      identifyId: vatNumber ? vatNumber : null,
      // accGroupRef: data.accGroupRef ? data.accGroupRef :  data.identifyId ? data.identifyId : null
      accGroupRef: data.accGroupRef ? data.accGroupRef : identifyIdNumber ? identifyIdNumber : null
    },
    prospectAddressModel: {
      addrNo: dataAddress.addrNo ? dataAddress.addrNo : null,
      moo: dataAddress.moo ? dataAddress.moo : null,
      soi: dataAddress.soi ? dataAddress.soi : null,
      street: dataAddress.street ? dataAddress.street : null,
      tellNo: dataAddress.tellNo ? dataAddress.tellNo : null,
      faxNo: dataAddress.faxNo ? dataAddress.faxNo : null,
      latitude: dataAddress.latitude ? dataAddress.latitude : null,
      longitude: dataAddress.longitude ? dataAddress.longitude : null,
      provinceCode: dataAddress.provinceCode ? dataAddress.provinceCode : null,
      districtCode: dataAddress.districtCode ? dataAddress.districtCode : null,
      subdistrictCode: dataAddress.subdistrictCode ? dataAddress.subdistrictCode : null,
      postCode: dataAddress.postCode ? dataAddress.postCode : null,
      remark: dataAddress.remark ? dataAddress.remark : null
    },
    prospectContactModel: {
      firstName: dataContactInfo.firstName ? dataContactInfo.firstName : null,
      lastName: dataContactInfo.lastName ? dataContactInfo.lastName : null,
      phoneNo: dataContactInfo.phoneNo ? dataContactInfo.phoneNo : null,
      faxNo: dataContactInfo.faxNo ? dataContactInfo.faxNo : null,
      mobileNo: dataContactInfo.mobileNo ? dataContactInfo.mobileNo : null,
      email: dataContactInfo.email ? dataContactInfo.email : null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'PROSPECT_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'PROSPECT_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const getProspectAddress = (dataSelect) => async dispatch => {

  const response = await axios.post(URL.searchProspectAddress, {
    searchOption: dataSelect.isCustomer ? 1 : 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 0,
    model: {
      prospectId: JSON.stringify(dataSelect.prospectAddress.prospectId),
      prosAccId: JSON.stringify(dataSelect.prospectAddress.prospAccId),
      custCode: dataSelect.isCustomer ? dataSelect.prospectAccount.custCode : null,
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    let prospectAddress = response.data.data.records
    dispatch({
      type: 'PROSADDRESS_DATA_SUCCESS',
      payload: prospectAddress,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getAccountTeam = (prospectId, fullName) => async dispatch => {
  const response = await axios.post(URL.searchSalesTerritoryTab, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "prospectId": JSON.stringify(prospectId),
      "fullName": fullName || null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let AccountTeamData = response.data.data;
    dispatch({
      type: 'ACCOUTTEAM_DATA_SUCCESS',
      payload: AccountTeamData,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getSubReccomentBU = (prospectId) => async dispatch => {
  const response = await axios.post(URL.searchRecommendBuTab, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "prospectId": JSON.stringify(prospectId),
      "activeFlag": "Y"
    }
  })


  if (response.data.errorCode == 'S_SUCCESS') {
    let SubReccomentBU = response.data.data;
    dispatch({
      type: 'PROS_SUBREC_DATA_SUCCESS',
      payload: SubReccomentBU,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getBusinessUnit = (prospectId) => async dispatch => {
  const response = await axios.post(URL.searchBusinessUnit, {
    "searchOption": 1,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "activeFlag": "Y",
      "prospectId": JSON.stringify(prospectId),
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let BusinessUnit = response.data.data;
    dispatch({
      type: 'BUS_UNIT_DATA_SUCCESS',
      payload: BusinessUnit,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const addBusinessUnit = (prospectId, buId) => async dispatch => {
  if (!buId) return
  const buIdData = buId.map((item) => { return item.buId.toString() })
  const response = await axios.post(URL.addProspectRecommend, {
    "prospRecommId": "0",
    "prospectId": JSON.stringify(prospectId),
    "activeFlag": "Y",
    "buIdList": buIdData
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let addBusinessUnit = response.data.data;
    dispatch({
      type: 'ADD_BUS_UNIT_DATA_SUCCESS',
      payload: addBusinessUnit,
    });
  } else {
    dispatch({
      type: 'ADD_BUS_UNIT_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const delBusinessUnit = (prospectId, buId, prospRecommId) => async dispatch => {

  // const prospRecommIdDATA = prospRecommId.find((item)=>{ return item.prospRecommId})

  const response = await axios.post(URL.delProspectRecommend, {
    "prospRecommId": JSON.stringify(prospRecommId),
    "prospectId": JSON.stringify(prospectId),
    "activeFlag": "Y",
    "buIdList": [JSON.stringify(buId)]
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let delBusinessUnit = response.data.data;
    dispatch({
      type: 'DEL_BUS_UNIT_DATA_SUCCESS',
      payload: delBusinessUnit,
    });
  } else {
    dispatch({
      type: 'DEL_BUS_UNIT_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};


export const resetAction = () => async dispatch => {
  dispatch({
    type: 'RESET_SUBMENU'
  });
};


export const getRegion = () => async dispatch => {
  // let checkProvinceCode = province ? province.provinceCode : null

  const response = await axios.post(URL.searchRegion, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 10,
    pageNo: 1,
    model: {
      regionCode: null,
      regionName: null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    let region = response.data.data.records.map((region, index) => {
      return { ...region, value: region.regionCode, label: region.regionNameEn }
    })

    dispatch({
      type: 'REGION_DATA_SUCCESS',
      payload: region,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getProspectBasic = (prospect) => async dispatch => {
  let checkProspectId = prospect ? prospect.prospectId : null

  const response = await axios.post(URL.searchProspectSaTab, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 1,
    model: {
      prospectId: JSON.stringify(checkProspectId),
      // fullName: "string"
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let dataProspectBasic = response.data.data.records[0]

    dispatch({
      type: 'PROSBASIC_DATA_SUCCESS',
      payload: dataProspectBasic,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const updateProspectBasic = (data, dataBasic, numberTypeProspect) => async dispatch => {

  let dataAccountList = data.data;
  let addressList = data.data.address.data;
  let contactInfoList = data.data.contactInfo.data;
  let changeFieldContact = data.data.contactInfo.changeField ? `, ${data.data.contactInfo.changeField}` : '';
  let vatNumber = dataAccountList.identifyId && dataAccountList.vatNumber ? `${dataAccountList.identifyId}-${dataAccountList.vatNumber}` : null;
  let identifyIdNumber = dataAccountList.identifyId ? `${dataAccountList.identifyId}` : null;

  const response = await axios.post(URL.updProspectBasicTab, {
    prospectAccountModel: {
      prospAccId: `${dataBasic.prospAccId}`,
      accName: dataAccountList.accName ? dataAccountList.accName : null,
      brandId: dataAccountList.brandId ? `${dataAccountList.brandId}` : null,
      // identifyId: dataAccountList.identifyId ? dataAccountList.identifyId : null,
      identifyId: vatNumber ? vatNumber : null,
      // accGroupRef: dataAccountList.accGroupRef ? dataAccountList.accGroupRef : dataAccountList.identifyId ? dataAccountList.identifyId : null,
      accGroupRef: dataAccountList.accGroupRef ? dataAccountList.accGroupRef : identifyIdNumber ? identifyIdNumber : null,
    },
    prospectModel: {
      prospectId: dataBasic.prospectId ? `${dataBasic.prospectId}` : null,
      prospAccId: dataBasic.prospAccId ? `${dataBasic.prospAccId}` : null,
      prospectType: `${numberTypeProspect}`,
      changeField: data.changeField || changeFieldContact ? `${data.changeField}${changeFieldContact}` : null
    },
    prospectAddressModel: {
      prospAddrId: dataBasic.prospAddrId ? `${dataBasic.prospAddrId}` : null,
      prospectId: dataBasic.prospectId ? `${dataBasic.prospectId}` : null,
      prospAccId: dataBasic.prospAccId ? `${dataBasic.prospAccId}` : null,
      addrNo: addressList.addrNo ? addressList.addrNo : null,
      moo: addressList.moo ? addressList.moo : null,
      soi: addressList.soi ? addressList.soi : null,
      street: addressList.street ? addressList.street : null,
      tellNo: addressList.tellNo ? addressList.tellNo : null,
      faxNo: addressList.faxNo ? addressList.faxNo : null,
      latitude: addressList.latitude ? addressList.latitude : null,
      longitude: addressList.longitude ? addressList.longitude : null,
      regionCode: addressList.regionCode ? addressList.regionCode : null,
      provinceCode: addressList.provinceCode ? addressList.provinceCode : null,
      districtCode: addressList.districtCode ? addressList.districtCode : null,
      subdistrictCode: addressList.subdistrictCode ? addressList.subdistrictCode : null,
      postCode: addressList.postCode ? addressList.postCode : null,
      remark: addressList.remark ? addressList.remark : null,
    },
    prospectContactModel: {
      prospContactId: dataBasic.prospContactId ? `${dataBasic.prospContactId}` : null,
      prospectId: dataBasic.prospectId ? `${dataBasic.prospectId}` : null,
      prospAccId: dataBasic.prospAccId ? `${dataBasic.prospAccId}` : null,
      firstName: contactInfoList.firstName ? contactInfoList.firstName : null,
      lastName: contactInfoList.lastName ? contactInfoList.lastName : null,
      phoneNo: contactInfoList.phoneNo ? contactInfoList.phoneNo : null,
      faxNo: contactInfoList.faxNo ? contactInfoList.faxNo : null,
      mobileNo: contactInfoList.mobileNo ? contactInfoList.mobileNo : null,
      email: contactInfoList.email ? contactInfoList.email : null,
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'UPDBASIC_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'UPDBASIC_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const getFeed = (prospectId) => async dispatch => {

  const response = await axios.post(URL.searchFeedTab, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "prospectId": JSON.stringify(prospectId)
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let dataFeed = response.data.data.records

    dispatch({
      type: 'FEED_DATA_SUCCESS',
      payload: dataFeed,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getProspectContact = (prospectContact,) => async dispatch => {

  const response = await axios.post(URL.searchProspectContact, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 1,
    model: {
      prospectId: JSON.stringify(prospectContact.prospectId),
      prosAccId: JSON.stringify(prospectContact.prospAccId)
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let dataProspectContact = response.data.data.records

    dispatch({
      type: 'PROSCONTACT_DATA_SUCCESS',
      payload: dataProspectContact,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const addContact = (data, prospectContact) => async dispatch => {
  const response = await axios.post(URL.addContact, {
    prospectId: JSON.stringify(prospectContact.prospectId),
    prospAccId: JSON.stringify(prospectContact.prospAccId),
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNo: data.phoneNo,
    faxNo: data.faxNo,
    mobileNo: data.mobileNo,
    email: data.email,
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'ADDPROSCONTACT_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'ADDPROSCONTACT_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const updContact = (data, prospectContact) => async dispatch => {

  const response = await axios.post('/updContact', {
    prospContactId: JSON.stringify(prospectContact.prospContactId),
    prospectId: JSON.stringify(prospectContact.prospectId),
    prospAccId: JSON.stringify(prospectContact.prospAccId),
    firstName: data.data.firstName || '',
    lastName: data.data.lastName || '',
    phoneNo: data.data.phoneNo || '',
    faxNo: data.data.faxNo || '',
    mobileNo: data.data.mobileNo || '',
    email: data.data.email || '',
    changeField: data.changeField || ''
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'UPDPROSCONTACT_DATA_SUCCESS',
      payload: response.data.data,
    });
    // dispatch(getProspectContact({
    //   prospectId: prospectContact.prospectId,
    //   prospAccId: prospectContact.prospAccId
    // }));
  } else {
    dispatch({
      type: 'UPDPROSCONTACT_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const cancelContact = (prospectContact) => async dispatch => {
  const response = await axios.post('/delContact', {
    prospContactId: JSON.stringify(prospectContact.prospContactId),
    prospectId: JSON.stringify(prospectContact.prospectId),
    prospAccId: JSON.stringify(prospectContact.prospAccId),
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'PROSCONTACT_REMOVE_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'PROSCONTACT_REMOVE_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const getSaleTerritory = (prospectId) => async dispatch => {
  const response = await axios.post(URL.searchSalesTerritoryTab, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "prospectId": JSON.stringify(prospectId),
      "fullName": null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let SaleTerritoryData = response.data.data;
    dispatch({
      type: 'SALETERRITORY_DATA_SUCCESS',
      payload: SaleTerritoryData,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const getProspectDbd = (prospect) => async dispatch => {
  let checkProspectId = prospect ? prospect.prospectId : null

  const response = await axios.post(URL.searchProspectSaTab, {
    searchOption: 0,
    searchOrder: 0,
    startRecord: 0,
    length: 0,
    pageNo: 1,
    model: {
      prospectId: JSON.stringify(checkProspectId),
      // fullName: "string"
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let dataProspectDbd = response.data.data.records[0]

    dispatch({
      type: 'PROSDBD_DATA_SUCCESS',
      payload: dataProspectDbd,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const updateProspectDbd = (data, dataDbd, checked) => async dispatch => {

  let reqBody = {
    prospectId: dataDbd.prospectId == null ? "" : `${dataDbd.prospectId}`,
    prospAccId: dataDbd.prospAccId == null ? "" : `${dataDbd.prospAccId}`,
    addrTitleDeedNo: dataDbd.addrTitleDeedNo == null ? "" : dataDbd.addrTitleDeedNo,
    addrCertUtilisation: dataDbd.addrCertUtilisation == null ? "" : dataDbd.addrCertUtilisation,
    addrParcelNo: dataDbd.addrParcelNo == null ? "" : dataDbd.addrParcelNo,
    addrTambonNo: dataDbd.addrTambonNo == null ? "" : dataDbd.addrTambonNo,
    dbdCode: dataDbd.dbdCode == null ? "" : dataDbd.dbdCode,
    dbdCorpType: dataDbd.dbdCorpType == null ? "" : dataDbd.dbdCorpType,
    dbdJuristicStatus: dataDbd.dbdJuristicStatus == null ? "" : dataDbd.dbdJuristicStatus,
    dbdRegCapital: data.data.dbdRegCapital ? data.data.dbdRegCapital : null,
    dbdTotalIncome: data.data.dbdTotalIncome ? data.data.dbdTotalIncome : null,
    dbdProfitLoss: data.data.dbdProfitLoss ? data.data.dbdProfitLoss : null,
    dbdTotalAsset: data.data.dbdTotalAsset ? data.data.dbdTotalAsset : null,
    dbdFleetCard: data.data.dbdFleetCard ? data.data.dbdFleetCard : null,
    dbdCorpCard: data.data.dbdCorpCard ? data.data.dbdCorpCard : null,
    dbdOilConsuption: data.data.dbdOilConsuption ? data.data.dbdOilConsuption : null,
    dbdCurrentStation: data.data.dbdCurrentStation ? data.data.dbdCurrentStation : null,
    dbdPayChannel: checked,
    dbdCarWheel4: data.data.dbdCarWheel4 ? data.data.dbdCarWheel4 : null,
    dbdCarWheel6: data.data.dbdCarWheel6 ? data.data.dbdCarWheel6 : null,
    dbdCarWheel8: data.data.dbdCarWheel8 ? data.data.dbdCarWheel8 : null,
    dbdCaravan: data.data.dbdCaravan ? data.data.dbdCaravan : null,
    dbdCarTrailer: data.data.dbdCarTrailer ? data.data.dbdCarTrailer : null,
    dbdCarContainer: data.data.dbdCarContainer ? data.data.dbdCarContainer : null,
    dbdMachine: data.data.dbdMachine ? data.data.dbdMachine : null,
    dbdOther: data.data.dbdOther ? data.data.dbdOther : null,
    dbdTank: data.data.dbdTank ? data.data.dbdTank : null,
    dbdStation: data.data.dbdStation ? data.data.dbdStation : null,
    dbdType2: data.data.dbdType2 ? data.data.dbdType2 : null,
    dbdMaintainCenter: data.data.dbdMaintainCenter ? data.data.dbdMaintainCenter : null,
    dbdGeneralGarage: data.data.dbdGeneralGarage ? data.data.dbdGeneralGarage : null,
    dbdMaintainDept: data.data.dbdMaintainDept ? data.data.dbdMaintainDept : null,
    dbdRecommender: data.data.dbdRecommender ? data.data.dbdRecommender : null,
    dbdSale: data.data.dbdSale ? data.data.dbdSale : null,
    dbdSaleSupport: data.data.dbdSaleSupport ? data.data.dbdSaleSupport : null,
    dbdRemark: data.data.dbdRemark ? data.data.dbdRemark : null,
    prospectStatus: dataDbd.prospectStatus == null ? "" : dataDbd.prospectStatus,
    changeField: data.changeField ? data.changeField : null
  }

  const response = await axios.post('/updProspectDbdTab', reqBody)

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'UPDDBD_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'UPDDBD_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const getTerritoryForDedicated = (prospectId) => async dispatch => {
  const response = await axios.post(URL.getTerritoryForDedicated, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "propectId": JSON.stringify(prospectId),
      "activeFlag": "Y"
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let TerritoryForDedicated = response.data.data;
    dispatch({
      type: 'TERRI_DEDI_DATA_SUCCESS',
      payload: TerritoryForDedicated,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const addProspectDedicated = (prospectId, territory) => async dispatch => {
  if (!territory) return
  let idOfTerritory = territory.map((item) => {
    return `${item.territoryId}`
  })

  const response = await axios.post(URL.addProspectDedicated, {
    "prospectId": JSON.stringify(prospectId),
    "territoryId": idOfTerritory,
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'ADD_TERRI_DEDI_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'ADD_TERRI_DEDI_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const delProspectDedicated = (prospectId, prospDedicateId, territoryId, activeFlag) => async dispatch => {
  const response = await axios.post(URL.delProspectDedicated, {
    "prospDedicateId": `${prospDedicateId}`,
    "prospectId": `${prospectId}`,
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'DEL_TERRI_DEDI_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'DEL_TERRI_DEDI_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const searchVisitHour = (prospectId) => async dispatch => {
  const response = await axios.post(URL.searchVisitHour, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "prospectId": JSON.stringify(prospectId)
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'VISITHOUR_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const addVisitHour = (prospectId, daysCode, hourStart, hourEnd) => async dispatch => {
  const response = await axios.post(URL.addVisitHour, {
    "prospectId": JSON.stringify(prospectId),
    "daysCode": daysCode,
    "hourStart": hourStart,
    "hourEnd": hourEnd,
    "activeFlag": "Y"
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'ADD_VISITHOUR_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'ADD_VISITHOUR_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};

export const delVisitHour = (prospectId, deleteItem) => async dispatch => {
  if (!deleteItem) return
  const response = await axios.post(URL.delVisitHour, {
    "prospVisitHrId": JSON.stringify(deleteItem.prospVisitHrId),
    "prospectId": JSON.stringify(prospectId),
    "daysCode": [
      deleteItem.daysCode
    ],
    "hourStart": JSON.stringify(deleteItem.hourStart),
    "hourEnd": JSON.stringify(deleteItem.hourEnd),
    "activeFlag": "Y"
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'ADD_VISITHOUR_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    dispatch({
      type: 'ADD_VISITHOUR_DATA_FAIL',
      payload: response.data.errorMessage,
    });
  }
};
export const actionClearPros = () => async dispatch => {
  dispatch({
    type: 'RESET_MSGERRORPROS',
  });
};

export const searchAttachmentTab = (prospectId, data, fromDate, toDate) => async dispatch => {
  const response = await axios.post(URL.searchAttachmentTab, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "prospId": `${prospectId}`,
      "fromDate": fromDate ? fromDate : null,
      "toDate": toDate ? toDate : null,
      "photoFlag": data ? data.typeDataList : null,
      "attachCateId": data && data.attachCateId ? [`${data.attachCateId}`] : null
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {

    dispatch({
      type: 'ATTACHMENT_DATA_SUCCESS',
      payload: response.data.data,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const searchAttachCate = () => async dispatch => {
  const response = await axios.post(URL.searchAttachCate, {
    "searchOption": 0,
    "searchOrder": 0,
    "startRecord": 0,
    "length": 0,
    "pageNo": 0,
    "model": {
      "activeFlag": "Y"
    }
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    let atteachCate = response.data.data
    dispatch({
      type: 'ATTACHMENT_CATE_DATA_SUCCESS',
      payload: atteachCate,
    });
  } else {
    Alert.alert('', response.data.errorMessage)
  }
};

export const delProspect = (prospect) => async dispatch => {
  dispatch({
    type: 'DELETE_PROSPECT',
  });

  let checkProspectId = prospect ? prospect.prospectId : null
  const response = await axios.post(URL.delProspect, {
    prospectId: JSON.stringify(checkProspectId)
  })

  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'DELETE_PROSPECT_SUCCESS',
      payload: response.data.data
    });
  } else {
    dispatch({
      type: 'DELETE_PROSPECT_FAIL',
      payload: response.data.errorMessage
    });
  }
};

export const delProspectClear = () => async dispatch => {
  dispatch({
    type: 'DELETE_PROSPECT',
  });
};
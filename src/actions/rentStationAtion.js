import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';
function paginate(array, page_size, page_number) {
  if(array)
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export const getMyRentStaion = (accName, status) => async dispatch => {
    let checkStatus = status && (status.indexOf('99') == -1 ) ? status : ''
    const response = await axios.post(URL.searchMyAccount, {
        "searchOption": 0,
        "searchOrder": 1,
        "startRecord": 0,
        "length": 0,
        "pageNo": 0,
        "model": {
            "empId":null,
            "prospAccId": null,
            "accName": accName || null,
            "brandId": null,
            "custCode":null ,
            "identifyId": null,
            "accGroupRef": null,
            "sourceType": null,
            "activeFlag": null,
            "buId": null,
            "prospectStatus": null,
            "saleRepId": null,
            "prospectType": "1",
            "prospectStatusLst": checkStatus || []
        }})   

    if (response.data.errorCode == 'S_SUCCESS') {
      let page_count = response.data.data.totalRecords / 8;
      let pages = []
      for(let i = 0 ;i<page_count ;i++ ){
          pages.push({page:i,items:paginate(response.data.data.records,8,i+1)});
      }
      response.data.data.item = pages
        let myGasData = response.data.data;
        dispatch({
            type: 'MY_RENT_DATA_SUCCESS',
            payload: myGasData,
        });
    } else {
        dispatch({
          type: 'MY_RENT_DATA_FAIL',
          payload: response.data.errorMessage,
        });
    }
  };

export const getRentInTerritory = (accName, status) => async dispatch => {
  let checkStatus = status && (status.indexOf('99') == -1 ) ? status : '';
  const response = await axios.post(URL.searchAccountInTerritory,{
      "searchOption": 0,
      "searchOrder": 1,
      "startRecord": 0,
      "length": 0,
      "pageNo": 0,
      "model": {
          "empId":null,
          "prospAccId": null,
          "accName":accName|| null,
          "brandId": null,
          "custCode":null ,
          "identifyId": null,
          "accGroupRef": null,
          "sourceType": null,
          "activeFlag": null,
          "buId": null,
          "prospectStatus": null,
          "saleRepId": null,
          "prospectType": "1",
          "prospectStatusLst": checkStatus || []
          }}) 

  if (response.data.errorCode == 'S_SUCCESS') {
    let page_count = response.data.data.totalRecords / 8;
    let pages = []
    for(let i = 0 ;i<page_count ;i++ ){
        pages.push({page:i,items:paginate(response.data.data.records,8,i+1)});
    }
    response.data.data.item = pages
      let InTerritoryData = response.data.data;
      dispatch({
          type: 'INTERRITORY_RENT_DATA_SUCCESS',
          payload: InTerritoryData,
      });
  } else {
    dispatch({
      type: 'INTERRITORY_RENT_DATA_FAIL',
      payload: response.data.errorMessage,
  });
  }
};
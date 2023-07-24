import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';

function paginate(array, page_size, page_number) {
    if(array)
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  export const getMyOtherProspect = (accName, status) => async dispatch => {
    let checkStatus = status && (status.indexOf('99') == -1 ) ? status : ''
    const response = await axios.post(URL.searchOtherProspect, {
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
            "prospectType": "0",
            "prospectStatusLst": checkStatus || []
        }})   

    if (response.data.errorCode == 'S_SUCCESS') {
      let page_count = response.data.data.totalRecords / 9;
      let pages = []
      for(let i = 0 ;i<page_count ;i++ ){
          pages.push({page:i,items:paginate(response.data.data.records,9,i+1)});
      }
      response.data.data.item = pages
        dispatch({
          type: 'RESET'
        });
        let myGasData = response.data.data;
        dispatch({
            type: 'MY_OTHER_DATA_SUCCESS',
            payload: myGasData,
        });
    } else {
        dispatch({
            type: 'MY_OTHER_DATA_FAIL',
            payload: response.data.errorMessage,
        });
    }
  };

  export const cloneOtherProspect = (prospectId,tabId) => async dispatch =>{
    const response = await axios.post(URL.cloneProspect, {
        "prospectId": `${prospectId}`,
        "functionTab": tabId
    })  
    if (response.data.errorCode == 'S_SUCCESS') {
        // let myData = response.data.data;
        dispatch({
            type: 'CLONE_OTHER_DATA_SUCCESS',
        });
        } else {
            dispatch({
                type: 'CLONE_OTHER_DATA_FAIL',
                payload: response.data.errorMessage,
            });
            }
  }

  export const actionClear = () => async dispatch => {
    dispatch({
      type: 'RESET_LODING',
    });
  };
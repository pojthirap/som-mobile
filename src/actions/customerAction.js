import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';

function paginate(array, page_size, page_number) {
    if(array)
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

export const searchMyAccount  = (search,page,lenght) => async dispatch => {
    dispatch({
        type: 'CUSTOMER_LOADING',
    });
    const response = await axios.post(URL.searchMyAccount, {
        searchOption: 0,
        searchOrder: 1,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
        prospectType: "2",
        accName:search || null
    }}) 
    if(response.data.errorCode === 'S_SUCCESS'){
        let page_count = response.data.data.totalRecords / 8;
        let pages = []
        for(let i = 0 ;i<page_count ;i++ ){
            pages.push({page:i,items:paginate(response.data.data.records,8,i+1)});
        }
        response.data.data.item = pages
        dispatch({
            type: 'CUSTOMER_SUCCESS',
            payload: response.data.data,
        });
    }else{
        dispatch({
            type: 'CUSTOMER_FALIED',
            payload: response.data.errorMessage,
        });
    }
};
export const setCustomerPage = (page) => dispatch =>{
    dispatch({
        type: 'CUSTOMER_PAGE',
        payload: page+1,
    });
}
export const setTerritoryPage = (page) => dispatch =>{
    dispatch({
        type: 'TERRITORY_PAGE',
        payload: page+1,
    });
}

export const searchTerritory  = (search,page,lenght) => async dispatch => {
    dispatch({
        type: 'TERRITORY_LOADING',
    });
    const response = await axios.post(URL.searchAccountInTerritory, {
        searchOption: 0,
        searchOrder: 1,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
        prospectType: "2",
        accName:search || null
    }}) 
    if(response.data.errorCode === 'S_SUCCESS'){
        let page_count = response.data.data.totalRecords / 8;
        let pages = []
        for(let i = 0 ;i<page_count ;i++ ){
            pages.push({page:i,items:paginate(response.data.data.records,8,i+1)});
        }
        response.data.data.item = pages
        dispatch({
            type: 'TERRITORY_SUCCESS',
            payload: response.data.data,
        });
    } else{
        dispatch({
            type: 'TERRITORY_FALIED',
            payload: response.data.errorMessage,
        });
    }

};

import axios from '../api/Axios';
import {URL} from '../api/url';

export const saleOrder = async (custCode,fromDate='',toDate='') => {
    const response = await axios.post(URL.searchSaleOrderTab, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            custCode,
            fromDate,
            toDate
          }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}
export const getConfigLov  = async (lovKeyword) =>{
    try{
    const response = await axios.post(URL.getConfigLov, {
        "searchOption": 0,
        "searchOrder": 0,
        "startRecord": 0,
        "length": 0,
        "pageNo": 0,
        "model": {
            "lovKeyword": lovKeyword,
            "activeFlag": "Y"
        }
        })
        if(response.data.data){
            return response.data.data.records
        }
        return []
    }catch(error){
         return []
    }
    
}

import axios from '../api/Axios';
import {URL} from '../api/url';

export const stockCount = async (prospId) => {
    const response = await axios.post(URL.searchStockCountTab, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            prospId
          }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const stockCountRecord = async (planTripTaskId,tpStockCardId) =>{
    const response = await axios.post(URL.getTaskStockCardForRecord, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripTaskId,
            tpStockCardId
          }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}
export const addStockCountRecord = async (payload) =>{
    const response = await axios.post(URL.addRecordStockCard, payload) 
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}
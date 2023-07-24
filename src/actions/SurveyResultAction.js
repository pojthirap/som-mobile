
import axios from '../api/Axios';
import {URL} from '../api/url';

export const serveyResult = async (fromDate,toDate,prospId) => {
    const response = await axios.post(URL.searchSurveyResultTab, {
        "searchOption": 0,
        "searchOrder": 0,
        "startRecord": 0,
        "length": 0,
        "pageNo": 0,
        "model": {
            fromDate : fromDate ? fromDate : null ,
            toDate: toDate ? toDate : null,
            prospId : prospId ? `${prospId}` : null
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const searchViewResult = async (rceAppFormId='') => {
    const response = await axios.post(URL.viewSurveyResult, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            rceAppFormId
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}
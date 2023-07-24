
import axios from '../api/Axios';
import {URL} from '../api/url';

export const searchSaleDataTab = async (custCode) => {
    const response = await axios.post(URL.searchSaleDataTab, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            custCode
          }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}
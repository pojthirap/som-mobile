import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';

export const getQRAction = (qrCode) => async dispatch => {
    dispatch({
        type: 'QR_LOAD',
    });
    const response = await axios.post(URL.searchMeter, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            qrCode
          }})  
    if(response.data){
        dispatch({
            type: 'QR_SUCCESS',
            payload: response.data.data.records[0],
        });
    }else{
        dispatch({
            type: 'QR_FAILED',
        });
    }
    return  response.data.data.records[0] ? true : false
}
export const resetQr = () =>  dispatch => {
    dispatch({
        type: 'QR_RESET',
    });
}
export const resetQrSuccess = () =>  dispatch => {
    dispatch({
        type: 'RESET_QR_SUCCESS',
    });
}
export const resetMeterPage = () =>  dispatch => {
    dispatch({
        type: 'QR_RESET_METER_PAGE',
    });
}


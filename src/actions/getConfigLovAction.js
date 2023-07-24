import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';
import { Alert } from 'react-native';

export const getConfigLov = (lovKeyword) => async dispatch => {
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

    if (response.data.errorCode == 'S_SUCCESS') {
        let getConfigLov = response.data.data.records;
        dispatch({
            type: 'CONFIGLOV_SUCCESS',
            payload: getConfigLov,
        });
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getConfigLovDay = (lovKeyword) => async dispatch => {
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

    if (response.data.errorCode == 'S_SUCCESS') {
        let getConfigLovDay = response.data.data.records;
        dispatch({
            type: 'CONFIGLOV_DAY_SUCCESS',
            payload: getConfigLovDay,
        });
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getConfigLovPlanStatus = (lovKeyword) => async dispatch => {
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

    if (response.data.errorCode == 'S_SUCCESS') {
        let getConfigLovPlanStatus = response.data.data.records;
        dispatch({
            type: 'RESET_CONFIGLOV_PLANSTATUS' 
        })
        dispatch({
            type: 'CONFIGLOV_PLANSTATUS_SUCCESS',
            payload: getConfigLovPlanStatus,
        });
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};
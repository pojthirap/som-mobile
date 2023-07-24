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
            type: 'CONFIGLOV_ACCOUNT_SUCCESS',
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
            type: 'CONFIGLOV_ACCOUNT_DAY_SUCCESS',
            payload: getConfigLovDay,
        });
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};
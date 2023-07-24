import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';
import { Alert } from 'react-native';

export const getUserProfile = () => async dispatch => {
    const response = await axios.post(URL.getUserProfile, {
            "searchOption": 0,
            "searchOrder": 0,
            "startRecord": 0,
            "length": 0,
            "pageNo": 0,
            "model": { 
            }
          })

    if (response.data.errorCode == 'S_SUCCESS') {
        // dispatch({type: 'RESET'})
        let userProfile = response.data.data;
        dispatch({
            type: 'GET_USER_SUCCESS',
            payload: userProfile,
        });
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};
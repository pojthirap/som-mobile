import EncryptedStorage from 'react-native-encrypted-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import axios from '../api/Axios';
import { URL } from '../api/url';
import { AsyncStorage } from 'react-native';
import { ACTION } from '../utility/enum';

export const LoginAction = (value) => async dispatch => {
  try {
    const { username, password } = value

    const response = await axios.post(URL.auth, { username, password })

    if (response?.data.errorCode == 'S_SUCCESS') {
      EncryptedStorage.removeItem('token');

      await EncryptedStorage.setItem('token', response.data.data.token);
      
      const { empId, companyCode, firstName, email } = response.data.data.userProfileForBackEndCustom

      crashlytics().log('User signed in.');
      await Promise.all([
        crashlytics().setUserId(empId),
        crashlytics().setAttributes({
          companyCode,
          firstName,
          email
        }),
      ]);

      dispatch({
        type: ACTION.LOGIN_SUCCESS,
        payload: response.data.data,
      });
    } else {
      dispatch({
        type: ACTION.LOGIN_ERROR,
        payload: response.data.errorMessage,
      });
    }
  } catch (err) {
    let errMSG = { ...err }
    dispatch({
      type: ACTION.LOGIN_ERROR,
      payload: errMSG.response.data,
    });
  }
};

export const restoreToken = () => async dispatch => {
  try {
    let token = await EncryptedStorage.getItem('token');

    dispatch({
      type: 'RESTORE_TOKEN',
      payload: token,
    })
  } catch (err) {

  }
}

export const resetAuth = () => async dispatch => {
  dispatch({
    type: ACTION.LOGIN_RESET,
  });
};

export const setUser = user => dispatch => {
  dispatch({
    type: ACTION.SET_USER,
    payload: user,
  });
  dispatch({
    type: ACTION.LOGIN_RESET,
  });
};

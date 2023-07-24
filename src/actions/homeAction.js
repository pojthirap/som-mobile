import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../api/Axios';
import {URL} from '../api/url';
import {AsyncStorage} from 'react-native';
import {ACTION} from '../utility/enum';

export const getSearchEmailJobForPlanTrip = (dataCalendar) => async dispatch => {
  let dataCalendarNew = dataCalendar ? `${dataCalendar}` : null;

  const response = await axios.post(URL.searchEmailJobForPlanTrip, {
      searchOption: 0,
      searchOrder: 0,
      startRecord: 0,
      length: 0,
      pageNo: 0,
      model: {
        calendar: dataCalendarNew,
      }
  })   
    
  if (response.data.errorCode == 'S_SUCCESS') {
    dispatch({
      type: 'EMAIL_JOB_FOR_PLANTRIPI_SUCCESS',
      payload: response.data.data.records,
    });
  return true
  }else {
    Alert.alert('', response.data.errorMessage)
  }
};
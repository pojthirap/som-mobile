import axios from 'axios'
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from "react-native-config";
import { Alert } from 'react-native';
import store from '../redux/store';
import { resetAuth } from '../actions/authAction';
Config.API_URL;
Config.GOOGLE_MAPS_API_KEY;


const {dispatch, getState } = store
let session_status = true
export const baseUrl = 'https://dev-saleonmobile-somservice-api-asv.azurewebsites.net'
// export const baseUrl = 'https://uat-saleonmobile-somservice-api-asv.azurewebsites.net'
// export const baseUrl = 'https://prd-saleonmobile-somservice-api-asv.azurewebsites.net'
axios.defaults.baseURL = baseUrl
axios.interceptors.request.use(
    async request => {

        let token = getState().authReducer.token
        if (!request) return

        if (request.url != '/secure/login' && !token) return

        request.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept-Language': 'th'
        }
        return request
    },
    error => {
        return Promise.reject('*intercepter request*', error)
    }
)

axios.interceptors.response.use(function (response) {

    session_status = true
      
    return response;
  }, function (error) {
    if (error.message && error.message.includes('cancelToken')) {
        return Promise.reject(error);
    }else if (!error.response) {
        return {data: {errorCode: 'NETWORK_ERROR', errorMessage: 'NETWORK_ERROR'}}
    } else if (error.response && error.response.status === 401) {
        if (session_status) {
            session_status = false
            Alert.alert(
                "",
                "หมดเวลาทำรายการ กรุณาทำรายการใหม่อีกครั้ง",
                [
                  { text: "OK", onPress: () => dispatch(resetAuth()) }
                ]
            );
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }

    return { data: {errorCode: 'ERROR', errorMessage: 'เกิดความผิดพลาด กรุณาทำรายการใหม่อีก'}}
  });

export default axios;

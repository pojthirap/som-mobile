import axios from '../api/Axios';
import {URL} from '../api/url';

export const getAppForm = async (planTripTaskId) => {
    const response = await axios.post(URL.taskTemplateAppForm, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripTaskId
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}
export const addRecordAppForm = async (payload) =>{
    const response = await axios.post(URL.addRecordAppForm, payload)  
    return true
}
export const getCateAttach = async () =>{
    const response = await axios.post('/org/searchAttachCate', { model: {
        activeFlag: "Y"
      }})  
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const uploadFile = async (fileUri,type = 'jpeg',name= '.jpg',PhotoFlag = "Y") =>{
    const formData = new FormData();
    formData.append('ImageFile', {
        uri: fileUri,
        type: type, 
        name: name,
     });
     formData.append('PhotoFlag',PhotoFlag);
     const response = await axios.post(URL.uploadFileAppForm,formData)
     if(response.data)
    return response.data.data ? response.data.data.records[0] : null;
    return null
}

export const setCallbackTemplate = () => async dispatch => {
    dispatch({
        type: 'TEMPLATE_BACK',
      })
}
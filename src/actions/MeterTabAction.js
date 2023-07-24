import crashlytics from '@react-native-firebase/crashlytics';

import axios from '../api/Axios';
import {URL} from '../api/url';

export const searchMeterTab = async (prospId) => {
    const response = await axios.post(URL.searchRecordMeterTab, {
        searchOption: 1,
        searchOrder: 1,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            prospId
          }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}


export const addRecordMeter = async (tasks,planTripTaskId) =>{
    try {
        tasks = tasks.map(task=>{
            let object = {...task}
            object.meterId = `${task.meterId}`
            object.gasId = `${task.gasId}`
            object.gasId = `${task.gasId}`
            object.fileId = task.fileId  ? `${task.fileId}` : null
            object.recMeterId = task.recMeterId ? `${task.recMeterId}` : null
            object.dispenserNo = `${task.dispenserNo}`
            object.nozzleNo = `${task.nozzleNo}`
            object.recRunNo = task.recRunNo
            object.planTripTaskId = planTripTaskId
            return object
        })
        let res = await axios.post(URL.addRecordMeter, tasks)  
        return true
    } catch (error) {
        crashlytics().recordError(error);
    }

}

export const getTaskMeterForRecord = async (planTripTaskId,prospId,planTripProspId,custCode) =>{
    const response = await axios.post(URL.getTaskMeterForRecord, {
        searchOption: 0,
        searchOrder: 1,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripTaskId,
            prospId,
            planTripProspId,
            custCode
          }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const uploadMeterFile = async (fileUri,PhotoFlag = "Y") =>{
    const formData = new FormData();
    formData.append('ImageFile', {
        uri: fileUri,
       type: 'image/jpeg', 
       name: "imagename.jpg",
     });
     formData.append('PhotoFlag',PhotoFlag);
     const response = await axios.post(URL.uploadFileMeter,formData)
     if(response.data)
    return response.data.data ? response.data.data.records[0] : null;
    return null
}
export const checkPercentRangRecordMeter = async (planTripTaskId,meterId,recRunNo) =>{
    //
    const response = await axios.post(URL.checkPercentRangRecordMeter, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripTaskId,
            meterId,
            recRunNo
          }})  

    if(response.data ){
        return response.data
    }else {
        return false
    }
}


import EncryptedStorage from 'react-native-encrypted-storage';

import axios from '../api/Axios';
import { URL } from '../api/url';
import { AsyncStorage } from 'react-native';
import { ACTION } from '../utility/enum';
import dayjs from 'dayjs';
import { Alert } from 'react-native';

//FirstPage Sale Visit Plan
export const getSearchPlanTrip = (dataCalendar, searchEmpId, searchLovCodeTh) => async dispatch => {
    let searchLovCodeThNew = searchLovCodeTh ? [`${searchLovCodeTh}`] : null;
    let searchEmpIdNew = searchEmpId ? `${searchEmpId}` : null;
    let dataCalendarNew = dataCalendar ? `${dataCalendar}` : null;

    const response = await axios.post(URL.searchPlanTrip, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            calendar: dataCalendarNew,
            planTripDate: null,
            status: searchLovCodeThNew,
            assignEmpId: searchEmpIdNew
        }
    })

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'PLANTRIP_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getViewPlanTrip = (planTripId) => async dispatch => {
    const response = await axios.post(URL.viewPlanTrip, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripId: JSON.stringify(planTripId)
        }
    })

    if (response.data.errorCode == 'S_SUCCESS') {
        let dataNew = response.data.data.records.map((item, index) => {
            let listPlanTripProspect = [];

            if (item.listPlanTripProspect) {
                listPlanTripProspect = item.listPlanTripProspect.map((item) => {
                    return {
                        ...item,
                        nameSaleVosotPlan: item.accName,
                        lotLongs: item.latitude + ' , ' + item.longitude,
                        timer: item.planStartTime && item.planEndTime ? `${(dayjs(item.planStartTime).format('HH:mm'))} - ${(dayjs(item.planEndTime).format('HH:mm'))}` : '-',
                        startTime: item.planStartTime ? `${(dayjs(item.planStartTime).format('HH:mm'))}` : null,
                        endTime: item.planEndTime ? `${(dayjs(item.planEndTime).format('HH:mm'))}` : null
                    }
                })
            }

            return { ...item, listPlanTripProspect }
        });
        dispatch({
            type: 'RESET_VIEWPLANTRIP_DATA',
        })
        dispatch({
            type: 'VIEWPLANTRIP_DATA_SUCCESS',
            payload: dataNew,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getEmpForAssignPlanTrip = () => async dispatch => {
    const response = await axios.post('/getEmpForAssignPlanTrip', {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {}
    })

    if (response.data.errorCode == 'S_SUCCESS') {
        let fullName = response.data.data.records.map((fullName, index) => {
            return { ...fullName, value: index, fullName: fullName.empId + ' - ' + fullName.firstName + ' ' + fullName.lastName }
        })
        dispatch({
            type: 'EMPASSIGNPLANTRIP_DATA_SUCCESS',
            payload: fullName,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getProspectCreatePlanTrip = () => async dispatch => {
    const response = await axios.post(URL.getProspectForCreatePlanTrip, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
        }
    })

    if (response.data.errorCode == 'S_SUCCESS') {
        let filterOnlyLat = response.data.data.records.filter((item) => {
            return (item.latitude && isFinite(item.latitude) && Math.abs(item.latitude) <= 90), (item.longitude && isFinite(item.longitude) && Math.abs(item.longitude) <= 180);
        })

        let dataList = filterOnlyLat.map((dataList, index) => {
            return {
                ...dataList, value: index, lotLongs: dataList.latitude + ' , ' + dataList.longitude, nameSaleVosotPlan: dataList.accName, prospId: dataList.prospectId,
                codeNameLabel: dataList.custCode != "" ? dataList.custCode + ' : ' + dataList.accName + ' ' + dataList.addressFullnm : dataList.prospectId + ' : ' + dataList.accName + ' ' + dataList.addressFullnm
            }
        })
        dispatch({
            type: 'PROSPECTCREATPLAN_DATA_SUCCESS',
            payload: dataList,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getTaskTemplateCreatPlan = () => async dispatch => {
    const response = await axios.post(URL.getTaskTemplateAppFormForCreatPlan, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {}
    })

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'TASKTEMPLATECREATEPLAN_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getTaskSpecialCreatPlan = (prospectId) => async dispatch => {
    const response = await axios.post(URL.getTaskSpecialForCreatPlan, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            prospId: prospectId ? `${prospectId}` : null
        }
    })

    if (response.data.errorCode == 'S_SUCCESS') {
        let dataTaskSpecialCreatPlan = response.data.data.records.map((data, index) => {
            return { ...data, value: index, lastUpdateNew: data.updateDate ? `${(dayjs(data.updateDate).format('D/M/BBBB HH:mm:ss'))}` : null }
        })
        dispatch({
            type: 'TASKSPECIALCREATEPLAN_DATA_SUCCESS',
            payload: dataTaskSpecialCreatPlan,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getLastRemindPlanTripProspect = (prospectId) => async dispatch => {
    const response = await axios.post(URL.getLastRemindPlanTripProspect, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            prospId: prospectId ? `${prospectId}` : null
        }
    })

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'LASTREMIND_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const updateDataProsCusLocTable = (data) => async dispatch => {

    let dataNew = data.map((data, index) => {
        return { ...data, value: index, startTime: data.startTime, endTime: data.endTime, timer: data.timer }
    })

    dispatch({
        type: 'UPDDATAPROSCUTLOCTABLE_DATA_SUCCESS',
        payload: dataNew,
    });
    return true
};

export const updateValueTaskForOther = (data) => async dispatch => {

    dispatch({
        type: 'UPDATEVALUETASKFOROTHER_DATA_SUCCESS',
        payload: data,
    });
    return true
};

export const createPlanTrip = (data, visitPlanList, status) => async dispatch => {

    const response = await axios.post(URL.createPlanTrip, {
        planTrip: {
            planTripName: data.planTripName,
            planTripDate: data.selectDate,
            assignEmpId: data.empId ? data.empId : null,
            remark: data.remark ? data.remark : null,
            status: status,
        },
        listProspect: visitPlanList
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'CREATEPLANTRIP_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const updPlanTrip = (data, visitPlanList, status, dataPlanTrip) => async dispatch => {

    let visitPlanListNew = visitPlanList.map((itemList) => {
        let setData = []
        if (itemList.listTask.length != 0) {
            setData = itemList.listTask.map((itemId) => {
                return {
                    ...itemId,
                    orderNo: `${itemId.orderNo}`,
                    planTripProspId: `${itemId.planTripProspId}`,
                    planTripTaskId: `${itemId.planTripTaskId}`,
                    requireFlag: `${itemId.requireFlag}`,
                    taskType: `${itemId.taskType}`,
                    templateName: `${itemId.templateName}`,
                    tpAppFormId: itemId.tpAppFormId != null ? `${itemId.tpAppFormId}` : null,
                    tpSaFormId: itemId.tpSaFormId != null ? `${itemId.tpSaFormId}` : null,
                    tpStockCardId: itemId.tpStockCardId != null ? `${itemId.tpStockCardId}` : null,
                }
            })
        }

        return itemList = { ...itemList, listTask: setData }
    })

    const response = await axios.post('/updPlanTrip', {
        planTrip: {
            planTripId: `${dataPlanTrip.planTripId}`,
            planTripName: data.planTripName,
            planTripDate: data.selectDate,
            assignEmpId: data.empId ? data.empId : null,
            remark: data.remark ? data.remark : null,
            status: status,
        },
        listProspect: visitPlanListNew
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'UPDATEPLANTRIP_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const mergPlanTrip = (data) => async dispatch => {

    const response = await axios.post('/mergPlanTrip', {
        mergPlanTripId: `${data.planTripId}`
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'MERGPLANTRIP_DATA_SUCCESS',
            payload: response.data.data.records,
        })
    }
    else if (response.data.errorCode == 'W_0005') {
        dispatch({
            type: 'MERGPLANTRIP_DATA_ERROR',
            payload: response.data.errorMessage,
        })
    }
    else if (response.data.errorCode == 'W_0013') {
        dispatch({
            type: 'MERGPLANTRIP_DATA_ERROR',
            payload: response.data.errorMessage,
        })
    }
    else {
        dispatch({
            type: 'MERGPLANTRIP_DATA_ERROR',
            payload: response.data.errorMessage,
        })
    }
};

export const cancelPlanTrip = (data) => async dispatch => {

    const response = await axios.post(URL.cancelPlanTrip, {
        planTripId: `${data.planTripId}`
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'CANCELPLANTRIP_DATA_SUCCESS',
            payload: response.data.data.records,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const rejectPlanTrip = (data, dataRemark) => async dispatch => {

    const response = await axios.post(URL.rejectPlanTrip, {
        planTripId: `${data.planTripId}`,
        remark: dataRemark ? dataRemark.remark : null
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'REJECTPLANTRIP_DATA_SUCCESS',
            payload: response.data.data.records,
        })
        return true
    } else {
        dispatch({
            type: 'REJECTPLANTRIP_DATA_ERROR',
            payload: response.data.errorMessage,
        })
    }
};

export const resetReject = () => async dispatch => {
    dispatch({
        type: 'RESETREJECT_DATA',
    })
};

export const approvePlanTrip = (data, dataRemark) => async dispatch => {

    const response = await axios.post(URL.approvePlanTrip, {
        planTripId: `${data.planTripId}`,
        remark: dataRemark ? dataRemark.remark : null
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        dispatch({
            type: 'APPROVEPLANTRIP_DATA_SUCCESS',
            payload: response.data.data.records,
        })
    }
    else if (response.data.errorCode == 'W_0004') {
        dispatch({
            type: 'APPROVEPLANTRIP_DATA_ERROR',
            payload: response.data.errorMessage,
        })
    }
    else {
        dispatch({
            type: 'APPROVEPLANTRIP_DATA_ERROR',
            payload: response.data.errorMessage,
        })
    }
};

export const resetApprove = () => async dispatch => {
    dispatch({
        type: 'RESETAPPRVE_DATA',
    })
};

export const searchViewPlanTripTask = (data) => async dispatch => {

    const response = await axios.post(URL.viewPlanTripTask, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripProspId: `${data.planTripProspId}`
        }
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        let addFormatName = response.data.data.records.map((item) => {
            return { ...item, description: item.templateName }
        })
        dispatch({
            type: 'VIEWPLANTASK_DATA_SUCCESS',
            payload: addFormatName,
        });
        return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};

export const getViewPlanTripTask = async (data) => {

    const response = await axios.post(URL.viewPlanTripTask, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripProspId: `${data.planTripProspId}`
        }
    });

    if (response.data.errorCode == 'S_SUCCESS') {
        let addFormatName = response.data.data.records.map((item) => {
            let keyData = item.tpStockCardId || item.tpSaFormId || item.tpAppFormId
            return { ...item, description: item.templateName, code: keyData ? keyData : "" }
        })
        let dataAddListTask = { ...data, listTask: addFormatName }

        //     dispatch({
        //         type: 'VIEWPLANTASK_DATA_SUCCESS',
        //         payload: addFormatName,
        // });
        return dataAddListTask
        // return true
    } else {
        Alert.alert('', response.data.errorMessage)
    }
};



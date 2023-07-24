

import axios from '../api/Axios';
import { URL } from '../api/url';
export const saleVisit = async () => {
    const response = await axios.post(URL.searchPlanTripForSaleVisit, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {

        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
    return [];
}
export const viewSaleDetail = async (planTripId) => {
    const response = await axios.post(URL.viewPlanTrip, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripId
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
    return [];
}
export const viewPlanTripTaskAction = async (planTripProspId) => {
    const response = await axios.post(URL.viewPlanTripTask, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripProspId
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const getConfigParam = async () => {
    const response = await axios.post(URL.getConfigParam, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            paramKeyword: "VISIT_LIMIT_DISTANCE"
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const searchLoc = async (obj) => {
    const response = await axios.post(URL.searchLoc, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {

        }
    })
    if (obj) return response.data.data.records.filter(record => record.locTypeId != obj.locTypeId)
    return response.data.data ? response.data.data.records : [];
}
export const planTripStart = async (startCheckinLocId, startCheckinMileNo, planTripId) => {
    try {
        const response = await axios.post(URL.planTripStart, {
            startCheckinLocId,
            startCheckinMileNo,
            planTripId
        })
        return true
    } catch (error) {
        return false
    }

}
export const planTripFinish = async (stopCheckinLocId, stopCheckinMileNo, planTripId, StopCalcKm) => {
    try {
        await axios.post(URL.planTripFinish, {
            stopCheckinLocId,
            stopCheckinMileNo,
            planTripId,
            StopCalcKm
        })
        return true
    } catch (error) {
        return false
    }

}
export const getLastCheckIn = async (planTripId, planTripProspId) => {
    const response = await axios.post('/getLastCheckIn', {
        model: {
            planTripId,
            planTripProspId
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records[response.data.data.records.length - 1] : null;
}

export const checkInPlanTrip = async (planTripId, planTripProspId, visitLatitude, visitLongitude, visitCheckinMileNo) => {
    const response = await axios.post(URL.checkInPlanTripProspect, {
        planTripId: `${planTripId}`,
        planTripProspId: `${planTripProspId}`,
        visitLatitude: `${visitLatitude}`,
        visitLongitude: `${visitLongitude}`,
        visitCheckinMileNo: `${visitCheckinMileNo}`,
    })
    if (response.data)
        return response.data.data ? response.data.data : { beforePlanTripProspId: null, nextPlanTripProspId: null };
}

export const planReasonNotVisit = async () => {
    const response = await axios.post(URL.searchPlanReasonNotVisit, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            "ACTIVE_FLAG": "Y"
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const updReasonNotvisiForProspect = async (planTripProspId, updPlanTripProspId, reasonNotVisitId, reasonNotVisitRemark, CurrentVisitCalcKm, UpdVisitCalcKm, visitCheckinDtm, contactName, contactMobileNo, checkoutRemark) => {
    const response = await axios.post(URL.updReasonNotVisitForProspect, {
        planTripProspId,
        reasonNotVisitId,
        reasonNotVisitRemark,
        CurrentVisitCalcKm: `${CurrentVisitCalcKm}`,
        UpdPlanTripProspId: `${updPlanTripProspId}`,
        VisitCalcKm: visitCheckinDtm ? `${CurrentVisitCalcKm}` : `0`,
        UpdVisitCalcKm: `${UpdVisitCalcKm}`,
        contactName: contactName ? `${contactName}` : null,
        contactMobileNo: contactMobileNo ? `${contactMobileNo}` : null,
        checkoutRemark: checkoutRemark ? `${checkoutRemark}` : null,
    })
    return
}

export const setPlantrip = plantTrip => async dispatch => {
    dispatch({
        type: 'SET_PLANT_TRIP',
        payload: plantTrip
    })
}

export const resetCallBack = () => async dispatch => {
    dispatch({
        type: 'TEMPLATE_RESET',
    })
}

export const setCheckingPlant = (obj) => dispatch => {
    dispatch({
        type: 'SET_CHECK_PLANT',
        payload: obj
    })
}

export const updateRemind = async (planTripProspId, remind) => {
    const response = await axios.post(URL.updateRemindForProspect, {
        planTripProspId: `${planTripProspId}`,
        remind
    })

    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const setCheckout = () => async dispatch => {
    dispatch({
        type: 'SET_CHECKOUT'
    })
}

export const updateCheckout = async (CurrentPlanTripProspId, UpdPlanTripProspId, CurrentVisitCalcKm, UpdVisitCalcKm, contactName, contactMobileNo, checkoutRemark) => {
    const response = await axios.post(URL.checkOutPlanTripProspect, {
        CurrentPlanTripProspId: `${CurrentPlanTripProspId}`,
        UpdPlanTripProspId: `${UpdPlanTripProspId}`,
        CurrentVisitCalcKm: `${CurrentVisitCalcKm}`,
        UpdVisitCalcKm: `${UpdVisitCalcKm}`,
        contactName: contactName ? `${contactName}` : null,
        contactMobileNo: contactMobileNo ? `${contactMobileNo}` : null,
        checkoutRemark: checkoutRemark ? `${checkoutRemark}` : null,
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const resetNewTrip = () => dispatch => {
    dispatch({
        type: 'RESET_NEWTRIP'
    })
}

export const resetAllTrip = () => dispatch => {
    dispatch({
        type: 'RESET_ALL'
    })
}

export const updateLocRemark = async (planTripProspId, locRemark) => {
    const response = await axios.post(URL.updateLocRemarkForProspect, {
        planTripProspId: `${planTripProspId}`,
        locRemark
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const updateTrips = (list) => dispatch => {
    dispatch({
        type: 'UPDATE_TRIP',
        payload: list
    })
}

export const getProspectForCreatePlanTripAdHoc = async (planTripId) => {
    const response = await axios.post(URL.getProspectForCreatePlanTripAdHoc, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            planTripId
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const getProspectLocAdhoc = async (planTripId) => {
    const response = await axios.post(URL.searchLoc, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {

        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const addPlanTripProspectAdHoc = async (planTripId, prospId = null, planStartTime, planEndTime, visitLatitude, visitLongitude, locRemark, locId = null, remark) => {

    const response = await axios.post(URL.addPlanTripProspectAdHoc, {
        planTripId,
        prospId,
        planStartTime,
        planEndTime,
        visitLatitude,
        visitLongitude,
        locRemark,
        locId,
        remark
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const getTaskTemplate = async (prospId) => {
    const response = await axios.post(URL.getTaskTemplateAppFormForCreatPlan, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            prospId
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const getTaskSpecial = async (prospId) => {
    const response = await axios.post(URL.getTaskSpecialForCreatPlan, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            prospId
        }
    })
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const addTemplateProspectAdHoc = async (payload) => {
    const response = await axios.post(URL.addPlanTripTaskAdHoc, payload)
    if (response.data)
        return response.data.data ? response.data.data.records : [];
}

export const setTaskReload = () => dispatch => {
    dispatch({
        type: 'SET_RELOAD_TASK'
    })
}

export const resetTaskReload = () => dispatch => {
    dispatch({
        type: 'RESET_RELOAD_TASK'
    })
}

export const delPlanTripProspectAdHoc = async (planTripProspId) => {
    const response = await axios.post(URL.delPlanTripProspectAdHoc, {
        planTripProspId: planTripProspId
    })
    if (response.data)
        return response.data ? response.data : null;
}

export const delPlanTripTaskAdHoc = async (planTripTaskId) => {
    const response = await axios.post(URL.delPlanTripTaskAdHoc, {
        planTripTaskId: planTripTaskId
    })
    if (response.data)
        return response.data ? response.data : null;
}
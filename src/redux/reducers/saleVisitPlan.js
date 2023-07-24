const initialState = {
    dataPlanTrip:'',
    planTrip_Loading: true,
    dataEmpAssignPlanTrip:'',
    empAssignPlanTrip_Loading: true,
    prospectCrearPlanTrip:'',
    prospectCrearPlanTrip_Loading: true,
    viewDataPlanTrip:'',
    viewDataplanTrip_Loading: true,
    taskTemplatCreateplan: '',
    taskTemplatCreateplan_Loading: true,
    taskSpecialCreateplan: '',
    taskSpecialCreateplan_Loading: true,
    updateValueList: [],
    updateValueList_Loading: true,
    planTripData: '',
    planTripData_Loading: true,
    cancelPlnTrip_success: false,
    cancelPlnTrip_error: false,
    merglPlnTrip_success: false,
    merglPlnTrip_error: false,
    rejectlPlnTripMSG: '',
    rejectlPlnTrip_success: false,
    rejectlPlnTrip_error: false,
    approvePlnTrip_success: false,
    approvePlnTrip_error: false,
    approvePlnTripMSG: '',
    merglPlnTripMSG: '',
    lastRemindForPlanTripProspect: '',
    lastRemindForPlanTripProspect_success: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'PLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                dataPlanTrip:action.payload,
                planTrip_Loading: false,
                updateValueList: [],
                updateValueList_Loading: true,
                merglPlnTripMSG: '',
                merglPlnTrip_success: false,
                merglPlnTrip_error: false,
                approvePlnTripMSG: '',
                approvePlnTrip_success: false,
                approvePlnTrip_error: false,
            };
        case 'EMPASSIGNPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                dataEmpAssignPlanTrip:action.payload,
                empAssignPlanTrip_Loading: false
            };
        case 'PROSPECTCREATPLAN_DATA_SUCCESS':
            return {
                ...state,
                prospectCrearPlanTrip:action.payload,
                prospectCrearPlanTrip_Loading: false
            };
        case 'VIEWPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                viewDataPlanTrip:action.payload,
                viewDataplanTrip_Loading: false,
                merglPlnTripMSG: '',
                merglPlnTrip_success: false,
                merglPlnTrip_error: false,
            };
        case 'RESET_VIEWPLANTRIP_DATA':
            return {
                ...state,
                viewDataPlanTrip:'',
                viewDataplanTrip_Loading: true,
            };
        case 'TASKTEMPLATECREATEPLAN_DATA_SUCCESS':
            return {
                ...state,
                taskTemplatCreateplan:action.payload,
                taskTemplatCreateplan_Loading: false
            };
        case 'TASKSPECIALCREATEPLAN_DATA_SUCCESS':
            return {
                ...state,
                taskSpecialCreateplan:action.payload,
                taskSpecialCreateplan_Loading: false
            };
        case 'UPDDATAPROSCUTLOCTABLE_DATA_SUCCESS':
            return {
                ...state,
                updateValueList:action.payload,
                updateValueList_Loading: false
            };
        case 'CREATEPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                planTripData:action.payload,
                planTripData_Loading: false,
                updateValueList: [],
                updateValueList_Loading: true,
                cancelPlnTrip_success: false,
                cancelPlnTrip_error: false,
                merglPlnTrip_success: false,
                merglPlnTrip_error: false,
                rejectlPlnTrip_success: false,
                rejectlPlnTrip_error: false,
                approvePlnTrip_success: false,
                approvePlnTrip_error: false,
            };
        case 'UPDATEPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                planTripData_Loading: false,
                updateValueList: [],
                updateValueList_Loading: true,
                cancelPlnTrip_success: false,
                cancelPlnTrip_error: false,
                merglPlnTrip_success: false,
                merglPlnTrip_error: false,
                rejectlPlnTrip_success: false,
                rejectlPlnTrip_error: false,
                approvePlnTrip_success: false,
                approvePlnTrip_error: false,
            };
        case 'CANCELPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                cancelPlnTrip_success: true,
                cancelPlnTrip_error: false,
            };
        case 'MERGPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                merglPlnTripMSG: '',
                merglPlnTrip_success: true,
                merglPlnTrip_error: false,
            };
        case 'MERGPLANTRIP_DATA_ERROR':
            return {
                ...state,
                merglPlnTripMSG: action.payload,
                merglPlnTrip_success: true,
                merglPlnTrip_error: true,
            };
        case 'REJECTPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                rejectlPlnTripMSG: '',
                rejectlPlnTrip_success: true,
                rejectlPlnTrip_error: false,
            };
        case 'REJECTPLANTRIP_DATA_ERROR':
            return {
                ...state,
                rejectlPlnTripMSG: action.payload,
                rejectlPlnTrip_success: true,
                rejectlPlnTrip_error: true,
            };
        case 'RESETREJECT_DATA':
            return {
                ...state,
                rejectlPlnTripMSG: '',
                rejectlPlnTrip_success: false,
                rejectlPlnTrip_error: false,
            };
        case 'APPROVEPLANTRIP_DATA_SUCCESS':
            return {
                ...state,
                approvePlnTripMSG: '',
                approvePlnTrip_success: true,
                approvePlnTrip_error: false,
            };
        case 'APPROVEPLANTRIP_DATA_ERROR':
            return {
                ...state,
                approvePlnTripMSG: action.payload,
                approvePlnTrip_success: true,
                approvePlnTrip_error: true,
            };
        case 'RESETAPPRVE_DATA':
            return {
                ...state,
                approvePlnTripMSG: '',
                approvePlnTrip_success: false,
                approvePlnTrip_error: false,
            };
        case 'LASTREMIND_DATA_SUCCESS':
            return {
                ...state,
                lastRemindForPlanTripProspect: action.payload,
                lastRemindForPlanTripProspect_success: false,
            };
        default:
            return state;
    }
  };
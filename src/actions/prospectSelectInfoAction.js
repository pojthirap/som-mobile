import EncryptedStorage from 'react-native-encrypted-storage';

export const getProspectSelectData = (infomation) => async dispatch => {
    if (infomation) {
        dispatch({
            type: 'SELECT_DATA_SUCCESS',
            payload: infomation,
        });
}};
export const getProspectRecommandSelectData = (infomation) => async dispatch => {
    if (infomation) {
        dispatch({
            type: 'SELECT_DATA_SUCCESS',
            payload: infomation,
        });
}};
export const getCustomerSelectDate = (infomation) => async dispatch => {
    if (infomation) {
        dispatch({
            type: 'SELECT_DATA_SUCCESS',
            payload: infomation,
        });
}};
export const getRentStationSelectDate = (infomation) => async dispatch => {
    if (infomation) {
        dispatch({
            type: 'SELECT_DATA_SUCCESS',
            payload: infomation,
        });
}};
export const getOtherSelectDate = (infomation) => async dispatch => {
    if (infomation) {
        dispatch({
            type: 'SELECT_DATA_SUCCESS',
            payload: infomation,
        });
}};
export const updName = (infomation, dataSelect) => async dispatch => {
    if (infomation) {
        let ddd = {...dataSelect.prospectAccount, accName: infomation}
        dispatch({
            type: 'UPDNAME_DATA_SUCCESS',
            payload: ddd,
        });
}};
export const getCloneDate = (infomation) => async dispatch => {
    if (infomation) {
        dispatch({
            type: 'ISCLONE_DATA_SUCCESS',
            payload: infomation,
        });
}};
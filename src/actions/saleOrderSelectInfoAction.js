import EncryptedStorage from 'react-native-encrypted-storage';

export const getSaleOrderSelectData = (infomation) => async dispatch => {
    if (infomation) {
        dispatch({
            type: 'SELECT_DATA_SUCCESS',
            payload: infomation,
        });
}};
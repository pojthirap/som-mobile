const initialState = {
    dataSelect: '',
    dataSelect_Loding: true,
    dataUpd_Loding: true,
    isCloneData: '',
    isCloneData_Loding: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_DATA_SUCCESS':
      return {
        ...state,
        dataSelect: action.payload,
        dataSelect_Loding: false,
      };
    case 'ISCLONE_DATA_SUCCESS':
      return {
        ...state,
        isCloneData: action.payload,
        isCloneData_Loding: false,
      };
    case 'UPDNAME_DATA_SUCCESS':
      return {
        ...state,
        dataSelect: {...state.dataSelect ,prospectAccount : action.payload},
        // dataSelect: ({...state.dataSelect, {prospectAccount: state.dataSelect.prospectAccount, accName: action.payload}}),
        dataUpd_Loding: false,
      };
      
    default:
      return state;
  }
};
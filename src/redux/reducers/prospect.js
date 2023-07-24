const initialState = {
  dataMyProspect: '',
  dataMyProspect_Loding: true,
  dataMyProspectErrorMSG: '',
  dataMyProspectErrorMSG_Loding: true,
  dataReccomentBU: '',
  dataReccomentBU_Loding: true,
  dataReccomentBUErrorMSG: '',
  dataReccomentBUErrorMSG_Loding: true,
  dataInTerritory: '',
  dataInTerritory_Loding: true,
  dataInTerritoryErrorMSG: '',
  dataInTerritoryErrorMSG_Loding: true,
  brand: '',
  brand_loading: true,
  distirct: '',
  distirct_loading: true,
  subdistirct: [],
  subdistirct_loading: true,
  addProspectloadingSuccess: false,
  addProspectloadingError: false,
  addProspecterrorMSG: '',
  addressProspect: null,
  addressProspect_loading: true,
  basicProspect: '',
  basicProspect_loading: true,
  dataAccoutTeam: '',
  dataAccoutTeam_Loading: true,
  dataSubReccomentBU: '',
  dataSubReccomentBU_Loading: true,
  dataBusinessUnit: '',
  dataBusinessUnit_Loading: true,
  region: '',
  region_loading: true,
  contactProspect: '',
  contactProspect_loading: true,
  addBusinessUnit: '',
  addBusinessUnitSuccess: false,
  addBusinessUnitFalse: false,
  addBusinessUnitErrorMSG: '',
  delBusinessUnitSuccess: false,
  delBusinessUnitFalse: false,
  delBusinessUnitErrorMSG: '',
  dataFeedTab: '',
  dataFeedTab_Loading: true,
  saleTerritoryData: '',
  saleTerritoryData_Loading: true,
  dbdProspect: '',
  dbdProspect_loading: true,
  TerritoryForDedicated: '',
  TerritoryForDedicated_Loading: true,
  addsaleTerritorySucsess: false,
  addsaleTerritoryfalse: false,
  addsaleTerritorytErrorMSG: '',
  delsaleTerritorySucsess: false,
  delsaleTerritoryfalse: false,
  delsaleTerritorytErrorMSG: '',
  visitHourData: '',
  visitHourData_loading: true,
  addVisitHourSucess: false,
  addVisitHourfalse: false,
  addVisitHourErrorMSG: '',
  delVisitHourSucess: false,
  delVisitHourfalse: false,
  delVisitHourErrorMSG: '',
  createProsErrorMSG: '',
  createProspectloadingSuccess: false,
  createProsloadingError: false,
  basicErrorMSG: '',
  editBasicPropectSuucess: false,
  editBasicPropectError: false,
  contactErrorMSG: '',
  addContactPropectSuucess: false,
  addContactPropectError: false,
  updContactPropectSuucess: false,
  updContactPropectError: false,
  removeContactPropectSuucess: false,
  removeContactPropectError: false,
  dbdErrorMSG: '',
  editDbdPropectSuucess: false,
  editDbdPropectError: false,
  attechment: '',
  attechment_Loading: true,
  attechmentCate: '',
  attechmentCate_Loading: true,
  delProspect: '',
  delProspect_Loading: false,
  delProspectErrorMSG: '',
  delProspectErrorMSG_Loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'MY_PROS_DATA_SUCCESS':
      return {
        ...state,
        dataMyProspect: action.payload,
        dataMyProspect_Loding: false,
        createProspectloadingSuccess: false,
        createProsloadingError: false,
        dataMyProspectErrorMSG: '',
        dataMyProspectErrorMSG_Loding: true,
        dataInTerritoryErrorMSG: '',
        dataInTerritoryErrorMSG_Loding: true,
        dataReccomentBUErrorMSG: '',
        dataReccomentBUErrorMSG_Loding: true
      };
    case 'MY_PROS_DATA_FAIL':
      return {
        ...state,
        dataMyProspectErrorMSG: action.payload,
        dataMyProspectErrorMSG_Loding: false,
        dataMyProspect: '',
        dataMyProspect_Loding: true
      };
    case 'RECBU_PROS_DATA_SUCCESS':
      return {
        ...state,
        dataReccomentBU: action.payload,
        dataReccomentBU_Loding: false,
        dataReccomentBUErrorMSG: '',
        dataReccomentBUErrorMSG_Loding: true,
        dataMyProspectErrorMSG: '',
        dataMyProspectErrorMSG_Loding: true,
        dataInTerritoryErrorMSG: '',
        dataInTerritoryErrorMSG_Loding: true
      };
    case 'RECBU_PROS_DATA_FAIL':
      return {
        ...state,
        dataReccomentBUErrorMSG: action.payload,
        dataReccomentBUErrorMSG_Loding: false,
        dataReccomentBU: '',
        dataReccomentBU_Loding: true
      };
    case 'TERRITORY_PROS_DATA_SUCCESS':
      return {
        ...state,
        dataInTerritory: action.payload,
        dataInTerritory_Loding: false,
        dataInTerritoryErrorMSG: '',
        dataInTerritoryErrorMSG_Loding: true,
        dataMyProspectErrorMSG: '',
        dataMyProspectErrorMSG_Loding: true,
        dataReccomentBUErrorMSG: '',
        dataReccomentBUErrorMSG_Loding: true
      };
    case 'TERRITORY_PROS_DATA_FAIL':
      return {
        ...state,
        dataInTerritoryErrorMSG: action.payload,
        dataInTerritoryErrorMSG_Loding: false,
        dataInTerritory: '',
        dataInTerritory_Loding: true
      };
    case 'BRAND_DATA_SUCCESS':
      return {
        ...state,
        brand_loading: false,
        brand: action.payload,
      };
    case 'DISTRICT_DATA_SUCCESS':
      return {
        ...state,
        distirct_loading: false,
        distirct: action.payload,
        subdistirct: '',
      };
    case 'SUBDISTRICT_DATA_SUCCESS':
      return {
        ...state,
        sbudistirct_loading: false,
        subdistirct: action.payload,
      };
    case 'PROSPECT_DATA_SUCCESS':
      return {
        ...state,
        createProspectloadingSuccess: true,
        createProsloadingError: false,
      };
    case 'PROSPECT_DATA_FAIL':
      return {
        ...state,
        createProsErrorMSG: action.payload,
        createProspectloadingSuccess: true,
        createProsloadingError: true,
      };
    case 'PROSADDRESS_DATA_SUCCESS':
      return {
        ...state,
        addressProspect: action.payload,
        addressProspect_loading: false
      };
    case 'ACCOUTTEAM_DATA_SUCCESS':
      return {
        ...state,
        dataAccoutTeam: action.payload,
        dataAccoutTeam_Loading: false
      };
    case 'PROSBASIC_DATA_SUCCESS':
      return {
        ...state,
        basicProspect: action.payload,
        basicProspect_loading: false,
        editBasicPropectSuucess: false,
        editBasicPropectError: false,
      };
    case 'UPDBASIC_DATA_SUCCESS':
      return {
        ...state,
        editBasicPropectSuucess: true,
        editBasicPropectError: false,
      };
    case 'UPDBASIC_DATA_FAIL':
      return {
        ...state,
        basicErrorMSG: action.payload,
        editBasicPropectSuucess: true,
        editBasicPropectError: true,
      };
    case 'PROS_SUBREC_DATA_SUCCESS':
      return {
        ...state,
        dataSubReccomentBU: action.payload,
        dataSubReccomentBU_loading: false,
        delBusinessUnitSuccess: false,
        delBusinessUnitFalse: false,
        addBusinessUnitSuccess: false,
        addBusinessUnitFalse: false,
      };
    case 'BUS_UNIT_DATA_SUCCESS':
      return {
        ...state,
        dataBusinessUnit: action.payload,
        dataBusinessUnit_Loading: false
      };
    case 'ADD_BUS_UNIT_DATA_SUCCESS':
      return {
        ...state,
        addBusinessUnit: action.payload,
        addBusinessUnitSuccess: true,
        addBusinessUnitFalse: true
      };
    case 'ADD_BUS_UNIT_DATA_FAIL':
      return {
        ...state,
        // data_loading: false,
        addBusinessUnitSuccess: true,
        addProspecterrorMSG: action.payload,
      };
    case 'DEL_BUS_UNIT_DATA_SUCCESS':
      return {
        ...state,
        addBusinessUnit: '',
        delBusinessUnitSuccess: true,
        delBusinessUnitFalse: true,
      };
    case 'DEL_BUS_UNIT_DATA_FAIL':
      return {
        ...state,
        // data_loading: false,
        delBusinessUnitSuccess: true,
        delProspecterrorMSG: action.payload,
      };
    case 'FEED_DATA_SUCCESS':
      return {
        ...state,
        dataFeedTab: action.payload,
        dataFeedTab_Loading: false
      };
    case 'SALETERRITORY_DATA_SUCCESS':
      return {
        ...state,
        saleTerritoryData: action.payload,
        saleTerritoryData_Loading: false,
        addsaleTerritorySucsess: false,
        addsaleTerritoryfalse: false,
        delsaleTerritorySucsess: false,
        delsaleTerritoryfalse: false,
      };
    case 'TERRI_DEDI_DATA_SUCCESS':
      return {
        ...state,
        TerritoryForDedicated: action.payload,
        TerritoryForDedicated_Loading: false
      };
    case 'ADD_TERRI_DEDI_DATA_SUCCESS':
      return {
        ...state,
        addsaleTerritorySucsess: true,
        addsaleTerritoryfalse: true,
      };
    case 'ADD_TERRI_DEDI_DATA_FAIL':
      return {
        ...state,
        addsaleTerritorySucsess: true,
        addsaleTerritorytErrorMSG: action.payload,
      };
    case 'DEL_TERRI_DEDI_DATA_SUCCESS':
      return {
        ...state,
        delsaleTerritorySucsess: true,
        delsaleTerritoryfalse: true,
      };
    case 'DEL_TERRI_DEDI_DATA_FAIL':
      return {
        ...state,
        delsaleTerritorySucsess: true,
        delsaleTerritorytErrorMSG: action.payload,
      };
    case 'RESET_PROSPECT':
      return {
        ...state,
        brand: '',
        brand_loading: true,
        distirct: '',
        distirct_loading: true,
        subdistirct: '',
        subdistirct_loading: true,
        addProspectloadingSuccess: false,
        addProspectloadingError: false,
        addProspecterrorMSG: '',
        addressProspect: null,
        addressProspect_loading: true,
        dataAccoutTeam: '',
        dataAccoutTeam_Loading: true,
        contactProspect: null,
        contactProspect_loading: true,
        basicProspect: null,
        basicProspect_loading: true,
        dbdProspect: null,
        dbdProspect_loading: true,
        TerritoryForDedicated: '',
        TerritoryForDedicated_Loading: true,
        addsaleTerritorySucsess: false,
        addsaleTerritoryfalse: false,
        addsaleTerritorytErrorMSG: '',
        delsaleTerritorySucsess: false,
        delsaleTerritoryfalse: false,
        delsaleTerritorytErrorMSG: '',
        visitHourData: '',
        visitHourData_loading: true,
        addVisitHourSucess: false,
        addVisitHourfalse: false,
        addVisitHourErrorMSG: '',
        delVisitHourSucess: false,
        delVisitHourfalse: false,
        delVisitHourErrorMSG: '',
        createProspectloadingSuccess: false,
        createProsloadingError: false,
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
        editBasicPropectSuucess: false,
        editBasicPropectError: false,
        editDbdPropectSuucess: false,
        editDbdPropectError: false,
        attechment: '',
        attechment_Loading: true,
        attechmentCate: '',
        attechmentCate_Loading: true,
        dataMyProspectErrorMSG: '',
        dataMyProspectErrorMSG_Loding: true,
        dataReccomentBUErrorMSG: '',
        dataReccomentBUErrorMSG_Loding: true,
        dataInTerritoryErrorMSG: '',
        dataInTerritoryErrorMSG_Loding: true
      };
    case 'RESET_SUBMENU':
      return {
        ...state,
        brand: '',
        brand_loading: true,
        distirct: '',
        distirct_loading: true,
        subdistirct: '',
        subdistirct_loading: true,
        addProspectloadingSuccess: false,
        addProspectloadingError: false,
        addProspecterrorMSG: '',
        addressProspect: null,
        addressProspect_loading: true,
        dataAccoutTeam: '',
        dataAccoutTeam_Loading: true,
        contactProspect: null,
        contactProspect_loading: true,
        basicProspect: null,
        basicProspect_loading: true,
        dbdProspect: null,
        dbdProspect_loading: true,
        editDbdPropectSuucess: true,
        TerritoryForDedicated: '',
        TerritoryForDedicated_Loading: true,
        addsaleTerritorySucsess: false,
        addsaleTerritoryfalse: false,
        addsaleTerritorytErrorMSG: '',
        delsaleTerritorySucsess: false,
        delsaleTerritoryfalse: false,
        delsaleTerritorytErrorMSG: '',
        visitHourData: '',
        visitHourData_loading: true,
        addVisitHourSucess: false,
        addVisitHourfalse: false,
        addVisitHourErrorMSG: '',
        delVisitHourSucess: false,
        delVisitHourfalse: false,
        delVisitHourErrorMSG: '',
        createProspectloadingSuccess: false,
        createProsloadingError: false,
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
        editBasicPropectSuucess: false,
        editBasicPropectError: false,
        editDbdPropectSuucess: false,
        editDbdPropectError: false,
        attechment: '',
        attechment_Loading: true,
        attechmentCate: '',
        attechmentCate_Loading: true,
        dataMyProspectErrorMSG: '',
        dataMyProspectErrorMSG_Loding: true,
        dataReccomentBUErrorMSG: '',
        dataReccomentBUErrorMSG_Loding: true,
        dataInTerritoryErrorMSG: '',
        dataInTerritoryErrorMSG_Loding: true
      };
    case 'REGION_DATA_SUCCESS':
      return {
        ...state,
        region_loading: false,
        region: action.payload,
      };
    case 'PROSCONTACT_DATA_SUCCESS':
      return {
        ...state,
        contactProspect: action.payload,
        contactProspect_loading: false,
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
      };
    case 'ADDPROSCONTACT_DATA_SUCCESS':
      return {
        ...state,
        addContactPropectSuucess: true,
        addContactPropectError: false,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
      };
    case 'ADDPROSCONTACT_DATA_FAIL':
      return {
        ...state,
        contactErrorMSG: action.payload,
        addContactPropectSuucess: true,
        addContactPropectError: true,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
      };
    case 'UPDPROSCONTACT_DATA_SUCCESS':
      return {
        ...state,
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: true,
        updContactPropectError: false,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
      };
    case 'UPDPROSCONTACT_DATA_FAIL':
      return {
        ...state,
        contactErrorMSG: action.payload,
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: true,
        updContactPropectError: true,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
      };
    case 'PROSCONTACT_REMOVE_SUCCESS':
      return {
        ...state,
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: true,
        removeContactPropectError: false,
      };
    case 'PROSCONTACT_REMOVE_FAIL':
      return {
        ...state,
        contactErrorMSG: action.payload,
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: true,
        removeContactPropectError: true,
      };
    case 'PROSDBD_DATA_SUCCESS':
      return {
        ...state,
        dbdProspect: action.payload,
        dbdProspect_loading: false,
        editDbdPropectSuucess: false,
        editDbdPropectError: false,
      };
    case 'UPDDBD_DATA_SUCCESS':
      return {
        ...state,
        editDbdPropectSuucess: true,
        editDbdPropectError: false,
      };
    case 'UPDDBD_DATA_FAIL':
      return {
        ...state,
        dbdErrorMSG: action.payload,
        editDbdPropectSuucess: true,
        editDbdPropectError: true
      };
    case 'RESET_MSGERRORPROS':
      return {
        ...state,
        createProsErrorMSG: '',
        createProspectloadingSuccess: false,
        createProsloadingError: false,
        contactErrorMSG: '',
        addContactPropectSuucess: false,
        addContactPropectError: false,
        updContactPropectSuucess: false,
        updContactPropectError: false,
        removeContactPropectSuucess: false,
        removeContactPropectError: false,
        basicErrorMSG: '',
        editBasicPropectSuucess: false,
        editBasicPropectError: false,
        dbdErrorMSG: '',
        editDbdPropectSuucess: false,
        editDbdPropectError: false
      };
    case 'VISITHOUR_DATA_SUCCESS':
      return {
        ...state,
        visitHourData: action.payload,
        visitHourData_loading: true,
        addVisitHourSucess: false,
        addVisitHourfalse: false,
        delVisitHourSucess: false,
        delVisitHourfalse: false,
      };
    case 'ADD_VISITHOUR_DATA_SUCCESS':
      return {
        ...state,
        addVisitHourSucess: true,
        addVisitHourfalse: true,
      };
    case 'ADD_VISITHOUR_DATA_FAIL':
      return {
        ...state,
        addVisitHourSucess: true,
        addVisitHourErrorMSG: action.payload,
      };
    case 'DEL_VISITHOUR_DATA_SUCCESS':
      return {
        ...state,
        delVisitHourSucess: true,
        delVisitHourfalse: true,
      };
    case 'DEL_VISITHOUR_DATA_FAIL':
      return {
        ...state,
        delVisitHourSucess: true,
        delVisitHourErrorMSG: action.payload,
      };
    case 'ATTACHMENT_DATA_SUCCESS':
      return {
        ...state,
        attechment: action.payload,
        attechment_Loading: false,
      };
    case 'ATTACHMENT_CATE_DATA_SUCCESS':
      return {
        ...state,
        attechmentCate: action.payload,
        attechmentCate_Loading: false
      };
    case 'DELETE_PROSPECT_SUCCESS':
      return {
        ...state,
        delProspect: action.payload,
        delProspect_Loading: true,
        delProspectErrorMSG: '',
        delProspectErrorMSG_Loading: false
      };
    case 'DELETE_PROSPECT_FAIL':
      return {
        ...state,
        delProspectErrorMSG: action.payload,
        delProspectErrorMSG_Loading: true,
        delProspect: '',
        delProspect_Loading: false
      };
    case 'DELETE_PROSPECT':
      return {
        ...state,
        delProspectErrorMSG: '',
        delProspectErrorMSG_Loading: false,
        delProspect: '',
        delProspect_Loading: false
      };


    default:
      return state;
  }
};

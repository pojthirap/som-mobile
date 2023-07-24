import {combineReducers} from '@reduxjs/toolkit';
import auth from './reducers/auth';
import home from './reducers/home';
import master from './reducers/master';
import prospect from './reducers/prospect';
import getConfigLov from './reducers/getConfigLov';
import prospectSelectInfo from './reducers/prospectISelectnfo';
import customer from './reducers/customer';
import rentStation from './reducers/rentStation';
import otherProspect from './reducers/otherProspect'
import saleVisitPlan from './reducers/saleVisitPlan';
import qrReducer from './reducers/qr';
import salesOrder from './reducers/salesOrder';
import salesOrderSelectInfo from './reducers/saleOrderSelectInfo';
import saleVisit from './reducers/saleVisit';
import getConfigLovAccount from './reducers/getConfigLovAccount';
import  getUserProfile from './reducers/userProfile';

const rootReducer = combineReducers({
  authReducer: auth,
  homeReducer: home,
  masterReducer: master,
  prospectReducer: prospect,
  getConfigLovReducer:getConfigLov,
  prospectSelectInfoReducer:prospectSelectInfo,
  customerReducer:customer,
  rentStationReducer:rentStation,
  otherProspectReducer:otherProspect,
  saleVisitPlanReducer:saleVisitPlan,
  qrReducer:qrReducer,
  salesOrderReducer:salesOrder,
  salesOrderSelectInfoReducer:salesOrderSelectInfo,
  saleVisit:saleVisit,
  getConfigLovAccountReducer :getConfigLovAccount,
  getUserProfileReducer: getUserProfile
});

export default rootReducer;

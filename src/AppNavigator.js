import React, { useState, useEffect, useRef } from 'react';
import { View, LogBox, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Provider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/th';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { Icon } from 'native-base'
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { restoreToken } from './actions/authAction';

import createProspect from './screens/Account/createProspect';
import DrawerView from './screens/DrawerView';
import HomeScreen from './screens/HomeScreen';
import DontHavePermission from './screens/DontHavePermission';
import DontHavePermissionSaleOrder from './screens/DontHavePermissionSaleOrder';
import snbmenuProspect from './screens/Account/submenuProspect';
import SubmenuSAScreen from './screens/Account/prospectSubMenu/SubmenuSA';
import ProspectScreen from './screens/Account/Prospect';
import CustomerScreen from './screens/Account/Customer';
import GasStationRentalScreen from './screens/Account/GasStationRental';
import OtherProspectScreen from './screens/Account/OtherProspect';
import SaleTerritoryScreen from './screens/Account/prospectSubMenu/SubmenuSaleTrritory';
import SubmenuAddressScreen from './screens/Account/prospectSubMenu/SubmenuAddress';
import SubmenuContectScreen from './screens/Account/prospectSubMenu/SubmenuContect';
import SubmenuBasicScreen from './screens/Account/prospectSubMenu/SubmenuBasic';
import SubmenuDbdScreen from './screens/Account/prospectSubMenu/SubmenuDBD';
import SubmenuVisitHourScreen from './screens/Account/prospectSubMenu/SubmenuVisitHour';
import SubmenuFeedScreen from './screens/Account/prospectSubMenu/SubmenuFeed';
import SubmenuSurveyResultsScreen from './screens/Account/prospectSubMenu/SubmenuSurveyResults';
import SubmenuRecommandBUScreen from './screens/Account/prospectSubMenu/SubmenuRecommandBU';
import SubmenuTemplateSaScreen from './screens/Account/prospectSubMenu/SubmenuTemplateSA';
import SubmenuAccTeamScreen from './screens/Account/prospectSubMenu/SubmenuAccountTeam';
import SubmenuSalesDataScreen from './screens/Account/prospectSubMenu/SubmenuSalesData';
import SubmenuStockCountScreen from './screens/Account/prospectSubMenu/SubmenuStockCount';
import SubmenuAttachScreen from './screens/Account/prospectSubMenu/SubmenuAtteachments';
import SubmenuSaleOrderScreen from './screens/Account/prospectSubMenu/SubmenuSaleOrder';
import SubmenuMeterScreen from './screens/Account/prospectSubMenu/SubmenuMeter';
import TemplateSaScreen from './screens/Account/prospectSubMenu/TemplateSaScreen';
import TemplateSurveyScreen from './screens/Account/prospectSubMenu/TemplateSurveyScreen';
import LocationMasterScreen from './screens/master/LocationMaster';
import AddEditLocationMasterScreen from './screens/master/AddEditLocationMasterScreen';
import QRMasterScreen from './screens/master/QRMaster';
import Login from './screens/Login';
import AddEditQRMasterScreen from './screens/master/AddEditQRMasterScreen';
import SaleOrder from './screens/saleOrder/SaleOrder';
import SaleVisitScreen from './screens/saleVisit/SaleVisit';
import SaleVisitPlanTripScreen from './screens/saleVisit/SaleVisitPlanTrip';
import SaleVisitPlanScreen from './screens/saleVisitPlan/SaleVisitPlan';
import ViewVisitPlanScreen from './screens/saleVisitPlan/ViewVisitPlan';
import CreatePlanForMeScreen from './screens/saleVisitPlan/CreatePlanForMe';
import CreatePlanForOtherScreen from './screens/saleVisitPlan/CreateForOther';
import CreateSalesOrderScreen from './screens/saleOrder/CreateSalesOrder';
import OverViewSaleOrderScreen from './screens/saleOrder/OverViewSaleOrder';
import ProductSaleOrderScreen from './screens/saleOrder/ProductSaleOrder';
import DocumentFlowScreen from './screens/saleOrder/DocumentFlow';
import ChangeSaleOrderScreen from './screens/saleOrder/ChangeSaleOrder';
import EditTemplateProsCus from './screens/saleVisitPlan/EditTemplateProsCus';
import EditTemplateProsCusForOther from './screens/saleVisitPlan/EditTemplateProsCusForOther';
import EditableViewVisitPlanScreen from './screens/saleVisitPlan/EditableViewVisitPlan';
import EditSaleOrderScreen from './screens/saleOrder/EditSaleOrder';
import ScanQr from './components/scanQr/ScanQr'
import Meter from './components/template/Meter'
import Appfrom from './components/template/Appform'
import StockCard from './components/template/StockCard'
import SaForm from './components/template/SaForm'

import { SubmenuBar } from './components';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('th');
  const [isGetToken, setIsGetToken] = useState(false);
  const { t, i18n } = useTranslation();
  const { token } = useSelector((state) => state.authReducer);

  const routeNameRef = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    if (token) return setIsGetToken(true)

    return setIsGetToken(false)

  }, [token])

  function AccountTab() {
    return (
      <Tab.Navigator
        swipeEnabled={false}
        scrollEnabled={false}
        lazy={true}
        removeClippedSubviews={true}

        tabBar={props => <SubmenuBar {...props} />}
      >
        <Stack.Screen name="SubmenuSAScreen" component={SubmenuSAScreen} />
        <Stack.Screen name="SubmenuFeedScreen" component={SubmenuFeedScreen} />
        <Stack.Screen name="SaleTerritoryScreen" component={SaleTerritoryScreen} />
        <Stack.Screen name="SubmenuAddressScreen" component={SubmenuAddressScreen} />
        <Stack.Screen name="SubmenuContectScreen" component={SubmenuContectScreen} />
        <Stack.Screen name="SubmenuAttachScreen" component={SubmenuAttachScreen} />
        <Stack.Screen name="SubmenuVisitHourScreen" component={SubmenuVisitHourScreen} />
        <Stack.Screen name="SubmenuSurveyResultsScreen" component={SubmenuSurveyResultsScreen} />
        <Stack.Screen name="SubmenuRecommandBUScreen" component={SubmenuRecommandBUScreen} />
        <Stack.Screen name="SubmenuTemplateSaScreen" component={SubmenuTemplateSaScreen} />
        <Stack.Screen name="SubmenuDbdScreen" component={SubmenuDbdScreen} />
        <Stack.Screen name="SubmenuAccTeamScreen" component={SubmenuAccTeamScreen} />
        <Stack.Screen name="SubmenuBasicScreen" component={SubmenuBasicScreen} />
        <Stack.Screen name="SubmenuSaleOrderScreen" component={SubmenuSaleOrderScreen} />
        <Stack.Screen name="SubmenuMeterScreen" component={SubmenuMeterScreen} />
        <Stack.Screen name="SubmenuStockCountScreen" component={SubmenuStockCountScreen} />
        <Stack.Screen name="SubmenuSalesDataScreen" component={SubmenuSalesDataScreen} />
      </Tab.Navigator>
    );
  }


  const StackScreen = () => {
    return (
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
        })}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DontHavePermission" component={DontHavePermission} />
        <Stack.Screen name="DontHavePermissionSaleOrder" component={DontHavePermissionSaleOrder} />
        <Stack.Screen name="createProspect" component={createProspect} />
        <Stack.Screen name="ProspectScreen" component={ProspectScreen} />
        <Stack.Screen name="CustomerScreen" component={CustomerScreen} />
        <Stack.Screen name="GasStationRentalScreen" component={GasStationRentalScreen} />
        <Stack.Screen name="OtherProspectScreen" component={OtherProspectScreen} />
        <Stack.Screen name="snbmenuProspect" component={snbmenuProspect} />
        <Stack.Screen name="AccountTab" component={AccountTab} />
        <Stack.Screen name="TemplateSaScreen" component={TemplateSaScreen} />
        <Stack.Screen name="TemplateSurveyScreen" component={TemplateSurveyScreen} />
        <Stack.Screen name="SaleVisitScreen" component={SaleVisitScreen} />
        <Stack.Screen name="SaleVisitPlanTripScreen" component={SaleVisitPlanTripScreen} />
        <Stack.Screen name="CreateSalesOrderScreen" component={CreateSalesOrderScreen} />

        {/* {Tab เมนู SaleOrder} */}
        <Stack.Screen name="SaleOrder" component={SaleOrder} />
        <Stack.Screen name="OverViewSaleOrderScreen" component={OverViewSaleOrderScreen} />
        <Stack.Screen name="ProductSaleOrderScreen" component={ProductSaleOrderScreen} />
        <Stack.Screen name="DocumentFlowScreen" component={DocumentFlowScreen} />
        <Stack.Screen name="ChangeSaleOrderScreen" component={ChangeSaleOrderScreen} />
        <Stack.Screen name="EditSaleOrderScreen" component={EditSaleOrderScreen} />

        {/* {Tab เมนู SaleVisitPlan} */}
        <Stack.Screen name="SaleVisitPlanScreen" component={SaleVisitPlanScreen} />
        <Stack.Screen name="CreatePlanForMeScreen" component={CreatePlanForMeScreen} />
        <Stack.Screen name="CreatePlanForOtherScreen" component={CreatePlanForOtherScreen} />
        <Stack.Screen name="ViewVisitPlanScreen" component={ViewVisitPlanScreen} />
        <Stack.Screen name="EditTemplateProsCus" component={EditTemplateProsCus} />
        <Stack.Screen name="EditTemplateProsCusForOther" component={EditTemplateProsCusForOther} />
        <Stack.Screen name="EditableViewVisitPlanScreen" component={EditableViewVisitPlanScreen} />

        {/* {Tab เมนู Master} */}
        <Stack.Screen name="QRMasterScreen" component={QRMasterScreen} />
        <Stack.Screen name="AddEditQRMasterScreen" component={AddEditQRMasterScreen} />
        <Stack.Screen name="LocationMasterScreen" component={LocationMasterScreen} />
        <Stack.Screen name="AddEditLocationMasterScreen" component={AddEditLocationMasterScreen} />
        <Stack.Screen name="ScanQr" component={ScanQr} />
        <Stack.Screen name="Meter" component={Meter} />
        <Stack.Screen name="Appfrom" component={Appfrom} />
        <Stack.Screen name="StockCard" component={StockCard} />
        <Stack.Screen name="SaForm" component={SaForm} />

      </Stack.Navigator>
    )
  }

  const AuthScreen = () => {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
        })}
      >
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;
        
        console.log(currentRouteName);

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
          crashlytics().log(currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <Provider style={{ flexDirection: 'row', flex: 1 }}>
        {/* {currentLanguage ? */}
        {
          isGetToken ?
            <Drawer.Navigator
              drawerStyle={{
                width: 450,
                backgroundColor: 'transparent'
              }}
              screenOptions={{ swipeEnabled: false }}
              drawerContent={props => <DrawerView {...props} />}
            >
              <Drawer.Screen name="Home" component={StackScreen} />
            </Drawer.Navigator>


            :
            AuthScreen()
        }
      </Provider>
    </NavigationContainer>
  )


};

export default App;

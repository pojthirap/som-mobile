import React,{useRef,useEffect,useState} from 'react';
import {ScrollView, View, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';

import SubMenu from './SubMenu'
import Header from './Header'

import colors from '../utility/colors';
import { FONT_SIZE } from '../utility/enum';

const submenuBar = ({ state }) => {

    // const isFocused = state ? state.index : '';
    // const isFocused = state ? state.index : '';
    const {prospectSelectInfoReducer, authReducer,getUserProfileReducer} = useSelector((state) => state);
    const flatListRef = useRef({})
    const [State,setState] = useState(state);
    const [isFocused,setIsFocused] = useState(0)
    // let listPermission = authReducer.userProfile.listPermObjCode;
    let listPermission = getUserProfileReducer.dataUserProfile.listPermObjCode;

    
    const scrollToIndex = (route) =>{
        setTimeout(() => {
            if (!flatListRef.current) return
            let permissionScreen = prospectSelectInfoReducer.dataSelect.isCustomer ? submenuCustomer : submenuProspect
            let screenIndex = route.findIndex((i) => {
                return i.ScreenName == permissionScreen[state.index].ScreenName
            })
            let navigateScreen = screenIndex == -1 ? 0 : screenIndex
            setIsFocused(navigateScreen)
            flatListRef.current.scrollToIndex({index: navigateScreen, animated: true})
        }, 500)
    }

    const submenuProspect =[
        {isProspect : true,titleSubMenu: 'SA',              icon : require('../assets/images/submenu/Show.png'),            ScreenName:'SubmenuSAScreen',           permObjCodePros: 'FE_ACC_PROSP_S012_SA',            permObjCodePump: 'FE_ACC_PUMP_S011_SA',             permObjCodeOther: 'FE_ACC_OTHER_S011_SA'},
        {isProspect : true,titleSubMenu: 'Feed',            icon : require('../assets/images/submenu/Lock-1.png'),          ScreenName:'SubmenuFeedScreen',         permObjCodePros: 'FE_ACC_PROSP_S012_FEED',          permObjCodePump: 'FE_ACC_PUMP_S011_FEED',           permObjCodeOther: 'FE_ACC_OTHER_S011_FEED'},
        {isProspect : true,titleSubMenu: 'Sales territory', icon : require('../assets/images/submenu/Send.png'),            ScreenName:'SaleTerritoryScreen',       permObjCodePros: 'FE_ACC_PROSP_S012_SALE_TERT',     permObjCodePump: 'FE_ACC_PUMP_S011_SALE_TERT',      permObjCodeOther: 'FE_ACC_OTHER_S011_SALE_TERT'},
        {isProspect : true,titleSubMenu: 'Address',         icon : require('../assets/images/submenu/Group-2.png'),         ScreenName:'SubmenuAddressScreen',      permObjCodePros: 'FE_ACC_PROSP_S012_ADDRESS',       permObjCodePump: 'FE_ACC_PUMP_S011_ADDRESS',        permObjCodeOther: 'FE_ACC_OTHER_S011_ADDRESS'},
        {isProspect : true,titleSubMenu: 'Contact',         icon : require('../assets/images/submenu/Group-39.png'),        ScreenName:'SubmenuContectScreen',      permObjCodePros: 'FE_ACC_PROSP_S012_CONTACT',       permObjCodePump: 'FE_ACC_PUMP_S011_CONTACT',        permObjCodeOther: 'FE_ACC_OTHER_S011_CONTACT'},
        {isProspect : true,titleSubMenu: 'Attachments',     icon : require('../assets/images/submenu/Paper.png'),           ScreenName:'SubmenuAttachScreen',       permObjCodePros: 'FE_ACC_PROSP_S012_ATTACHMENT',    permObjCodePump: 'FE_ACC_PUMP_S011_ATTACHMENT',     permObjCodeOther: 'FE_ACC_OTHER_S011_ATTACHMENT'},
        {isProspect : true,titleSubMenu: 'Visiting Hours',  icon : require('../assets/images/submenu/Clock.png'),           ScreenName:'SubmenuVisitHourScreen',    permObjCodePros: 'FE_ACC_PROSP_S012_VISIT_HR',      permObjCodePump: 'FE_ACC_PUMP_S011_VISIT_HR',       permObjCodeOther: 'FE_ACC_OTHER_S011_VISIT_HR'},
        {isProspect : true,titleSubMenu: 'Survey Results',  icon : require('../assets/images/submenu/Search.png'),          ScreenName:'SubmenuSurveyResultsScreen',permObjCodePros: 'FE_ACC_PROSP_S012_SURV_RESULT',   permObjCodePump: 'FE_ACC_PUMP_S011_SURV_RESULT',    permObjCodeOther: 'FE_ACC_OTHER_S011_SURV_RESULT'},
        {isProspect : true,titleSubMenu: 'Recommend BU',    icon : require('../assets/images/submenu/Bookmark.png'),        ScreenName: 'SubmenuRecommandBUScreen', permObjCodePros: 'FE_ACC_PROSP_S012_RECFE_BU',      permObjCodePump: 'FE_ACC_PUMP_S011_RECFE_BU',       permObjCodeOther: 'FE_ACC_OTHER_S011_RECFE_BU'},
        {isProspect : true,titleSubMenu: 'Template For SA', icon : require('../assets/images/submenu/Component-15.png'),    ScreenName:'SubmenuTemplateSaScreen',   permObjCodePros: 'FE_ACC_PROSP_S012_TP_SA',         permObjCodePump: 'FE_ACC_PUMP_S011_TP_SA',          permObjCodeOther: 'FE_ACC_OTHER_S011_TP_SA'},
        {isProspect : true,titleSubMenu: 'DBD',             icon : require('../assets/images/submenu/dbd.png'),             ScreenName:'SubmenuDbdScreen',          permObjCodePros: 'FE_ACC_PROSP_S012_DBD',           permObjCodePump: 'FE_ACC_PUMP_S011_DBD',            permObjCodeOther: 'FE_ACC_OTHER_S011_DBD'},
        {isProspect : true,titleSubMenu: 'Account Team',    icon : require('../assets/images/submenu/Component-13.png'),    ScreenName:'SubmenuAccTeamScreen',      permObjCodePros: 'FE_ACC_PROSP_S012_ACC_TEAM',      permObjCodePump: 'FE_ACC_PUMP_S011_ACC_TEAM',       permObjCodeOther: 'FE_ACC_OTHER_S011_ACC_TEAM'},
        {isProspect : true,titleSubMenu: 'Basic',           icon : require('../assets/images/submenu/Paper.png'),           ScreenName:'SubmenuBasicScreen',        permObjCodePros: 'FE_ACC_PROSP_S012_BASIC',         permObjCodePump: 'FE_ACC_PUMP_S011_BASIC',          permObjCodeOther: 'FE_ACC_OTHER_S011_BASIC'},
    ];

    const submenuCustomer =[
        {isProspect : true,titleSubMenu: 'SA',              icon : require('../assets/images/submenu/Show.png'),            ScreenName:'SubmenuSAScreen',           permObjCode: 'FE_ACC_CUST_S011_SA'},
        {isProspect : true,titleSubMenu: 'Feed',            icon : require('../assets/images/submenu/Lock-1.png'),          ScreenName:'SubmenuFeedScreen',         permObjCode: 'FE_ACC_CUST_S011_FEED'},
        {isProspect : true,titleSubMenu: 'Sales territory', icon : require('../assets/images/submenu/Send.png'),            ScreenName:'SaleTerritoryScreen',       permObjCode: 'FE_ACC_CUST_S011_SALE_TERT'},
        {isProspect : true,titleSubMenu: 'Address',         icon : require('../assets/images/submenu/Group-2.png'),         ScreenName:'SubmenuAddressScreen',      permObjCode: 'FE_ACC_CUST_S011_ADDRESS'},
        {isProspect : true,titleSubMenu: 'Contact',         icon : require('../assets/images/submenu/Group-39.png'),        ScreenName:'SubmenuContectScreen',      permObjCode: 'FE_ACC_CUST_S011_CONTACT'},
        {isProspect : true,titleSubMenu: 'Attachments',     icon : require('../assets/images/submenu/Paper.png'),           ScreenName:'SubmenuAttachScreen',       permObjCode: 'FE_ACC_CUST_S011_ATTACHMENT'},
        {isProspect : true,titleSubMenu: 'Visiting Hours',  icon : require('../assets/images/submenu/Clock.png'),           ScreenName:'SubmenuVisitHourScreen',    permObjCode: 'FE_ACC_CUST_S011_VISIT_HR'},
        {isProspect : true,titleSubMenu: 'Survey Results',  icon : require('../assets/images/submenu/Search.png'),          ScreenName:'SubmenuSurveyResultsScreen',permObjCode: 'FE_ACC_CUST_S011_SURV_RESULT'},
        {isProspect : true,titleSubMenu: 'Recommend BU',    icon : require('../assets/images/submenu/Bookmark.png'),        ScreenName: 'SubmenuRecommandBUScreen', permObjCode: 'FE_ACC_CUST_S011_RECFE_BU'},
        {isProspect : true,titleSubMenu: 'Template For SA', icon : require('../assets/images/submenu/Component-15.png'),    ScreenName:'SubmenuTemplateSaScreen',   permObjCode: 'FE_ACC_CUST_S011_TP_SA'},
        {isProspect : true,titleSubMenu: 'DBD',             icon : require('../assets/images/submenu/dbd.png'),             ScreenName:'SubmenuDbdScreen',          permObjCode: 'FE_ACC_CUST_S011_DBD'},
        {isProspect : true,titleSubMenu: 'Account Team',    icon : require('../assets/images/submenu/Component-13.png'),    ScreenName:'SubmenuAccTeamScreen',      permObjCode: 'FE_ACC_CUST_S011_ACC_TEAM'},
        {isProspect : true,titleSubMenu: 'Basic',           icon : require('../assets/images/submenu/Paper.png'),           ScreenName:'SubmenuBasicScreen',        permObjCode: 'FE_ACC_CUST_S011_BASIC'},
        {isProspect : true,titleSubMenu: 'Sales Order',     icon : require('../assets/images/submenu/Component-14.png'),    ScreenName:'SubmenuSaleOrderScreen',    permObjCode: 'FE_ACC_CUST_S011_SALE_ORDER'},
        {isProspect : true,titleSubMenu: 'จดมิเตอร์',         icon : require('../assets/images/submenu/Group.png'),           ScreenName:'SubmenuMeterScreen',        permObjCode: 'FE_ACC_CUST_S011_REC_METER'},
        {isProspect : true,titleSubMenu: 'Stock Count',     icon : require('../assets/images/submenu/Component-16.png'),    ScreenName:'SubmenuStockCountScreen',   permObjCode: 'FE_ACC_CUST_S011_STOCK_COUNT'},
        {isProspect : true,titleSubMenu: 'Sale Data',       icon : require('../assets/images/submenu/Component-17.png'),    ScreenName:'SubmenuSalesDataScreen',    permObjCode: 'FE_ACC_CUST_S011_SALE_DATA'},
    ];

    const handlePermissionMenuCust = () => {
        listPermission = submenuCustomer.filter((itemList) => {
            let listPermissionNew = listPermission.find((item) => {
                return item.permObjCode == itemList.permObjCode
            })
            return listPermissionNew
        })
        scrollToIndex(listPermission)
        return listPermission
    }

    const handlePermissionMenu = () => {
        if (prospectSelectInfoReducer.dataSelect.isProspect) {
            listPermission = submenuProspect.filter((itemList) => {
                let listPermissionNew = listPermission.find((item) => {
                    return item.permObjCode == itemList.permObjCodePros
                })
                return listPermissionNew
            })
            scrollToIndex(listPermission)
            return listPermission
        }

        if (prospectSelectInfoReducer.dataSelect.isRentStation) {
            listPermission = submenuProspect.filter((itemList) => {
                let listPermissionNew = listPermission.find((item) => {
                    return item.permObjCode == itemList.permObjCodePump
                })
                return listPermissionNew
            })
            scrollToIndex(listPermission)
            return listPermission
        }

        if (prospectSelectInfoReducer.dataSelect.isOther) {
            listPermission = submenuProspect.filter((itemList) => {
                let listPermissionNew = listPermission.find((item) => {
                    return item.permObjCode == itemList.permObjCodeOther
                })
                return listPermissionNew
            })
            scrollToIndex(listPermission)
            return listPermission
        }
    }

    return (
        <View style={{backgroundColor:colors.white}}> 
            <Header/>
            <ScrollView style={{padding: 10, paddingVertical: 5, backgroundColor: colors.grayborder}}>
                <FlatList
                    ref = {flatListRef}
                    data = {prospectSelectInfoReducer.dataSelect.isCustomer ? handlePermissionMenuCust(): handlePermissionMenu()}
                    // data = {prospectSelectInfoReducer.dataSelect.isCustomer ? submenuCustomer : submenuProspect}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ backgroundColor: colors.grayborder, flex: 1 }}
                    onFocus={()=>{}}
                    onScrollToIndexFailed={()=>{}}
                    renderItem={(submenu, index)=>
                        <View style={{paddingHorizontal: 5}}>
                        <SubMenu
                            ScreenName={submenu.item.ScreenName}
                            titleSubMenu={submenu.item.titleSubMenu}
                            iconPhoto={submenu.item.icon}
                            isFocus={isFocused == submenu.index}
                            heightBox={80}
                            widthBox={100}
                            heightPhoto={50}
                            widthPhotot={50}
                            marginPhoto={5}
                            sizeFont={FONT_SIZE.LITTLETEXT2}
                            key={submenu}
                        />
                        </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </ScrollView>
        </View>   
    )
}

export default submenuBar;
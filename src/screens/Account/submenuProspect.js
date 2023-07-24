import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, FlatList, BackHandler, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'

import { Text, SubMenu, Header, CheckBox, Button, ModalWarning } from '../../components'
import { cloneOtherProspect, actionClear } from '../../actions/otherProspectAction';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SubMenuProspect = () => {

    const { prospectSelectInfoReducer, authReducer, otherProspectReducer, getUserProfileReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selectedItemList, setSelectedItemList] = useState(['4']);
    const [defaultValue, setDefaultValue] = useState(false);
    const [modalVisibleAddAlert, setmodalVisibleAddAlert] = useState(false);
    const [modalVisibleSuccess, setmodalVisibleSuccess] = useState(false);
    // let listPermission = getUserProfileReducer.dataUserProfile.listPermObjCode;
    let listPermission = getUserProfileReducer.dataUserProfile.listPermObjCode;

    useEffect(() => {
        if (otherProspectReducer.clone_Error && otherProspectReducer.clone_success) {
            setmodalVisibleAddAlert(true)
        } else if (otherProspectReducer.clone_success && !otherProspectReducer.clone_Error) {
            setmodalVisibleSuccess(true)

        }
    }, [otherProspectReducer])

    const onPressClone = () => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if (prospectId) {
            dispatch(cloneOtherProspect(prospectId, selectedItemList))
        }
    }

    const onCloseWarningSuccess = () => {
        setmodalVisibleSuccess(false)
        dispatch(actionClear())
        navigation.navigate('ProspectScreen')
    }

    const onCloseWarning = () => {
        setmodalVisibleAddAlert(false)
        dispatch(actionClear())
        navigation.navigate('OtherProspectScreen')
    }

    const submenuProspect = [
        { isProspect: true, titleSubMenu: 'SA', icon: require('../../assets/images/submenu/Show.png'), ScreenName: 'SubmenuSAScreen', id: '1', permObjCodePros: 'FE_ACC_PROSP_S012_SA', permObjCodePump: 'FE_ACC_PUMP_S011_SA', permObjCodeOther: 'FE_ACC_OTHER_S011_SA' },
        { isProspect: true, titleSubMenu: 'Feed', icon: require('../../assets/images/submenu/Lock-1.png'), ScreenName: 'SubmenuFeedScreen', id: '5', permObjCodePros: 'FE_ACC_PROSP_S012_FEED', permObjCodePump: 'FE_ACC_PUMP_S011_FEED', permObjCodeOther: 'FE_ACC_OTHER_S011_FEED' },
        { isProspect: true, titleSubMenu: 'Sales territory', icon: require('../../assets/images/submenu/Send.png'), ScreenName: 'SaleTerritoryScreen', id: '6', permObjCodePros: 'FE_ACC_PROSP_S012_SALE_TERT', permObjCodePump: 'FE_ACC_PUMP_S011_SALE_TERT', permObjCodeOther: 'FE_ACC_OTHER_S011_SALE_TERT' },
        { isProspect: true, titleSubMenu: 'Address', icon: require('../../assets/images/submenu/Group-2.png'), ScreenName: 'SubmenuAddressScreen', id: '7', permObjCodePros: 'FE_ACC_PROSP_S012_ADDRESS', permObjCodePump: 'FE_ACC_PUMP_S011_ADDRESS', permObjCodeOther: 'FE_ACC_OTHER_S011_ADDRESS' },
        { isProspect: true, titleSubMenu: 'Contact', icon: require('../../assets/images/submenu/Group-39.png'), ScreenName: 'SubmenuContectScreen', id: '2', permObjCodePros: 'FE_ACC_PROSP_S012_CONTACT', permObjCodePump: 'FE_ACC_PUMP_S011_CONTACT', permObjCodeOther: 'FE_ACC_OTHER_S011_CONTACT' },
        { isProspect: true, titleSubMenu: 'Attachments', icon: require('../../assets/images/submenu/Paper.png'), ScreenName: 'SubmenuAttachScreen', id: '8', permObjCodePros: 'FE_ACC_PROSP_S012_ATTACHMENT', permObjCodePump: 'FE_ACC_PUMP_S011_ATTACHMENT', permObjCodeOther: 'FE_ACC_OTHER_S011_ATTACHMENT' },
        { isProspect: true, titleSubMenu: 'Visiting Hours', icon: require('../../assets/images/submenu/Clock.png'), ScreenName: 'SubmenuVisitHourScreen', id: '9', permObjCodePros: 'FE_ACC_PROSP_S012_VISIT_HR', permObjCodePump: 'FE_ACC_PUMP_S011_VISIT_HR', permObjCodeOther: 'FE_ACC_OTHER_S011_VISIT_HR' },
        { isProspect: true, titleSubMenu: 'Survey Results', icon: require('../../assets/images/submenu/Search.png'), ScreenName: 'SubmenuSurveyResultsScreen', id: '10', permObjCodePros: 'FE_ACC_PROSP_S012_SURV_RESULT', permObjCodePump: 'FE_ACC_PUMP_S011_SURV_RESULT', permObjCodeOther: 'FE_ACC_OTHER_S011_SURV_RESULT' },
        { isProspect: true, titleSubMenu: 'Recommend BU', icon: require('../../assets/images/submenu/Bookmark.png'), ScreenName: 'SubmenuRecommandBUScreen', id: '11', permObjCodePros: 'FE_ACC_PROSP_S012_RECFE_BU', permObjCodePump: 'FE_ACC_PUMP_S011_RECFE_BU', permObjCodeOther: 'FE_ACC_OTHER_S011_RECFE_BU' },
        { isProspect: true, titleSubMenu: 'Template For SA', icon: require('../../assets/images/submenu/Component-15.png'), ScreenName: 'SubmenuTemplateSaScreen', id: '12', permObjCodePros: 'FE_ACC_PROSP_S012_TP_SA', permObjCodePump: 'FE_ACC_PUMP_S011_TP_SA', permObjCodeOther: 'FE_ACC_OTHER_S011_TP_SA' },
        { isProspect: true, titleSubMenu: 'DBD', icon: require('../../assets/images/submenu/dbd.png'), ScreenName: 'SubmenuDbdScreen', id: '3', permObjCodePros: 'FE_ACC_PROSP_S012_DBD', permObjCodePump: 'FE_ACC_PUMP_S011_DBD', permObjCodeOther: 'FE_ACC_OTHER_S011_DBD' },
        { isProspect: true, titleSubMenu: 'Account Team', icon: require('../../assets/images/submenu/Component-13.png'), ScreenName: 'SubmenuAccTeamScreen', id: '13', permObjCodePros: 'FE_ACC_PROSP_S012_ACC_TEAM', permObjCodePump: 'FE_ACC_PUMP_S011_ACC_TEAM', permObjCodeOther: 'FE_ACC_OTHER_S011_ACC_TEAM' },
        { isProspect: true, titleSubMenu: 'Basic', icon: require('../../assets/images/submenu/Paper.png'), ScreenName: 'SubmenuBasicScreen', id: '4', permObjCodePros: 'FE_ACC_PROSP_S012_BASIC', permObjCodePump: 'FE_ACC_PUMP_S011_BASIC', permObjCodeOther: 'FE_ACC_OTHER_S011_BASIC' },
    ];

    const submenuCustomer = [
        { isProspect: true, titleSubMenu: 'SA', icon: require('../../assets/images/submenu/Show.png'), ScreenName: 'SubmenuSAScreen', permObjCode: 'FE_ACC_CUST_S011_SA' },
        { isProspect: true, titleSubMenu: 'Feed', icon: require('../../assets/images/submenu/Lock-1.png'), ScreenName: 'SubmenuFeedScreen', permObjCode: 'FE_ACC_CUST_S011_FEED' },
        { isProspect: true, titleSubMenu: 'Sales territory', icon: require('../../assets/images/submenu/Send.png'), ScreenName: 'SaleTerritoryScreen', permObjCode: 'FE_ACC_CUST_S011_SALE_TERT' },
        { isProspect: true, titleSubMenu: 'Address', icon: require('../../assets/images/submenu/Group-2.png'), ScreenName: 'SubmenuAddressScreen', permObjCode: 'FE_ACC_CUST_S011_ADDRESS' },
        { isProspect: true, titleSubMenu: 'Contact', icon: require('../../assets/images/submenu/Group-39.png'), ScreenName: 'SubmenuContectScreen', permObjCode: 'FE_ACC_CUST_S011_CONTACT' },
        { isProspect: true, titleSubMenu: 'Attachments', icon: require('../../assets/images/submenu/Paper.png'), ScreenName: 'SubmenuAttachScreen', permObjCode: 'FE_ACC_CUST_S011_ATTACHMENT' },
        { isProspect: true, titleSubMenu: 'Visiting Hours', icon: require('../../assets/images/submenu/Clock.png'), ScreenName: 'SubmenuVisitHourScreen', permObjCode: 'FE_ACC_CUST_S011_VISIT_HR' },
        { isProspect: true, titleSubMenu: 'Survey Results', icon: require('../../assets/images/submenu/Search.png'), ScreenName: 'SubmenuSurveyResultsScreen', permObjCode: 'FE_ACC_CUST_S011_SURV_RESULT' },
        { isProspect: true, titleSubMenu: 'Recommend BU', icon: require('../../assets/images/submenu/Bookmark.png'), ScreenName: 'SubmenuRecommandBUScreen', permObjCode: 'FE_ACC_CUST_S011_RECFE_BU' },
        { isProspect: true, titleSubMenu: 'Template For SA', icon: require('../../assets/images/submenu/Component-15.png'), ScreenName: 'SubmenuTemplateSaScreen', permObjCode: 'FE_ACC_CUST_S011_TP_SA' },
        { isProspect: true, titleSubMenu: 'DBD', icon: require('../../assets/images/submenu/dbd.png'), ScreenName: 'SubmenuDbdScreen', permObjCode: 'FE_ACC_CUST_S011_DBD' },
        { isProspect: true, titleSubMenu: 'Account Team', icon: require('../../assets/images/submenu/Component-13.png'), ScreenName: 'SubmenuAccTeamScreen', permObjCode: 'FE_ACC_CUST_S011_ACC_TEAM' },
        { isProspect: true, titleSubMenu: 'Basic', icon: require('../../assets/images/submenu/Paper.png'), ScreenName: 'SubmenuBasicScreen', permObjCode: 'FE_ACC_CUST_S011_BASIC' },
        { isProspect: true, titleSubMenu: 'Sales Order', icon: require('../../assets/images/submenu/Component-14.png'), ScreenName: 'SubmenuSaleOrderScreen', permObjCode: 'FE_ACC_CUST_S011_SALE_ORDER' },
        { isProspect: true, titleSubMenu: 'จดมิเตอร์', icon: require('../../assets/images/submenu/Group.png'), ScreenName: 'SubmenuMeterScreen', permObjCode: 'FE_ACC_CUST_S011_REC_METER' },
        { isProspect: true, titleSubMenu: 'Stock Count', icon: require('../../assets/images/submenu/Component-16.png'), ScreenName: 'SubmenuStockCountScreen', permObjCode: 'FE_ACC_CUST_S011_STOCK_COUNT' },
        { isProspect: true, titleSubMenu: 'Sale Data', icon: require('../../assets/images/submenu/Component-17.png'), ScreenName: 'SubmenuSalesDataScreen', permObjCode: 'FE_ACC_CUST_S011_SALE_DATA' },
    ];

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const handleSelect = (value) => {
        if (value === '4') return
        let findItem = selectedItemList.find((item) => {
            return item == value
        })


        if (findItem) {
            let filterItem = selectedItemList.filter((item) => {
                return item != value && item != '8' && item != '10'
            })
            return setSelectedItemList(filterItem)
        }


        if (value === '8' || value === '10') {
            if (defaultValue === false) {
                setDefaultValue(true)
                return setSelectedItemList([...selectedItemList, ...['8', '10']])
            } else {
                setDefaultValue(false)
                return setSelectedItemList([...selectedItemList, ...['8', '10']])
            }
        }

        return setSelectedItemList([...selectedItemList, value])
    }

    const checkSelectList = (id) => {
        return selectedItemList.find((item) => item === id)
    }

    const handlePermissionMenuCust = () => {
        listPermission = submenuCustomer.filter((itemList) => {
            let listPermissionNew = listPermission.find((item) => {
                return item.permObjCode == itemList.permObjCode
            })
            return listPermissionNew
        })
        return listPermission
    }

    const handlePermissionMenu = () => {
        if (prospectSelectInfoReducer.dataSelect.isProspect || prospectSelectInfoReducer.dataSelect.isRecommandBUProspect) {
            listPermission = submenuProspect.filter((itemList) => {
                let listPermissionNew = listPermission.find((item) => {
                    return item.permObjCode == itemList.permObjCodePros
                })
                return listPermissionNew
            })
            return listPermission
        }

        if (prospectSelectInfoReducer.dataSelect.isRentStation) {
            listPermission = submenuProspect.filter((itemList) => {
                let listPermissionNew = listPermission.find((item) => {
                    return item.permObjCode == itemList.permObjCodePump
                })
                return listPermissionNew
            })
            return listPermission
        }

        if (prospectSelectInfoReducer.dataSelect.isOther) {
            listPermission = submenuProspect.filter((itemList) => {
                let listPermissionNew = listPermission.find((item) => {
                    return item.permObjCode == itemList.permObjCodeOther
                })
                return listPermissionNew
            })
            return listPermission
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <ScrollView>
                <View style={{ marginTop: '3%', marginLeft: '5%' }}>
                    <Text style={{ fontSize: FONT_SIZE.HEADER, fontWeight: 'bold' }}>{getTitle()}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
                    <FlatList
                        data={prospectSelectInfoReducer.dataSelect.isCustomer ? handlePermissionMenuCust() : handlePermissionMenu()}
                        // data = {prospectSelectInfoReducer.dataSelect.isCustomer ? submenuCustomer : submenuProspect}
                        renderItem={(submenu) =>
                            <View style={{ width: (windowWidth / 2), paddingHorizontal: '5%', justifyContent: 'space-between' }}>
                                {prospectSelectInfoReducer.dataSelect.isOther ?
                                    <View style={{ flexDirection: 'row'}}>
                                        <View>
                                            <CheckBox
                                                typeSelect={'multiSelect'}
                                                Size={STYLE_SIZE.ICON_SIZE_SMALL} data={submenu.item.id}
                                                onPress={(data) => handleSelect(data)}
                                                disabled={submenu.item.id === '13' || submenu.item.id === '6' || submenu.item.id === '4' || submenu.item.id === '11' ? true : false}
                                                disableType={submenu.item.id === '4' ? 'view' : 'disable'}
                                                SelectDefault={() => checkSelectList(submenu.item.id)}
                                            />
                                        </View>
                                        <View style={{ width: '90%' }}>
                                            <SubMenu
                                                ScreenName={submenu.item.ScreenName}
                                                titleSubMenu={submenu.item.titleSubMenu}
                                                iconPhoto={submenu.item.icon}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View style={{ width: '100%' }}>
                                        <SubMenu
                                            ScreenName={submenu.item.ScreenName}
                                            titleSubMenu={submenu.item.titleSubMenu}
                                            iconPhoto={submenu.item.icon}
                                        />
                                    </View>

                                }

                            </View>
                        }
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {prospectSelectInfoReducer.dataSelect.isOther ?
                    <View style={{ alignSelf: 'center' }}>
                        <Button title={'Clone'} width={200} onPress={() => onPressClone()} />
                    </View>
                    :
                    null
                }
            </ScrollView>
            <ModalWarning
                visible={modalVisibleAddAlert}
                detailText={otherProspectReducer.clone_Error_msg}
                onlyCloseButton={true}
                WARNINGTITLE
                onPressClose={() => onCloseWarning()} />
            <ModalWarning
                visible={modalVisibleSuccess}
                detailText={'Clone ข้อมูลสำเร็จ'}
                onlyCloseButton={true}
                onPressClose={() => onCloseWarningSuccess()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    }
})

export default SubMenuProspect;
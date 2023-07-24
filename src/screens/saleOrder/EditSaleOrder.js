import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs, Tab, TabHeading, Item } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Text, Button, Header, ModalWarning } from '../../components'
import colors from '../../utility/colors';
import { FONT_SIZE } from '../../utility/enum';

import Overview from './OverViewSaleOrder';
import ProductSaleOrder from './ProductSaleOrder';
import DocumentFlow from './DocumentFlow';
import ChangeSaleOrder from './ChangeSaleOrder';
import DontHavePermissionSaleOrder from './../DontHavePermissionSaleOrder';
import { getSaleOrderByOrderId, updSaleOrderProduct, getChange } from '../../actions/menuSalesOrderAction';
import { getInputData, resetInputData } from '../../utility/helper';
import language from '../../language/th.json';

const EditSaleOrder = () => {

    const { salesOrderSelectInfoReducer, salesOrderReducer, authReducer, getUserProfileReducer } = useSelector((state) => state);
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [modalTabProduct, setModalTabProduct] = useState(false);
    const [isNotEmptyData, setIsNotEmptyData] = useState(false);
    let bottomTabRef = useRef(0);
    const [modalSave, setModalSave] = useState(false);
    const [modalSaveSuccess, setModalSaveSuccess] = useState(false);
    const [modalSaveError, setModalSaveError] = useState(false);
    const [typeSubmit, setTypeSubmit] = useState('');
    const [saleCustSelect, setSaleCustSelect] = useState('');
    const [prodList, setProdList] = useState('');
    const [tabChange, setTabChange] = useState('');
    const [overViewData, setOverViewData] = useState('');
    
    const [callProduct, setCallProduct] = useState(false);
    const [callDocument, setCallDocument] = useState(false);
    const [callChange, setCallChange] = useState(false);

    let listPermission = authReducer.userProfile.listPermObjCode;
    let listPermissionUser = getUserProfileReducer.dataUserProfile.listPermObjCode;

    useEffect(() => {
        if (salesOrderSelectInfoReducer.dataSelect.orderId != null) {
            let orderId = salesOrderSelectInfoReducer.dataSelect.orderId
            dispatch(getSaleOrderByOrderId(orderId))
        }
    }, [])

    useEffect(() => {
        if (salesOrderReducer.simulateloadingSuccess && !salesOrderReducer.simulateloadingError) {
            setModalSave(false)
            setProdList(null)
            setModalSaveSuccess(true)
        }

        if (salesOrderReducer.simulateloadingSuccess && salesOrderReducer.simulateloadingError) {
            setModalSaveSuccess(false)
            setModalSave(false)
            setProdList(null)
            setModalSaveError(true)
        }
    }, [salesOrderReducer.simulateloadingSuccess, salesOrderReducer.simulateloadingError])

    const handleCodeProduct = () => {  
        let premissionScreen = listPermissionUser.find((itemScreen) => {
            return itemScreen.permObjCode == 'FE_SALEORD_S012'
        });

        if (premissionScreen) return true;
        if (!premissionScreen) return false;
    };

    const handleTabProduct = (item) => {

        let totalValue = getInputData(inputRef, 'C');
        let dataOver = totalValue.data.overViewRef
        setSaleCustSelect(dataOver)
        let dataRequire = '' ;
        if(handleCodeProduct() == true && dataOver) {
            dataRequire = {
                ...dataRequire,
                docTypeCode: dataOver.docTypeCode,
                orgCode: dataOver.orgCode,
                channelCode: dataOver.channelCode,
                divisionCode: dataOver.divisionCode,
                shipCode: dataOver.shipPoint,
                incoterm: dataOver.incoterm,
                plantCode: dataOver.plantCode,
                companyCode: dataOver.companyCode
            }
        }
        
        let isNotEmpty = true
        Object.keys(dataRequire).map((data, index) => {
            if (!dataRequire[data]) {
                isNotEmpty = false
            }
        })

        setIsNotEmptyData(isNotEmpty)

        if (item.i == "0") {
            setCallProduct(false)
            setCallDocument(false)
            setCallChange(false)
        } 
        
        if (item.i == "1") {
            if (isNotEmpty == false) {
                setModalTabProduct(true)
                if (!bottomTabRef) return
                if (!bottomTabRef.goToPage()) return
                bottomTabRef.goToPage(item.from)
            } else {
                setCallProduct(true)
                setCallDocument(false)     
                setCallChange(false)
            }
        }
        
        if (item.i == "2") {
            setCallProduct(false)
            setCallDocument(true)
            setCallChange(false)
        }

        if (item.i == "3") {
            setCallProduct(false)
            setCallDocument(false)
            setCallChange(true)
        }
    }

    const handleSubmitSimulate = (type) => {

        let totalValue = getInputData(inputRef, 'C');
        if (totalValue.data.productListTab.items) setProdList(totalValue.data.productListTab.items)
        let productTabChange = totalValue.data.productListTab.dataNuberchange.isNotChange
        let productTabChangeLength = totalValue.data.productListTab.changeItem
        let overViewData = totalValue
        setOverViewData(overViewData)
        let typeSubmit = ''
        if (type == "submit") {
            typeSubmit = "1"
        }
        if (type == "simulate") {
            typeSubmit = "2"
        }
        if (type == "change") {
            typeSubmit = "3"
        }
        if (type == "delete") {
            typeSubmit = "TYPE_SUBMIT_CHANGE"
        }
        setTypeSubmit(typeSubmit)
        if (overViewData.changeField || overViewData.title) {
            if (productTabChange == true && productTabChangeLength == false) setTabChange(`Overview`)
            if (productTabChange == false || productTabChangeLength == true) setTabChange(`Overview/Product`)
        }
        if (productTabChange == false && !overViewData.changeField && !overViewData.title) setTabChange(`Product`)
        if (productTabChangeLength == true && !overViewData.changeField && !overViewData.title) setTabChange(`Product`)

        if (!overViewData.isInvalid || typeSubmit == "TYPE_SUBMIT_CHANGE") {
            setModalSave(true)
        }
    }

    const handleSave = (event) => {
        let dataMainSlectOrder = salesOrderReducer.saleOrderById
        setModalSave(event)
        let prodListNew = prodList.map((item) => {
            return {
                ...item, 
                shipCode: overViewData.data.overViewRef.shipPoint, 
                plantCode: overViewData.data.overViewRef.plantCode
            }
        })
        dispatch(updSaleOrderProduct(overViewData,dataMainSlectOrder[0].saleOrder, typeSubmit, prodListNew, tabChange))
        setTabChange('')
    }

    const handleCancel = () => {
        inputRef.current.overViewRef.resetValue()
        inputRef.current.productListTab.resetValue()
    };

    const onPressCloseSucsess = () => {
        setModalSaveSuccess(false)
        if(salesOrderReducer.saleOrderById){
            dispatch(getChange(salesOrderReducer.saleOrderById[0].saleOrder.orderId))  
        }
        if (salesOrderSelectInfoReducer.dataSelect.orderId != null) {
            let orderId = salesOrderSelectInfoReducer.dataSelect.orderId
            dispatch(getSaleOrderByOrderId(orderId))
        }
    };

    const handleNavScreenButton = (permObjCode) => {  
        let premissionScreen = listPermissionUser.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        if (premissionScreen) return true;
        if (!premissionScreen) return false;
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={{ marginHorizontal: '5%', marginTop: '3%' }}>
                <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>Sales Order</Text>
            </View>

            {/* {tabโชว์หน้า} */}
            <View></View>

            <View style={{ marginHorizontal: '5%', marginTop: '3%' }}>
                <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>Sales Order No. {salesOrderSelectInfoReducer.dataSelect.somOrderNo}</Text>
            </View>

            <Tabs locked
                onChangeTab={(item) => handleTabProduct(item)}
                tabBarUnderlineStyle={{ backgroundColor: colors.primary }}
                ref={(c) => { bottomTabRef = c; }}
                prerenderingSiblingsNumber = {1}
            >
                {/* <Tabs  initialPage={0} page={pageNum} onChangeTab={({ from, i }) => { this.setState({ pageNum: i }); this.bottomTabRef.goToPage(0); }}> */}
                    <Tab
                        heading={<TabHeading style={{ backgroundColor: colors.white }}><Text>Overview</Text></TabHeading>}
                    >
                    {
                        handleNavScreenButton('FE_SALEORD_S011') ?
                        <Overview ref={el => inputRef.current.overViewRef = el} isOverView={true}/>
                        :
                        <DontHavePermissionSaleOrder/>
                    }
                    </Tab>
                   
                    <Tab
                        heading={<TabHeading style={{ backgroundColor: colors.white }}><Text>Product</Text></TabHeading>}
                    >
                    {
                        handleNavScreenButton('FE_SALEORD_S012') ?
                            handleNavScreenButton('FE_SALEORD_S011') ?
                            <ProductSaleOrder ref={el => inputRef.current.productListTab = el} data = {saleCustSelect} callProduct = {callProduct}/>
                            :
                            <DontHavePermissionSaleOrder text = {"You don't have permission in Tab Overview / Invalid data."}/>
                        :
                        <DontHavePermissionSaleOrder/>
                    }
                    </Tab>
                   
                    <Tab
                        heading={<TabHeading style={{ backgroundColor: colors.white }}><Text>Document Flow</Text></TabHeading>}
                    >
                    {
                        handleNavScreenButton('FE_SALEORD_S013') ?
                        <DocumentFlow callDocument = {callDocument}/>
                        :
                        <DontHavePermissionSaleOrder/>
                    }
                    </Tab>
                 
                    <Tab
                        heading={<TabHeading style={{ backgroundColor: colors.white }}><Text>Changes</Text></TabHeading>}
                    >
                    {
                        handleNavScreenButton('FE_SALEORD_S014') ?
                        <ChangeSaleOrder callChange = {callChange}/>
                        :
                        <DontHavePermissionSaleOrder/>
                    }
                    </Tab>
                   
            </Tabs>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: '5%', marginVertical: '3%', flexWrap: 'wrap'}}>
                    <View style={{ padding: 5, width: '50%' }}>
                        <Button title={'Delete'} onPress={() => handleSubmitSimulate("delete")} />
                    </View>
                {
                    salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.quotationNo != '' ?
                    <View style={{ padding: 5, width: '50%' }}>
                        <Button title={'Cancel'} fontColor={'red'} color={colors.white} colorBorder={'red'} onPress={()=> navigation.navigate('SaleOrder')} />
                    </View>
                    :
                    <View style={{ padding: 5, width: '50%' }}>
                        <Button title={'Cancel'} fontColor={'red'} color={colors.white} colorBorder={'red'} onPress={handleCancel} />
                    </View>
                }
                {
                   salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '0'  && salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '' ?
                    <View style={{ width:170 }}>
                        <Button 
                            title={'Change Order'} 
                            color={colors.white}  
                            fontColor={colors.primary} 
                            onPress={() => handleSubmitSimulate("change")}
                        />
                    </View>
                    :
                    <View style={{ padding: 5, width: '50%' }}>
                        <Button 
                            title={'Submit Order'} 
                            color={colors.white} 
                            fontColor={colors.primary} 
                            onPress={() => handleSubmitSimulate("submit")} 
                            disabled={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapStatus != '' ? false : true}
                        />
                    </View>
                }
                 {
                   salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '0'  && salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '' ?
                    null
                    :
                    <View style={{ width: '50%' }}>
                        <View style={{ padding: 5, flex: 1/2 }}>
                            <Button title={'Simulate / Save'} onPress={() => handleSubmitSimulate("simulate")} />
                        </View>
                    </View>
                }
                {/* {
                    salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.quotationNo != '' ?
                        null
                    :
                    <View style={{ width: 170 }}>
                        <Button title={'Simulate / Save'} onPress={() => handleSubmitSimulate("simulate")} />
                    </View>

                } */}
            </View>
            <View style={{ flex: 0 }}>
                <ModalWarning
                    visible={modalTabProduct}
                    onlyCloseButton
                    onPressClose={() => setModalTabProduct(false)}
                    detailText={language.CANNOTSELECTTABPRODUCT}
                />
                <ModalWarning
                    visible={modalSave}
                    onPressConfirm={() => handleSave(false)}
                    onPressCancel={() => {
                        setModalSave(false)
                        setProdList(null)
                    }}
                    detailText={typeSubmit == "TYPE_SUBMIT_CHANGE" ? language.DELETE : language.CONFIRN}
                />
                <ModalWarning
                    visible={modalSaveSuccess}
                    onlyCloseButton
                    onPressClose={() => typeSubmit == "TYPE_SUBMIT_CHANGE" ? navigation.navigate('SaleOrder') : onPressCloseSucsess()}
                    detailText={typeSubmit == "TYPE_SUBMIT_CHANGE" ? language.DELETESUCCESS : salesOrderReducer.simulateSuccessMSG ? `${language.CONFIRNSUCCESS}\n\n${salesOrderReducer.simulateSuccessMSG}` : `${language.CONFIRNSUCCESS}`}
                />
                <ModalWarning
                    visible={modalSaveError}
                    onlyCloseButton
                    WARNINGTITLE
                    onPressClose={() => setModalSaveError(false)}
                    detailText={salesOrderReducer.simulateErrorMSG}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white

    }
});

export default EditSaleOrder;
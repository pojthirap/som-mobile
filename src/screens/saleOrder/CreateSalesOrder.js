import React, { useState, useRef, useEffect }  from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import { Text, Button, TextInput, PickerDate, SelectDropdown,TableSaleArea, ModalWarning } from '../../components';
import colors from '../../utility/colors';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import language from '../../language/th.json';
import { getInputData } from '../../utility/helper';
import { getCustomerForCreate, getDocType, getSaleArea, getShipTo, createSaleOrder, actionClear } from '../../actions/menuSalesOrderAction';


var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const CreateSalesOrder = () => {

    const navigation = useNavigation()
    const {salesOrderReducer,authReducer,getUserProfileReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    const [isCloseTable , setIsCloseTable ] = useState(true)
    const [isOpenTable , setIsOpenTable ] = useState(false)
    const [deliveryDate,setDeliveryDate] = useState()
    const [customer,setCustomer] = useState(null)
    const [docType, setDocType] = useState(null)
    const [shipTo,setShipTo] = useState('')
    const [saleAreaData,setSaleAreaData] = useState('')
    const [custSaleId,setCustSaleId] = useState('')
    const [currentPage, setCurrentPage] = useState('');
    const [modalCreateSuccess, setmodalCreateSuccess] = useState(false);
    const [modalCreateError, setmodalCreateError] = useState(false);
    const [modalAddVisible, setmodalAddVisible] = useState(false)
    const [shipToLengeOne, setShipToLengeOne] = useState([]);

    useEffect(() => {
        // if (salesOrderReducer.dataCusCreate_Loading) {
            dispatch(getCustomerForCreate()) 
        // }
        // if (salesOrderReducer.dataDocType_Loading) {
            dispatch(getDocType()) 
        // }
    }, [])

    useEffect(() => {
        if (salesOrderReducer.createdSaleOrderloadingSuccess) {
            setmodalAddVisible(false)
            setmodalCreateSuccess(true)    
        }
        if(salesOrderReducer.createdSaleOrderErrorMSG){
            setmodalCreateSuccess(false)
            setmodalAddVisible(false)
            setmodalCreateError(true)
        }
    }, [salesOrderReducer.createdSaleOrderloadingSuccess,salesOrderReducer.createdSaleOrderloadingError])

    useEffect(() => {
    if (custSaleId != '') {
        dispatch(getShipTo(custSaleId)) 
    }
    }, [custSaleId])

    useEffect(() => {
        setSaleAreaData('')
        setIsOpenTable(false)
        setIsCloseTable(true)
        setCustSaleId('')
        setShipTo('')
        setShipToLengeOne([])
    }, [customer])

    useEffect(() => {
        if(salesOrderReducer.dataShipTo.length == 1) {
            setShipToLengeOne(salesOrderReducer.dataShipTo)
        }
    },[salesOrderReducer.dataShipTo])

    const onPressClose = () =>{
        setIsCloseTable(false)
        setIsOpenTable(true)
        if (customer) {
            setCurrentPage(1)
            dispatch(getSaleArea(customer.custCode)) 
        }
    }

    const onPressOpen = (item) =>{
        if(item){
            setSaleAreaData(item)
            setCustSaleId(item.custSaleId)
        }
        setIsCloseTable(true)
        setIsOpenTable(false)
    }

    const onPressCloseButton = () =>{
        setIsOpenTable(false)
        setIsCloseTable(true)
    }

    const onPressPage = (page) => {
        if (!page) return
        setCurrentPage(page)
        return dispatch(getSaleArea(customer.custCode,page))
    }

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef);
        if (!totalValue.isInvalid) {
            setmodalAddVisible(true)     
        }
    }

    const onPressSave = () =>{
        let totalValue = getInputData(inputRef);
        setmodalAddVisible(false)
        dispatch(createSaleOrder(totalValue.data,custSaleId,saleAreaData,shipTo.custCode))
    }

    const onPressError = (event) => {
        setmodalCreateError(event)
    }

    const onPressConfirmSuccess = (even) => {
        setmodalCreateSuccess(even)
        navigation.navigate('SaleOrder')
    }

    const onCloseCreate = () =>{
        setmodalAddVisible(false)
        setmodalCreateSuccess(false)
        setmodalCreateError(false)
        navigation.navigate('SaleOrder')
    }

    const onPressConfirm = (even) => {
        setmodalAddVisible(even)
    }

    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.alertTitle}>
                    <Text style={{color: colors.white,paddingHorizontal: '3%',paddingVertical: '3%',fontWeight:'bold',fontSize:FONT_SIZE.SUBTITLE}}>Create Sales Order</Text>
                    {/* <TouchableOpacity onPress={() => onCloseCreate()} style={{marginHorizontal: 15, justifyContent:'center'}}>
                        <Icon type="MaterialCommunityIcons" name="close"  style={{color:colors.white, fontSize:45}}/>
                    </TouchableOpacity> */}
                </View>
                <View>
                    <View style={{marginHorizontal:'5%', paddingBottom:'5%', paddingTop:'5%'}}>
                        <View style={{flex: 1/2}}>
                            <SelectDropdown
                                dataList={salesOrderReducer.dataDocType}
                                titleDropdown={'Document Type'} 
                                titleAlert={"Document Type"}
                                defaultValue={docType && docType.docTypeCode ? docType.docTypeCode : null}
                                onPress={(item)=> setDocType(item)}
                                valueKey={"docTypeCode"}
                                titleKey={"label"}
                                require 
                                REQUIRETITLE
                                massageError={language.DOCTYPE}
                                ref={el => inputRef.current.docTypeCode = el}
                            />
                        </View>
                        <View style={{flex: 1/2}}>
                            <SelectDropdown 
                                dataList={salesOrderReducer.dataCusCreate}
                                titleDropdown={"Customer Name"}
                                titleAlert={"Customer Name"}
                                onPress={(item)=> setCustomer(item)}
                                defaultValue={customer && customer.custCode ? customer.custCode : null}
                                valueKey={"custCode"}
                                titleKey={"codeNameLabel"}
                                ref={el => inputRef.current.custCode = el}
                                require
                                REQUIRETITLE
                                massageError={'กรุณาเลือก Customer Name'}
                            />
                        </View>
                    </View>

                    {
                        isOpenTable && salesOrderReducer.dataSaleArea ?
                        <View>
                            <View style={{paddingBottom:'5%'}}>
                                <TableSaleArea 
                                    data={salesOrderReducer.dataSaleArea.records}
                                    recordDetail={salesOrderReducer.dataSaleArea}
                                    currentPage={currentPage}
                                    onPressPage={onPressPage}
                                    onPressSelectButton ={(data) => onPressOpen(data)} 
                                />
                            </View>
                            <View style={{width:'40%', marginHorizontal:'5%', alignSelf:'flex-end'}}>
                                <Button
                                    title={'Close'}
                                    onPress = {()=> onPressCloseButton()}
                                />
                            </View>
                        </View>
                        :
                        isCloseTable ?
                            <View style={{marginHorizontal:'5%'}}>
                                <View style={{flexDirection:'row'}}>
                                    <Text>Sale Organization :  </Text>
                                    <Text style={{fontWeight:'bold'}}>{saleAreaData && saleAreaData.orgNameTh ? saleAreaData.orgNameTh : '-'} </Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text>Distribution Channel :  </Text>
                                    <Text style={{fontWeight:'bold'}}>{saleAreaData && saleAreaData.channelNameTh ? saleAreaData.channelNameTh : '-'} </Text>
                                </View>
                                <View style={{flexDirection:'row',marginBottom:'5%'}}>
                                    <Text>Division :  </Text>
                                    <Text style={{fontWeight:'bold'}}>{saleAreaData && saleAreaData.divisionNameTh ? saleAreaData.divisionNameTh : '-'}</Text>
                                </View>
                                <Button
                                    title={'Select Sale Area'}
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                    width={'50%'}
                                    disabled={ customer != null ? false : true }
                                    onPress={ () => onPressClose()} 
                                />
                            </View>
                            :
                            null
                    }
                             
                    <View style={{marginHorizontal:'5%'}}>
                        <View style={{flex: 1/2, marginTop: '3%'}}>
                            <SelectDropdown
                                dataList={salesOrderReducer.dataShipTo}
                                titleDropdown={'Ship to'} 
                                titleAlert={'Ship to'}
                                disabled={customer != '' && saleAreaData != '' && salesOrderReducer.dataShipTo && salesOrderReducer.dataShipTo.length !=  0 ? false : true}
                                valueKey={'custPartnerId'}
                                titleKey={"label"}
                                defaultValue={customer != '' && saleAreaData != '' && shipToLengeOne && shipToLengeOne.length == 1 ? shipToLengeOne[0].custPartnerId : shipTo && shipTo.custPartnerId ? shipTo.custPartnerId : null}
                                onPress={(item)=> setShipTo(item)}
                                ref={el => inputRef.current.custPartnerId = el}
                                require
                                REQUIRETITLE
                                massageError={'กรุณาเลือก Ship to'}
                            />
                        </View>
                        <View style={{flex: 1/2, marginTop: '3%'}}>
                            <TextInput
                                title={'Description'} 
                                ref={el => inputRef.current.description = el}
                                isOnlyText = {true}
                            />
                        </View>
                    </View>

                    <View style={{marginHorizontal:'5%'}}>
                        <View style={{flex: 1/2, marginTop: '3%'}}>
                            <PickerDate
                                title={'Request Delivery Date'} 
                                DateBoxWidth={'80%'}
                                dateValue={deliveryDate} 
                                ref={el => inputRef.current.deliveryDate = el}  
                                markDate={deliveryDate ? deliveryDate : new Date()} 
                                onChange={(date)=>setDeliveryDate(date)}  
                                minDate={new Date()} 
                                require
                                REQUIRETITLE
                                massageError={'กรุณาเลือก Request Delivery Date'}
                               />
                        </View>
                        {/* {DatePicker} */}
                        <View style={{flex: 1/2, marginTop: '3%'}}>
                            <Text style={{fontWeight:'bold'}}>Sales Rep</Text>
                            <View style={{marginTop:'2%'}}>
                                <Text>  
                                    {getUserProfileReducer.dataUserProfile ? 
                                        getUserProfileReducer.dataUserProfile.userProfileCustom.data[0].titleName != null  ? 
                                            `${getUserProfileReducer.dataUserProfile.userProfileCustom.data[0].titleName} ${getUserProfileReducer.dataUserProfile.userProfileCustom.data[0].firstName} ${getUserProfileReducer.dataUserProfile.userProfileCustom.data[0].lastName}` 
                                            :
                                            `${getUserProfileReducer.dataUserProfile.userProfileCustom.data[0].firstName} ${getUserProfileReducer.dataUserProfile.userProfileCustom.data[0].lastName}`
                                        : 
                                        '-'
                                    }
                                </Text>     
                            </View>
                        </View>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%', marginTop: '3%'}}>
                        <View style={{flex: 1/2}}>
                            <Text style={{fontWeight:'bold'}}>Sales Group</Text>
                            <View style={{marginTop:8}}>
                                <Text>
                                    {getUserProfileReducer.dataUserProfile && getUserProfileReducer.dataUserProfile.saleGroupSaleOfficeCustom != null ?
                                        getUserProfileReducer.dataUserProfile.saleGroupSaleOfficeCustom.data[0].descriptionTh ? 
                                            getUserProfileReducer.dataUserProfile.saleGroupSaleOfficeCustom.data[0].descriptionTh 
                                            : '-'
                                        : '-'
                                    }
                                </Text>     
                            </View>
                        </View>
                        <View style={{flex: 1/2}}>
                        <Text style={{fontWeight:'bold'}}>Territory</Text>
                            <View style={{marginTop:8}}>
                                <Text>
                                    {getUserProfileReducer.dataUserProfile && getUserProfileReducer.dataUserProfile.saleGroupSaleOfficeCustom != null ?
                                        getUserProfileReducer.dataUserProfile.saleGroupSaleOfficeCustom.data[0].territoryNameTh ? 
                                            getUserProfileReducer.dataUserProfile.saleGroupSaleOfficeCustom.data[0].territoryNameTh 
                                            : '-'
                                        : '-'
                                    }
                                </Text>     
                            </View>
                        </View>
                    </View>

                    <View style={{marginHorizontal:'5%'}}>
                        <View style={{flex: 1/2, marginTop: '3%'}}>
                            <TextInput
                                title={'Contact Person'} 
                                ref={el => inputRef.current.contactPerson = el}
                                isOnlyText = {true}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1,marginHorizontal:'5%',marginTop: '3%'}}>
                        <TextInput
                            title={'หมายเหตุ'}
                            maxLength={150}
                            ref={el => inputRef.current.remark = el}
                            heightBox = {STYLE_SIZE.BNT_HEIGTH*3}
                            multiline = {true}
                            isOnlyText = {true}
                        />
                    </View>

                    <View style={{flexDirection:'row',marginHorizontal:'5%',marginTop:'15%', marginBottom:'10%',justifyContent:'space-between'}}>
                        <View style={{flex: 1,alignItems:'center'}}>
                            <Button
                                width={'70%'}
                                title={'Cancel'} 
                                onPress={() => onCloseCreate()}
                                fontColor={colors.primary}
                                color={colors.white}
                            />
                        </View>
                        <View style={{flex: 1,alignItems:'center'}}>
                        <Button
                            width={'70%'}
                            title={'Save'} 
                            onPress={handleSubmit}
                        />
                        </View>
                    </View>
                    
                </View>
            </ScrollView>
            <ModalWarning
                visible={modalAddVisible}
                detailText={language.CONFIRN}
                onPressConfirm={()=> onPressSave()}
                onPressCancel={()=> onPressConfirm(false)}
            />
            <ModalWarning
                visible={modalCreateSuccess}
                onlyCloseButton
                onPressClose={()=>onPressConfirmSuccess()}
                detailText={language.ADDSUCCESS}
            />
            <ModalWarning
                visible={modalCreateError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={salesOrderReducer.createdSaleOrderErrorMSG}
            />
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    alertTitle: {
        backgroundColor: colors.primary,
        width: "100%",
        paddingHorizontal: '3%',
        paddingVertical: '3%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})

export default CreateSalesOrder;
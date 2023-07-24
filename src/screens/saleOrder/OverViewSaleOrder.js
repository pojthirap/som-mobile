import React, { useState, useRef, useEffect,forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { Icon }  from 'native-base'

import colors from '../../utility/colors';
import { Text, TextInput, SelectDropdown, Button,PickerDate,TableSaleArea, ModalWarning } from '../../components'
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import { getOrderReason,getCompany } from '../../actions/menuSalesOrderAction';
import language from '../../language/th.json';
import { getInputData, resetInputData } from '../../utility/helper';
import { getCustomerForCreate, getDocType, getSaleArea, getShipTo, getPlant, getShipPoint, getIcoterm, getNotifyTabOverview } from '../../actions/menuSalesOrderAction';
import dayjs from 'dayjs';

const OverViewSaleOrder = ({},ref) => {

    const { salesOrderSelectInfoReducer, salesOrderReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    const [company,setCompany] = useState('')
    const [dataSelect, setDataSelect] = useState('')
    const [plant,setPlant] = useState('')
    const [shipPoint , setShipPoint] = useState('')
    const [shipTo,setShipTo] = useState('')
    const [custSaleId,setCustSaleId] = useState('')
    const [customer,setCustomer] = useState('')
    const [delDtm,setDelDtm] = useState('')
    const [selectDocType, setSelectDocType] = useState('')
    const [currentPage, setCurrentPage] = useState('');
    const [isCloseTable , setIsCloseTable ] = useState(true)
    const [isOpenTable , setIsOpenTable ] = useState(false)
    const [currentSaleArea, setCurrentSaleArea] = useState('');
    const [orgCode,setOrgCode] = useState('')
    const [channelCode,setChannelCode] = useState('')
    const [divisionCode,setDivisionCode] = useState('')
    const [saleAreaData,setSaleAreaData] = useState('')
    const [currentOrgNameTh,setCurrentOrgNameTh] = useState('')
    const [currentChannelNameTh,setCurrentChannelNameTh] = useState('')
    const [currentDivisionNameTh,setCurrentDivisionNameTh] = useState('')
    const [custPartnerId,setCustPartnerId] = useState('')
    const [isQuaNo,setQuaNo] = useState(false)
    const [dataPriceList, setDataPriceList] = useState([
        { priceList: 'Z1', title: 'Z1 : Wholesale' },
    ])
    const [shippingConditions, setShippingConditions] = useState('');
    const [modalPlantError, setModalPlantError] = useState(false);

    useEffect(() => {
        if (salesOrderReducer.dataDocType_Loading) {
            dispatch(getDocType()) 
        }
        if (salesOrderReducer.dataCusCreate_Loading) {
            dispatch(getCustomerForCreate()) 
        }
        if(salesOrderReducer.orderReasonData_Loading){
            dispatch(getOrderReason())
        }
        if(salesOrderReducer.incotermData_Loading){
            dispatch(getIcoterm())
        }
        if (salesOrderSelectInfoReducer.dataSelect.orderId != null) {
            let orderId = salesOrderSelectInfoReducer.dataSelect.orderId
            dispatch(getNotifyTabOverview(orderId))
        }

    },[])

    useEffect(()=>{
        if(salesOrderReducer.saleOrderById){
            dispatch(getSaleArea(salesOrderReducer.saleOrderById[0].saleOrder.custCode))
            dispatch(getCompany(salesOrderReducer.saleOrderById[0].saleOrder.custCode))
            dispatch(getShipTo(salesOrderReducer.saleOrderById[0].saleOrder.custSaleId))
        }
    },[salesOrderReducer.saleOrderById])

    useEffect(() => {
        if(salesOrderReducer.saleOrderById){
            // let custSale = salesOrderReducer.saleOrderById[0].saleOrder.custSaleId
            setDataSelect(salesOrderReducer.saleOrderById[0].saleOrder)
            // if(custSale != custSaleId) {
            //     setCustSaleId(salesOrderReducer.saleOrderById[0].saleOrder.custSaleId)
            //     dispatch(getShipTo(salesOrderReducer.saleOrderById[0].saleOrder.custSaleId))
            // }
            // setCustSaleId(salesOrderReducer.saleOrderById[0].saleOrder.custSaleId)
            setCustSaleId(salesOrderReducer.saleOrderById[0].saleOrder.custSaleId)
            setOrgCode(salesOrderReducer.saleOrderById[0].saleOrder.orgCode)
            setChannelCode(salesOrderReducer.saleOrderById[0].saleOrder.channelCode)
            setDivisionCode(salesOrderReducer.saleOrderById[0].saleOrder.divisionCode)
            setDelDtm(salesOrderReducer.saleOrderById[0].saleOrder.deliveryDte)
            setCurrentOrgNameTh(salesOrderReducer.saleOrderById[0].saleOrder.orgNameTh)
            setCurrentChannelNameTh(salesOrderReducer.saleOrderById[0].saleOrder.channelNameTh)
            setCurrentDivisionNameTh(salesOrderReducer.saleOrderById[0].saleOrder.divisionNameTh)
            setPlant(salesOrderReducer.saleOrderById[0].saleOrder.plantCode)
            setCompany(salesOrderReducer.saleOrderById[0].saleOrder.companyCode)
            setShipPoint(salesOrderReducer.saleOrderById[0].saleOrder.shipCode)
            setSelectDocType(salesOrderReducer.saleOrderById[0].saleOrder.docTypeCode)
            setShipTo(salesOrderReducer.saleOrderById[0].saleOrder.shipToCustCode)
            setCustPartnerId(salesOrderReducer.saleOrderById[0].saleOrder.shipToCustPartnerId)
            setShippingConditions(salesOrderReducer.saleOrderById[0].saleOrder.shippingCond)
        }
        if( salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.quotationNo != ''){
            setQuaNo(true)
        }
    },[salesOrderReducer.saleOrderById])

    useEffect(() => {
        if(salesOrderReducer.dataSaleArea){
            findSaleArea()
        }
    }, [salesOrderReducer.dataSaleArea])

    useEffect(() => {
        if (custSaleId) {
            dispatch(getShipTo(custSaleId)) 
        }
    }, [custSaleId])

    useEffect(() => {
        if(saleAreaData != ''){
            inputRef.current.shipToCustCode.clear()
            setOrgCode(saleAreaData.orgCode)
            setChannelCode(saleAreaData.channelCode)
            setDivisionCode(saleAreaData.divisionCode)
            setShippingConditions(saleAreaData.shippingCond)
        }
    }, [saleAreaData])
        
    useEffect(() => {
        setPlant('')
        if (company != '' && company.companyCode != '' && company.companyCode != undefined) {
            dispatch(getPlant(company.companyCode)) 
        }
        if(company != '' && company.companyCode == undefined){
            dispatch(getPlant(company)) 
        }
    }, [company])

    useEffect(() => {
        if (plant != '' && plant.plant != '' && plant.plant != undefined) {
        // if (plant != '' && plant.plant != '' && plant.plant != undefined) {
            dispatch(getShipPoint(plant.plant, shippingConditions)) 
        }
        if(plant != '' && plant.plant == undefined){
        // if(plant != '' && plant.plant == undefined){
            dispatch(getShipPoint(plant, shippingConditions)) 
        }
    }, [plant, shippingConditions])

    useEffect(() => {
        if (salesOrderReducer.plantDataloadingSuccess && salesOrderReducer.plantDataloadingError) {
            setModalPlantError(true)
        }
    }, [salesOrderReducer.plantDataloadingSuccess, salesOrderReducer.plantDataloadingError])

    useEffect(() => {
        if (salesOrderReducer.shipPointDataloadingSuccess && salesOrderReducer.shipPointDataloadingError) {
            setModalPlantError(true)
        }
    }, [salesOrderReducer.shipPointDataloadingSuccess, salesOrderReducer.shipPointDataloadingError])

    const onPressPage = (page) => {
        if (!page) return
        setCurrentPage(page)
        return dispatch(getSaleArea(customer.custCode,page))
    };

    const onPressCloseButton = () =>{
        setIsOpenTable(false)
        setIsCloseTable(true)
    };

    const onPressOpen = (item) =>{
        if(item){
            setSaleAreaData(item)
            setCustSaleId(item.custSaleId)
        }
        setIsCloseTable(true)
        setIsOpenTable(false)
    };

    const onPressClose = () =>{
        setIsCloseTable(false)
        setIsOpenTable(true)
        if (customer) {
            setCurrentPage(1)
            dispatch(getSaleArea(customer.custCode)) 
        }
    };

    const findSaleArea = () =>{
        let saleArea = salesOrderReducer.dataSaleArea.records.find((item)=>{
            return  dataSelect.custSaleId == item.custSaleId 
        })
        setCurrentSaleArea(saleArea)
    };

    const onSelectShipTo =(item) =>{
        setShipTo(item.custCode)
        setCustPartnerId(item.custPartnerId)

    };

    useImperativeHandle(ref, () => ({
        getInputValue(){
            let totalValue = getInputData(inputRef, 'C');
            return { isInvalid: totalValue.isInvalid, value:{...totalValue.data, custSaleId:custSaleId, orgCode:orgCode,channelCode:channelCode,divisionCode:divisionCode,shipToCustPartnerId: shipTo.custPartnerId ? shipTo.custPartnerId : custPartnerId }, isChange: !totalValue.isNotChange, title: totalValue.changeField };
        },
        resetValue(){
            resetInputData(inputRef);
            setDelDtm('')
            setSaleAreaData('')
        }
    }));
    
    function formatNumber(num) {
        return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    };

    function formatFullDateTime(date) {
        let dateObj = dayjs(date, 'DD/MM/YYYY HH:mm:ss');
        let dateStr = dateObj.format('DD/MM') + "/" + (dateObj.year() + 543).toString() + " " + dateObj.format('HH:mm:ss');

        return dateStr;
    };

    return(
        <View style={styles.container}>        
            <ScrollView
                nestedScrollEnabled
            >
                {/* {Notification} */}
                <View style={[styles.styleShadow,{flex:1,backgroundColor:'white',margin:'5%', height:300, borderRadius:20}]}>
                    <ScrollView
                        nestedScrollEnabled
                    >
                        <View style={{paddingHorizontal:'5%',paddingTop:'5%',paddingBottom:'3%',flexDirection:'row'}}>
                            <View style={{justifyContent:'center',paddingRight:'3%'}}>
                                <Icon  type="FontAwesome" name="bell" style={{ color: colors.primary, fontSize: FONT_SIZE.TEXT }}/>
                            </View>
                            <View style={{justifyContent:'center'}}>
                                <Text style={{color:colors.primary, fontSize: FONT_SIZE.TEXT}}>Notification</Text>
                            </View> 
                        </View>
                        <View style={{paddingHorizontal:65}}>
                            <FlatList 
                                data={salesOrderReducer.notifyOverviewData}
                                renderItem={(data, index)=> {
                                    return (
                                        <View>
                                            <Text style={{color: data.index % 2 == 0 ? colors.black : colors.primary, marginBottom: 5}}>
                                                {`${data.item.orderActionName} : `}{data.item.somOrderNo? `${data.item.somOrderNo} / ` : '- / '}{data.item.sapOrderNo? `${data.item.sapOrderNo} : ` : '- : '}{data.item.createDtm? `${formatFullDateTime(data.item.createDtm)} : ` : '- : '}{data.item.sapStatus == "S"? `Success : ` : 'Fail : '}{`${data.item.sapMsg}`}
                                            </Text>                                         
                                        </View>
                                    )                         
                                }}
                            />
                        </View>
                    </ScrollView>
                </View>

                <View style={{marginHorizontal: '5%',marginBottom:'3%'}}>
                    <Text style={{fontSize:FONT_SIZE.TEXT,fontWeight:'bold'}}>ข้อความจาก SAP</Text>
                </View>

                <View style={{marginHorizontal: '5%'}}>
                    <View style={{flex: 1/2, paddingBottom:'3%'}}>
                        <View>
                        <SelectDropdown
                                dataList={salesOrderReducer.dataDocType}
                                titleDropdown={'Document Type'} 
                                titleAlert={"Document Type"}
                                defaultValue={
                                    salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.docTypeCode ? 
                                    salesOrderReducer.saleOrderById[0].saleOrder.docTypeCode
                                        : 
                                        ''
                                }
                                onPress={(item)=> setSelectDocType(item)}
                                require
                                REQUIRETITLE
                                massageError={language.DOCTYPE}
                                valueKey={"docTypeCode"}
                                titleKey={"label"}
                                ref={el => inputRef.current.docTypeCode = el}
                                disabled = {salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '0'  && salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '' ? true : false}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1/2, paddingBottom:'3%'}}>
                        <SelectDropdown 
                                dataList={salesOrderReducer.dataCusCreate}
                                titleDropdown={"Customer Name"}
                                titleAlert={"Customer Name"}
                                onPress={(item)=> setCustomer(item)}
                                disabled={true}
                                defaultValue={
                                    salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.custCode ? 
                                    salesOrderReducer.saleOrderById[0].saleOrder.custCode
                                        : 
                                        ''
                                }
                                require
                                REQUIRETITLE
                                massageError={'กรุณาเลือก Customer Name'}
                                valueKey={"custCode"}
                                // titleKey={"label"}
                                titleKey={"codeNameLabel"}
                                ref={el => inputRef.current.custCode = el}
                            />
                    </View>                    
                </View>
                {
                        isOpenTable && salesOrderReducer.dataSaleArea ?
                        <View>
                            <View style={{paddingBottom:'3%'}}>
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
                                    <Text style={{fontWeight:'bold'}}>{
                                        saleAreaData && saleAreaData.orgNameTh ? saleAreaData.orgNameTh : currentOrgNameTh != '' ? currentOrgNameTh :  '-'
                                    } </Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text>Distribution Channel :  </Text>
                                    <Text style={{fontWeight:'bold'}}>{
                                        saleAreaData && saleAreaData.channelNameTh ? saleAreaData.channelNameTh : currentChannelNameTh != '' ? currentChannelNameTh :  '-'
                                    } </Text>
                                </View>
                                <View style={{flexDirection:'row',marginBottom:'5%'}}>
                                    <Text>Division :  </Text>
                                    <Text style={{fontWeight:'bold'}}>{
                                        saleAreaData && saleAreaData.divisionNameTh ? saleAreaData.divisionNameTh : currentDivisionNameTh != '' ? currentDivisionNameTh :  '-'
                                    }</Text>
                                </View>
                                {
                                    isQuaNo === true ? 
                                    null
                                    :
                                    <Button
                                        title={'Select Sale Area'}
                                        buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                        width={'50%'}
                                        disabled={ salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '0'  && salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo != '' ? true : customer != '' ? false : true }
                                        onPress={ () => onPressClose()} 
                                    />
                                }
                            </View>
                            :
                            null
                }
                <View style={{marginHorizontal: '5%',paddingTop:'3%'}}>
                    <View style={{flex: 1/2, paddingBottom:'5%'}}>
                        <SelectDropdown
                                dataList={dataPriceList}
                                titleDropdown={'Price List'} 
                                titleAlert={'Price List'}
                                disabled={channelCode && channelCode == '30' ? false : true}
                                valueKey={'priceList'}
                                titleKey={"title"}
                                defaultValue={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.priceList ? salesOrderReducer.saleOrderById[0].saleOrder.priceList : ''}
                                ref={el => inputRef.current.priceList = el}
                                placeholder={isQuaNo === true ? '-' : ''}
                            />
                    </View>    
                    <View style={{flex: 1/2, justifyContent: 'flex-end',  paddingBottom:'3%'}}>
                         <Button
                            title={'Clear Price List'}
                            buttonHeigth={50}
                            width={'50%'}
                            disabled={ customer != '' ? false : true }
                            onPress={ () => inputRef.current.priceList.clear()} 
                            color={colors.grayButton}
                            colorBorder={colors.grayButton}
                        />
                    </View>             
                </View>
                <View style={{marginHorizontal: '5%', paddingTop:'3%'}}>
                    <View style={{flex: 1/2, paddingBottom:'3%'}}>
                        <SelectDropdown
                                dataList={salesOrderReducer.dataShipTo}
                                titleDropdown={'Ship to'} 
                                titleAlert={'Ship to'}
                                disabled={isQuaNo === true ?  true : salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.shipToCustCode ? false : customer != '' && saleAreaData != '' && salesOrderReducer.dataShipTo && salesOrderReducer.dataShipTo.length !=  0 ? false : true}
                                valueKey={'custCode'}
                                titleKey={"label"}
                                // defaultValue={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.custCode ? salesOrderReducer.saleOrderById[0].saleOrder.custCode : salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.shipToCustCode ? salesOrderReducer.saleOrderById[0].saleOrder.shipToCustCode : ''}
                                defaultValue={salesOrderReducer.dataShipTo && salesOrderReducer.dataShipTo.length == 1 ? salesOrderReducer.dataShipTo[0].custCode : salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.shipToCustCode ? salesOrderReducer.saleOrderById[0].saleOrder.shipToCustCode : ''}
                                onPress={(item)=> onSelectShipTo(item)}
                                ref={el => inputRef.current.shipToCustCode = el}
                                placeholder={isQuaNo === true ? '-' : ''}
                                require
                                REQUIRETITLE
                                massageError={'กรุณาเลือก Ship to'}
                            />
                    </View>
                    <View style={{flex: 1/2, paddingBottom:'3%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text  style={{fontWeight:'bold'}}>Sales Order (SAP)</Text>
                        </View>
                        <View>
                            <Text >{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo ? salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo : '-'}</Text>
                        </View>
                    </View>                    
                </View>

                <View style={{marginHorizontal: '5%'}}>
                    <View style={{flex: 1/2, paddingBottom: '3%'}}>
                        <TextInput
                            editable = {isQuaNo === true ? false:true}
                            placeholder={isQuaNo === true ? '-' : ''}
                            title={'Description'} 
                            isOnlyText = {true}
                            ref={el => inputRef.current.description = el} 
                            value={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.description ? salesOrderReducer.saleOrderById[0].saleOrder.description : ''}
                        />
                    </View>
                    {/* {DatePicker} */}
                    <View style={{flex: 1/2, paddingBottom: '3%'}}>
                        <PickerDate
                            title={'Reguest Delivery Date'}  
                            DateBoxWidth={'80%'}
                            dateValue={delDtm ? delDtm : salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.deliveryDte ? salesOrderReducer.saleOrderById[0].saleOrder.deliveryDte : ''}
                            minDate={new Date()}
                            markDate={delDtm ? delDtm : salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.deliveryDte ? salesOrderReducer.saleOrderById[0].saleOrder.deliveryDte: new Date()} 
                            onChange={(date) => setDelDtm(date)}
                            ref={el => inputRef.current.delDtm = el}
                            disabled={isQuaNo === true ? true : false}
                            require
                            REQUIRETITLE
                            massageError={'กรุณาเลือก Reguest Delivery Date'}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%', paddingBottom:'3%', flex: 1}}>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom: '2%'}}>
                            <Text  style={{fontWeight:'bold'}}>Sales Rep</Text>
                        </View>
                        <View>
                            <Text >{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.saleRep ? salesOrderReducer.saleOrderById[0].saleOrder.saleRep : '-'}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom: '2%'}}>
                            <Text style={{fontWeight:'bold'}} >Sales Group</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.groupDescTh ? salesOrderReducer.saleOrderById[0].saleOrder.groupDescTh : '-'}</Text>
                        </View>
                    </View>                    
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%', paddingBottom:'3%'}}>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text  style={{fontWeight:'bold'}} >Territory</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.territory ? salesOrderReducer.saleOrderById[0].saleOrder.territory : '-'}</Text>
                        </View>
                    </View>         
                </View>

                <View style={{marginHorizontal: '5%'}}>
                    <View style={{flex: 1/2, paddingBottom: '3%'}}>
                        <TextInput
                            placeholder={''}
                            editable = {true}
                            title={'PO Number'} 
                            maxLength={35}
                            isOnlyText = {true}
                            ref={el => inputRef.current.poNo = el} 
                            value={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.poNo ? salesOrderReducer.saleOrderById[0].saleOrder.poNo : ''}
                        />
                    </View>
                    <View style={{flex: 1/2, paddingBottom: '3%'}}>
                        <TextInput
                            placeholder={isQuaNo === true ? '-' : ''}
                            editable = {isQuaNo === true ? false:true}
                            title={'Contact person'} 
                            isOnlyText = {true}
                            ref={el => inputRef.current.contactPerson = el} 
                            value={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.contactPerson ? salesOrderReducer.saleOrderById[0].saleOrder.contactPerson : ''}
                        />
                    </View>                    
                </View>

                <View style={{justifyContent:'space-between', marginHorizontal: '5%',paddingBottom:'3%'}}>
                    <View style={{flex: 1}}>
                        <TextInput
                            placeholder={isQuaNo === true ? '-' : ''}
                            editable = {isQuaNo === true ? false:true}
                            title={'หมายเหตุ'}  
                            isOnlyText = {true}
                            maxLength={150}
                            heightBox = {STYLE_SIZE.BNT_HEIGTH*3}
                            multiline = {true}
                            ref={el => inputRef.current.remark = el} 
                            value={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.remark ? salesOrderReducer.saleOrderById[0].saleOrder.remark : ''}
                        />
                    </View>
                </View>
                <View style={{marginHorizontal: '5%',paddingBottom:'3%'}}>
                    <View style={{flex: 1/2}}>
                        <SelectDropdown
                                placeholder={isQuaNo === true ? '-' : ''}
                                titleDropdown={'Order Reason'}
                                titleAlert={"Order Reason"}
                                dataList={salesOrderReducer.orderReasonData}
                                defaultValue={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.reasonCode ? salesOrderReducer.saleOrderById[0].saleOrder.reasonCode : ''}
                                titleKey={'reasonNameTh'}
                                valueKey={'reasonCode'}
                                ref={el => inputRef.current.reasonCode = el}
                                disabled={isQuaNo === true ? true : false}
                                require={selectDocType == "ZSO8" ? true : selectDocType.docTypeCode == "ZSO8" ? true : false}
                                massageError={selectDocType == "ZSO8" ? "กรุณาเลือก Order Reason" : selectDocType.docTypeCode == "ZSO8" ? "กรุณาเลือก Order Reason" : ''}
                                REQUIRETITLE={selectDocType == "ZSO8" ? true : selectDocType.docTypeCode == "ZSO8" ? true : false}
                            />
                    </View>
                    <View style={{flex: 1/2}}>
                    </View>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%',paddingBottom:'3%'}}>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom: '2%'}}>
                            <Text  style={{fontWeight:'bold'}}>Message</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.sapMsg ? salesOrderReducer.saleOrderById[0].saleOrder.sapMsg: '-'}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View>
                            <View style={{paddingBottom:'2%'}}>
                                <Text style={{fontWeight:'bold'}}>Credit Status</Text>
                            </View>
                            <View>
                                <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.creditStatus ? salesOrderReducer.saleOrderById[0].saleOrder.creditStatus: '-'}</Text>
                            </View>
                        </View>
                    </View>  
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%', paddingBottom:'3%'}}>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text  style={{fontWeight:'bold'}} >Reason for Rejection</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.reasonReject ? salesOrderReducer.saleOrderById[0].saleOrder.reasonReject: '-'}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text style={{fontWeight:'bold'}} >Net Value by SO (ex VAT)</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.netValue ? formatNumber(salesOrderReducer.saleOrderById[0].saleOrder.netValue): '-'}</Text>
                        </View>                    
                    </View>                    
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%', paddingBottom:'3%'}}>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text style={{fontWeight:'bold'}}>Tax Amount by SO</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.tax ? formatNumber(salesOrderReducer.saleOrderById[0].saleOrder.tax): '-'}</Text>
                        </View>                    
                    </View>  
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text style={{fontWeight:'bold'}}>Total Net Value by SO (inc VAT)</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.total ? formatNumber(salesOrderReducer.saleOrderById[0].saleOrder.total): '-'}</Text>
                        </View>                    
                    </View>                    
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%',paddingBottom:'3%', flex: 1}}>
                    <View style={{flex: 1/2, paddingRight: '2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text style={{fontWeight:'bold'}}>Payment Terms</Text>
                        </View>
                        <View>
                            <Text >{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.paymentTerm ? salesOrderReducer.saleOrderById[0].saleOrder.paymentTerm  : '-'}</Text>
                        </View>
                    </View>
                </View>
                <View style={{marginHorizontal: '5%',paddingBottom:'3%'}}>
                    <View style={{flex: 1/2}}>
                        <SelectDropdown
                            titleDropdown={'Incoterms'}  
                            titleAlert={"Incoterms"}
                            dataList={salesOrderReducer.incotermData}
                            titleKey={'label'}
                            valueKey={'incotermCode'}
                            require
                            REQUIRETITLE
                            massageError={'กรุณาเลือก Incoterms'}
                            placeholder={isQuaNo === true ? '-' : ''}
                            disabled={isQuaNo === true ? true : false}
                            ref={el => inputRef.current.incoterm = el}
                            defaultValue={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.incoterm ? salesOrderReducer.saleOrderById[0].saleOrder.incoterm : ''}
                        />
                    </View>
                </View>

                <View style={{marginHorizontal: '5%',paddingBottom:'3%'}}>
                    <View style={{flex: 1/2, paddingBottom:'3%'}}>
                        <SelectDropdown
                            NotFillter={true}
                            titleDropdown={'Company'}
                            titleAlert={"Company"}
                            // dataList={salesOrderReducer.companyData.records}
                            // titleKey={'companyNameTh'}
                            dataList={salesOrderReducer.companyData}
                            titleKey={'codeNameLabel'}
                            valueKey={'companyCode'}
                            require
                            REQUIRETITLE
                            massageError={'กรุณาเลือก Company'}
                            placeholder={isQuaNo === true ? '-' : ''}
                            ref={el => inputRef.current.companyCode = el}
                            defaultValue={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.companyCode ? salesOrderReducer.saleOrderById[0].saleOrder.companyCode : ''}
                            onPress={(item)=> { 
                                setCompany(item)
                                inputRef.current.plantCode.clear()
                                inputRef.current.shipPoint.clear()
                            }}
                            disabled={isQuaNo === true ? true : false}
                        />
                    </View>
                    <View style={{flex: 1/2}}>
                        <SelectDropdown
                            NotFillter={true}
                            titleDropdown={'Plant'}
                            titleAlert={"Plant"}
                            dataList={salesOrderReducer.plantData}
                            titleKey={'label'}
                            valueKey={'plant'}
                            require
                            REQUIRETITLE
                            massageError={'กรุณาเลือก Plant'}
                            placeholder={isQuaNo === true ? '-' : ''}
                            disabled={isQuaNo === true ? true : company != '' && salesOrderReducer.plantData && salesOrderReducer.plantData.length != 0 ?   false : true}
                            ref={el => inputRef.current.plantCode = el}
                            defaultValue={salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.plantCode ? salesOrderReducer.saleOrderById[0].saleOrder.plantCode : ''}
                            onPress={(item)=>{
                                setPlant(item)
                                inputRef.current.shipPoint.clear()
                            }}
                        />
                    </View>
                </View>

                <View style={{marginHorizontal: '5%',paddingBottom:'3%'}}>
                    <View style={{flex: 1/2, paddingBottom:'3%'}}>
                        <SelectDropdown
                            NotFillter={true}
                            titleDropdown={'Shipping Point'}
                            titleAlert={"Shipping Point"}
                            titleKey={'shipping_Point_Receiving_Pt_Name'}
                            valueKey={'shipping_Point_Receiving_Pt'}
                            require
                            REQUIRETITLE
                            massageError={'กรุณาเลือก Shipping Point'}
                            placeholder={isQuaNo === true ? '-' : ''}
                            dataList={salesOrderReducer.shipPointData.records}
                            // disabled={isQuaNo === true ? true : plant !='' && salesOrderReducer.shipPointData && salesOrderReducer.shipPointData.records.length != 0 ? false : true}
                            disabled={isQuaNo === true ? false : plant !='' && salesOrderReducer.shipPointData ? false : true}
                            onPress={(item)=> setShipPoint(item)}
                            ref={el => inputRef.current.shipPoint = el}
                            defaultValue={isQuaNo === true && salesOrderReducer.shipPointData.records ? salesOrderReducer.shipPointData.records[0] : salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.shipCode ? salesOrderReducer.saleOrderById[0].saleOrder.shipCode : ''}
                        />
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: '5%', paddingBottom:20}}>
                    <View style={{flex: 1/2, paddingRight:'2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text style={{fontWeight:'bold'}} >Sales Supervisor</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.saleSup ? salesOrderReducer.saleOrderById[0].saleOrder.saleSup : '-'}</Text>
                        </View> 
                    </View>
                    <View style={{flex: 1/2, paddingRight:'2%'}}>
                        <View style={{paddingBottom:'2%'}}>
                            <Text  style={{fontWeight:'bold'}}>Status</Text>
                        </View>
                        <View>
                            <Text>{salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.orderStatusDesTh ? salesOrderReducer.saleOrderById[0].saleOrder.orderStatusDesTh : '-'}</Text>
                        </View>  
                    </View>                  
                </View>
                <View style={{flex: 0}}>
                    <ModalWarning
                        visible={modalPlantError}
                        onPressClose={()=> setModalPlantError(false)}
                        WARNINGTITLE
                        onlyCloseButton
                        detailText={salesOrderReducer.plantDataloadingSuccess && salesOrderReducer.plantDataloadingError ? salesOrderReducer.plantDataErrorMSG : salesOrderReducer.shipPointDataErrorMSG}/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.white
    },
    styleShadow: {
        shadowOffset: {
            height: 3,
            width: 5
        },
        shadowRadius: 20,
        shadowOpacity: 0.2,
        shadowColor: colors.black,
        elevation: 10,
      },
});

export default forwardRef(OverViewSaleOrder);
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux';
import { Switch } from 'native-base';

import { Text, Table, Button, Header,Dropdown, ModalWarning, SelectDropdown, LoadingOverlay, CheckBox,  FullTable} from '../../components'
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import colors from '../../utility/colors'
import language from '../../language/th.json';
import { getQRAction, getQRCustomer, cancelMeter,getQRCustomerByCustCode } from '../../actions/masterAction';
import { getInputData } from '../../utility/helper';

const QRMaster = ({ route }) => {
    const disableSearch = route.params ? route.params.disableSearch : false;
    const prospectAccount = route.params ? route.params.prospectAccount : null;
    const navigation = useNavigation();
    const {masterReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    const [isVisible , setIsVisible] = useState(false);
    const [selectedCust, setSelectedCust] = useState('');
    const [modalVisibleDelete, setmodalVisibleDelect] =useState(false);
    const [modalVisibleDeleteConfirm, setmodalVisibleDelectConfirm] =useState(false);
    const [removeItem, setRemoveItem] = useState();  
    const [valueCus, setValueCus] = useState();  
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    // const [disableSearch, setdisableSearch] = useState(route.params && route.params.disableSearch ? route.params.disableSearch : null);
    // const [prospectAccount, setProspectAccount] = useState(route.params && route.params.prospectAccount ? route.params.prospectAccount : null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('');
    const [selectCheckBox, setSelectCheckBox] = useState(false);
    const [isShowFullTable,setisShowFullTable] = useState(false);

    useEffect(() => {
        if (masterReducer.customer_loading) {
            dispatch(getQRCustomer()) 
        }
        if(route.params && route.params.disableSearch){
            getCustomerCustcode();
        }
    }, [])
    useEffect(() => {  
        if (!masterReducer.qr_loading) {}

        if (masterReducer.remove_loading && !masterReducer.remove_error) {
            dispatch(getQRAction({custCode: selectedCust.custCode}))
        }
        if (masterReducer.remove_loading && masterReducer.remove_error) {
            setmodalVisibleError(true)
        }
        
        setIsLoading(false)
    }, [masterReducer])

    const getCustomerCustcode =  async () =>{
        setCurrentPage(1)
        const data = await getQRCustomerByCustCode(`${prospectAccount.custCode}`)
        setSelectedCust(data)
        dispatch(getQRAction({custCode: data.custCode}))
    }

    const handleSubmit = (value) => {
        let totalValue = getInputData(inputRef);
        setIsVisible(false)
        let cust = totalValue.data.custCode;
        setCurrentPage(1)
        
        if (!totalValue.isInvalid && cust != null) {
            setIsVisible(true)
            let dataCustomer = masterReducer.customer.find((item) => cust == item.custCode)
            setIsLoading(true)
            setSelectedCust(dataCustomer);

            let flagActive = ''
            if (selectCheckBox == true) flagActive = "Y"

            dispatch(getQRAction({cust}, flagActive))
        }
    }

    const handleClear = (value) => {
        setIsVisible(false)
        inputRef.current.custCode.clear()
        setSelectCheckBox(false)
    }

    const handleDelete = (value) => {
        if (value == null) return

        setIsVisible(true)
        setmodalVisibleDelect(false);
        setmodalVisibleDelectConfirm(true);
        dispatch(cancelMeter(removeItem.meterId))
    }

    const onPressPage = (page) => {
        if (!page) return
        let totalValue = getInputData(inputRef);
        let data = totalValue.data;
        setCurrentPage(page)
        if(disableSearch) return  dispatch(getQRAction({page, custCode:selectedCust.custCode}))
        return dispatch(getQRAction({page, data: totalValue.data, ...data}))
    }

    const onPressDelete = (event, item) => {
        setmodalVisibleDelect(event);
        if (item) setRemoveItem(item)
    }

    const onPressDeleteConfirm = (event) => {
        setmodalVisibleDelectConfirm(event);
    }

    const onPressError = (event) => {
        setmodalVisibleError(event)
    }

    const [columnsHeader, setColumnsHeader] = useState([
        { key: "custCode", title: "รหัสลูกค้า" },
        { key: 'custNameTh', title: 'ชื่อลูกค้า' },
        { key: 'gasNameTh', title: 'ประเภทผลิตภัณฑ์' },
        { key: 'dispenserNo', title: 'ตู้น้ำมัน' ,isColumnCenter: true},
        { key: 'nozzleNo', title: 'มือจ่ายที่' ,isColumnCenter: true},
        { key: 'activeFlagStatus', title: 'สถานะ' ,isColumnCenter: true},
        { key: 'lastUpdate', title: 'last update' ,isColumnCenter: true},
    ]);

    const handleSelectCheckBox = (item) => {
        if (item == true) setSelectCheckBox(true)
        if (item == false) setSelectCheckBox(false)
    }

    const handleSelectCustomer = (value) => {
        if (value == true) {
            setSelectCheckBox(true);
        } else {
            setSelectCheckBox(false);
        }
    };

    return(
       
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <Header/>
            <ScrollView style={{marginBottom: '5%'}}>
                {
                    disableSearch ? <View></View> : <View style={[styles.SearchArea,styles.styleShadow]}>
                    <View style={{borderBottomWidth:0.5, borderColor:colors.grayborder, marginBottom: '10%'}}>
                        <View style={{marginBottom: '2%'}}>
                            <Text style={{fontSize:FONT_SIZE.TITLE,fontWeight:'bold'}}>ค้นหา</Text>
                        </View>
                    </View>

                    <View>                    
                        <SelectDropdown
                            dataList={masterReducer.customer}
                            titleDropdown={"ชื่อลูกค้า"}
                            titleAlert={"ชื่อลูกค้า"}
                            require
                            REQUIRETITLE
                            massageError={language.COUSTMER}
                            valueKey={"custCode"}
                            titleKey={"label"}
                            ref={el => inputRef.current.custCode = el}
                        />
                    </View>

                    <View style={{flexDirection: 'row', marginTop: '10%', alignItems: 'center', marginBottom: '5%'}}>
                        <View style={{flex: 1, marginStart: '15%', marginEnd: '1%'}}>
                            <Button
                                onPress={handleSubmit}
                                title={'Search'}
                                typeIcon={'Ionicons'}
                                nameIcon={'search-outline'}
                                IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                            />
                        </View>
                        <View style={{flex: 1, marginStart: '1%', marginEnd: '15%'}}>
                            <Button
                                onPress={handleClear}
                                title={'Clear'}
                                typeIcon={'Ionicons'}
                                nameIcon={'trash-outline'}
                                color={colors.grayButton}
                                colorBorder={colors.grayButton}
                                IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                            />
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end', marginBottom: '2%'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Switch
                                value = {selectCheckBox}
                                onValueChange = {(value) => handleSelectCustomer(value)} 
                                style={{marginLeft: '2%'}}
                            />
                            <View style={{marginLeft: '2%'}}>
                                <Text>ไม่รวมสถานะไม่ใช้งาน</Text>
                            </View>
                        </View>
                    </View>
                </View>
                }

                {
                    isVisible ?
                    <>
                    <View style={{marginBottom: '2%',marginHorizontal:'5%'}}>
                        <Text style={{fontSize: FONT_SIZE.TEXT, fontWeight:'bold'}}>รหัสลูกค้า     :   {selectedCust.custCode}</Text>
                        <Text style={{fontSize: FONT_SIZE.TEXT, fontWeight:'bold'}}>ชื่อลูกค้า       :   {selectedCust.custNameTh}</Text>
                        <Text style={{fontSize: FONT_SIZE.TEXT, fontWeight:'bold'}}>แสดงผลการค้นหา</Text>
                    </View>
                        <View style={{alignItems: 'flex-end', marginBottom: '2%',marginHorizontal:'3%'}}>
                            <Button
                                onPress={() => navigation.navigate('AddEditQRMasterScreen', {customer: selectedCust})}
                                title={'Add'}
                                typeIcon={'Ionicons'}
                                nameIcon={'add-outline'}
                                buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                width={STYLE_SIZE.BNT_WIDTH_HUN}
                            />
                        </View>
                        <View style={{flex:1,marginHorizontal:'3%'}}>
                            <FullTable isShow={isShowFullTable} onChange={(status) => setisShowFullTable(status)} size= {STYLE_SIZE.ICON_SIZE_THRR}> 
                            <Table 
                                data={masterReducer.data.records} 
                                columns={columnsHeader}
                                edittableonly
                                qrCode
                                spaceHorizontal={5}
                                recordDetail={masterReducer.data}
                                onPressPage={onPressPage}
                                onPressEditOnly={(item) => navigation.navigate('AddEditQRMasterScreen', {meter: item, customer: selectedCust})}
                                currentPage={currentPage}
                                hideEdit={isShowFullTable ? true : false}
                                isShowFullTable={isShowFullTable}
                            />
                            </FullTable>
                            <ModalWarning
                                visible={modalVisibleDelete}
                                onPressConfirm={handleDelete}
                                onPressCancel={()=> onPressDelete(false)}
                                detailText={language.DELETE}
                            />
                            <ModalWarning
                                visible={modalVisibleDeleteConfirm}
                                onPressClose={()=> onPressDeleteConfirm(false)}
                                onlyCloseButton
                                detailText={language.DELETESUCCESS}
                            />
                        </View> 
                    </>
                    :
                    disableSearch ? 
                    <View style={{marginTop:'5%'}}>
                         <View style={{marginBottom: '2%',marginHorizontal:'5%'}}>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>รหัสลูกค้า     :  {selectedCust ? selectedCust.custCode : ''} </Text>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>ชื่อลูกค้า      :  {selectedCust ? selectedCust.custNameTh : ''}  </Text>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>แสดงผลการค้นหา</Text>
                        </View>
                        <View style={{alignItems: 'flex-end', marginBottom: '2%',marginHorizontal:'3%'}}>
                            <Button
                                onPress={() => navigation.navigate('AddEditQRMasterScreen', {customer: selectedCust})}
                                title={'Add'}
                                typeIcon={'Ionicons'}
                                nameIcon={'add-outline'}
                                buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                width={STYLE_SIZE.BNT_WIDTH_HUN}
                            />
                        </View>
                        <View style={{flex:1,marginHorizontal:'3%'}}>
                            <FullTable isShow={isShowFullTable} onChange={(status) => setisShowFullTable(status)} size= {STYLE_SIZE.ICON_SIZE_THRR}> 
                            <Table 
                                data={masterReducer.data.records} 
                                columns={columnsHeader}
                                editable
                                qrCode
                                spaceHorizontal={5}
                                recordDetail={masterReducer.data}
                                onPressPage={onPressPage}
                                onPressRemove={(item)=> onPressDelete(true, item)}
                                onPressEdit={(item) => navigation.navigate('AddEditQRMasterScreen', {meter: item, customer: selectedCust})}
                                currentPage={currentPage}
                                hideEdit={isShowFullTable ? true : false}
                                isShowFullTable={isShowFullTable}
                            />
                            </FullTable>
                            <ModalWarning
                                visible={modalVisibleDelete}
                                onPressConfirm={handleDelete}
                                onPressCancel={()=> onPressDelete(false)}
                                detailText={language.DELETE}
                            />
                            <ModalWarning
                                visible={modalVisibleDeleteConfirm}
                                onPressClose={()=> onPressDeleteConfirm(false)}
                                onlyCloseButton
                                detailText={language.DELETESUCCESS}
                            />
                        </View> 
                    </View>  :
                    null
                }  
            </ScrollView>
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={masterReducer.metererrorMSG}
            />
            <LoadingOverlay
                visible={isLoading}
            />
        </View>
)}

const styles = StyleSheet.create({
    SearchArea : {
        borderRadius: 20, 
        backgroundColor: colors.grayMaster, 
        padding: '5%', 
        marginVertical: '4%',
        marginHorizontal:'4%'
    },
    styleShadow: {
        shadowOffset: {
            height: 3,
            width: 5
        },
        shadowRadius: 20,
        shadowOpacity: 0.2,
        shadowColor: colors.grayDark,
        elevation: 10,
      },
})

export default QRMaster;

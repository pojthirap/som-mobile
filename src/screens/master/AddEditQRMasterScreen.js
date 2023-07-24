import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { RadioButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native'
import { Switch } from 'native-base';

import { Text, TextInput, SelectDropdown, Button, ModalWarning, LoadingOverlay } from '../../components';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import { getInputData } from '../../utility/helper';
import language from '../../language/th.json';
import colors from '../../utility/colors';
import { getSearchGasolineAction, addMeterAction, updateMeterAction, getQRAction, actionClear } from '../../actions/masterAction';

const AddEditQRMaster = (props) =>{

    const navigation = useNavigation();
    const {masterReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const [customer, setCustomer] = useState(props.route.params.customer)
    const [meter, setMeter] = useState(props.route.params.meter)
    const [gasoline, setGasoline] = useState([])
    const [gasSelect, setGasSelect] = useState('');
    const inputRef = useRef({});
    const [modalVisibleConfirm, setmodalVisibleConfirm] = useState(false);
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    const [checked, setChecked] = React.useState('Y');
    const [selectCheckBox, setSelectCheckBox] = useState(false);

    useEffect(() => {
        // if (masterReducer.gasoline_loading) {
        dispatch(getSearchGasolineAction(customer.custCode)) 
        // }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
                if (props.route.params && props.route.params.meter) {
                    if (props.route.params.meter.activeFlagMeter == '') return
                    let value = props.route.params.meter.activeFlagMeter.trim()
                    if (value == "Y") setSelectCheckBox(true)
                    if (value == "N") setSelectCheckBox(false)
                }
            return () => {
          };
        }, [])
    );

    useEffect(() => {
        if (!masterReducer.gasoline_loading) {
            if (!masterReducer.gasoline.records) return

            let addTitle = masterReducer.gasoline.records.map((item) => {
                return {...item, title: item.gasNameTh}
            })
            setGasoline(addTitle)
        }

        if (masterReducer.addMeterloadingSuccess && !masterReducer.addMeterloadingError) {
            dispatch(getQRAction({custCode: customer.custCode}))
            setmodalVisibleConfirm(true)
        } 
        
        if (masterReducer.addMeterloadingSuccess && masterReducer.addMeterloadingError)  {
            setmodalVisibleError(true)
        }

    }, [masterReducer])

    const handleSubmit = () => {
        if (meter) {
            let totalValue = getInputData(inputRef);

            if (!totalValue.isInvalid) {  
                let flagActive = ''
                if (selectCheckBox == true) flagActive = "Y"
                if (selectCheckBox == false) flagActive = "N"

                dispatch(updateMeterAction(customer, meter, totalValue.data, flagActive));
        }} else {
            let totalValue = getInputData(inputRef);

            if (!totalValue.isInvalid) {
                dispatch(addMeterAction(totalValue.data, gasSelect, customer));
        }}
    }

    const onPressConfirm = (event) => {
        setmodalVisibleConfirm(event)
        props.navigation.pop()
    }

    const onPressError = (event) => {
        setmodalVisibleError(event)
    }

    const handleClose = () => {
        setmodalVisibleError(false)
        setmodalVisibleConfirm(false)
        props.navigation.pop()
        dispatch(actionClear())
    }

    const isLoading = () => {
        return !gasoline
    }

    // const handleRadio = (type) => {
    //     if (checked) return checked == type ? 'checked' : 'unchecked'
    // }

    const handleSelectCustomer = (value) => {
        if (value == true) {
            setSelectCheckBox(true);
        } else {
            setSelectCheckBox(false);
        }
    };


    return(
        <View style={styles.container}>
            <ScrollView style={{marginBottom: '5%'}}>
            <View style={styles.alertTitle}>
                <Text style={{...styles.modalTitle}}>QR Master</Text>
                {/* <TouchableOpacity onPress={() => navigation.navigate('QRMasterScreen')} style={{marginHorizontal: 15, justifyContent:'center'}}>
                    <Icon type="MaterialCommunityIcons" name="close"  style={{color:colors.white, fontSize:45}}/>
                </TouchableOpacity> */}
            </View>
            <View style={{paddingHorizontal: '5%', marginTop: '5%'}}>
                <View style={{marginVertical: '2%'}}>
                    <TextInput 
                        title={'รหัสลูกค้า'} 
                        editable={false} 
                        value={customer.custCode} />
                </View>
                <View style={{marginVertical: '2%'}}>
                    <TextInput 
                        title={'ชื่อลูกค้า'} 
                        editable={false} 
                        value={customer.custNameTh} />
                </View>
                <View style={{marginVertical: '2%'}}>
                    <SelectDropdown
                        // value={meter ? JSON.stringify(meter.gasId) : ''} 
                        titleKey={"gasNameTh"}
                        valueKey={"gasId"}
                        dataList={gasoline}
                        titleDropdown={'ประเภทผลิตภัณฑ์'}
                        titleAlert={'ประเภทผลิตภัณฑ์'}
                        ref={el => inputRef.current.gasId = el} 
                        REQUIRETITLE
                        require
                        massageError={language.PRODUCTTYPE}
                        defaultValue={meter ? JSON.stringify(meter.gasId) : ''}
                    />
                </View>
                <View style={{marginVertical: '2%'}}>
                    <TextInput 
                        editable={!meter} 
                        value={meter ? JSON.stringify(meter.dispenserNo) : ''} 
                        ref={el => inputRef.current.dispenserNo = el} 
                        REQUIRETITLE
                        require 
                        type={'NotZero'}
                        title={'ตู้น้ำมัน'}
                        massageError={language.DISPENSORNO}
                        typeKeyboard={'numeric'}
                        maxLength={2}
                    />
                </View>
                <View style={{marginVertical: '2%'}}>
                    <TextInput 
                        editable={!meter} 
                        value={meter ? JSON.stringify(meter.nozzleNo) : ''} 
                        ref={el => inputRef.current.nozzleNo = el} 
                        REQUIRETITLE
                        require 
                        type={'NotZero'}
                        title={'มือจ่ายที่'}
                        massageError={language.NOZZLENO}
                        typeKeyboard={'numeric'}
                        maxLength={2}
                    />
                </View>
                {
                    meter ? 
                    <View style={{marginVertical: '2%', height: '5%', justifyContent: 'center', marginTop: '3%'}}>    
                        {/* <View style={{marginBottom: 10}}>
                            <Text>สถานะ</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row'}}>
                                <RadioButton
                                    value="Y"
                                    status={ handleRadio('Y')}
                                    onPress={() => setChecked('Y')}
                                />
                                <Text style={{paddingHorizontal: 15}}>ใช้งาน</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <RadioButton
                                    value="N"
                                    status={ handleRadio('N')}
                                    onPress={() => setChecked('N')}
                                />
                                <Text style={{paddingHorizontal: 15}}>ไม่ใช้งาน</Text>
                            </View>
                        </View> */}
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginRight: '5%'}}>
                                <Text>สถานะ</Text>
                            </View>
                            <Switch
                                value = {selectCheckBox}
                                onValueChange = {(value) => handleSelectCustomer(value)} 
                                style={{marginLeft: '5%'}}
                            />
                            <View style={{marginLeft: '5%'}}>
                                <Text>ใช้งาน / ไม่ใช้งาน</Text>
                            </View>
                        </View>
                    </View>
                    :
                    null
                }
            </View> 
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', margin: '5%', marginTop: '10%'}}>
                <View style={{marginEnd: '1%'}}>
                    <Button
                        onPress={() => handleClose()}
                        title={'Cancel'}
                        color={colors.grayButton}
                        colorBorder={colors.grayButton}
                        width={STYLE_SIZE.BNT_WIDTH}
                    />
                </View>
                <View style={{marginStart: '1%'}}>
                    <Button
                        onPress={handleSubmit}
                        title={'Save'}
                        width={STYLE_SIZE.BNT_WIDTH}
                    />
                    <ModalWarning
                        visible={modalVisibleConfirm}
                        onPressClose={()=> onPressConfirm(false)}
                        onlyCloseButton
                        detailText={language.CONFIRNSUCCESS}
                    />
                </View>
            </View>
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={masterReducer.metererrorMSG}
            />
            <LoadingOverlay
                visible={isLoading()}
            />
            </ScrollView>
        </View>
        )
}

const styles =  StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    alertTitle: {
        backgroundColor: colors.primary,
        width: "100%",
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalTitle:{
        fontWeight: 'bold',
        backgroundColor: colors.primary,
        color: colors.white,
        paddingHorizontal: '2%',
        paddingVertical: '3%',
        fontSize: FONT_SIZE.TEXT
    },
});

export default AddEditQRMaster;
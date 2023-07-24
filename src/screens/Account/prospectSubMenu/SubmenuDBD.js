import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'

import { Button, TextInput, Text, ModalWarning, SelectDropdown } from '../../../components'
import colors from '../../../utility/colors'
import language from '../../../language/th.json';
import { FONT_SIZE } from '../../../utility/enum';
import { getInputData, resetInputData } from '../../../utility/helper';
import { getProspectDbd, updateProspectDbd, actionClearPros } from '../../../actions/prospectAction';

const SubmenuDbd = () => {
    const [checked, setChecked] = React.useState('C');
    const {prospectSelectInfoReducer} = useSelector((state) => state);
    const {masterReducer} = useSelector((state) => state);
    const {prospectReducer} = useSelector((state) => state);
    const inputRef = useRef({});
    const dispatch = useDispatch();  
    const [modalVisible, setmodalVisible] = useState(false);
    const [modalVisibleConfirm, setmodalVisibleConfirm] = useState(false);  
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    const [isCustomer,setIsCustomer] = useState(prospectSelectInfoReducer.dataSelect.isCustomer ? true : false)
    const [isRentStation,setIsRentStation] = useState(prospectSelectInfoReducer.dataSelect.isRentStation ? true : false)
    const [isOther,setIsOther] = useState(prospectSelectInfoReducer.dataSelect.isOther ? true : false)
    const [isRecommandBUProspect,setIsRecommandBUProspect] = useState(prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ? true : false)

    useEffect(() => {
        // if (prospectReducer.basicProspect_loading) {
        dispatch(getProspectDbd(prospectSelectInfoReducer.dataSelect.prospect));
        // }
    }, []) 

    useFocusEffect(
        React.useCallback(() => {
                resetInputData(inputRef);
                dispatch(getProspectDbd(prospectSelectInfoReducer.dataSelect.prospect));
                if (prospectReducer.dbdProspect && prospectReducer.dbdProspect.dbdPayChannel) {
                    if (prospectReducer.dbdProspect.dbdPayChannel == '') return
                    let value = prospectReducer.dbdProspect.dbdPayChannel.trim()
                    if (value) setChecked(value)
                }
            return () => {
          };
        }, [])
    );

    useEffect(() => {
        if (prospectReducer.dbdProspect && prospectReducer.dbdProspect.dbdPayChannel) {
            let value = prospectReducer.dbdProspect.dbdPayChannel.trim()
            if (value) setChecked(value)
        }

        if (prospectReducer.editDbdPropectSuucess && !prospectReducer.editDbdPropectError) {
            setmodalVisibleConfirm(true);
            dispatch(getProspectDbd(prospectSelectInfoReducer.dataSelect.prospect));
        } 

        if (prospectReducer.editDbdPropectSuucess && prospectReducer.editDbdPropectError)  {
            setmodalVisibleError(true);
            dispatch(getProspectDbd(prospectSelectInfoReducer.dataSelect.prospect));
        }
    }, [prospectReducer, prospectReducer.dbdProspect])

    const dataDbd = prospectReducer.dbdProspect;

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef, 'C');
        let dataDbd = prospectReducer.dbdProspect;

        if (!totalValue.isInvalid && dataDbd) {
            setmodalVisible(true);
        }
    }

    const onPressModalAlert = (event) => {
        setmodalVisible(event);
        setmodalVisibleConfirm(false);
    }

    const onPressModalAlertConfirm = (event) => {
        let totalValue = getInputData(inputRef, 'C');
        let dataDbd = prospectReducer.dbdProspect
        let value = prospectReducer.dbdProspect.dbdPayChannel.trim()

        if (value != checked) {
            if (totalValue.changeField) totalValue.changeField = `${totalValue.changeField}, รูปแบบการชำระเงิน`
            if (!totalValue.changeField) totalValue.changeField = `รูปแบบการชำระเงิน`
        }

        setmodalVisibleConfirm(false);
        setmodalVisible(false);
        setmodalVisibleError(false)
        dispatch(actionClearPros())
        dispatch(updateProspectDbd(totalValue, dataDbd, checked));
    } 

    const handleCancel = () => {
        resetInputData(inputRef);
        if (prospectReducer.dbdProspect && prospectReducer.dbdProspect.dbdPayChannel) {
            let value = prospectReducer.dbdProspect.dbdPayChannel.trim()
            if (value) setChecked(value)
            return
        } setChecked("C")
    };

    //name prospect
    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const handleRadio = (type) => {
        if (checked) return checked == type ? 'checked' : 'unchecked'
    }

    const onPressError = (event) => {
        setmodalVisibleError(event)
    }

    const handleDisable = (type) => {
        if (isCustomer) {
            if (type == "Radio") return false
            if (type == "TextInput") return true
        }
        else if (isRecommandBUProspect) {
            if (type == "Radio") return true
            if (type == "TextInput") return false
        }
        else if (isRentStation) {
            if (type == "Radio") return false
            if (type == "TextInput") return true
        }
        else if (isOther) {
            if (type == "Radio") return true
            if (type == "TextInput") return false
        }
        else {
            if (type == "Radio") return false
            if (type == "TextInput") return true
        }
    }

    const handleButton = () => {
        if (isCustomer) return true
        if (isRecommandBUProspect) return false
        if (isRentStation) return true
        if (isOther) return false

        return true
    }

    return (
        <View style={{ flex: 1 }}>
            {
            dataDbd &&             
                <ScrollView style={styles.container}>
                    <View style={{backgroundColor: colors.white}}>
                        {/* Create */}
                        <View style={styles.topLabel}>
                            <View style={{ flex: 1 }}>
                                <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                            </View>
                        </View>

                        {/* Prospect Info */}
                        <View style={styles.titleLabel}>
                            <View style={[styles.title, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight:'bold'}}>รายละเอียด</Text>
                                </View>
                            </View>
                            <View style={styles.rowLabel}>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Contact Name</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd ? dataDbd.firstName || '-' : ''} {dataDbd ? dataDbd.lastName || '' : ''}</Text>   
                                    </View>
                                </View>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Contact Number</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd.mobileNo ? dataDbd.mobileNo : '-'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rowLabel}>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Prospect Name</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd.accName ? dataDbd.accName : '-' }</Text>
                                    </View>
                                </View>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Vat Number</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd.identifyId ? dataDbd.identifyId : '-' }</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rowLabel}>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>จังหวัด</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd.provinceNameTh ? dataDbd.provinceNameTh : '-' }</Text>
                                    </View>
                                </View>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Code DBD</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd.dbdCode ? dataDbd.dbdCode : '-' }</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rowLabel}>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Corporate Type</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd.dbdCorpType ? dataDbd.dbdCorpType : '-' }</Text>
                                    </View>
                                </View>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Juristic Status</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd.dbdJuristicStatus ? dataDbd.dbdJuristicStatus : '-' }</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rowLabel}>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Latitude</Text>
                                    <View style={{marginVertical: '3%'}}>
                                        <Text numberOfLines={1}>{dataDbd ? dataDbd.latitude || '-' : ''}</Text>
                                    </View>
                                </View>
                                <View style={[styles.input, {marginRight: '3%'}]}>
                                    <Text style={{fontWeight:'bold'}}>Longitude</Text>
                                    <View>
                                        <Text numberOfLines={1}>{dataDbd ? dataDbd.longitude || '-' : ''}</Text>
                                    </View>
                                </View>
                            </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'Register Capital'} 
                                        value= {dataDbd && dataDbd.dbdRegCapital != null ? `${dataDbd.dbdRegCapital}` : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdRegCapital = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={20}
                                        type={"NumFloat"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'Total Income'} 
                                        value= {dataDbd && dataDbd.dbdTotalIncome ? `${dataDbd.dbdTotalIncome}` : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdTotalIncome = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={20}
                                        type={"NumFloat"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'Profit Loss'} 
                                        value= {dataDbd && dataDbd.dbdProfitLoss ? `${dataDbd.dbdProfitLoss}` : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdProfitLoss = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={20}
                                        type={"NumFloat"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'Total Assets'} 
                                        value= {dataDbd && dataDbd.dbdTotalAsset ? `${dataDbd.dbdTotalAsset}` : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdTotalAsset = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={20}
                                        type={"NumFloat"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'Fleet Card'} 
                                        value= {dataDbd ? dataDbd.dbdFleetCard : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdFleetCard = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={20}
                                        type={"Num"}
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'Corporate Card'} 
                                        value= {dataDbd ? dataDbd.dbdCorpCard : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCorpCard = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={20}
                                        type={"Num"}
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'ประมาณการการใช้น้ำมัน'} 
                                        value= {dataDbd ? dataDbd.dbdOilConsuption : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdOilConsuption = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={26}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'สถานีบริการน้ำมันที่ใช้ปัจจุบัน'} 
                                        value= {dataDbd ? dataDbd.dbdCurrentStation : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCurrentStation = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <Text style={{marginBottom: 5}}>รูปแบบการชำระเงิน</Text>
                                    <View style={{flex: 1,flexDirection: 'row', marginVertical: 10}}>
                                        <View style={{flex: 1/2, flexDirection: 'row'}}>
                                            <RadioButton
                                                value="C"
                                                status={ handleRadio('C')}
                                                onPress={() => setChecked('C')}
                                                disabled={handleDisable("Radio")}
                                            />
                                            <Text style={{paddingHorizontal: 15}}>เงินสด</Text>
                                        </View>
                                        <View style={{flex: 1/2, flexDirection: 'row'}}>
                                            <RadioButton
                                                value="D"
                                                status={ handleRadio('D')}
                                                onPress={() => setChecked('D')}
                                                disabled={handleDisable("Radio")}
                                            />
                                            <Text style={{paddingHorizontal: 15}}>เงินเชื่อ</Text>
                                        </View>
                                    </View>
                                    <TextInput 
                                        title={'รถ 4 ล้อ'} 
                                        value= {dataDbd ? dataDbd.dbdCarWheel4 : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCarWheel4 = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={13}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'รถ 6 ล้อ'} 
                                        value= {dataDbd ? dataDbd.dbdCarWheel6 : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCarWheel6 = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={13}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'รถ 8 ล้อ'} 
                                        value= {dataDbd ? dataDbd.dbdCarWheel8 : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCarWheel8 = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={13}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'รถพ่วง'} 
                                        value= {dataDbd ? dataDbd.dbdCaravan : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCaravan = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={13}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'รถเทรลเลอร์'} 
                                        value= {dataDbd ? dataDbd.dbdCarTrailer : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCarTrailer = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={13}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'รถลากตู้คอนเทนเนอร์'} 
                                        value= {dataDbd ? dataDbd.dbdCarContainer : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdCarContainer = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={13}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'เครื่องจักร'} 
                                        value= {dataDbd ? dataDbd.dbdMachine : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdMachine = el}
                                        editable={handleDisable("TextInput")}
                                        maxLength={13}
                                        type={"Num"}
                                        comma
                                        typeKeyboard={"numeric"}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'อื่นๆ'} 
                                        value= {dataDbd ? dataDbd.dbdOther : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdOther = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'มีแทงค์'} 
                                        value= {dataDbd ? dataDbd.dbdTank : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdTank = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'สถานีบริการน้ำมัน'} 
                                        value= {dataDbd ? dataDbd.dbdStation : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdStation = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'ทั้ง 2 รูปแบบ'} 
                                        value= {dataDbd ? dataDbd.dbdType2 : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdType2 = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'ศูนย์ซ่อมบำรุง'} 
                                        value= {dataDbd ? dataDbd.dbdMaintainCenter : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdMaintainCenter = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'อู่ทั่วไป'} 
                                        value= {dataDbd ? dataDbd.dbdGeneralGarage : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdGeneralGarage = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'แผนกซ่อมบำรุงของบริษัท'} 
                                        value= {dataDbd ? dataDbd.dbdMaintainDept : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdMaintainDept = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'ผู้แนะนำ'} 
                                        value= {dataDbd ? dataDbd.dbdRecommender : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdRecommender = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'เจ้าหน้าที่ขาย'} 
                                        value= {dataDbd ? dataDbd.dbdSale : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdSale = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title= {'เจ้าหน้าที่ดูแลหลังการขาย'} 
                                        value= {dataDbd ? dataDbd.dbdSaleSupport : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdSaleSupport = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput 
                                        title={'หมายเหตุ'} 
                                        value= {dataDbd ? dataDbd.dbdRemark : ''} 
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''} 
                                        ref={el => inputRef.current.dbdRemark = el}
                                        editable={handleDisable("TextInput")}
                                    />
                                </View>
                        </View>  

                        {/* Button */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: '10%', marginTop: '3%'}}>
                            {
                                handleButton() && <>
                                <View style={[styles.buttonLow, { alignItems: 'flex-end' }]}>
                                    <Button
                                        onPress={handleCancel}
                                        width={'60%'}
                                        title={'Cancel'}
                                        fontColor={colors.primary}
                                        color={colors.white}/>
                                </View>
                                <View style={[styles.buttonLow, { alignItems: 'flex-start'}]}>
                                    <Button
                                        onPress={()=> handleSubmit()}
                                        width={'60%'}
                                        title={'Save'}/>
                                    <ModalWarning
                                        visible={modalVisible}
                                        detailText={language.CONFIRN}
                                        onPressConfirm={()=> onPressModalAlertConfirm(true)}
                                        onPressCancel={()=> onPressModalAlert(false)}/>
                                    <ModalWarning
                                        visible={modalVisibleConfirm}
                                        detailText={language.CONFIRNSUCCESS}
                                        onlyCloseButton={true}
                                        onPressClose={()=> onPressModalAlert(false)}/>
                                </View>
                                </>
                            } 
                        </View>
                    </View>
                </ScrollView>
            }
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={prospectReducer.dbdErrorMSG}
            />   
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.grayborder,
    },
    topLabel: {
        width: '100%',
        flex: 1,
        marginTop: '5%',
        paddingHorizontal: '5%'
    },
    button: {
        flex: 1/3,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    titleLabel: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '5%'
    },
    title: {
        paddingVertical: '3%' ,
    },
    rowLabel: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    input: {
        flex: 1,
        marginBottom: '3%'
    },
    lalongLabel: {
        flexDirection: 'row',
        flex: 1/2,
        paddingHorizontal: 15
    },
    buttonLow: {
        flex: 1,
        paddingHorizontal: '2%',
        marginVertical: '3%',
    },
    
})

export default SubmenuDbd;
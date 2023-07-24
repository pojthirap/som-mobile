import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Switch } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { Button, TextInput, Text, SelectDropdown, ContactInfo, Address, ModalWarning } from '../../../components'
import colors from '../../../utility/colors'
import language from '../../../language/th.json';
import { FONT_SIZE } from '../../../utility/enum';
import { getInputData, resetInputData, validateLatLng } from '../../../utility/helper';
import { getProspectBasic, getBrand, updateProspectBasic, actionClearPros, delProspect, delProspectClear } from '../../../actions/prospectAction';
import { updName } from '../../../actions/prospectSelectInfoAction';
import { event } from 'react-native-reanimated';

const SubmenuBasic = () => {
    const [selectted, setSelected] = useState(false)
    const [modalVisible, setmodalVisible] = useState(false);
    const [modalVisibleConfirm, setmodalVisibleConfirm] = useState(false);
    const { prospectSelectInfoReducer } = useSelector((state) => state);
    const { prospectReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [brand, setBrand] = useState([]);
    const [dataBasic, setDataBasic] = useState(prospectReducer.basicProspect);
    const [dataCancel, setDataCancel] = useState('');
    const [numberProspectType, setNumberProspectType] = useState(0);
    const navigation = useNavigation();
    const inputRef = useRef({});
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    const [isCustomer, setIsCustomer] = useState(prospectSelectInfoReducer.dataSelect.isCustomer ? true : false)
    const [isRentStation, setIsRentStation] = useState(prospectSelectInfoReducer.dataSelect.isRentStation ? true : false)
    const [isOther, setIsOther] = useState(prospectSelectInfoReducer.dataSelect.isOther ? true : false)
    const [isRecommandBUProspect, setIsRecommandBUProspect] = useState(prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ? true : false)
    const [isProspect, setIsProspect] = useState(prospectSelectInfoReducer.dataSelect.isProspect ? true : false)
    const [editable, setEditable] = useState(true);
    const [disabled, setDiable] = useState(false);
    const [nameUpd, setNameUpd] = useState('');
    const [disaNoCustcode, setDisaNoCustcode] = useState(false);
    const [modalLat, setmodalLat] = useState(false);
    const [modalLong, setmodalLong] = useState(false);
    const [modalLatLong, setmodalLatLong] = useState(false);
    const [basicCustomer, setBasicCustomer] = useState(false);
    const [dataVatNumber, setDataVatNumber] = useState(false);
    const [dataIdentifyId, setDataIdentifyId] = useState(false);
    const [modalVisibleDelete, setmodalVisibleDelete] = useState(false);
    const [modalVisibleDeleteConfirm, setmodalVisibleDeleteConfirm] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const [isProspectMyProspect, setIsProspectMyProspect] = useState(prospectSelectInfoReducer.dataSelect.isProspectMyProspect ? true : false)

    useEffect(() => {
        // if (prospectReducer.basicProspect_loading) {
        // dispatch(getProspectBasic(prospectSelectInfoReducer.dataSelect.prospect));  
        // }
        if (prospectReducer.brand_loading) {
            dispatch(getBrand());
        }

    }, [])

    useEffect(() => {
        //response service
        if ((prospectReducer.delProspect != '') && prospectReducer.delProspect_Loading) {
            setmodalVisibleDeleteConfirm(true)
            setErrorMSG('')
        }
        else if ((prospectReducer.delProspectErrorMSG != '') && prospectReducer.delProspectErrorMSG_Loading) {
            setmodalVisibleDeleteConfirm(true)
            setErrorMSG(`${prospectReducer.delProspectErrorMSG}`)
        }
    }, [prospectReducer.delProspect, prospectReducer.delProspectErrorMSG])

    useFocusEffect(
        React.useCallback(() => {
            resetInputData(inputRef);
            dispatch(getProspectBasic(prospectSelectInfoReducer.dataSelect.prospect));
            return () => {
            };
        }, [])
    );

    useEffect(() => {

        if (!prospectReducer.brand_loading) {
            if (!prospectReducer.brand) return

            let addTitleBrand = prospectReducer.brand.map((item) => {
                return { ...item, title: item.brandNameTh }
            })
            setBrand(addTitleBrand)
            setDataBasic(prospectReducer.basicProspect)
        }

        if (prospectReducer.editBasicPropectSuucess && !prospectReducer.editBasicPropectError) {
            setmodalVisibleConfirm(true);
            setmodalVisibleError(false);
            dispatch(updName(nameUpd, prospectSelectInfoReducer.dataSelect));
        }

        if (prospectReducer.editBasicPropectSuucess && prospectReducer.editBasicPropectError) {
            setmodalVisibleError(true);
            setmodalVisibleConfirm(false);
        }

        if (prospectReducer.basicProspect && prospectReducer.basicProspect.custCode == "") {
            let custCodeData = prospectReducer.basicProspect.custCode;
            if (custCodeData == "") setDisaNoCustcode(true);
        }

        if (prospectReducer.basicProspect && prospectReducer.basicProspect.prospectType) {
            let value = prospectReducer.basicProspect.prospectType.trim()
            if (value == "0") return setSelected(false)
            if (value == "1") {
                if (isRentStation) {
                    setSelected(false)
                    // setNumberProspectType(1)
                } else {
                    return setSelected(false)
                }
            }
            if (value == "2") {
                return setSelected(true)
            }
        }

    }, [prospectReducer])

    useEffect(() => {
        if (prospectReducer.editBasicPropectSuucess) {
            dispatch(getProspectBasic(prospectSelectInfoReducer.dataSelect.prospect))
        }
    }, [prospectReducer.editBasicPropectSuucess])

    const handleSubmit = () => {

        let totalValue = getInputData(inputRef, 'C');
        let dataBasic = prospectReducer.basicProspect

        if (!totalValue.isInvalid && dataBasic) {
            if (totalValue.data.identifyId && !totalValue.data.vatNumber) {
                return setDataVatNumber(true);

            } else if (!totalValue.data.identifyId && totalValue.data.vatNumber) {
                return setDataIdentifyId(true);

            } else {
                setmodalVisible(true);

            }
        }
    }

    const onPressModalAlert = (event) => {
        setmodalVisible(event);
        setmodalVisibleConfirm(false);

        if (!event && numberProspectType == 2 && isProspect) {
            navigation.navigate('ProspectScreen');
        }

        if (!event && numberProspectType == 0 && isCustomer) {
            navigation.navigate('CustomerScreen');
        }

        if (!event && numberProspectType == 2 && isRentStation) {
            navigation.navigate('GasStationRentalScreen');
        }
    }

    const onPressModalAlertConfirm = () => {
        let totalValue = getInputData(inputRef, 'C');
        let dataBasic = prospectReducer.basicProspect
        let numberTypeProspect = numberProspectType

        if (isCustomer && (selectted == true)) {
            setNumberProspectType(2)
            numberTypeProspect = "2"
        };

        if (isRentStation && (selectted == true)) {
            setNumberProspectType(2)
            numberTypeProspect = "2"
        };

        if (isRentStation && (selectted != true)) {
            setNumberProspectType(1)
            numberTypeProspect = "1"
        };

        if (numberTypeProspect != dataBasic.prospectType) {
            if (totalValue.changeField) totalValue.changeField = `${totalValue.changeField}, Customer`
            if (!totalValue.changeField) totalValue.changeField = `Customer`
        };

        setNameUpd(totalValue.data.accName);
        setmodalVisible(false);
        setmodalVisibleError(false);
        setmodalVisibleConfirm(false);

        let latData = totalValue.data.address.data.latitude
        let longData = totalValue.data.address.data.longitude

        if (isCustomer || isProspect) {
            if (totalValue.data.address.isNotChange) {
                if ((`${latData}` != `${dataBasic.latitude}`) && (`${longData}` != `${dataBasic.longitude}`)) totalValue.changeField = `Latitude, Longitude`
                if ((`${latData}` != `${dataBasic.latitude}`) && (`${longData}` == `${dataBasic.longitude}`)) totalValue.changeField = `Latitude`
                if ((`${latData}` == `${dataBasic.latitude}`) && (`${longData}` != `${dataBasic.longitude}`)) totalValue.changeField = `Longitude`
            }
        };

        if (validateLatLng(latData, longData) == false) {
            if (latData && !longData) setmodalLat(true)
            if (!latData && longData) setmodalLong(true)
            if (latData && longData) setmodalLatLong(true)

        } else {
            dispatch(actionClearPros());
            dispatch(updateProspectBasic(totalValue, dataBasic, numberTypeProspect));
        }
        // dispatch(actionClearPros());
        // dispatch(updateProspectBasic(totalValue, dataBasic, numberTypeProspect));
    };

    const handleSelectCustomer = (value) => {
        setSelected(value);

        if (value == true) {
            setNumberProspectType(2);
        } else {
            if (isRentStation) {
                setNumberProspectType(1);
            } else {
                setNumberProspectType(0);
            }
        }
    };

    const handleCancel = () => {
        resetInputData(inputRef);
        let value = prospectReducer.basicProspect.prospectType.trim()
        if (value == '2') setSelected(true);
        if (value == '1') setSelected(false);
        if (value == '0') setSelected(false);
    };

    const onPressError = (event) => {
        setmodalVisibleError(event)
        dispatch(actionClearPros())
    }

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const handleDisable = (type) => {
        if (prospectReducer.basicProspect && prospectReducer.basicProspect.editGeneralDataFlag === 'N') {
            if (type == "selectDropdown") return true
            if (type == "TextInput") return false
            if (isProspect || isCustomer) {
                if (type == "Radio") return false
            } else if (isRentStation && (disaNoCustcode == false)) {
                if (type == "Radio") return false
            } else {
                if (type == "Radio") return true
            }
        } else if (isCustomer) {
            if (type == "selectDropdownFalse") return false
            if (type == "TextInputTrue") return true
            if (type == "selectDropdown") return true
            if (type == "TextInput") return false
            if (type == "Radio") return false
        }
        if (isRecommandBUProspect) {
            if (type == "selectDropdown") return true
            if (type == "TextInput") return false
            if (type == "Radio") return true
        }
        else if (isRentStation) {
            if (type == "selectDropdown") return false
            if (type == "TextInput") return true
            if (type == "Radio") return false
        }
        else if (isOther) {
            if (type == "selectDropdown") return true
            if (type == "TextInput") return false
            if (type == "Radio") return true
        }
        else {
            if (type == "selectDropdown") return false
            if (type == "TextInput") return true
            if (type == "Radio") return false
        }
    }

    const handleButton = () => {
        if (prospectReducer.basicProspect && prospectReducer.basicProspect.editGeneralDataFlag === 'N' && isProspect) return true
        if (prospectReducer.basicProspect && prospectReducer.basicProspect.editGeneralDataFlag === 'N' && isRentStation) return true
        if (prospectReducer.basicProspect && prospectReducer.basicProspect.editGeneralDataFlag === 'N') {
            if (isCustomer) return true
            return false
        }
        if (isCustomer) return false
        if (isRecommandBUProspect) return false
        if (isRentStation) return true
        if (isOther) return false

        return true
    }

    const handleButtonLatLong = () => {
        if (isCustomer) return true
        if (isProspect && prospectReducer.basicProspect && prospectReducer.basicProspect.editGeneralDataFlag === 'N') return true
        if (isRentStation && prospectReducer.basicProspect && prospectReducer.basicProspect.editGeneralDataFlag === 'N') return true

        return false
    }

    const dataVatNo = () => {
        if (dataBasic && dataBasic.identifyId) {
            let identifyId = dataBasic.identifyId.split('-')
            return identifyId
        }
    }

    //start function modal alert delete

    const handleButtonDelete = () => {
        if (isProspectMyProspect) return true

        return false
    }

    const handleDelete = (event) => {
        setmodalVisibleDelete(event)
        setmodalVisibleDeleteConfirm(!event)
    }

    const onPressModalAlertDeleteConfirm = (event) => {
        // setmodalVisibleDeleteConfirm(event)
        setmodalVisibleDelete(!event)

        //call service for delete here
        dispatch(delProspect(prospectSelectInfoReducer.dataSelect.prospect))
    }

    const onPressColseModalAlertDeleteConfirm = (event) => {
        setmodalVisibleDeleteConfirm(event)

        if ((prospectReducer.delProspect != '') && prospectReducer.delProspect_Loading) {
            dispatch(delProspectClear());
            setErrorMSG('')
            navigation.navigate('ProspectScreen')
        }
        if ((prospectReducer.delProspectErrorMSG != '') && prospectReducer.delProspectErrorMSG_Loading) {
            dispatch(delProspectClear());
            setErrorMSG('')
        }
    }
    // end

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={{ backgroundColor: colors.white, marginBottom: '5%' }}>
                    {/* Create */}
                    <View style={styles.topLabel}>
                        <View>
                            <Text style={{ fontSize: FONT_SIZE.HEADER, fontWeight: 'bold' }}>{getTitle()}</Text>
                        </View>
                    </View>

                    {/* Prospect Info */}
                    <View style={styles.titleLabel}>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                prospectSelectInfoReducer.dataSelect.isCustomer === true ?
                                    <View style={styles.title}>
                                        <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>ข้อมูล Customer</Text>
                                    </View>
                                    :
                                    prospectSelectInfoReducer.dataSelect.isRentStation === true ?
                                        <View style={styles.title}>
                                            <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>ข้อมูลปั๊มเช่า</Text>
                                        </View>
                                        :
                                        prospectSelectInfoReducer.dataSelect.isOther === true ?
                                            <View style={styles.title}>
                                                <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>ข้อมูล Prospect</Text>
                                            </View>
                                            :
                                            <View style={styles.title}>
                                                <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>ข้อมูล Prospect</Text>
                                            </View>
                            }
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Text>Customer</Text>
                                <Switch
                                    value={selectted}
                                    onValueChange={handleSelectCustomer} style={{ marginLeft: '3%' }}
                                    disabled={disaNoCustcode || handleDisable("Radio")}
                                />
                            </View>
                        </View>
                        <View style={styles.input}>
                            <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, fontWeight: 'bold' }}>New Account</Text>
                        </View>
                        <View style={styles.rowLabel}>
                            <View style={styles.input}>
                                <TextInput
                                    title={'ชื่อ'}
                                    ref={el => inputRef.current.accName = el}
                                    REQUIRETITLE
                                    require
                                    massageError={language.NAME}
                                    value={dataBasic ? dataBasic.accName : ''}
                                    maxLength={250}
                                    editable={isRentStation ? false : handleDisable("TextInput")}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                    isOnlyText={true}
                                />
                            </View>
                            <View style={styles.input}>
                                <SelectDropdown
                                    titleKey={"brandNameTh"}
                                    valueKey={"brandId"}
                                    dataList={brand}
                                    titleDropdown={'แบรนด์'}
                                    titleAlert={'แบรนด์'}
                                    ref={el => inputRef.current.brandId = el}
                                    defaultValue={dataBasic ? dataBasic.brandId : ''}
                                    disabled={handleDisable("selectDropdown")}
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />
                            </View>
                        </View>
                        <View style={styles.rowLabel}>
                            <View style={[styles.input, { flexDirection: 'row' }]}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        ref={el => inputRef.current.identifyId = el}
                                        type="ThaiEnNum"
                                        title={'Vat Number'}
                                        maxLength={13}
                                        require={dataIdentifyId}
                                        vatNo
                                        editable={handleDisable("TextInput")}
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                        value={dataVatNo() ? dataVatNo()[0] : ''}
                                        onChangeText={(dataInput) => {
                                            if (dataInput) {
                                                return setDataVatNumber(true)
                                            }
                                            return setDataVatNumber(false)
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 0.1, paddingTop: 45, alignItems: 'center' }}>
                                    <Text> - </Text>
                                </View>
                                <View style={{ flex: 0.6, justifyContent: 'flex-end' }}>
                                    <TextInput
                                        TITLE={false}
                                        ref={el => inputRef.current.vatNumber = el}
                                        type="ThaiEnNum"
                                        maxLength={5}
                                        require={dataVatNumber}
                                        editable={handleDisable("TextInput")}
                                        placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                        value={dataVatNo() ? dataVatNo()[1] : ''}
                                        onChangeText={(dataInput) => {
                                            // let identifyIdData = inputRef.current.identifyId.getInputValue().value;
                                            // if(identifyIdData && !dataInput) setDataVatNumber(true)

                                            if (dataInput) {
                                                return setDataIdentifyId(true)
                                            }
                                            return setDataIdentifyId(false)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.input}>
                                <TextInput
                                    title={'Prospect Group Ref.'}
                                    ref={el => inputRef.current.accGroupRef = el}
                                    value={dataBasic ? dataBasic.accGroupRef : ''}
                                    // type="ThaiEnNum" 
                                    // maxLength={20}
                                    typeKeyboard={"numeric"}
                                    type="Num"
                                    maxLength={13}
                                    editable={handleDisable("TextInput")}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Address */}
                    <Address CREATEPROSPECT={false} basicTab={dataBasic} ref={el => inputRef.current.address = el}
                        editable={handleDisable("TextInput")} disabled={handleDisable("selectDropdown")}
                        editableBasicCustomer={handleButtonLatLong() ? true : false}
                        editableBasicCus={handleDisable("TextInputTrue")}
                        disabledBasicCustomer={handleButtonLatLong() ? true : false}
                        disabledBasicCus={handleDisable("selectDropdownFalse")}
                        isOther={isOther ? true : false}
                    // REQUIRETITLE = {handleDisable("REQUIRETITLE")}
                    />
                </View>
                <View style={{ backgroundColor: colors.white, paddingBottom: '5%' }}>
                    {/* Contact Info */}
                    <ContactInfo CREATEPROSPECT={true} basicTab={dataBasic} ref={el => inputRef.current.contactInfo = el}
                        editable={handleDisable("TextInput")} disabled={handleDisable("selectDropdown")} />

                    {/* Button */}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        {
                            handleButton() && <>
                                {
                                    handleButtonDelete() && <>
                                        <View style={[styles.buttonLow, { alignItems: 'center' }]}>
                                            <Button
                                                onPress={() => handleDelete(true)}
                                                width={'100%'}
                                                title={'Delete'}
                                                fontColor={colors.redButton}
                                                color={colors.white}
                                                colorBorder={colors.redButton} />
                                            <ModalWarning
                                                visible={modalVisibleDelete}
                                                detailText={language.DELETE}
                                                onPressConfirm={() => onPressModalAlertDeleteConfirm(true)}
                                                onPressCancel={() => setmodalVisibleDelete(false)} />
                                            <ModalWarning
                                                visible={modalVisibleDeleteConfirm}
                                                detailText={errorMSG != '' ? errorMSG : language.DELETESUCCESS}
                                                onlyCloseButton={true}
                                                onPressClose={() => onPressColseModalAlertDeleteConfirm(false)} />
                                        </View>
                                    </>
                                }
                                <View style={[styles.buttonLow, { alignItems: handleButtonDelete() ? 'center' : 'flex-end', marginLeft: handleButtonDelete() ? 0 : '20%' }]}>
                                    <Button
                                        onPress={handleCancel}
                                        width={'100%'}
                                        title={'Cancel'}
                                        fontColor={colors.primary}
                                        color={colors.white} />
                                </View>
                                <View style={[styles.buttonLow, { alignItems: handleButtonDelete() ? 'center' : 'flex-start', marginRight: handleButtonDelete() ? 0 : '20%' }]}>
                                    <Button
                                        onPress={() => handleSubmit()}
                                        width={'100%'}
                                        title={'Save'} />
                                    <ModalWarning
                                        visible={modalVisible}
                                        detailText={language.CONFIRN}
                                        onPressConfirm={() => onPressModalAlertConfirm(true)}
                                        onPressCancel={() => setmodalVisible(false)} />
                                    <ModalWarning
                                        visible={modalVisibleConfirm}
                                        detailText={language.CONFIRNSUCCESS}
                                        onlyCloseButton={true}
                                        onPressClose={() => onPressModalAlert(false)} />
                                    <ModalWarning
                                        visible={modalLat}
                                        WARNINGTITLE
                                        onPressClose={() => setmodalLat(false)}
                                        onlyCloseButton
                                        detailText={language.latLongValidate} />
                                    <ModalWarning
                                        visible={modalLong}
                                        WARNINGTITLE
                                        onPressClose={() => setmodalLong(false)}
                                        onlyCloseButton
                                        detailText={language.latLongValidate} />
                                    <ModalWarning
                                        visible={modalLatLong}
                                        WARNINGTITLE
                                        onPressClose={() => setmodalLatLong(false)}
                                        onlyCloseButton
                                        detailText={language.latLongValidate} />
                                </View>
                            </>
                        }
                    </View>
                </View>
            </ScrollView>
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={() => onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={prospectReducer.basicErrorMSG}
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
    titleLabel: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '5%'
    },
    title: {
        paddingVertical: '3%',
    },
    rowLabel: {
        flex: 1,
        width: '100%'
    },
    input: {
        flex: 1,
        paddingBottom: '3%'
    },
    buttonLow: {
        flex: 1,
        paddingHorizontal: '2%',
        marginVertical: '5%',
    },

})

export default SubmenuBasic;
import React, {useState, useRef, useEffect, useImperativeHandle, forwardRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid } from 'react-native';
import { Icon } from 'native-base';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';

import TextInput from './TextInput'
import Text from './Text'
import SelectDropdown from './SelectDropdown'
import Modal from './Modal'
import CheckBox from './CheckBox'

import colors from '../utility/colors'
import { FONT_SIZE } from '../utility/enum';
import language from '../language/th.json'
import { searchProvinceAction } from '../actions/masterAction';
import { getDistrict, getSubdistrict, getRegion } from '../actions/prospectAction';
import { getInputData, resetInputData } from '../utility/helper';

const address = ({ textTitle = 'Address',
    textDetail = 'New Account',
    SA = false,
    ADDRESSCUSTOMER = false,
    CREATEPROSPECT = false,
    editable = true,
    editableBasicCustomer,
    editableBasicCus = true,
    disabled = false,
    disabledBasicCustomer,
    disabledBasicCus = false,
    editableSA = true,
    addressTab,
    basicTab,
    provinceName,
    labelDisplay,
    ADDR,
    saTab,
    editableRemaek = true,
    indexAddress = 0,
    isOther = false
}, ref) => {

    const { masterReducer } = useSelector((state) => state);
    const { prospectReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    const [mainAddressFlag, setMainAddressFlag] = useState(false);
    const [shiftToFlag, setShiftToFlag] = useState(false);
    const [billToFlag, setBillToFlag] = useState(false);
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [location, setLocation] = useState('');
    const [distirctList, setDistrictList] = useState(prospectReducer.distirct)
    const [subdistirctList, setSubDistirctList] = useState(prospectReducer.subdistirct)
    const [modalMapVisible, setModalMapVisible] = useState(false)
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 13.710068809,
        longitude: 100.629197831,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    // const [indexAddress, setIndexAddress] = useState(0);
    const [subDistirctDisable, setSubDistirctDisable] = useState(false);

    useEffect(() => {
        requestLocationPermission()
        getLocAction()
        
        // if (!masterReducer.province.length) {
        dispatch(searchProvinceAction())
        // }

        if (!prospectReducer.region.length) {
            dispatch(getRegion())
        }

    }, [])

    useEffect(() => {
        if (addressTab && addressTab[indexAddress || 0].mainAddressFlag) {
            let value = addressTab[indexAddress || 0].mainAddressFlag
            if (value == "1") return setMainAddressFlag(true)
            return setMainAddressFlag(false)
        }
    }, [addressTab, indexAddress])
    useEffect(() => {
        if (addressTab && addressTab[indexAddress || 0].shiftToFlag) {
            let value = addressTab[indexAddress || 0].shiftToFlag
            if (value == "1") return setShiftToFlag(true)
            return setShiftToFlag(false)
        }
    }, [addressTab, indexAddress])
    useEffect(() => {
        if (addressTab && addressTab[indexAddress || 0].billToFlag) {
            let value = addressTab[indexAddress || 0].billToFlag
            if (value == "1") return setBillToFlag(true)
            return setBillToFlag(false)
        }
    }, [addressTab, indexAddress])

    useEffect(() => {
        if (province) {
            setProvince(province)
            // setSubDistirctDisable(true)
            dispatch(getDistrict(province))
            setDistrict('')
        }
    }, [province])

    useEffect(() => {
        // if (district && (disabled == true && basicTab)) {
        //     dispatch(getSubdistrict()) 
        // } else {
        //     dispatch(getSubdistrict(district)) 
        // }
        if (district) {
            dispatch(getSubdistrict(district))
        }
    }, [district])

    useEffect(() => {
        setDistrictList(prospectReducer.distirct)
    }, [prospectReducer.distirct])

    useEffect(() => {
        setSubDistirctList(prospectReducer.subdistirct)
    }, [prospectReducer.subdistirct])

    useEffect(() => {
        if (!masterReducer.province.length) {
            dispatch(searchProvinceAction())
        }
    }, [editable])

    useImperativeHandle(ref, () => ({
        getInputValue() {
            let totalValue = getInputData(inputRef, 'C');
            return { isInvalid: totalValue.isInvalid, value: totalValue, isChange: !totalValue.isNotChange, title: totalValue.changeField, };
        },
        resetValue() {
            resetInputData(inputRef);
        },
        clear() {
            setIsError(false);
            setEerrorMessage('');
            setText('');
        },
    }));

    const requestLocationPermission = async () =>{
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
                buttonPositive: "OK"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // console.warn("You can use the location");
              getLocAction()
            } else {
              console.warn("Location permission denied");
            }
          } catch (err) {
            console.warn(err);
        }
    }

    const getLocAction = async () => {
        return Geolocation.getCurrentPosition(
            info => {
                setCurrentLocation({ ...currentLocation, latitude: info.coords.latitude, longitude: info.coords.longitude })
            },
            error => Alert.alert('Error ', JSON.stringify(error.message)),
            { 
                enableHighAccuracy: true, 
                timeout: 20000, 
                maximumAge: 3600000
            },
        )
    }
    
    const onPressMarker = (item) => {
        let addLatLong = { ...location, longitude: item.nativeEvent.coordinate.longitude, latitude: item.nativeEvent.coordinate.latitude }
        setLocation(addLatLong)
        setModalMapVisible(false)
    }

    const getValue = (key) => {
        if (ADDR && saTab) {
            return ADDR[key] || saTab[key]
        }

        if (basicTab) {
            return basicTab[key]
        }

        if (addressTab && addressTab.length) {
            try {
                return addressTab[indexAddress || 0][key]

            } catch {
                return addressTab[0][key]
            }
        }

        return ''
    }

    const handleLatLongData = (type) => {
        if (addressTab) {
            if (type == "latitude") return addressTab[indexAddress || 0].latitude
            if (type == "longitude") return addressTab[indexAddress || 0].longitude
        }
        if (basicTab) {
            if (type == "latitude") return (JSON.stringify(location.latitude) || basicTab.latitude)
            if (type == "longitude") return (JSON.stringify(location.longitude) || basicTab.longitude)
        }
        if (saTab && ADDR) {
            if (type == "latitude") return ADDR.latitude
            if (type == "longitude") return ADDR.longitude
        }
        return ''
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={{ backgroundColor: colors.white, marginBottom: '10%' }}>
                {/* Address */}
                <View style={styles.titleLabel}>
                    <View style={styles.title}>
                        <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>{textTitle}</Text>
                    </View>
                    {
                        CREATEPROSPECT ?
                            <View style={styles.title}>
                                <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>{textDetail} </Text>
                            </View>
                            :
                            null
                    }
                    {
                        SA ?
                            <View>
                                <View style={styles.input}>
                                    <TextInput title={'เลขที่โฉนด'} editable={editableSA} ref={el => inputRef.current.addrTitleDeedNo = el} maxLength={10}
                                        value={getValue('addrTitleDeedNo')} type="Num" typeKeyboard={"numeric"}
                                        placeholder={editableSA == false ? '-' : ''}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput title={'เลขที่ดิน'} editable={editableSA} ref={el => inputRef.current.addrParcelNo = el} maxLength={10}
                                        value={getValue('addrParcelNo')} type="Num" typeKeyboard={"numeric"}
                                        placeholder={editableSA == false ? '-' : ''}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput title={'หน้าสำรวจ'} editable={editableSA} ref={el => inputRef.current.addrTambonNo = el} maxLength={250}
                                        value={getValue('addrTambonNo')}
                                        placeholder={editableSA == false ? '-' : ''}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput title={'ประเภทโฉนดที่ดิน'} editable={editableSA} ref={el => inputRef.current.addrCertUtilisation = el} maxLength={250}
                                        value={getValue('addrCertUtilisation')}
                                        placeholder={editableSA == false ? '-' : ''}
                                    />
                                </View>
                            </View>
                            :
                            ADDRESSCUSTOMER ?
                                <View style={{}}>
                                    <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 15, alignItems: 'flex-end' }}>
                                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
                                            <Text>Main Address</Text>
                                            <CheckBox //disabled={disabled}
                                                checked={mainAddressFlag} disabled={disabled} disableType={mainAddressFlag ? 'view' : 'disable'}
                                                onPress={() => setMainAddressFlag(!mainAddressFlag)} style={{ marginLeft: 15 }}
                                            />
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
                                            <Text>Ship To</Text>
                                            <CheckBox
                                                checked={shiftToFlag} disabled={disabled} disableType={shiftToFlag ? 'view' : 'disable'}
                                                onPress={() => setShiftToFlag(!shiftToFlag)} style={{ marginLeft: 15 }} />
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
                                            <Text>Bill To</Text>
                                            <CheckBox
                                                checked={billToFlag} disabled={disabled} disableType={billToFlag ? 'view' : 'disable'}
                                                onPress={() => setBillToFlag(!billToFlag)} style={{ marginLeft: 15 }} />
                                        </View>
                                    </View>
                                </View>
                                :
                                null
                    }

                    <View style={styles.input}>
                        <TextInput
                            value={getValue('addrNo')} type={"NumSlash"}
                            title={'เลขที่บ้าน'} editable={editable} ref={el => inputRef.current.addrNo = el} maxLength={50} labelDisplay={labelDisplay}
                            placeholder={editable == false ? '-' : ''} />
                    </View>
                    <View style={styles.input}>
                        <TextInput
                            value={getValue('moo')}
                            title={'หมู่ที่'} editable={editable} ref={el => inputRef.current.moo = el} maxLength={50} labelDisplay={labelDisplay}
                            placeholder={editable == false ? '-' : ''} />
                    </View>
                    <View style={styles.input}>
                        <TextInput
                            value={getValue('soi')}
                            title={'ตรอก/ซอย'} editable={editable} ref={el => inputRef.current.soi = el} maxLength={50} labelDisplay={labelDisplay}
                            placeholder={editable == false ? '-' : ''} />
                    </View>
                    <View style={styles.input}>
                        <TextInput
                            value={getValue('street')}
                            title={'ถนน'} editable={editable} ref={el => inputRef.current.street = el} maxLength={50} labelDisplay={labelDisplay}
                            placeholder={editable == false ? '-' : ''} />
                    </View>
                    <View style={styles.input}>
                        <TextInput
                            value={getValue('tellNo')} type={"ThaiEnNum"}
                            title={'เบอร์โทรศัพท์'} editable={editable} ref={el => inputRef.current.tellNo = el} maxLength={20} labelDisplay={labelDisplay}
                            placeholder={editable == false ? '-' : ''} />
                    </View>
                    <View style={styles.input}>
                        <TextInput
                            value={getValue(basicTab ? 'addressFaxNo' : addressTab ? 'faxNo' : saTab ? 'faxNo' : '')} typeKeyboard={'numeric'} type={"Num"}
                            title={'เบอร์แฟกซ์'} editable={editable} ref={el => inputRef.current.faxNo = el} maxLength={10} labelDisplay={labelDisplay}
                            placeholder={editable == false ? '-' : ''} />
                    </View>
                    {
                        CREATEPROSPECT ?
                            <View>
                                <View style={styles.rowLabel}>
                                    <View style={{flex: 0.8}}>
                                        <View style={styles.input}>
                                            <TextInput
                                                value={JSON.stringify(location.latitude)}
                                                title={'Latitude'}
                                                ref={el => inputRef.current.latitude = el}
                                                editable={editable}
                                                type={"NumFullStop"}
                                                typeKeyboard={'numeric'}
                                                maxLength={50}
                                            />
                                        </View>
                                        <View style={styles.input}>
                                            <TextInput
                                                value={JSON.stringify(location.longitude)}
                                                title={'Longitude'}
                                                ref={el => inputRef.current.longitude = el}
                                                editable={editable}
                                                type={"NumFullStop"}
                                                typeKeyboard={'numeric'}
                                                maxLength={50}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flex: 0.2, justifyContent: 'center', marginLeft: '3%'}}>
                                        <TouchableOpacity onPress={() => setModalMapVisible(true)} style={{ alignItems: 'center', marginTop: 40 }}>
                                            <Icon type="MaterialIcons" name="gps-fixed" style={{ fontSize: 45 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.input}>
                                    <SelectDropdown
                                        titleKey={"provinceNameTh"}
                                        valueKey={"provinceCode"}
                                        dataList={masterReducer.province}
                                        titleDropdown={'จังหวัด'}
                                        titleAlert={'จังหวัด'}
                                        ref={el => inputRef.current.provinceCode = el}
                                        REQUIRETITLE
                                        require
                                        massageError={language.PROVINCE}
                                        onPress={(item) => {
                                            setProvince(item)
                                            setDistrictList([])
                                            setSubDistirctList([])
                                            inputRef.current.districtCode.clear()
                                            inputRef.current.subdistrictCode.clear()
                                        }}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <SelectDropdown
                                        disabled={!province}
                                        titleKey={"districtNameTh"}
                                        valueKey={"districtCode"}
                                        dataList={distirctList}
                                        titleDropdown={'อำเภอ/เขต'}
                                        titleAlert={'อำเภอ/เขต'}
                                        ref={el => inputRef.current.districtCode = el}
                                        REQUIRETITLE
                                        require
                                        massageError={language.DISTRICT}
                                        onPress={(item) => {
                                            setDistrict(item)
                                            setSubDistirctList([])
                                            inputRef.current.subdistrictCode.clear()
                                        }}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <SelectDropdown
                                        disabled={!district}
                                        titleKey={"subdistrictNameTh"}
                                        valueKey={"subdistrictCode"}
                                        dataList={subdistirctList || []}
                                        titleDropdown={'ตำบล/แขวง'}
                                        titleAlert={'ตำบล/แขวง'}
                                        ref={el => inputRef.current.subdistrictCode = el}
                                        REQUIRETITLE
                                        require
                                        massageError={language.SUBDISTRICT}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput
                                        title={'รหัสไปรษณีย์'}
                                        editable={editable}
                                        type="Num"
                                        typeKeyboard={'numeric'}
                                        ref={el => inputRef.current.postCode = el}
                                        maxLength={5} />
                                </View>
                                <View>
                                    <View style={[styles.input]}>
                                        <TextInput
                                            title={'หมายเหตุ'}
                                            editable={editable}
                                            maxLength={150}
                                            ref={el => inputRef.current.remark = el}
                                            heightBox={90}
                                            multiline={true}
                                            isOnlyText={true}
                                        />
                                    </View>
                                </View>
                            </View>
                            :
                            <View>
                                <View style={styles.rowLabel}>
                                    <View style={{flex: 0.8}}>
                                        <View style={styles.input}>
                                            <TextInput
                                                value={handleLatLongData("latitude")}
                                                title={'Latitude'}
                                                ref={el => inputRef.current.latitude = el}
                                                editable={editableBasicCustomer ? editableBasicCus : editable}
                                                maxLength={50}
                                                type={"NumFullStop"}
                                                typeKeyboard={'numeric'}
                                                labelDisplay={labelDisplay}
                                                placeholder={editableBasicCus == true && basicTab && (isOther == false) ? '' : editable == false ? '-' : ''}
                                            />
                                        </View>
                                        <View style={styles.input}>
                                            <TextInput
                                                value={handleLatLongData("longitude")}
                                                title={'Longitude'}
                                                ref={el => inputRef.current.longitude = el}
                                                editable={editableBasicCustomer ? editableBasicCus : editable}
                                                maxLength={50}
                                                type={"NumFullStop"}
                                                typeKeyboard={'numeric'}
                                                labelDisplay={labelDisplay}
                                                placeholder={editableBasicCus == true && basicTab && (isOther == false) ? '' : editable == false ? '-' : ''}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flex: 0.2, justifyContent: 'center', marginLeft: '3%'}}>
                                        <TouchableOpacity disabled={disabledBasicCustomer ? disabledBasicCus : disabled} labelDisplay={labelDisplay} onPress={() => setModalMapVisible(true)} style={{ alignItems: 'center', marginTop: 40 }}>
                                            <Icon type="MaterialIcons" name="gps-fixed" style={{ fontSize: 45, color: labelDisplay ? colors.white : colors.black }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.input}>
                                    <SelectDropdown
                                        defaultValue={getValue('regionCode')}
                                        disabled={disabled}
                                        titleKey={"regionNameTh"}
                                        valueKey={"regionCode"}
                                        dataList={prospectReducer.region}
                                        titleDropdown={'ภูมิภาค'}
                                        titleAlert={'ภูมิภาค'}
                                        ref={el => inputRef.current.regionCode = el}
                                        placeholder={addressTab ? '-' : basicTab && disabled == true ? '-' : saTab ? '-' : ''}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <SelectDropdown
                                        defaultValue={getValue('provinceCode')}
                                        disabled={disabled}
                                        titleKey={"provinceNameTh"}
                                        valueKey={"provinceCode"}
                                        dataList={masterReducer.province}
                                        titleDropdown={'จังหวัด'}
                                        titleAlert={'จังหวัด'}
                                        ref={el => inputRef.current.provinceCode = el}
                                        REQUIRETITLE
                                        require
                                        massageError={language.PROVINCE}
                                        onPress={(item) => {
                                            setProvince(item)
                                            setDistrictList([])
                                            setSubDistirctList([])
                                            inputRef.current.districtCode.clear()
                                            inputRef.current.subdistrictCode.clear()
                                        }}
                                        placeholder={addressTab ? '-' : basicTab && disabled == true ? '-' : saTab ? '-' : ''}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <SelectDropdown
                                        disabled={disabled || !province}
                                        defaultValue={getValue('districtCode')}
                                        titleKey={"districtNameTh"}
                                        valueKey={"districtCode"}
                                        dataList={prospectReducer.distirct}
                                        titleDropdown={'อำเภอ/เขต'}
                                        titleAlert={'อำเภอ/เขต'}
                                        ref={el => inputRef.current.districtCode = el}
                                        REQUIRETITLE
                                        require
                                        massageError={language.DISTRICT}
                                        onPress={(item) => {
                                            setDistrict(item)
                                            setSubDistirctList([])
                                            inputRef.current.subdistrictCode.clear()
                                        }}
                                        placeholder={addressTab ? '-' : basicTab && disabled == true ? '-' : saTab ? '-' : ''}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <SelectDropdown
                                        disabled={disabled || !district}
                                        defaultValue={getValue('subdistrictCode')}
                                        titleKey={"subdistrictNameTh"}
                                        valueKey={"subdistrictCode"}
                                        dataList={prospectReducer.subdistirct}
                                        titleDropdown={'ตำบล/แขวง'}
                                        titleAlert={'ตำบล/แขวง'}
                                        ref={el => inputRef.current.subdistrictCode = el}
                                        REQUIRETITLE
                                        require
                                        massageError={language.SUBDISTRICT}
                                        placeholder={addressTab ? '-' : basicTab && disabled == true ? '-' : saTab ? '-' : ''}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <TextInput
                                        value={getValue('postCode')}
                                        title={'รหัสไปรษณีย์'}
                                        editable={editable}
                                        ref={el => inputRef.current.postCode = el}
                                        maxLength={5}
                                        typeKeyboard={'numeric'}
                                        labelDisplay={labelDisplay}
                                        placeholder={editable == false ? '-' : ''}
                                    />
                                </View>
                                <View>
                                    <View style={[styles.input]}>
                                        <TextInput
                                            value={getValue(basicTab ? 'addressRemark' : addressTab ? 'remark' : saTab ? 'remark' : '')}
                                            title={'หมายเหตุ'}
                                            maxLength={150}
                                            editable={saTab ? editableRemaek : editable}
                                            ref={el => inputRef.current.remark = el}
                                            labelDisplay={labelDisplay}
                                            placeholder={editableRemaek == false ? '-' : !saTab && editable == false ? '-' : ''}
                                            heightBox={90}
                                            multiline={true}
                                            isOnlyText={true}
                                        />
                                    </View>
                                </View>
                            </View>
                    }

                </View>
            </View>


            <Modal visible={modalMapVisible} onPressCancel={() => setModalMapVisible(false)}>
                <MapView
                    style={{ width: '100%', height: 500}}
                    onPress={(e) => { setLocation(e.nativeEvent.coordinate) }}
                    initialRegion={currentLocation}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    {
                        location ? <Marker
                            key={1}
                            coordinate={location}
                            title={"ADD"}
                            description={""}
                            onCalloutPress={(e) => { onPressMarker(e) }}
                        >
                            <Callout>
                            </Callout>
                        </Marker>
                            :
                            null
                    }
                </MapView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    titleLabel: {
        flex: 1,
        justifyContent: 'center',
        padding: '5%'
    },
    title: {
        paddingVertical: '2%',
    },
    rowLabel: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    input: {
        flex: 1 / 2,
        paddingVertical: '2%'
    },
    lalongLabel: {
        flexDirection: 'row',
        flex: 1 / 2,
        paddingHorizontal: '2%'
    },
})

export default forwardRef(address);
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, Callout} from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native'
import { Switch } from 'native-base';

import { Text, TextInput, SelectDropdown, Button, Modal, ModalWarning, LoadingOverlay } from '../../components';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import { getInputData, validateLatLng } from '../../utility/helper';
import language from '../../language/th.json';
import colors from '../../utility/colors';
import { searchProvinceAction, searchLocTypeAction, addLocAction, updLocAction, getLocAction, actionClear } from '../../actions/masterAction';

const AddEditLocation = (props) => {

    const navigation = useNavigation();
    const {masterReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const [locationAdd, setLocationAdd] = useState()
    const [location, setLocation] = useState('');
    const [province, setProvince] = useState([]);
    const [locationType, setLocationType] = useState([]);
    const inputRef = useRef({});
    const [modalVisibleConfirm, setmodalVisibleConfirm] = useState(false);
    const [modalMapVisible, setModalMapVisible] = useState(false)
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    const [checked, setChecked] = React.useState('Y');
    const [selectCheckBox, setSelectCheckBox] = useState(false);
    const [modalLatLong, setmodalLatLong] = useState(false);

    const [currentLocation, setCurrentLocation] = useState({ latitude: 13.710068809,
        longitude: 100.629197831,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421, 
    })
    const [marker, setMarker] = useState(null)

    useEffect(() => {
        
        requestLocationPermission()
        getLocActionMap()

        if (masterReducer.province_loading) {
            dispatch(searchProvinceAction()) 
        }

        if (masterReducer.locationtype_loading) {
            dispatch(searchLocTypeAction()) 
        }

        if (props.route.params) {
            setLocationAdd(props.route.params.locationAdd)
        }

    }, [])

    useFocusEffect(
        React.useCallback(() => {
                if (props.route.params && props.route.params.locationAdd) {
                    if (props.route.params.locationAdd.activeFlag == '') return
                    let value = props.route.params.locationAdd.activeFlag.trim()
                    if (value == "Y") setSelectCheckBox(true)
                    if (value == "N") setSelectCheckBox(false)
                }
            return () => {
          };
        }, [])
    );

    useEffect(() => {

        if (!masterReducer.province_loading) {
            if (!masterReducer.province) return

            let addTitleProvince = masterReducer.province.map((item) => {
                return {...item, title: item.provinceNameTh}
            })
            setProvince(addTitleProvince)
        }

        if (!masterReducer.locationtype_loading) {
            if (!masterReducer.locationtype) return

            let addTitleLocType = masterReducer.locationtype.map((item) => {
                return {...item, title: item.locTypeNameTh}
            })
            setLocationType(addTitleLocType)
        }

        if (masterReducer.addLocationloadingSuccess && !masterReducer.addLocationloadingError) {
            dispatch(getLocAction())
            setmodalVisibleConfirm(true)
        } 

        if (!masterReducer.addLocationloadingSuccess && masterReducer.addLocationloadingError)  {
            setmodalVisibleError(true)
        }

    }, [masterReducer])

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
              getLocActionMap()
            } else {
              console.warn("Location permission denied");
            }
          } catch (err) {
            console.warn(err);
        }
    }

    const getLocActionMap = async () => {
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

    const handleSubmit = () => {
        if (locationAdd) {
            let totalValue = getInputData(inputRef);

            if (!totalValue.isInvalid) {  
                let flagActive = ''
                if (selectCheckBox == true) flagActive = "Y"
                if (selectCheckBox == false) flagActive = "N"

                let latData = totalValue.data.latitude
                let longData = totalValue.data.longitude

                if ((latData || longData) && !validateLatLng(latData, longData)) {
                    setmodalLatLong(true)
                } else {
                    dispatch(updLocAction(locationAdd, totalValue.data, flagActive));
                }
                // dispatch(updLocAction(locationAdd, totalValue.data, flagActive));
        }} else {
            let totalValue = getInputData(inputRef);

            if (!totalValue.isInvalid) {
                let latData = totalValue.data.latitude
                let longData = totalValue.data.longitude

                if ((latData || longData) && !validateLatLng(latData, longData)) {
                    setmodalLatLong(true)
                } else {
                    dispatch(addLocAction(totalValue.data, location));
                }
                // dispatch(addLocAction(totalValue.data, location));
        }}
    }

    const onPressConfirm = (event) => {
        setmodalVisibleConfirm(event)
        navigation.navigate('LocationMasterScreen')
    }

    const onPressMarker = (item) => {
        if (locationAdd) {
            let updateLatLon = {...locationAdd, longitude: item.nativeEvent.coordinate.longitude, latitude: item.nativeEvent.coordinate.latitude}
            setLocationAdd(updateLatLon)
            setModalMapVisible(false)

        } else {
            let addLatLong = {...location, longitude: item.nativeEvent.coordinate.longitude, latitude: item.nativeEvent.coordinate.latitude}
            setLocation(addLatLong)
            setModalMapVisible(false)
        }
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
        return !locationType || !province
        // return true
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

    return (
        <View style={styles.container}>
            <ScrollView style={{marginBottom: '5%'}}>
            <View style={styles.alertTitle}>
                <Text style={{...styles.modalTitle}}>{language.LOCATIONMENU}</Text>
            </View>
            <View style={{paddingHorizontal: '5%', marginTop: '5%'}}>
                {
                    locationAdd ?
                    <View style={{marginVertical: '2%'}}>
                        <TextInput
                            title={'รหัส'}
                            editable={false}
                            value={locationAdd.locCode} 
                        />
                    </View>
                    :
                    null
                }
                
                <View style={{marginVertical: '2%'}}>
                    <TextInput 
                        value={locationAdd ? locationAdd.locNameTh : ''} 
                        title={'ชื่อสถานที่'}
                        REQUIRETITLE={true}
                        require={true}
                        massageError={language.LOCATIONNAME}
                        ref={el => inputRef.current.locNameTh = el}
                    />
                </View>
                <View style={{marginVertical: '2%'}}>
                    <SelectDropdown
                        value={locationAdd ? locationAdd.provinceCode : ''} 
                        titleKey={"provinceNameTh"}
                        valueKey={"provinceCode"}
                        dataList={province}
                        titleDropdown={'ชื่อจังหวัด'}
                        titleAlert={'ชื่อจังหวัด'}
                        ref={el => inputRef.current.provinceCode = el}
                        REQUIRETITLE
                        require
                        massageError={language.PROVINCE}
                        defaultValue={locationAdd ? locationAdd.provinceCode : ''}
                    />
                </View>
                <View style={{marginVertical: '2%', flexDirection: 'row'}}>
                    <View style={{flex: 1, paddingEnd: '5%'}}>
                        <View style={{flex: 1, marginBottom: '2%'}}>
                            <TextInput
                                title={'Latitude'} 
                                value={locationAdd ? locationAdd.latitude.toString() : '' || JSON.stringify(location.latitude)}
                                ref={el => inputRef.current.latitude = el}
                                REQUIRETITLE
                                require
                                massageError={language.LATITUDE}
                                maxLength={50}
                                type={"NumFullStop"}
                                typeKeyboard={'numeric'}
                            />
                        </View>
                        <View style={{flex: 1, marginTop: '2%'}}>
                            <TextInput 
                                title={'Longitude'} 
                                value={locationAdd ? locationAdd.longitude.toString() : '' || JSON.stringify(location.longitude)}
                                ref={el => inputRef.current.longitude = el}
                                REQUIRETITLE
                                require
                                massageError={language.LONGITUDE}
                                maxLength={50}
                                type={"NumFullStop"}
                                typeKeyboard={'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{flex: 2/10, justifyContent: 'center'}}>
                        <TouchableOpacity 
                            onPress={() => setModalMapVisible(true)} 
                            style={{alignItems: 'center', marginTop: '60%'}}>
                            <Icon type="MaterialIcons" name="gps-fixed" style={{fontSize:FONT_SIZE.TITLE}}/> 
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginVertical: '2%'}}>
                    <SelectDropdown
                        value={locationAdd ? locationAdd.locTypeId : ''} 
                        titleKey={"locTypeNameTh"}
                        valueKey={"locTypeId"}
                        dataList={locationType}
                        titleDropdown={'ประเภทสถานที่'}
                        titleAlert={'ประเภทสถานที่'}
                        ref={el => inputRef.current.locTypeId = el}
                        REQUIRETITLE={true}
                        require={true}
                        massageError={language.LOCATIONTYPE}
                        defaultValue={locationAdd ? locationAdd.locTypeId : ''}
                        />
                </View>
                {
                    locationAdd ?
                    <View style={{marginVertical: '2%', height: '5%', justifyContent: 'center', marginTop: '3%'}}>    
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginRight: '2%'}}>
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
                        detailText={locationAdd ? language.EDITSUCCESS : language.CONFIRNSUCCESS}/>
                    <ModalWarning
                        visible={modalLatLong}
                        WARNINGTITLE
                        onPressClose={()=> setmodalLatLong(false)}
                        onlyCloseButton
                        detailText={language.latLongValidate}/>
                </View>
            </View>
            <Modal visible={modalMapVisible} onPressCancel={() => setModalMapVisible(false)}>
                <MapView
                    style={{ width: '100%', height: 500}}
                    onPress={(e) => { setMarker(e.nativeEvent.coordinate)}}
                    initialRegion={currentLocation}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                {
                    marker ? <Marker
                        key={1}
                        coordinate={marker}
                        title={"ADD"}
                        description={""}
                        onCalloutPress={(e) => {onPressMarker(e)}}
                    >
                        <Callout>
                        </Callout>
                    </Marker>
                    :
                    null
                }
                </MapView>
            </Modal>
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={masterReducer.locationerrorMSG}
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

export default AddEditLocation;
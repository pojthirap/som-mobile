import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Alert, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { Icon, Input } from 'native-base'
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';

import { Text, Button, CardTaskPlanTrip, Modal, SelectDropdown, TextInput, Header, TimePicker, CheckBox, ModalWarning, LoadingOverlay } from '../../components';
import colors from '../../utility/colors';
import { FONT_SIZE } from '../../utility/enum';
import { viewSaleDetail, searchLoc, planTripStart, planTripFinish, getProspectForCreatePlanTripAdHoc, addPlanTripProspectAdHoc, getProspectLocAdhoc, viewPlanTripTaskAction, getLastCheckIn } from '../../actions/SaleVIsit';
import { waypoint } from '../../utility/helper'
import { getLocAction } from '../../actions/masterAction';
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Checkbox, RadioButton } from 'react-native-paper';
import { getDistanceFromLatLonInKm, getGoogleFromLatLonInKm } from '../../utility/helper'

const SaleVisitPlanTrip = ({ route, navigate }) => {
    const { startCheckinLocId, startCheckinMileNo, stopCheckinLocId, stopCheckinMileNo, totalKmSystem } = route.params.planTrip;
    const { authReducer } = useSelector((state) => state);
    let listPermission = authReducer.userProfile.listPermObjCode;
    const navigation = useNavigation()
    const [isComplete, setIsComPlete] = useState(startCheckinLocId != '' && stopCheckinLocId != '' ? true : false)
    //const [isComplete,setIsComPlete] = useState(false )
    const { planTrip } = route.params
    const [isVisible, setVisible] = useState(false);
    const [isShowModalAddPlan, setIsShowModalAddPlan] = useState(false);
    const [isShowModalAddPlanConfirm, setIsShowModalAddPlanConfirm] = useState(false);
    const [bestRoutes, setBestRoutes] = useState([]);
    const [data, setData] = useState([]);
    const [start, setStart] = useState([]);
    const [adhocs, setAdHocs] = useState([]);
    const [locAdhocs, setLocAdhocs] = useState([]);
    const [end, setEnd] = useState([]);
    const [acc, setAcc] = useState(null);
    const [checkStart, setCheckStart] = useState(null);
    const [checkStartMile, setCheckStartMile] = useState('');
    const [checkEnd, setCheckEnd] = useState(null);
    const [checkEndMile, setCheckEndMile] = useState('');
    const [totalRoute, setTotalRoute] = useState(0);
    const [selectAdhoc, setSelectAdHoc] = useState(null);
    const [selectAdHocLoc, setSelectAdHocLoc] = useState(null);
    const [isLocation, setIsLocaltion] = useState(false)
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [adHocStart, setAdHocStart] = useState(null)
    const [isAdHocPropspect, setIsAdHocPropspect] = useState(true)
    const [adHocEnd, setAdHocEnd] = useState(null)
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 13.769299,
        longitude: 100.433536,
        latitudeDelta: 13.769299,
        longitudeDelta: 0.0421,
    })
    const [isStart, setIsStart] = useState(false);
    const [startLoad, setStartLoad] = useState(false)
    const [endLoad, setEndLoad] = useState(false)
    const onPressModal = (event) => {
        setIsShowModalAddPlan(event);
    }
    const [isError, setIsError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [isCheckOut, setIsCheckOut] = useState(false);
    const [perButtonAddHoc, setPerButtonAddHoc] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false)
    const [confirmMessage, setConfirmMessage] = useState('')
    const [saveLoad, setSaveLoad] = useState(false)

    const onPressBestRoute = async () => {
        const { latitude, longitude } = checkStart
        if (isStart) {
            const endRoute = checkEnd ? { latitude: checkEnd.latitude, longitude: checkEnd.longitude } : { latitude: data[data.length - 1].latitude, longitude: data[data.length - 1].longitude }
            const br = await waypoint({ latitude, longitude }, endRoute, data)
            if (br) {
                setTotalRoute(br.distance)
                let sortByWaypoint = []
                br.waypointOrder.map((way) => {
                    sortByWaypoint.push(data[way])
                })
                setBestRoutes(sortByWaypoint)
                setData(sortByWaypoint)
            }
            setVisible(true);
        }
    }

    useEffect(() => {
        requestLocationPermission();
        setIsComPlete(startCheckinLocId && stopCheckinLocId ? true : false)
        //setIsComPlete(false)
        getData();
        getLocAction();

    }, [])

    const getDataAdHoc = async () => {
        let list = await getProspectForCreatePlanTripAdHoc(`${planTrip.planTripId}`);
        list = list.filter(obj => {
            if (obj.latitude && obj.longitude) {
                const propsObj = data.find(val => val.prospId === obj.prospAccId)
                if (!propsObj)
                    return obj
            }
        })

        let filterOnlyLat = list.filter((item) => {
            return (item.latitude && isFinite(item.latitude) && Math.abs(item.latitude) <= 90), (item.longitude && isFinite(item.longitude) && Math.abs(item.longitude) <= 180);
        })

        let addCustProsLabel = filterOnlyLat.map((custPros, index) => {
            return { ...custPros, codeNameLabel: custPros.custCode != "" ? custPros.custCode + ' : ' + custPros.accName : custPros.prospectId + ' : ' + custPros.accName + ' ' + custPros.addressFullnm }
        })
        setAdHocs(addCustProsLabel);
    }

    const dateDataLoc = async () => {
        let list = await getProspectLocAdhoc();
        list = list.filter(obj => obj.activeFlag === 'Y')
        list = list.filter(obj => {
            const propsObj = data.find(val => val.prospId === obj.prospAccId)
            if (!propsObj)
                return obj
        })

        let filterOnlyLat = list.filter((item) => {
            return (item.latitude && isFinite(item.latitude) && Math.abs(item.latitude) <= 90), (item.longitude && isFinite(item.longitude) && Math.abs(item.longitude) <= 180);
        })

        setLocAdhocs(filterOnlyLat);
    }

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

    const getStartLoc = async (vals = data) => {
        const res = await searchLoc();
        let startObj = null;
        if (startCheckinLocId) {
            startObj = res.find(obj => obj.locId === startCheckinLocId)
            if (startObj) {
                setCheckStart(startObj)
                setCheckStartMile(startCheckinMileNo.toString())
                setIsStart(true)
            }
        }
        let list = res.filter(obj => {
            let res = obj
            let plan = vals.find(val => val.locId == obj.locId)
            if (!plan) return res
        })
        list = list.filter(val => validateLatLng(val.latitude, val.longitude))
        setStart(list)
        setEnd(list)
        if (stopCheckinLocId && startObj) {

            let stop = res.find(obj => obj.locId === stopCheckinLocId)
            if (stop) {
                setCheckEnd(stop)
                setCheckEndMile(stopCheckinMileNo.toString())
            }
        } else if (startObj) {
            startPlan(startObj)
            // const res = await searchLoc(startObj);
            // let listEnd = res.filter(obj=>{
            //     let res = obj
            //     let plan = list.find(val=> val.locId === obj.locId )
            //     if(!plan) return res
            // })
            // setEnd(listEnd)
        }
    }

    const getData = async () => {
        getLocAction();
        // const data = await viewSaleDetail(`0`);
        setSaveLoad(true)
        const data = await viewSaleDetail(`${planTrip.planTripId}`);
        setSaveLoad(false)
        if (data[0].listPlanTripProspect) {
            setData(data[0].listPlanTripProspect)
            setAcc(data[0].planTrip)
            getStartLoc(data[0].listPlanTripProspect);
            getLocAction();
            getDataAdHoc();
            dateDataLoc();
        }
        return
    }

    const startPlan = async (obj) => {
        setCheckStart(obj)
        const res = await searchLoc(obj);
        let list = res.filter(obj => {
            let res = obj
            let plan = data.find(val => val.locId === obj.locId)
            if (!plan) return res
        })
        // setEnd(list)
        return
    }
    const checkIn = async () => {
        if (checkStartMile && checkStart.locId && !startLoad) {
            setStartLoad(true);
            const res = await planTripStart(`${checkStart.locId}`, checkStartMile, `${planTrip.planTripId}`)
            setIsStart(res)
            setStartLoad(false);
            setIsError(true);
            setMsgError('บันทึกข้อมูลสำเร็จ')
            if (!res)
                Alert.alert('เกิดข้อผิดพลาด')
        } else {
            setIsError(true);
            setMsgError('กรุณาระบุ เลขไมล์')
        }
    }
    const pressCheckOut = () => {
        if (parseInt(checkEndMile) < parseInt(checkStartMile)) {
            setIsConfirm(true)
            setConfirmMessage('กรุณายืนยันข้อมูล เนื่องจากเลขไมล์ Finish น้อยกว่าเลขไมล์ Start')
            return
        }
        else checkOut()
        return
    }
    const checkOut = async () => {
        setIsConfirm(false)
        setConfirmMessage('')
        if (checkEndMile && checkEnd.locId && !endLoad) {
            let isComplete = true
            let planTripProspId = '';
            setSaveLoad(true)
            const res2 = await viewSaleDetail(`${planTrip.planTripId}`);
            setSaveLoad(false)

            res2[0].listPlanTripProspect.map(obj => {
                planTripProspId = obj.planTripProspId
                if (obj.openFlag === 'Y') isComplete = false

            })
            // const list = data.map(obj=>obj.planTripProspId)
            // let isComplete = true
            // await Promise.all(
            //     list.map(async planTripProspId=>{
            //          const data = await viewPlanTripTaskAction(`${planTripProspId}`);
            //            data.map(val=>{
            //            if(val.requireFlag === 'Y' && val.completedFlag === 'N') isComplete = false
            //          })
            //     })
            //      // const data = await viewPlanTripTaskAction(`${planTrip.planTripProspId}`);
            // )
            if (!isComplete) {
                setIsError(true)
                setMsgError('ไม่สามารถปิด Plan Trip ได้ เนื่องจากยังทำ Sale Visit ไม่ครบ')
                return
            }
            // const data = await viewPlanTripTaskAction(`${planTrip.planTripProspId}`);
            // let isComplete = true
            // data.map(val=>{
            //     if(val.requireFlag === 'Y' && val.completedFlag === 'N') isComplete = false
            // })
            // if(!isComplete) {
            //     setIsError(true)
            //     setMsgError('ไม่สามารถ Check out ได้ เนื่องจากยังทำ Required Task ไม่ครบ')
            //     return 
            // }

            let disCount = 0
            const allData = data.filter(res => res.visitCheckinDtm)
            /// 
            allData.map(obj => {
                planTripProspId = obj.planTripProspId
            })
            const lastCheck = await getLastCheckIn(`${planTrip.planTripId}`, null)
            // if(allData[0])
            // disCount = getDistanceFromLatLonInKm(checkStart.latitude,checkStart.longitude,allData[0].latitude,allData[0].longitude)
            // allData.map((data,index)=>{
            //     if(data && allData[index-1] )
            //         disCount = disCount + getDistanceFromLatLonInKm(data.latitude,data.longitude,allData[index-1].latitude,allData[index-1].longitude)
            // })
            if (lastCheck) {
                const dis = await getGoogleFromLatLonInKm(checkEnd.latitude, checkEnd.longitude, lastCheck.latitude, lastCheck.longitude);
                disCount = disCount + dis ? dis.distance : 0
                // disCount = disCount + getDistanceFromLatLonInKm(checkEnd.latitude,checkEnd.longitude,lastCheck.latitude,lastCheck.longitude);
            }
            else {
                const dis = await getGoogleFromLatLonInKm(checkStart.latitude, checkStart.longitude, checkEnd.latitude, checkEnd.longitude);
                disCount = disCount + dis ? dis.distance : 0
                // disCount = disCount + getDistanceFromLatLonInKm(checkStart.latitude,checkStart.longitude,checkEnd.latitude,checkEnd.longitude);
            }
            disCount = parseInt(disCount).toFixed(0)

            // const br = await waypoint({latitude:checkStart.latitude,longitude:checkStart.longitude},{latitude:checkEnd.latitude,longitude:checkEnd.longitude},allData)
            // let stopCalKm=br ? parseInt(br.distance).toFixed(0) : 0;
            setEndLoad(true);
            const res = await planTripFinish(`${checkEnd.locId}`, checkEndMile, `${planTrip.planTripId}`, disCount)
            setEndLoad(false);
            setIsCheckOut(true)


            // navigation.goBack();
            // setIsError(true);
            // setMsgError('บันทึกข้อมูลสำเร็จ')
            if (!res) {
                // setIsError(true);
                // setMsgError('กรุณาระบุ เลขไมล์')
            }
        }
        else {
            setIsError(true);
            setMsgError('กรุณาระบุ เลขไมล์')
        }
    }
    const renderList = ({ item, index }) => {
        return <View style={{ flexDirection: 'row' }}>
            <View style={{ alignSelf: 'center', paddingRight: 8 }}>
                <Icon type="Ionicons" name="home-outline" style={{ color: colors.grayButton, fontSize: 25 }} />
            </View>
            <View style={{ alignSelf: 'center' }}>
                <Text>{item.accName}</Text>
            </View>
        </View>
    }
    const onPressAdd = async () => {
        if (!isLocation) {
            if (selectAdhoc) {
                if ((adHocStart && adHocEnd) && adHocStart > adHocEnd) {
                    setIsError(true)
                    setMsgError('กรุณาเลือกช่วงเวลาให้ถูกต้อง')
                    return
                }
                const { latitude, longitude, prospAccId, prospectId, remark } = selectAdhoc
                // await addPlanTripProspectAdHoc(`${planTrip.planTripId}`,`${prospectId}`,adHocStart ? adHocStart : null,adHocEnd ? adHocEnd : null,latitude,longitude,remark);
                // setAdHocStart(null);
                // setAdHocEnd(null);
                // getData();
                setIsShowModalAddPlan(false);
                setIsShowModalAddPlanConfirm(true);
            }
        }
        else {
            // const {latitude,longitude,prospAccId,prospectId,remark} = selectAdhoc
            if ((adHocStart && adHocEnd) && adHocStart > adHocEnd) {
                setIsError(true)
                setMsgError('กรุณาเลือกช่วงเวลาให้ถูกต้อง')
                return
            }
            const { latitude, longitude, locId, remark } = selectAdHocLoc
            // await addPlanTripProspectAdHoc(`${planTrip.planTripId}`,null,adHocStart ?adHocStart : null,adHocEnd ? adHocEnd : null,latitude,longitude,remark,`${locId}`,remark);
            // setAdHocStart(null);
            // setAdHocEnd(null);
            // getData();
            setIsShowModalAddPlan(false);
            setIsShowModalAddPlanConfirm(true);
        }
    }
    const onPressAddModalConfirm = async (event) => {
        setIsShowModalAddPlanConfirm(event);
        setSaveLoad(true)
        if (!isLocation) {
            if (selectAdhoc) {
                const { latitude, longitude, prospAccId, prospectId, remark } = selectAdhoc
                await addPlanTripProspectAdHoc(`${planTrip.planTripId}`, `${prospectId}`, adHocStart ? adHocStart : null, adHocEnd ? adHocEnd : null, latitude, longitude, remark);
                setSaveLoad(false)
                setAdHocStart(null);
                setAdHocEnd(null);
                getData();
                setSelectAdHoc(null);
                setSelectAdHocLoc(null);
            }
        } else {
            const { latitude, longitude, locId, remark } = selectAdHocLoc
            await addPlanTripProspectAdHoc(`${planTrip.planTripId}`, null, adHocStart ? adHocStart : null, adHocEnd ? adHocEnd : null, latitude, longitude, remark, `${locId}`, remark);
            setSaveLoad(false)
            setAdHocStart(null);
            setAdHocEnd(null);
            getData();
            setSelectAdHoc(null);
            setSelectAdHocLoc(null);
        }
    }
    const onPressModalCancle = (event) => {
        setIsShowModalAddPlanConfirm(event);
        setIsShowModalAddPlan(true);
        setSelectAdHoc(null);
        setSelectAdHocLoc(null);
    }
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const validateLatLng = (lat, lng) => {
        return (lat && isFinite(lat) && Math.abs(lat) <= 90), (lng && isFinite(lng) && Math.abs(lng) <= 180);
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <Header />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ marginBottom: 30 }}>

                <View style={{ height: 120, backgroundColor: colors.grayborder, paddingHorizontal: '5%', paddingVertical: 15 }}>
                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>Good morning,</Text>
                    <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>Sales Visit</Text>
                </View>

                <View style={{ marginHorizontal: '5%' }}>
                    <View style={{ marginHorizontal: '5%', marginTop: isVisible ? bestRoutes.length == 1 ? (bestRoutes.length + 1) * 265 : 465 + (bestRoutes.length * 40): 380 }}>
                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, fontWeight: 'bold' }}>Today Plan Trip</Text>
                    </View>
                    <View style={{ marginHorizontal: '5%', paddingBottom: '3%' }}>
                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>กรุณา กด task เพื่อ Check in</Text>
                    </View>

                    <ScrollView horizontal={true}>
                        <CardTaskPlanTrip TaskPlanTripData={data} acc={acc} currentLocation={currentLocation} isStart={isStart} callBack={() => getData()} isComplete={isComplete} startObj={checkStart} />
                    </ScrollView>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '5%', marginTop: '10%' }}>
                        {/* { perButtonAddHoc == true ? */}
                        <View style={{ flex: 1, marginRight: '2%' }}>
                            <Button disabled={isComplete} title={'Ad-Hoc'} typeIcon={'Ionicons'} nameIcon={'add-outline'} width={'100%'} onPress={() => {
                                setAdHocStart('')
                                setAdHocEnd('')
                                setIsShowModalAddPlan(true)
                            }} />
                        </View>
                        {/* : null } */}
                        <View style={{ flex: 1, marginLeft: '2%' }}>
                            <Button width={'100%'} title={'Close'} fontColor={colors.primary} color={colors.white} onPress={() => navigation.goBack()} />
                        </View>
                    </View>
                </View>
                <View>
                    <Modal visible={isConfirm}
                        title={'แจ้งเตือน'}
                        closeHeaderButton={true}
                        TWOBUTTON={true}
                        onPressConfirm={() => {
                            // confirmAdd();
                            checkOut();
                        }}
                        onPressCancel={() => {
                            setIsConfirm(false)
                            setConfirmMessage('')
                        }}
                    >
                        <View style={{ padding: 50, alignItems: 'center' }}>
                            <Text style={{ fontSize: 28 }}>{confirmMessage}</Text>
                        </View>
                    </Modal>
                    <ModalWarning
                        visible={isError}
                        onlyCloseButton
                        onPressClose={() => setIsError(!isError)}
                        detailText={msgError}
                    />
                    <ModalWarning
                        visible={isCheckOut}
                        onlyCloseButton
                        onPressClose={() => navigation.goBack()}
                        detailText={'บันทึกข้อมูลสำเร็จ'}
                    />
                    <Modal
                        visible={isShowModalAddPlan}
                        onPressCancel={onPressModal}
                        onPressConfirm={onPressAdd}
                        title={'Prospect / Customer'}
                        TWOBUTTON={true}
                        cancelText={'Close'}
                        confirmText={'Add'}
                        cancelTextColor={colors.primary}
                        cancelButtonColor={colors.white}
                        confirmButtonColor={colors.primary}
                        confirmTextColor={colors.white}
                    >
                        <View>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 5 }}>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <RadioButton
                                        status={!isLocation ? 'checked' : 'unchecked'}
                                        color={colors.primary}
                                        onPress={() => {
                                            setSelectAdHoc(null)
                                            setSelectAdHocLoc(null)
                                            setAdHocStart(null)
                                            setAdHocEnd(null)
                                            setSelectAdHocLoc(null)
                                            setIsLocaltion(false)
                                        }}
                                    />
                                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>
                                        Prospect / Customer
                                    </Text>
                                </View>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <RadioButton
                                        status={isLocation ? 'checked' : 'unchecked'}
                                        color={colors.primary}
                                        onPress={() => {
                                            setSelectAdHoc(null)
                                            setSelectAdHocLoc(null)
                                            setAdHocStart(null)
                                            setAdHocEnd(null)
                                            setIsLocaltion(true)
                                        }}
                                    />
                                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>
                                        Location
                                    </Text>
                                </View>
                            </View>
                            <View style={{ margin: 10 }}>
                                {!isLocation ? <SelectDropdown
                                    titleDropdown={!isLocation ? 'Prospect / Customer' : 'Location'}
                                    titleAlert={!isLocation ? 'Prospect / Customer' : 'Location'}
                                    dataList={adhocs.filter(val => validateLatLng(val.latitude, val.longitude))}
                                    // titleKey={'accName'}
                                    titleKey={'codeNameLabel'}
                                    valueKey={'prospectId'}
                                    defaultValue={selectAdhoc}
                                    onPress={(e) => setSelectAdHoc(e)}

                                /> : <SelectDropdown
                                    titleDropdown={!isLocation ? 'Prospect / Customer' : 'Location'}
                                    titleAlert={!isLocation ? 'Prospect / Customer' : 'Location'}
                                    dataList={checkStart ? start.filter(val => val.locId != checkStart.locId).filter(val => validateLatLng(val.latitude, val.longitude)) : start.filter(val => validateLatLng(val.latitude, val.longitude))}
                                    titleKey={'locNameTh'}
                                    valueKey={'locId'}
                                    defaultValue={selectAdHocLoc}
                                    onPress={(e) => setSelectAdHocLoc(e)}

                                />}

                            </View>
                        </View>
                        {/* {TimePicker}    */}
                        <View style={{ flexDirection: 'row', marginHorizontal: 20, justifyContent: 'center', marginBottom: 20 }}>
                            <View style={{ paddingRight: 10 }}>
                                <Text>To</Text>
                                <TimePicker onChange={(e) => setAdHocStart(dayjs(e).format('HH:mm:ss'))} disabled={false} style={{ width: 300 }} defaultValue={adHocStart} />
                            </View>
                            <View style={{ marginLeft: 30 }}>
                                <Text>From</Text>
                                <TimePicker onChange={(e) => setAdHocEnd(dayjs(e).format('HH:mm:ss'))} disabled={false} defaultValue={adHocEnd} />
                            </View>
                        </View>
                    </Modal>
                    <ModalWarning
                        visible={isShowModalAddPlanConfirm}
                        onPressConfirm={() => onPressAddModalConfirm(false)}
                        onPressCancel={() => onPressModalCancle(false)}
                        detailText={`ต้องการเพิ่ม ${selectAdhoc && selectAdhoc.codeNameLabel ? selectAdhoc.codeNameLabel : selectAdHocLoc && selectAdHocLoc.locNameTh ? selectAdHocLoc.locNameTh : ""} ใช่หรือไม่`}
                    />
                </View>

                <View style={{ position: 'absolute', left: '3%', right: '3%' }}>
                    <View style={[styles.styleShadow, styles.BestRouteBox]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: '3%', flex: 1, marginHorizontal: '3%' }}>
                            {/* {Area 1 Start} */}
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.grayborder, paddingBottom: 10 }}>
                                    <View style={{ alignSelf: 'center', width: '90%' }}>
                                        <SelectDropdown
                                            titleAlert={'Start'}
                                            titleDropdown={'Start'}
                                            dataList={start}
                                            titleKey={'locNameTh'}
                                            valueKey={'locId'}
                                            defaultValue={checkStart ? checkStart.locId : ''}
                                            onPress={(e) => startPlan(e)}
                                            disabled={isComplete}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                        <Text style={{ fontSize: FONT_SIZE.TEXT, color: colors.primary, fontWeight: 'bold' }}>เลขไมล์</Text>
                                    </View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <Input
                                            placeholder='ระบุเลขไมล์'
                                            placeholderTextColor={colors.gray}
                                            style={{ fontFamily: 'THSarabunNew', fontSize: FONT_SIZE.LITTLETEXT, width: '100%' }}
                                            value={checkStartMile}
                                            maxLength={10}
                                            keyboardType="numeric"
                                            onChangeText={(e) => {
                                                if (!e) return setCheckStartMile('')
                                                if (/^\d+$/.test(e))
                                                    setCheckStartMile(e)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        {!startLoad && <Button disabled={checkStartMile == '' && !checkStart || isComplete} title={'Start'} buttonHeigth={45} width={80} fontColor={colors.white} color={colors.primary} onPress={checkIn} />}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: '3%', flex: 1, marginHorizontal: '3%' }}>
                            {/* {Area 2 Stop} */}
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.grayborder, paddingBottom: 10 }}>
                                    <View style={{ alignSelf: 'center', width: '90%' }}>
                                        <SelectDropdown
                                            titleAlert={'Finish'}
                                            titleDropdown={'Finish'}
                                            dataList={end}
                                            titleKey={'locNameTh'}
                                            valueKey={'locId'}
                                            defaultValue={checkEnd ? checkEnd.locId : ''}
                                            onPress={(e) => setCheckEnd(e)}
                                            disabled={isComplete || !checkStart || !isStart}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                        <Text style={{ fontSize: FONT_SIZE.TEXT, color: colors.primary, fontWeight: 'bold' }}>เลขไมล์</Text>
                                    </View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <Input
                                            placeholder='ระบุเลขไมล์'
                                            disabled={isComplete || !checkStart}
                                            placeholderTextColor={colors.gray}
                                            style={{ fontFamily: 'THSarabunNew', fontSize: FONT_SIZE.LITTLETEXT, width: '100%' }}
                                            value={checkEndMile}
                                            maxLength={10}
                                            keyboardType="numeric"
                                            onChangeText={(e) => {
                                                if (!e) return setCheckEndMile('')
                                                if (/^\d+$/.test(e))
                                                    setCheckEndMile(e)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        {<Button disabled={isComplete || !checkStart || !isStart} title={'Finish'} buttonHeigth={45} width={'80%'} fontColor={colors.primary} color={colors.white} onPress={pressCheckOut} />}
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* {Area 3} */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, flex: 1 }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Text>ระยะทางรวมทั้งหมด</Text>
                                <Text>{numberWithCommas(parseInt(Math.ceil(totalKmSystem ? totalKmSystem : 0)))} กม.</Text>
                            </View>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Button title={'Best Route'} width={'60%'} onPress={onPressBestRoute} disabled={isComplete} />
                            </View>
                        </View>

                        {isVisible ?
                            <>
                                <View style={{ borderTopWidth: 0.5, paddingTop: 20, borderColor: colors.grayborder, width: '90%', alignSelf: 'center' }} />
                                <View style={{ paddingHorizontal: 30, paddingBottom: 10 }}>
                                    <View style={{ paddingBottom: 5 }}>
                                        <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>Best Route</Text>
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text>ระยะทางรวมทั้งหมด</Text>
                                        <Text>{numberWithCommas(parseInt(Math.ceil(totalRoute ? totalRoute : 0)))} กม.</Text>
                                    </View>
                                    <FlatList
                                        data={bestRoutes}
                                        renderItem={(item) => renderList(item)}
                                        keyExtractor={(item, index) => index}
                                    />
                                </View>
                            </>
                            :
                            null
                        }
                    </View>
                </View>
            </ScrollView>

            <LoadingOverlay
                visible = {saveLoad}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
    BestRouteBox: {
        flex: 1,
        backgroundColor: colors.white,
        width: '95%',
        alignSelf: 'center',
        marginTop: 90,
        borderRadius: 20,
    }

});

export default SaleVisitPlanTrip;
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native';
import { Icon } from 'native-base'
import { useDispatch, useSelector } from 'react-redux';
import { TextInput as CTextInput, Text, ModalWarning, LoadingOverlay } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../utility/colors';
import Modal from '../Modal'
import ViewPlanTripTask from '../template/viewPlanTripTask'
import {
    viewPlanTripTaskAction, getConfigParam, getLastCheckIn, checkInPlanTrip, planReasonNotVisit, updReasonNotvisiForProspect,
    setPlantrip, resetCallBack, setCheckingPlant, updateCheckout, resetNewTrip, updateTrips, updateLocRemark, resetTaskReload,
    delPlanTripProspectAdHoc
} from '../../actions/SaleVIsit'
import dayjs from 'dayjs';
import { getDistanceFromLatLonInKm, getGoogleFromLatLonInKm } from '../../utility/helper'
import SelectDropdown from '../SelectDropdown';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import language from '../../language/th.json'

const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('TH')
const CardTaskPlanTrip = ({
    TaskPlanTripData,
    acc,
    currentLocation,
    isStart,
    callBack, isComplete, startObj
}) => {
    const dispatch = useDispatch();
    const [isShowModalCheckIn, setIsShowModalCheckIn] = useState(false);
    const [isTaskNotComplete, setIsTaskNotComplete] = useState(false);
    const [planTrip, setPlanTrip] = useState(null);
    const [taskList, setTaskList] = useState([]);
    const [isShowViewPlanTrip, setIsShowViewPlanTrip] = useState(false)
    const [radius, setRadius] = useState(0);
    const [loadingConfigParam, setLoadingConfigParam] = useState(false);
    const [isCloseLocal, setIsCloseLocal] = useState(true)
    const [checkIn, setCheckIn] = useState(null)
    const [reasons, setReason] = useState([])
    const [isWarningCheckIn, setIsWarningCheckIn] = useState(false)
    const [isShowReason, setIsShowReason] = useState(null)
    const [selectReason, setSelectReason] = useState(null)
    const [isShowLocalCheckIn, setIsShowLocalCheckIn] = useState(null)
    const { saleVisit } = useSelector((state) => state);
    const [mile, setMile] = useState('')
    const [remark, setRemark] = useState('')
    const [isLoad, setLoad] = useState(false)
    const [isError, setIsError] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [isDoneTask, setIsDoneTask] = useState(false);
    const [beforePlanTripProspId, setBeforePlanTripProspId] = useState(null)
    const [nextPlanTripProspId, setNextPlanTripProspId] = useState(null)
    const [modalCheckOut, setModalCheckOut] = useState(false)
    const [nameContactChekOut, setNameContactChekOut] = useState('')
    const [mobileContactChekOut, setMobileContactChekOut] = useState('')
    const [remarkChekOut, setRemarkCheckOut] = useState('')
    const [itemCheckOut, setItemCheckOut] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)
    const [modalDeleteConfirm, setModalDeleteConfirm] = useState(false)
    const [itemDelete, setItemDelete] = useState(null)
    const [errorMSGDelete, setErrorMSGDelete] = useState('');

    const onPressModal = (event) => {
        setPlanTrip(null)
        setIsShowModalCheckIn(event);
    }
    useEffect(() => {
        if (saleVisit.isTemplateBack) {
            setPlantrip(saleVisit.planTrip)
            showViewPlanTrip(saleVisit.planTrip);
            dispatch(resetCallBack())
        }

    }, [saleVisit])
    useEffect(() => {
        if (saleVisit.reloadTask) {
            showViewPlanTrip(planTrip)
            dispatch(resetTaskReload());
        }
    }, [saleVisit])
    useEffect(() => {
        getParam();
        reasonNotVisit();
    }, [])
    const reasonNotVisit = async () => {
        const res = await planReasonNotVisit();
        let list = res.filter(obj => obj.activeFlag === 'Y')
        setReason(list)
    }
    const getParam = async () => {
        setLoadingConfigParam(true)
        const res = await getConfigParam();
        setRadius(parseInt(res[0].paramValue))
        setLoadingConfigParam(false)
    }
    const showViewPlanTrip = async (obj = planTrip) => {
        const { latitude, longitude, planTripId } = planTrip
        if (planTrip) {
            dispatch(setCheckingPlant(obj))
            /// เพิ่ม  plantripId
            //   ถ้า next มี ค่า ต้องส่งอัพเดท ถ้า before ไม่มีค่า ต้องไปหยิบ ค่า start in  มา คำนวณ
            const res = await checkInPlanTrip(`${planTripId}`, `${obj.planTripProspId}`, `${latitude}`, `${longitude}`, mile);
            const { beforePlanTripProspId, nextPlanTripProspId } = res
            setBeforePlanTripProspId(beforePlanTripProspId);
            setNextPlanTripProspId(nextPlanTripProspId)
            // Alert.alert('บันทึกสำเร็จ')
        } else {
            setPlantrip(obj)
        }
        const data = await viewPlanTripTaskAction(`${obj.planTripProspId}`);
        setTaskList(data)
        if (planTrip.locId) {
            setRemark(planTrip.locRemark)
            setIsShowLocalCheckIn(true)
        } else {
            setIsShowViewPlanTrip(true)
        }
        callBack();
        setIsShowModalCheckIn(false)
    }
    const validateRaduis = async (item) => {
        if (saleVisit.plantTripChecking && item.planTripProspId != saleVisit.plantTripChecking.planTripProspId && item.planTripId === saleVisit.plantTripChecking.planTripId) return setIsWarningCheckIn(true)
        const distance = getDistanceFromLatLonInKm(currentLocation.latitude, currentLocation.longitude, item.latitude, item.longitude) * 1000
        if (radius < distance) {
            setIsCloseLocal(false)
        } else {

            //  const res = await getLastCheckIn(`${planTrip}`,`${planTrip.planTripProspId}`)

            setPlanTrip(item)

            //  const res = await getLastCheckIn(`${planTrip}`,`${planTrip.planTripProspId}`)
            setIsShowModalCheckIn(true)
        }

        // setPlanTrip(item)
        // setIsShowModalCheckIn(true)
    }

    //function for confirm checkout
    const onPressForCheckOut = (event, item) => {
        setModalCheckOut(event)
        setItemCheckOut(item)
    }

    //function for cancel checkout
    const onPressCheckOutCancel = (event) => {
        setModalCheckOut(event)
        setNameContactChekOut('')
        setMobileContactChekOut('')
        setRemarkCheckOut('')
    }

    const checkOut = async (item) => {
        setModalCheckOut(false)
        setItemCheckOut(null)
        /// เพิ่ม  plantripId
        // ถ้า next มี ค่า ต้องส่งอัพเดท ถ้า before ไม่มีค่า ต้องไปหยิบ ค่า start in  มา คำนวณ  
        // if(saleVisit.plantTripChecking && saleVisit.plantTripChecking.prospId === item.prospId  ){
        const data = await viewPlanTripTaskAction(`${item.planTripProspId}`);
        let isComplete = true
        data.map(val => {
            if (val.requireFlag === 'Y' && val.completedFlag === 'N') isComplete = false
        })
        if (!isComplete) {
            setIsError(true)
            setMsgError('ไม่สามารถ Check out ได้ เนื่องจากยังทำ Required Task ไม่ครบ')
            setNameContactChekOut('')
            setMobileContactChekOut('')
            setRemarkCheckOut('')
            return
        }
        const res = await getLastCheckIn(`${item.planTripId}`, `${item.planTripProspId}`)
        let distance = 0;
        let upDistance = 0;
        if (res) {

        }
        distance = await getGoogleFromLatLonInKm(item.latitude, item.longitude, res ? parseFloat(res.latitude) : parseFloat(startObj.latitude), res ? parseFloat(res.longitude) : parseFloat(startObj.longitude))
        if (nextPlanTripProspId && beforePlanTripProspId) {
            let before = TaskPlanTripData.find(data => `${data.planTripProspId}` === beforePlanTripProspId)
            let next = TaskPlanTripData.find(data => `${data.planTripProspId}` === nextPlanTripProspId)
            upDistance = await getGoogleFromLatLonInKm(before.latitude, before.longitude, next.latitude, next.longitude);
        }
        if (nextPlanTripProspId && !beforePlanTripProspId) {
            let next = TaskPlanTripData.find(data => `${data.planTripProspId}` === nextPlanTripProspId)
            upDistance = await getGoogleFromLatLonInKm(startObj.latitude, startObj.longitude, next.latitude, next.longitude);
        }

        upDistance = upDistance ? upDistance.distance : 0
        distance = distance ? distance.distance : 0

        await updateCheckout(`${item.planTripProspId}`, `${nextPlanTripProspId ? nextPlanTripProspId : item.planTripProspId}`, `${convertFormat(distance)}`, `${convertFormat(upDistance == 0 ? distance : upDistance)}`, nameContactChekOut, mobileContactChekOut, remarkChekOut);
        dispatch(resetNewTrip())
        //  updateTripCount();
        setMile('')
        callBack();
        setIsError(true)
        setMsgError('บันทึกข้อมูลสำเร็จ')
        setNameContactChekOut('')
        setMobileContactChekOut('')
        setRemarkCheckOut('')
        //    }

        ///clear redux all
    }

    const convertFormat = (num) => {
        return num.toFixed(0)
    }

    const reasonNo = (item) => {
        if (!item.visitCheckOutDtm)
            setIsShowReason(item)
    }
    const CardTaskPlanTripArea = (TaskPlanTripData) => {
        return (
            <View style={[styles.container, { height: TaskPlanTripData.item.adhocFlag == 'Y' ? 220 : 170 }]}>
                <View style={{ justifyContent: 'space-between' }}>

                    {/* {CardArea} */}
                    <View style={{ backgroundColor: colors.greenPlanTripCard, height: 110, width: 430, borderRadius: 25, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', alignSelf: 'center' }}>
                            <View>
                                <Image source={require('../../assets/images/Ellipse.png')} style={{ height: 40, width: 40 }} />
                            </View>
                            <View style={{ paddingLeft: 10, width: 230 }}>
                                <View>
                                    <Text numberOfLines={1} style={{ fontSize: 20, color: colors.white }}>{TaskPlanTripData.item.accName}</Text>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon type="SimpleLineIcons" name="location-pin" style={{ fontSize: 20, alignSelf: 'center', paddingRight: 5, color: colors.white }} />
                                        <Text style={{ fontSize: 20, color: colors.white, alignSelf: 'center' }}>{`${TaskPlanTripData.item.latitude} , ${TaskPlanTripData.item.longitude}`}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                <View>
                                    <Text style={{ fontSize: 20, color: colors.white }}> {acc ? dayjs(acc.planTripDate).add(543, 'y').locale('th').format('LL') : '-'}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 20, color: colors.white }}> เวลา {TaskPlanTripData.item.planStartTime ? dayjs(TaskPlanTripData.item.planStartTime).locale('th').format('HH:mm') : ''} - {TaskPlanTripData.item.planEndTime ? dayjs(TaskPlanTripData.item.planEndTime).locale('th').format('HH:mm') : ''}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* {ButtonArea} */}
                    {/* ,color:colors.grayButton */}
                    <View style={{ paddingTop: 10, justifyContent: 'space-around', flexDirection: 'row' }}>
                        <View style={{ paddingRight: 10, marginVertical: 5 }}>
                            <TouchableOpacity disabled={!isStart || isComplete} onPress={() => { validateRaduis(TaskPlanTripData.item), setMile(TaskPlanTripData.item.visitCheckinMileNo ? `${TaskPlanTripData.item.visitCheckinMileNo}` : '') }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon type="Ionicons" name="flag-outline" style={{ fontSize: STYLE_SIZE.ICON_SIZE_SMALL, paddingRight: 5, color: !TaskPlanTripData.item.visitCheckinDtm ? colors.grayButton : colors.primary }} />
                                    <Text style={TaskPlanTripData.item.visitCheckinDtm ? { fontSize: FONT_SIZE.LITTLETEXT, color: colors.primary } : { fontSize: 22 }}>Check in</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingRight: 10, marginVertical: 5 }}>
                            {!isStart || !TaskPlanTripData.item.visitCheckinDtm || (TaskPlanTripData.item.reasonNotVisitId && !TaskPlanTripData.item.visitCheckoutDtm) ? <View disabled={!isStart || isComplete || !TaskPlanTripData.item.visitCheckinDtm}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon type="Ionicons" name="log-out-outline" style={{ fontSize: STYLE_SIZE.ICON_SIZE_SMALL, paddingRight: 5, color: TaskPlanTripData.item.visitCheckoutDtm ? colors.grayButton : colors.grayButton }} />
                                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, color: TaskPlanTripData.item.visitCheckoutDtm ? colors.grayButton : colors.grayButton }}>Check out</Text>
                                </View>
                            </View> : <TouchableOpacity disabled={!isStart || isComplete || !TaskPlanTripData.item.visitCheckinDtm} onPress={() => onPressForCheckOut(true, TaskPlanTripData.item)}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon type="Ionicons" name="log-out-outline" style={{ fontSize: STYLE_SIZE.ICON_SIZE_SMALL, paddingRight: 5, color: TaskPlanTripData.item.visitCheckoutDtm ? colors.primary : colors.black }} />
                                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, color: TaskPlanTripData.item.visitCheckoutDtm ? colors.primary : colors.black }}>Check out</Text>
                                </View>
                            </TouchableOpacity>}
                        </View>
                        <View style={{ paddingRight: 10, marginVertical: 5 }}>
                            <TouchableOpacity disabled={!isStart || TaskPlanTripData.item.visitCheckoutDtm || TaskPlanTripData.item.reasonNotVisitId} onPress={() => {reasonNo(TaskPlanTripData.item), getData()}}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon type="MaterialCommunityIcons" name="close-box-outline" style={{ fontSize: STYLE_SIZE.ICON_SIZE_SMALL, color: TaskPlanTripData.item.reasonNotVisitId ? colors.primary : 'red', paddingRight: 5 }} />
                                    <Text style={{ color: TaskPlanTripData.item.reasonNotVisitId ? colors.primary : 'red', fontSize: FONT_SIZE.LITTLETEXT }}>ไม่เข้าสถานที่</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        TaskPlanTripData.item.adhocFlag == 'Y' ?
                            <View style={{ marginTop: 10, alignItems: 'center' }}>
                                <TouchableOpacity disabled={isComplete || TaskPlanTripData.item.visitCheckinDtm || TaskPlanTripData.item.visitCheckoutDtm || TaskPlanTripData.item.reasonNotVisitId} onPress={() => onPressConfirmDelete(TaskPlanTripData.item, true)}>
                                    <View style={{ borderWidth: 1, paddingHorizontal: '10%', paddingVertical: '1%', borderColor: isComplete || TaskPlanTripData.item.visitCheckinDtm || TaskPlanTripData.item.visitCheckoutDtm || TaskPlanTripData.item.reasonNotVisitId ? colors.grayButton : colors.redButton, borderRadius: 10 }}>
                                        <Text style={{ color: isComplete || TaskPlanTripData.item.visitCheckinDtm || TaskPlanTripData.item.visitCheckoutDtm || TaskPlanTripData.item.reasonNotVisitId ? colors.black : colors.redButton, fontSize: FONT_SIZE.LITTLETEXT }}>Delete</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            : null
                    }
                </View>
            </View>
        )
    }

    //fuction show modal delete prospect/customer or location
    const onPressConfirmDelete = (item, event) => {
        setModalDelete(event)
        setModalDeleteConfirm(!event)
        setItemDelete(item)
    }

    const onPressConfirmDeleteSuccess = async (event) => {
        setModalDelete(event)
        setModalDeleteConfirm(!event)

        const res = await delPlanTripProspectAdHoc(`${itemDelete.planTripProspId}`);
        if (res.errorCode != 'S_SUCCESS') {
            setErrorMSGDelete(`${res.errorMessage}`)
        }
    }

    const onPressConfirmDeleteSuccessColse = () => {
        setModalDeleteConfirm(false);
        setItemDelete(null);
        setErrorMSGDelete('');
        callBack();
    }

    const onPressModalCancel = () => {
        setIsShowReason(null)
        setNameContactChekOut('')
        setMobileContactChekOut('')
        setRemarkCheckOut('')
        setSelectReason(null)
    }

    const onPressModalConfirm = async () => {
        if (selectReason) {
            const { planTripProspId, planTripId, visitCheckinDtm } = isShowReason
            const dis = await getLastCheckIn(`${planTripId}`, `${planTripProspId}`)
            let distance = 0;
            let upDistance = 0;
            distance = await getGoogleFromLatLonInKm(isShowReason.latitude, isShowReason.longitude, dis ? parseFloat(dis.latitude) : parseFloat(startObj.latitude), dis ? parseFloat(dis.longitude) : parseFloat(startObj.longitude))
            if (nextPlanTripProspId && beforePlanTripProspId) {
                let before = TaskPlanTripData.find(data => `${data.planTripProspId}` === beforePlanTripProspId)
                let next = TaskPlanTripData.find(data => `${data.planTripProspId}` === nextPlanTripProspId)
                upDistance = await getGoogleFromLatLonInKm(before.latitude, before.longitude, next.latitude, next.longitude);
            }
            if (nextPlanTripProspId && !beforePlanTripProspId) {
                let next = TaskPlanTripData.find(data => `${data.planTripProspId}` === nextPlanTripProspId)
                upDistance = await getGoogleFromLatLonInKm(startObj.latitude, startObj.longitude, next.latitude, next.longitude);
            }
            upDistance = upDistance ? upDistance.distance : 0
            distance = distance ? distance.distance : 0

            const res = await updReasonNotvisiForProspect(`${planTripProspId}`, `${nextPlanTripProspId ? nextPlanTripProspId : '0'}`, `${selectReason.reasonNotVisitId}`, `${selectReason.reasonNameTh}`, `${convertFormat(distance)}`, `${convertFormat(nextPlanTripProspId ? upDistance : 0)}`, visitCheckinDtm, nameContactChekOut, mobileContactChekOut, remarkChekOut);
            setIsShowReason(null)
            setSelectReason(null)
            setCheckIn(null)
            callBack();
            dispatch(resetNewTrip())
            setMile('')
            setIsError(true)
            setMsgError('บันทึกข้อมูลสำเร็จ ')
            setNameContactChekOut('')
            setMobileContactChekOut('')
            setRemarkCheckOut('')
        } else {
            setIsError(true)
            setMsgError('กรุณาเลือกเหตุผล')
        }
    }

    const updateLocRemarkS = async () => {
        if (!isLoad) {
            await updateLocRemark(planTrip.planTripProspId, remark)
            setIsError(true)
            setMsgError('บันทึกข้อมูลสำเร็จ ')
            setIsShowLocalCheckIn(false)
            dispatch(resetNewTrip())
            callBack();
            /// updateTrip
            // updateTripCount();
        }
    }
    const updateTripCount = async () => {
        // UPDATE_TRIP
        saleVisit.completeTrip.push(planTrip)
        let list = getUniqueListBy(saleVisit.completeTrip, 'planTripProspId')
        dispatch(updateTrips(list))

    }
    const getUniqueListBy = (arr, key) => {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')
            if(jsonValue != null) {
                removeStore()
            } else {
                return 
            }
            // return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(error) {
            // error reading value
        }
    }

    const removeStore = async () => {
        try {
            await AsyncStorage.removeItem('@storage_Key');
        } catch (error) {
            // error revove value
        }
    };

    return (
        <View>
            <View style={{ borderBottomWidth: 0.5, borderColor: colors.grayborder }}>
                <FlatList
                    data={TaskPlanTripData}
                    renderItem={(TaskPlanTripData) => CardTaskPlanTripArea(TaskPlanTripData)}
                    keyExtractor={(item, index) => index}
                    ListEmptyComponent={() => {
                        return (
                            <View style={{ flex: 1, justifyContent: 'center', marginBottom: 20 }}>
                                <Text style={{ alignSelf: 'center' }}>ไม่พบข้อมูล</Text>
                            </View>
                        );
                    }}
                />
            </View>
            <Modal
                visible={isShowReason ? true : false}
                title={'เหตุผลไม่เข้าเยี่ยม'}
                TWOBUTTON={true}
                cancelText={'Cancel'}
                confirmText={'Confirm'}
                onPressCancel={onPressModalCancel}
                onPressConfirm={onPressModalConfirm}
                closeHeaderButton={false}
            >
                <View style={{ margin: '5%' }}>
                    <SelectDropdown
                        titleAlert={'เหตุผลไม่เข้าเยี่ยม'}
                        titleDropdown={'เหตุผลไม่เข้าเยี่ยม'}
                        dataList={reasons}
                        titleKey={'reasonNameTh'}
                        valueKey={'reasonNotVisitId'}
                        onPress={(e) => setSelectReason(e)}
                        require
                        NotFillter
                        REQUIRETITLE
                    />
                    <View style={{ marginTop: '3%', width: '100%' }}>
                        <CTextInput
                            title={'ชื่อผู้ติดต่อ'}
                            style={[styles.inputbox, { backgroundColor: colors.white },
                            { fontSize: FONT_SIZE.LITTLETEXT, height: 50, fontFamily: 'THSarabunNew', color: colors.black, width: '100%' }]}
                            onChangeText={(e) => {
                                if (!e) return setNameContactChekOut('')
                                if (e) setNameContactChekOut(e)
                            }}
                            maxLength={50}
                        />
                    </View>
                    <View style={{ marginTop: '3%', width: '100%' }}>
                        <CTextInput
                            title={'หมายเลขโทรศัพท์'}
                            style={[styles.inputbox, { backgroundColor: colors.white },
                            { fontSize: FONT_SIZE.LITTLETEXT, height: 50, fontFamily: 'THSarabunNew', color: colors.black, width: '100%' }]}
                            onChangeText={(e) => {
                                if (!e) return setMobileContactChekOut('')
                                if (/^\d+$/.test(e)) setMobileContactChekOut(e)
                            }}
                            typeKeyboard={'numeric'}
                            maxLength={10}
                        />
                    </View>
                    <View style={{ marginTop: '3%', width: '100%' }}>
                        <CTextInput
                            title={'หมายเหตุ / ที่อยู่'}
                            style={[styles.inputbox, { backgroundColor: colors.white },
                            { fontSize: FONT_SIZE.LITTLETEXT, height: 120, fontFamily: 'THSarabunNew', color: colors.black, width: '100%' }]}
                            onChangeText={(e) => {
                                if (!e) return setRemarkCheckOut('')
                                if (e) setRemarkCheckOut(e)
                            }}
                            multiline={true}
                            maxLength={150}
                            heightBox = {120}
                            isOnlyText={true}
                        />
                    </View>
                </View>
            </Modal>
            <ViewPlanTripTask show={isShowViewPlanTrip} planTrip={planTrip} taskList={taskList}
                currentLocation={currentLocation}
                TaskPlanTripData={TaskPlanTripData}
                isStart={isStart}
                onPressCancel={(status) => {
                    if (status) {
                        setMile('')
                        setIsDoneTask(true)
                    }
                    setIsShowViewPlanTrip(false)
                }} />
            <Modal visible={isShowLocalCheckIn}
                title={`${planTrip ? planTrip.accName : ''}`}
                TWOBUTTON={false}
                width={`90%`}
                onPressCancel={() => setIsShowLocalCheckIn(false)}
                confirmText={'Save'}
                onPressButton={() => updateLocRemarkS()}
                BUTTON
            >
                <View style={{ marginBottom: 30, marginLeft: 10, marginRight: 10 }}>
                    <CTextInput
                        title={'หมายเหตุ'}
                        multiline={true}
                        onChangeText={(e) => setRemark(e)}
                        maxLength={250}
                        value={remark}>
                    </CTextInput>
                </View>
            </Modal>
            <Modal visible={!isCloseLocal}
                title={'แจ้งเตือน'}
                TWOBUTTON={false}
                onPressConfirm={() => setIsCloseLocal(true)}
                onPressCancel={() => setIsCloseLocal(true)}
                onPressButton={() => setIsCloseLocal(true)}
                BUTTON={true}
                confirmText={'Close'}
                closeHeaderButton={false}
            >
                <View style={{ padding: 20 }}>
                    <Text>{`ไม่สามารถ Check In ได้เนื่องจากระยะห่างเกิน ${radius} เมตร`}</Text>
                </View>
            </Modal>
            <Modal visible={isTaskNotComplete}
                title={'แจ้งเตือน'}
                TWOBUTTON={false}
                onPressConfirm={() => setIsTaskNotComplete(false)}
                onPressCancel={() => setIsTaskNotComplete(false)}
                onPressButton={() => setIsTaskNotComplete(false)}
                BUTTON={true}
                confirmText={'Close'}
                closeHeaderButton={false}
            >
                <View style={{ padding: 20 }}>
                    <Text>{`ไม่สามารถ Check out ได้ เนื่องจากยังทำ Required Task ไม่ครบ`}</Text>
                </View>
            </Modal>
            <Modal visible={isWarningCheckIn}
                title={'แจ้งเตือน'}
                TWOBUTTON={false}
                onPressConfirm={() => setIsWarningCheckIn(false)}
                onPressCancel={() => setIsWarningCheckIn(false)}
                onPressButton={() => setIsWarningCheckIn(false)}
                BUTTON={true}
                confirmText={'Close'}
                closeHeaderButton={false}
            >
                <View style={{ padding: 20 }}>
                    <Text>{`กรุณา Check Out สถานที่ก่อนหน้า`}</Text>
                </View>
            </Modal>

            <Modal
                visible={isShowModalCheckIn}
                onPressCancel={onPressModal}
                title={'Check in'}
                TWOBUTTON={true}
                disabledUplodeButton={mile == ''}
                onPressConfirm={() => showViewPlanTrip()}
                closeHeaderButton={false}
            >
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: '3%' }}>
                        <View style={{ alignSelf: 'center', paddingRight: '3%' }}>
                            <Text style={{ fontSize: 30, color: colors.primary, fontWeight: 'bold' }}>เลขไมล์</Text>
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <TextInput
                                placeholder={'ระบุเลขไมล์'}
                                style={{ fontFamily: 'THSarabunNew', fontSize: FONT_SIZE.LITTLETEXT, width: '100%' }}
                                value={mile}
                                onChangeText={(e) => {
                                    if (!e) return setMile('')
                                    if (/^\d+$/.test(e))
                                        setMile(e)
                                }}
                                keyboardType='numeric'
                                maxLength={10}
                            />
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: colors.grayborder, paddingBottom: '5%', width: '50%', alignSelf: 'center' }} />
                    <View style={{ alignSelf: 'center', marginVertical: '3%' }}>
                        <Text style={{ fontSize: 30, color: colors.primary, fontWeight: 'bold' }}>Turn on device location</Text>
                    </View>
                </View>
            </Modal>
            <ModalWarning
                visible={isError}
                onlyCloseButton
                onPressClose={() => setIsError(!isError)}
                detailText={msgError}
            />
            <ModalWarning
                visible={isDoneTask}
                onlyCloseButton
                onPressClose={() => setIsDoneTask(!isDoneTask)}
                detailText={'บันทึกข้อมูลสำเร็จ'}
            />
            <Modal visible={modalCheckOut}
                title={'แจ้งเตือน'}
                TWOBUTTON={true}
                cancelText={'Cancel'}
                confirmText={'Confirm'}
                onPressCancel={() => onPressCheckOutCancel(false)}
                onPressConfirm={() => checkOut(itemCheckOut)}
                closeHeaderButton={false}
            >
                <View style={{ padding: '5%' }}>
                    <View style={{ marginTop: '3%', width: '100%' }}>
                        <CTextInput
                            title={'ชื่อผู้ติดต่อ'}
                            style={[styles.inputbox, { backgroundColor: colors.white },
                            { fontSize: FONT_SIZE.LITTLETEXT, height: 50, fontFamily: 'THSarabunNew', color: colors.black, width: '100%' }]}
                            onChangeText={(e) => {
                                if (!e) return setNameContactChekOut('')
                                if (e) setNameContactChekOut(e)
                            }}
                            maxLength={50}
                        />
                    </View>
                    <View style={{ marginTop: '3%', width: '100%' }}>
                        <CTextInput
                            title={'หมายเลขโทรศัพท์'}
                            style={[styles.inputbox, { backgroundColor: colors.white },
                            { fontSize: FONT_SIZE.LITTLETEXT, height: 50, fontFamily: 'THSarabunNew', color: colors.black, width: '100%' }]}
                            onChangeText={(e) => {
                                if (!e) return setMobileContactChekOut('')
                                if (/^\d+$/.test(e)) setMobileContactChekOut(e)
                            }}
                            keyboardType='numeric'
                            maxLength={10}
                        />
                    </View>
                    <View style={{ marginTop: '3%', width: '100%' }}>
                        <CTextInput
                            title={'หมายเหตุ / ที่อยู่'}
                            style={[styles.inputbox, { backgroundColor: colors.white },
                            { fontSize: FONT_SIZE.LITTLETEXT, height: 120, fontFamily: 'THSarabunNew', color: colors.black, width: '100%' }]}
                            onChangeText={(e) => {
                                if (!e) return setRemarkCheckOut('')
                                if (e) setRemarkCheckOut(e)
                            }}
                            multiline={true}
                            maxLength={150}
                            heightBox = {120}
                            isOnlyText={true}
                        />
                    </View>
                </View>
            </Modal>
            <ModalWarning
                visible={modalDelete}
                detailText={`ต้องการลบ ${itemDelete && itemDelete.accName ? itemDelete.accName : ''} ใช่หรือไม่`}
                onPressConfirm={() => onPressConfirmDeleteSuccess(false)}
                onPressCancel={() => { setModalDelete(false), setItemDelete(null) }}
            />
            <ModalWarning
                visible={modalDeleteConfirm}
                detailText={errorMSGDelete != '' ? errorMSGDelete : language.DELETESUCCESS}
                onlyCloseButton={true}
                onPressClose={() => onPressConfirmDeleteSuccessColse()}
            />
             <LoadingOverlay
                visible={loadingConfigParam}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 170,
        justifyContent: 'center',
        borderTopWidth: 0.7,
        borderColor: colors.grayborder,
        marginBottom: 10
    },
    inputbox: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.grayborder,
        minWidth: 100,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginTop: 5,
    },
});

export default CardTaskPlanTrip;
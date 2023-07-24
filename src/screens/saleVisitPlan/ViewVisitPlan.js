import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
// import 'dayjs/locale/th';

import { TextInput, Table, Button, Header, ModalWarning } from '../../components'
import colors from '../../utility/colors';
import language from '../../language/th.json';
import { getInputData } from '../../utility/helper';
import { getViewPlanTrip, getViewPlanTripTask, cancelPlanTrip, rejectPlanTrip, approvePlanTrip, updateDataProsCusLocTable, getTaskTemplateCreatPlan, getTaskSpecialCreatPlan, resetApprove, resetReject } from '../../actions/SaleVisitPlanAction';
import { STYLE_SIZE, FONT_SIZE } from '../../utility/enum';

const ViewVisitPlan = (props) => {

    const navigation = useNavigation();
    const { saleVisitPlanReducer } = useSelector((state) => state);
    const { authReducer } = useSelector((state) => state);
    const { getUserProfileReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [dataViwePlan, setDataviewPlan] = useState(saleVisitPlanReducer.viewDataPlanTrip);
    const [dataPlan, setDataPlan] = useState(props.route.params.dataPlan);
    const [perNotPlanOwner, setญerNotPlanOwner] = useState(props.route.params.perNotPlanOwner);
    const [dataEditPlan, setDataEditPlan] = useState([]);
    const [dataListPlanTripProspect, setDataListPlanTripProspect] = useState([]);
    const [dataPlanTrip, setDataPlanTrip] = useState('');
    const [groupPermission, setGroupPermission] = useState(authReducer.userProfile.admGroup_GroupCode);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalDeleteConfirm, setModalDeleteConfirm] = useState(false);
    const [modalApprove, setModalApprove] = useState(false);
    const [modalApproveSuccess, setModalApproveSuccess] = useState(false);
    const [modalReject, setModalReject] = useState(false);
    const [modalRejectSuccess, setModalRejectSuccess] = useState(false);
    const today = new Date()
    const [dataData, setDateData] = useState(dayjs(today).locale('th').format('YYYY-MM-DDTHH:mm:ss'));
    const [dataPlanDateNew, setDataPlanDateNew] = useState('');
    const [dataDateNew, setDataDateNew] = useState('');

    let listPermission = getUserProfileReducer.dataUserProfile.listPermObjCode;

    useEffect(() => {
        dispatch(getViewPlanTrip(dataPlan.planTripId))
    }, [])

    useEffect(() => {
        if ((saleVisitPlanReducer.viewDataPlanTrip != '') && !saleVisitPlanReducer.viewDataplanTrip_Loading) {
            mapDataListTask()
        }
    }, [saleVisitPlanReducer.viewDataPlanTrip])

    useEffect(() => {
        if (saleVisitPlanReducer.approvePlnTrip_success && saleVisitPlanReducer.approvePlnTrip_error) {
            setModalApprove(true)
        }
        if (saleVisitPlanReducer.approvePlnTrip_success && !saleVisitPlanReducer.approvePlnTrip_error) {
            setModalApproveSuccess(true)
        }
    }, [saleVisitPlanReducer.approvePlnTrip_success, saleVisitPlanReducer.approvePlnTrip_error])

    useEffect(() => {
        if (saleVisitPlanReducer.rejectlPlnTrip_success && saleVisitPlanReducer.rejectlPlnTrip_error) {
            setModalReject(true)
        }
        if (saleVisitPlanReducer.rejectlPlnTrip_success && !saleVisitPlanReducer.rejectlPlnTrip_error) {
            setModalRejectSuccess(true)
        }
    }, [saleVisitPlanReducer.rejectlPlnTrip_success, saleVisitPlanReducer.rejectlPlnTrip_error])

    useEffect(() => {
        setDataPlanDateNew(dayjs(dataPlan.planTripDate).locale('th').format('YYYY-MM-DD'))
        setDataDateNew(dayjs(dataData).locale('th').format('YYYY-MM-DD'))

    }, [dataPlan.planTripDate, dataData])

    const mapDataListTask = async () => {
        if (saleVisitPlanReducer && saleVisitPlanReducer.viewDataPlanTrip) {
            let dataEditPlan = saleVisitPlanReducer.viewDataPlanTrip.map(async (item) => {
                if (item.listPlanTripProspect) {
                    setDataListPlanTripProspect(item.listPlanTripProspect)
                    let getOnlyProsp = item.listPlanTripProspect.map(async (itemListPros) => {
                        let test = await getViewPlanTripTask(itemListPros)
                        // TO BO เซ็ดข้อมูลตรงนี้
                        // return {...item, listTask: test}
                        return test
                    })

                    Promise.all(getOnlyProsp).then(function (results) {
                        // TO BO เอาตรงนี้ไปใช้
                        dispatch(updateDataProsCusLocTable(results))
                        return results
                    })
                }
                if (item.planTrip) {
                    setDataPlanTrip(item.planTrip)
                }
                return item
            })
            setDataEditPlan(dataEditPlan)
        }
    }

    const [columnsHeader, setColumnsHeader] = useState([
        { key: 'nameSaleVosotPlan', title: 'Prospect/Customer' },
        { key: 'lotLongs', title: 'Location' },
        { key: 'timer', title: 'เวลา', isColumnCenter: true }
    ]);

    const handleButtonEdit = () => {
        navigation.navigate('CreatePlanForMeScreen', { dataPlanTrip: dataPlanTrip, dataListPlanTripProspect: dataListPlanTripProspect })
    };

    const handleDelete = (event) => {
        setModalDelete(event)
    }

    const handleConfirmDelete = (event) => {
        setModalDeleteConfirm(event)
        setModalDelete(false)
        handleButtonDelete()
    }

    const handleButtonDelete = () => {
        dispatch(cancelPlanTrip(dataPlanTrip))
        setModalDelete(false)
    };

    const handleButtonReject = () => {
        let totalValue = getInputData(inputRef);
        dispatch(rejectPlanTrip(dataPlanTrip, totalValue.data))
    }

    const handleButtonApprove = () => {
        let totalValue = getInputData(inputRef);
        dispatch(approvePlanTrip(dataPlanTrip, totalValue.data))
    }

    const handlePermission = () => {
        if (groupPermission == "SUPEPVISOR") {
            if (dataPlanTrip.status == '1') return true
            if (dataPlanTrip.status == '2') return true
            if (dataPlanTrip.status == '3') return true
            if (dataPlanTrip.status == '4') return true
            if (dataPlanTrip.status == '5') return true

            return false
        } else if (groupPermission == "MANAGER") {
            if (dataPlanTrip.status == '1') return true
            if (dataPlanTrip.status == '2') return true
            if (dataPlanTrip.status == '3') return true
            if (dataPlanTrip.status == '4') return true
            if (dataPlanTrip.status == '5') return true

            return false
        } else {
            if (dataPlanTrip.status == '1') return true
            if (dataPlanTrip.status == '3') return true
            if (dataPlanTrip.status == '4') return true
            if (dataPlanTrip.status == '5') return true

            return false
        }
    };

    const handleNavScreen = (permObjCode) => {
        let premissionScreen = listPermission.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        if (premissionScreen) return handleButtonEdit();
        if (!premissionScreen) return navigation.navigate('DontHavePermission');
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <Header />
            <ScrollView>
                <View style={{ marginBottom: '10%' }}>
                    <View style={{ flex: 1, marginHorizontal: '5%', marginBottom: '5%', marginTop: '5%' }}>
                        <View style={{ flex: 1, marginBottom: '5%' }}>
                            <TextInput
                                editable={false}
                                title={'Plan Trip Name'}
                                value={dataPlan.planTripName}
                            />
                        </View>
                        <View style={{ flex: 1, marginBottom: '5%' }}>
                            <TextInput
                                editable={false}
                                title={'วันที่เข้าเยี่ยม'}
                                value={dayjs(dataPlan.planTripDate).locale('th').format('D/M/BBBB')}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {
                            dataPlan.planTripDate > dataData ?
                                dataPlan.status == '1' || dataPlan.status == '3' ?
                                    <View style={{ paddingBottom: '5%' }}>
                                        <Table
                                            columns={columnsHeader}
                                            data={dataListPlanTripProspect}
                                            nopage={true}
                                        />
                                    </View>
                                    :
                                    <View style={{ paddingBottom: '5%' }}>
                                        <Table
                                            columns={columnsHeader}
                                            data={dataListPlanTripProspect}
                                            nopage={true}
                                            edittableonly
                                            onPressEditOnly={(item) => navigation.navigate('EditableViewVisitPlanScreen', { dataProsSelect: item })}
                                        />
                                    </View>
                                :
                                <View style={{ paddingBottom: '5%' }}>
                                    <Table
                                        columns={columnsHeader}
                                        data={dataListPlanTripProspect}
                                        nopage={true}
                                        edittableonly
                                        onPressEditOnly={(item) => navigation.navigate('EditableViewVisitPlanScreen', { dataProsSelect: item })}
                                    />
                                </View>
                        }
                    </View>

                    <View style={{ width: '90%', marginHorizontal: '5%' }}>
                        <TextInput
                            editable={handlePermission() && dataPlanTrip.status == '2' ? true : false}
                            title={"หมายเหตุ"}
                            value={dataPlanTrip.remark}
                            ref={el => inputRef.current.remark = el}
                            maxLength={150}
                            heightBox={STYLE_SIZE.BNT_HEIGTH * 3}
                            multiline={true}
                            isOnlyText={true}
                        />
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderColor: colors.gray, marginTop: '10%', marginBottom: '5%' }} />

                    {
                        dataPlanDateNew == dataDateNew && handlePermission() && dataPlanTrip.status == '2' ?
                            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                                <View style={{ marginHorizontal: '1%' }}>
                                    <Button
                                        title={'Reject'}
                                        width={'40%'}
                                        onPress={() => handleButtonReject()}
                                    />
                                </View>
                                <View style={{ marginHorizontal: '1%' }}>
                                    <Button
                                        title={'Approve'}
                                        width={'40%'}
                                        onPress={() => handleButtonApprove()}
                                    />
                                </View>
                                <View style={{ marginHorizontal: '1%' }}>
                                    <Button
                                        title={'Close'}
                                        width={'40%'}
                                        onPress={() => navigation.navigate('SaleVisitPlanScreen')}
                                    />
                                </View>
                            </View>

                            :
                            dataPlan.planTripDate > dataData ?
                                handlePermission() ?
                                    handlePermission() && dataPlanTrip.status == '2' ?
                                        <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                                            <View style={{ marginHorizontal: '1%' }}>
                                                <Button
                                                    title={'Reject'}
                                                    width={'40%'}
                                                    onPress={() => handleButtonReject()}
                                                />
                                            </View>
                                            <View style={{ marginHorizontal: '1%' }}>
                                                <Button
                                                    title={'Approve'}
                                                    width={'40%'}
                                                    onPress={() => handleButtonApprove()}
                                                />
                                            </View>
                                            <View style={{ marginHorizontal: '1%' }}>
                                                <Button
                                                    title={'Close'}
                                                    width={'40%'}
                                                    onPress={() => navigation.navigate('SaleVisitPlanScreen')}
                                                />
                                            </View>
                                        </View>
                                        :

                                        perNotPlanOwner ?
                                            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
                                                <View style={{ marginHorizontal: '1%' }}>
                                                    <Button
                                                        title={'Edit'}
                                                        width={'40%'}
                                                        onPress={() => handleNavScreen('FE_PLAN_TRIP_S013')}
                                                    />
                                                </View>
                                                <View style={{ marginHorizontal: '1%' }}>
                                                    <Button
                                                        title={'Delete'}
                                                        width={'40%'}
                                                        onPress={() => handleDelete(true)}
                                                    />
                                                </View>
                                                <View style={{ marginHorizontal: '1%' }}>
                                                    <Button
                                                        title={'Close'}
                                                        width={'40%'}
                                                        onPress={() => navigation.navigate('SaleVisitPlanScreen')}
                                                    />
                                                </View>
                                            </View>
                                            :
                                            <View style={{ alignSelf: 'center' }}>
                                                <Button
                                                    title={'Close'}
                                                    width={'40%'}
                                                    onPress={() => navigation.navigate('SaleVisitPlanScreen')}
                                                />
                                            </View>
                                    :
                                    <View style={{ alignSelf: 'center' }}>
                                        <Button
                                            title={'Close'}
                                            width={'40%'}
                                            onPress={() => navigation.navigate('SaleVisitPlanScreen')}
                                        />
                                    </View>
                                :
                                <View style={{ alignSelf: 'center' }}>
                                    <Button
                                        title={'Close'}
                                        width={'40%'}
                                        onPress={() => navigation.navigate('SaleVisitPlanScreen')}
                                    />
                                </View>
                    }
                    <ModalWarning
                        visible={modalDelete}
                        onPressCancel={() => handleDelete(false)}
                        onPressConfirm={() => handleConfirmDelete(true)}
                        detailText={language.DELETE}
                    />
                    <ModalWarning
                        visible={modalDeleteConfirm}
                        onPressClose={() => { setModalDeleteConfirm(false), navigation.navigate('SaleVisitPlanScreen') }}
                        detailText={language.DELETESUCCESS}
                        onlyCloseButton
                    />
                    <ModalWarning
                        visible={modalApprove}
                        onPressClose={() => { setModalApprove(false), dispatch(resetApprove()) }}
                        detailText={saleVisitPlanReducer.approvePlnTripMSG}
                        onlyCloseButton
                    />
                    <ModalWarning
                        visible={modalApproveSuccess}
                        onPressClose={() => { setModalApproveSuccess(false), dispatch(resetApprove()), navigation.navigate('SaleVisitPlanScreen') }}
                        detailText={language.CONFIRNSUCCESS}
                        onlyCloseButton
                    />
                    <ModalWarning
                        visible={modalReject}
                        onPressClose={() => { setModalReject(false), dispatch(resetReject()) }}
                        detailText={saleVisitPlanReducer.rejectlPlnTripMSG}
                        onlyCloseButton
                    />
                    <ModalWarning
                        visible={modalRejectSuccess}
                        onPressClose={() => { setModalRejectSuccess(false), dispatch(resetReject()), navigation.navigate('SaleVisitPlanScreen') }}
                        detailText={language.CONFIRNSUCCESS}
                        onlyCloseButton
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default ViewVisitPlan;
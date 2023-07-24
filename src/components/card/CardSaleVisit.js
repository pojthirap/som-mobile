import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../utility/colors';
import { SALEVISIT_STATUS, FONT_SIZE, SALEVISITPLAN_STATUS } from '../../utility/enum';
import Text from '../Text';
import Button from '../Button';

import { FlatList } from 'react-native-gesture-handler';
import dayjs from 'dayjs'
var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)
import { getConfigLov } from '../../actions/getConfigLovAction';

require('dayjs/locale/th')

const CardSaleVisit = ({ isStatus = true,
    planTripData,
    onPressView,
    onPressAccept,
    isSaleVisitPlan = false,
    onPressViewWaitApprove,
    navigation,
    goBack,
}) => {

    const { getConfigLovReducer, authReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    let listPermission = authReducer.userProfile.listPermObjCode;

    const [perButtonView, setPerButtonView] = useState(false);

    useEffect(() => {
        if (getConfigLovReducer.lovKeyword_Loding) {
            dispatch(getConfigLov("PLAN_TRIP_STATUS"))
        }
    }, [])

    const backgroundStatus = (Status) => {
        if (getConfigLovReducer.lovKeyword != '') {
            let findStatusColor = getConfigLovReducer.lovKeyword.find((item) => {
                return item.lovKeyvalue == Status
            })
            let color = findStatusColor.condition1.split('|')
            return color[0]
        }
    }
    const findPermission = () => {
        let ButtonView = listPermission.find((item) => {
            return item.permObjCode == "FE_VISIT_S01_VIEW"
        })
        if (ButtonView.permObjCode == "FE_VISIT_S01_VIEW") {
            setPerButtonView(true)
        }
    }

    const findStatue = (Status) => {
        if (getConfigLovReducer.lovKeyword != '') {
            let findStatus = getConfigLovReducer.lovKeyword.find((item) => {
                return item.lovKeyvalue == Status
            })
            if (!findStatus.lovNameTh) return
            return findStatus.lovNameTh
        }
    };

    const TextStatusColor = (Status) => {
        if (getConfigLovReducer.lovKeyword != '') {
            let findStatusColor = getConfigLovReducer.lovKeyword.find((item) => {
                return item.lovKeyvalue == Status
            })
            let color = findStatusColor.condition1.split('|')
            return color[1]
        }
    };




    const CardArea = (planTripData) => {
        return (
            <View style={[styles.container, styles.styleShadow]}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ width: '100%' }}>
                                <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }} numberOfLines={1}>{planTripData.item.planTripName}</Text>
                            </View>
                            <View style={{ marginTop: '3%' }}>
                                <Text>โดย {`${planTripData.item.firstName} ${planTripData.item.lastName}`}</Text>
                            </View>
                            <View style={{ paddingTop: '3%' }}>
                                <Text>วันที่เข้าเยี่ยม : {dayjs(planTripData.item.planTripDate).locale('th').locale('th').format(' dddd, D MMMM BBBB')}</Text>
                            </View>
                            <View>
                                <Text>วันที่สร้าง : {dayjs(planTripData.item.createDtm).locale('th').locale('th').format(' dddd, D MMMM BBBB')}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: '3%' }}>
                            {
                                isStatus ?
                                    isSaleVisitPlan ?
                                        <View style={{ flex: 1 }}>
                                            <View style={{ backgroundColor: backgroundStatus(planTripData.item.status) || colors.redBGStatus, height: 40, width: '100%', justifyContent: 'center', borderRadius: 40 }}>
                                                <Text style={{ color: TextStatusColor(planTripData.item.status) || 'red', alignSelf: 'center', fontSize: 22 }}>{findStatue(planTripData.item.status)}</Text>
                                            </View>
                                        </View>

                                        :
                                        planTripData.item.status === 1 ?
                                            <View style={{ flex: 1 }}>
                                                <View style={{ backgroundColor: colors.greenBGStatus, height: 40, width: '100%', justifyContent: 'center', borderRadius: 40 }}>
                                                    <Text style={{ color: colors.primary, alignSelf: 'center', fontSize: FONT_SIZE.LITTLETEXT }}>{SALEVISIT_STATUS[planTripData.item.status]}</Text>
                                                </View>
                                            </View>

                                            :
                                            planTripData.item.status === 2 ?
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ backgroundColor: colors.orangeBGStatus, height: 40, width: '100%', justifyContent: 'center', borderRadius: 40 }}>
                                                        <Text style={{ color: colors.orange, alignSelf: 'center', fontSize: FONT_SIZE.LITTLETEXT }}>{SALEVISIT_STATUS[planTripData.item.status]}</Text>
                                                    </View>
                                                </View>

                                                :
                                                null
                                    :
                                    null
                            }

                            {
                                isSaleVisitPlan && planTripData.item.status === "A" ?
                                    <>
                                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                            <Button title={'View'} onPress={() => navigation.navigate('SaleVisitPlanTripScreen', { planTrip: planTripData.item })} width="70%" />
                                        </View>
                                    </>
                                    :
                                    isSaleVisitPlan && planTripData.item.status === "A" ?
                                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                            <Button title={'View'} onPress={onPressViewWaitApprove} width="70%" />
                                        </View>
                                        :
                                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                            <View style={{ backgroundColor: backgroundStatus(planTripData.item.status), height: 40, width: '100%', justifyContent: 'center', borderRadius: 40, marginTop: '5%' }}>
                                                <Text style={{ color: TextStatusColor(planTripData.item.status), alignSelf: 'center', fontSize: FONT_SIZE.LITTLETEXT }}>{planTripData.item.statusDesc}</Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Button title={'View'} onPress={() => navigation.navigate('SaleVisitPlanTripScreen', { planTrip: planTripData.item })} width="70%" />
                                            </View>
                                        </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <FlatList
            data={planTripData}
            renderItem={(planTripData) => CardArea(planTripData)}
            ListEmptyComponent={() => {
                return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>ไม่พบข้อมูล</Text>
                </View>)
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: '5%',
        // height: 210,
        marginHorizontal: '3%',
        marginVertical: '5%'
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
});

export default CardSaleVisit;
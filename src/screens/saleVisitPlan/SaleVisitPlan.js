import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Icon } from 'native-base';
import { Calendar } from 'react-native-big-calendar'
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useDispatch, useSelector } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';

import colors from '../../utility/colors';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import { Text, Button, CardSaleVisitPlantrip, SelectDropdown, Header, ModalWarning } from '../../components'
import { getInputData } from '../../utility/helper';
import { getSearchPlanTrip, getEmpForAssignPlanTrip, mergPlanTrip } from '../../actions/SaleVisitPlanAction';
import { getConfigLovPlanStatus } from '../../actions/getConfigLovAction';

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const SaleVisitPlan = (props) => {
    const navigation = useNavigation()
    const [SelectDate, setSelectDate] = useState(dayjs())
    const [selectMonth, setSelectMonth] = useState(dayjs())
    const [SelectDateFlag, setSelectDateFlag] = useState(true)
    const onPressNext = () => {
        setSelectMonth(dayjs(selectMonth).add(1, 'month'))
        setSelectDateFlag(false)
        let date = dayjs(selectMonth).add(1, 'month')
        let dateCalendar = dayjs(date).locale('th').format('YYYYMM');
        dispatch(getSearchPlanTrip(dateCalendar))

    }
    const onPressBack = () => {
        setSelectMonth(dayjs(selectMonth).add(-1, 'month'))
        setSelectDateFlag(false)
        let date = dayjs(selectMonth).add(-1, 'month')
        let dateCalendar = dayjs(date).locale('th').format('YYYYMM');
        dispatch(getSearchPlanTrip(dateCalendar))

    }
    const { saleVisitPlanReducer } = useSelector((state) => state);
    const { getConfigLovReducer } = useSelector((state) => state);
    const { authReducer } = useSelector((state) => state);
    const { getUserProfileReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [dataEventList, setDataEventList] = useState([]);
    const [Filtered, setFiltered] = useState(null);
    const [groupPermission, setGroupPermission] = useState(authReducer.userProfile.admGroup_GroupCode);
    const [modalAccept, setModalAccept] = useState(false);
    const [filterSaleRep, setFilterSaleRep] = useState('');
    const today = new Date()
    const [statusList, setStatusList] = useState([]);
    let listPermission = getUserProfileReducer.dataUserProfile.listPermObjCode;

    useEffect(() => {
        // if (saleVisitPlanReducer.dataEmpAssignPlanTrip) {
        //     let filterOwn = saleVisitPlanReducer.dataEmpAssignPlanTrip.filter((item) => {
        //         return item.empId != authReducer.userProfile.empId
        //     })
        //     setFilterSaleRep(filterOwn)
        // }
        setFilterSaleRep(saleVisitPlanReducer.dataEmpAssignPlanTrip)
    }, [saleVisitPlanReducer.dataEmpAssignPlanTrip])

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                if (props.route.params.SelectMonthPlan == undefined) {
                    let dateCalendar = dayjs(selectMonth).locale('th').format('YYYYMM');
                    dispatch(getSearchPlanTrip(dateCalendar))

                } else {
                    let dateCalendar = dayjs(props.route.params.SelectMonthPlan).locale('th').format('YYYYMM');
                    dispatch(getSearchPlanTrip(dateCalendar))

                }
                dispatch(getConfigLovPlanStatus("PLAN_TRIP_STATUS"))
                dispatch(getEmpForAssignPlanTrip())

            }, 1000)
            return () => {
                //when unFocus
            };
        }, [])
    );

    useEffect(() => {
        if (getConfigLovReducer.lovKeywordPlanStatus == null) return
    }, [getConfigLovReducer.lovKeywordPlanStatus])

    useEffect(() => {
        createEventList()
    }, [saleVisitPlanReducer.dataPlanTrip])

    useEffect(() => {
        if (props.route.params.formSelectMenu == true) {
            setSelectDate(today)
        }
    }, [props.route.params])

    useEffect(() => {

        if (!saleVisitPlanReducer.merglPlnTrip_success && !saleVisitPlanReducer.merglPlnTrip_error) {
            setModalAccept(false)
        }
        else if (saleVisitPlanReducer.merglPlnTrip_success && !saleVisitPlanReducer.merglPlnTrip_error) {
            let dateCalendar = dayjs(selectMonth).locale('th').format('YYYYMM');
            dispatch(getSearchPlanTrip(dateCalendar))
        }

        else if (saleVisitPlanReducer.merglPlnTrip_success && saleVisitPlanReducer.merglPlnTrip_error) {
            setModalAccept(true)
        }

    }, [saleVisitPlanReducer])

    useEffect(() => {
        if (getConfigLovReducer.lovKeywordPlanStatus) {
            let dataFilterCancle = getConfigLovReducer.lovKeywordPlanStatus.filter((itemList) => {
                return itemList.lovKeyvalue != 5
            })

            setStatusList(dataFilterCancle)
        }
    }, [getConfigLovReducer.lovKeywordPlanStatus])

    useEffect(() => {
        if (props.route.params.SelectDatePlan) {
            setSelectDate(props.route.params.SelectDatePlan)
            setSelectMonth(props.route.params.SelectMonthPlan)
            handleDate(props.route.params.SelectDatePlan)

        } else {
            return
        }
    }, [props.route.params.SelectDatePlan])

    const handleSearch = () => {
        let totalValue = getInputData(inputRef);
        let searchEmpId = totalValue.data.empId;
        let searchLovCodeTh = totalValue.data.lovKeyvalue;

        let dateCalendar = dayjs(selectMonth).locale('th').format('YYYYMM');
        dispatch(getSearchPlanTrip(dateCalendar, searchEmpId, searchLovCodeTh))

    };

    function sameDay(d1, d2) {
        return d1.get('year') === d2.get('year') &&
            d1.get('month') === d2.get('month') &&
            d1.get('date') === d2.get('date');
    };

    const handleDate = (date) => {
        setSelectDate(date);
        let d1 = dayjs(date);
        if (!saleVisitPlanReducer?.dataPlanTrip) return crashlytics().log('SaleVisitPlan : null saleVisitPlanReducer?.dataPlanTrip');
        const filterDataPlan = saleVisitPlanReducer.dataPlanTrip.filter((item) => {
            let d2 = dayjs(item.planTripDate);
            return sameDay(d1, d2)
        });
        setFiltered(filterDataPlan);
    };

    const handleClear = (type) => {

        if (type == "sup") {
            inputRef.current.lovKeyvalue.clear()
            inputRef.current.empId.clear()
        }

        if (type == "nonSup") {
            inputRef.current.lovKeyvalue.clear()
        }
    };

    const createEventList = () => {
        if (!saleVisitPlanReducer.dataPlanTrip) return
        let eventList = saleVisitPlanReducer.dataPlanTrip.map((item) => {
            var timeAdd = new Date(item.planTripDate);
            timeAdd.setHours(timeAdd.getHours() + 1);

            return {
                title: item.planTripName,
                start: timeAdd,
                end: timeAdd,
                status: item.status
            }
        })
        handleDate(SelectDate)
        return setDataEventList(eventList);
    };

    const handleViwePlan = (item, btn) => {
        setModalAccept(false)
        navigation.navigate('ViewVisitPlanScreen', { dataPlan: item, perNotPlanOwner: btn });
    }

    const handleAcceptPlan = (item) => {
        dispatch(mergPlanTrip(item))
    }

    const TextStatusColor = (Status) => {
        if (!getConfigLovReducer.lovKeywordPlanStatus) return
        if (getConfigLovReducer.lovKeywordPlanStatus != '') {
            let findStatusColor = getConfigLovReducer.lovKeywordPlanStatus.find((item) => {
                return item.lovKeyvalue == Status
            })
            let color = findStatusColor.condition1.split('|')
            return color[1]
        }
    };

    const backgroundStatus = (Status) => {
        if (!getConfigLovReducer.lovKeywordPlanStatus) return
        if (getConfigLovReducer.lovKeywordPlanStatus != '') {
            let findStatusColor = getConfigLovReducer.lovKeywordPlanStatus.find((item) => {
                return item.lovKeyvalue == Status
            })
            let color = findStatusColor.condition1.split('|')
            return color[0]
        }
    }

    const handlePermission = () => {
        if (groupPermission == "SUPEPVISOR") return true
        if (groupPermission == "MANAGER") return true

        return false
    };

    const handleModalAccept = (event) => {
        setModalAccept(event)
        let dateCalendar = dayjs(selectMonth).locale('th').format('YYYYMM');
        dispatch(getSearchPlanTrip(dateCalendar))

    };

    const handleNavScreen = (screen, permObjCode) => {
        let premissionScreen = listPermission.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        setFiltered(null)
        setSelectDate(dayjs())
        setSelectMonth(dayjs())
        props.route.params.SelectMonthPlan = undefined
        if (premissionScreen) return navigation.navigate(screen);
        if (!premissionScreen) return navigation.navigate('DontHavePermission');
    };

    const handleNavScreenView = (item, permObjCode, btn) => {
        let premissionScreen = listPermission.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        setFiltered(null)
        setSelectDate(dayjs())
        setSelectMonth(dayjs())
        props.route.params.SelectMonthPlan = undefined
        if (premissionScreen) return handleViwePlan(item, btn);
        if (!premissionScreen) return navigation.navigate('DontHavePermission');
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={{ backgroundColor: colors.white, flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ minHeight: 500, backgroundColor: colors.greenBGStatus }}>
                        <View style={{ justifyContent: 'space-between' }}>
                            <View style={{ paddingHorizontal: '3%', paddingVertical: '2%' }}>
                                <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>Good morning,</Text>
                                <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>Sales Visit Plan</Text>
                            </View>
                            {
                                handlePermission() ?
                                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: '2%', paddingRight: '5%' }}>
                                        <View style={{ paddingRight: '2%' }}>
                                            <Button
                                                title={'Create for me'}
                                                width={STYLE_SIZE.BNT_WIDTH}
                                                // onPress={()=> navigation.navigate('CreatePlanForMeScreen')}
                                                onPress={() => handleNavScreen('CreatePlanForMeScreen', 'FE_PLAN_TRIP_S011')}
                                                textSize={FONT_SIZE.LITTLETEXT}
                                            />
                                        </View>
                                        <View>
                                            <Button
                                                title={'Create for other'}
                                                width={STYLE_SIZE.BNT_WIDTH}
                                                // onPress={()=> navigation.navigate('CreatePlanForOtherScreen')}
                                                onPress={() => handleNavScreen('CreatePlanForOtherScreen', 'FE_PLAN_TRIP_S011')}
                                                textSize={FONT_SIZE.LITTLETEXT}
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: '2%', paddingRight: '5%' }}>
                                        <View style={{ paddingRight: 5 }}>
                                            <Button
                                                title={'Create for me'}
                                                width={STYLE_SIZE.BNT_WIDTH}
                                                // onPress={()=> navigation.navigate('CreatePlanForMeScreen')}
                                                onPress={() => handleNavScreen('CreatePlanForMeScreen', 'FE_PLAN_TRIP_S011')}
                                                textSize={FONT_SIZE.LITTLETEXT}
                                            />
                                        </View>
                                    </View>
                            }
                        </View>
                        {/* {Calenda Area} */}
                        <View style={{ marginTop: '2%', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '50%', margin: '2%' }}>
                                <View style={{ backgroundColor: colors.white, width: '100%', borderRadius: 10, height: '100%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: '2%', paddingTop: '3%' }}>
                                        <View style={{ paddingRight: '5%' }}>
                                            <Icon type="MaterialCommunityIcons" name="calendar-blank-outline" style={{ color: colors.gray, fontSize: FONT_SIZE.TEXT }} />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>{dayjs(SelectDate).locale('th').format('dddd, D MMM BBBB')}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', margin: '2%' }}>
                                <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => onPressBack()}>
                                    <Icon type='Ionicons' name='caret-back-circle-outline' style={{ fontSize: FONT_SIZE.LITTLETEXT, alignSelf: 'center' }} />
                                </TouchableOpacity>
                                <View style={{ justifyContent: 'center', paddingHorizontal: '2%' }}>
                                    <Text style={{ alignSelf: 'center', fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>{dayjs(selectMonth).locale('th').format('MMMM,BBBB')}</Text>
                                </View>
                                <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => onPressNext()}>
                                    <Icon type='Ionicons' name='caret-forward-circle-outline' style={{ fontSize: FONT_SIZE.LITTLETEXT, alignSelf: 'center' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, marginHorizontal: '5%', borderRadius: 20, marginVertical: '5%' }}>
                            <Calendar
                                events={dataEventList}
                                height={STYLE_SIZE.CALENDAR_SIZE}
                                date={selectMonth}
                                mode={'month'}
                                swipeEnabled={false}
                                locale="th"
                                renderEvent={(item) => {
                                    return <View style={{ height: '40%', backgroundColor: backgroundStatus(item.status), marginTop: '2%', borderRadius: 5, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, color: TextStatusColor(item.status), paddingLeft: '2%' }} numberOfLines={1}>{item.title}</Text>
                                    </View>
                                }}
                                maxVisibleEventCount={0}
                                style={{ marginTop: -100 }}
                                onPressCell={(date) => handleDate(date)}
                            />
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <View style={{ marginTop: '5%', paddingHorizontal: '5%' }}>
                            <View>
                                <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>Plan</Text>
                            </View>
                            <View style={{ flex: 1, marginTop: '2%', alignItems: 'center' }}>
                                {
                                    handlePermission() ?
                                        <View style={{ flex: 1, paddingRight: '2%', width: '100%' }}>
                                            <SelectDropdown
                                                titleDropdown={'Sale Rep'}
                                                titleAlert={'Sale Rep'}
                                                dataList={filterSaleRep}
                                                titleKey={"fullName"}
                                                valueKey={"empId"}
                                                ref={el => inputRef.current.empId = el}
                                            />
                                        </View >
                                        :
                                        null
                                }
                                <View style={{ flex: 1, paddingRight: 5, marginHorizontal: '2%', width: '100%' }}>
                                    <SelectDropdown
                                        titleDropdown={'Status'}
                                        titleAlert={'Status'}
                                        dataList={statusList}
                                        titleKey={"lovNameTh"}
                                        valueKey={"lovKeyvalue"}
                                        ref={el => inputRef.current.lovKeyvalue = el}
                                    />
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={{ flex: 1, alignSelf: 'center', paddingTop: '8%', marginEnd: '2%' }}>
                                        <Button
                                            onPress={() => handleSearch()}
                                            title={'Search'}
                                            typeIcon={'Ionicons'}
                                            nameIcon={'search-outline'}
                                            buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                            IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                                        />
                                    </View>
                                    {
                                        handlePermission() ?
                                            <View style={{ flex: 1, alignSelf: 'center', paddingTop: '8%', marginStart: '2%' }}>
                                                <Button
                                                    onPress={() => handleClear("sup")}
                                                    title={'Clear'}
                                                    typeIcon={'Ionicons'}
                                                    nameIcon={'trash-outline'}
                                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                                    color={colors.grayButton}
                                                    colorBorder={colors.grayButton}
                                                    IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                                                />
                                            </View>
                                            :
                                            <View style={{ flex: 1, alignSelf: 'center', paddingTop: '8%', marginStart: '2%' }}>
                                                <Button
                                                    onPress={() => handleClear("nonSup")}
                                                    title={'Clear'}
                                                    typeIcon={'Ionicons'}
                                                    nameIcon={'trash-outline'}
                                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                                    color={colors.grayButton}
                                                    colorBorder={colors.grayButton}
                                                    IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                                                />
                                            </View>
                                    }
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: '5%', alignItems: 'center', paddingHorizontal: '10%' }}>
                            <View style={{ marginBottom: '2%' }}>
                                <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>{dayjs(SelectDate).locale('th').format('dddd, D MMMM BBBB')}</Text>
                            </View>
                        </View>

                        {
                            Filtered && Filtered.length == 0 ?
                                <Text style={{ marginTop: '10%', marginBottom: '5%', alignSelf: 'center' }}>ไม่พบข้อมูล</Text>
                                :
                                <CardSaleVisitPlantrip
                                    planTripData={Filtered}
                                    isSaleVisitPlan
                                    onPressView={(item, btn) => handleNavScreenView(item, 'FE_PLAN_TRIP_S015', btn)}
                                    onPressAccept={(item) => handleAcceptPlan(item)}
                                />
                        }
                        <ModalWarning
                            visible={modalAccept}
                            onPressClose={() => handleModalAccept(false)}
                            detailText={saleVisitPlanReducer.merglPlnTripMSG}
                            onlyCloseButton
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.greenBGStatus,
    }
});

export default SaleVisitPlan;
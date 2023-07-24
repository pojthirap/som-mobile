import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { getConfigLovDay } from '../../../actions/getConfigLovAccountAction';
import { searchVisitHour, addVisitHour } from '../../../actions/prospectAction';
import { Button, Text, Modal, CardVisitHour, CheckBox, ModalWarning, TimePicker } from '../../../components'
import colors from '../../../utility/colors'
import { FONT_SIZE } from '../../../utility/enum';
import language from '../../../language/th.json';

const SubmenuVisitHour = () => {

    const [modalVisible, setmodalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [modalVisibleTimeAlert, setmodalVisibleTimeAlert] = useState(false);
    const [modalVisibleDayAlert, setmodalVisibleDayAlert] = useState(false);
    const [modalVisibleAlertAdd, setmodalVisibleAlertAdd] = useState(false);
    const [modalVisibleAddSuccess, setmodalVisibleAddSuccess] = useState(false);
    const [modalVisibleDup, setmodalVisibleDup] = useState(false);
    const [dupData, setDupData] = useState();
    const { prospectReducer, prospectSelectInfoReducer, getConfigLovAccountReducer } = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if (prospectId) {
            dispatch(searchVisitHour(prospectId))
        }
        if (getConfigLovAccountReducer.lovKeywordDay_Loding) {
            dispatch(getConfigLovDay("DAYS_CODE"))
        }
    }, [])

    useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if (prospectReducer.addVisitHourSucess) {
            dispatch(searchVisitHour(prospectId))
            setmodalVisibleDup(false)
        }
        if (prospectReducer.delVisitHourSucess) {
            dispatch(searchVisitHour(prospectId))
        }
    }, [prospectReducer.addVisitHourSucess, prospectReducer.delVisitHourSucess])

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const getLength = () => {
        if (prospectReducer.visitHourData) {
            let length = prospectReducer.visitHourData.records.length
            return length
        } else {
            return 0
        }
    }

    function compare(a, b) {
        if (a.hourStart < b.hourStart) {
            return -1;
        }
        if (a.hourStart > b.hourStart) {
            return 1;
        }
        return 0;
    }

    const onPressConfirm = () => {
        if (selectedItem.length === 0) {
            setmodalVisibleDayAlert(true)
            setmodalVisibleDup(false)
            setmodalVisibleAlertAdd(false)
        }
        else if (startTime >= endTime) {
            setmodalVisibleTimeAlert(true)
            setmodalVisibleDup(false)
            setmodalVisibleAlertAdd(false)
        }
        if (selectedItem.length != 0 && startTime < endTime) {
            let visitHourDay = prospectReducer.visitHourData.records
            const newHourStart = parseInt(startTime.replace(':', ''))
            const newHourEnd = parseInt(endTime.replace(':', ''))
            let tmpDayCode = []
            let dupDayCodeList = {}

            selectedItem.forEach((dayCode) => {
                if (dayCode) {
                    tmpDayCode.push(dayCode)

                    visitHourDay.forEach((currData) => {
                        if (dayCode == currData.daysCode) {
                            const currHourStart = parseInt(currData.hourStart.replace(":", ""))
                            const currHourEnd = parseInt(currData.hourEnd.replace(":", ""))
                            if (
                                (currHourStart <= newHourStart && newHourStart <= currHourEnd) ||
                                (currHourStart <= newHourEnd && newHourEnd <= currHourEnd) ||
                                (newHourStart <= currHourStart && currHourEnd <= newHourEnd)
                            ) {
                                if (dupDayCodeList[dayCode]) {
                                    dupDayCodeList[dayCode].timeList.push(currData)
                                }
                                else {
                                    dupDayCodeList[dayCode] = { dayDesc: currData.lovNameTh, timeList: [currData] }
                                }
                            }
                        }
                    })
                }
            })
            let dupListArr = []
            Object.keys(dupDayCodeList).forEach((key) => {
                dupDayCodeList[key].timeList.sort(compare);
                dupListArr.push(dupDayCodeList[key])
            })
            if (dupListArr.length == 0) {
                let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
                if (prospectId && selectedItem && startTime < endTime) {
                    dispatch(addVisitHour(prospectId, selectedItem, startTime, endTime))
                    setmodalVisibleAddSuccess(true)
                }
            } else {
                setmodalVisibleDup(true)
                setDupData(
                    <View>
                        <View><Text>{'ช่วงเวลาที่เลือกซ้ำกับช่วงเวลาดังต่อไปนี้'}</Text></View>
                        {dupListArr.map((data) => {
                            return (
                                <View style={{ paddingLeft: 10 }}>
                                    <View><Text>{data.dayDesc}</Text></View>
                                    {data.timeList.map((timeData) => {
                                        return (
                                            <View style={{ paddingLeft: 30 }}>
                                                <Text>{timeData.hourStart} - {timeData.hourEnd}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            )
                        })}
                    </View>
                )
            }
        }
        setmodalVisible(false);
        setmodalVisibleAlertAdd(false)
    }

    const onPressModal = (event) => {
        setmodalVisible(event);
        setSelectedItem([]);
    }

    const findSelect = (select) => {
        return selectedItem.find((value) => {
            return value == select
        })
    }

    const handleSelect = (value) => {
        let findItem = selectedItem.find((item) => {
            return item == value
        })

        if (findItem) {
            let filterItem = selectedItem.filter((item) => {
                return item != value
            })

            return setSelectedItem(filterItem)
        }

        return setSelectedItem([...selectedItem, value])
    }

    const onChangeTimeStart = (date) => {
        setStartTime(dayjs(date).format('HH:mm'))
    }

    const onChangeTimeEnd = (date) => {
        setEndTime(dayjs(date).format('HH:mm'))
    }

    const onCloseWarningDay = () => {
        setmodalVisibleDup(false)
        setmodalVisibleDayAlert(false)
        if (modalVisible === false) {
            setmodalVisible(true)
        } else {
            setmodalVisible(false)
        }
    }

    const onCloseWarningTime = () => {
        setmodalVisibleDup(false)
        setmodalVisibleTimeAlert(false)
        if (modalVisible === false) {
            setmodalVisible(true)
        } else {
            setmodalVisible(false)
        }
    }

    const onPressModalAdd = (event) => {
        setmodalVisibleAlertAdd(event);
        setmodalVisibleAddSuccess(false);
    }
    const onPressModalAddSuccess = (event) => {
        setmodalVisibleAddSuccess(event);
        setmodalVisibleAlertAdd(false);
    }

    const visitHour = () => {
        if (prospectReducer.visitHourData) {
            let groups = prospectReducer.visitHourData.records.reduce((groups, item) => {
                const date = item.daysCode.split('T')[0];
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(item);
                return groups;
            }, {})
            let groupArrays = Object.keys(groups).map((date) => {
                return {
                    date,
                    item: groups[date]
                };
            })
            return groupArrays
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, marginLeft: '5%', marginTop: '5%' }}>
                        <Text style={{ fontSize: FONT_SIZE.HEADER, fontWeight: 'bold' }}>{getTitle()}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: '5%' }}>
                        {prospectSelectInfoReducer.dataSelect.isOther || prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ?
                            null
                            :
                            <Button title={'Add'} typeIcon={'Ionicons'} nameIcon={'add-outline'} onPress={() => setmodalVisible(true)} width={'25%'}/>
                        }
                    </View>
                </View>
                <View style={{ marginHorizontal: '5%', marginBottom: '5%', flexDirection: 'row' }}>
                    <View style={{ paddingRight: '2%' }}>
                        <Text style={{ fontSize: FONT_SIZE.SUBTITLE, fontWeight: 'bold' }}>All Order</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: FONT_SIZE.SUBTITLE, color: colors.primary, fontWeight: 'bold' }}>{`(${getLength()})`}</Text>
                    </View>
                </View>

                <CardVisitHour data={visitHour()} />
            </ScrollView>

            <Modal
                visible={modalVisible}
                onPressCancel={onPressModal}
                title={'Add'}
            >
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: '3%', marginHorizontal: '8%' }}>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: FONT_SIZE.SUBTITLE, fontWeight: 'bold' }}>วัน</Text>
                        </View>
                        <View style={{flex: 1/3}}>
                            <Button title={'Add'} typeIcon={'MaterialCommunityIcons'} nameIcon={'plus'} width={'100%'} onPress={() => setmodalVisibleAlertAdd(true)} />
                        </View>
                    </View>

                    <View style={{ marginHorizontal: '8%', borderBottomWidth: 0.5, paddingBottom: '10%' }}>
                        <CheckBox onPress={() => handleSelect('2')} type={'end'} title={'วันจันทร์'} data={'2'} SelectDefault={findSelect('2')} typeSelect={'multiSelect'} />
                        <CheckBox onPress={() => handleSelect('3')} type={'end'} title={'วันอังคาร'} data={'3'} SelectDefault={findSelect('3')} typeSelect={'multiSelect'} />
                        <CheckBox onPress={() => handleSelect('4')} type={'end'} title={'วันพุธ'} data={'4'} SelectDefault={findSelect('4')} typeSelect={'multiSelect'} />
                        <CheckBox onPress={() => handleSelect('5')} type={'end'} title={'วันพฤหัสบดี'} data={'5'} SelectDefault={findSelect('5')} typeSelect={'multiSelect'} />
                        <CheckBox onPress={() => handleSelect('6')} type={'end'} title={'วันศุกร์'} data={'6'} SelectDefault={findSelect('6')} typeSelect={'multiSelect'} />
                        <CheckBox onPress={() => handleSelect('7')} type={'end'} title={'วันเสาร์'} data={'7'} SelectDefault={findSelect('7')} typeSelect={'multiSelect'} />
                        <CheckBox onPress={() => handleSelect('1')} type={'end'} title={'วันอาทิตย์'} data={'1'} SelectDefault={findSelect('1')} typeSelect={'multiSelect'} />
                    </View>

                    <View style={{ marginHorizontal: '8%', marginVertical: '5%', flexDirection: 'row' }}>
                        <View style={{ alignSelf: 'center', paddingRight: '5%' }}>
                            <Text style={{ fontSize: FONT_SIZE.SUBTITLE }}>เวลา</Text>
                        </View>

                        {/* {TimePicker} */}
                        <View style={{ paddingRight: '5%' }}>
                            <TimePicker onChange={(item) => onChangeTimeStart(item)} />
                        </View>

                        <View>
                            <TimePicker onChange={(item) => onChangeTimeEnd(item)} />
                        </View>
                        {/*  */}
                    </View>
                </View>
            </Modal>
            <ModalWarning
                visible={modalVisibleAlertAdd}
                detailText={language.ADD}
                onPressConfirm={() => onPressConfirm()}
                onPressCancel={() => onPressModalAdd(false)} />
            <ModalWarning
                visible={modalVisibleAddSuccess}
                detailText={language.ADDSUCCESS}
                onlyCloseButton={true}
                onPressClose={() => onPressModalAddSuccess(false)} />
            <ModalWarning
                visible={modalVisibleTimeAlert}
                detailText={'กรุณาเลือกช่วงเวลาให้ถูกต้อง'}
                onlyCloseButton={true}
                onPressClose={() => onCloseWarningTime()} />
            <ModalWarning
                visible={modalVisibleDayAlert}
                detailText={'กรุณาเลือกวันอย่างน้อย 1 วัน'}
                onlyCloseButton={true}
                onPressClose={() => onCloseWarningDay()} />
            <ModalWarning
                visible={modalVisibleDup}
                // detailText={`ช่วงเวลาที่เลือกซ้ำ`}
                detailOject={dupData}
                onlyCloseButton={true}
                onPressClose={() => onCloseWarningDay()} />
        </View>
    )
}

export default SubmenuVisitHour;
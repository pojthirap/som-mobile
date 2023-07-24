import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, Input } from 'native-base'
import {useDispatch, useSelector} from 'react-redux';
import { RadioButton } from 'react-native-paper';

import { TextInput, Table, Button, SelectDropdown, Text, Header, PickerDate, Map, ModalWarning } from '../../components'
import colors from '../../utility/colors';
import { getProspectCreatePlanTrip, updateDataProsCusLocTable, createPlanTrip, updPlanTrip } from '../../actions/SaleVisitPlanAction';
import { getLocActionForCreatePlan } from '../../actions/masterAction';
import { getInputData, waypoint } from '../../utility/helper';
import language from '../../language/th.json';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { STYLE_SIZE } from '../../utility/enum';

const CreatePlanForMe = (props) =>{

    const [dataListPlanTripProspect, setDataListPlanTripProspect] = useState([]);
    const [dataPlanTrip, setDataPlanTrip] = useState('');
    const [formScreenView, setformScreenView] = useState(false);

    const navigation = useNavigation();
    const {saleVisitPlanReducer} = useSelector((state) => state);
    const {masterReducer} = useSelector((state) => state);
    const {authReducer} = useSelector((state) => state);
    const {getUserProfileReducer} = useSelector((state) => state);
    const [groupPermission, setGroupPermission] = useState(authReducer.userProfile.admGroup_GroupCode);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [prospectList, setProspectList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [visitPlanList, setVisitPlanList] = useState([]);
    const [prospectType, setProspectType] = useState('P');
    const [selectDate,setSelectDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeStart, settimeStart] = useState('00:00');
    const [timeEnd, settimeEnd] = useState('00:00');
    const [modalChectListTable, setModalChectListTable] = useState(false);
    const [detailTextModal, setDetailTextModal] = useState('');
    const [modalSendSave, setModalSendSave] =useState(false);
    const [startSelect, setStartSelect] = useState('');
    const [stopSelect, setStopSelect] = useState('');
    const [requireAddPros, setRequireAddPros] = useState(true);
    const [requireAddLoc, setRequireAddLoc] = useState(false);
    const [startList, setStartList] = useState([]);
    const [stopList, setStopList] = useState([]);
    const today = new Date()
    const [dateToDate, setDateToDate] = useState(dayjs(today).locale('th').format('YYYY-MM-DD'));
    const [dateToDatePicker, setDateToDatePicker] = useState('');
    const [modalDelete, setModalDelete] = useState(false);
    const [modalDeleteSuccess, setModalDeleteSuccess] = useState(false);
    const [removeItem, setRemoveItem] = useState('');

    let listPermission = getUserProfileReducer.dataUserProfile.listPermObjCode;

    // Run alway in this screen //
    useEffect(() => {
        dispatch(getProspectCreatePlanTrip()) 
        dispatch(getLocActionForCreatePlan({})) 
    }, [])

    // Run when click from ViewVisitPLan Screen //
    useEffect(() => {
        
        if (props.route.params && props.route.params.dataPlanTrip) {
            setDataPlanTrip(props.route.params.dataPlanTrip)
            setformScreenView(true)
        }

        return
    }, [props.route.params])

    // For filter the location master not have latitude and longitude //
    useEffect(() => {

        setProspectList(saleVisitPlanReducer.prospectCrearPlanTrip)

        if (masterReducer.location.records) {
            let filOnlyLocation = masterReducer.location.records.filter((item) => {
                return (item.latitude && isFinite(item.latitude) && Math.abs(item.latitude) <= 90), (item.longitude && isFinite(item.longitude) && Math.abs(item.longitude) <= 180) && item.activeFlag == 'Y';
            })
            setLocationList(filOnlyLocation)
            setStopList(filOnlyLocation);
            setStartList(filOnlyLocation);
        };

        if (!saleVisitPlanReducer.prospectCrearPlanTrip) return
        if (formScreenView == true && saleVisitPlanReducer.prospectCrearPlanTrip != null && saleVisitPlanReducer.prospectCrearPlanTrip != undefined && masterReducer.location.records != null) {
            let filterProsCusOut = saleVisitPlanReducer.prospectCrearPlanTrip.filter((listProsCutNew) => {
                let prostKey = listProsCutNew.prospId

                let findDrupItem = saleVisitPlanReducer.updateValueList.find((listAPi) => {
                    return listAPi.prospId == prostKey
                })

                return !findDrupItem
            })

            setProspectList(filterProsCusOut)

            let filOnlyLocation = masterReducer.location.records.filter((item) => {
                return (item.latitude && isFinite(item.latitude) && Math.abs(item.latitude) <= 90), (item.longitude && isFinite(item.longitude) && Math.abs(item.longitude) <= 180) && item.activeFlag == 'Y';
            })

            let filterLocOut = filOnlyLocation.filter((listLocNew) => {
                let locKey = listLocNew.locId

                let findDrupItemLoc = saleVisitPlanReducer.updateValueList.find((listAPi) => {
                    return listAPi.locId == locKey
                })

                return !findDrupItemLoc
            })

            setLocationList(filterLocOut)
        }

    }, [saleVisitPlanReducer.prospectCrearPlanTrip, masterReducer.location.records]);

    // Run when the table change of data //
    useEffect(() => {
        setVisitPlanList(saleVisitPlanReducer.updateValueList);

    },[saleVisitPlanReducer.updateValueList]);

    useEffect(() => {
        if (startSelect) {
            let drupList = locationList.filter(loc => loc.locId != startSelect.locId && loc.locId != stopSelect.locId)
            if (startSelect.locId == stopSelect.locId) {
                setStopList([...drupList]);
            } else {
                setStopList([...drupList, startSelect]);
            }
            if (!stopSelect) setStartList([...drupList]);
        };
        if (stopSelect) {
            let drupList = locationList.filter(loc => loc.locId != stopSelect.locId && loc.locId != startSelect.locId)
            if (startSelect.locId == stopSelect.locId) {
                setStartList([...drupList]);
            } else {
                setStartList([...drupList, stopSelect]);
            }
            if (!startSelect) setStopList([...drupList]);
        }
    }, [locationList])

    useEffect(() => {
        let dateToDateSelect = dayjs(selectDate).locale('th').format('YYYY-MM-DD');
        setDateToDatePicker(dateToDateSelect)

    }, [selectDate])

    // Set title colume of table //
    const [columnsHeader, setColumnsHeader] = useState([
        { key: 'nameSaleVosotPlan', title: 'Prospect/Customer' },
        { key: 'lotLongs', title: 'Location' },
        { key: 'timer', title: 'เวลา', isColumnCenter: true }
    ])

    // Use when click button //
    const handleAddProsCus = async () => {
        await handleRequireText()

        let prosCutSelect = inputRef.current.prospAccId
        let locSelect = inputRef.current.locId

        if (!prosCutSelect && !locSelect) return
        if (prosCutSelect) prosCutSelect = prosCutSelect.getInputValue().value
        if (locSelect) locSelect = locSelect.getInputValue().value

        addProsCus(prosCutSelect, locSelect)
    };

    const handleRequireText = async () => {
        new Promise((resolve, reject) => {
            if (prospectType === 'P') {
                setRequireAddPros(true)
                setRequireAddLoc(false)
                return
            }
            if (prospectType === 'C') {
                setRequireAddPros(false)
                setRequireAddLoc(true)
                return
            }
            setTimeout(resolve, 100);
        });
    }

    const handleNotRequireText = async () => {
        new Promise((resolve, reject) => {
            setRequireAddPros(false)
            setRequireAddLoc(false)
            setTimeout(resolve, 100);
        });
    }

    // Use filter data in dropdown of prospect / customer, location leave in dropdown And use for update data into table this screen //
    const addProsCus = (prosCutSelect, locSelect) => {
        // if (!prosCutSelect && !locSelect) return
        if (!prosCutSelect && !locSelect) {
            if (prospectType === 'P') {
                setRequireAddPros(true)
                setRequireAddLoc(false)
                return
            }
            if (prospectType === 'C') {
                setRequireAddPros(false)
                setRequireAddLoc(true)
                return
            }
        } 
        let selectList = prospectList.find((item) => {
            return item.prospectId == prosCutSelect
        }); 
        let eventList = prospectList.filter((item)=>{
            return item.prospectId != prosCutSelect
        });

        let selectListLoc = locationList.find((item) => {
            return item.locId == locSelect
        }); 
        let eventListLoc = locationList.filter((item)=>{
            return item.locId != locSelect
        });
    
        setVisitPlanList([...visitPlanList, selectList || selectListLoc]);
        if (eventList) setProspectList(eventList);
        if (eventListLoc) {
            setLocationList(eventListLoc);
            setStartList(eventListLoc)
            setStopList(eventListLoc)
        } 

        dispatch(updateDataProsCusLocTable([...visitPlanList, selectList || selectListLoc]));
    }

    //Keep select start
    const handleStart = (selectStart) => {
        let totalList = locationList 
        if (startSelect) {
            let findDrup = locationList.filter(loc => loc.locId != startSelect.locId)
            totalList = [...findDrup, startSelect] 
        }

        setStartSelect(selectStart)
        let locSelectStart = selectStart.locId

        let eventListLoc = totalList.filter((item)=>{
            return item.locId != locSelectStart
        });

        if (eventListLoc) setLocationList(eventListLoc);
    };

    //Keep select stop
    const handleStop = (selectStop) => {
        let totalList = locationList 
        if (stopSelect) {
            let findDrup = locationList.filter(loc => loc.locId != stopSelect.locId)
            totalList = [...findDrup, stopSelect] 
        }

        setStopSelect(selectStop)
        let locSelectStop = selectStop.locId

        let eventListLoc = totalList.filter((item)=>{
            return item.locId != locSelectStop
        });

        if (eventListLoc) setLocationList(eventListLoc);
    };

    // Use when click icon trashcan in table for delete data in table this screen //
    const handleModalDelete = (event, removeItem) => {
        setModalDelete(event)
        setRemoveItem(removeItem)
    }

    const handleModalDeleteSuccess = (event) => {
        setModalDeleteSuccess(event)
        setModalDelete(false)
        handleRemoveTask()
    }

    // const handleRemoveTask = (removeItem) => {
    const handleRemoveTask = () => {
        
        if (!removeItem) return

        if (removeItem.locId) {
            let dataListLoc = visitPlanList.filter((item) => {
                return item.locId != removeItem.locId
            }); 

            removeItem.locNameTh = removeItem.accName || removeItem.locNameTh

            setVisitPlanList(dataListLoc)
            setLocationList([...locationList, removeItem]);
            setStartList([...locationList, removeItem]);
            setStopList([...locationList, removeItem]);
            
            dispatch(updateDataProsCusLocTable(dataListLoc));
        }

        if (removeItem.prospectId || removeItem.prospId) {
            let dataListProsCust = visitPlanList.filter((item) => {
                let idPros = item.prospectId || item.prospId
                let idRemove = removeItem.prospectId || removeItem.prospId
                return idPros != idRemove
            }); 

            setVisitPlanList(dataListProsCust)
            setProspectList([...prospectList, removeItem]);
            dispatch(updateDataProsCusLocTable(dataListProsCust));
        }
    };

    // Use when click radio to change between prospect/customer and location
    const onPressDropdown = (type) => {
        setProspectType(type)
        if (type === 'P') {
            setRequireAddPros(true)
            setRequireAddLoc(false)
            return
        }
        if (type === 'C') {
            setRequireAddPros(false)
            setRequireAddLoc(true)
            return
        }
    };

    // Use when click icon pencil in table for edit task //
    const handleEditTask = (item) => {
        if (formScreenView == true) {
            navigation.navigate('EditTemplateProsCus', {prosCusLoc : item, formScreenView : formScreenView})

        } else {
            navigation.navigate('EditTemplateProsCus', {prosCusLoc : item, formScreenView: false})

        }
    };

    // Use when click calendar //
    const selectDatePlan = (date) => {
        setSelectDate(date);
    };

    // Use for mark pin in map //
    const onPressAddMarker = (latlon) => {
        if (latlon.prospectId) return addProsCus(latlon.prospectId, undefined)
        
        addProsCus(undefined, latlon.locId)
    };

    // Use when click bestrounte //
    const onPressBestRounte = async () => {
        let locIdStart = inputRef.current.locIdStart
        let locIdStop = inputRef.current.locIdStop

        if (!locIdStart && !locIdStop) return
        if (locIdStart) locIdStart = locIdStart.getInputValue().value
        if (locIdStop) locIdStop = locIdStop.getInputValue().value

        let locIdStartData;
        let locIdStopData;

        if (!visitPlanList.length) return
        if (!locIdStart) locIdStartData = visitPlanList[0]
        if (!locIdStop) locIdStopData = visitPlanList[visitPlanList.length - 1]

        masterReducer.location.records.map((loc) => {
            if (loc.locId == locIdStart) return locIdStartData = loc
            if (loc.locId == locIdStop) return locIdStopData = loc
        })

        let gLocation = await waypoint(locIdStartData, locIdStopData, visitPlanList)

        if (gLocation) {
            let sortByWaypoint = []
            gLocation.waypointOrder.map((way) => {
                sortByWaypoint.push(visitPlanList[way])
            })

            setVisitPlanList(sortByWaypoint)
        }
    }

    //clear dropdown select start / stop
    const handleClear = () => {
        inputRef.current.locIdStart.clear()
        inputRef.current.locIdStop.clear()

        let currentLocationList = locationList

        if (!startSelect) return
        if (startSelect.locId) {
            let dataListLoc = visitPlanList.filter((item) => {
                return item.locId != startSelect.locId
            }); 

            startSelect.locNameTh = startSelect.accName || startSelect.locNameTh

            setVisitPlanList(dataListLoc)
            currentLocationList = [...currentLocationList, startSelect]
            setLocationList(currentLocationList);
            setStopList(currentLocationList)
            setStartList(currentLocationList)
            dispatch(updateDataProsCusLocTable(dataListLoc));
            setStartSelect('');
        }

        if (!stopSelect) return
        if (stopSelect.locId) {
            let dataListLoc = visitPlanList.filter((item) => {
                return item.locId != stopSelect.locId
            }); 

            stopSelect.locNameTh = stopSelect.accName || stopSelect.locNameTh

            setVisitPlanList(currentLocationList)
            let findData = currentLocationList.find((cur) => cur.locId == stopSelect.locId)
            if (!findData) {
                setLocationList([...currentLocationList, stopSelect]);
                setStopList([...currentLocationList, stopSelect])
                setStartList([...currentLocationList, stopSelect])
            } else {
                setLocationList([...currentLocationList]);
                setStopList([...currentLocationList])
                setStartList([...currentLocationList])
            }
            
            dispatch(updateDataProsCusLocTable(dataListLoc));
            setStopSelect('');
        }
    };

    // Use for save and send data to create plan //
    const handleSavePlanTrip = async (type) => {
        await handleNotRequireText()
        let totalValue = getInputData(inputRef);

        let status = '';
        if (groupPermission  == "SUPEPVISOR" || groupPermission  == "MANAGER") {
            status = '3';
        } else {
            if (type == "save") {
                status = '1';
            } else {
                status = '2';
            };
        }

        if (!totalValue.isInvalid && status) {

            let listProspect = [];
            if (saleVisitPlanReducer.updateValueList.length != 0) {

                let visitPlanList = saleVisitPlanReducer.updateValueList;

                let addOrder = visitPlanList.map((item, index) => {
                    return {...item, orderNo: index + 1}
                });

                let visitPlanListNew = addOrder;

                listProspect = visitPlanListNew.map((item) => {
                    
                    let listTaskUpdate = [];
                    if (item && item.prospectId || item && item.prospId) {
                        listTaskUpdate = [];
                        if (item.listTask !=  null) {
                            let itemList = item.listTask;
    
                            listTaskUpdate = itemList.map((item) => {
                                return {
                                    planTripTaskId: item.planTripTaskId ? `${item.planTripTaskId}` : null,
                                    planTripProspId: item.planTripProspId ? `${item.planTripProspId}` : null,
                                    taskType: `${item.taskType}`,
                                    tpStockCardId: item.tpStockCardId,
                                    tpSaFormId: item.tpSaFormId,
                                    tpAppFormId: item.tpAppFormId,
                                    requireFlag: `${item.requireFlag}`,
                                    orderNo: `${item.orderNo}`, 
                                    templateName: `${item.description}`,
                                };
                            });
                        };
                    };
                   
                    let listTask = listTaskUpdate && listTaskUpdate.length != 0 ? listTaskUpdate : [];
                    let startTimeSet = item.startTime || startTime
                    let endTimeSet = item.endTime || endTime
                    return {
                        planTripProspId: item.planTripProspId ? `${item.planTripProspId}` : null,
                        planTripId: item.planTripId ? `${item.planTripId}` : null,
                        listTask: listTask,
                        prospId: item.prospectId ? `${item.prospectId}` : item.prospId ? `${item.prospId}` : null,
                        planStartTime: item.planStartTime ? `${item.planStartTime}` : startTimeSet ? `${dayjs(selectDate || dataPlanTrip.planTripDate).format('YYYY-MM-DD')}T${startTimeSet}` : null,
                        planEndTime: item.planEndTime ? `${item.planEndTime}` : endTimeSet ? `${dayjs(selectDate || dataPlanTrip.planTripDate).format('YYYY-MM-DD')}T${endTimeSet}` : null,
                        orderNo: `${item.orderNo}`,
                        remind: item.remark ? `${item.remark}` : null,
                        locId: item.locId ? `${item.locId}` : null,
                        locRemark: item.locRemark ? `${item.locRemark}` : null,
                        accName: item.accName ? `${item.accName}` : null,
                    }
                });

            };

            let find = listProspect.filter((itemOnlyPros) => {
                if (itemOnlyPros.prospId != null) {
                    return true
                }
            })

            let findOut = find.find((itemList) => {
                if (itemList.listTask.length == 0) {
                    return true
                }
            })

            if (findOut != undefined) {
                let dataCheckOnePros = listProspect.filter((itemLength) => {
                    return itemLength.prospId && itemLength.listTask.length == 0
                })

                let dataName = dataCheckOnePros.map((itemListName) => {
                    return ` - ${itemListName.accName}`
                })
                let concatName = dataName.toString();
                let namedataList = concatName.replace(/,/g, '\n');
                let messageNew = `${language.TASKCREATEPLAN} \n${namedataList}`

                setModalChectListTable(true)
                setDetailTextModal(messageNew)

            } else {
                if (formScreenView) {
                    dispatch(updPlanTrip(totalValue.data, listProspect, status, dataPlanTrip));
                    setModalSendSave(true)

                } else {
                    dispatch(createPlanTrip(totalValue.data, listProspect, status));
                    setModalSendSave(true)
                }
            }
        };
    };

    const handleModalSendSave = (event) => {
        if (formScreenView) {
            setModalSendSave(event)
            navigation.navigate('SaleVisitPlanScreen');
        } else {
            setModalSendSave(event)
            navigation.navigate('SaleVisitPlanScreen');
        }
    }

    const handlePermission = () => {
        if (groupPermission == "SUPEPVISOR") return true
        if (groupPermission == "MANAGER") return true

        return false
    };

    const handleNavScreen = (item,permObjCode) => {  

        let premissionScreen = listPermission.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        if (premissionScreen) return handleEditTask(item);
        if (!premissionScreen) return navigation.navigate('DontHavePermission');
    };

    return(
        <View style={{flex:1, backgroundColor: colors.white}}>
            <Header/>
            <ScrollView>
                <View style={{marginBottom:'10%'}}>
                    <View style = {{flex: 1, marginHorizontal:'5%', marginBottom: '5%', marginTop: '5%'}}>
                        <View style={{flex: 1, marginBottom: '5%'}}>
                            <TextInput 
                                title={'Plan Trip Name'}
                                ref={el => inputRef.current.planTripName = el}
                                require
                                REQUIRETITLE
                                massageError={language.PLANTRIPNAME}
                                value={dataPlanTrip ? dataPlanTrip.planTripName : ''}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <PickerDate 
                                DateBoxWidth={'80%'} 
                                title={"วันที่เข้าเยี่ยม"}
                                require
                                TITLE={true} 
                                dateValue={selectDate ? selectDate : dataPlanTrip.planTripDate ? dataPlanTrip.planTripDate : ''} 
                                ref={el => inputRef.current.selectDate = el}
                                markDate={selectDate ? selectDate : ''}
                                onChange={(date)=> selectDatePlan(date)}
                                REQUIRETITLE
                                massageError={language.DATESALECREATEPLAN}
                                minDate={new Date()}
                            />
                        </View>
                    </View>
                    
                    <View style={{ flexDirection: 'row', marginLeft: '5%', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <RadioButton
                                value={prospectType}
                                status={ prospectType === 'P' ? 'checked' : 'unchecked' }
                                onPress={() => onPressDropdown('P')} 
                            />  
                            <TouchableOpacity onPress={() => onPressDropdown('P')} >
                                <Text>
                                    Prospect / Customer
                                </Text> 
                            </TouchableOpacity>   
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                            <RadioButton
                                value={prospectType}
                                status={ prospectType === 'C' ? 'checked' : 'unchecked' }
                                onPress={() => onPressDropdown('C')} 
                            /> 
                            <TouchableOpacity onPress={() => onPressDropdown('C')} >
                                <Text>
                                    Location
                                </Text> 
                            </TouchableOpacity>       
                        </View>
                    </View>

                    <View style = {{marginHorizontal:'5%', marginBottom: '10%'}}>
                        <View style={{width:'100%'}}>
                            {
                                prospectType === 'P' && <SelectDropdown
                                    titleDropdown={'Prospect / Customer'}
                                    titleAlert={'Prospect / Customer'} 
                                    dataList={prospectList}
                                    // titleKey={"accName"}
                                    titleKey={"codeNameLabel"}
                                    valueKey={"prospectId"}
                                    ref={el => inputRef.current.prospAccId = el}
                                    require = {requireAddPros}
                                    REQUIRETITLE
                                    massageError={language.SELECTPROSCREATPLAN}
                                />
                            }
                            {
                                prospectType === 'C' && <SelectDropdown
                                    titleDropdown={'Location'}
                                    titleAlert={'Location'} 
                                    dataList={locationList}
                                    titleKey={"locNameTh"}
                                    valueKey={"locId"}
                                    ref={el => inputRef.current.locId = el}
                                    require = {requireAddLoc}
                                    REQUIRETITLE
                                    massageError={language.SELECTLOCCREATPLAN}
                                />
                            }
                        </View>
                        <View style={{marginTop: '10%', alignItems: 'center'}}>
                            <Button
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                    title={'Add'}
                                    typeIcon={'Ionicons'} 
                                    nameIcon={'add-outline'}
                                    onPress={() => handleAddProsCus()}
                                    width={'40%'}
                            />
                        </View>
                    </View>

                    {/* {MapArea} */}
                    <View>
                        <Map markerList={prospectType === 'P' ? prospectList : locationList} onSelect={(marker) => onPressAddMarker(marker)} />
                    </View>

                    <View style={{marginHorizontal:'5%', marginTop:'5%'}}>
                        <View style={{flex: 1}}>
                            <SelectDropdown
                                startStop
                                TITLE={false}
                                titleDropdown={'Start'}
                                titleAlert={'Start'} 
                                dataList={startList}
                                titleKey={"locNameTh"}
                                valueKey={"locId"}
                                placeholder='ระบุสถานที่'
                                ref={el => inputRef.current.locIdStart = el}
                                onPress={(item) => handleStart(item)}
                                defaultValue={startSelect ? startSelect : ''}
                            />
                        </View>     
                        <View style={{flex: 1, marginVertical: '2%'}}>
                            <SelectDropdown
                                startStop
                                TITLE={false}
                                titleDropdown={'Stop'}
                                titleAlert={'Stop'} 
                                dataList={stopList}
                                titleKey={"locNameTh"}
                                valueKey={"locId"}
                                placeholder='ระบุสถานที่'
                                ref={el => inputRef.current.locIdStop = el}
                                onPress={(item) => handleStop(item)}
                                defaultValue={stopSelect ? stopSelect : ''}
                            />
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', marginVertical: '2%'}}>
                            <View style={{flex: 1, alignItems: 'center', marginEnd: '2%'}}>
                                <Button
                                    onPress={() => handleClear()}
                                    title={'Clear'}
                                    typeIcon={'Ionicons'}
                                    nameIcon={'trash-outline'}
                                    color={colors.grayButton}
                                    colorBorder={colors.grayButton}
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                    IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                                />
                            </View>
                            <View style={{flex: 1, alignItems: 'center', marginStart: '2%'}}>
                                <Button
                                    title={'Best Route'}
                                    // width={'95%'} 
                                    onPress={() => onPressBestRounte()}
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{paddingVertical:'5%'}}>
                        <Table 
                            dragable 
                            onDragend={(item) => setVisitPlanList(item)} 
                            columns={columnsHeader} 
                            editable 
                            // Time 
                            // editableTime
                            data={visitPlanList} 
                            // onPressEdit={(item) => handleEditTask(item)}
                            onPressEdit={(item) => handleNavScreen(item,formScreenView == true? 'FE_PLAN_TRIP_S014' : 'FE_PLAN_TRIP_S012')}
                            // onPressRemove = {(item) => handleRemoveTask(item)}
                            onPressRemove = {(item) => handleModalDelete(true , item)}
                            nopage = {true}
                        />
                    </View>

                    <View style={{width:'90%',marginHorizontal:'5%'}}>
                        <TextInput
                            title={'หมายเหตุ'}
                            ref={el => inputRef.current.remark = el}
                            value={dataPlanTrip ? dataPlanTrip.remark : ''}
                            maxLength={150}
                            heightBox = {STYLE_SIZE.BNT_HEIGTH*3}
                            multiline = {true}
                            isOnlyText = {true}
                        />
                    </View>

                    <View style={{borderBottomWidth:0.5, borderColor: colors.gray, marginTop:'10%', marginBottom:'5%'}}/>

                    {
                        handlePermission() ?
                        <View style={{alignSelf:'center',flexDirection:'row'}}>
                            <View>
                                <Button 
                                    title={'Send'}
                                    width={'40%'}
                                    onPress={() => handleSavePlanTrip("send")}
                                />
                            </View>
                        </View>
                        :
                        dateToDate == dateToDatePicker ?
                        <View style={{alignSelf:'center',flexDirection:'row'}}>
                            <View>
                                <Button 
                                    title={'Send'}
                                    width={'40%'}
                                    onPress={() => handleSavePlanTrip("send")}
                                />
                            </View>
                        </View>
                        :
                        <View style={{alignSelf:'center',flexDirection:'row'}}>
                            <View style={{paddingRight:10}}>
                                <Button 
                                    title={'Save'}
                                    width={'40%'}
                                    onPress={() => handleSavePlanTrip("save")}
                                />
                            </View>
                            <View>
                                <Button 
                                    title={'Send'}
                                    width={'40%'}
                                    onPress={() => handleSavePlanTrip("send")}
                                />
                            </View>
                        </View>
                    }
                    
                    {/* modal send / save */}
                    <ModalWarning
                        visible = {modalSendSave}
                        onlyCloseButton = {true}
                        onPressClose = {() => handleModalSendSave(false)}
                        detailText = {language.CONFIRNSUCCESS}
                    />
                    {/* modal alert when no prosCust / task */}
                    <ModalWarning
                        visible = {modalChectListTable}
                        onlyCloseButton = {true}
                        onPressClose = {() => setModalChectListTable(false)}
                        detailText = {detailTextModal}
                    />
                    {/* modal Delete */}
                    <ModalWarning
                        visible = {modalDelete}
                        onPressCancel = {() => setModalDelete(false)}
                        onPressConfirm = {() => handleModalDeleteSuccess(true)}
                        detailText = {language.DELETE}
                    />
                    <ModalWarning
                        visible = {modalDeleteSuccess}
                        onlyCloseButton = {true}
                        onPressClose = {() => setModalDeleteSuccess(false)}
                        detailText = {language.DELETESUCCESS}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default CreatePlanForMe;
import React, {useEffect, useState, useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';

import { Text, TimePicker, TextInput, Table, Button, Header, SelectDropdown, ModalWarning } from '../../components'
import { ALEART_WARNING_WORD, STYLE_SIZE } from '../../utility/enum';
import colors from '../../utility/colors';
import language from '../../../src/language/th.json'
import { RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskTemplateCreatPlan, getTaskSpecialCreatPlan, updateDataProsCusLocTable, getLastRemindPlanTripProspect } from '../../actions/SaleVisitPlanAction';
import { getInputData } from '../../utility/helper';

const EditTemplateProsCusForOther = (props) => {

    const {saleVisitPlanReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const navigation = useNavigation();
    const [dataProsCusLoc, setDataProsCusLoc] = useState(props.route.params.prosCusLoc);
    const [templateList, setTemplateList] = useState([]);
    const [specialTaskList, setSpecialTaskList] = useState([]);
    const [redioSelectType, setRedioSelectType] = useState('S');
    const [taskVisitPlanList, setTaskVisitPlanList] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeStart, settimeStart] = useState('');
    const [timeEnd, settimeEnd] = useState('');
    const [modalAddTask, setModalAddTask] = useState(false);
    const [modalTimeWrong, setModalTimeWrong] = useState(false);
    const [selectSpecialTask, setSelectSpecialTask] = useState('');
    const [selectTask, setSelectTask] = useState('');
    const [selectSpecialTaskList, setSelectSpecialTaskList] = useState([]);
    const [selectTaskList, setSelectTaskList] = useState([])
    const [modalDelete, setModalDelete] = useState(false);
    const [modalDeleteSuccess, setModalDeleteSuccess] = useState(false);
    const [removeItem, setRemoveItem] = useState('');

    useEffect(() => {
            dispatch(getTaskTemplateCreatPlan());
            dispatch(getTaskSpecialCreatPlan(dataProsCusLoc.prospId));
            dispatch(getLastRemindPlanTripProspect(dataProsCusLoc.prospId));

    },[]);

    useEffect(() => {
        if (dataProsCusLoc) {
            settimeStart(dataProsCusLoc.startTime)
            settimeEnd(dataProsCusLoc.endTime)
        }
    
        if (dataProsCusLoc.listTask != undefined) {
            let lisaTaskAll = [...saleVisitPlanReducer.taskSpecialCreateplan, ...saleVisitPlanReducer.taskTemplatCreateplan];

            let dataNewTaskVisitPlanList = dataProsCusLoc.listTask.map((itemListAll) => {
                if (!lisaTaskAll) return
                if (lisaTaskAll) {
                    let data = lisaTaskAll.filter((item) => {
                        return item.code == itemListAll.code && item.taskType == itemListAll.taskType
                    })
                    let updateData = data[0] && data[0].lastUpdateNew;

                    if (updateData == undefined) return {...itemListAll, lastUpdateNew: ""}
                    return {...itemListAll, lastUpdateNew: updateData == undefined ? "" : updateData ? data[0].lastUpdateNew : ""}
                }
            })
            setTaskVisitPlanList(dataNewTaskVisitPlanList);
        }

    },[dataProsCusLoc.listTask]);

    useEffect(() => {
        if (saleVisitPlanReducer.taskSpecialCreateplan) {
            
            let dataNewSpecial = []
            if (dataProsCusLoc.custCode == "") {
                let onlySaTemplate = saleVisitPlanReducer.taskSpecialCreateplan.filter((itemListSpecial) => {
                    return itemListSpecial.taskType == "T"
                })
                dataNewSpecial = onlySaTemplate
    
            } else {
                dataNewSpecial = saleVisitPlanReducer.taskSpecialCreateplan
    
            }

            if (dataProsCusLoc.listTask) {
                let filterTaskSpecailOut = dataNewSpecial.filter((listTaskSpecialNew) => {
                    let taskSpecialKey = listTaskSpecialNew.code
    
                    let findDrupItem = dataProsCusLoc.listTask.find((listAPi) => {
                        return listAPi.code == taskSpecialKey && listAPi.taskType == listTaskSpecialNew.taskType
                    })
    
                    return !findDrupItem
                })
                setSpecialTaskList(filterTaskSpecailOut)
                
                let filterTaskOut = saleVisitPlanReducer.taskTemplatCreateplan.filter((listTaskNew) => {
                    let taskKey = listTaskNew.code
    
                    let findDrupItem = dataProsCusLoc.listTask.find((listAPi) => {
                        return listAPi.code == taskKey && listAPi.taskType == listTaskNew.taskType
                    })
    
                    return !findDrupItem
                })
    
                setTemplateList(filterTaskOut)
            } else {
                setSpecialTaskList(dataNewSpecial)  
                setTemplateList(saleVisitPlanReducer.taskTemplatCreateplan)
            }
        }

        setTemplateList(saleVisitPlanReducer.taskTemplatCreateplan);

    },[saleVisitPlanReducer.taskTemplatCreateplan, saleVisitPlanReducer.taskSpecialCreateplan]);

    const [columnsHeader, setColumnsHeader] = useState([
        { key: 'description', title: 'Template Name' },
        { key: 'lastUpdateNew', title: 'Latest update' , isColumnCenter: true},
    ]);

    const handleAddTaskNew = (value) => {
        if (value.taskType === 'A') {
            let selectList = templateList.find((item) => {
                return item.code == value.code
            });    
    
            let eventList = templateList.filter((item)=>{
                return item.code != value.code 
            });

            setSelectTask(selectList)
            setSelectTaskList(eventList)
            setSelectSpecialTaskList(specialTaskList)
        }
    
        if (value.taskType === 'M') {
            let selectListSpecial = specialTaskList.find((item) => {
                return item.code == value.code 
            }); 
            
            let eventListSpecial = specialTaskList.filter((item)=>{
                return item.code != value.code
            });

            setSelectTaskList(templateList)
            setSelectSpecialTask(selectListSpecial)
            setSelectSpecialTaskList(eventListSpecial)
        }

        if (value.taskType === 'S') {
            let selectListSpecial = specialTaskList.find((item) => {
                return item.code == value.code 
            }); 
            
            let eventListSpecial = specialTaskList.filter((item)=>{
                return item.code != value.code
            });

            setSelectTaskList(templateList)
            setSelectSpecialTask(selectListSpecial)
            setSelectSpecialTaskList(eventListSpecial)
        }

        if (value.taskType === 'T') {
            let selectListSpecial = specialTaskList.find((item) => {
                return item.code == value.code 
            }); 
            
            let eventListSpecial = specialTaskList.filter((item)=>{
                return item.code != value.code
            });

            setSelectTaskList(templateList)
            setSelectSpecialTask(selectListSpecial)
            setSelectSpecialTaskList(eventListSpecial)
        }
    }

    const handleTableAdd = () => {
        if (!selectSpecialTask && !selectTask) return
        let data = ([...taskVisitPlanList, selectTask || selectSpecialTask]);
        let dataNewList = data.map((item) => {
            if (item.taskType == 'S') return {...item, requireFlag: 'Y'}
            if (item.taskType == 'T') return {...item, requireFlag: 'Y'}
            if (item.taskType == 'M') return {...item, requireFlag: 'Y'}
            if (item.taskType == 'A') return {...item, requireFlag: 'N'}
        })

        setTaskVisitPlanList(dataNewList);

        if (selectTaskList) setTemplateList(selectTaskList);
        if (selectSpecialTaskList) setSpecialTaskList(selectSpecialTaskList);

        setSelectSpecialTask('')
        setSelectSpecialTaskList([])
        setSelectTask('')
        setSelectTaskList([])
    }

    const handleModalDelete = (event, removeItem) => {
        setModalDelete(event)
        setRemoveItem(removeItem)
    }

    const handleModalDeleteSuccess = (event) => {
        setModalDeleteSuccess(event)
        setModalDelete(false)
        handleRemoveTask()
    }

    // const handleRemoveTask = (item) => {
    const handleRemoveTask = () => {
        let itemDelete = removeItem;
        
        let delectList = taskVisitPlanList.filter((item) => {
            return item.taskType != itemDelete.taskType || item.code != itemDelete.code
        }); 

        let dataLisTaskSpecial = taskVisitPlanList.find((item)=>{
            return item.code == itemDelete.code && item.taskType == itemDelete.taskType 
        });

        let dataLisTask = taskVisitPlanList.find((item)=>{
            return item.code == itemDelete.code && item.taskType == itemDelete.taskType 
        });

        setTaskVisitPlanList(delectList);
        if(itemDelete.taskType === 'M') setSpecialTaskList([...specialTaskList, dataLisTaskSpecial]);
        if(itemDelete.taskType === 'S') setSpecialTaskList([...specialTaskList, dataLisTaskSpecial]);
        if(itemDelete.taskType === 'T') setSpecialTaskList([...specialTaskList, dataLisTaskSpecial]);
        if(itemDelete.taskType === 'A') setTemplateList([...templateList, dataLisTask]);

    };

    const handleSelectRequire = (item, event) => {
        let itemSelect = item;
  
        let dataRequire = taskVisitPlanList.map((dataTask) => {
            if (dataTask.code == itemSelect.code) {
                if (event == true) {
                    return ({...dataTask, requireFlag: 'Y'}) 
                }
                if (event == false) {
                    return ({...dataTask, requireFlag: 'N'}) 
                }
            } else {
                return dataTask
            }
        })
        setTaskVisitPlanList(dataRequire)
    };

    const onPressDropdown = (type) => {
        setRedioSelectType(type)
    };

    const onChangeTimeStart = (date) => {
        setStartTime(dayjs(date).format('HH:mm:ss'))
        settimeStart(dayjs(date).format('HH:mm:ss'))
    };

    const onChangeTimeEnd = (date) => {
        setEndTime(dayjs(date).format('HH:mm:ss'))
        settimeEnd(dayjs(date).format('HH:mm:ss'))
    };

    const handleSaveTask = (item) => {

        let totalValue = getInputData(inputRef);
        let newDataAdd = '';

        if (taskVisitPlanList && taskVisitPlanList.length != 0) {

            let addOrderTask = taskVisitPlanList.map((item, index) => {
                return {...item, orderNo: index + 1}
            });

            let listTask = addOrderTask.map((item) => {
                if (item.taskType == 'S') return {
                    taskType: item.taskType,
                    tpStockCardId: item.code,
                    tpSaFormId: null,
                    tpAppFormId: null,
                    requireFlag: item.requireFlag,
                    orderNo: item.orderNo, 
                    templateName: item.description,
                    code: item.code,
                    description: item.description,
                } 
                else if (item.taskType == 'T') return {
                    taskType: item.taskType,
                    tpStockCardId: null,
                    tpSaFormId: item.code,
                    tpAppFormId: null,
                    requireFlag: item.requireFlag,
                    orderNo: item.orderNo, 
                    templateName: item.description,
                    code: item.code,
                    description: item.description,
                } 
                else if (item.taskType == 'A') return {
                    taskType: item.taskType,
                    tpStockCardId: null,
                    tpSaFormId: null,
                    tpAppFormId: item.code,
                    requireFlag: item.requireFlag,
                    orderNo: item.orderNo, 
                    templateName: item.description,
                    code: item.code,
                    description: item.description,
                } 
                else if (item.taskType == 'M') return {
                    taskType: item.taskType,
                    tpStockCardId: null,
                    tpSaFormId: null,
                    tpAppFormId: null,
                    requireFlag: item.requireFlag,
                    orderNo: item.orderNo, 
                    templateName: item.description,
                    code: item.code,
                    description: item.description,
                } 
            });

            let newTaskAdd = {...dataProsCusLoc, listTask, startTime, endTime, timeStart, timeEnd};
    
            setDataProsCusLoc(newTaskAdd);

            newDataAdd = saleVisitPlanReducer.updateValueList.map((item) => {
                if (item.prospAccId == newTaskAdd.prospAccId && item.prospId == newTaskAdd.prospId) {

                    let timeFormatStart = newTaskAdd.timeStart
                    if (newTaskAdd.timeStart) {
                        let startSplit = newTaskAdd.timeStart.split(":");
                        timeFormatStart = `${startSplit[0]}:${startSplit[1]}`
                    }

                    let timeFormatStop = newTaskAdd.timeEnd
                    if (newTaskAdd.timeEnd) {
                        let stopSplit = newTaskAdd.timeEnd.split(":");
                        timeFormatStop = `${stopSplit[0]}:${stopSplit[1]}`
                    }

                    return {...item, 
                        listTask: newTaskAdd.listTask, 
                        startTime: newTaskAdd.startTime ? newTaskAdd.startTime : item.startTime ? item.startTime : "", 
                        endTime: newTaskAdd.endTime ? newTaskAdd.endTime : item.endTime ? item.endTime : "", 
                        timer: newTaskAdd.timeStart && newTaskAdd.timeEnd ? `${timeFormatStart} - ${timeFormatStop}`
                            : newTaskAdd.timeStart && !newTaskAdd.timeEnd ? `${timeFormatStart} -` 
                            : !newTaskAdd.timeStart && newTaskAdd.timeEnd ? `- ${timeFormatStop}` 
                            : "-"
                    }
                };

                return item
            });
        };

        if (dataProsCusLoc && dataProsCusLoc.locId) {
         
            let newTaskAdd = {...dataProsCusLoc, startTime, endTime, timeStart, timeEnd};
            let locRemark = totalValue.data.locRemark;

            newDataAdd = saleVisitPlanReducer.updateValueList.map((item) => {
                if (item.locId == newTaskAdd.locId) {

                    let timeFormatStart = newTaskAdd.timeStart
                    if (newTaskAdd.timeStart) {
                        let startSplit = newTaskAdd.timeStart.split(":");
                        timeFormatStart = `${startSplit[0]}:${startSplit[1]}`
                    }

                    let timeFormatStop = newTaskAdd.timeEnd
                    if (newTaskAdd.timeEnd) {
                        let stopSplit = newTaskAdd.timeEnd.split(":");
                        timeFormatStop = `${stopSplit[0]}:${stopSplit[1]}`
                    }

                    return {...item, 
                        locRemark : locRemark, 
                        startTime: newTaskAdd.startTime ? newTaskAdd.startTime : item.startTime ? item.startTime : "", 
                        endTime: newTaskAdd.endTime ? newTaskAdd.endTime : item.endTime ? item.endTime : "", 
                        timer: newTaskAdd.timeStart && newTaskAdd.timeEnd ? `${timeFormatStart} - ${timeFormatStop}` 
                            : newTaskAdd.timeStart && !newTaskAdd.timeEnd ? `${timeFormatStart} -` 
                            : !newTaskAdd.timeStart && newTaskAdd.timeEnd ? `- ${timeFormatStop}` 
                            : "-"
                    }
                };
    
                return item
            });
        };

        if (timeStart && timeEnd && timeStart > timeEnd) {
            setModalTimeWrong(true)
        } else {
            if (newDataAdd.length == 0) {
                setModalAddTask(true)
            } else {
                dispatch(updateDataProsCusLocTable(newDataAdd));
                navigation.navigate('CreatePlanForOtherScreen');
            }
        }        
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.white, padding: '5%', paddingTop:'5%'}}>
            <Header />
            {
                dataProsCusLoc && dataProsCusLoc.prospectId ? 
                <View>
                    <View style={[styles.SearchArea,styles.styleShadow]}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text>Prospect Name /Customer Name :</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>         
                                <View style={{marginEnd: 20}}>
                                    <Text>Time :</Text>                        
                                </View>              
                                <TimePicker onChange={(item) => onChangeTimeStart(item)} defaultValue={dataProsCusLoc.startTime}/>                                     
                                <TimePicker onChange={(item) => onChangeTimeEnd(item)} defaultValue={dataProsCusLoc.endTime}/>                          
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{borderBottomColor: colors.gray, borderBottomWidth: 1, marginStart: 15}}>
                                    <Text numberOfLines={1}>{dataProsCusLoc.accName ? dataProsCusLoc.accName : '-'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: '2%', flexDirection: 'row'}}>
                            <Text style={{color: colors.redRemind}}>Remind :</Text>
                            <View style={{marginStart: 15}}>
                                <Text style={{color: colors.redRemind}}>{saleVisitPlanReducer.lastRemindForPlanTripProspect.length != 0 ? saleVisitPlanReducer.lastRemindForPlanTripProspect[0].remind : '-'}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '5%', marginTop: '2%', marginLeft: '-2%'}}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value={redioSelectType}
                                    status={ redioSelectType === 'S' ? 'checked' : 'unchecked' }
                                    onPress={() => onPressDropdown('S')} 
                                /> 
                                <TouchableOpacity onPress={() => onPressDropdown('S')} >
                                    <Text>
                                        Special Task
                                    </Text> 
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                                <RadioButton
                                    value={redioSelectType}
                                    status={ redioSelectType === 'T' ? 'checked' : 'unchecked' }
                                    onPress={() => onPressDropdown('T')} 
                                />  
                                <TouchableOpacity onPress={() => onPressDropdown('T')} >
                                    <Text>
                                        Template
                                    </Text> 
                                </TouchableOpacity>        
                            </View>
                        </View>
                        <View style = {{flexDirection:'row', marginBottom: '5%'}}>
                        <View style={{width:'70%', paddingRight:'3%'}}>
                                {
                                    redioSelectType === 'T' && <SelectDropdown
                                        titleDropdown={'Template'}
                                        titleAlert={'Template'}
                                        dataList={templateList}
                                        titleKey={"description"}
                                        valueKey={"code"}
                                        ref={el => inputRef.current.codeTemplate = el}
                                        NotFillter={true}
                                        REQUIRETITLE
                                        onPress={(item)=> handleAddTaskNew(item)}
                                    />
                                }
                                {
                                    redioSelectType === 'S' && <SelectDropdown
                                        titleDropdown={'Special Task'}
                                        titleAlert={'Special Task'} 
                                        dataList={specialTaskList}
                                        titleKey={"description"}
                                        valueKey={"code"}
                                        ref={el => inputRef.current.codeSpecial = el}
                                        NotFillter={true}
                                        REQUIRETITLE
                                        onPress={(item)=> handleAddTaskNew(item)}
                                    />
                                }
                            </View>
                            <View style={{justifyContent: 'flex-end'}}>
                            <Button
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                    title={'Add'}
                                    typeIcon={'Ionicons'} 
                                    nameIcon={'add-outline'}
                                    onPress={() => handleTableAdd()}
                                    IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                            />
                            </View>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{flex:1}}>
                            <Table 
                                data={taskVisitPlanList} 
                                columns={columnsHeader}
                                select={true}
                                removetable={true}
                                spaceHorizontal={5}
                                nopage = {true}
                                // selected = {selected}
                                // onPressRemove = {(item) => handleRemoveTask(item)}
                                onPressRemove = {(item) => handleModalDelete(true , item)}
                                onPressSelect = {(item, e) => handleSelectRequire(item, e)}
                            />
                            <View style={{alignSelf:'center',flexDirection:'row'}}>
                                <View style={{marginTop:30}}>
                                    <Button 
                                        title={'Save'}
                                        width={200}
                                        onPress={(item) => handleSaveTask(item)}
                                    />
                                </View>
                            </View>
                        </View> 
                    </ScrollView>
                </View>
                :
                <View>
                    <View style={[styles.SearchArea,styles.styleShadow]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text>Location Name :</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{borderBottomColor: colors.gray, borderBottomWidth: 1, marginStart: '5%'}}>
                                    <Text numberOfLines={1}>{dataProsCusLoc.locNameTh ? dataProsCusLoc.locNameTh : '-'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>         
                                <View style={{marginEnd: '3%'}}>
                                    <Text>Time :</Text>                        
                                </View>              
                                <TimePicker onChange={(item) => onChangeTimeStart(item)} defaultValue={dataProsCusLoc.startTime}/>                                     
                                <TimePicker onChange={(item) => onChangeTimeEnd(item)} defaultValue={dataProsCusLoc.endTime}/>                          
                            </View>
                        </View>
                        <View style={{marginTop: '2%', flexDirection: 'row'}}>
                            <View style={{width: '100%', height: '50%'}}>
                                <TextInput
                                    title={'หมายเหตุ'}
                                    ref={el => inputRef.current.locRemark = el}
                                    value={dataProsCusLoc.locRemark ? dataProsCusLoc.locRemark : ''}
                                    maxLength={150}
                                    heightBox = {STYLE_SIZE.BNT_HEIGTH*3}
                                    multiline = {true}
                                    isOnlyText = {true}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <View style={{alignSelf:'center',flexDirection:'row'}}>
                            <View style={{marginTop:'10%'}}>
                                <Button 
                                    title={'Save'}
                                    width={200}
                                    onPress={(item) => handleSaveTask(item)}
                                />
                            </View>
                        </View>
                    </View> 
                </View>
            }
            <ModalWarning
                visible = {modalAddTask}
                onPressClose = {() => setModalAddTask(false)}
                detailText = {language.NONTASK}
                onlyCloseButton
            />
             <ModalWarning
                visible = {modalTimeWrong}
                onPressClose = {() => setModalTimeWrong(false)}
                detailText = {language.TIMEWORNG}
                onlyCloseButton
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
    )
};

const styles = StyleSheet.create({
    SearchArea : {
        borderRadius: 20, 
        backgroundColor: colors.grayMaster, 
        padding: '3%', 
        marginBottom: '5%'
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
})

export default EditTemplateProsCusForOther;
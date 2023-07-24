import React, {useEffect, useState} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useSelector} from 'react-redux';

import { Text, TimePicker, TextInput, Table, Button, Header } from '../../components'
import colors from '../../utility/colors';

const EditableViewVisitPlan = (props) =>{

    const navigation = useNavigation();
    const {saleVisitPlanReducer} = useSelector((state) => state);
    const [dataDirectScreen, setDataDirectScreen] = useState(props.route.params.dataProsSelect);
    const [listTaskInTable, setListTaskInTable] = useState([]);

    useEffect(() => {
        let dataIsMatch = saleVisitPlanReducer.updateValueList.find((itemList) => {
            if (dataDirectScreen.prospId != null) return itemList.prospId == dataDirectScreen.prospId
            return itemList.locId == dataDirectScreen.locId
        })

        setListTaskInTable(dataIsMatch)
    })

    const [columnsHeader, setColumnsHeader] = useState([
        { key: 'description', title: 'Template Name' },
        { key: 'lastUpdateNew', title: 'Latest update', isColumnCenter: true },
    ]);

    return(
        <View style={{flex: 1, backgroundColor: colors.white, padding: 20, paddingTop:'5%'}}>
            <Header />
            {
                listTaskInTable && listTaskInTable.prospId ? 
                <View>
                    <View style={[styles.SearchArea,styles.styleShadow]}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: '5%'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text>Prospect Name /Customer Name :</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: '5%'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{borderBottomColor: colors.gray, borderBottomWidth: 1}}>
                                    <Text numberOfLines={1}>{listTaskInTable.accName ? listTaskInTable.accName : '-'}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5%'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>         
                                <View style={{marginEnd: '3%'}}>
                                    <Text>Time :</Text>                        
                                </View>              
                                <TimePicker defaultValue={listTaskInTable.startTime} disabled/>                                     
                                <TimePicker defaultValue={listTaskInTable.endTime} disabled/>                        
                            </View>
                        </View>
                        <View style={{marginTop: '2%', flexDirection: 'row', marginBottom: '5%'}}>
                            <Text>Remind :</Text>
                            <View style={{marginStart: 15}}>
                                <Text>{saleVisitPlanReducer.lastRemindForPlanTripProspect.length != 0 ? saleVisitPlanReducer.lastRemindForPlanTripProspect[0].remind : '-'}</Text>
                            </View>
                        </View>
                        
                    </View>
                    <ScrollView>
                        <View style={{flex:1}}>
                            <Table 
                                data={listTaskInTable.listTask} 
                                columns={columnsHeader}
                                select={true}
                                spaceHorizontal={5}
                                nopage = {true}
                                viewSelectCheckbox
                            />
                            <View style={{alignSelf:'center',flexDirection:'row'}}>
                                <View style={{marginTop:30}}>
                                    <Button 
                                        title={'Close'}
                                        width={200}
                                        onPress={() => navigation.navigate('ViewVisitPlanScreen')}
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
                                <View style={{borderBottomColor: colors.gray, borderBottomWidth: 1, marginStart: 15}}>
                                    <Text numberOfLines={1}>{listTaskInTable.locNameTh ? listTaskInTable.locNameTh : listTaskInTable.accName}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>         
                                <View style={{marginEnd: 20}}>
                                    <Text>เวลา :</Text>                        
                                </View>              
                                <TimePicker defaultValue={listTaskInTable.startTime} disabled/>                                     
                                <TimePicker defaultValue={listTaskInTable.endTime} disabled/>                        
                            </View>
                        </View>
                        <View style={{marginTop: '2%', flexDirection: 'row'}}>
                            <View style={{width: '100%', height: '50%'}}>
                                <TextInput
                                    title={'หมายเหตุ'}
                                    // ref={el => inputRef.current.locRemark = el}
                                    value={listTaskInTable.locRemark ? listTaskInTable.locRemark : ''}
                                    maxLength={150}
                                    heightBox = {90}
                                    multiline = {true}
                                    isOnlyText = {true}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <View style={{alignSelf:'center',flexDirection:'row'}}>
                            <View style={{marginTop:30}}>
                                <Button 
                                    title={'Close'}
                                    width={200}
                                    onPress={() => navigation.navigate('ViewVisitPlanScreen')}
                                />
                            </View>
                        </View>
                    </View> 
                </View>
            }
            {/* <ModalWarning
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
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    SearchArea : {
        borderRadius: 20, 
        backgroundColor: colors.grayMaster, 
        padding: 20, 
        marginBottom: 30
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

export default EditableViewVisitPlan;
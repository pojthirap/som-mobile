import React,{useEffect,useState,useRef} from 'react';
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'

import { TabTemplateSa, Text, TextInput, Button, PickerDate } from '../../../components';
import colors from '../../../utility/colors';
import { FONT_SIZE } from '../../../utility/enum';
import {searchTemplateSaResultTab} from '../../../actions/TemplateSaAction'
import { getInputData } from '../../../utility/helper';
import dayjs from 'dayjs'
var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const SubmenuTemplateSa = () => {

    const [data,setDate] = useState([]);
    const [fromDate,setFormDate] = useState('')
    const [toDate,setToDate] = useState('')
    const inputRef = useRef({});
    const {prospectSelectInfoReducer} = useSelector((state) => state);
    
    useEffect(()=>{
        searchTemplateSaResultT();
    },[])

    useFocusEffect(
        React.useCallback(() => {
            searchTemplateSaResultT();
          // Do something when the screen is focused
          return () => {
            inputRef.current.tpNameTh.clear()
            setFormDate('')
            setToDate('')
            // Do something when the screen is unfocused
            // Useful for cleanup functions
          };
        }, [])
      );
    
    const onChangFromYear = (date) => {
        setFormDate(date)

        if (toDate) {
            let fromD = new Date(date)
            fromD = fromD.setFullYear(fromD.getFullYear() + 1)

            let toD = new Date(toDate)

            if (fromD < toD) setToDate(null)
        }

        if (toDate) {
            let fromD = new Date(date)
            let toD = new Date(toDate)

            let diffDate = dayjs(toD).diff(dayjs(fromD), 'days');

            if(dayjs(fromD).format('YYYY') === dayjs(toD).format('YYYY')){
                if (fromD > toD) setToDate(null)
            }else if (diffDate < 0){
                setToDate(null)
            }else if (diffDate > 365 && diffDate != 365){
                setToDate(null)}
        }
    }

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }
    
    const searchTemplateSaResultT = async () =>{
        let propspectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        const data = await searchTemplateSaResultTab(propspectId,'','','');
        setDate(data)
    }
    
    const handleSubmit = async () =>{
        let totalValue = getInputData(inputRef);
        let propspectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(totalValue.data){
            const {tpNameTh,fromDate,toDate} = totalValue.data
            const data = await searchTemplateSaResultTab(
                propspectId,
                totalValue.data.tpNameTh ? totalValue.data.tpNameTh : '' ,
                fromDate ? fromDate : toDate ? dayjs(toDate).subtract(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : '',
                toDate ? toDate : fromDate ?  dayjs(fromDate).add(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : ''
                );
            setDate(data)
        }
       
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <ScrollView>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={styles.topLabel}>
                        <View style={{marginTop: '5%'}}>
                            <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection:'row'}}>
                            <View>
                                <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>All Order</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: FONT_SIZE.SUBTITLE, color:colors.primary, fontWeight:'bold'}}> ({data.length})</Text> 
                            </View>  
                        </View>
                    </View>
                </View>
                <View style={styles.searchGroup}>
                    <View style={{flex: 1, paddingBottom: '3%'}}>
                        <TextInput title={'ชื่อโครงการ'} ref={el => inputRef.current.tpNameTh = el}/>
                    </View>
                    <View style={{flex: 1, paddingBottom: '3%'}}>
                        <PickerDate 
                            DateBoxWidth={'70%'} 
                            title={'วันที่เริ่มต้น'} 
                            TITLE={true} 
                            calendarWidth={'100%'}
                            dateValue={fromDate} 
                            ref={el => inputRef.current.fromDate = el} 
                            onChange={(date)=> {
                                onChangFromYear(date)
                            }}  
                            maxDate={new Date()} 
                            // maxDate={toDate? dayjs(toDate).format('YYYY-MM-DD') :new Date()} 
                            markDate={fromDate ? fromDate : toDate}/>
                        
                    </View>
                    <View style={{flex: 1, paddingBottom: '3%'}}>
                        <PickerDate 
                            DateBoxWidth={'70%'} 
                            title={'วันที่สิ้นสุด'} 
                            TITLE={true} 
                            calendarWidth={'100%'}
                            dateValue={toDate} 
                            ref={el => inputRef.current.toDate = el}  
                            markDate={toDate ? toDate : fromDate} 
                            onChange={(date)=>setToDate(date)}  
                            minDate={fromDate} 
                            maxDate={fromDate ? dayjs(fromDate).add(365,'day').format('YYYY-MM-DD') : new Date()}/>
                    </View>
                </View>
                <View style={[styles.searchGroup, {marginBottom: '5%'}]}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Button 
                            width={'30%'}
                            onPress={()=>handleSubmit()}
                            title={'Search'}
                            typeIcon={'Ionicons'}
                            nameIcon={'search-outline'}
                            buttonHeigth={50}/>
                    </View>
                </View>
            {data.length != 0 ? 
                <FlatList
                    data={data}
                    renderItem={(item)=>
                            <View style={styles.flatStyle}>
                                <TabTemplateSa
                                    nameProject={item.item.tpNameTh}
                                    userBy={item.item.saleName}
                                    timeUpdate={item.item.createDtm}
                                    dateUpdate={item.item.createDtm}
                                    tpSaFormId={item.item.tpSaFormId}
                                    recSaFormId={item.item.recSaFormId}
                                    Nav={item.item.template}
                                    title={item.item.tpNameTh}
                                    children={item.item.children}/>
                            </View>   
                    }/>
                    : 
                    <View style={{alignSelf:'center', marginTop:40}}>
                        <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>ไม่พบข้อมูล</Text>
                    </View>
                }
                
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    topLabel: {
        width: '100%',
        flex: 1,
        paddingHorizontal: '5%'
    },
    searchGroup: {
        flex: 1,
        marginHorizontal: '5%', 
        marginVertical: '3%'
    },
    flatStyle: {
        paddingVertical: '2%', 
        borderTopWidth: 1, 
        borderTopColor: colors.grayborder, 
        marginHorizontal:'5%', 
        flex: 1
    }
})

export default SubmenuTemplateSa;
import React,{useEffect,useState, useRef} from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'

import { Text, TabSurveyDetail, Button, PickerDate } from '../../../components';
import colors from '../../../utility/colors';
import { FONT_SIZE } from '../../../utility/enum';
import {serveyResult} from '../../../actions/SurveyResultAction';
import { getInputData } from '../../../utility/helper';

import dayjs from 'dayjs';
import 'dayjs/locale/th';
var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const SubmenuSurveyResults = () => {

    const {prospectSelectInfoReducer} = useSelector((state) => state);

    const [data,setData] = useState([])
    const [fromDate,setFormDate] = useState('')
    const [toDate,setToDate] = useState('')
    const inputRef = useRef({});

    useEffect(()=>{
        // feed(data);
            getDataList()
    },[])



    useFocusEffect(
        React.useCallback(() => {
            getDataList()
          // Do something when the screen is focused
          return () => {
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
            let fromY = new Date(date)
            fromY = fromY.setFullYear(fromY.getFullYear() + 1)

            let toY = new Date(toDate)

            if (fromY < toY) setToDate(null)
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

    const onSearch = async () =>{
        let totalValue = getInputData(inputRef);
        const {fromDate,toDate} = totalValue.data
        let propspectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(fromDate || toDate) {
            const res = await serveyResult(
                fromDate ? fromDate : toDate ? dayjs(toDate).subtract(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : '',
                toDate ? toDate : fromDate ?  dayjs(fromDate).add(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : '',
                propspectId);
            let data = res.map(obj=>{
                return {date:obj.createDtm}
            })
            data = [...new Set(data)];
            data = data.map(item=>{
                let result = item
                result.survey = res.filter(obj=>obj.createDtm === result.date)
                return result
            })
            setData(data)
        }
    }
    // const generateData = (data) =>{
    //      data = data.map(obj=>{
    //         return {date:obj.createDtm,date_name : dayjs(obj.createDtm).locale('th').format('LL')}
    //     })
    //     data = [...new Set(data)];
    //     data = data.map(item=>{
    //         let result = item
    //         result.survey = res.filter(obj=>obj.createDtm === result.date)
    //         return result
    //     })
    //     return data
    // }

    const getDataList = async () =>{
            let propspectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
            let res = await serveyResult(fromDate ,toDate ,propspectId);
            let data = res.map(obj=>{ 
                return {date:obj.createDtm}
            })
            data = [...new Set(data)];
            data = data.map(item=>{
                let result = item
                result.survey = res.filter(obj=>obj.createDtm === result.date)
                return result
            })
               
            setData(data) 
    }

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }
    
    const dateDisplay = (item) => {
        return (
            <View>
                <View style={styles.dateLabel}>
                    <Text>{dayjs(item.item.date).locale('th').format('D MMMM BBBB')}</Text>   
                </View>
                <View>
                    <FlatList
                        data = {item.item.survey}
                        renderItem={(date)=> 
                            <View style={{paddingVertical: '2%', marginHorizontal:'2%'}}>
                                <TabSurveyDetail
                                    nameProject={date.item.tpNameTh}
                                    userBy={date.item.saleName}
                                    dateUpdate={dayjs(date.item.createDtm).locale('th').format('D/M/BBBB')}
                                    Nav={date.item.template}
                                    title={date.item.tpNameTh}
                                    children={date.item.children}
                                    recAppFormId={date.item.recAppFormId}
                                    />
                            </View>
                        }
                    />
                </View>
            </View> 
        )
    }

    return (
        <View style={{backgroundColor: colors.white, flex: 1}}>
            <ScrollView>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={styles.topLabel}>
                        <View style={{marginLeft: '5%', marginTop: '5%'}}>
                            <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                        </View>
                        <View style={{flex: 1, marginLeft: '5%', flexDirection: 'row'}}>
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
                    <View style={{flex: 1, marginBottom: '3%'}}>
                        <PickerDate 
                            DateBoxWidth={'80%'} 
                            title={'วันที่เริ่มต้น'} 
                            TITLE={true} 
                            calendarWidth={'100%'}
                            dateValue={fromDate} 
                            ref={el => inputRef.current.fromDate = el} 
                            onChange={(date)=> {
                                onChangFromYear(date)
                            }} 
                            maxDate={new Date()} 
                            markDate={fromDate ? fromDate : toDate}
                            // maxDate={toDate? dayjs(toDate).format('YYYY-MM-DD') :new Date()} markDate={fromDate ? fromDate : toDate}
                            />
                    </View>
                    <View style={{flex: 1}}>
                        <PickerDate 
                            DateBoxWidth={'80%'} 
                            title={'วันที่สิ้นสุด'} 
                            TITLE={true} 
                            alendarWidth={'100%'}
                            markDate={toDate ? toDate : fromDate}
                            calendarWidth={'100%'}  
                            dateValue={toDate} ref={el => inputRef.current.toDate = el} 
                            onChange={(date)=>setToDate(date)}
                            minDate={fromDate} maxDate={fromDate ? dayjs(fromDate).add(365,'day').format('YYYY-MM-DD') : new Date()}/>
                    </View>
                    <View style={{flex: 1, marginVertical: '5%', alignItems: 'center'}}>
                        <Button 
                            title={'Search'}
                            typeIcon={'Ionicons'}
                            nameIcon={'search-outline'}
                            buttonHeigth={50}
                            onPress={() => onSearch()}
                            width={'30%'}
                        />
                    </View>
                </View>
                {data.length !=0 ? 
                    <FlatList
                        data = {data}
                        renderItem={(item)=> dateDisplay(item)}
                    />
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
        justifyContent: 'space-between'
    },
    dateLabel: {
        backgroundColor: colors.grayborder,
        paddingVertical: '3%',
        paddingHorizontal: '5%'
    },
    searchGroup: {
        flex: 1,
        marginHorizontal: '5%',  
        marginVertical: '3%'
    }
})

export default SubmenuSurveyResults;
import React,{ useEffect,useState, useRef } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import {useFocusEffect} from '@react-navigation/native'

import { Text, TabAttachments, Button, SelectDropdown, PickerDate } from '../../../components';
import { searchAttachmentTab,searchAttachCate } from '../../../actions/prospectAction'
import colors from '../../../utility/colors';
import { FONT_SIZE } from '../../../utility/enum';
import { formatBytes } from '../../../utility/helper';
import { getInputData,resetInputData } from '../../../utility/helper';

let typeDataList = [
    {key: 'Y', value: 'รูปภาพ'},
    {key: 'N', value: 'ไฟล์'}
]

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const SubmenuAttach = () => {

    const {prospectReducer,prospectSelectInfoReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [fromDate,setFormDate] = useState('')
    const [toDate,setToDate] = useState('')
    const [typePhotoList,setTypePhotoDataList] = useState('')

    useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(prospectId){
            dispatch(searchAttachmentTab(prospectId))
            dispatch(searchAttachCate())
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
            dispatch(searchAttachmentTab(prospectId))
            // resetInputData(inputRef);
            dispatch(searchAttachCate())
          // Do something when the screen is focused
          return () => {
            resetInputData(inputRef);
            setFormDate('')
            setToDate('')
            setTypePhotoDataList('')
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

    const onPressSearch = () =>{
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        let totalValue = getInputData(inputRef);

        if (!totalValue.isInvalid) {
            dispatch(searchAttachmentTab(
                prospectId,
                totalValue.data,                
                fromDate ? fromDate : toDate ? dayjs(toDate).subtract(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : '',
                toDate ? toDate : fromDate ?  dayjs(fromDate).add(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : ''))
        }
    }
    
    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const getLength = () =>{
        if(prospectReducer.attechment){
            let length = prospectReducer.attechment.records.reduce((sum,item)=>{
                 return item.recordAppFormFileLst.length  + sum }, 0)
            return length
        }else{
            return 0
        }
    }

    const dateDisplay = (item) => {
        return (
            <View>
                <View style={styles.dateLabel}>
                    <Text>{dayjs(item.item.updateDtmStr).locale('th').format('D MMMM BBBB')}</Text>   
                </View>
                <View>
                    <FlatList
                        data = {item.item.recordAppFormFileLst}
                        renderItem={(date)=> 
                            <View style={{paddingVertical: '2%', marginHorizontal:'2%'}}>
                                <TabAttachments
                                    data={date.item}
                                    name={date.item.fileName}
                                    userBy={date.item.empName}
                                    sizeFile={formatBytes(date.item.fileSize)}
                                    type={date.item.photoFlag}
                                    img={date.item.fileUrl}/>
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
                        <View style={{flex: 1, marginLeft: '5%', flexDirection:'row', marginBottom: '3%'}}>
                            <View>
                                <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>Attachments</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: FONT_SIZE.SUBTITLE, color:colors.primary, fontWeight:'bold'}}> ({getLength()})</Text> 
                            </View>  
                        </View>
                    </View>
                </View>
                <View style={styles.searchGroup}>
                    <View style={{flex: 1}}>
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
                            // maxDate={toDate? dayjs(toDate).format('YYYY-MM-DD') :new Date()} markDate={fromDate ? fromDate : toDate}
                            markDate={fromDate ? fromDate : toDate}/>
                    </View>
                </View>
                <View style={styles.searchGroup}>
                    <View style={{flex: 1}}>
                        <PickerDate 
                            DateBoxWidth={'80%'} 
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
                <View style={styles.searchGroup}>
                    <View style={{flex: 1}}>
                        <SelectDropdown 
                            titleDropdown={'ประเภท'} 
                            titleAlert={'ประเภท'}
                            dataList={typeDataList}
                            titleKey={'value'}
                            valueKey={'key'}
                            onPress={(type)=> setTypePhotoDataList(type.key)}
                            ref={el => inputRef.current.typeDataList = el}
                        />
                    </View>
                </View>
                <View style={styles.searchGroup}>
                    {typePhotoList == 'Y' ? 
                        <View style={{flex: 1}}>
                            <SelectDropdown 
                                titleDropdown={'ประเภทรูปภาพ'} 
                                titleAlert={'ประเภทรูปภาพ'}
                                dataList={prospectReducer.attechmentCate.records}
                                titleKey={'attachCateNameTh'}
                                valueKey={'attachCateId'}
                                ref={el => inputRef.current.attachCateId = el}
                            />
                        </View>
                        :
                        null
                    }
                    
                </View>
                <View style={styles.searchGroup}>
                    <View style={{flex: 1, marginHorizontal: '20%', alignItems: 'center'}}>
                        <Button 
                            width={'50%'}
                            title={'Search'}
                            typeIcon={'Ionicons'}
                            nameIcon={'search-outline'}
                            buttonHeigth={50}
                            onPress={() => onPressSearch()}
                        />
                    </View>
                </View>
                {prospectReducer.attechment.records != 0 ? 
                <FlatList
                    data = {prospectReducer.attechment.records}
                    renderItem={(item)=> dateDisplay(item)}
                />
                : 
                <View style={{alignSelf:'center', marginTop:'5%'}}>
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
        justifyContent: 'space-between',
    },
    dateLabel: {
        backgroundColor: colors.grayborder,
        paddingVertical: '3%',
        paddingHorizontal: '5%'
    },
    searchGroup: {
        flex: 1,
        marginHorizontal: '5%', 
        marginBottom: '3%'
    }
})

export default SubmenuAttach;
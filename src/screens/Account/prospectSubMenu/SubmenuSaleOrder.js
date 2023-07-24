import React,{useRef,useEffect,useState} from 'react';
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import {useFocusEffect} from '@react-navigation/native'

import { Text, TabSaleOrder, Button, PickerDate } from '../../../components';
import colors from '../../../utility/colors';
import { FONT_SIZE } from '../../../utility/enum';
import {saleOrder,getConfigLov } from '../../../actions/SaleORderAction'
import { getInputData } from '../../../utility/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
var buddhistEra = require('dayjs/plugin/buddhistEra')
    dayjs.extend(buddhistEra)

    require('dayjs/locale/th')
const SubmenuSaleOrder = () => {

    const [data,setData] = useState([])
    const [conf,setConf] = useState([])
    const [list,setList] = useState([])
    const inputRef = useRef({});
    const [fromDate,setFormDate] = useState('')
    const [toDate,setToDate] = useState('')
    const {prospectSelectInfoReducer} = useSelector((state) => state);

    useEffect(()=>{
        getSaleOrder();
    },[])

    useFocusEffect(
        React.useCallback(() => {
            getSaleOrder();
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
    
    const getSaleOrder = async () =>{
        let custCode = prospectSelectInfoReducer.dataSelect.prospectAccount.custCode
        const data = await saleOrder(custCode,'','');
        const conf = await getConfigLov("ORDER_STATUS");
        let ls = data.map((obj)=>{
            return dayjs(obj.somOrderDte).locale('th').format('D MMMM BBBB')
        })
        ls = Array.from(new Set(ls))
        ls = ls.map(l =>{
            return {date:l,data:[]}
        })
        ls = ls.map(l =>{
            let results = l
            const res = data.filter(obj=> dayjs(obj.somOrderDte).locale('th').format('D MMMM BBBB') === l.date)
            results.data = res
            return results
        })
        setData(data)
        setList(ls)
        setConf(conf)
    }
    const onSearch = async () =>{
        let totalValue = getInputData(inputRef);
        const {fromDate,toDate} = totalValue.data
        let custCode = prospectSelectInfoReducer.dataSelect.prospectAccount.custCode
        if(fromDate || toDate) {
            const data = await saleOrder(
                custCode,
                fromDate ? fromDate : toDate ? dayjs(toDate).subtract(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : '',
                toDate ? toDate : fromDate ?  dayjs(fromDate).add(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : '',
                );
            const conf = await getConfigLov("ORDER_STATUS");
            let ls = data.map((obj)=>{
                return dayjs(obj.somOrderDte).locale('th').format('D MMMM BBBB')
            })
            ls = Array.from(new Set(ls))
            ls = ls.map(l =>{
                return {date:l,data:[]}
            })
            ls = ls.map(l =>{
                let results = l
                const res = data.filter(obj=> dayjs(obj.somOrderDte).locale('th').format('D MMMM BBBB') === l.date)
                results.data = res
                return results
            })
            setData(data)
            setList(ls)
            setConf(conf)
        }
    }
    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }
    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <ScrollView>
                <View style={{ flex: 1}}>
                    <View style={styles.topLabel}>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                        </View >
                        <View style={{flex: 1, flexDirection:'row'}}>
                        <View>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>All Update</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, color:colors.primary, fontWeight:'bold'}}> ({data.length})</Text> 
                        </View>  
                    </View>
                    </View>    
                </View>
                <View style={[styles.searchGroup, {marginTop: '5%'}]}>
                    <View style={{flex: 1, paddingBottom: '3%'}}>
                        {/* <TextInput title={'วันที่เริ่มต้น'}/> */}
                        <PickerDate 
                            DateBoxWidth={'75%'} 
                            title={'วันที่เริ่มต้น'} 
                            TITLE={true} 
                            calendarWidth={'100%'} 
                            dateValue={fromDate} 
                            ref={el => inputRef.current.fromDate = el} 
                            onChange={(date)=> {
                                onChangFromYear(date)
                            }}
                            maxDate={new Date()}
                            markDate={fromDate ? fromDate : toDate}/>
                    </View>
                    <View style={{paddingBottom: '3%'}}>
                        <PickerDate 
                            DateBoxWidth={'75%'} 
                            title={'วันที่สิ้นสุด'} 
                            TITLE={true} 
                            calendarWidth={'100%'} 
                            dateValue={toDate} 
                            ref={el => inputRef.current.toDate = el}  
                            markDate={toDate ? toDate : fromDate} 
                            onChange={(date)=>setToDate(date)}  
                            minDate={fromDate} maxDate={fromDate ? dayjs(fromDate).add(365,'day').format('YYYY-MM-DD') : new Date()}/>
                    </View>
                    <View style={{flex: 1, marginVertical: '5%', alignItems: 'center'}}>
                        <Button 
                            onPress={onSearch}
                            title={'Search'}
                            typeIcon={'Ionicons'}
                            nameIcon={'search-outline'}
                            buttonHeigth={50}
                            width={'30%'}
                        />
                    </View>
                </View>

            {
                list.length != 0 ?
                    <FlatList
                    data = {list}
                    renderItem = {(item) =>
                        <View style={{backgroundColor: colors.grayTable}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT, paddingVertical: '3%', paddingHorizontal: '5%'}}>{item.item.date}</Text>
                                    <FlatList
                                        data = {item.item.data}
                                        renderItem = {(item) =>
                                            <TabSaleOrder
                                                isStatus = {true}
                                                conf={conf}
                                                name={item.item.description}
                                                saleOrder={item.item.somOrderNo}
                                                sapOrderNo={item.item.sapOrderNo}
                                                description={item.item.description}
                                                creationDate={item.item.somOrderDte}
                                                pricingDate={item.item.pricingDtm}
                                                message={item.item.sapMsg}
                                                byCreate={item.item.saleName}
                                                status={item.item.orderStatus}
                                            />
                                        }
                                    />
                        </View>
                    }
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
        marginTop: '5%',
        paddingHorizontal: '5%'
    },
    flatStyle: {
        borderTopWidth: 1, 
        borderTopColor: colors.grayborder, 
        marginHorizontal:30, 
        flex: 1
    },
    searchGroup: {
        flex: 1,
        marginHorizontal: '5%', 
        marginBottom: '3%'
    }
})

export default SubmenuSaleOrder;
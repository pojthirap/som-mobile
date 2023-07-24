import React, { useEffect } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import { Text, TabFeedDetail } from '../../../components';
import colors from '../../../utility/colors';
import { FONT_SIZE } from '../../../utility/enum';
import { getFeed } from '../../../actions/prospectAction';

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const SubmenuFeed = () => {

    const {prospectReducer,prospectSelectInfoReducer} = useSelector((state) => state);
    const dispatch = useDispatch();

     useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(prospectId){
            dispatch(getFeed(prospectId))
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
            dispatch(getFeed(prospectId))
          // Do something when the screen is focused
          return () => {
            // Do something when the screen is unfocused
            // Useful for cleanup functions
          };
        }, [])
      );

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const feed = () =>{
        if(prospectReducer.dataFeedTab) {
            let groups = prospectReducer.dataFeedTab.reduce((groups, item) => {
                    const date = item.updateDtm.split('T')[0];
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push(item);
                    return groups;
            },{})
            let groupArrays = Object.keys(groups).map((date) => {
                return {
                date,
                item: groups[date]
                };
            })
            return groupArrays
           }
    }

      const getLength = () =>{
        if(prospectReducer.dataFeedTab){
            let length = prospectReducer.dataFeedTab
            return length.length
        }else{
            return 0
        }
    }

    const dateDisplay = (item) => {
        return (
            <View>
                <View style={styles.dateLabel}>
                    <Text>{dayjs(item.item.date).locale('th').format('D MMMM BBBB')}</Text>   
                </View> 
                <View>
                    <FlatList
                        data={item.item.item}
                        renderItem={(data)=>  
                            <View style={{paddingVertical: '2%', marginHorizontal:'2%'}}>
                                <TabFeedDetail
                                    tabEdit ={`${data.item.lovNameTh}  ${data.item.description ? `, ${data.item.description}` : '' }`}
                                    editBy={data.item.createFullName}
                                    hoursTime ={dayjs(data.item.updateDtm).format('HH:mm')}
                                /> 
                            </View> 
                        }
                    />
                </View>
            </View> 
        )
    }

    return(
        <View style={{backgroundColor: colors.white, flex: 1}}>
            <ScrollView>
                <View style={styles.topLabel}>
                    <View style={{ flex: 1, marginLeft: '5%', marginTop: '5%'}}>
                        <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                    </View>
                    <View style={{flex: 1, marginLeft: '5%', flexDirection:'row'}}>
                        <View>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>All Update</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, color:colors.primary, fontWeight:'bold'}}> ({getLength()})</Text> 
                        </View>  
                    </View>
                </View>
                {prospectReducer.dataFeedTab.length != 0 ?
                    <FlatList
                        data = {feed()}
                        renderItem={(item)=> dateDisplay(item)}
                    />
                :
                    <View style={{alignSelf:'center', marginTop:'5%', marginBottom: '10%'}}>
                        <Text style={{fontSize:FONT_SIZE.LITTLETEXT}}>ไม่พบข้อมูล</Text>
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
        marginBottom: '5%'
    },
    dateLabel: {
        backgroundColor: colors.grayborder,
        paddingVertical: '3%',
        paddingHorizontal: '5%'
    }
})

export default SubmenuFeed;
import React,{useEffect} from 'react';
import { View, Image, StyleSheet } from 'react-native';

import Text from '../Text';
import colors from '../../utility/colors';
import { SALEORDER_STATUS, FONT_SIZE } from '../../utility/enum';
import dayjs from 'dayjs'
import {getConfigLov} from '../../actions/TemplateSaAction'
var buddhistEra = require('dayjs/plugin/buddhistEra')
    dayjs.extend(buddhistEra)

    require('dayjs/locale/th')
const tabSaleOrderDetail = ({isStatus = false,conf, name, saleOrder, description, creationDate, pricingDate, message, byCreate,sapOrderNo, status}) => {

   const getStatusColor = (status,layout) =>{
       if(conf && conf.length != 0 ){
            const cg = conf.find(con=>con.lovNameEn === status);
            if (!cg.condition1) return
            const color = cg ? cg.condition1.split("|") : ['white','black']
            if(layout === 'bg') return color[0]
            return color[1]
       }  else {
            return }
   }
    return (
        <View style={{flex: 1, paddingHorizontal: '5%', paddingVertical: '3%', backgroundColor:colors.white}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                    <View style={{}}>
                        <View style={{paddingBottom: '2%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: FONT_SIZE.LITTLETEXT,fontWeight:'bold'}}>{saleOrder}</Text>
                            <View style={{width: '30%', marginLeft:'3%'}}> 
                                <View style={{backgroundColor: getStatusColor(status,'bg') ? getStatusColor(status,'bg') : colors.greenBGStatus , height:30, width: '100%', justifyContent: 'center', borderRadius: 40}}>
                                    <Text style={{color:getStatusColor(status,'text') ? getStatusColor(status,'text') : colors.primary, alignSelf: 'center', fontSize: FONT_SIZE.LITTLETEXT, fontWeight: 'bold'}}>{status}</Text>                    
                                </View>                  
                            </View> 
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginEnd: '3%'}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>โดย</Text>
                            </View>
                            <View> 
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>{byCreate}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <View style={{marginRight: '3%'}}>
                                    <Text style={{fontWeight:'bold'}}>Sales Order</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{sapOrderNo ? sapOrderNo :'-'}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <View style={{marginRight: '3%'}}>
                                    <Text style={{fontWeight:'bold'}}>Description</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{description ? description : '-'}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <View style={{marginRight: '3%'}}>
                                    <Text style={{fontWeight:'bold'}}>Creation Date</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{ creationDate ? dayjs(creationDate).locale('th').format('D/M/BBBB') : '-'}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <View style={{marginRight: '3%'}}>
                                    <Text style={{fontWeight:'bold'}}>Pricing Date</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{pricingDate ? dayjs(pricingDate).locale('th').format('D/M/BBBB') : '-'}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <View style={{marginRight: '3%'}}>
                                    <Text style={{fontWeight:'bold'}}>Message</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text>{message ? message : '-'}</Text>
                                </View>
                            </View>
                        </View>  
                    </View>
                </View>   
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contrainer: {
    }
})

export default tabSaleOrderDetail;
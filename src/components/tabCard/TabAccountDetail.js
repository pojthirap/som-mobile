import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import Text from '../Text'
import colors from '../../utility/colors';
import { FONT_SIZE } from '../../utility/enum';

const tabAccTeamDetail = ({nameEmployee, roleEmployee, phoneEmployee, emailEmployee, saleGroup, saleTerritory}) => {
    
    return (
        <View style={{flex: 1, paddingHorizontal: 2, backgroundColor:colors.white, borderTopWidth: 1, borderTopColor: colors.grayborder}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginEnd: '5%'}}>
                    <Image source={require('../../assets/images/submenu/Component-13.png')} style={{ width: 50, height: 50}}/>
                </View>
                <View style={{flex: 1, marginVertical: '3%'}}>
                    <View style={{ paddingBottom: '2%'}}>
                        <Text style={{fontWeight: 'bold', fontSize: FONT_SIZE.LITTLETEXT}}>{nameEmployee}</Text>
                    </View>
                    <View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <View style={{marginRight: '3%'}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT,fontWeight:'bold'}}>Party Role</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>{roleEmployee}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <View style={{marginRight: '3%'}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT,fontWeight:'bold'}}>เบอร์โทรศัพท์มือถือ</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>{phoneEmployee}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <View style={{marginRight: '3%'}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT,fontWeight:'bold'}}>อีเมล</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>{emailEmployee}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <View style={{marginRight: '3%'}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT,fontWeight:'bold'}}>Sale Group</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>{saleGroup}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <View style={{marginRight: '3%'}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT,fontWeight:'bold'}}>Sale Territory</Text>
                            </View>
                            {/* {LoopSaleTerritory} */}
                            <View style={{flex: 1}}> 
                                {
                                    saleTerritory && saleTerritory.length ?
                                        saleTerritory.map((item)=>{
                                            return <Text numberOfLines={1} style={{fontSize: FONT_SIZE.LITTLETEXT}}>{item.territoryNameTh}</Text>
                                            // return <Text>{item.territoryNameTh}</Text>
                                        })
                                    :
                                    <Text> - </Text>
                                }
                            </View> 
                        </View>
                    </View>        
                </View>
            </View>
        </View>
    )
}

export default tabAccTeamDetail;
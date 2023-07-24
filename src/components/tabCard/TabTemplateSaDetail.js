import React, {useState,useEffect} from 'react';
import { View, Image } from 'react-native';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import Text from '../Text'
import Button from '../Button'

import colors from '../../utility/colors';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import TemplateSa from '../template/TemplateSa'
import {viewTemplateSaResult} from '../../actions/TemplateSaAction'

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')


const tabTemplateSaDetail = ({nameProject, userBy,tpSaFormId,recSaFormId, timeUpdate, dateUpdate, Nav, title, children}) => {
    const navigation = useNavigation();
    const [modalShow,setModalShow] = useState(false)
    const [viewTempate,setViewTemplate] = useState(null);
    useEffect(()=>{
        viewResult();
    },[])
    const viewResult = async () =>{
        const data = await viewTemplateSaResult(tpSaFormId,recSaFormId)
        setViewTemplate(data)
    }
    const onPressView = () =>{
        if(viewTempate){
            setModalShow(true)
        }
    }
    return (
        <View style={{addingHorizontal: '5%', paddingVertical: '3%', backgroundColor:colors.white}}>
            <TemplateSa  nameProject={nameProject} show={modalShow} onPressCancel={()=>setModalShow(false)} data={viewTempate} userBy={userBy}/>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginEnd: '5%', alignSelf: 'flex-start'}}>
                    <Image source={require('../../assets/images/submenu/Component-15.png')} style={{ width: 50, height: 50}}/>
                </View>
                <View style={{flex: 1}}>
                    <View style={{}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{marginEnd: '3%', flex: 1}}>
                                <Text style={{fontWeight:'bold', fontSize: FONT_SIZE.LITTLETEXT}}>{nameProject}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginEnd: '3%'}}>
                                <Text>โดย</Text>
                            </View>
                            <View>
                                <Text>{userBy}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View>
                                    <Icon 
                                        type="MaterialCommunityIcons" 
                                        name="clock-time-four-outline"
                                        style={{fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}
                                    />
                                </View>
                                <View >
                                    <Icon 
                                        type="MaterialCommunityIcons" 
                                        name="circle-medium"
                                        style={{fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}
                                    />
                                </View>
                                <View style={{marginStart: '3%'}}>
                                    <Text>{dayjs(dateUpdate).locale('th').format('D/M/BBBB')}</Text>
                                </View>
                            </View>
                        </View>
                         
                    </View>
                </View>
                <View style={{alignItems: 'flex-end', flex: 1/2}}>
                    <Button 
                        onPress={onPressView}
                        title={'View'}
                        width= {'100%'}
                        buttonHeigth={50}/>
                </View> 
            </View>            
        </View>
    )
}

export default tabTemplateSaDetail;
import React,{useState,useEffect} from 'react';
import { View, Image } from 'react-native';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native'

import Text from '../Text'
import Button from '../Button'

import colors from '../../utility/colors';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import dayjs from 'dayjs'
import SurveyResult from '../../components/template/SurveyResult'
import {searchViewResult} from '../../actions/SurveyResultAction'
var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')
const tabSurveyDetail = ({nameProject, userBy, timeUpdate, dateUpdate, Nav, title, children,recAppFormId}) => {
    const navigation = useNavigation();
    const [viewResult,setViewResult] = useState(null)
    const [showView,setShowView] = useState(false)
    useEffect(()=>{
        getViewResult();
    },[])
    const getViewResult = async () =>{
        if(recAppFormId){
            const data = await searchViewResult(recAppFormId)
            setViewResult(data[0])
        }
    }
    const showModal = () =>{
        if(viewResult)
        setShowView(true)
    }

    return (
        <View style={{paddingHorizontal: '5%', paddingVertical: '3%', backgroundColor:colors.white}}>
            <SurveyResult show={showView} nameProject={nameProject} onPressCancel={()=>setShowView(false)} data={viewResult}/>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginEnd: '5%', alignSelf: 'flex-start'}}>
                    <Image source={require('../../assets/images/submenu/Search.png')} style={{ width: 50, height: 50}}/>
                </View>
                <View style={{flex: 1}}>
                    <View>
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
                                <View>
                                    <Icon 
                                        type="MaterialCommunityIcons" 
                                        name="circle-medium"
                                        style={{fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}
                                    />
                                </View>
                                <View style={{marginStart: '3%'}}>
                                    <Text>{dateUpdate}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>  
                <View style={{alignItems: 'flex-end', flex: 1/2}}>
                    <Button 
                        onPress={showModal}
                        title={'View'}
                        width= {'100%'}
                        buttonHeigth={50}/>
                </View>            
            </View>            
        </View>
    )
}

export default tabSurveyDetail;
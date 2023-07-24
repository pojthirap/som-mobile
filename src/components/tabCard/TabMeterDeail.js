import React, {useState} from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import Text from '../Text'
import Modal from '../Modal'

import colors from '../../utility/colors';
import {baseUrl} from '../../api/Axios'
// const localizedFormat = require('dayjs/plugin/localizedFormat')
// dayjs.extend(localizedFormat)
// dayjs.locale('TH')
var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')
const tabMeterDetail = ({petrolPumpNo, gasPumpNozzle, productName, meterNumber, date, userBy,urlFile, name}) => {

    const [modalVisible, setmodalVisible] = useState(false);

    const onPressModal = (event) => {
        setmodalVisible(event);
    }
    const getImageUrl = (url) =>{
        return `${baseUrl}${url.substring(1)}`
    }
    return (
        <View style={{paddingHorizontal: 5, paddingVertical: 5, backgroundColor:colors.white, margin: 20}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1}}>
                      
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                            <View style={{flex: 1, paddingHorizontal: 5}}>
                                <Text>{meterNumber}</Text>
                            </View>
                            <View style={{flex: 1, paddingHorizontal: 5}}>
                                <Text>{gasPumpNozzle}</Text>
                            </View>
                            <View style={{flex: 1, paddingHorizontal: 5}} numberOfLines={3}>
                                <Text>{productName}</Text>
                            </View>
                            <View style={{flex: 1, paddingHorizontal: 5}}>
                                <Text>{meterNumber}</Text>
                            </View>
                            <View style={{flex: 1, paddingHorizontal: 5}}> 
                                <Text>{dayjs(date).locale('th').format('D/M/BBBB')}</Text>
                            </View>
                            <View style={{flex: 1, paddingHorizontal: 5}}>
                                <Text>{userBy}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{marginHorizontal: 5}}>
                    <TouchableOpacity style={{marginStart: 5, justifyContent: 'center'}} onPress={() => onPressModal(true)}>
                        <Image source={require('../../assets/images/meter.png')}/>
                        <Modal
                            visible={modalVisible}
                            onPressCancel={onPressModal}
                            title={''}>
                                <View>
                                    <Image source={{uri:getImageUrl(urlFile)}} style={{width:'100%',height:400}} resizeMode="contain" />
                                </View>
                        </Modal>
                    </TouchableOpacity>
                </View>
            </View>            
        <View>
             <Text>{petrolPumpNo}</Text>
        </View>
        </View>
    )
}

export default tabMeterDetail;
import React from 'react';
import { View } from 'react-native';
import { Icon } from 'native-base';
import { useSelector } from 'react-redux';

import Text from '../Text'
import colors from '../../utility/colors';
import { STYLE_SIZE } from '../../utility/enum';

const tabFeedDetail = ({tabEdit, editBy, hoursTime}) => {

    const {prospectSelectInfoReducer} = useSelector((state) => state);

    const accountCompany = prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''

    return(
        <View style={{paddingHorizontal: '3%', paddingVertical: '3%', backgroundColor:colors.white }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '100%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Icon 
                                type="MaterialCommunityIcons" 
                                name="clock-time-four-outline"
                                style={{fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}
                            />
                            <View style={{marginStart: 10}}>
                                <Text >{hoursTime}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: '2%', flexDirection: 'row', width: '90%'}}>
                        <View style={{marginEnd: '3%'}}>
                            <Text>: แก้ไข</Text>
                        </View>
                        <View style={{marginEnd: '5%'}}>
                            <Text>{tabEdit}</Text>
                        </View>
                    </View>
                    <View style={{marginTop: '2%', flexDirection: 'row', width: '90%'}}>
                        <Text>โดย</Text>
                        <View style={{marginStart: 10}}>
                            <Text numberOfLines={2}>{editBy}</Text>
                        </View>                   
                    </View>
                </View>
            </View> 
        </View>   
    )
}

export default tabFeedDetail;
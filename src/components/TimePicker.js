import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Icon } from 'native-base';

import Text from './Text';
import colors from '../utility/colors';

 

const TimePicker = ({isVisible = false, onChange, children, disabled = false, defaultValue}) => {
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [hour, setHour] = useState('00');
    const [min, setMin] = useState('00');

    var today = new Date();
    var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    useEffect(() => {
        if (defaultValue) {
            const myArr = defaultValue.split(":");
            var today = new Date();
            var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), myArr[0], myArr[1], 0);
            setHour(myArr[0]);
            setMin(myArr[1]); 
            setSelectedDate(myToday);
        } else {
            return
        }
    }, [defaultValue])

    const onPressChildren = () => {
        setShow(true)
    }

    const onPressSelect = (value) => {
        setShow(false)
        if (value.type == 'dismissed') return 
        onChange(value.nativeEvent.timestamp)
        let time = dayjs(value.nativeEvent.timestamp)
        setHour(time.format('HH'));
        setMin(time.format('mm')); 
        setSelectedDate(value.nativeEvent.timestamp);
    }

    return (
        <View>
            {
                <TouchableOpacity onPress={() => onPressChildren()} disabled = {disabled}>
                    {
                        children ?
                            <View>
                                {children}
                            </View>
                        :
                        <View style={{flexDirection:'row'}}>
                            <View style={[styles.iconBeforTextinput,{backgroundColor: disabled? colors.disabled : colors.white}]} />
                                <View style={[styles.inputbox,{backgroundColor: disabled? colors.disabled : colors.white}]}>
                                    <Text>
                                        {`${hour} : ${min}`}
                                    </Text>
                                </View>
                            <View style={[styles.BorderEndTextinput,{backgroundColor: disabled? colors.disabled : colors.white}]}>
                                <Icon type='MaterialCommunityIcons' name='clock-time-four-outline' style={{color: colors.grayButton, fontSize: 25}}/>
                            </View>
                        </View>
                    }
                </TouchableOpacity>
            }
            {
                show &&  
                <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate || myToday}
                    // value={defaultValue || selectedDate || myToday}
                    mode={'time'}
                    is24Hour={true}
                    display="spinner"
                    onChange={(value) => onPressSelect(value)}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputbox: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        width: 60,
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginTop: 5,
        height: 50
    },
    iconBeforTextinput: {
        borderStartWidth: 1, 
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        borderTopLeftRadius: 10, 
        borderBottomLeftRadius: 10,
        height: 50,
        marginTop: 5,
        width: 20
    },
    BorderEndTextinput: {
        borderTopRightRadius: 10, 
        borderBottomRightRadius: 10, 
        borderEndWidth: 1, 
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 50,
        marginTop: 5
    }
});

export default TimePicker;

import React, { useState,forwardRef,useImperativeHandle } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Icon } from 'native-base';

import colors from '../utility/colors';
import Calendar from './Calendar';
import Text from './Text';
import language from '../language/th.json'
import { FONT_SIZE, STYLE_SIZE } from '../utility/enum';

var buddhistEra = require('dayjs/plugin/buddhistEra')
    dayjs.extend(buddhistEra)

    require('dayjs/locale/th')

const PickerDate = ({isVisible = false,
                     onChange, 
                     children, 
                     dateValue,
                     disabled = false, 
                     DateBoxWidth = '60%',
                     title,
                     FontSize = FONT_SIZE.LITTLETEXT,
                     maxDate,
                     minDate,
                     markDate,
                     maxYear,
                     require,
                     massageError = language.NOINPUT,
                    //  onPressCancel,
                    REQUIRETITLE,
                    },ref) =>{
    const [show, setShow] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setEerrorMessage] = useState('');
    const [selectValue, setSelectValue] = useState('');

    const onPressChildren = () => {
        if(show === false){
            setShow(true)
        }else{
            setShow(false)
        }
    }
    useImperativeHandle(ref, () => ({
        getInputValue() {
          return { isInvalid: validate(), value: dateValue, isChange: false };
        },
        clear() {
          setIsError(false);
          setEerrorMessage('');
        },
    }));

    const validate = () => {
        if (require && !dateValue) {
          setEerrorMessage(`${massageError}`);
          setIsError(true);
          return true
        }
    
        setIsError(false);
        return false
    };
    
    const onPressSelect = (value) => {
        if(value){
            if (onChange) onChange(value);
            setIsError(false);
            setEerrorMessage('');
        }
        setShow(false)
    };

    const onPressCancel = (value) => {
        setShow(false)
    };

    return(
        <View>
            {/* {
            title ? 
            <Text>{title}</Text>
            :
            null
            } */}

            {
            title ?
                REQUIRETITLE ?
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>{title}</Text>
                        <Text style={{color: colors.redButton, paddingHorizontal: 5, fontSize: FONT_SIZE.LITTLETEXT}}>*</Text>
                    </View>     
                :
                    <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>{title}</Text>
                :
                null
            }
            
            {
                <TouchableOpacity onPress={() => onPressChildren()} disabled = {disabled}>
                {
                    children ? 
                        <View>
                            {children}
                        </View>
                    : 
                    <View style={{width: '100%' }}>
                        <View style={{flexDirection:'row'}}>
                            <View style={[styles.iconBeforTextinput,{backgroundColor: disabled? colors.grayTable : colors.white}]} />
                            <View style={[styles.inputbox,{backgroundColor: disabled ? colors.grayTable : colors.white, width: DateBoxWidth}]}>
                                <Text style={{color: dateValue ? colors.black : colors.gray, fontSize: FontSize}}>
                                    {dateValue ? dayjs(dateValue).format('D/M/BBBB') : disabled == true ? '-' : 'วัน / เดือน / ปี'}
                                </Text>
                            </View>
                            <View style={[styles.BorderEndTextinput,{backgroundColor: disabled? colors.disabled : colors.greenBGStatus}]}>
                                <Icon type="MaterialCommunityIcons" name="calendar-blank-outline" style={{color: colors.grayButton, fontSize: FONT_SIZE.LITTLETEXT}}/>
                            </View>
                        </View>
                    </View>
                }
                    {
                        isError ? 
                        <View>
                            <Text style={{ color: 'red' }}>
                            {errorMessage}
                            </Text>
                        </View>
                        :
                        <View>

                        </View>
                    }
                </TouchableOpacity>
            }
            {
                show && 
    
                <Modal
                    animationType = 'fade'
                    transparent = {true}
                    visible = {show}
                    
                >
                    <TouchableOpacity style={styles.modaltBox} onPress={()=>setShow(false)}>
                        <View style={styles.alertTitle}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={() => onPressCancel(false)} style={{marginHorizontal: '3%', justifyContent:'center'}}>
                                <Icon type="MaterialCommunityIcons" name="close"  style={{color:colors.white, fontSize: FONT_SIZE.TEXT}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'80%'}}>
                            <Calendar 
                                valueDate={dateValue}
                                onDateChange={(value) => onPressSelect(value)}
                                maxDate={maxDate}
                                minDate={minDate}
                                markDate={markDate}
                                // maxYear={}
                            />
                        </View>
                    </TouchableOpacity > 
                </Modal>    
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputbox: {
        borderEndWidth: 1, 
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        justifyContent: 'center',
        paddingHorizontal: 5,
        marginTop: 5,
        height: STYLE_SIZE.BNT_HEIGTH,
    },
    iconBeforTextinput: {
        borderStartWidth: 1, 
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        borderTopLeftRadius: 10, 
        borderBottomLeftRadius: 10,
        height: STYLE_SIZE.BNT_HEIGTH,
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
        width: 40,
        height: 50,
        marginTop: 5,
        paddingHorizontal:5,
        flex: 1
    },
    modaltBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.6)',
    },
    alertTitle: {
        backgroundColor: colors.primary,
        height: STYLE_SIZE.BNT_HEIGTH,
        width: "80%",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalTitle:{
        backgroundColor: colors.primary,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        color: colors.white,
        paddingHorizontal: 10,
        fontSize: FONT_SIZE.SUBTITLE,
        alignSelf:'center',
    },
});

export default forwardRef(PickerDate);
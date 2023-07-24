import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'

import Text from './Text'
import CheckBox from './CheckBox'
import Modal from './Modal'

import { FONT_SIZE, STYLE_SIZE } from '../utility/enum'
import colors from '../utility/colors'

const Filter = ({onPress,select}, ref) =>{

    const [Filter, setFilter] = useState(false);
    const [selectedItemList, setSelectedItemList] = useState([]);

    useEffect(() => {
        setSelectedItemList(select || [])
    }, [Filter])

    const dataList = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '99'
    ]

    useImperativeHandle(ref, () => ({
        getInputValue() {
          return { isInvalid: false, value: selectedItemList, isChange: false };
        },
        clear() {
          setSelectedItemList('');
        },
    }));

    const findSelect = (value) => {
        return selectedItemList.indexOf(value) != -1
    }

    const handleSelect = (value) => {
        let findItem = selectedItemList.find((item) => {
            return item == value
        })

        if (!findItem && value == '99') {
            return setSelectedItemList(dataList)
        }

        if (findItem && value == '99') {
            return setSelectedItemList([])
        }

        if (findItem) {
            let filterItem = selectedItemList.filter((item) => {
                return item != value && item != '99'
            })
            return setSelectedItemList(filterItem)
        }
        let List = [...selectedItemList, value]
        if(List.length == dataList.length -1){
            List.push('99')
        }
        return setSelectedItemList(List)
    }

    const onPressModal = (event) => {
        setFilter(event);
    }

    const onPressConfirm = () => {
        setSelectedItemList(select)
        // if (!selectedItem) return; 
        setFilter(false);
        onPress();
    }

    return(
        <View>
            <TouchableOpacity onPress={()=>setFilter(true)}>  
                <View style={{flexDirection:'row'}}>
                    <View style={{alignSelf:'center'}}>
                        <Icon type='MaterialCommunityIcons' name='filter-outline' style={{color: colors.grayButton,fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}/>
                    </View>
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontSize:FONT_SIZE.LITTLETEXT}}>ตัวกรอง</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <Modal
                visible={Filter}
                onPressCancel={onPressModal}
                title = {'Filter'}
                BUTTON = {true}
                confirmText= {'Confirm'}
                onPressButton={() => onPressConfirm()}
            >
                <View style={{marginHorizontal:'5%',marginTop:'5%',marginBottom:'15%'}}>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'ทั้งหมด'} data={'99'} SelectDefault={findSelect('99')} typeSelect ={'multiSelect'}/>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'เตรียมข้อมูล'} data={'0'} SelectDefault={findSelect('0')} typeSelect ={'multiSelect'}/>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'รอตรวจสอบ'} data={'1'} SelectDefault={findSelect('1')} typeSelect ={'multiSelect'}/>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'ข้อมูลสมบูรณ์'} data={'2'} SelectDefault={findSelect('2')} typeSelect ={'multiSelect'}/>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'ไม่สนใจแล้ว'} data={'3'} SelectDefault={findSelect('3')} typeSelect ={'multiSelect'}/>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'แจ้งยกเลิก'} data={'4'} SelectDefault={findSelect('4')} typeSelect ={'multiSelect'}/>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'ยกเลิก'} data={'5'} SelectDefault={findSelect('5')} typeSelect ={'multiSelect'}/>
                    <CheckBox onPress={handleSelect} type ={'end'} title = {'เป็นปั๊มเช่าแล้ว'} data={'6'} SelectDefault={findSelect('6')} typeSelect ={'multiSelect'}/>
                </View>
            </Modal>
        </View>
    )
}
export default forwardRef(Filter);
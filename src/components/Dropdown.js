import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

import Text from './Text';

import { FONT_SIZE } from '../utility/enum';
import language from '../language/th.json'
import colors from '../utility/colors';
import {sortData} from './../utility/helper'
import DropDownPicker from 'react-native-dropdown-picker';

const dropdown = ({
                    titleDropdown,
                    TITLE= false, 
                    REQUIRETITLE= false, 
                    searchPlaceholder= 'ค้นหา', 
                    data,
                    placeholder= 'กรุณาเลือก',
                    massageError = language.NOINPUT,
                    require = false,
                    titleKey,
                }, ref) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [userSelect, setUserSelect] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setEerrorMessage] = useState('');
    const [fileter, setFiltered] = useState([]);

    useEffect(() => {
        if (!data) return
        if (!titleKey || !data.length) return setFiltered(data);
        let dddd = [...data]
        let dataSort = dddd.sort(function(a, b) {
            return a[titleKey].localeCompare(b[titleKey])
        });
        setFiltered(dataSort);

    }, [data])

    useImperativeHandle(ref, () => ({
        getInputValue() {
          return { isInvalid: validate(), value: userSelect, isChange: isChange() };
        },
        clear() {
          setIsError(false);
          setEerrorMessage('');
          setValue(null)
        },
    }));

    const isChange = () => userSelect != value;

    const validate = () => {
        if (require && userSelect == null) {
          setEerrorMessage(`${massageError}`);
          setIsError(true);
          return true
        }
        
        setIsError(false);
    
        return false
    };   

    return (
        <View>
            {
            TITLE ?
                REQUIRETITLE ?
                    <View style={{flexDirection: 'row'}}>
                        <Text>{titleDropdown}</Text>
                        <Text style={{color: colors.redButton, paddingHorizontal: 5}}>*</Text>
                    </View> 
                :
                    <Text>{titleDropdown}</Text>
                
            :
                null
            }
                <DropDownPicker
                    style={[styles.inputbox, {borderColor: colors.grayborder}]}
                    textStyle={{fontSize: FONT_SIZE.TEXT, fontFamily: 'THSarabunNew', paddingStart: 10}}
                    searchContainerStyle={{borderBottomColor: colors.white}}
                    searchTextInputStyle={{borderColor: colors.grayborder}}
                    dropDownContainerStyle={{borderColor: colors.grayborder}}
                    open={open}
                    setOpen={setOpen}
                    value={value}
                    items={fileter || []}
                    setValue={setValue}
                    // onPress={(i) => onSelect(i)}
                    onChangeValue={(value, index) => {
                        // onSelect(value)
                        setUserSelect(value)
                    }}
                    searchable={true}
                    placeholder={placeholder}
                    searchPlaceholder={searchPlaceholder}
                    containerStyle={{height: 100}}
                    require={require}
                    ListEmptyComponent={({}) => (
                        <View style={{alignItems: 'center'}}> 
                            <Text>
                                ไม่พบข้อมูล
                            </Text>
                        </View>
                    )}
                />
            {
            isError ? 
                <View style={{marginTop: -30}}>
                    <Text style={{ color: 'red' }}>
                        {errorMessage}
                    </Text>
                </View>
                :
                <View>

                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    contianer: {
        borderRadius: 10, 
        width: '100%', 
        minWidth: 100,
    },
    selectBox: {
        borderColor: colors.grayborder,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: FONT_SIZE.TEXT,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 5,
        flexDirection: 'row',
    },
    inputbox: {
        minWidth: 100,
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginTop: 5
    },
});

export default forwardRef(dropdown);

dropdown.PropsTypes = {
    titleDropdown: PropTypes.string,
    titleAlert: PropTypes.string,
    dataList: PropTypes.string,
    placeholder: PropTypes.string,
    textSearch: PropTypes.string,
}
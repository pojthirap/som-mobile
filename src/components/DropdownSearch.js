import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

import Text from './Text';
import AlertDropdown from './AlertDropdown';

import { FONT_SIZE } from '../utility/enum';
import language from '../language/th.json'
import colors from '../utility/colors';
import SearchInput from './SearchInput';
import {sortData} from './../utility/helper'

const dropdownSearch = ({titleDropdown, 
                            titleAlert, 
                            data, 
                            placeholder = 'กรุณาเลือก', 
                            textSearch = 'ค้นหา', 
                            TITLE= true, 
                            REQUIRETITLE= false,
                            colorBackground=colors.white, 
                            height= 50, 
                            onPress,
                            disabled = false,
                            require = false,
                            value = '',
                            titleKey = '',
                            valueKey = '',
                            massageError = language.NOINPUT,
                            defaultValue,
                            selectDis = false
                        }, ref) => {

    const [modalVisible, setmodalVisible] = useState(false);
    const [userSelect, setUserSelect] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setEerrorMessage] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const [fileter, setFiltered] = useState([]);
    const [dropdown, setDropdown] = useState('');

    useEffect(() => {
        if (defaultValue) {
            if (!data) return
            let select = data.find((item) => {
                return item[valueKey] == defaultValue
            })
            if (!select) return
            if(onPress){
                onPress(select)
            }  
            setUserSelect(select[titleKey] || select.key)
            setSelectValue(select[valueKey] || select.key);
        }

        // let dataSort = data.sort(sortData(titleKey));
        // setFiltered(dataSort)

    }, [defaultValue, data])
     
    const onPressShowDropdown = (event) => {
        setmodalVisible(event);
        setDropdown(true)
    };

    const onSelectDropDown = (item) => {
        setUserSelect(item.item[titleKey] || item.item.key)
        setSelectValue(item.item[valueKey] || item.item.key)
        setmodalVisible(false);
        if(onPress){
            onPress(item.item)
        }     
    };

    useImperativeHandle(ref, () => ({
        getInputValue() {
            return { isInvalid: validate(), value: selectValue, isChange: isChange() };
        },
        resetValue() {
            if (defaultValue) {
                if (!data) return
                let select = data.find((item) => {
                    return item[valueKey] == defaultValue
                })
                if (!select) return
                if(onPress){
                    onPress(select)
                }  
                setUserSelect(select[titleKey] || select.key)
                setSelectValue(select[valueKey] || select.key);
            }
        },
        clear() {
            setIsError(false);
            setEerrorMessage('');
            setText('');
        },
    }));

    const isChange = () => selectValue != value;

    const validate = () => {
        if (require && !selectValue) {
            setEerrorMessage(`${massageError}`);
            setIsError(true);
            return true
        }
    
        setIsError(false);
    
        return false
    };

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.touchStyle} onPress={() => onSelectDropDown(item)}>
                <Text>{item.item[titleKey] || item.item.key}</Text>
            </TouchableOpacity>
        )
    }

    let handleSearchBar = (keyInput) => {
        let currentList = []
        let newList = []
        if (keyInput !== '') {
            currentList = data
            newList = currentList.filter((item) => {
                const lc = item[titleKey || key].toLowerCase()
                const filter = keyInput.toLowerCase()
                return lc.includes(filter)
            })
            setFiltered(newList)
        } else {
            setFiltered(data)
        }
    }

    return (
        <View style={styles.contianer}>
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
            <TouchableOpacity
                onPress={() => onPressShowDropdown(true)}
                style={[styles.selectBox, {backgroundColor: disabled ? colors.grayTable : colorBackground, height: height}]}
                disabled={disabled || selectDis}
            >
                <Text style={{color: userSelect ?  colors.black : colors.gray}} >{userSelect|| placeholder}</Text>
                <Icon type="FontAwesome" name="angle-down" style={{color: disabled ? colors.grayTable : colors.black }}/>
            </TouchableOpacity>
            {
            dropdown ?
                <>
                <View style={styles.alertSerch}>
                    <SearchInput onChangeText={handleSearchBar} textSearch = {textSearch} SearchBarType={'AutoSearchBar'}/>
                </View >
                <View style={styles.itemBox}>
                    {
                    fileter.length ?
                        <FlatList
                            data={fileter}
                            renderItem={(item) => renderItem(item)}
                            keyExtractor={item => item.gasId}
                        />
                        :
                        <View style={{marginStart: 20, marginTop: 20}}>
                            <Text>ไม่พบข้อมูล</Text>
                        </View>
                    }  
                </View>
                </>
                : null
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
    alertSerch: {
        // flex: 1/5,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:15,
        marginBottom: 20,
    },
    itemBox: {
        width: "100%",
        flex: 1,
        marginVertical: 10,
        backgroundColor: colors.white
    },
});

export default forwardRef(dropdownSearch);

// dropdownSearch.PropsTypes = {
//     titleDropdown: PropTypes.string,
//     titleAlert: PropTypes.string,
//     data: PropTypes.string,
//     placeholder: PropTypes.string,
//     textSearch: PropTypes.string,
// }
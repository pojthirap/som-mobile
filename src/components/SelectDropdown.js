import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';

import Text from './Text';
import AlertDropdown from './AlertDropdown';

import { FONT_SIZE } from '../utility/enum';
import language from '../language/th.json'
import colors from '../utility/colors';

const selectDropdown = ({ titleDropdown,
    titleAlert,
    dataList,
    placeholder = 'กรุณาเลือก',
    textSearch = 'ค้นหา',
    TITLE = true,
    REQUIRETITLE = false,
    colorBackground = colors.white,
    height = 50,
    onPress,
    disabled = false,
    require = false,
    value = '',
    titleKey = '',
    valueKey = '',
    massageError = language.NOINPUT,
    defaultValue = null,
    selectDis = false,
    nullable = false,
    NotFillter,
    children,
    startStop,
}, ref) => {

    const [modalVisible, setmodalVisible] = useState(false);
    const [userSelect, setUserSelect] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setEerrorMessage] = useState('');
    const [selectValue, setSelectValue] = useState(null);
    const [text, setText] = useState('');
    const [currentValue, setCurrentValue] = useState('')
    const [placeholderValue, setPlaceholder] = useState(placeholder || 'กรุณาเลือก')

    useEffect(() => {
        if (!isEmpty(defaultValue) && !selectValue) {
            if (!dataList) return
            if (!dataList.length) return
            let select = dataList.find((item) => {
                return item[valueKey] == defaultValue
            })

            if (!select) return
            if (onPress) {
                onPress(select)
            }

            setCurrentValue(dataList)
            setUserSelect(select[titleKey])
            setSelectValue(select[valueKey]);
        } else if (selectValue && !defaultValue) {
            setUserSelect(null)
            setSelectValue(null);
        }
    }, [defaultValue, dataList])

    useEffect(() => {
        if (placeholder) {
            setPlaceholder(placeholder)
        } else {
            setPlaceholder('กรุณาเลือก')
        }
    }, [placeholder])

    function isEmpty(value) {
        return (typeof value === "undefined" || value === null);
    };

    // useEffect(() => {
    //     if (dataList && dataList.length) {
    //         setUserSelect(null);
    //         setSelectValue(null);
    //     }

    // }, [dataList])

    useEffect(() => {
        if (require && !isEmpty(selectValue)) {
            setIsError(false);
            setEerrorMessage('');
        }
    }, [userSelect])

    useEffect(() => {
        if (!require) {
            setIsError(false);
            setEerrorMessage('');
        }
    }, [require])

    const onPressModal = (event) => {
        setmodalVisible(event);
    };

    const onSelectDropDown = (item) => {
        setUserSelect(item.item[titleKey])
        setSelectValue(item.item[valueKey])
        setmodalVisible(false);
        if (onPress) {
            onPress(item.item)
        }
    };

    useImperativeHandle(ref, () => ({
        getInputValue() {
            return { isInvalid: validate(), value: selectValue, isChange: isChange(), title: titleDropdown };
        },
        resetValue() {
            if (defaultValue) {
                if (!dataList) return
                let select = dataList.find((item) => {
                    return item[valueKey] == defaultValue
                })
                if (!select) return
                if (onPress) {
                    onPress(select)
                }
                setUserSelect(select[titleKey]);
                setSelectValue(select[valueKey]);
            } else {
                setUserSelect(null);
                setSelectValue(null);
            }
        },
        clear() {
            setIsError(false);
            setEerrorMessage('');
            setText('');
            setUserSelect(null);
            setSelectValue(null);
        },
    }));

    const isChange = () => {
        if (isEmpty(selectValue) || isEmpty(defaultValue)) return false

        return selectValue != defaultValue
    };

    const validate = () => {
        if (require && isEmpty(selectValue) && !nullable) {

            setEerrorMessage(`${massageError}`);
            setIsError(true);
            return true
        }

        setIsError(false);

        return false
    };

    return (
        <View style={styles.contianer}>
            {
                TITLE ?
                    REQUIRETITLE ?
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>{titleDropdown}</Text>
                            <Text style={{ color: colors.redButton, paddingHorizontal: 5, fontSize: FONT_SIZE.LITTLETEXT }}>*</Text>
                        </View>
                        :
                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>{titleDropdown}</Text>
                    :
                    null
            }
            {
                children ?
                    <TouchableOpacity
                        onPress={() => onPressModal(true)}
                        disabled={disabled || selectDis}
                    >
                        {children}
                    </TouchableOpacity>
                    :
                    startStop ?
                        <>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ paddingRight: '3%', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, color: colors.primary, fontWeight: 'bold' }}>{titleDropdown}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => onPressModal(true)}
                                        style={[styles.selectBox, { backgroundColor: disabled ? colors.grayTable : colorBackground, height: height, width: '100%', paddingHorizontal: '5%' }]}
                                        disabled={disabled || selectDis}
                                    >
                                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                            <View style={{ marginRight: '5%', flex: 1 }}>
                                                <Text style={{ color: userSelect ? colors.black : colors.gray, fontSize: FONT_SIZE.LITTLETEXT }} numberOfLines={1}>{userSelect || placeholderValue}</Text>
                                            </View>
                                            <View>
                                                <Icon type="FontAwesome" name="angle-down" style={{ color: disabled ? colors.grayTable : colors.black }} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                        :
                        <TouchableOpacity
                            onPress={() => onPressModal(true)}
                            style={[styles.selectBox, { backgroundColor: disabled ? colors.grayTable : colorBackground, height: height }]}
                            disabled={disabled || selectDis}
                        >
                            <Text style={{ color: userSelect ? colors.black : colors.gray, fontSize: FONT_SIZE.LITTLETEXT }} numberOfLines={1}>{userSelect || placeholderValue}</Text>
                            <Icon type="FontAwesome" name="angle-down" style={{ color: disabled ? colors.grayTable : colors.black }} />
                        </TouchableOpacity>
            }
            <AlertDropdown
                data={dataList}
                onPressClose={onPressModal}
                onPressConfirm={onSelectDropDown}
                visible={modalVisible}
                titleKey={titleKey}
                titleAlert={titleAlert}
                textSearch={textSearch}
                NotFillter={NotFillter}
            />
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
    }
});

export default forwardRef(selectDropdown);

selectDropdown.PropsTypes = {
    titleDropdown: PropTypes.string,
    titleAlert: PropTypes.string,
    dataList: PropTypes.string,
    placeholder: PropTypes.string,
    textSearch: PropTypes.string,
}
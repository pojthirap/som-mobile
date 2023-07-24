import React, { useEffect, useState,useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';

import Button from './Button'
import TextInput from './TextInput'

import colors from '../utility/colors';
import { FONT_SIZE } from '../utility/enum';
import { getInputData } from '../utility/helper';

const SearchField = ({
                        textSearch = 'Search', 
                        heightBox = 50, 
                        SearchBarType = 'AutoSearch', 
                        widthSearchBox,
                        onPressSearch,
                        buttonHeigth = 50,
                        buttonWidth,
                        onChangeText,
                        SearchBarWidth,
                        maxLength = 250,
                    },ref) => { 

    const inputRef = useRef({});
    const [text, setText] = useState('');

    useImperativeHandle(ref, () => ({
        getInputValue(){
            let totalValue = getInputData(inputRef);
            return { isInvalid: totalValue.isInvalid, value: totalValue.data, isChange: totalValue.isChange};
        },
        clear() {
          setText('');
        },
      }));
    
    const onChange = (value) => {
        if (onChangeText) onChangeText(value)
        setText(value)
    }


    return (
        <View style={styles.container}>
            {SearchBarType === 'AutoSearchBar' ?
            <TextInput 
                style={[styles.inputbox, {fontSize: FONT_SIZE.TEXT, height: heightBox, fontFamily:'THSarabunNew'}]}
                placeholder = {textSearch}
                onChangeText={onChange}
                value={text}
            />
            :
            SearchBarType === 'SearchBarButton' ?
            <View style={styles.searchGroup}>
                <View style={{paddingRight: 5, width: SearchBarWidth, flex: 3.8/5}}>
                    <TextInput
                        ref={el => inputRef.current.name = el}
                        style={[styles.SearchBarButton, {fontSize: FONT_SIZE.TEXT, height: heightBox, fontFamily:'THSarabunNew',width : widthSearchBox}]}
                        placeholder = {textSearch}
                        onChangeText={onChange}
                        value={text}
                        maxLength={maxLength}
                    />
                </View>
                <View style={{marginTop: 30, flex: 1.2/5}}>
                    <Button
                        onPress={onPressSearch} 
                        title={'Search'}
                        typeIcon={'Ionicons'}
                        nameIcon={'search-outline'}
                        buttonHeigth={buttonHeigth}
                        IconSize = {FONT_SIZE.LITTLETEXT}
                        width={buttonWidth}
                    />
                </View>
            </View>
            :
            null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        minWidth: 100,
    },
    inputbox: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.grayborder,
        width: '100%',
        minWidth: 100,
        paddingHorizontal: 15,
        backgroundColor: colors.white,
        shadowRadius: 20,
        shadowOpacity: 1,
        shadowColor: colors.black,
        elevation: 4,
    },
    searchGroup: {
        flexDirection: 'row', 
        alignItems:'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    SearchBarButton: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.grayborder,
        // paddingRight: '3%',
        backgroundColor: colors.white,
        shadowRadius: 20,
        shadowOpacity: 1,
        shadowColor: colors.black,
        elevation: 4,
        marginRight: 5
    },
})

export default forwardRef(SearchField);
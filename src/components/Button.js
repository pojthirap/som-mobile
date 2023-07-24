import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types'
import { Icon } from 'native-base';

import Text from './Text';
import colors from '../utility/colors';
import { FONT_SIZE, STYLE_SIZE } from '../utility/enum';

const Button = ({   onPress, 
                    title, 
                    color = colors.primary, 
                    fontColor= 'white', 
                    width= '100%', 
                    colorBorder = colors.primary, 
                    typeIcon, 
                    nameIcon, 
                    IconColor = colors.white, 
                    IconSize = STYLE_SIZE.ICON_SIZE_SMALL,
                    buttonHeigth = STYLE_SIZE.BNT_HEIGTH,
                    textSize = FONT_SIZE.LITTLETEXT,
                    disabled = false,
                    backgroundDisable = colors.disabled,
                    fontColorDisable = colors.grayborder,
                    borderColorDisable = colors.grayborder,              
                }) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            disabled={disabled} 
            style={[styles.contraner, 
                {backgroundColor: disabled ? backgroundDisable : color || colors.primary, width, height:buttonHeigth},{borderColor: disabled? borderColorDisable : colorBorder}]}>
            <View style={{marginRight: '2%'}}>
                <Icon type={typeIcon} name={nameIcon} style={{color:IconColor, fontSize:IconSize}}/>
            </View>
            <Text style={{color: disabled ? fontColorDisable : fontColor, fontSize:textSize, fontWeight: "bold"}}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    contraner: {
        borderRadius: 10,
        borderWidth: 1, 
        minWidth: 70,
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'row',
    }
})

export default Button;

Button.propsTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    colorBorder: PropTypes.string,
    fontColor: PropTypes.string,
}

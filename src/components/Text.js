import React from 'react'
import { Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { FONT_SIZE } from '../utility/enum';
import colors from '../utility/colors';

const TextLable = (props) => {
    let baseFont = styles.medium;

    if (props.style && props.style.fontWeight) {
        baseFont = props.style.fontWeight === 'bold' ? styles.bold : styles.medium;
        props.style.fontWeight = 'normal'
    }

    return (
        <Text {...props} style={[styles.text, { ...props.style, fontSize: fontSizeCal(props.style?.fontSize) }, baseFont,]}>
            {props.children}
        </Text>
    )
}

const fontSizeCal = (fontSize = 18) => {
    if (fontSize >= FONT_SIZE.HEADER) return FONT_SIZE.TEXT;
    if (fontSize >= FONT_SIZE.TITLE) return FONT_SIZE.LITTLETEXT;
    if (fontSize >= FONT_SIZE.SUBTITLE) return FONT_SIZE.LITTLETEXT;
    if (fontSize >= FONT_SIZE.TEXT) return FONT_SIZE.TEXT;
    if (fontSize >= FONT_SIZE.LITTLETEXT) return FONT_SIZE.LITTLETEXT;
    if (fontSize >= FONT_SIZE.LITTLETEXT2) return FONT_SIZE.LITTLETEXT2;

    return FONT_SIZE.LITTLETEXT;
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'THSarabunNew',
        fontSize: FONT_SIZE.TEXT,
        color: colors.black
    },
    italic: {
        fontFamily: 'THSarabunNew-Italic',
    },
    bold: {
        fontFamily: 'THSarabunNew-Bold',
    },
    boldItalic: {
        fontFamily: 'THSarabunNew-BoldItalic',
    },
    medium: {
        fontFamily: 'THSarabunNew',
    },
});

export default TextLable;

TextLable.propsTypes = {
    fontWeight: PropTypes.number,
    fontSize: PropTypes.number,
    color: PropTypes.string,
    textAlign: PropTypes.string,
    numberOfLines: PropTypes.number
}
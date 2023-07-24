import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'native-base';

import Text from './Text';
import colors from '../utility/colors';
import { FONT_SIZE } from '../utility/enum';
import { validateInput } from '../utility/helper';
import language from '../language/th.json'

const Eng = /^[A-Za-z0-9]*$/;
const ThaiEn = /^[A-Za-zก-๙]*$/;
const Num = /^[0-9]*$/;
const NumToThree = /^[0-3]*$/;
const NotZero = /^[1-9][0-9]{0,9}$/;
const Other = /^[A-Za-z0-9ก-๙]*$/;
const RegexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NumSlash = /^[0-9/]*$/;
const ThaiEnNum = /^[A-Za-z0-9ก-๙ ]*$/;
const NumFullStop = /^[0-9.-]*$/;
const NumSpecial = /^[^<>{}\"/|;:.,~!?@#$%^=&*\\]\\\\()\\[¿§«»ω⊙¤°℃℉€¥£¢¡®©0-9_+]*$/;
const NumComma = /^(\d+,)*\d+$/;
const NumFloat = /^[+-]?([0-9,]+\.?[0-9]*|\.[0-9]+)$/;

const TextField = ({
  title,
  TITLE= true,
  REQUIRETITLE= false,
  heightBox = 50,
  fontSize = FONT_SIZE.LITTLETEXT,
  textSize = FONT_SIZE.LITTLETEXT,
  require = false,
  type = 'text',
  value = '',
  textInBox,
  editable = true,
  colorBox = colors.grayTable,
  minLength = 0,
  maxLength = 250,
  massageError = language.NOINPUT,
  typeKeyboard,
  fontColor = colors.black,
  labelDisplay = false,
  onChangeText,
  placeholder,
  multiline,
  comma,
  secureTextEntry = false,
  visiblePass,
  onPressVisiblePass,
  isOnlyText = false,
  addition = false,
  widthBox = null,
  vatNo = false
}, ref, props) => {
  const [text, setText] = useState(value);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setEerrorMessage] = useState('');
  const [isEditable, setIsEditable] = useState(editable);

  useEffect(() => {
    if(value != null || value != undefined){
      setText(value)
      setIsError(false)
    }

    // if(!value) {
    //   setEerrorMessage(`${massageError}`);
    //   setIsError(true);
    // }

  }, [value]);

  useEffect(() => {
    setIsEditable(editable)
  }, [editable])

  useImperativeHandle(ref, () => ({
    getInputValue() {
      return { isInvalid: validate(text), value: returnValue(), isChange: isChange(), title };
    },
    resetValue() {
      setText(value)
      setIsError(false);
      setEerrorMessage('');
    },
    clear() {
      setIsError(false);
      setEerrorMessage('');
      setText('');
    },
  }));

  const returnValue = () => {
    try {

      if (comma && text) {
        let result1 = text.toString().replace(/,/g, '')
        result1 = result1.trim()
        return `${result1}`
      }

      return text.trim()
    } 
    catch (error) {
      return text
    }

  };

  const isChange = () => {
    if (!text && !value) return false
    return text != value
  };

  const validate = () => {
    if (require && !text.trim()) {
      setEerrorMessage(`${massageError}`);
      setIsError(true);
      return true
    }

    if (type == "email" && text && !RegexEmail.test(text)) {
      setEerrorMessage(`${massageError}`);
      setIsError(true);
      return true
    }

    if (text.length < minLength) {
      setEerrorMessage(`ข้อมูลต้องไม่น้อยกว่า ${minLength} ตัวอักษร`);
      setIsError(true);
      return true
    }

    if(vatNo && (text.length != 13) && (text.length != 0)) {
      setEerrorMessage(`กรุณาระบุข้อมูลให้ครบถ้วน`);
      setIsError(true);
      return true
    }

    setIsError(false);

    return false
  };

  const onChange = (value) => {
    if (require && !value.trim()) {
      setEerrorMessage(`${massageError}`);
      setIsError(true);
    } else {
      setIsError(false);
      setEerrorMessage('');
    }

    if (onChangeText){
      if(!value) onChangeText(value)
      if(type === 'Num'){
        if(comma){
          if(NumComma.test(value)){
            onChangeText(value)
          }
        }else{
          if(Num.test(value)){
            onChangeText(value)
          }
        }
      }else{
        if(type != 'Num')
        onChangeText(value)
      }
    }
    if (value == '') return setText(value)
    if (type == 'EN' && !Eng.test(value)) return
    if (type == 'ThaiEn' && !ThaiEn.test(value)) return
    if (type == 'Num' && comma && !NumComma.test(value)) return
    if (type == 'Num' && !comma && !Num.test(value)) return
    if (type == 'NumToThree' && !NumToThree.test(value)) return
    if (type == 'Other' && !Other.test(value)) return
    if (type == 'NotZero' && !NotZero.test(value)) return
    if (type == 'NumSlash' && !NumSlash.test(value)) return
    if (type == 'ThaiEnNum' && !ThaiEnNum.test(value)) return
    if (type == 'NumFullStop' && !NumFullStop.test(value)) return
    if (type == 'NumSpecial' && !NumSpecial.test(value)) return
    if (type == 'NumFloat' && !NumFloat.test(value)) return
    if (type == 'NumFloat' || (value.includes('.') && type != 'email') && isOnlyText == false) {
      if (addition == true) {
        if (type == 'NumFloat' && value.includes('.')) {
          let fff = value.split('.')
          if (fff.length && fff[1].length > 2) return
        }
        else if (value.length > 7 ) return
      }
      if (addition == false) {
        if (type == 'NumFloat' && value.includes('.')) {
          let fff = value.split('.')
          if (fff.length && fff[1].length > 2) return
        }
        else if (value.length > 17 ) return
      }
      
    }
    // if (type == 'NumFloat' && value.includes('.')) {
    //   let fff = value.split('.')
    //   if (fff.length && fff[1].length > 2) return 
    // }
    setText(value)
  };

  function formatNumber(amount) {
    try {
      if (!comma) return amount
      if (!amount) return amount
      let rep = amount.replace(/,/g, '');
      if (comma && amount && !isNaN(rep)) {

        if (type == 'NumFloat' && !isNaN(rep)) {
          if (!isNaN(rep)) {
            return rep.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          }
        }
        if (!isNaN(rep)) return rep.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

        return amount
      }

      return amount

    } catch (e) {
      return amount
    }
  };


  return (
    <View style={styles.contraner}>
      {TITLE? 
        REQUIRETITLE ?
          <View style={{flexDirection: 'row'}}>
            <Text style={{ fontSize }}>{title}</Text>
            <Text style={{color: colors.redButton, paddingHorizontal: 5, fontSize: fontSize}}>*</Text>
          </View>
        :
        <Text style={{ fontSize }}>{title}</Text>
        :
        null
      }
      {
        labelDisplay ?
          <View style={[styles.inputboxDisplay, {height: heightBox, justifyContent: 'center', backgroundColor : colorBox}]}>
            <Text>{text}</Text>
          </View>
          :
          <View>
            <TextInput
              {...props}
              style={[styles.inputbox,{backgroundColor: isEditable ? colors.white : colorBox },
                    {fontSize: textSize, height: heightBox, fontFamily:'THSarabunNew', color : fontColor, width: widthBox }]}
              placeholder = {placeholder || textInBox}
              onChangeText={onChange}
              editable={isEditable}
              value={formatNumber(text)}
              maxLength={maxLength}
              keyboardType={typeKeyboard}
              multiline={multiline || false}
              secureTextEntry={secureTextEntry}
            />
            {
              onPressVisiblePass ?
                <View style={{ position: 'absolute', top: 15, right: 20}}>
                  {
                    secureTextEntry == true ?
                    <TouchableOpacity onPress={() => onPressVisiblePass()}  style={{}} >
                      <Icon type="MaterialCommunityIcons" name="eye"style={{fontSize:FONT_SIZE.SUBTITLE}}/> 
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => onPressVisiblePass()}  style={{}} >
                      <Icon type="MaterialCommunityIcons" name="eye-off"style={{fontSize:FONT_SIZE.SUBTITLE}}/> 
                    </TouchableOpacity>
                  }
                </View>
                : 
              null
            }
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
    </View>
  );
};

const styles = StyleSheet.create({
    contraner: {
        borderRadius: 10,
        width: '100%',
        minWidth: 100 
    },
    inputbox: {
        borderRadius: 10, 
        borderWidth: 1,
        borderColor: colors.grayborder,
        minWidth: 100,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginTop: 5,
    },
    inputboxDisplay: {
      borderRadius: 10, 
      borderWidth: 1,
      borderColor: colors.grayborder,
      minWidth: 100,
      paddingVertical: 5,
      paddingHorizontal: 15,
      marginTop: 5,
    },
});

export default forwardRef(TextField);

TextField.propsTypes = {
  title: PropTypes.string,
};

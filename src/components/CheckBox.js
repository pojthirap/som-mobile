import React, {useEffect, useState,useImperativeHandle, forwardRef} from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon, View } from 'native-base'
import Text from './Text'
import colors from '../utility/colors'
import { FONT_SIZE, STYLE_SIZE } from '../utility/enum';

const CheckBox = ({Size = STYLE_SIZE.ICON_SIZE_SMALL, 
                   SelectDefault = false ,
                   colorCheckBox = colors.primary, 
                   colorUnCheckBox = colors.gray, 
                   type, 
                   title = '',
                   paddingText = '3%',
                   textSize = FONT_SIZE.LITTLETEXT,
                   textColor = colors.black,
                   onPress,
                   typeSelect = 'singleSelect',
                   data,
                   disabled = false,
                   disableType,
                   onPressStatus
                },ref) => {

    const [isSelect , setIsSelect] = useState(SelectDefault);

    // useImperativeHandle(ref, () => ({
    //     getData() {
    //         return { isInvalid: false, value: isSelect };
    //     },
    //     clearValue() {
    //         setIsSelect(SelectDefault);
    //     },
    //     clearValidate() {
    //     },
    //     setData(data) {
    //         setIsSelect(data);
    //     }
    // }));


    useEffect(() => {
        setIsSelect(SelectDefault)
    },[SelectDefault])

    const onSelect = () => {
        if(isSelect === false){
            setIsSelect(true)
            if (onPress) onPress(data || title)
            if (onPressStatus) return onPressStatus(true)
        }else{
            setIsSelect(false)
            if (onPress) onPress(data || title)
            if (onPressStatus) return onPressStatus(false)
        }  
    }

    return(
        <>
    {disabled ? 
        disableType === 'disable' ?
        <View>
            <Icon  type='MaterialCommunityIcons' name='checkbox-blank' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
        </View>
        :
        disableType === 'view' ?
        <View>
            <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
        </View>
        :
        disableType === 'viewDisable' ?
        <View>
            <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
        </View>
        :
        <>
        </>
        :
         <TouchableOpacity onPress={onSelect}>
         {type ?
             type === 'start' ?
             <View style={{flexDirection:'row'}}>
                 <View style={{alignSelf:'center'}}>
                     <Text style={{paddingRight: paddingText, fontSize: textSize, color: textColor}}>{title}</Text>
                 </View> 
                 { typeSelect === 'singleSelect' ?
                     SelectDefault ? 
                         <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                     :
                         <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                     :
                     typeSelect === 'multiSelect' ?
                     isSelect ?
                         <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                     :
                         <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                     :
                     SelectDefault ? 
                         <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                     :
                         <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                 }
             </View>
         :
         type === 'end' ?
             <View style={{flexDirection:'row'}}>
                 { typeSelect === 'singleSelect' ?
                     SelectDefault ? 
                         <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                     :
                         <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                     :
                     typeSelect === 'multiSelect' ?
                     isSelect ?
                         <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                     :
                         <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                     :
                     SelectDefault ? 
                         <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                     :
                         <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                 }
                 <View style={{alignSelf:'center'}}>
                     <Text style={{paddingLeft: paddingText, fontSize: textSize, color: textColor}}>{title}</Text>
                 </View> 
             </View>
         :
         <View>
             { typeSelect === 'singleSelect' ?
                 SelectDefault ? 
                     <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                 :
                     <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                 :
                 typeSelect === 'multiSelect' ?
                 isSelect ?
                     <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                 :
                     <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                 :
                 SelectDefault ? 
                     <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                 :
                     <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
             }
                 
         </View>
         :
         <View>
             { typeSelect === 'singleSelect' ?
                 SelectDefault ? 
                     <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                 :
                     <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                 :
                 typeSelect === 'multiSelect' ?
                 isSelect ?
                     <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                 :
                     <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
                 :
                 SelectDefault ? 
                     <Icon  type='MaterialCommunityIcons' name='checkbox-marked' style = {{fontSize:Size, color: colorCheckBox,alignSelf:'center'}}/>
                 :
                     <Icon  type='MaterialCommunityIcons' name='checkbox-blank-outline' style = {{fontSize:Size, color: colorUnCheckBox,alignSelf:'center'}}/>
             }
                 
         </View>
         }
     </TouchableOpacity>
        }
        </>
        )
}

// export default  forwardRef(CheckBox);
export default CheckBox;
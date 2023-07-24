import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,ActivityIndicator,TextInput } from 'react-native';
import { Checkbox,RadioButton } from 'react-native-paper';
import { Text,SelectDropdown,Modal,Table,CheckBox,TextInput as CTextInput,ModalWarning } from '../../components'

import colors from '../../utility/colors';

function CardItem (props){
    const [list,setList] =useState(props.list);
    const addCommas = (nStr) =>
        {
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }
    const renderList = ({item,index}) =>{
        return <View >
            <CTextInput style={{fontSize:18,backgroundColor:'white',textAlign:'center',width:150,borderWidth:0.5,borderRadius:5,marginTop:0}} onChangeText={text=>{
                   if(text.charAt(0) != 0){
                    list[index].recordStockCard.recQty = text
                    props.onChange(list)
                    setList(list)
                    return
                   }
                   if(text.charAt(0) === '0' && text.toString().length == 1){
                    list[index].recordStockCard.recQty = text
                    props.onChange(list)
                    setList(list)
                    return
                   }
                 
                    
                        // if(item.msProductConversion.altUnit === 'L' || item.msProductConversion.altUnit === 'L86' && text.charAt(0) == '0' && list[index].recordStockCard.recQty.length == 0 ) list[index].recordStockCard.recQty = text
                        // if(item.msProductConversion.altUnit != 'L' || item.msProductConversion.altUnit != 'L86') list[index].recordStockCard.recQty = text
                        // props.onChange(list)
                        // setList(list)
                 
            }}
            // type={'NotZero'}
            comma={true}
            // value={ list[index].recordStockCard.recQty}
            maxLength={6} typeKeyboard="numeric" value={list[index].recordStockCard.recQty ? list[index].recordStockCard.recQty : '0'}/>
         </View>
    }
    return <View>
    <FlatList
     data={list}
     extraData={list}
     renderItem={(template)=> renderList(template) }
    />
    </View>
}

export default CardItem;
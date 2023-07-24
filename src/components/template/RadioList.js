import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,ActivityIndicator,TextInput } from 'react-native';
import { Checkbox,RadioButton } from 'react-native-paper';
import { Text,SelectDropdown,Modal,Table,CheckBox } from '../../components'
import colors from '../../utility/colors';
function RadioList (props){
    const [list,setList] =useState(props.list);
    const renderList = ({item,index}) =>{
        return <View style={{flexDirection:'row'}}>
        <RadioButton
        status={ item.val === 'Y' ? 'checked' : 'unchecked' }
        disabled={props.disable}
        color={colors.primary}
        onPress={() => {
            let results = list
            results = list.map((val,objIndex)=>{
                if(objIndex == index) val.val = "Y"
                else val.val = "N"
                return val
            })

            props.onChange(results)
            setList(results)
        }}
        />
    <Text style={{marginLeft:10,fontSize:30}}>{item.ans}</Text>
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
export default RadioList;
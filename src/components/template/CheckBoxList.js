import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,ActivityIndicator,TextInput } from 'react-native';
import { Checkbox,RadioButton } from 'react-native-paper';
import { Text,SelectDropdown,Modal,Table,CheckBox } from '..'
import colors from '../../utility/colors';
function CheckBoxList (props){
    const [list,setList] =useState(props.list);
    const renderList = ({item,index}) =>{
        return <View style={{flexDirection:'row'}}>
         <Checkbox
              status={ item.val === 'Y' ? 'checked' : 'unchecked' }
              color={colors.primary}
              disabled={props.disable}
              onPress={() => {
                let results = list
                results = list.map((val,objIndex)=>{
                    if(objIndex == index ){
                       if(val.val === "Y"){
                        val.val = "N"
                       }else{
                        val.val = "Y"
                       }
                    }
                    return val
                })
                results = results.map(result=>{
                    if(result.val === 'N') result.val = null
                    return result
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
export default CheckBoxList;
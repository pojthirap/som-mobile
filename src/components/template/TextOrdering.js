import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,ActivityIndicator,TextInput } from 'react-native';
import { Checkbox,RadioButton } from 'react-native-paper';
import { Text,SelectDropdown,Modal,Table,CheckBox } from '..'
import colors from '../../utility/colors';
import { FONT_SIZE } from '../../utility/enum';

function TextOrdering (props){
    const [list,setList] =useState(props.list);
    const [val,setVal] =useState([]);
    useEffect(()=>{
        let arr = []
         props.list.map((result,index)=>{
             arr.push({val:`${index+1}`,title:`${index+1}`})
         })
        setVal(arr);
    },[])
    const onClick =(index,val)=>{
        // let res = list.find(obj=>obj.val === val.val)
        // if(!res){
        //     list[index].val = val.val
        //     props.onChange(list)
        //     setList(list)
        // }
        list[index].val = val.val
        setNewArr(list)
        props.onChange(list)
        setList(list)
        setNewArr(list)
       
    }
    const setNewArr = () =>{
        //setVal()
        let arr = []
        list.map((result,index)=>{
            let res = list.find(obj=>obj.val === `${index+1}`)
            if(!res)
            arr.push({val:`${index+1}`,title:`${index+1}`})
        })
       setVal(arr);
    }
    const removeVal = (index) =>{
        list[index].val = null;
        setNewArr(list);
        props.onChange(list)
        setNewArr(list)
    }
    const renderList = ({item,index}) =>{
        return <View style={{flex:0.5,marginTop:10,marginLeft:10}}>
           
   
    <View >
        {/* {props.disable ? <TextInput style={{fontSize:20,marginTop:10}}  onChangeText={text => {
               list[index].val = text
               props.onChange(list)
               setList(list)
            }}>{item.val}</TextInput> : <View style={{marginTop:20,marginBottom:20}}></View> } */}
              <View  style={{flexDirection:'row'}}>
              {item.val ? <View style={[styles.selectBox]}>
                   <View style={{flex:0.9,alignItems:'center'}}>
                   <Text>{item.val}</Text>
                       </View>
                       <TouchableOpacity style={{flex:0.2,alignItems:'center'}} onPress={()=>removeVal(index)}>
                       <Image source={require('../../assets/images/empty-tash-can.png')} style={{width:20,height:20,tintColor:'black'}}/>
                       </TouchableOpacity>
               
               </View> : <View style={{width:150}}>
               <SelectDropdown 
                                 titleAlert={'กรุณาเลือก'}
                                 titleDropdown= {'กรุณาเลือก'} 
                                 dataList= {val}
                                 titleKey={'title'}
                                 valueKey={'val'}
                                 onPress={(e)=>onClick(index,e)}
                                 require
                                 NotFillter
                                 TITLE={false}
                                defaultValue={item.val}
                                disabled={!props.disable}
                            />
                   </View>}
                   <Text style={{fontSize:35,marginLeft:10,fontSize:30,marginTop:10,marginLeft:10}}>{item.ans}</Text>
                  </View>
                 
        </View>
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
        width: 150
    }
});
export default TextOrdering;
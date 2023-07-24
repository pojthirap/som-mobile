import React, {useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions } from 'react-native';
import { Text, Modal,SelectDropdown,Table,CheckBox,TextInput as CTextInput } from '../../components'
import { getMasterDataForTemplateSa } from '../../actions/TemplateSaAction'
function LovItem(props) {
    const {data,isEdit} = props;
    const [list,setList] = useState([]);
    const [ans ,setAns] = useState(null);
    const inputRef = useRef({});
    useEffect(()=>{
        getItem();
    },[])
    const getItem = async () =>{
        const res = await getMasterDataForTemplateSa(`${data.ansLovType}`);
        const obj = res.find(lov=>lov.code === data.titleColmAns)
        setAns(obj)
        setList(res)

    }
    return (
        <View >
            {isEdit ?    <SelectDropdown 
                                    REQUIRETITLE= {false}
                                    titleDropdown= {props.title} 
                                    TITLE={false}
                                    titleAlert= {props.title} 
                                    dataList= {list}
                                    titleKey={'description'}
                                    valueKey={'code'}
                                    defaultValue={ans ? ans.code : ''}
                                    require= {true}
                                    onPress={(val)=>props.onChange(val)}/>
                                     :   
                                     <View  style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
                                          <Text style={{fontSize:35,marginTop:10}}>{ans ? ans.description : ''}</Text>
                                         </View>
                                     }
          
        </View>
    );  
}
export default LovItem;
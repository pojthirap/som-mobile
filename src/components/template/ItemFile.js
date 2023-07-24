import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,ActivityIndicator,TextInput } from 'react-native';
import { Checkbox,RadioButton } from 'react-native-paper';
import { Text,SelectDropdown,Modal,Table,CheckBox } from '../../components'
import colors from '../../utility/colors';
import { baseUrl } from '../../api/Axios';
const {width,height} = Dimensions.get('window')
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadFile} from '../../actions/AppForm'
import DocumentPicker from 'react-native-document-picker'

function ItemFile (props){
    const [list,setList] =useState(props.list);
    const [cate,setCate] = useState(null);
    const [isLoad,setIsLoad] = useState(false)
    const [isShowPopup,setIsShowPopup] = useState(false);

      const renderList = ({item,index}) =>{
        const file = item.file ? item.file :  props.files.find(file=>file.recAppFormFileId === parseInt(item.val))
        if(file)
          return (
            <View style={{flexDirection:'row',width:width*0.4,marginLeft:5,marginRight:10,borderRadius:10,borderColor:'black',borderWidth:1,marginBottom:10,padding:10}}>
                <Image source={require('../../assets/images/downloadFile.png')} style={{flex:0.2,width:30,height:30,marginTop:5,marginRight:20}} resizeMode="contain"/>
                 <Text style={{flex:0.8,fontSize:30,color:'black',marginTop:5}}>{file ? file.fileExt ? `${file.fileName}.${file.fileExt}` : `${file.fileName}` : ''}</Text>
                 <TouchableOpacity style={{flex:0.2,color:'black',marginTop:5}} onPress={()=>{
                        let lists = [...list]
                        if(lists.length==1){
                          lists[0] = {ans:null,val:null,file:null}
                       }else{
                        lists.splice( index, 1 );
                       }
                        setList(lists)
                        props.onChange(lists)
             }}>
                    <Image source={require('../../assets/images/empty-tash-can.png')} style={{width:30,height:30,tintColor:'black'}}/>
                 </TouchableOpacity>
             </View>
          )
          return (<View>
           
          </View>)
      }
      const convertImage = (url) =>{
          if( url && url.includes('getFile')) return `${baseUrl}${url.substring(1)}`
           return url
      }
      const addFile = async () =>{
        let lists = [...list]
        try {
            const res = await DocumentPicker.pickSingle({
              type: [DocumentPicker.types.allFiles],
            })
            let obj = {fileName:res.name,fileExt:''}
            const file = await uploadFile(res.uri,res.type,res.name,'N')
            if(!lists[0].val) lists[0] = {ans:'',val:`${file.fileId}`,valExt1:null,file:obj}
            else lists.push({ans:'',val:`${file.fileId}`,valExt1:null,file:obj})
            setList(lists)
            props.onChange(lists)
          } catch (err) {
            
          }
        
        
      }
      const onPressModal = async () =>{
        setIsShowPopup(false)
        let lists = [...list]
        try {
            const res = await DocumentPicker.pickSingle({
              type: [DocumentPicker.types.allFiles],
            })
            let obj = {fileName:res.name,fileExt:''}
            const file = await uploadFile(res.uri,res.type,res.name,'N')
            if(!lists[0].val) lists[0] = {ans:'',val:`${file.fileId}`,valExt1:`${cate.attachCateId}`,file:obj}
            else lists.push({ans:'',val:`${file.fileId}`,valExt1:`${cate.attachCateId}`,file:obj})
            setList(lists)
            props.onChange(lists)
          } catch (err) {
            
          }
      }
      return <View>
      <FlatList
       data={list}
       extraData={list}
       renderItem={(template)=> renderList(template) }
       ListHeaderComponent={()=>{
           return <TouchableOpacity disabled={!props.disable} style={{marginLeft:20,marginBottom:20}} onPress={()=> addFile()}>
                    <Text style={{color:colors.primary,fontSize:30}}>+ อัพโหลดไฟล์</Text>
               </TouchableOpacity>
       }}
       ListFooterComponentStyle={()=>{
        return <View style={{marginTop:10}}>
                {isLoad && <ActivityIndicator 
              animating={true}
              size="large" 
              color={colors.primary}/>}
            </View>
    }}
      />
      <Modal
            visible={isShowPopup}
            onPressCancel={()=>{
              setCate(null)
              setIsShowPopup(false)
            }}
            onPressConfirm={onPressModal}
            title = {'ประเภทรูปภาพ'}
            TWOBUTTON={true}
            cancelText ={'Close'}
            confirmText ={'Confirm'}
            cancelTextColor ={colors.primary}
            cancelButtonColor = {colors.white}
            confirmButtonColor = {colors.primary}
            confirmTextColor = {colors.white}
            disabledUplodeButton={!cate}
            >
              <View style={{padding:10,marginBottom:30}}>
                   <SelectDropdown 
                            titleAlert={''}
                            titleDropdown={''}
                            dataList= {props.cates}
                            titleKey={'attachCateNameTh'}
                            valueKey={'attachCateId'}
                            onPress={(e)=>setCate(e)}
                            NotFillter
                        />
              </View>
              </Modal>
   </View>
  }
  export default ItemFile;
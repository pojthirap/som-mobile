import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,ActivityIndicator,TextInput } from 'react-native';
import { Checkbox,RadioButton } from 'react-native-paper';
import { Text,SelectDropdown,Modal,Table,CheckBox } from '..'
import colors from '../../utility/colors';
import { baseUrl } from '../../api/Axios';
const {width,height} = Dimensions.get('window')
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadFile} from '../../actions/TemplateSaAction'
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

function ImageSaForm (props){
  let options = {
    title: `Meter${new Date().getTime()}`,
    includeBase64: true,
    maxWidth: 600,
    maxHeight: 600,
    quality: 1,
    mediaType: "photo",
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };
    const {files,values} = props
    const [images,setImages] = useState(values ? values.split(',') : []);
    const renderList = ({item,index}) =>{
       const image = files.find(file=>file.recSaFormFileId === parseInt(item))
        return (
          <View  style={{margin:10}}>
              <Image source={{uri:convertImage(image)}} style={{width:width*0.45,height:height*0.2,borderRadius:10,borderWidth:0.2}} resizeMode={'stretch'} />
           <TouchableOpacity style={{position:'absolute',left:width*0.4,top:10}} onPress={()=>{
               let lists = [...images]
               lists.splice( index, 1 );
               setImages(lists)
               props.onChange(lists)
           }}>
             <Image source={require('../../assets/images/empty-tash-can.png')} style={{width:30,height:30,tintColor:'grey'}}/>
           </TouchableOpacity>
        </View>
        )
    }
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Cool Photo App Camera Permission",
            message:
              "Cool Photo App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        } else {

        }
      } catch (err) {
        console.warn(err);
      }
    };  

    const resizeImage = async (path) => {
      let imgRes = await ImageResizer.createResizedImage(path, 700, 700, 'JPEG', 70, 0, );
      let base64 = await RNFS.readFile(imgRes?.uri, 'base64');
      if (base64)return 'data:image/png;base64,'+base64
  }

    const addImage = async () =>{
      requestCameraPermission();
      let lists = [...images]
        launchCamera(options, async (response)=>{
          if(response && response.assets[0]){
             // setImgLoad(true);
              let source = 'data:image/png;base64,'+response.assets[0].base64;
              const res = await uploadFile(response.assets[0].uri,'image/jpeg','.jpg','Y')
              let rez = await resizeImage(source)
              lists.push(`${res.fileId}`)
              files.push({recSaFormFileId:res.fileId,fileUrl:rez})
              setImages(lists)
               props.onChange(lists)
          }
      })
    }
    const convertImage = (url) =>{
        if( url && url.fileUrl.includes('getFile')) return `${baseUrl}/${url.fileUrl.substring(1)}`
        return url ? url.fileUrl : ''
     }
    return <View>
        <FlatList
     data={images}
     extraData={images}
     numColumns={2}
     renderItem={(template)=> renderList(template) }
     ListHeaderComponent={()=>{
         return <TouchableOpacity style={{marginLeft:20,marginBottom:20}} onPress={()=> addImage()}>
                  <Text style={{color:colors.primary,fontSize:30}}>ถ่ายภาพ</Text>
                <Image source={require('../../assets/images/ic_choose_camera.png')} style={{width:100,height:100}}/>
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
    </View>
}
export default ImageSaForm;
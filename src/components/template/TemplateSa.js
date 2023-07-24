import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions } from 'react-native';
import { Icon } from 'native-base'
import RNFetchBlob from 'rn-fetch-blob'

import colors from '../../utility/colors';
import { Text, Modal,SelectDropdown,Table,CheckBox,TextInput as CTextInput } from '../../components'
import { FONT_SIZE } from '../../utility/enum';
import { ScrollView } from 'react-native-gesture-handler';
import dayjs  from 'dayjs';
import 'dayjs/locale/th'
// const localizedFormat = require('dayjs/plugin/localizedFormat')
// dayjs.extend(localizedFormat)
// dayjs.locale('TH')
import { baseUrl } from '../../api/Axios';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
const {width,height} = Dimensions.get('window')
import ImageView from 'react-native-image-view';

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

import LovItem from './LovItem'
function Normal(props) {
  const inputRef = useRef({});
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);
    const selectImage = (index) =>{
      //props.data.listFile.find(file=>file.fileId === parseInt(item))
      let images = props.data.title.filter(obj=>obj.ansValType === 4);
      images = images[0].titleColmAns.split(',')
      images = images.map(image=>{
        const url =  props.data.listFile.find(file=>file.fileId === parseInt(image))
        return {source: {
            uri: `${baseUrl}/${url.fileUrl.substring(1)}`,
        }}
    })
    setIsVisible(true)
    setImageIndex(index)
    setImageList(images)
    }
    const itemImage = ({item,index}) =>{
        const image =  props.data.listFile.find(file=>file.fileId === parseInt(item))
        return <TouchableOpacity style={{width:width*0.4,marginLeft:5,marginRight:10}} onPress={()=>selectImage(index)}>
           <Image source={{uri:`${baseUrl}/${image.fileUrl.substring(1)}`}} style={{width:width*0.4,height:height*0.2,borderRadius:10}} resizeMode={'stretch'} />
        </TouchableOpacity>
    }
   
    const onPressCap = () => {
      inputRef.viewShot.capture().then(uri => {
        callbackCap(uri)
      });
      
    }
    const callbackCap = (dataURL) => {
      if (dataURL) {
        const shareOptions = {
          type: 'image/jpg',
          title: '',
          url: dataURL,
        };
        Share.open(shareOptions)
          // .then(res => console.log(res))
          // .catch(err => console.error(err));
      }
    };
    
    const onShare = () => {
      callback(imageList[imageIndex].source.uri)
    }
    const callback = (dataURL) => {
      let imagePath = null;

      if (dataURL) {
        const fs = RNFetchBlob.fs;

        RNFetchBlob.config({
          fileCache: true
        })
          .fetch("GET", dataURL)
          // the image is now dowloaded to device's storage
          .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile("base64");
          })
          .then(base64Data => {
            // here's base64 encoded image
            // remove the file from storage

            const shareOptions = {
              type: 'image/jpg',
              title: '',
              url: 'data:image/png;base64,'+base64Data,
            };
            Share.open(shareOptions)
              // .then(res => console.log(res))
              // .catch(err => console.error(err));

            return fs.unlink(imagePath);
          });

      }
    };
    const renderImage = (value) =>{
       return <FlatList 
        data={value}
        numColumns={2}
        renderItem={(image)=> itemImage(image) }
        />
    }
    const renderList = ({item,index}) =>{
        const {ansValType,ansLovType} = item;
        // 1 freetext 2 number   3 Calendar 4 Image 5 GPS 6 LOV 1 
        if(ansValType === 1){
        return <View style={{flex:1}}>
        <View >
        <Text style={{fontSize:35,marginTop:10}}>{item.titleColmNo}. {item.titleNameTh}</Text> 
        </View>
        <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
        <Text style={{fontSize:35,marginTop:10}}>{item.titleColmAns}</Text> 
        </View>
          </View>
        }
        if(ansValType === 2){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{item.titleColmNo}. {item.titleNameTh}</Text> 
            </View>
            <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
            <Text style={{fontSize:35,marginTop:10}}>{item.titleColmAns}</Text> 
            </View>
              </View>
            }
            if(ansValType === 3){
                return <View style={{flex:1}}>
                <View >
                <Text style={{fontSize:35,marginTop:10}}>{item.titleColmNo}. {item.titleNameTh}</Text> 
                </View>
                <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
                <Text style={{fontSize:35,marginTop:10}}>{item.titleColmAns}</Text> 
                </View>
                  </View>
                }
                if(ansValType === 4){
                    const images = item.titleColmAns.split(',')
                    return <View style={{flex:1}}>
                    <View >
                    <Text style={{fontSize:35,marginTop:10}}>{item.titleColmNo}. {item.titleNameTh}</Text> 
                    </View>
                    <View style={{marginTop:10}}>
                        {renderImage(images)}
                    </View>
                      </View>
                    }
                    if(ansValType === 5){
                        return <View style={{flex:1}}>
                        <View >
                        <Text style={{fontSize:35,marginTop:10}}>{item.titleColmNo}. {item.titleNameTh}</Text> 
                        </View>
                        <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
                        <Text style={{fontSize:35,marginTop:10}}>{item.titleColmAns}</Text> 
                        </View>
                          </View>
                        }
                        if(ansLovType){
                            return <View style={{flex:1}}>
                            <View >
                            <Text style={{fontSize:35,marginTop:10}}>{item.titleColmNo}. {item.titleNameTh}</Text> 
                            </View>
                            <View>
                              <LovItem data={item}/>
                            </View>
                              </View>
                        }
        // if(ansValType === 1){
        //     return <View style={{flex:1}}>
        //     <View >
        //     <Text style={{fontSize:35,marginTop:10}}>{item.titleNameTh}</Text> 
        //     </View>
        //     <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
        //     <Text style={{fontSize:35,marginTop:10}}>{item.titleColmAns}</Text> 
        //     </View>
        //       </View>
        // }
         
        // }
        // if(ansValType === 2){
        //     return <View style={{flex:1}}>
        //     <View >
        //     <Text style={{fontSize:35,marginTop:10}}>{item.titleNameTh}</Text> 
        //     </View>
        //     <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
        //     <Text style={{fontSize:35,marginTop:10}}>{item.titleColmAns}</Text> 
        //     </View>
            
        //       </View>
        // }
        // if(ansValType === 3){
        //     return <View style={{flex:1}}>
        //     <View >
        //     <Text style={{fontSize:35,marginTop:10}}>{item.titleNameTh}</Text> 
        //     </View>
        //     <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
        //     <Text style={{fontSize:35,marginTop:10}}>{dayjs(item.titleColmAns).format('DD/MM/YYYY')}</Text> 
        //     </View>
            
        //       </View>
        // }
   
    }
    return (
        <Modal
                visible={props.show}
                closeHeaderButton={false}
                onPressCancel={()=>props.onPressCancel()}
                onPressConfirm={()=>{}}
                title = {'โครงการ'}
                TWOBUTTON={false}
                containerWidth="100%"
                >
                     <ImageView
                images={imageList}
                imageIndex={imageIndex}
                isVisible={visible}
                onClose={()=>
                    {
                    setImageIndex(0)
                    setIsVisible(false)
                    setImageList([])
                    }}
                renderFooter={(currentImage) => ( <TouchableOpacity style={{alignSelf:'center',marginTop:40,marginBottom:40,backgroundColor:colors.primary,padding:15,borderRadius:10,marginLeft:20}} onPress={()=>  onShare()}>
                <Text style={{marginLeft:width*0.1,marginRight:width*0.1,fontSize:30,color:'white',fontWeight:'bold'}}>Share</Text>
        </TouchableOpacity>)}
            />
                {props.data && <ScrollView style={{height:height*0.8}}>
                <ViewShot 
                  ref={el => inputRef.viewShot = el}
               options={{ format: "jpg", quality: 0.9 }} captureMode="mount" style={{backgroundColor:'white',padding:30}}>
                <Text style={{fontSize:FONT_SIZE.TITLE, fontWeight:'bold',marginTop:10}}>{`${props.nameProject}`}</Text>
                <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:35,marginTop:10}}>โดย :  </Text> 
                <Text style={{fontSize:35,marginTop:10}}>{props.userBy}</Text>  
                </View>
                <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:35,marginTop:10}}>Last Update :  </Text> 
                <Text style={{fontSize:35,marginTop:10,color:colors.primary}}>{dayjs(props.data.form.updateDtm).locale('th').format('D MMMM BBBB')}</Text>  
                </View>
                
                <View style={{flexDirection:'row',marginTop:10}}>
                <FlatList 
                    data={props.data.title}
                    renderItem={(template)=> renderList(template) }
                    />

                    {/* <View style={{flex:0.5}}>
                            <Image source={require('../../assets/images/bg_darft.png')} style={{marginRight:10,width:width*.4,borderRadius:10}}/>
                    </View>
                    <View style={{flex:0.5}}>
                            <Image source={require('../../assets/images/bg_darft.png')} style={{marginLeft:20,width:width*.4,borderRadius:10}}/>
                    </View>
                    </View>
                    <View style={{flexDirection:'row',marginTop:10,padding:10}}>
                    <View style={{flex:0.5}}>
                            <Image source={require('../../assets/images/bg_darft.png')} style={{marginRight:10,width:width*.4,borderRadius:10}}/>
                    </View>
                    <View style={{flex:0.5}}>
                            <Image source={require('../../assets/images/bg_darft.png')} style={{marginLeft:20,width:width*.4,borderRadius:10}}/>
                    </View> */}
                    </View>
                    </ViewShot>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',marginRight:20}}>
                        <TouchableOpacity style={{alignSelf:'center',marginTop:40,marginBottom:40,backgroundColor:colors.gray,padding:15,borderRadius:10}} onPress={()=>props.onPressCancel()}>
                            <Text style={{marginLeft:width*0.1,marginRight:width*0.1,fontSize:30,color:'white',fontWeight:'bold'}}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignSelf:'center',marginTop:40,marginBottom:40,backgroundColor:colors.primary,padding:15,borderRadius:10,marginLeft:20}} onPress={()=>  onPressCap()}>
                            <Text style={{marginLeft:width*0.1,marginRight:width*0.1,fontSize:30,color:'white',fontWeight:'bold'}}>Share</Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>}
         
                 
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },});
export default Normal;

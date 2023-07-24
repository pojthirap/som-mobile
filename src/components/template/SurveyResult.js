import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,Modal as ModalJS, Alert } from 'react-native';
import colors from '../../utility/colors';
import { Text, Modal,SelectDropdown,Table,TextInput as CTextInput } from '../../components'
import { FONT_SIZE } from '../../utility/enum';
import { ScrollView } from 'react-native-gesture-handler';
import dayjs  from 'dayjs';
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('TH')
import { Checkbox,RadioButton } from 'react-native-paper';

import { baseUrl } from '../../api/Axios';
const {width,height} = Dimensions.get('window')
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import ImageView from 'react-native-image-view';
import RNFetchBlob from 'rn-fetch-blob'

function Normal(props) {
    
    const inputRef = useRef({});
    const [visible, setIsVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [imageList, setImageList] = useState([]);

    useEffect(()=>{

    })
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
    const showImageView = (index) =>{
        let forms = props.data.objForm[0].appForm.filter(form=>form.ansType ==="6");
        let images = forms[0].ansVal.map(val=>val.val);
        
        images = images.map(image=>{
            const url =  props.data.listFile.find(file=>file.recAppFormFileId === parseInt(image))
            if(url){
              return {source: {
                  uri: `${baseUrl}${url.fileUrl}`,
              }}
            }
            return null
          
        })
        images = images.filter(image=>image)
        setIsVisible(true)
        setImageIndex(index)
        setImageList(images)
    }
    const checkPermission = async (file) => {
 
        if (Platform.OS === 'ios') {
          downloadFile(file);
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission Required',
                message:
                  'Application needs access to your storage to download File',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Start downloading
              downloadFile(file);
            } else {
              // If permission denied then show alert
              Alert.alert('Error','Storage Permission Not Granted');
            }
          } catch (err) {
            // To handle permission related exception
          }
        }
      };
      const downloadFile = (file) => {
   
        // Get today's date to add the time suffix in filename
        let date = new Date();
        // File URL which we want to download
        // fliex example http://www.africau.edu/images/default/sample.pdf
        /// file real `${baseUrl}${file.fileUrl}`
        let FILE_URL = `${baseUrl}${file.fileUrl}`;    
        // Function to get extention of the file url
        // let file_ext = getFileExtention(FILE_URL);
        let file_ext = `${file.fileUrl}.${file.fileExt}`
       
        // file_ext = '.' + file_ext[0];
       
        // config: To get response by passing the downloading related options
        // fs: Root directory path to download
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            path:
              RootDir+
              '/file_' + 
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              file_ext,
            description: 'downloading file...',
            notification: true,
            // useDownloadManager works with Android only
            useDownloadManager: true,   
          },
        };
        config(options)
          .fetch('GET', FILE_URL)
          .then(res => {
            // Alert after successful downloading
            Alert.alert('File Downloaded Successfully.');
          });
      };
      const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
                 /[^.]+$/.exec(fileUrl) : undefined;
      };
     
    // const downloadFile = (file) =>{
    //     RNFetchBlob.fetch('GET', `${baseUrl}${file.fileUrl}`, {
    //         Authorization : 'Bearer access-token...',
    //         // more headers  ..
    //       })
    //       .then((res) => {
    //         let status = res.info().status;
         
    //         if(status == 200) {
    //           // the conversion is done in native code
    //           let base64Str = res.base64()
    //           // the following conversions are done in js, it's SYNC
    //           let text = res.text()
    //           let json = res.json()
    //         } else {
    //           // handle other status codes
    //         }
    //       })
    //       // Something went wrong:
    //       .catch((errorMessage, statusCode) => {
    //         // error handling
    //       })
    // }
    const itemImage = ({item,index}) =>{
      if(item){
        const image =  props.data.listFile.find(file=>file.recAppFormFileId === parseInt(item))
        return <TouchableOpacity style={{width:width*0.4,marginLeft:5,marginRight:10,marginTop:10}} onPress={()=>showImageView(index)}>
           <Image source={{uri:`${baseUrl}${image.fileUrl}`}} style={{width:width*0.4,height:height*0.2,borderRadius:10}} resizeMode={'stretch'} />
        </TouchableOpacity>
      }
    }
    const itemFile = (item) =>{
        if(item.val){
          const file =  props.data.listFile.find(file=>file.recAppFormFileId === parseInt(item.val))
          return <TouchableOpacity style={{flexDirection:'row',width:'60%',marginLeft:5,marginRight:10,borderRadius:10,borderColor:'black',borderWidth:1,marginBottom:10,padding:10}} onPress={()=> checkPermission(file)}>
                    <Image source={require('../../assets/images/downloadFile.png')} style={{width:40,height:40,marginTop:5,marginRight:10}}/>
                    <Text style={{fontSize:30,color:'black',marginTop:5}} numberOfLines={1}>{`${file.fileName}.${file.fileExt}`}</Text>
                </TouchableOpacity>
        }
    }
    const renderImage = (value) =>{
        return <FlatList 
         data={value}
         numColumns={2}
         renderItem={(image)=> itemImage(image) }
         />
     }
    const renderList = ({item,index}) =>{
        const {ansType} = item
        if(ansType === '1'){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
            <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10}}>
            <Text style={{fontSize:35,marginTop:10}}>{item.ansVal[0].val}</Text> 
            </View>
              </View>
        }
        if(ansType === '2'){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
               {item.ansVal.map(item=>{
                   return (<View style={{flexDirection:'row'}}>
                            <RadioButton
                            status={ item.val === 'Y' ? 'checked' : 'unchecked' }
                            color={colors.primary}
                           
                        />
                        <Text style={{marginLeft:10,fontSize:30}}>{item.ans}</Text>
                       </View>)
               })}
              </View>
        }
        if(ansType === '3'){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
               {item.ansVal.map(item=>{
                   return (<View style={{flexDirection:'row'}}>
                            <Checkbox
                            status={ item.val === 'Y' ? 'checked' : 'unchecked' }
                            color={colors.primary}
                          
                        />
                        <Text style={{marginLeft:10,fontSize:30}}>{item.ans}</Text>
                       </View>)
               })}
              </View>
        }
        if(ansType === '4'){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
               {item.ansVal.map(item=>{
                   return (<View style={{flexDirection:'row'}}>
                            <RadioButton   
                            status={ item.val === 'Y' ? 'checked' : 'unchecked' }
                            color={colors.primary}
                          
                        />
                        <Text style={{marginLeft:10,fontSize:30}}>{item.ans}</Text>
                       </View>)
               })}
              </View>
        }
        if(ansType === '5'){
          if(item && item.ansVal){
              let list = item.ansVal.sort(function (a, b) {
                if (a.val > b.val) {
                    return -1;
                } else if (a.val < b.val) {
                    return 1;
                } else {
                    return 0;
                }
            });
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
              {list.map((item,index)=>{
                  return (<View>
                        <Text style={{marginLeft:10,fontSize:30}}>{index+1}.  {item.ans}</Text>
                        {/* <Text style={{marginLeft:10,fontSize:30}}>{item.ans}</Text> */}
                      </View>)
              })}
              </View>
            }
          }
        if(ansType === '6'){
            const images = item.ansVal.map(val=>val.val)
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
            <View style={{marginTop:10}}>
            {renderImage(images)}
            
            </View>
              </View>
        }
       
        if(ansType === '7'){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
               {item.ansVal.map((item,index)=>{
                   return itemFile(item)
               })}
              </View>
        }
        if(ansType === '8'){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
               
            <View style={{flexDirection:'row'}}>        
            <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10,paddingLeft:20,paddingRight:30}}>
            < Text style={{marginLeft:10,fontSize:30}}>{dayjs(item.ansVal[0].val).format('D/M/BBBB')}</Text>
            </View>
            {
             item && item.ansVal[1] ? 
             <>
              <View style={{justifyContent:'center',marginLeft:20,marginRight:10}}>
                <Text style={{fontSize:30, alignSelf:'center',fontWeight:'bold'}}>-</Text>
              </View>
              <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10,marginLeft:10,paddingLeft:20,paddingRight:30}}>
              < Text style={{marginLeft:10,fontSize:30}}>{dayjs(item.ansVal[1].val).format('D/M/BBBB')}</Text>
              </View>
              </>
             :
             null
            }
            
                       </View>
              </View>
        }
        if(ansType === '9'){
            return <View style={{flex:1}}>
            <View >
            <Text style={{fontSize:35,marginTop:10}}>{index + 1}. {item.questionNm}</Text> 
            </View>
               
            <View style={{flexDirection:'row'}}>        
            <View style={{borderColor:'black',borderWidth:1,padding:10,borderRadius: 10,marginTop:10,paddingLeft:20,paddingRight:30}}>
            < Text style={{marginLeft:10,fontSize:30}}>{dayjs(item.ansVal[0].val).format('D/M/BBBB')}</Text>
            </View>
            
            
                       </View>
              </View>
        }
       
    }
     return (
        <Modal
        visible={props.show}
        closeHeaderButton={false}
        onPressCancel={()=>props.onPressCancel()}
        onPressConfirm={()=>{}}
        title = {'Survey Result'}
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
           {props.data && <ScrollView style={{height:height*0.8,backgroundColor: 'white'}}>
           <ViewShot 
                  ref={el => inputRef.viewShot = el}
               options={{ format: "jpg", quality: 0.9 }} captureMode="mount" style={{backgroundColor:'white',padding:30}}>
                <Text style={{fontSize:FONT_SIZE.TITLE, fontWeight:'bold',marginTop:10}}>{`${props.nameProject}`}</Text>
                   
                <View style={{flexDirection:'row',marginTop:10}}>
                <FlatList 
                    data={props.data.objForm[0].appForm}
                    renderItem={(template)=> renderList(template) }
                    />
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
export default Normal;
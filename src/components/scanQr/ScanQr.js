import React,{useEffect,useState} from 'react';
import { View,Text, StyleSheet,TouchableOpacity,PermissionsAndroid, Alert,BackHandler } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import viewFinder from './ViewFinder'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { getQRAction,resetQrSuccess } from '../../actions/ScanQA';
import {Modal,ModalWarning} from '../../components'

let options = {
    title: `Meter${new Date().getTime()}`,
    base64: true,
    maxWidth: 600,
    maxHeight: 600,
    quality: 1,
    mediaType: "photo",
    storageOptions: {
      skipBackup: true,
      path: "images",


    },
  };
const ScanQr = () => {
     const navigation = useNavigation();
    const dispatch = useDispatch();
    const {qrReducer} = useSelector((state) => state);
    const [isError,setIsError] = useState(false);
    const [msgError,setMsgError] = useState('');
    const [isRead,setIsRead] = useState(false);
    useEffect(()=>{
     //searchQr({data:"0000001011000000202"})
   //searchQr({data:"0000000110031170101"})
  // BackHandler.addEventListener("hardwareBackPress", backAction);
    requestCameraPermission();
    },[])


    const searchQr =  async (e) =>{
      if(!qrReducer.is_loading && !isRead){
        setIsRead(true)
        const res = await dispatch(getQRAction(e.data))
        if(res){
          navigation.goBack()
        }else{
          setIsError(true);
          setMsgError('ไม่พบข้อมูล')
          setIsRead(false)
        }
      }
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
      
    return (
        <View style={styles.container}>
       
        {isRead ? <View style={{flex:1,backgroundColor:'black'}}></View> : <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onBarCodeRead={(e)=>searchQr(e)}
        >
          <TouchableOpacity style={{position:'absolute',backgroundColor:'transparent',padding:30,paddingLeft:100,paddingRight:100,bottom:10,borderRadius:10,borderColor:'white',borderWidth:1}}
            onPress={()=>navigation.goBack()}
          >
            <Text style={{fontSize:20,color:'white'}}>ย้อนกลับ</Text>
            </TouchableOpacity>
          {/* <Text>ย้อนกลับ</Text> */}
           {/* <Modal visible={isError} title={'แจ้งเตือน'} onPressCancel={()=>setIsError(!isError)}
           
            >
            <View style={{padding:20}}>
                <Text style={{fontSize:30}}>{msgError}</Text>
            </View>
           </Modal> */}
                <ModalWarning
                        visible={isError}
                        onPressClose={()=>setIsError(!isError)}
                        onlyCloseButton
                        detailText={msgError}
                    />
          </RNCamera>}
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });
export default ScanQr;
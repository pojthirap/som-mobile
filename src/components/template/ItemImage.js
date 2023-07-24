import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, PermissionsAndroid, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { Checkbox, RadioButton } from 'react-native-paper';
import { Text, SelectDropdown, Modal, Table, CheckBox, ModalWarning } from '..'
import colors from '../../utility/colors';
import { baseUrl } from '../../api/Axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadFile } from '../../actions/AppForm'
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window')

function TextOrdering(props) {
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
  const [list, setList] = useState(props.list);
  const [isLoad, setIsLoad] = useState(false);
  const [cate, setCate] = useState(null);
  const [isShowPopup, setIsShowPopup] = useState(false);
  useEffect(() => {
  }, [list])
  const renderList = ({ item, index }) => {
    const image = item.file ? item.file : props.files.find(file => file.recAppFormFileId === parseInt(item.val))
    if (image) {
      return (
        <View style={{ marginHorizontal: 5}}>
          <Image source={{ uri: convertImage(image) }} style={{ width: width * 0.42, height: height * 0.3, borderRadius: 10, borderWidth: 0.2, marginTop: 20 }} resizeMode={'stretch'} />
          <TouchableOpacity style={{ position: 'absolute', left: width * 0.35, top: 30 }} onPress={() => {
            let lists = [...list]
            if (lists.length == 1) {
              lists[0] = { ans: null, val: null, file: null }
            } else {
              lists.splice(index, 1);
            }
            setList(lists)
            props.onChange(lists)
          }}>
            <Image source={require('../../assets/images/empty-tash-can.png')} style={{ width: 25, height: 25, tintColor: 'black' }} />
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
  }
  
  const convertImage = (url) => {
    if (url) {
      if (url && url.fileUrl.includes('getFile')) return `${baseUrl}/${url.fileUrl.substring(1)}`
      return url.fileUrl
    }
    return ''
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
      } else { }
    } catch (err) {
      console.warn(err);
    };  
  }

  const addImage = async () =>{
    requestCameraPermission();
    setIsShowPopup(true);
  }

  const resizeImage = async (path) => {
    let imgRes = await ImageResizer.createResizedImage(path, 700, 700, 'JPEG', 70, 0, );
    let base64 = await RNFS.readFile(imgRes?.uri, 'base64');
    if (base64)return 'data:image/png;base64,'+base64
  }

  const onPressModal = async () =>{
    setIsShowPopup(false)
    let lists = [...list]
      launchCamera(options, async (response)=>{
        if(response && response.assets[0]){
            // setImgLoad(true);
            setIsLoad(true);
            let source = 'data:image/png;base64,'+response.assets[0].base64;
            const res = await uploadFile(response.assets[0].uri,'image/jpeg','.jpg','Y')
            let rez = await resizeImage(source)
            setIsLoad(false);
            if(!lists[0].val) lists[0] = {ans:'',val:`${res.fileId}`,valExt1:`${cate.attachCateId}`,file:{fileUrl:rez}}
            else lists.push({ans:'',val:`${res.fileId}`,valExt1:`${cate.attachCateId}`,file:{fileUrl:rez}})
            setList(lists)
            props.onChange(lists)
        }
    })
  };

  return <View>
    <FlatList
      data={list}
      extraData={list}
      numColumns={2}
      renderItem={(template) => renderList(template)}
      ListHeaderComponent={() => {
        return <TouchableOpacity disabled={!props.disable} style={{ marginLeft: 20, marginBottom: 20, marginTop: 20 }} onPress={() => addImage()}>
          <Text style={{ color: colors.primary, fontSize: 30 }}>ถ่ายภาพ</Text>
          <Image source={require('../../assets/images/ic_choose_camera.png')} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      }}
      ListFooterComponentStyle={() => {
        return <View style={{ marginTop: 10 }}>
          {isLoad && <ActivityIndicator
            animating={true}
            size="large"
            color={colors.primary} />}
        </View>
      }}
    />
    <Modal
      visible={isShowPopup}
      onPressCancel={() => {
        setCate(null)
        setIsShowPopup(false)
      }}
      onPressConfirm={onPressModal}
      title={'ประเภทรูปภาพ'}
      TWOBUTTON={true}
      cancelText={'Close'}
      confirmText={'Confirm'}
      cancelTextColor={colors.primary}
      cancelButtonColor={colors.white}
      confirmButtonColor={colors.primary}
      confirmTextColor={colors.white}
      disabledUplodeButton={!cate}
    >
      <View style={{ padding: 10, marginBottom: 30 }}>
        <SelectDropdown
          titleAlert={'ประเภทรูปภาพ'}
          titleDropdown={''}
          dataList={props.cates}
          titleKey={'attachCateNameTh'}
          valueKey={'attachCateId'}
          onPress={(e) => setCate(e)}

        />
      </View>
    </Modal>
  </View>
}
export default TextOrdering;
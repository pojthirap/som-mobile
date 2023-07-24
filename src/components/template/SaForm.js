import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, BackHandler, PermissionsAndroid, Dimensions, ActivityIndicator, TextInput, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import colors from '../../utility/colors';
import { getInputData } from '../../utility/helper';
import { Text, SelectDropdown, Modal, Table, CheckBox, PickerDate, TextInput as CTextInput, ModalWarning } from '../../components'
import { FONT_SIZE } from '../../utility/enum';
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window')
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getTaskMeterForRecord, uploadMeterFile, addRecordMeter } from '../../actions/MeterTabAction'
import { useDispatch, useSelector } from 'react-redux';
import { getTaskTemplateSaFormForRecord, addRecordSaForm } from '../../actions/TemplateSaAction';
import { baseUrl } from '../../api/Axios';
import LoadingCom from '../../components/Loading'
import Header from '../Header'
import LovItem from './LovItem'
import ImageSaForm from './ImageSaForm'
import PickerItem from './PickerItem'

import dayjs from 'dayjs';
import { getAppForm, addRecordAppForm, setCallbackTemplate } from '../../actions/AppForm'
const n = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/


const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('TH')
function SaForm({ route, navigation }) {
  const dispatch = useDispatch();
  const { planTripTaskId } = route.params.obj
  const [data, setData] = useState(null);
  const [list, setList] = useState([]);
  const [isSave, setIsSave] = useState(true)
  const [saveLoad, setSaveLoad] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    getData();

  }, [])
  const backAction = () => {
    dispatch(setCallbackTemplate())
  }
  const getData = async () => {
    const data = await getTaskTemplateSaFormForRecord(`${planTripTaskId}`);
    setData(data[0])
    setList(data[0].title)
    validate(data[0].title);

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
  const validate = (data = list) => {
    let status = true
    data.forEach(obj => {
      if (!obj.titleColmAns && obj.ansValType != 5) {
        status = false
      }
      if (obj.ansValType === 5) {
        const cord = obj.titleColmAns ? obj.titleColmAns.split(',') : [];
        if (!cord[0] || !cord[1]) {
          status = false
        }
      }

    })
    setIsSave(status)
  }
  const renderList = ({ item, index }) => {
    const { ansValType, ansLovType } = item;
    // 1 freetext 2 number   3 Calendar 4 Image 5 GPS 6 LOV 1 
    if (ansValType === 1) {
      return <View style={{ flex: 1 }}>
        <View >
          <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.titleNameTh} : </Text>
        </View>
        <View style={{ borderColor: colors.grayButton, borderWidth: 1, padding: 1, borderRadius: 10, marginTop: 2, marginBottom: 2, paddingLeft: 20 }}>
          <TextInput style={{ fontSize: 18, color: colors.grayButton }} onChangeText={text => {
            let obj = list;
            obj[index].titleColmAns = text
            setList(obj)
            validate();

          }} maxLength={250}>{item.titleColmAns}</TextInput>
        </View>
      </View>
    }
    if (ansValType === 2) {
      return <View style={{ flex: 1 }}>
        <View >
          <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.titleNameTh} : </Text>
        </View>
        <View style={{ borderColor: colors.grayButton, borderWidth: 1, padding: 1, borderRadius: 10, marginTop: 2, marginBottom: 2, paddingLeft: 20 }}>
          <TextInput style={{ fontSize: 18, color: colors.grayButton }} onChangeText={text => {
            let obj = list;
            obj[index].titleColmAns = text
            setList(obj)
            validate();

          }} maxLength={250}>{item.titleColmAns}</TextInput>
        </View>
      </View>
    }
    if (ansValType === 3) {
      let dateParts = item.titleColmAns ? item.titleColmAns.split("/") : [];
      return <View style={{ flex: 1 }}>
        <View >
          <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.titleNameTh} : </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <PickerItem
            dateValue={item.titleColmAns ? dayjs(new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])).subtract(543, 'year').format('YYYY/MM/DD') : null} onChange={(date) => {
              let obj = list;
              obj[index].titleColmAns = dayjs(date).add(543, 'year').format('DD/MM/YYYY')
              setList(obj)
              validate();
            }}
          />
        </View>
      </View>
    }
    if (ansValType === 4) {
      return <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.titleNameTh} : </Text>
        <ImageSaForm files={data.listFile} values={item.titleColmAns} onChange={(val) => {
          let obj = list;
          obj[index].titleColmAns = `${val}`
          setList(obj)
          validate();
        }} />
      </View>
    }
    if (ansValType === 5) {
      const cord = item.titleColmAns ? item.titleColmAns.split(',') : [];
      return <View style={{ flex: 1 }}>
        <View >
          <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.titleNameTh} : </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ borderColor: colors.grayButton, borderWidth: 1, padding: 1, borderRadius: 10, marginTop: 2, marginBottom: 2, paddingLeft: 20, flex: 0.5, marginRight: 10 }}>
              <TextInput style={{ fontSize: 18, color: colors.grayButton }} onChangeText={text => {

                let obj = list;
                cord[0] = text
                obj[index].titleColmAns = `${cord[0] ? cord[0] : ''},${cord[1] ? cord[1] : ''}`
                setList(obj)
                validate();

              }} maxLength={50} keyboardType='numeric'>{cord[0] ? cord[0] : ''}</TextInput>
            </View>
            <View style={{ borderColor: colors.grayButton, borderWidth: 1, padding: 1, borderRadius: 10, marginTop: 2, marginBottom: 2, paddingLeft: 20, flex: 0.5, marginLeft: 10 }}>
              <TextInput style={{ fontSize: 18, color: colors.grayButton }} onChangeText={text => {

                let obj = list;
                cord[1] = text
                obj[index].titleColmAns = `${cord[0] ? cord[0] : ''},${cord[1] ? cord[1] : ''}`
                setList(obj)
                validate();

              }} maxLength={50} keyboardType='numeric'>{cord[1] ? cord[1] : ''}</TextInput>
            </View>
          </View>
        </View>
      </View>
    }
    if (ansLovType) {
      return <View style={{ flex: 1 }}>
        <View >
          <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.titleNameTh} : </Text>
        </View>
        <View>
          <LovItem data={item} isEdit={true} onChange={(val) => {
            let obj = list;
            obj[index].titleColmAns = `${val.code}`
            setList(obj)
            validate();
          }}
            title={item.titleNameTh}
          />
        </View>
      </View>
    }
  }
  const onSave = async () => {
    const { planTripTaskId, tpSaFormId, planTripProspId } = route.params.obj
    let payload = { form: data.form }
    payload.form.tpSaFormId = `${payload.form.tpSaFormId}`
    payload.tpSaFormId = `${tpSaFormId}`
    payload.prospId = `${route.params?.planTrip?.prospId}`
    payload.planTripTaskId = `${planTripTaskId}`
    payload.listTitle = list
    //    // setSaveLoad(true)
    //     payload.listTitle = payload.listTitle.map(title =>{
    //             let res = title
    //             res.title_data = res.title_data ? `${res.title_data}` : ''
    //             res.tpSaTitleId = res.tpSaTitleId ? `${res.tpSaTitleId}` : null
    //             res.tpSaFormId = res.titleColmNo ? `${res.titleColmNo}` : null
    //             res.ansValType =  res.ansValType ? `${res.ansValType}` : null
    //             res.ansLovType = res.ansLovType ? `${res.ansLovType}` : null
    //             return res
    //     })
    const status = await addRecordSaForm(payload);
    setIsSuccess(true)
    setSaveLoad(false)


  }
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <Header />
      <View style={{ padding: 20, marginBottom: 20 }}>
        {/* <Modal visible = {isSuccess}
                      title = {'แจ้งเตือน'}
                     TWOBUTTON={false}
                     onPressConfirm={()=>{
                        setIsSuccess(false)
                        dispatch(setCallbackTemplate())
                        navigation.goBack()                        
                     }}
                     onPressCancel={()=>{
                        setIsSuccess(false)
                        dispatch(setCallbackTemplate())
                        navigation.goBack()
                     }}
                     >
                         <View style={{padding:20}}>
                         <Text>บันทึกข้อมุลสำเร็จ</Text>
                         </View>   
                     </Modal> */}
        <ModalWarning
          visible={isSuccess}
          onlyCloseButton
          onPressClose={() => {
            setIsSuccess(false)
            dispatch(setCallbackTemplate())
            navigation.goBack()
          }}
          detailText={'บันทึกข้อมูลสำเร็จ'}
        />
        <ScrollView keyboardShouldPersistTaps='always'>
          <FlatList
            data={list}
            renderItem={(template) => renderList(template)}
            ListFooterComponent={() => {
              return (<View>
                {saveLoad ? <View style={{ alignSelf: 'center', marginTop: 10 }}>
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color={colors.primary} />
                </View> : <TouchableOpacity disabled={!isSave} style={!isSave ? { alignSelf: 'center', marginBottom: 20, backgroundColor: colors.disabled, padding: 15, borderRadius: 10, marginTop: 30 } : { alignSelf: 'center', marginBottom: 20, backgroundColor: colors.primary, padding: 15, borderRadius: 10, marginTop: 30 }} onPress={() => onSave()}>
                  <Text style={{ marginLeft: width * 0.1, marginRight: width * 0.1, fontSize: 30, color: 'white', fontWeight: 'bold' }}>Save</Text>
                </TouchableOpacity>}
              </View>)
            }}
          />
        </ScrollView>
      </View>

    </View>
  );
}
export default SaForm;

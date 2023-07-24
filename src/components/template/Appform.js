import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler, Image, FlatList, PermissionsAndroid, Dimensions, ActivityIndicator, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Icon } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import colors from '../../utility/colors';
import { getInputData } from '../../utility/helper';
import { Text, SelectDropdown, Modal, Table, CheckBox, PickerDate, ModalWarning } from '../../components'
import { FONT_SIZE } from '../../utility/enum';
import { Checkbox, RadioButton } from 'react-native-paper';
const { width, height } = Dimensions.get('window')
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getAppForm, addRecordAppForm, setCallbackTemplate, getCateAttach } from '../../actions/AppForm'
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from '../../api/Axios';
import LoadingCom from '../../components/Loading'
import Header from '../Header'
import dayjs from 'dayjs';
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('TH')
import RadioList from './RadioList'
import CheckBoxList from './CheckBoxList'
import TextOrdering from './TextOrdering';
import ItemImage from './ItemImage';
import ItemFile from './ItemFile';
import PickerItem from './PickerItem'
import PickerItemMulti from './PickerItemMulti'
function Appform({ route, navigation }) {
    const dispatch = useDispatch();

    const { obj, planTrip } = route.params;
    const [data, setData] = useState(null)
    const [forms, setForms] = useState([])
    const [saveLoad, setSaveLoad] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSave, setIsSave] = useState(true)
    const [updateTime, setUpdateTime] = useState(new Date())
    const [cates, setCates] = useState([])
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        getData();

        //requestCameraPermission();
    }, [])
    const backAction = () => {
        dispatch(setCallbackTemplate())
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
    const validate = (data = forms) => {
        let status = true
        data.forEach(form => {
            if (form.requireFlag === 'Y' && form.ansVal[0] && !form.ansVal[0].val && form.ansType != '8' && form.ansType != '3') {
                status = false
            }
            if (form.ansType === '8' && form.requireFlag === 'Y' && (form.ansVal[0] && !form.ansVal[0].val || form.ansVal[1] && !form.ansVal[1].val)) {
                status = false
            }
            if (form.ansType === '3' && form.requireFlag === 'Y') {
                let vals = form.ansVal.filter(val => val.val)
                if (vals.length == 0)
                    status = false
            }
            if (form.ansType === '5' && form.requireFlag === 'Y') {
                let vals = form.ansVal.filter(val => val.val)
                if (form.ansVal.length != vals.length)
                    status = false
            }
        })
        setUpdateTime(new Date())
        setIsSave(status)
    }
    const getData = async () => {
        const data = await getAppForm(`${obj.planTripTaskId}`)
        console.log('data ===',data)
        setData(data[0])
        setForms(data[0].objForm[0].appForm)
        validate(data[0].objForm[0].appForm);
        const catesList = await getCateAttach();
        setCates(catesList)
    }
    const renderImage = (value) => {
        return <FlatList
            data={value}
            numColumns={2}
            renderItem={(image) => itemImage2(image)}
        />
    }
    const onSave = async () => {
        const { prospId } = planTrip;
        const { planTripTaskId, tpAppFormId } = obj;
        const { templateId, templateCateId, templateCateName, templateName } = data.objForm[0]
        const payload = {
            planTripTaskId: `${planTripTaskId}`,
            objForm: {
                templateId,
                templateCateId,
                templateCateName,
                templateName,
                appForm: forms
            },
            tpAppFormId: `${tpAppFormId}`,
            prospId: `${prospId}`
        }
        setSaveLoad(true)
        await addRecordAppForm(payload)
        setIsSuccess(true)
        setSaveLoad(false)
    }
    const removeItem = (obj) => {
        //const index = forms.filter(form=> form.)
    }

    const itemImage2 = ({ item, index }) => {
        const image = data.listFile.find(file => file.fileId === parseInt(item))

        // return <View style={{width:width*0.4,marginLeft:5,marginRight:10}}>v  x
        //              <TouchableOpacity onPress={removeItem(item)}>
        //                  <Text>ลบ</Text>
        //              </TouchableOpacity>
        //              <Image source={{uri:`${baseUrl}${image.fileUrl.substring(1)}`}} style={{width:width*0.4,height:height*0.2,borderRadius:10}} resizeMode={'stretch'} />
        //        </View>
    }
    const itemFile = (item) => {
        const file = data.listFile.find(file => file.fileId === parseInt(item.val))
        return <TouchableOpacity style={{ flexDirection: 'row', width: width * 0.4, marginLeft: 5, marginRight: 10, borderRadius: 10, borderColor: 'black', borderWidth: 1, marginBottom: 10, padding: 10 }} onPress={() => checkPermission(file)}>
            <Image source={require('../../assets/images/downloadFile.png')} style={{ width: 40, height: 40, marginTop: 5, marginRight: 20 }} />
            <Text style={{ fontSize: 30, color: 'black', marginTop: 5 }}>{`${file.fileName}.${file.fileExt}`}</Text>
        </TouchableOpacity>
    }
    const renderHeader = (requireFlag) => {
        return <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <Text style={{ fontSize: 40, color: 'black' }}>คำถาม</Text>
            {requireFlag === "Y" && <Text style={{ fontSize: 40, color: 'red' }}>*</Text>}
        </View>
    }

    const getCheckVal = (item, forms, ansType) => {
        let isNotAnswer = false;
        forms[parseInt(item.prerequistOrderNo) - 1].ansVal.map(ans => {
            if (ans.val) isNotAnswer = true
        })
        return isNotAnswer;
    }

    const renderList = ({ item, index }) => {
        const { ansType } = item
        let disable = true
        if (item.prerequistOrderNo != "") {
            if (forms[parseInt(item.prerequistOrderNo) - 1] && forms[parseInt(item.prerequistOrderNo) - 1].ansVal[0] && !getCheckVal(item, forms, ansType)) disable = false
        }
        if (ansType === '1') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag, index)}
                <View >

                    <Text style={{ fontSize: 35 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <View style={{ borderColor: 'black', borderWidth: 1, padding: 10, borderRadius: 10, marginTop: 10 }}>
                    {disable ? <TextInput style={{ fontSize: 20, marginTop: 10 }} onChangeText={text => {
                        let obj = forms;
                        obj[index].ansVal[0].val = text
                        setForms(obj)
                        validate()

                    }} maxLength={250}>{item.ansVal[0].val}</TextInput> : <View style={{ marginTop: 20, marginBottom: 20 }}></View>}
                </View>
            </View>
        }
        if (ansType === '2') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <RadioList list={item.ansVal} disable={!disable} onChange={(list) => {
                    let res = forms;
                    res[index].ansVal = list;
                    setForms(res)
                    validate()

                }} />
            </View>
        }
        if (ansType === '3') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <CheckBoxList list={item.ansVal} disable={!disable} onChange={(list) => {
                    let res = forms;
                    res[index].ansVal = list;
                    setForms(res)
                    validate()

                }} />
            </View>
        }
        if (ansType === '4') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <RadioList list={item.ansVal} disable={!disable} onChange={(list) => {
                    let res = forms;
                    res[index].ansVal = list;
                    setForms(res)
                    validate()
                }} />
            </View>
        }
        if (ansType === '5') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <TextOrdering disable={disable} list={item.ansVal} onChange={(list) => {
                    let res = forms;
                    res[index].ansVal = list;
                    setForms(res)
                    validate()
                }} />
            </View>
        }
        if (ansType === '6') {
            const images = item.ansVal.map(val => val.val)
            const list = item.ansVal.map(obj => {
                const image = data.listFile.find(file => file.recAppFormFileId === parseInt(obj.val))
                if (!obj.valExt1) obj.valExt1 = image ? image.attachCateId ? `${image.attachCateId}` : null : null
                return obj
            })
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <ItemImage cates={cates} disable={disable} list={list} files={data.listFile} onChange={(list) => {
                        let res = forms;
                        res[index].ansVal = list;
                        setForms(res)
                        validate()
                    }} />
                </View>
            </View>
        }
        if (ansType === '7') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <ItemFile cates={cates} list={item.ansVal} disable={disable} files={data.listFile} onChange={(list) => {
                    let res = forms;
                    res[index].ansVal = list;
                    setForms(res)
                    validate()
                }} />
            </View>
        }
        if (ansType === '8') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1}. {item.questionNm} : </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <PickerItemMulti disable={!disable} value={item.ansVal} onChangeV1={(date) => {
                        let obj = forms;
                        obj[index].ansVal[0].val = dayjs(date).format('YYYYMMDD')
                        setForms(obj)
                        setUpdateTime(new Date())
                        validate()
                    }} onChangeV2={(date) => {
                        let obj = forms;
                        if (!obj[index].ansVal[1]) obj[index].ansVal.push({ val: dayjs(date).format('YYYYMMDD') })
                        else obj[index].ansVal[1].val = dayjs(date).format('YYYYMMDD')
                        setForms(obj)
                        setUpdateTime(new Date())
                        validate()
                    }} />
                </View>
            </View>
        }
        if (ansType === '9') {
            return <View style={{ flex: 1 }}>
                {renderHeader(item.requireFlag)}
                <View >
                    <Text style={{ fontSize: 35, marginTop: 10 }}>{index + 1} {item.questionNm} : </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <PickerItem dateValue={item.ansVal[0] ? item.ansVal[0].val : null} onChange={(date) => {
                        let obj = forms;
                        obj[index].ansVal[0].val = dayjs(date).format('YYYYMMDD')
                        setForms(obj)
                        validate()
                    }} />
                </View>

            </View>
        }
    }
    return (
        <View style={{ backgroundColor: 'white' }}>
            <Header />
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
            <ScrollView keyboardShouldPersistTaps='always' style={{ padding: '5%', marginBottom: 100, backgroundColor: 'white' }}>
                <FlatList
                    data={forms}
                    extraData={updateTime}
                    renderItem={(template) => (renderList(template))}
                    ListFooterComponent={() => {
                        return (<View>
                            {
                                saveLoad ? 
                                <View style={{ alignSelf: 'center' }}>
                                    <ActivityIndicator
                                        animating={true}
                                        size="large"
                                        color={colors.primary} />
                                </View> 
                                : 
                                <TouchableOpacity disabled={!isSave} style={!isSave ? { alignSelf: 'center', marginBottom: 20, backgroundColor: colors.disabled, padding: 15, borderRadius: 10, marginTop: 30 } : { alignSelf: 'center', marginBottom: 20, backgroundColor: colors.primary, padding: 15, borderRadius: 10, marginTop: 30 }} onPress={() => onSave()}>
                                    <Text style={{ marginLeft: width * 0.1, marginRight: width * 0.1, fontSize: 30, color: 'white', fontWeight: 'bold' }}>Save</Text>
                                </TouchableOpacity>
                            }
                        </View>)
                    }}
                />

            </ScrollView>
        </View>
    );
}
export default Appform;
import React, { useState, useEffect, useRef } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, PermissionsAndroid, BackHandler, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Icon } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

import colors from '../../utility/colors';
import { getInputData } from '../../utility/helper';
import { Text, SelectDropdown, Modal, Table, CheckBox, TextInput as CTextInput, ModalWarning } from '../../components'
import { FONT_SIZE } from '../../utility/enum';
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window')
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getTaskMeterForRecord, uploadMeterFile, addRecordMeter, checkPercentRangRecordMeter } from '../../actions/MeterTabAction'
import { useDispatch, useSelector } from 'react-redux';
import { getQRAction, resetQr } from '../../actions/ScanQA';
import { baseUrl } from '../../api/Axios';
import LoadingCom from '../../components/Loading'
import { getAppForm, addRecordAppForm, setCallbackTemplate } from '../../actions/AppForm'
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import Header from '../Header'
function Meter({ route, navigation }) {
    const { planTrip, obj } = route.params;
    const inputRef = useRef({});
    const dispatch = useDispatch();
    const { qrReducer } = useSelector((state) => state);
    const [showImage, setShowImage] = useState('');
    const [station, setStation] = useState('');
    const [gasCode, setGasCode] = useState('');
    const [previewImg, setPreViewImg] = useState(null)
    const [isError, setIsError] = useState(false)
    const [msgError, setMsgError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSave, setIsSave] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [indexConfirm, setIndexConfirm] = useState(null)
    const [meterConfirm, setMeterConfirm] = useState(null)
    const [confirmMessage, setConfirmMessage] = useState('')
    const [meter, setMeter] = useState({
        meterId: "",
        gasId: "",
        gasId: "",
        dispenserNo: '',
        nozzleNo: '',
        qrcode: "",
        meterActiveFlag: "",
        meterCreateUser: "",
        meterCreateDtm: "",
        meterUpdateUser: "",
        meterUpdateDtm: "",
        gasNameTh: "",
        gasNameEn: "",
        gasCode: "",
        fileId: "",
        recMeterId: "",
        fileName: "",
        fileExt: "",
        fileSize: "",
        recRunNo: "",
        remark: "",
        oldRecRunNo: "",
        custNameTh: planTrip.accName,
        fileUrl: ''
    });
    const [tasks, setTasks] = useState([]);
    const [imgLoad, setImgLoad] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)
    useEffect(() => {
        // getTaskRecord();
        getData()
    }, [])
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
    })
    const backAction = () => {
        dispatch(setCallbackTemplate())
    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@storage_Key', jsonValue)
        } catch (error) {
            // saving error
        }
    }
    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')
            if (jsonValue != null) {
                return setTasks(JSON.parse(jsonValue))
            } else {
                return getTaskRecord();
            }
            // return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            // error reading value
        }
    }
    const removeStore = async () => {
        try {
            await AsyncStorage.removeItem('@storage_Key');
        } catch (error) {
            // error revove value
        }
    };

    useEffect(() => {
        trigger();
    }, [qrReducer])
    const trigger = () => {
        if (qrReducer.meter) {
            if (qrReducer.meter.custCode != `${planTrip.custCode}`) {
                setIsError(true)
                setMsgError('ไม่พบข้อมูล')
                dispatch(resetQr())
                return
            }
            let obj = { ...qrReducer.meter };
            let index = tasks.findIndex(x => `${x.meterId}` === `${obj.meterId}`)
            let dispenser = tasks.findIndex(x => `${x.dispenserNo}` === `${obj.dispenserNo}`);
            let nozzle = tasks.findIndex(x => x.dispenserNo == obj.dispenserNo && x.nozzleNo == obj.nozzleNo);
            if (dispenser < 0) {
                setIsError(true)
                setMsgError('กรุณาระบุข้อมูลตู้น้ำมันใหม่ เนื่องจากเลขตู้น้ำมันไม่ถูกต้อง')
                dispatch(resetQr())
                return

            }
            if (nozzle < 0) {
                setIsError(true)
                setMsgError('กรุณาระบุข้อมูลมือจ่ายน้ำมันใหม่ เนื่องจากเลขมือจ่ายน้ำมันไม่ถูกต้อง')
                dispatch(resetQr())
                return
            }
            let taskIndex = tasks.findIndex(x => x.dispenserNo == obj.dispenserNo && x.nozzleNo == obj.nozzleNo);
            if (taskIndex < 0) {
                setIsError(true)
                setMsgError('กรุณาระบุข้อมูลตู้น้ำมันใหม่ เนื่องจากเลขตู้น้ำมันไม่ถูกต้อง')
                dispatch(resetQr())
                return
            }
            //  obj = {...qrReducer.meter};
            obj.remark = ''
            obj.recMeterId = ''
            obj.recRunNo = ''
            obj.custNameTh = planTrip.accName,
                obj.prevRecRunNo = tasks[taskIndex].prevRecRunNo
            setMeter({ ...meter, ...obj })
            dispatch(resetQr())
            return
        }
    }
    const getTaskRecord = async () => {
        const { planTripId, planTripProspId, prospId, custCode } = planTrip
        const data = await getTaskMeterForRecord(`${obj.planTripTaskId}`, `${prospId}`, `${planTripProspId}`, `${custCode}`);
        setTasks(data)
        let isSave = true;
        data.map(task => {
            if (task.recRunNo) isSave = true;
            else isSave = false
        })
        if (data.length == 0) isSave = false
        setIsSave(isSave)
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
    const chooseImage = () =>{
        
        requestCameraPermission();
        launchCamera(options, async (response) => {
            if (response && response.assets[0]) {
                setImgLoad(true);
                let source = 'data:image/png;base64,' + response.assets[0]?.base64;
                const res = await uploadMeterFile(response.assets[0]?.uri, 'Y')
                let rez = await resizeImage(source)
                setImgLoad(false);
                let obj = meter;
                if (res) {
                    obj.recMeterId = res.recMeterId
                    obj.fileId = res.fileId
                    obj.fileUrl = rez
                    setMeter({ ...meter, ...obj })
                }
            }
        })
    }
    const confirmAdd = async () => {
        if (indexConfirm >= 0 && meterConfirm) {
            let taskIndex = indexConfirm
            tasks[taskIndex].fileId = meterConfirm.fileId
            tasks[taskIndex].recMeterId = meterConfirm.recMeterId
            tasks[taskIndex].fileUrl = meterConfirm.fileUrl ? meterConfirm.fileUrl : null
            tasks[taskIndex].recRunNo = meterConfirm.recRunNo
            tasks[taskIndex].dispenserNo = meterConfirm.dispenserNo
            tasks[taskIndex].nozzleNo = meterConfirm.nozzleNo
            tasks[taskIndex].remark = meterConfirm.remark
            setIsConfirm(false)
            setIndexConfirm(null)
            setMeterConfirm(null)
            setTasks(tasks);
            storeData(tasks)
            setIsError(true)
            setMsgError('บันทึกข้อมูลสำเร็จ')
            let isSave = true;
            tasks.map(task => {
                if (task.recRunNo) isSave = true;
                else isSave = false
            })
            setMeter({
                meterId: "",
                gasId: "",
                gasId: "",
                dispenserNo: '',
                nozzleNo: '',
                qrcode: "",
                meterActiveFlag: "",
                meterCreateUser: "",
                meterCreateDtm: "",
                meterUpdateUser: "",
                meterUpdateDtm: "",
                gasNameTh: "",
                gasNameEn: "",
                gasCode: "",
                fileId: "",
                recMeterId: "",
                fileName: "",
                fileExt: "",
                fileSize: "",
                recRunNo: "",
                remark: "",
                oldRecRunNo: "",
                custNameTh: planTrip.accName,
                fileUrl: ''
            })
            setIsSave(isSave)

            return
        }

    }
    const addMeter = async () => {
        let totalValue = getInputData(inputRef);
        if (totalValue.isInvalid) return
        const { dispenserNo, recRunNo, nozzleNo, remark } = totalValue.data
        setMeter({ ...meter, ...totalValue.data })
        let dispenser = tasks.findIndex(x => `${x.dispenserNo}` === `${dispenserNo}`);
        let nozzle = tasks.findIndex(x => `${x.dispenserNo}` == `${dispenserNo}` && `${x.nozzleNo}` == `${nozzleNo}`);
        if (dispenser < 0) {
            setIsError(true)
            setMsgError('กรุณาระบุข้อมูลตู้น้ำมันใหม่ เนื่องจากเลขตู้น้ำมันไม่ถูกต้อง')
            return

        }
        if (nozzle < 0) {
            setIsError(true)
            setMsgError('กรุณาระบุข้อมูลมือจ่ายน้ำมันใหม่ เนื่องจากเลขมือจ่ายน้ำมันไม่ถูกต้อง')
            return
        }
        
        let taskIndex = tasks.findIndex(x => x.dispenserNo == dispenserNo && x.nozzleNo == nozzleNo  );

        if(taskIndex>=0){
            const {planTripId,planTripProspId,prospId,custCode} = planTrip
            const isRecRunNo = await checkPercentRangRecordMeter(`${obj.planTripTaskId}`,`${meter.meterId}`,`${recRunNo}`);
            if(meter.prevRecRunNo && parseInt(recRunNo) < parseInt(meter.prevRecRunNo)){
                setConfirmMessage('กรุณายืนยันข้อมูล เนื่องจากข้อมูลน้อยกว่าเลขมิเตอร์ครั้งก่อน')
                setIsConfirm(true)
                setIndexConfirm(taskIndex)
                setMeterConfirm({
                    fileId: meter.fileId,
                    recMeterId: meter.recMeterId,
                    fileUrl: meter.fileUrl ? meter.fileUrl : null,
                    recRunNo: pad_with_zeroes(recRunNo, 7),
                    dispenserNo: dispenserNo,
                    nozzleNo: nozzleNo,
                    remark: remark
                })
                return
            }
            if (isRecRunNo.errorMessage) {
                setConfirmMessage(isRecRunNo.errorMessage)
                setIsConfirm(true)
                setIndexConfirm(taskIndex)
                setMeterConfirm({
                    fileId: meter.fileId,
                    recMeterId: meter.recMeterId,
                    fileUrl: meter.fileUrl ? meter.fileUrl : null,
                    recRunNo: pad_with_zeroes(recRunNo, 7),
                    dispenserNo: dispenserNo,
                    nozzleNo: nozzleNo,
                    remark: remark
                })
                return
            }
            tasks[taskIndex].fileId = meter.fileId
            tasks[taskIndex].recMeterId = meter.recMeterId
            tasks[taskIndex].fileUrl = meter.fileUrl ? meter.fileUrl : null
            tasks[taskIndex].recRunNo = pad_with_zeroes(recRunNo, 7)
            tasks[taskIndex].dispenserNo = dispenserNo
            tasks[taskIndex].nozzleNo = nozzleNo
            tasks[taskIndex].remark = remark
            storeData(tasks);
            setTasks(tasks);
            setIsError(true)
            setMsgError('บันทึกข้อมูลสำเร็จ')
        }
        let isSave = true;
        tasks.map(task => {
            if (task.recRunNo) isSave = true;
            else isSave = false
        })
        setIsSave(isSave)
        setMeter({
            meterId: "",
            gasId: "",
            gasId: "",
            dispenserNo: '',
            nozzleNo: '',
            qrcode: "",
            meterActiveFlag: "",
            meterCreateUser: "",
            meterCreateDtm: "",
            meterUpdateUser: "",
            meterUpdateDtm: "",
            gasNameTh: "",
            gasNameEn: "",
            gasCode: "",
            fileId: "",
            recMeterId: "",
            fileName: "",
            fileExt: "",
            fileSize: "",
            recRunNo: "",
            remark: "",
            oldRecRunNo: "",
            custNameTh: planTrip.accName,
            fileUrl: ''
        })
        return


    }
    const pad_with_zeroes = (number, length) => {
        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
        return my_string;
    }
    const onSave = async () => {
        try {
            setSaveLoad(true)
            const res = await addRecordMeter(tasks, `${obj.planTripTaskId}`);
            setIsSuccess(true)
            setSaveLoad(false)
            removeStore();
        } catch (error) {
            crashlytics().recordError(error);
            setSaveLoad(false)
            Alert.alert(
                "",
                error
            );
        }

    }
    const filterDispenSerNo = (value, object) => {
        if (value) {
            let index = tasks.find(x => parseInt(x.dispenserNo) == parseInt(meter.dispenserNo) && parseInt(x.nozzleNo) == parseInt(value));
            if (index) {
                let obj = { ...index }
                obj.fileUrl = meter.fileUrl ? meter.fileUrl : ''
                obj.recRunNo = ''
                obj.remark = ''
                return setMeter({ ...meter, ...obj })
            }
            else {
                let obj = object
                obj.gasNameTh = ''
                obj.recRunNo = ''
                return setMeter({ ...meter, ...obj })
            }
        } else {
            let obj = object
            obj.gasNameTh = ''
            obj.recRunNo = ''
            return setMeter({ ...meter, ...obj })
        }




    }
    const convertImage = (url) => {
        if (url.includes('getFile')) return `${baseUrl}/${url.substring(1)}`
        return url
    }
    const renderHeader = () => {
        return <View style={[{ flex: 1, flexDirection: 'row', backgroundColor: colors.primary, padding: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
            <View style={{ width: '10%' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>ลำดับ</Text>
            </View>
            <View style={{ width: width * 0.2, marginLeft: 10, fontWeight: 'bold' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>เลขตู้</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10, fontWeight: 'bold' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>เลขมือจ่าย</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10, fontWeight: 'bold' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>ผลิตภัณฑ์</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10, fontWeight: 'bold' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>เลขมิเตอร์</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10, fontWeight: 'bold' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>เลขมิเตอร์ครั้งก่อน</Text>
            </View>
            <View style={{ width: width * 0.2, marginLeft: 10, fontWeight: 'bold' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>Thumbnail</Text>
            </View>
            <View style={{ width: width * 0.35, marginLeft: 10, fontWeight: 'bold' }}>
                <Text style={{ color: 'white', fontSize: 30, marginLeft: 50 }}>หมายเหตุ</Text>
            </View>
        </View>
    }
    const renderList = ({ item, index }) => {
        return <View style={[{ flex: 1, flexDirection: 'row', padding: 20 }, index % 2 == 0 ? { backgroundColor: '#eeeeee' } : {}]} key={index}>
            <View style={{ width: '10%' }}>
                <Text style={{ color: 'black', fontSize: 30 }}>{index + 1}</Text>
            </View>
            <View style={{ width: width * 0.2, marginLeft: 10 }}>
                <Text style={{ color: 'black', fontSize: 30 }}>{item.dispenserNo}</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10 }}>
                <Text style={{ color: 'black', fontSize: 30 }}>{item.nozzleNo}</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10 }}>
                <Text style={{ color: 'black', fontSize: 30 }}>{item.gasNameTh}</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10 }}>
                <Text style={{ color: 'black', fontSize: 30 }}>{item.recRunNo}</Text>
            </View>
            <View style={{ width: width * 0.25, marginLeft: 10 }}>
                <Text style={{ color: 'black', fontSize: 30 }}>{item.prevRecRunNo}</Text>
            </View>
            <TouchableOpacity style={{ width: width * 0.2, marginLeft: 10 }} onPress={() => {
                setPreViewImg({ uri: convertImage(item.fileUrl) })
            }}>
                {item.fileUrl && <Image source={{ uri: convertImage(item.fileUrl) }} style={{ width: width * 0.08, height: height * 0.03, marginLeft: width * 0.04 }} />}
            </TouchableOpacity>
            <View style={{ width: width * 0.3, marginLeft: 10, marginRight: 20 }}>
                <Text style={{ width: width * 0.22, color: 'black', fontSize: 30 }} numberOfLines={1}>{item.remark}</Text>
            </View>
        </View>
    }
    return (
        <View style={{ backgroundColor: 'white' }}>
            <Header />
            <ScrollView style={{ padding: '5%' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>จดมิเตอร์</Text>
                    </View>
                    <TouchableOpacity style={{ }} onPress={() => {
                        setMeter({
                            meterId: "",
                            gasId: "",
                            gasId: "",
                            dispenserNo: '',
                            nozzleNo: '',
                            qrcode: "",
                            meterActiveFlag: "",
                            meterCreateUser: "",
                            meterCreateDtm: "",
                            meterUpdateUser: "",
                            meterUpdateDtm: "",
                            gasNameTh: "",
                            gasNameEn: "",
                            gasCode: "",
                            fileId: "",
                            recMeterId: "",
                            fileName: "",
                            fileExt: "",
                            fileSize: "",
                            recRunNo: "",
                            remark: "",
                            oldRecRunNo: "",
                            custNameTh: planTrip.accName,
                            fileUrl: ''
                        })
                        navigation.navigate('ScanQr')
                    }}>
                        <Image source={require('../../assets/images/icon-scan.png')} style={{ marginTop: 10 }} />
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 35, }}>เฉพาะ Bu น้ำมัน</Text>

                <View style={{ flexDirection: 'row', marginTop: '3%' }}>
                    <View style={{ flex: 0.5, marginRight: '2%' }}>
                        <View>
                            <CTextInput title="Station" titleStyle={{ corlo: 'black' }} editable={false} value={meter ? `${meter.custNameTh}` : ''} />
                        </View>
                    </View>
                    <View style={{ flex: 0.5, marginLeft: '2%' }}>
                        <CTextInput title="เลขตู้ " value={meter ? `${meter.dispenserNo}` : ''} ref={el => inputRef.current.dispenserNo = el}
                            onChangeText={(e) => {
                                let obj = { ...meter }
                                obj.dispenserNo = e
                                obj.gasNameTh = ''
                                obj.nozzleNo = ''
                                obj.recRunNo = ''
                                setMeter(obj)
                            }}
                            maxLength={2} keyboardType="numeric"
                            massageError={'กรุณาระบุ เลขตู้้'}
                            typeKeyboard={'numeric'}
                            REQUIRETITLE
                            type={'Num'}
                            require={true} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: '3%' }}>
                    <View style={{ flex: 0.5, marginRight: '2%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <CTextInput title="เลขมือจ่าย " value={meter ? `${meter.nozzleNo}` : ''} ref={el => inputRef.current.nozzleNo = el}
                                onChangeText={(e) => {
                                    filterDispenSerNo(e, meter)
                                }}
                                massageError={'กรุณาระบุ เลขมือจ่าย'}
                                maxLength={2} keyboardType="numeric"
                                typeKeyboard={'numeric'}
                                REQUIRETITLE
                                require={true} type={'Num'} />
                        </View>
                    </View>
                    <View style={{ flex: 0.5, marginLeft: '2%' }}>
                        <CTextInput title="ผลิตภัณฑ์" editable={false} value={meter ? meter.gasNameTh : ''} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: '3%' }}>
                    <View style={{ flex: 0.5, marginRight: '2%' }}>
                        <View>
                            <CTextInput title="เลขมิเตอร์ 7 หลัก " value={meter ? `${meter.recRunNo}` : ''} ref={el => inputRef.current.recRunNo = el}
                                onChangeText={(e) => {
                                    let obj = { ...meter }
                                    obj.recRunNo = e
                                    setMeter(obj)
                                }}
                                massageError={'กรุณาระบุ เลขมิเตอร์ 7 หลัก'}
                                maxLength={7} keyboardType="numeric"
                                typeKeyboard={'numeric'}
                                REQUIRETITLE
                                require={true} type={'Num'} />
                            {/* <CTextInput title="เลขมิเตอร์ 7 หลัก " value={meter ? meter.recRunNo : ''} ref={el => inputRef.current.recRunNo = el} require= {true} maxLength={7} type='NUMERIC'
                                REQUIRETITLE
                             massageError={'กรุณาระบุ เลขมิเตอร์ 7 หลัก'}
                             typeKeyboard={'numeric'}
                             type={'Num'}
                            /> */}
                        </View>
                    </View>
                    <View style={{ flex: 0.5, marginLeft: '2%' }}>
                        <CTextInput title="หมายเหตุ" value={meter ? meter.remark : ''} ref={el => inputRef.current.remark = el} onChangeText={(e) => {
                            let obj = { ...meter }
                            obj.remark
                            setMeter(obj)
                        }} maxLength={250} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: '5%' }}>
                    <View style={{ flex: 0.5, marginRight: '2%' }}>
                        {imgLoad ?
                            <View style={{ marginTop: '5%' }}>
                                <ActivityIndicator
                                    animating={true}
                                    size="large"
                                    color={colors.primary} />
                            </View>
                            :
                            <View>
                                {meter && meter.fileUrl ? <View>
                                    <Image source={{ uri: convertImage(meter.fileUrl) }} style={{ marginTop: 10, width: 150, height: 150 }} />
                                    <TouchableOpacity onPress={() => {
                                        let obj = { ...meter }
                                        obj.fileUrl = ''
                                        setMeter(obj)
                                    }}>
                                        <Text style={{ fontSize: FONT_SIZE.TEXT }} >แก้ไข</Text>
                                    </TouchableOpacity>
                                </View> :
                                    <TouchableOpacity onPress={chooseImage}>
                                        <Text style={{ fontSize: FONT_SIZE.TEXT }}>ถ่ายภาพ</Text>
                                        <Image source={require('../../assets/images/ic_choose_camera.png')} style={{ marginTop: '3%', width: 50, height: 50 }} />

                                    </TouchableOpacity>
                                }
                            </View>
                        }
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 0.5, marginRight: 20 }}>
                        <View>
                        </View>
                    </View>
                    <View style={{ flex: 0.5, marginRight: 20 }}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 10, paddingLeft: 10, paddingRight: 10 }} onPress={() => addMeter()}>
                                <Text style={{ fontSize: FONT_SIZE.TEXT, color: 'white' }}>+ Add</Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1, marginTop: 20 }}>
                    <View style={[styles.container]}>
                        <Modal visible={previewImg ? true : false}
                            title={''}
                            TWOBUTTON={false}
                            onPressConfirm={() => setPreViewImg(null)}
                            onPressCancel={() => setPreViewImg(null)}
                            containerWidth={'90%'}
                        >
                            <View style={{ padding: 20 }}>
                                <Image source={previewImg} style={{ alignSelf: 'center', width: width * 0.8, height: height * 0.6 }} resizeMode="contain" />
                            </View>
                        </Modal>
                        <ModalWarning
                            visible={isError}
                            onlyCloseButton
                            onPressClose={() => {
                                setIsError(false)
                                setMsgError('')
                            }}
                            detailText={msgError}
                        />
                        {/* <Modal visible = {isError}
                            title = {'แจ้งเตือน'}
                            TWOBUTTON={false}
                            onPressConfirm={()=>{
                                setIsError(false)
                                setMsgError('')
                                // dispatch(setCallbackTemplate())
                                // navigation.goBack()
                            }}
                            onPressCancel={()=>{
                                setIsError(false)
                                setMsgError('')
                            //    dispatch(setCallbackTemplate())
                            //    navigation.goBack()
                            }}
                            >
                                <View style={{padding:20}}>
                                <Text>{msgError}</Text>
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
                        {/* <ModalWarning
                            visible={isError}
                            onlyCloseButton
                            onPressClose={()=>{
                                setIsError(false)
                                // setIsSuccess(false)
                                // dispatch(setCallbackTemplate())
                                // navigation.goBack()
                            }}
                            detailText={msgError}
                        /> */}
                        <Modal visible={isConfirm}
                            title={'แจ้งเตือน'}
                            closeHeaderButton={true}
                            TWOBUTTON={true}
                            onPressConfirm={() => {
                                confirmAdd();
                            }}
                            onPressCancel={() => {
                                setIsConfirm(false)
                                setConfirmMessage('')
                            }}
                        >
                            <View style={{ padding: '5%', alignItems: 'center' }}>
                                <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>{confirmMessage}</Text>
                            </View>
                        </Modal>
                        <ScrollView horizontal={true} >
                            <FlatList
                                data={tasks}
                                renderItem={(template) => renderList(template)}
                                ListHeaderComponent={renderHeader}
                                keyExtractor={(item, index) => index}
                                ListEmptyComponent={() => {
                                    return <View style={{ flex: 1, alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                                        <Text>ไม่พบข้อมูล</Text>
                                    </View>
                                }}
                            />
                        </ScrollView>
                    </View>
                </View>
                
                {
                    saveLoad ? 
                    <View style={{ alignSelf: 'center', marginBottom: 80 }}>
                        <ActivityIndicator
                            animating={true}
                            size="large"
                            color={colors.primary} />
                    </View> 
                    : 
                    <TouchableOpacity disabled={!isSave} style={{ alignSelf: 'center', backgroundColor: isSave ? colors.primary : colors.disabled, padding: 15, borderRadius: 10, marginBottom: 100, marginTop: 20 }} onPress={() => onSave()}>
                        <Text style={{ marginLeft: width * 0.1, marginRight: width * 0.1, fontSize: 30, color: 'white', fontWeight: 'bold' }}>Save</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default Meter;

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import axios from  '../../api/Axios';

import { Button, TextInput, Text, SelectDropdown, Loading, ContactInfo, Address, Header, ModalWarning, Modal } from '../../components'
import colors from '../../utility/colors'; 
import language from '../../language/th.json';
import { FONT_SIZE } from '../../utility/enum';
import { getInputData, validateLatLng } from '../../utility/helper';
import { getBrand, addProspect, actionClearPros } from '../../actions/prospectAction';
import { URL } from '../../api/url';
import DownloadFile from '../../components/DownloadFile';
import { baseUrl } from '../../api/Axios';

const createProspect = () => {

    const navigation = useNavigation();
    const inputRef = useRef({});
    const {prospectReducer,authReducer,getUserProfileReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const [brand, setBrand] = useState([]);
    const [modalVisible, setmodalVisible] = useState(false);
    const [modalUplodeVisible, setmodalUplodeVisible] = useState(false);
    const [modalVisibleConfirm, setmodalVisibleConfirm] = useState(false);
    const [modalWarningUplode, setmodalWarningUplode] = useState(false);
    const [uplodeDetailError, setUplodeDetailError] = useState();
    const [modalUplodeDetail, setmodalUplodeDetail] = useState(false);
    const [uplodeDetail, setUplodeDetail] = useState();
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    const [perButtonUplode, setPerButtonUplode] = useState(false);
    const [modalLat, setmodalLat] = useState(false);
    const [modalLong, setmodalLong] = useState(false);
    const [modalLatLong, setmodalLatLong] = useState(false);
    const [singleFile, setSingleFile] = useState(null);
    let listPermission = authReducer.userProfile.listPermObjCode;
    let listPermissionUser = getUserProfileReducer.dataUserProfile.listPermObjCode;
    const [dataVatNumber, setDataVatNumber] = useState(false);
    const [dataIdentifyId, setDataIdentifyId] = useState(false);

    useEffect(() => {
        if (prospectReducer.brand_loading) {
            dispatch(getBrand()) 
        }
        // if(listPermission){
        //     findPermission()
        // }
    }, [])

    const findPermission = () =>{
        let ButtonUplode = listPermission.find((item) => {
            return item.permObjCode == "FE_ACC_PROSP_S011_UPLOAD"
        })
        if(ButtonUplode.permObjCode  == "FE_ACC_PROSP_S011_UPLOAD"){
            setPerButtonUplode(true)
        }
    }

    useEffect(() => {
        if (prospectReducer.createProspectloadingSuccess && !prospectReducer.createProsloadingError) {
            dispatch(addProspect())
            setmodalVisibleConfirm(true) 
            setmodalVisible(false)     
        } 
        
    }, [prospectReducer])


    useEffect(() => {
        if (!prospectReducer.brand_loading) {
            if (!prospectReducer.brand) return

            let addTitleBrand = prospectReducer.brand.map((item) => {
                return {...item, title: item.brandNameTh}
            })
            setBrand(addTitleBrand)
        }
    }, [prospectReducer.brand_loading])

    useEffect(() => {
        if (prospectReducer.createProspectloadingSuccess && prospectReducer.createProsloadingError)  {
            setmodalVisibleError(true)
            setmodalVisible(false)    
            setmodalVisibleConfirm(false) 
        }
    }, [prospectReducer.createProsloadingError])

    useFocusEffect(
        React.useCallback(() => {
                dispatch(getBrand()) 
            return () => {
                setUplodeDetail()
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef);

        if (!totalValue.isInvalid) {
            setmodalVisible(true)  
        }
    }

    const onPressConfirm = (even) => {
        setmodalVisible(even)
    }

    const onPressConfirmSucc = (even) => {
        let totalValue = getInputData(inputRef);

        setmodalVisible(false)
        let latData = totalValue.data.address.data.latitude
        let longData = totalValue.data.address.data.longitude

        if ((latData || longData) && !validateLatLng(latData, longData)) {
            if(latData && !longData) setmodalLat(true)
            if(!latData && longData) setmodalLong(true)
            if(latData && longData) setmodalLatLong(true)
            
        } else {
            dispatch(addProspect(totalValue.data));
        }
        // dispatch(addProspect(totalValue.data));
    }

    const onPressError = (event) => {
        setmodalVisibleError(event)
        dispatch(actionClearPros())
    }

    const onPressCloseWarningUplode  = (event) => {
        setmodalWarningUplode(event)
    }

    const onPressCloseUplodeDetail = () => {
        setmodalUplodeDetail(false)
        setUplodeDetail()
    }

    const handleClose = () => {
        setmodalVisibleError(false)
        setmodalVisible(false)     
        setmodalVisibleConfirm(false)
        dispatch(actionClearPros())
        navigation.navigate('ProspectScreen')
    }

    const onPressClose = () =>{
        setSingleFile()
        setmodalUplodeVisible(false)
    }

    const uploadImage = async () => {
        // Check if any file is selected or not
        if (singleFile != null) {
            let PathFile = singleFile[0].uri;
            let fileName = `${singleFile[0].name}`
            let typeFile = `${singleFile[0].type}`
            let File = PathFile.replace('content://', 'file://')
            const formData = new FormData();
            formData.append('ImageFile', {
                uri: PathFile,
                type: typeFile,
                name: fileName
             });
            const response = await axios.post(URL.importProspect,formData)
            if (response.data.errorCode == 'S_SUCCESS') {
                setUplodeDetail(response.data.data.records)
                setmodalUplodeVisible(false)
                setmodalUplodeDetail(true)
            }else{
                setUplodeDetailError(response.data.errorMessage)
                setmodalWarningUplode(true)
                setmodalUplodeVisible(false)
                setmodalUplodeDetail(false)
            }
        }else if(singleFile === null){
            setmodalWarningUplode(true)
        }
    };
    
    const selectFile = async () => {
        // Opening Document Picker to select one file
        try {
          const res = await DocumentPicker.pick({
            // Provide which type of file you want user to pick
            type: [DocumentPicker.types.xlsx,DocumentPicker.types.xls],
          });
          // Printing the log realted to the file
          // Setting the state to show single file attributes
          setSingleFile(res);
        } catch (err) {
          setSingleFile(null);
          // Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            // If user canceled the document selection
            alert('Canceled');
          } else {
            // For Unknown Error
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
    };

    const onPressFileDownlode = () => {
        let fileName = `${singleFile[0].name}`
        let file = fileName.split('.')
        let file_ext = file[1]
        DownloadFile(`${uplodeDetail[0].pathFileError}`,file_ext)
        }

    const onPressUplodeFile = () =>{
        setmodalUplodeVisible(true)
        setSingleFile()
    };

    const handleNavScreenButton = (permObjCode) => {  
        let premissionScreen = listPermissionUser.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        if (premissionScreen) return true;
        if (!premissionScreen) return false;
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <Header/>
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: colors.white, marginBottom: '3%'}}>
                    {/* Create */}
                    <View style={styles.topLabel}>
                        <View style={{flex: 1/2, marginLeft: '3%'}}>
                            <Text style={{fontSize: FONT_SIZE.HEADER}}>Create</Text>
                        </View>
                        <View style={styles.button}>
                            {
                                handleNavScreenButton('FE_ACC_PROSP_S011_UPLOAD') ?
                                    <Button
                                        typeIcon={'Ionicons'} 
                                        nameIcon={'add-outline'}
                                        title={'Upload File'}
                                        onPress={()=> onPressUplodeFile()}
                                    />
                                :
                                null
                            }
                        </View>
                    </View>

                    {/* Prospect Info */}
                    <View style={styles.titleLabel}>
                        <View style={styles.title}>
                            <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight: 'bold'}}> Prospect Info </Text>
                        </View>
                        <View style={styles.title}>
                            <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight: 'bold'}}> New Account </Text>
                        </View>
                            <View style={styles.input}>
                                <TextInput 
                                    ref={el => inputRef.current.accName = el} 
                                    REQUIRETITLE
                                    require
                                    title= {'ชื่อ'} 
                                    massageError={language.NAME}
                                    maxLength={250}
                                    isOnlyText = {true}
                                />
                            </View>
                            <View style={styles.input}>
                                <SelectDropdown 
                                    titleKey={"brandNameTh"}
                                    valueKey={"brandId"}
                                    dataList={brand}
                                    titleDropdown= {'แบรนด์'} 
                                    titleAlert= {'แบรนด์'} 
                                    ref={el => inputRef.current.brandId = el}
                                    massageError={language.BRAND}
                                />
                            </View>
                            <View style={[styles.input,{flexDirection: 'row'}]}>
                                <View style={{flex: 1}}>
                                    <TextInput 
                                        ref={el => inputRef.current.identifyId = el}
                                        type="ThaiEnNum"
                                        title= {'Vat Number'}
                                        maxLength={13}
                                        vatNo
                                        require={dataIdentifyId}
                                        onChangeText={(dataInput)=>{
                                            if (dataInput) {
                                                return setDataVatNumber(true)
                                            }
                                            return setDataVatNumber(false)
                                        }}
                                    />
                                </View>
                                <View style={{flex: 0.2, paddingTop: 45, alignItems: 'center'}}>
                                    <Text> - </Text>
                                </View>
                                <View style={{flex: 0.6, alignSelf: 'flex-end'}}>
                                    <TextInput 
                                        TITLE={false}
                                        ref={el => inputRef.current.vatNumber = el}
                                        type="ThaiEnNum"
                                        maxLength={5}
                                        require={dataVatNumber}
                                        onChangeText={(dataInput)=>{
                                            if (dataInput) {
                                                return setDataIdentifyId(true)
                                            }
                                            return setDataIdentifyId(false)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.input}>
                                <TextInput 
                                    ref={el => inputRef.current.accGroupRef = el}
                                    // type="ThaiEnNum" 
                                    title={'Prospect Group Rep.'}
                                    // maxLength={20}
                                    typeKeyboard={"numeric"}
                                    type="Num"
                                    maxLength={13}
                                />
                            </View>
                    </View>
                    
                    {/* Address */}
                    <Address CREATEPROSPECT={true} ref={el => inputRef.current.address = el}/>     
                </View>
                <View style={{backgroundColor: colors.white, paddingBottom: '10%'}}>
                    {/* Contact Info */}
                    <ContactInfo CREATEPROSPECT={true} ref={el => inputRef.current.contactInfo = el} editable={true}/>
                    
                    {/* Button */}
                    <View style={{ flex: 1, flexDirection: 'row' ,paddingHorizontal: '3%', justifyContent: 'center'}}>
                        <View style={[styles.buttonLow, { alignItems: 'flex-end' }]}>
                            <Button
                                width={'80%'}
                                title={'Cancel'}
                                fontColor={colors.primary}
                                color={colors.white}
                                onPress={() => handleClose()}
                            />
                        </View>
                        <View style={[styles.buttonLow, { alignItems: 'flex-start'}]}>
                            <Button
                                onPress={handleSubmit}
                                width={'80%'}
                                title={'Save'}/>
                            <ModalWarning
                                visible={modalVisible}
                                detailText={language.CONFIRN}
                                onPressConfirm={()=> onPressConfirmSucc(true)}
                                onPressCancel={()=> onPressConfirm(false)}
                            />
                            <ModalWarning
                                visible={modalVisibleConfirm}
                                onlyCloseButton
                                onPressClose={()=> navigation.navigate('ProspectScreen') && dispatch(actionClearPros())}
                                detailText={language.ADDSUCCESS}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Modal 
                visible={modalUplodeVisible}
                onPressCancel={()=> onPressClose()}
                title={'Upload File'}
                TWOBUTTON
                cancelText={'Browse'}
                confirmText={'Upload'}
                onPressSelectUplode={selectFile}
                onPressUplode={uploadImage}
                disabledUplodeButton={singleFile != null && singleFile[0].type === DocumentPicker.types.xlsx || singleFile != null && singleFile[0].type === DocumentPicker.types.xls ? false:true}
            >      
              <View style={{marginVertical :'3%'}}>
              {singleFile != null && singleFile[0].type === DocumentPicker.types.xlsx || singleFile != null && singleFile[0].type === DocumentPicker.types.xls ? 
                <Text style={styles.textStyle}>
                    File:   {singleFile && singleFile[0].name ? singleFile[0].name : ''}
                </Text>   
                : 
                null
                }
              </View> 
            </Modal>
            <Modal 
                visible={modalUplodeDetail}
                onPressButton={()=> onPressCloseUplodeDetail()}
                title={'Uplode File'}
                BUTTON
                confirmText={'Close'}
                closeHeaderButton={false}
            >      
              <View style={{marginVertical :'3%'}}>
              { uplodeDetail && uplodeDetail.length != 0 ? 
                <View style={{marginHorizontal:'5%', marginBottom:'5%'}}>
                    <Text>
                        Total Record:   {uplodeDetail && uplodeDetail[0].totalRecord ? uplodeDetail[0].totalRecord : '0'}
                    </Text> 
                    <Text>
                        Success:   {uplodeDetail && uplodeDetail[0].totalSuccess ? uplodeDetail[0].totalSuccess : '0'}
                    </Text>  
                    <Text>
                        Fail:   {uplodeDetail && uplodeDetail[0].totalFailed ? uplodeDetail[0].totalFailed : '0'}
                    </Text>  
                    <Text>
                        File Path:   
                    </Text>  
                    {
                        uplodeDetail && uplodeDetail[0].pathFileError ? 
                        <TouchableOpacity onPress={() => onPressFileDownlode()}>
                            <Text style={{color:colors.primary}}>
                                {uplodeDetail[0].pathFileError}
                            </Text>
                        </TouchableOpacity>
                        :
                        <Text> - </Text>
                    }
                </View> 
                : 
                null
                }
              </View> 
            </Modal>
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={prospectReducer.createProsErrorMSG}/>
            <ModalWarning
                visible={modalWarningUplode}
                WARNINGTITLE
                onPressClose={()=> onPressCloseWarningUplode(false)}
                onlyCloseButton
                detailText={uplodeDetailError}/>
            <ModalWarning
                visible={modalLat}
                WARNINGTITLE
                onPressClose={()=> setmodalLat(false)}
                onlyCloseButton
                detailText={language.latLongValidate}/>
            <ModalWarning
                visible={modalLong}
                WARNINGTITLE
                onPressClose={()=> setmodalLong(false)}
                onlyCloseButton
                detailText={language.latLongValidate}/>
            <ModalWarning
                visible={modalLatLong}
                WARNINGTITLE
                onPressClose={()=> setmodalLatLong(false)}
                onlyCloseButton
                detailText={language.latLongValidate}/>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.grayborder,
    },
    topLabel: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        marginTop: '3%',
        justifyContent: 'space-between',
        paddingHorizontal: '3%'
    },
    button: {
        flex: 1/3,
        alignItems: 'center',
        paddingHorizontal: '5%',
    },
    titleLabel: {
        flex: 1,
        justifyContent: 'center',
        padding: '5%'
    },
    title: {
        paddingVertical: '2%' ,
    },
    rowLabel: {
        flex: 1,
        // flexDirection: 'row',
        width: '100%',
        // paddingVertical: 15,
    },
    input: {
        flex: 1/2,
        paddingVertical: '2%'
    },
    lalongLabel: {
        flexDirection: 'row',
        flex: 1/2,
        paddingHorizontal: 15
    },
    buttonLow: {
        flex: 1,
        paddingHorizontal: '3%',
        marginVertical: '3%',
    },
    textStyle: {
        fontSize: 25,
        marginTop: '5%',
        textAlign: 'center',
    },  
})

export default createProspect;
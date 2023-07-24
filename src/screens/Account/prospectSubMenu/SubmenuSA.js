import React, {useRef, useState,useEffect} from 'react';
import { View, StyleSheet, ScrollView,FlatList, TouchableOpacity, Modal as RnModal } from 'react-native';
import { Switch } from 'native-base';
import { Button, TextInput, Text, SelectDropdown, ContactInfo, Address, Modal, CheckBox, ModalWarning, PickerDate } from '../../../components'
import colors from '../../../utility/colors';
import { FONT_SIZE } from '../../../utility/enum';
import language from '../../../language/th.json';
import { getInputData, resetInputData } from '../../../utility/helper';
import {serviceType,configLov,searchBrand,searchBrandCate,searchLocType,searchProspectId,updateProspectId } from '../../../actions/TemplateSaAction'
import {useSelector} from 'react-redux';
import { Icon } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import dayjs from 'dayjs';
import 'dayjs/locale/th'

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const SubmenuSA = (props) => {
    const {prospectSelectInfoReducer} = useSelector((state) => state);
    const {prospectReducer} = useSelector((state) => state);
    const [isProspect,setIsProspect] = useState(prospectSelectInfoReducer.dataSelect.isProspect ? true : false)
    const [isCustomer,setIsCustomer] = useState(prospectSelectInfoReducer.dataSelect.isCustomer ? true : false)
    const [isRentStation,setIsRentStation] = useState(prospectSelectInfoReducer.dataSelect.isRentStation ? true : false)
    const [isOther,setIsOther] = useState(prospectSelectInfoReducer.dataSelect.isOther ? true : false)
    const [isRecommandBUProspect,setIsRecommandBUProspect] = useState(prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ? true : false)
    const [modalVisibleType, setmodalVisibleType] = useState(false);
    const [modalVisibleConfirm, setModalVisibleConfirm] = useState(false);
    const [types,setTypes] = useState([]);
    const [configLovs , setConfigLov] = useState([]);
    const [brands , setBrands] = useState([]);
    const [brandCates , setbrandCates] = useState([]);
    const [expectCustomer,setexpectCustomer] = useState([{interestStatus:'R',label:'สนใจเช่า'},{interestStatus:'S',label:'สนใจขาย'},{interestStatus:'O',label:'อื่นๆ'}])
    const [licenes,setLicenes] = useState([{licenseStatus:'Y',label:'มี'},{licenseStatus:'N',label:'ไม่มี'},{licenseStatus:'O',label:'อื่นๆ'}])
    const [gasStatus,setGasStatus] = useState([{stationOpenFlag:'Y',label:'เปิดบริการ'},{stationOpenFlag:'N',label:'ไม่เปิดบริการ'}])
    const [prospect,setProspect] = useState(prospectSelectInfoReducer.dataSelect);
    const [modalVisible, setmodalVisible] = useState(false);
    const [modalServiceTypeVisible, setModalServiceTypeVisible] = useState(false);
    const [serviceTypeList , setServiceTypeList] = useState([])
    const [locType,setLocType] = useState([]);
    const [numberProspectType, setNumberProspectType] = useState(0);
    const [selectted, setSelected] = useState(false)
    const navigation = useNavigation();
    const [selectDateO,setSelectDateO] = useState('')
    const [selectDateT,setSelectDateT] = useState('')
    const [serviceTypeListFisrt, setServiceTypeListFisrt] = useState([]);

    useEffect(()=>{
        searchProspecDetail();
        getLocType();
        getServiceType();
        getConfigLov();
        getbrands();
        getbrandCates();
    },[])

    useFocusEffect(
        React.useCallback(() => {
                resetInputData(inputRef);
                getLocType();
                getServiceType();
                getConfigLov();
                getbrands();
                getbrandCates();
                searchProspecDetail();
            return () => {
            setSelectDateT('')
            setSelectDateO('')
          };
        }, [])
    );

    const checkDate = (date) => {
        setSelectDateO(date)

        if (selectDateT) {
            let fromY = new Date(date)
            // fromY = fromY.setFullYear(fromY.getFullYear())
            let toY = new Date(selectDateT)

            if (fromY > toY) setSelectDateT(null)
        }

        // if (selectDateT) {
        //     let fromD = new Date(date)
        //     fromD = dayjs(fromD).format('D/M/YYYY')
        //     let toD = dayjs(selectDateT).format('D/M/YYYY')

        //     if (fromD > toD) setSelectDateT(null)
        // }
    }

    useEffect(() => {
        if (prospect.prospectModel && prospect.prospectModel.prospectType) {
            let value = prospect.prospectModel.prospectType.trim()
            if (value == "0") return setSelected(false)
            if (value == "1") return setSelected(true)
            if (value == "2") return setSelected(false)
        }
    }, [prospect.prospectModel])

    useEffect(() => {
        mapServiceType()
    }, [prospect.prospectAccountModel])

    const mapServiceType = async () => {
        if (prospect.prospectModel && prospect.prospectModel.servicesTypeId) {
            let typeData = types || await serviceType();
            let splitService = prospect.prospectModel.servicesTypeId.split(',')

            let findData = typeData.filter((item) => {
                return splitService.find((spService) => spService == item.serviceTypeId)
            })

            setServiceTypeList(findData)
            setServiceTypeListFisrt(findData)
        }
    }

    const getServiceType = async ()=>{
        const data = await serviceType();
        setTypes(data)
    }
    const getConfigLov = async ()=>{
        
        const data = await configLov();
        setConfigLov(data)
    }
    const getbrands = async ()=>{
        const data = await searchBrand();
        setBrands(data)
    }
    const getbrandCates = async ()=>{
        const data = await searchBrandCate();
        setbrandCates(data)
    }
    const onPressModalAlert = (event) => {
        setmodalVisible(event);
        setModalVisibleConfirm(false);
        
        if (isProspect) {
            if (!event && numberProspectType == 1) {
                navigation.navigate('ProspectScreen');
            }
        }
        if (isCustomer) return
        if (isRentStation) {
            if (!event && numberProspectType == 0) {
                navigation.navigate('GasStationRentalScreen');
            }
        }
        if (isOther) return

    }
    const onPressModalAlertConfirm = async (event) => {
        let totalValue = getInputData(inputRef, 'C');

        if (JSON.stringify(serviceTypeList) != JSON.stringify(serviceTypeListFisrt)) {
            if (totalValue.changeField) totalValue.changeField = `${totalValue.changeField}, ประเภทบริการ`
            if (!totalValue.changeField) totalValue.changeField = `ประเภทบริการ`
        };

        if (selectted != prospect.prospectModel.prospectType) {
            if (totalValue.changeField) totalValue.changeField = `${totalValue.changeField}, ปั๊มเช่า`
            if (!totalValue.changeField) totalValue.changeField = `ปั๊มเช่า`
        };

        await updateProspectId(totalValue,prospect,serviceTypeList,numberProspectType);
        setModalVisibleConfirm(event);
        setmodalVisible(false);
    } 
    const getLocType = async () =>{
        const data = await  searchLocType()
        setLocType(data)
    }
    const searchProspecDetail = async () =>{
        const data = await  searchProspectId(prospect.prospect.prospectId)
        if(data){
            const prospectAccountModel = {
                prospAccId:data.prospAccId,
                accName:data.accName,
                brandId:data.brandId,
                custCode:data.custCode,
                identifyId:data.identifyId,
                accGroupRef:data.accGroupRef,
                remark:data.accountRemark,
                sourceType:data.sourceType,
                activeFlag:data.activeFlag
            }
            const prospectModel = {
                prospectId:data.prospectId,
                prospAccId:data.prospAccId,
                buId:data.buId,
                servicesTypeId:data.servicesTypeId,
                locTypeId:data.locTypeId,
                saleRepId:data.saleRepId,
                prospectType:data.prospectType,
                stationName:data.stationName,
                stationOpenFlag:data.stationOpenFlag,
                reasonCancel:data.reasonCancel,
                brandCateId:data.brandCateId,
                brandCateOther:data.brandCateOther,
                areaSquareWa:data.areaSquareWa,
                areaNgan:data.areaNgan,
                areaRai:data.areaRai,
                areaWidthMeter:data.areaWidthMeter,
                shopJoint:data.shopJoint,
                licenseStatus:data.licenseStatus,
                licenseOther:data.licenseOther,
                interestStatus:data.interestStatus,
                interestOther:data.interestOther,
                saleVolume:data.saleVolume,
                saleVolumeRef:data.saleVolumeRef,
                progressDate:data.progressDate,
                terminateDate:data.terminateDate,
                nearBankId:data.nearBankId,
                quotaOil:data.quotaOil,
                quotaLube:data.quotaLube,
                dispenserTotal:data.dispenserTotal,
                nozzleTotal:data.nozzleTotal,
                addrTitleDeedNo:data.addrTitleDeedNo,
                addrCertUtilisation:data.addrCertUtilisation,
                addrParcelNo:data.addrParcelNo,
                addrTambonNo:data.addrTambonNo,
                dbdCode:data.dbdCode,
                dbdCorpType:data.dbdCorpType,
                dbdJuristicStatus:data.dbdJuristicStatus,
                dbdRegCapital:data.dbdRegCapital,
                dbdTotalIncome:data.dbdTotalIncome,
                dbdProfitLoss:data.dbdProfitLoss,
                dbdTotalAsset:data.dbdTotalAsset,
                dbdTotalAsset:data.dbdTotalAsset,
                dbdFleetCard:data.dbdFleetCard,
                dbdCorpCard:data.dbdCorpCard,
                dbdOilConsuption:data.dbdOilConsuption,
                dbdCurrentStation:data.dbdCurrentStation,
                dbdPayChannel:data.dbdPayChannel,
                dbdCarWheel4:data.dbdCarWheel4,
                dbdCarWheel6:data.dbdCarWheel6,
                dbdCarWheel8:data.dbdCarWheel8,
                dbdCaravan:data.dbdCaravan,
                dbdCarTrailer:data.dbdCarTrailer,
                dbdCarContainer:data.dbdCarContainer,
                dbdOther:data.dbdOther,
                dbdTank:data.dbdTank,
                dbdStation:data.dbdStation,
                dbdType2:data.dbdType2,
                dbdMaintainCenter:data.dbdMaintainCenter,
                dbdGeneralGarage:data.dbdGeneralGarage,
                dbdMaintainDept:data.dbdMaintainDept,
                dbdRecommender:data.dbdRecommender,
                dbdSale:data.dbdSale,
                dbdSaleSupport:data.dbdSaleSupport,
                dbdRemark:data.dbdRemark,
                mainFlag:data.mainFlag,
                prospectStatus:data.prospectStatus
            }
            const prospectAddressModel = {
                prospAddrId: data.prospAddrId,
                prospectId: data.prospectId,
                prospAccId: data.prospAccId,
                addrNo: data.addrNo,
                moo: data.moo,
                soi: data.soi,
                street: data.street,
                tellNo: data.tellNo,
                faxNo: data.addressFaxNo,
                latitude: data.latitude,
                longitude: data.longitude,
                regionCode: data.regionCode,
                provinceCode: data.provinceCode,
                provinceDbd: data.provinceDbd,
                districtCode: data.districtCode,
                subdistrictCode: data.subdistrictCode,
                postCode: data.postCode,
                remark: data.addressRemark,
                mainFlag: data.mainFlag,
                activeFlag: data.activeFlag
            }
            const prospectContactModel = {
                prospContactId: data.prospContactId,
                prospectId: data.prospectId,
                prospAccId: data.prospAccId,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNo: data.phoneNo,
                faxNo: data.contactFaxNo,
                mobileNo: data.mobileNo,
                email: data.email,
                mainFlag: data.mainFlag,
                activeFlag: data.activeFlag
            }
            setProspect({...prospect,prospectAccountModel,prospectModel,prospectAddressModel,prospectContactModel})
        }
    }
    const inputRef = useRef({});

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef, 'C');

        if (!totalValue.isInvalid) {
            setmodalVisible(true);
            if (isRentStation && selectted == true) return setNumberProspectType(1);
            if (isCustomer) return setNumberProspectType(2);
        }
    }

    const serviceTypeSelected = (object) =>{
        let index = serviceTypeList.findIndex(service=> {
            return service.serviceTypeId === object.serviceTypeId         
        })

        if(index>-1){
            let list = serviceTypeList;
            let itemFind = serviceTypeList.filter((item) => {
                return item.serviceTypeId != object.serviceTypeId         
            })
            setServiceTypeList(itemFind)
        }else{
            setServiceTypeList(serviceTypeList=>[...serviceTypeList,object])
        }
    }

    const getTitleServiceType = () =>{

        if (serviceTypeList.length < 3) {
            let showName = serviceTypeList.map((item) => {
                return item.serviceNameTh
            })
            return showName.toString()
        };

        return `${serviceTypeList.length} selected`
    }

    const handleSelectCustomer = (value) => {
        setSelected(value);

        if (value == true) {
            setNumberProspectType(1);
        } else {
            setNumberProspectType(0);
        }
    };

    const handleDisable = (type) => {
        if (isCustomer) {
            if (type == "selectDropdown") return false
            if (type == "TextInput") return true
            if (type == "Radio") return false
        }
        else if (isRecommandBUProspect) {
            if (type == "selectDropdown") return true
            if (type == "TextInput") return false
            if (type == "Radio") return true
        }
        else if (isRentStation) {
            if (type == "selectDropdown") return false
            if (type == "TextInput") return true
            if (type == "Radio") return false
        }
        else if (isOther) {
            if (type == "selectDropdown") return true
            if (type == "TextInput") return false
            if (type == "Radio") return true
        }
        else {
            if (type == "selectDropdown") return false
            if (type == "TextInput") return true
            if (type == "Radio") return false
        }
    }

    const handleButton = () => {
        if (isCustomer) return true
        if (isRecommandBUProspect) return false
        if (isRentStation) return true
        if (isOther) return false

        return true
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={{backgroundColor: colors.white, marginBottom: '5%'}}>
                    {/* Creat */}
                        <View style={{ flex: 1, marginLeft: '5%', marginTop: '5%'}}>
                            <Text numberOfLines={1} style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{prospect.prospectAccount.accName}</Text>
                        </View>
                        <View style={{flex : 1}}>
                            <View style={styles.input}>
                                <TextInput editable={false} title={'Sales Rep'} value={prospect.prospectModel ? prospect.prospectModel.saleRepId : ''}/>
                                {/* <Text>Sales Rep</Text>
                                <View style={{marginVertical: 10}}>
                                    <Text>{prospect.prospectContact.firstName} {prospect.prospectContact.lastname}</Text>
                                </View> */}
                            </View>
                        </View>   

                    {/* Prospect Info */}
                    <View style={styles.titleLabel}>
                        <View style={[styles.title, {flexDirection: 'row', justifyContent: 'space-between', marginVertical: '3%'}]}>
                            {
                                prospectSelectInfoReducer.dataSelect.isCustomer === true ?
                                    <View style={styles.title}>
                                        <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight:'bold'}}>ข้อมูล Customer</Text>
                                    </View>
                                    :
                                    prospectSelectInfoReducer.dataSelect.isRentStation === true ?
                                        <View style={styles.title}>
                                            <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight:'bold'}}>ข้อมูลปั๊มเช่า</Text>
                                        </View>
                                    :
                                    prospectSelectInfoReducer.dataSelect.isOther === true ?
                                        <View style={styles.title}>
                                            <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight:'bold'}}>ข้อมูล Prospect</Text>
                                        </View>
                                :
                                <View style={styles.title}>
                                    <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight:'bold'}}>ข้อมูล Prospect</Text>
                                </View>
                            }
                            {
                                  prospectSelectInfoReducer.dataSelect.isCustomer === true ?
                                  null
                                  :
                                  <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end', alignItems:'center', marginTop: 10}}>
                                    <Text>ปั๊มเช่า</Text>
                                    <Switch
                                        value = {selectted}
                                        onValueChange = {handleSelectCustomer} style={{marginLeft: '3%'}}
                                        disabled={handleDisable("Radio")}
                                    />
                                </View>
                            }
                        </View>
                            <View style={styles.input}>
                                <SelectDropdown
                                    disabled={isRecommandBUProspect || isOther? true : isCustomer || isRentStation? false : false}
                                    REQUIRETITLE= {true}
                                    titleDropdown= {'สถานะบัญชี'} 
                                    titleAlert= {'สถานะบัญชี'} 
                                    dataList= {configLovs}
                                    titleKey={'lovNameTh'}
                                    defaultValue={prospect.prospectModel ? prospect.prospectModel.prospectStatus : ''}
                                    valueKey={'lovKeyvalue'}
                                    ref={el => inputRef.current.lovKeyvalue = el}
                                    require= {true}
                                    massageError={language.ACCOUNTSTATUS}
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />

                            </View>
                            <View style={styles.input}>
                                <SelectDropdown 
                                    disabled={handleDisable("selectDropdown")}
                                    REQUIRETITLE= {true}
                                    titleDropdown= {'ประเภท Site'} 
                                    titleAlert= {'ประเภท Site'} 
                                    dataList= {locType}
                                    defaultValue={prospect.prospectModel ? prospect.prospectModel.locTypeId : ''}
                                    titleKey={'locTypeNameTh'}
                                    valueKey={'locTypeId'}
                                    ref={el => inputRef.current.locTypeId = el}
                                    require= {true}
                                    massageError={language.SITETYPE}
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <View style={{
                                    borderRadius: 10, 
                                    width: '100%', 
                                    minWidth: 100,
                                }}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text>ประเภทบริการ</Text>
                                        <Text style={{color: true ? colors.white : colors.redButton, paddingHorizontal: 5}}></Text>
                                    </View>
                                    <TouchableOpacity style={[styles.selectBox, {backgroundColor: isRecommandBUProspect || isOther ? colors.grayTable : colors.white, height: 50,marginTop:5}]}
                                        onPress={()=>setModalServiceTypeVisible(true)} disabled={handleDisable("selectDropdown")}>
                                        {
                                            serviceTypeList.length || prospect.prospectModel && prospect.prospectModel.servicesTypeId.length ?
                                            <Text style={{color: isCustomer ?  colors.black : colors.black}}>{getTitleServiceType()}</Text>
                                            :
                                            handleDisable("selectDropdown") == true ?
                                            <Text style={{color: colors.gray}}>-</Text>
                                            :
                                            <Text style={{color: colors.gray}}>กรุณาเลือก</Text>
                                        }
                                        <Icon type="FontAwesome" name="angle-down" style={{color: handleDisable("selectDropdown") == true ? colors.grayTable : colors.black }}/>
                                    </TouchableOpacity>
                                </View>
                                
                                <Modal
                                    visible={modalServiceTypeVisible}
                                    onPressCancel={()=>setModalServiceTypeVisible(false)}
                                    title = {'ประเภทบริการ'}
                                    BUTTON = {false}
                                    confirmText= {'ประเภทบริการ'}
                                    onPressButton={()=>setModalServiceTypeVisible(false)}
                                >
                                    <ScrollView style={{marginHorizontal:'10%',marginTop:'5%', marginBottom:'10%', height:250}}> 
                                        <CheckBox 
                                            SelectDefault={types.length !=0 ? serviceTypeList.length === types.length : false }
                                            onPress={()=> serviceTypeList.length === types.length ?setServiceTypeList([]) : !isCustomer ?  setServiceTypeList(types) : setServiceTypeList(serviceTypeList) } 
                                            type ={'end'} 
                                            title = {'ทั้งหมด'}
                                            typeSelect ={'multiSelect'}
                                        />
                                    <FlatList
                                        data={types}
                                        renderItem={(data) =>
                                            <CheckBox
                                                SelectDefault={serviceTypeList.find(x => x.serviceTypeId === data.item.serviceTypeId)}
                                                data={data.item}
                                                onPress={(item)=> serviceTypeSelected(item)} 
                                                type ={'end'} 
                                                title = {data.item.serviceNameTh} 
                                                typeSelect ={'multiSelect'}
                                            />
                                        }
                                    />
                                    </ScrollView>
                                </Modal>
                            </View>
                            <View style={styles.input}>
                                <SelectDropdown
                                    disabled={handleDisable("selectDropdown")}
                                    REQUIRETITLE= {true}
                                    titleDropdown= {'แบรนด์'} 
                                    titleAlert= {'แบรนด์'} 
                                    dataList= {brands}
                                    defaultValue={prospect.prospectAccountModel ? prospect.prospectAccountModel.brandId : ''}
                                    valueKey={'brandId'}
                                    titleKey={'brandNameTh'}
                                    ref={el => inputRef.current.brandId = el}
                                    require= {true}
                                    massageError={language.BRAND}
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput 
                                    editable={handleDisable("TextInput")}  
                                    title={'ชื่อสถานี'} 
                                    ref={el => inputRef.current.stationName = el} 
                                    value={prospect.prospectModel ? prospect.prospectModel.stationName :''}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput 
                                    editable={handleDisable("TextInput")} 
                                    title={'เหตุผลการยกเลิก'} 
                                    ref={el => inputRef.current.reasonCancel = el} 
                                    value={prospect.prospectModel ? prospect.prospectModel.reasonCancel : ''}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <SelectDropdown 
                                    disabled={handleDisable("selectDropdown")}
                                    REQUIRETITLE= {true}
                                    titleDropdown= {'สถานะปั๊มน้ำมัน'} 
                                    titleAlert= {'สถานะปั๊มน้ำมัน'} 
                                    dataList= {gasStatus}
                                    titleKey={'label'}
                                    defaultValue={prospect.prospectModel ? prospect.prospectModel.stationOpenFlag : ''}
                                    valueKey={'stationOpenFlag'}
                                    ref={el => inputRef.current.stationOpenFlag = el}
                                    require= {true}
                                    massageError={language.OILSTATIONSTATUS} 
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput editable={handleDisable("TextInput")} title={'ร้านค้าเช่าภายในสถานีเช่า'} 
                                    value={prospect.prospectModel ? `${prospect.prospectModel.shopJoint}` : '' } 
                                    ref={el => inputRef.current.shopJoint = el}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <SelectDropdown 
                                    disabled={handleDisable("selectDropdown")}
                                    REQUIRETITLE= {true}
                                    titleDropdown= {'ประเภทผลิตภัณฑ์'} 
                                    titleAlert= {'ประเภทผลิตภัณฑ์'} 
                                    dataList= {brandCates}
                                    titleKey={'brandCateNameTh'}
                                    valueKey={'brandCateId'}
                                    defaultValue={prospect.prospectModel ? prospect.prospectModel.brandCateId : ''}
                                    ref={el => inputRef.current.brandCateId = el}
                                    require= {true}
                                    massageError={language.PRODUCTTYPE}
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput 
                                    editable={handleDisable("TextInput")} 
                                    title={'ประเภทผลิตภัณฑ์ (อื่นๆ)'} 
                                    // type="ThaiEn" 
                                    ref={el => inputRef.current.brandCateOther = el} 
                                    value={prospect.prospectModel ? prospect.prospectModel.brandCateOther : ''}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                        <View style={[styles.rowLabel, {paddingHorizontal: '5%', marginBottom: '2%'}]}>
                            <View style={{flex: 1, paddingRight: '2%'}}>
                                <TextInput editable={handleDisable("TextInput")} 
                                    title={'พื้นที่ (ไร่)'} 
                                    type="Num" 
                                    ref={el => inputRef.current.areaRai = el} 
                                    maxLength={6} 
                                    value={prospect.prospectModel && prospect.prospectModel.areaRai != null ? `${prospect.prospectModel.areaRai == 0 ? '0' : prospect.prospectModel.areaRai}` : '' } 
                                    massageError={language.AREARAI}
                                    typeKeyboard="numeric" 
                                    REQUIRETITLE 
                                    require 
                                    comma
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                            <View style={{flex: 1, paddingLeft: '2%'}}>
                                <TextInput editable={handleDisable("TextInput")} 
                                    title={'พื้นที่ (งาน)'} 
                                    type="NumToThree" 
                                    ref={el => inputRef.current.areaNgan = el} 
                                    maxLength={1}
                                    value={prospect.prospectModel && prospect.prospectModel.areaNgan != null ? `${prospect.prospectModel.areaNgan == 0 ? '0' : prospect.prospectModel.areaNgan}` : '' } 
                                    typeKeyboard="numeric" REQUIRETITLE require
                                    massageError={language.AREANGAN}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                        </View>
                        <View style={[styles.rowLabel, {paddingHorizontal: '5%', marginBottom: '2%'}]}>
                            <View style={{flex: 1, paddingRight: '2%'}}>
                                <TextInput editable={handleDisable("TextInput")} 
                                    title={'พื้นที่ (ตารางวา)'} 
                                    type="Num" ref={el => inputRef.current.areaSquareWa = el} 
                                    maxLength={2} 
                                    value={prospect.prospectModel && prospect.prospectModel.areaSquareWa != null ? `${prospect.prospectModel.areaSquareWa == 0 ? '0' : prospect.prospectModel.areaSquareWa}` : '' } 
                                    typeKeyboard="numeric" REQUIRETITLE require
                                    massageError={language.AREASQUAREWA}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                            <View style={{flex: 1, paddingLeft: '2%'}}>
                                <TextInput editable={handleDisable("TextInput")} 
                                    title={'หน้ากว้าง (เมตร)'} 
                                    type="Num" 
                                    ref={el => inputRef.current.areaWidthMeter = el}
                                    value={prospect.prospectModel ? `${prospect.prospectModel.areaWidthMeter ? prospect.prospectModel.areaWidthMeter : ''}` : '' } 
                                    maxLength={6} 
                                    typeKeyboard="numeric" 
                                    comma
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                        </View>
                            <View style={styles.input}>
                                <SelectDropdown 
                                    disabled={handleDisable("selectDropdown")}
                                    // REQUIRETITLE= {true}
                                    // require
                                    titleDropdown= {'สถานะใบอนุญาต'} 
                                    titleAlert= {'สถานะใบอนุญาต'} 
                                    dataList= {licenes}
                                    titleKey={'label'}
                                    defaultValue={prospect.prospectModel ? prospect.prospectModel.licenseStatus : ''}
                                    valueKey={'licenseStatus'}
                                    ref={el => inputRef.current.licenseStatus = el}
                                    // massageError={language.LICENSECUS}
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput title={'สถานะใบอนุญาต (กรณีอื่นๆ)'} 
                                    editable={handleDisable("TextInput")}
                                    value={prospect.prospectModel ? `${prospect.prospectModel.licenseOther}` : '' } 
                                    ref={el => inputRef.current.licenseOther = el}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                             <View style={styles.input}>
                                <SelectDropdown
                                    disabled={handleDisable("selectDropdown")}
                                    REQUIRETITLE= {true}
                                    titleDropdown= {'ความสนใจลูกค้า'} 
                                    titleAlert= {'ความสนใจลูกค้า'} 
                                    dataList= {expectCustomer}
                                    titleKey={'label'}
                                    valueKey={'interestStatus'}
                                    defaultValue={prospect.prospectModel ? prospect.prospectModel.interestStatus : ''}
                                    ref={el => inputRef.current.interestStatus = el}
                                    require= {true}
                                    massageError={language.INTERESTCUS}
                                    placeholder={handleDisable("selectDropdown") == true ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput title={'ความสนใจลูกค้า (กรณีอื่นๆ)'} 
                                    editable={handleDisable("TextInput")}
                                    value={prospect.prospectModel ? `${prospect.prospectModel.interestOther}` : '' } 
                                    ref={el => inputRef.current.interestOther = el}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput title={'ยอดขายต่อเดือน (ลิตร) 3 เดือนล่าสุด'}
                                    editable={handleDisable("TextInput")} 
                                    maxLength={13} type="Num" 
                                    typeKeyboard={"numeric"}
                                    value={prospect.prospectModel ? `${prospect.prospectModel.saleVolume ? prospect.prospectModel.saleVolume : ''}` : '' } 
                                    ref={el => inputRef.current.saleVolume = el} 
                                    comma
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                            <View style={styles.input}>
                                <TextInput 
                                    title={'อ้างอิงยอดขาย 3 เดือนล่าสุด'} 
                                    editable={handleDisable("TextInput")}  maxLength={250}
                                    value={prospect.prospectModel ? `${prospect.prospectModel.saleVolumeRef ? prospect.prospectModel.saleVolumeRef : ''}` : '' } 
                                    ref={el => inputRef.current.saleVolumeRef = el}
                                    placeholder={handleDisable("TextInput") == false ? '-' : ''}
                                />
                            </View>
                        <View style={[{paddingBottom: '10%'}]}>
                            <View style={styles.input}>
                                <PickerDate 
                                    disabled={handleDisable("selectDropdown")} 
                                    DateBoxWidth={'80%'} title={'ปีที่เปิดดำเนินการ'} TITLE={true} 
                                    dateValue={selectDateO ? selectDateO : prospect.prospectModel && prospect.prospectModel.progressDate != "" ? prospect.prospectModel.progressDate : ''} 
                                    ref={el => inputRef.current.progressDate = el}
                                    markDate={selectDateO ? selectDateO : prospect.prospectModel && prospect.prospectModel.progressDate ? prospect.prospectModel.progressDate : ''}
                                    onChange={(date)=>checkDate(date)}
                                />
                            </View>
                            <View style={styles.input}>
                                <PickerDate 
                                    disabled={handleDisable("selectDropdown")} 
                                    DateBoxWidth={'80%'} title={'วันหมดสัญญาเช่า'} TITLE={true} 
                                    dateValue={selectDateT ? selectDateT : prospect.prospectModel && prospect.prospectModel.terminateDate != "" ? prospect.prospectModel.terminateDate : ''} 
                                    ref={el => inputRef.current.terminateDate = el}
                                    markDate={selectDateT ? selectDateT : selectDateO ? selectDateO : prospect.prospectModel && prospect.prospectModel.terminateDate ? prospect.prospectModel.terminateDate : ''}
                                    onChange={(date)=>setSelectDateT(date)}
                                    minDate={selectDateO} 
                                />
                            </View>
                        </View>
                    </View>
                </View>
                
                <View style={{backgroundColor: colors.white, marginBottom: '5%'}}>
                    <Address editable={false} editableRemaek={isRecommandBUProspect || isOther? false : true} 
                        editableSA={isRecommandBUProspect || isOther? false : true} disabled={true} 
                        SA={true} saTab={prospect.prospectModel} ADDR={prospect.prospectAddressModel} 
                        ref={el => inputRef.current.Address = el}/>
                </View>

                <View style={{backgroundColor: colors.white, paddingBottom: '5%'}}>
                    <ContactInfo   editable={false} saTab={prospect.prospectContactModel} ref={el => inputRef.current.ContactInfo = el}></ContactInfo>

                    <View style={{ flex: 1, flexDirection: 'row' ,paddingHorizontal: '10%', justifyContent: 'center'}}>
                        {
                            handleButton() && <View style={styles.buttonLow}>
                                <Button
                                    onPress={() => handleSubmit()}
                                    title={'Save'}
                                    typeIcon={'MaterialIcons'}
                                    nameIcon={'done'}
                                    width={'40%'}/>
                                <ModalWarning
                                    visible={modalVisible}
                                    detailText={language.CONFIRN}
                                    onPressConfirm={() => onPressModalAlertConfirm(true)}
                                    // onPressCancel={() => onPressModalAlert(false)}/>
                                    onPressCancel={() => setmodalVisible(false)}/>
                                <ModalWarning
                                    visible={modalVisibleConfirm}
                                    detailText={language.CONFIRNSUCCESS}
                                    onlyCloseButton={true}
                                    onPressClose={() => onPressModalAlert(false)}/>
                            </View> 
                        }
                    </View>
                </View>
            </ScrollView>
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
        marginVertical: 20,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'stretch'
    },
    button: {
        flex: 1/5,
        alignItems: 'center',
        paddingHorizontal: '20%',
        justifyContent: 'center'
    },
    titleLabel: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        paddingHorizontal: '2%' ,
    },
    rowLabel: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    input: {
        flex: 1/2,
        paddingHorizontal: '5%',
        marginBottom: '2%'
    },
    lalongLabel: {
        flexDirection: 'row',
        flex: 1/2,
        paddingHorizontal: 15
    },
    buttonLow: {
        flex: 1,
        paddingHorizontal: '5%',
        marginVertical: '5%',
        alignItems: 'center',
        // maxWidth: 500
    },  
    selectBox: {
        borderColor: colors.grayborder,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: FONT_SIZE.TEXT,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 5,
        flexDirection: 'row',
    }
})

export default SubmenuSA;
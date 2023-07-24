import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux';
import { Switch } from 'native-base';

import { Text, TextInput, Button, Table, Header, Dropdown, ModalWarning, SelectDropdown, LoadingOverlay, CheckBox, FullTable } from '../../components';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import colors from '../../utility/colors';
import language from '../../language/th.json';
import { searchProvinceAction, searchLocTypeAction, getLocAction, cancelLocation } from '../../actions/masterAction';
import { getInputData } from '../../utility/helper';

const LocationMaster = () => {

    const navigation = useNavigation();  
    const {masterReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    const [isVisible , setIsVisible] = useState(false);
    const [modalVisibleDelete, setmodalVisibleDelect] =useState(false);
    const [modalVisibleDeleteConfirm, setmodalVisibleDelectConfirm] =useState(false);
    const [removeItem, setRemoveItem] = useState({});
    const [searchValue, setSearchValue] = useState({});
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    const [province, setProvince] = useState([]);
    const [locationType, setLocationType] = useState([]);
    const [currentPage, setCurrentPage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectCheckBox, setSelectCheckBox] = useState(false);
    const [isShowFullTable,setisShowFullTable] = useState(false);

    useEffect(() => {

        setIsVisible(false)

        if (!masterReducer.locationtype.length) {
            dispatch(searchLocTypeAction()) 
        }  

        if (masterReducer.location_loading) {
            dispatch(getLocAction({})) 
        }

        if (!masterReducer.province.length) {
            dispatch(searchProvinceAction()) 
        }

    }, [])

    useEffect(() => {
        if (!masterReducer.location_loading) {}

        if (masterReducer.removeLoc_loading && !masterReducer.removeLoc_error) {
            dispatch(getLocAction(searchValue))
        } 

        if (masterReducer.removeLoc_loading && masterReducer.removeLoc_error)  {
            setmodalVisibleError(true)
        }

        setIsLoading(false)
    }, [masterReducer])

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef);
        setIsVisible(false)
        setCurrentPage(1)
        let search = totalValue.data;

        if (totalValue == null) return

        let flagActive = ''
        if (selectCheckBox == true) flagActive = "Y"

        if (!totalValue.isInvalid) {
            setIsVisible(true)
            setSearchValue(search)
            dispatch(getLocAction(search, flagActive))
            setIsLoading(true)
        }
    }

    const handleClear = (value) => {
        // setIsVisible(false) 
        inputRef.current.locTypeId.clear()
        inputRef.current.provinceCode.clear()
        inputRef.current.locNameTh.clear()
        setSelectCheckBox(false)
    }

    const handleDelete = (value) => {
        if (value == null) return

        setIsVisible(true)
        setmodalVisibleDelect(false);
        setmodalVisibleDelectConfirm(true);
        dispatch(cancelLocation(removeItem.locId))
    }

    const onPressPage = (page) => {
        if (!page) return
        let totalValue = getInputData(inputRef);
        let search = totalValue.data;
        setCurrentPage(page);
        dispatch(getLocAction({page, ...search}))
    }

    const onPressDelete = (event, item) => {
        setmodalVisibleDelect(event);
        if (item) setRemoveItem(item)
    }

    const onPressDeleteConfirm = (event) => {
        setmodalVisibleDelectConfirm(event);
    }

    const onPressError = (event) => {
        setmodalVisibleError(event)
    }

    const [columnsHeader, setColumnsHeader] = useState([
        { key: "locCode", title: "รหัส", isColumnCenter: true},
        { key: 'locNameTh', title: 'ชื่อสถานที่' },
        { key: 'provinceNameTh', title: 'ชื่อจังหวัด' },
        { key: 'lotLongs', title: 'Latitude/Longitude' },
        { key: 'locTypeNameTh', title: 'ประเภทสถานที่' },
        { key: 'activeFlagStatus', title: 'สถานะ', isColumnCenter: true }
    ]);

    const handleSelectCheckBox = (item) => {
        if (item == true) setSelectCheckBox(true)
        if (item == false) setSelectCheckBox(false)
    }

    const handleSelectCustomer = (value) => {
        if (value == true) {
            setSelectCheckBox(true);
        } else {
            setSelectCheckBox(false);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <Header/>
            <ScrollView style={{marginBottom: '5%'}}>
                <View style={[styles.SearchArea, styles.styleShadow]}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth:0.5, borderColor:colors.grayborder, marginBottom: FONT_SIZE.TEXT}}>
                        <View style={{flex: 1, marginBottom: '5%'}}>
                            <Text style={{fontSize: FONT_SIZE.TITLE, fontWeight:'bold'}}>ค้นหา</Text>
                        </View>
                        <View>
                            <Button
                                onPress={() => navigation.navigate('AddEditLocationMasterScreen', {searchValue})}
                                title={'Add'}
                                typeIcon={'Ionicons'}
                                nameIcon={'add-outline'}
                                buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                width={STYLE_SIZE.BNT_WIDTH_HUN}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {/* <View style={{ flexDirection: 'row', flex: 1}}> */}
                        <View style={{ flex: 1}}>
                            <View style={{ flex: 1, paddingEnd: '1%', marginBottom: '3%'}}>
                                <TextInput ref={el => inputRef.current.locNameTh = el} title={'ชื่อสถานที่'}/>
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: '1%', marginBottom: '3%'}}>
                                <SelectDropdown
                                    titleDropdown={"ชื่อจังหวัด"}
                                    titleAlert={"ชื่อจังหวัด"}
                                    dataList={masterReducer.province}
                                    valueKey={"provinceCode"}
                                    titleKey={"provinceNameTh"}
                                    ref={el => inputRef.current.provinceCode = el}
                                />
                            </View>
                            <View style={{ flex: 1, paddingStart: '1%', marginBottom: '3%'}}>
                                <SelectDropdown
                                    titleDropdown={"ประเภทสถานที่"}
                                    titleAlert={"ประเภทสถานที่"}
                                    dataList={masterReducer.locationtype}
                                    valueKey={"locTypeId"}
                                    titleKey={"locTypeNameTh"}
                                    ref={el => inputRef.current.locTypeId = el}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: '5%', alignItems: 'center', marginBottom: '5%'}}>
                        <View style={{flex: 1, marginStart: '15%', marginEnd: '1%'}}>
                            <Button
                                onPress={() => handleSubmit()}
                                title={'Search'}
                                typeIcon={'Ionicons'}
                                nameIcon={'search-outline'}
                                IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                            />
                        </View>
                        <View style={{flex: 1, marginStart: '1%', marginEnd: '15%'}}>
                            <Button
                                onPress={handleClear}
                                title={'Clear'}
                                typeIcon={'Ionicons'}
                                nameIcon={'trash-outline'}
                                color={colors.grayButton}
                                colorBorder={colors.grayButton}
                                IconSize={STYLE_SIZE.ICON_SIZE_SMALL}
                            />
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end', marginBottom: '2%'}}>
                        {/* <CheckBox
                            type = {'end'}
                            title = {'ไม่รวมสถานะไม่ใช้งาน'}
                            typeSelect = {'singleSelect'}
                            SelectDefault = {selectCheckBox}
                            onPressStatus={(item)=> handleSelectCheckBox(item)} 
                        /> */}
                        <View style={{flexDirection: 'row'}}>
                            <Switch
                                value = {selectCheckBox}
                                onValueChange = {(value) => handleSelectCustomer(value)} 
                                style={{marginLeft: '2%'}}
                            />
                            <View style={{marginLeft: '2%'}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>ไม่รวมสถานะไม่ใช้งาน</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {
                    isVisible ?
                    <>
                    <View style={{marginBottom: '2%',marginHorizontal:'5%'}}>
                        <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>แสดงผลการค้นหา</Text>
                    </View>
                    <View style={{flex:1,marginHorizontal:'3%'}}>
                        <FullTable isShow={isShowFullTable} onChange={(status) => setisShowFullTable(status)}  size= {STYLE_SIZE.ICON_SIZE_THRR}> 
                            <Table 
                                data={masterReducer.location.records} 
                                columns={columnsHeader}
                                edittableonly
                                spaceHorizontal={5}
                                recordDetail={masterReducer.location}
                                onPressPage={onPressPage}
                                onPressEditOnly={(item) => navigation.navigate('AddEditLocationMasterScreen', {locationAdd: item, searchValue,})}
                                currentPage={currentPage}
                                hideEdit={isShowFullTable ? true : false}
                                isShowFullTable={isShowFullTable}
                            />
                        </FullTable>
                        <ModalWarning
                            visible={modalVisibleDelete}
                            onPressConfirm={handleDelete}
                            onPressCancel={()=> onPressDelete(false)}
                            detailText={language.DELETE}
                        />
                        <ModalWarning
                            visible={modalVisibleDeleteConfirm}
                            onPressClose={()=> onPressDeleteConfirm(false)}
                            onlyCloseButton
                            detailText={language.DELETESUCCESS}
                        />
                    </View> 
                    </>
                    :
                    null
                }  
            </ScrollView>
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={masterReducer.locationerrorMSG}
            />
            <LoadingOverlay
                visible={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    SearchArea : {
        borderRadius: 20, 
        backgroundColor: colors.grayMaster, 
        padding: '2%', 
        marginVertical: '4%',
        marginHorizontal:'4%'
    },
    styleShadow: {
        shadowOffset: {
            height: 3,
            width: 5
        },
        shadowRadius: 20,
        shadowOpacity: 0.2,
        shadowColor: colors.grayDark,
        elevation: 10,
      },
});

export default LocationMaster;
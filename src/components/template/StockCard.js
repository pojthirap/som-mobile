import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, BackHandler, FlatList, PermissionsAndroid, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { Text, SelectDropdown, Modal, Table, CheckBox, PickerDate, ModalWarning } from '../../components'
import Header from '../Header'
import dayjs from 'dayjs';
import { stockCountRecord, addStockCountRecord } from '../../actions/StockCountAction'
import colors from '../../utility/colors'
const { width, height } = Dimensions.get('window')
const localizedFormat = require('dayjs/plugin/localizedFormat')
import { useDispatch, useSelector } from 'react-redux';
import { getAppForm, addRecordAppForm, setCallbackTemplate } from '../../actions/AppForm'
import AsyncStorage from '@react-native-async-storage/async-storage';

dayjs.extend(localizedFormat)
dayjs.locale('TH')
import CardItem from './StockCardItem';
function StockCard({ route, navigation }) {
    const dispatch = useDispatch();
    const { obj, planTrip } = route.params;
    const [data, setDate] = useState(null);

    const [saveLoad, setSaveLoad] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSave, setIsSave] = useState(false)

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        // getData();
        //validate();
        getDataStore();
    }, [])

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@storage_Key_Stock', jsonValue)
        } catch (error) {
            // saving error
        }
    }

    const getDataStore = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key_Stock')
            if (jsonValue != null) {
                validate(JSON.parse(jsonValue));
                return setDate(JSON.parse(jsonValue))
            } else {
                return getData();
            }
            // return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            // error reading value
        }
    }

    const removeStore = async () => {
        try {
            await AsyncStorage.removeItem('@storage_Key_Stock');
        } catch (error) {
            // error revove value
        }
    };

    const backAction = () => {
        dispatch(setCallbackTemplate())
    }
    const validate = (vals = data) => {
        let status = true
        //    vals.map(list=>{
        //         list.listProductConversion.map(produc=>{
        //             if(produc.recordStockCard.recQty === ""){
        //                 status = false
        //             }
        //         })
        //     })
        setIsSave(status)
    }

    const getData = async () => {
        const data = await stockCountRecord(`${obj.planTripTaskId}`, `${obj.tpStockCardId}`);
        setDate(data)
        validate(data);
    }

    const onSave = async () => {
        let payload = [];
        data.map(list => {
            list.listProductConversion.map(produc => {
                const { planTripTaskId, recStockId, recQty, prodConvId } = produc.recordStockCard
                payload.push({ planTripTaskId: `${obj.planTripTaskId}`, prodConvId: `${produc.msProductConversion.prodConvId}`, recQty: recQty != "" ? `${recQty.toString().replace(',', '')}` : '0' })
            })
        })
        setSaveLoad(true);
        await addStockCountRecord(payload)
        setSaveLoad(false);
        setIsSuccess(true);
        removeStore();
    }

    const tableHeader = () => {
        return (
            <View style={styles.tableHeader}>
                <View style={[styles.columnHeader, { width: 50 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>ลำดับ</Text>
                </View>
                <View style={[styles.columnHeader, { width: 100 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>รหัส</Text>
                </View>
                <View style={[styles.columnHeader, { width: 180 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Product (สินค้า)</Text>
                </View>
                <View style={[styles.columnHeader, { width: 70 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Base Unit</Text>
                </View>
                <View style={[styles.columnHeader, { width: 150 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Qty</Text>
                </View>
                <View style={[styles.columnHeader, { width: 70 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Unit</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header />
            <ScrollView>
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
                <ScrollView horizontal={true} style={{ padding: '5%', marginTop: 10, paddingRight: 20, marginBottom: 20 }}>
                    <FlatList
                        contentContainerStyle={{ borderRadius: 20, overflow: 'hidden' }}
                        data={data}
                        keyExtractor={(item, index) => index + ""}
                        ListHeaderComponent={tableHeader}
                        renderItem={({ item, index }) => {
                            return <View style={{
                                ...styles.tableRow,
                                backgroundColor: index % 2 == 1 ? colors.white : colors.grayborder,
                                borderBottomWidth: 1,
                                borderColor: colors.gray,
                                marginRight: 30
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.itemTable, { width: 50, justifyContent: 'center' }]}>
                                        <Text style={styles.columnRowTxt}>{index + 1}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 100, justifyContent: 'center' }]}>
                                        <Text style={styles.columnRowTxt}>{item.prodCode}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 180, justifyContent: 'center' }]}>
                                        <Text style={styles.columnRowTxt}>{item.prodNameTh}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 70, justifyContent: 'center' }]}>
                                        <Text style={styles.columnRowTxt}>{item.baseUnit}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 150, marginBottom: 20 }]}>
                                        <CardItem list={item.listProductConversion} onChange={(list) => {
                                            let res = [...data];
                                            res[index].listProductConversion = list;
                                            setDate(res)
                                            storeData(res)
                                            validate()
                                        }} />
                                    </View>
                                    <View style={[styles.itemTable, { width: 70, justifyContent: "center" }]}>
                                        {
                                            item.listProductConversion && item.listProductConversion.length && (
                                                item.listProductConversion.map((item, index) => {
                                                    return (
                                                        <View style={{ height: 40, marginTop: 40 }}>
                                                            <Text style={styles.columnRowTxt}>{item.msProductConversion.altUnit}</Text>
                                                        </View>
                                                    )
                                                })
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        }}
                    />
                </ScrollView>
                <View>
                    {
                        saveLoad ?
                            <View style={{ alignSelf: 'center' }}>
                                <ActivityIndicator
                                    animating={true}
                                    size="large"
                                    color={colors.primary}
                                />
                            </View>
                            :
                            <TouchableOpacity disabled={!isSave} style={!isSave ? { alignSelf: 'center', marginBottom: 20, backgroundColor: colors.disabled, padding: 15, borderRadius: 10, marginTop: 20 } : { alignSelf: 'center', marginBottom: 20, backgroundColor: colors.primary, padding: 15, borderRadius: 10, marginTop: 30 }} onPress={() => onSave()}>
                                <Text style={{ marginLeft: width * 0.1, marginRight: width * 0.1, fontSize: 30, color: 'white', fontWeight: 'bold' }}>Save</Text>
                            </TouchableOpacity>
                    }
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        height: 50,
        marginRight: 30
    },
    tableRow: {
        flexDirection: "row",
        minHeight: 50,
        //alignItems:"center"
    },
    columnHeader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 0.5,
        borderColor: colors.white,
        height: 50,
    },
    columnRowTxt: {
        textAlign: 'center'
    },
    itemTable: {
        borderLeftWidth: 0.5,
        borderColor: colors.gray,
        minHeight: 50,
    },
});

export default StockCard;
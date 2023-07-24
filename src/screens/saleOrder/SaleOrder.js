import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Icon, Input } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import { Text, Button, Table, TextInput, Header, PickerDate, SelectDropdown, ModalWarning, FullTable } from '../../components';
import colors from '../../utility/colors';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import { getInputData, resetInputData } from '../../utility/helper';
import { actionClear, getCustomer, getSalesOrder, cancelSaleOrder, createSaleOrderByQuotationNo } from '../../actions/menuSalesOrderAction';
import { getSaleOrderSelectData } from '../../actions/saleOrderSelectInfoAction';
import language from '../../language/th.json';

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const SaleOrder = () => {

    const navigation = useNavigation()
    const { salesOrderReducer, authReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    let listPermission = authReducer.userProfile.listPermObjCode;

    const [isVisible, setIsVisible] = useState(false);
    // const [data,setData] = useState('');
    const [fromDate, setFormDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [custName, setCustName] = useState('')
    const [removeItem, setRemoveItem] = useState();
    const [currentPage, setCurrentPage] = useState('');
    const [modalSelectWarning, setmodalSelectWarning] = useState(false);
    const [modalConfirmDelete, setmodalConfirmDelete] = useState(false);
    const [modalAddQuaWarning, setmodalAddQuaWarning] = useState(false);
    const [modalAddQuaSucess, setmodalAddQuaSucess] = useState(false);
    const [modalAddQuaError, setmodalAddQuaError] = useState(false);
    const [modalDeleteSuccess, setmodalDeleteSuccess] = useState(false);
    const [isShowFullTable, setisShowFullTable] = useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        dispatch(getCustomer())
    }, [])

    useEffect(() => {
        if (salesOrderReducer.dataCusSalesOrder) {
            setDataList(salesOrderReducer.dataCusSalesOrder)
        }
    }, [salesOrderReducer.dataCusSalesOrder])

    useEffect(() => {
        if (salesOrderReducer.removeSaledata_Loading && !salesOrderReducer.removeErrorMSG) {
            setmodalDeleteSuccess(true)
            setmodalConfirmDelete(false)
            let totalValue = getInputData(inputRef);
            dispatch(getSalesOrder(totalValue.data))
        }
        if (salesOrderReducer.createdByQualoadingSuccess && !salesOrderReducer.createdByQuaErrorMSG) {
            setmodalAddQuaSucess(true)
            inputRef.current.quaNo.clear()
        }
        if (salesOrderReducer.createdByQualoadingError && salesOrderReducer.createdByQuaErrorMSG) {
            setmodalAddQuaSucess(false)
            setmodalAddQuaError(true)
        }

    }, [salesOrderReducer, salesOrderReducer.removeSaledata_Loading, salesOrderReducer.createdByQualoadingSuccess, salesOrderReducer.createdByQualoadingError])

    useEffect(() => {
        if (salesOrderReducer.createdSaleOrderData) {
            setCurrentPage(1)
            dispatch(getSalesOrder(salesOrderReducer.createdSaleOrderData.records[0]))
            setIsVisible(true)
        }
    }, [salesOrderReducer.createdSaleOrderData])

    useEffect(() => {
        if (salesOrderReducer.createdByQuaData) {
            setCurrentPage(1)
            dispatch(getSalesOrder(salesOrderReducer.createdByQuaData.records[0]))
            setIsVisible(true)
        }
    }, [salesOrderReducer.createdByQuaData])

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef);
        let fromDate = totalValue.data.fromDate
        let toDate = totalValue.data.toDate
        let custCode = totalValue.data.custCode
        let somOrderNo = totalValue.data.somOrderNo

        //    let sendFromDate =  fromDate ? fromDate : toDate ? dayjs(toDate).subtract(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : ''
        //    let sentToDate = toDate ? toDate : fromDate ?  dayjs(fromDate).add(365,'day').format('YYYY-MM-DD').concat('T00:00:00') : ''

        // if (!totalValue.isInvalid && sentToDate != '' || sendFromDate != '' || custCode != '' && custCode != null || somOrderNo != '') {
        if (!totalValue.isInvalid && toDate != '' || fromDate != '' || custCode != '' && custCode != null || somOrderNo != '') {
            setCurrentPage(1)
            setIsVisible(true)
            // dispatch(getSalesOrder(totalValue.data,sentToDate,sendFromDate))
            dispatch(getSalesOrder(totalValue.data, toDate, fromDate))
        } else {
            setIsVisible(false)
            setmodalSelectWarning(true)
        }
    }

    const handleClear = () => {
        inputRef.current.custCode.clear()
        inputRef.current.somOrderNo.clear()
        setToDate('')
        setFormDate('')
    }

    useFocusEffect(
        React.useCallback(() => {

            // Do something when the screen is focused
            return () => {
                inputRef.current.quaNo.clear()
                setFormDate('')
                setToDate('')
                setCustName('')
                setIsVisible(false)
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const onPressConfirmAddQua = () => {
        let totalValue = getInputData(inputRef)
        let quatationNo = totalValue.data.quaNo
        if (quatationNo != '') {
            dispatch(createSaleOrderByQuotationNo(quatationNo))
        } else if (quatationNo == '') {
            setmodalAddQuaWarning(true)
        }
    }

    const onPressConfirm = (even) => {
        setmodalAddQuaSucess(false)
        if (salesOrderReducer.createdByQuaData) {
            dispatch(getSalesOrder(salesOrderReducer.createdByQuaData))
        }
    }

    const [columnsHeader, setColumnsHeader] = useState([
        { key: 'somOrderNo', title: 'SO No (SOM)' },
        { key: 'sapOrderNo', title: 'SO No (SAP)' },
        { key: 'custNameTh', title: 'Customer Name' },
        { key: 'somOrderDte', title: 'SO Date/Time', isDateTimeFormat: true },
        { key: 'simulateDtm', title: 'Simulate Date/Time', isDateTimeFormat: true },
        { key: 'docTypeNameTh', title: 'Document Type' },
        { key: 'status', title: 'Status' },
        { key: 'sapMsg', title: 'Message' },
        { key: 'pricingDtm', title: 'Pricing Date/Time', isDateTimeFormat: true },
        { key: 'total', title: 'Total', isNumberFormat: true },
        { key: 'netValue', title: 'Total Net Value', isNumberFormat: true },
    ])

    const onChangFromYear = (date) => {
        setFormDate(date)

        if (toDate) {
            let fromD = new Date(date)
            fromD = fromD.setFullYear(fromD.getFullYear() + 1)

            let toD = new Date(toDate)

            if (fromD < toD) setToDate(null)
        }

        if (toDate) {
            let fromD = new Date(date)
            let toD = new Date(toDate)

            let diffDate = dayjs(toD).diff(dayjs(fromD), 'days');

            if (dayjs(fromD).format('YYYY') === dayjs(toD).format('YYYY')) {
                if (fromD > toD) setToDate(null)
            } else if (diffDate < 0) {
                setToDate(null)
            } else if (diffDate > 365 && diffDate != 365) {
                setToDate(null)
            }
        }
    }

    const onPressPage = (page) => {
        if (!page) return
        let totalValue = getInputData(inputRef);
        setCurrentPage(page)
        return dispatch(getSalesOrder(totalValue.data, '', '', page))
    }

    const onPressCloseWarning = (event) => {
        setmodalSelectWarning(event)
    }

    const onPressCloseAddWarning = (event) => {
        setmodalAddQuaWarning(event)
    }

    const handleRemove = (value) => {
        if (value == null) return
        dispatch(cancelSaleOrder(removeItem))
    }

    const onPressDelete = (event, item) => {
        setmodalConfirmDelete(event);
        if (item) setRemoveItem(item)
    }

    const onPressDeleteConfirm = (event) => {
        setmodalDeleteSuccess(event);
    }

    const onPressEdit = (item) => {
        if (item) {
            dispatch(getSaleOrderSelectData(item))
            navigation.navigate('EditSaleOrderScreen')
        }
    }

    const onCloseError = () => {
        setmodalAddQuaError(false)
        dispatch(actionClear())
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.greenSelect }}>
            <Header />
            <ScrollView>
                <View style={{ height: 80, paddingHorizontal: '5%', paddingVertical: '3%' }}>
                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>Good morning,</Text>
                    <Text style={{ fontSize: FONT_SIZE.TEXT, fontWeight: 'bold' }}>Sales Order</Text>
                </View>
                <View style={{ backgroundColor: colors.white, flex: 1 }}>
                    <View style={{ borderBottomColor: colors.grayborder, borderBottomWidth: 1, paddingHorizontal: 20, marginTop: 20, flexWrap: 'wrap' }}>
                        <View style={{ flexDirection: 'row', marginTop: '2%', flexWrap: 'wrap' }}>
                            <View style={[styles.searchGroup, { flex: 1, flexBasis: '100%' }]}>
                                <SelectDropdown
                                    dataList={dataList}
                                    titleDropdown={"Customer Name"}
                                    titleAlert={"Customer Name"}
                                    onPress={(item) => setCustName(item)}
                                    defaultValue={custName && custName.custCode ? custName.custCode : null}
                                    valueKey={"custCode"}
                                    titleKey={"codeNameLabel"}
                                    ref={el => inputRef.current.custCode = el}
                                    NotFillter
                                />
                            </View>
                            <View style={styles.searchGroup}>
                                <TextInput
                                    title={'Sales Order NO. (SOM)'}
                                    textInBox={'Sales Order NO.'}
                                    ref={el => inputRef.current.somOrderNo = el}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: '2%', flexWrap: 'wrap', flex: 1 }}>
                            <View style={[styles.searchGroup, { flexBasis: '50%', }]}>
                                <PickerDate
                                    title={'วันที่เริ่มต้น'}
                                    DateBoxWidth={'75%'}
                                    dateValue={fromDate}
                                    ref={el => inputRef.current.fromDate = el}
                                    onChange={(date) => {
                                        onChangFromYear(date)
                                    }}
                                    maxDate={new Date()}
                                    markDate={fromDate ? fromDate : toDate} />
                            </View>
                            <View style={{ flex: 1, flexBasis: '50%' }}>
                                <PickerDate
                                    title={'วันที่สิ้นสุด'}
                                    DateBoxWidth={'75%'}
                                    dateValue={toDate}
                                    ref={el => inputRef.current.toDate = el}
                                    markDate={toDate ? toDate : fromDate}
                                    onChange={(date) => setToDate(date)}
                                    minDate={fromDate}
                                    maxDate={fromDate ? dayjs(fromDate).add(365, 'day').format('YYYY-MM-DD') : new Date()} />
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginVertical: 45, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginRight: 5 }}>
                                <Button
                                    title={'Search'}
                                    typeIcon={'Ionicons'}
                                    nameIcon={'search-outline'}
                                    onPress={handleSubmit}
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <Button
                                    title={'Clear'}
                                    typeIcon={'Ionicons'}
                                    nameIcon={'trash-outline'}
                                    onPress={() => handleClear()}
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                    color={colors.grayButton}
                                    colorBorder={colors.grayButton}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ marginVertical: '2%', justifyContent: 'center', paddingHorizontal: '5%' }}>
                        <View style={{ flexDirection: 'row', marginVertical: '3%' }}>
                            <View style={{ flex: 2, marginHorizontal: '3%' }}>
                                <TextInput
                                    TITLE={false}
                                    placeholder={'Quotation No.'}
                                    placeholderTextColor={colors.gray}
                                    ref={el => inputRef.current.quaNo = el}
                                    maxLength={10}
                                    type={'Num'}
                                    typeKeyboard={'numeric'}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Button
                                    title={'Add'}
                                    typeIcon={'Ionicons'}
                                    nameIcon={'add-outline'}
                                    buttonHeigth={50}
                                    onPress={() => onPressConfirmAddQua()}
                                />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: '2%', justifyContent: 'flex-end' }}>
                                <Button
                                    title={'Create'}
                                    buttonHeigth={50}
                                    onPress={() => navigation.navigate('CreateSalesOrderScreen')}
                                />
                            </View>
                        </View>
                        {
                            isVisible ?
                                salesOrderReducer.dataSalesOrder && salesOrderReducer.dataSalesOrder.records.length != 0 ?
                                    <View style={{ marginTop: '3%' }}>
                                        <FullTable isShow={isShowFullTable} onChange={(status) => setisShowFullTable(status)}>
                                            <Table
                                                data={salesOrderReducer.dataSalesOrder.records}
                                                columns={columnsHeader}
                                                // editable={true}
                                                edittableonly={true}
                                                onPressPage={onPressPage}
                                                spaceHorizontal={0}
                                                currentPage={currentPage}
                                                recordDetail={salesOrderReducer.dataSalesOrder}
                                                // onPressEdit={(item) =>  onPressEdit(item)}
                                                // onPressRemove={(item)=> onPressDelete(true, item)}
                                                onPressEditOnly={(item) => onPressEdit(item)}
                                                hideEdit={isShowFullTable ? true : false}
                                                // hideDelete={isShowFullTable ? true : false}
                                                isShowFullTable={isShowFullTable}
                                            />
                                        </FullTable>

                                    </View>
                                    :
                                    <View style={{ alignSelf: 'center', marginTop: 40 }}>
                                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>ไม่พบข้อมูล</Text>
                                    </View>
                                :
                                null
                        }

                    </View>
                    <ModalWarning
                        visible={modalSelectWarning}
                        onPressClose={() => onPressCloseWarning(false)}
                        onlyCloseButton
                        detailText={language.SELECTSEARCH}
                    />
                    <ModalWarning
                        visible={modalConfirmDelete}
                        detailText={language.DELETE}
                        onPressConfirm={handleRemove}
                        onPressCancel={() => onPressDelete(false)}
                    />
                    <ModalWarning
                        visible={modalDeleteSuccess}
                        detailText={language.DELETESUCCESS}
                        onlyCloseButton={true}
                        onPressClose={() => onPressDeleteConfirm(false)}
                    />
                    <ModalWarning
                        visible={modalAddQuaWarning}
                        detailText={'กรุณากรอก Quotation No.'}
                        onlyCloseButton={true}
                        onPressClose={() => onPressCloseAddWarning(false)}
                    />
                    <ModalWarning
                        visible={modalAddQuaSucess}
                        onlyCloseButton
                        onPressClose={() => onPressConfirm()}
                        detailText={language.ADDSUCCESS}
                    />
                    <ModalWarning
                        visible={modalAddQuaError}
                        onlyCloseButton
                        WARNINGTITLE
                        onPressClose={() => onCloseError()}
                        detailText={salesOrderReducer.createdByQuaErrorMSG}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    searchGroup: {
        flex: 1,
        marginHorizontal: '1%',
        marginBottom: '3%'
    },
    inputbox: {
        borderEndWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        minWidth: 100,
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: colors.white,
        marginTop: 5,
        height: 50
    },
    iconBeforTextinput: {
        borderStartWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        height: 50,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50
    },
    BorderEndTextinput: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderEndWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        width: 40,
        height: 50,
        marginTop: 5
    }
})

export default SaleOrder;
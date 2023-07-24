import React, { useState, useRef, useEffect,forwardRef, useImperativeHandle } from 'react';
import { View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Modal, SelectDropdown, TextInput, TableAddProduct, ModalWarning, FullTable } from '../../components'
import colors from '../../utility/colors';
import { searchProductByCustSaleId, searchProductConversion, updSaleOrderProduct, updDataNewOfSaleOrder } from '../../actions/menuSalesOrderAction';
import { getInputData, resetInputData } from '../../utility/helper';
import language from '../../language/th.json'

const ProductSaleOrder = ({ data , callProduct}, ref) => {

    const [isVisible, setIsVisible] = useState(false);
    const { salesOrderSelectInfoReducer, authReducer } = useSelector((state) => state);
    const { salesOrderReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    let listPermission = authReducer.userProfile.listPermObjCode;

    const [dataOfProduct, setDataOfProduct] = useState('');
    const [dataUnitOfProduct, setDataUnitOfProduct] = useState('');
    const [productSelect, setProductSelect] = useState('');
    const [unitSelect, setUnitSelect] = useState('');
    const [dataProducInTable, setDataProducInTable] = useState([]);
    const [dataSapNo, setDataSapNo] = useState('');
    const [dataDescrip, setDataDescrip] = useState('');
    const [modalDataAdd, setModalDataAdd] = useState(false);
    const [isQuaNo,setQuaNo] = useState(false)
    const [perButtonAddProduct,setPerButtonAddProduct] = useState(false);
    const [isShowFullTable,setisShowFullTable] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalDeleteSuccess, setModalDeleteSuccess] = useState(false);
    const [productNew, setProductNew] = useState([]);

    const onPressModal = (event) => {
        setIsVisible(event);
        setDataDescrip('');
    }

    useEffect(() => {
        if(data.custSaleId != undefined && callProduct == true) {
            dispatch(searchProductByCustSaleId(data.custSaleId))
        }
    }, [data, callProduct])

    const findPermission = () =>{
        let ButtonAddProduct = listPermission.find((item) => {
            return item.permObjCode == "FE_SALEORD_S012_ADD"
        })
        if(ButtonAddProduct.permObjCode  == "FE_SALEORD_S012_ADD"){
            setPerButtonAddProduct(true)
        }
    }

    // useEffect(() => {
    //     setDataProducInTable(salesOrderReducer.saleOrderById[0].items)
    // }, [salesOrderReducer.saleOrderById[0].items])

    useEffect(() => {
        if (salesOrderReducer.simulateloadingSuccess && !salesOrderReducer.simulateloadingError) {
            setDataProducInTable(salesOrderReducer.saleOrderById[0].items)
        }
    }, [salesOrderReducer.simulateloadingSuccess, salesOrderReducer.simulateloadingError])

    useEffect(() => {
        if (!salesOrderReducer.saleOrderById) return
        setDataProducInTable(salesOrderReducer.saleOrderById[0].items)
        setDataSapNo(salesOrderReducer.saleOrderById[0].saleOrder.sapOrderNo)
        if( salesOrderReducer.saleOrderById && salesOrderReducer.saleOrderById[0].saleOrder.quotationNo != ''){
            setQuaNo(true)
        }
    }, [salesOrderReducer.saleOrderById])

    useEffect(() => {
        setDataOfProduct(salesOrderReducer.dataProductByCustSale)
    }, [salesOrderReducer.dataProductByCustSale])

    useEffect(() => {
        if (productSelect) {
            setDataDescrip(productSelect.prodNameTh)
            dispatch(searchProductConversion(productSelect))
        }
    }, [productSelect])

    useEffect(() => {
        setDataUnitOfProduct(salesOrderReducer.dataProductConversion)
    }, [salesOrderReducer.dataProductConversion])

    useImperativeHandle(ref, () => ({
        getInputValue() {

            let totalValue = getInputData(inputRef, 'C');
            let dataMainSlectOrder = salesOrderSelectInfoReducer.dataSelect

            if (totalValue.list[0] && !totalValue.list[0].prodCode) return

            let dataProductListNew = dataProducInTable.map((itemList, index) => {
                let price = totalValue.list.length && totalValue.list[index].additionalPrice ? `${totalValue.list[index].additionalPrice}` : "0"
                let pricePer = totalValue.list.length && totalValue.list[index].additionalPerUnit ? `${totalValue.list[index].additionalPerUnit}` : price != 0 ? "1" : null
                let dataPer = parseFloat(price.toString().replace(/,/g, ''))
                return {
                    orderProdId: itemList.orderProdId ? `${itemList.orderProdId}` : '',
                    orderId: `${dataMainSlectOrder.orderId}`,
                    prodCode: itemList.prodCode,
                    qty: totalValue.list[index].qty ? `${totalValue.list[index].qty.toString().replace(/,/g, '')}` : `${itemList.qty}` ,
                    prodConvId: `${itemList.prodConvId}`,
                    netPriceEx: itemList.netPriceEx ? `${itemList.netPriceEx}` : '',
                    transferPrice: itemList.transferPrice ? `${itemList.transferPrice}` : '',
                    netPriceInc: itemList.netPriceInc ? `${itemList.netPriceInc}` : '',
                    additionalPrice: `${dataPer}`,
                    additionalPerUnit: pricePer ? pricePer.toString().replace(/,/g, '') : pricePer,
                    itemType: itemList.itemType ? `${itemList.itemType}` : '',
                    netValue: itemList.netValue ? `${itemList.netValue}` : '',
                    sapItemNo: itemList.sapItemNo ? `${itemList.sapItemNo}` : '',
                    prodAltUnit: `${itemList.altUnit}`,
                    plantCode: null,
                    shipCode: null,
                    prodCateCode: itemList.prodCateCode,
                }
            })

            return {
                isInvalid2: totalValue.isInvalid,
                value: {
                    ...totalValue.data,
                    items: dataProductListNew,
                    changeItem: dataProductListNew.length != salesOrderReducer.saleOrderById[0].items.length ? true : false
                },
            }

        },

        resetValue() {
            resetInputData(inputRef);
            if (salesOrderReducer.saleOrderById.length) setDataProducInTable(salesOrderReducer.saleOrderById[0].items)
        }
    }));

    const handleAddButton = () => { 

        let totalValue = getInputData(inputRef);
        let addSelectProduct = totalValue.data
        // return
        if (!totalValue.isInvalid) {
            let productAdd = { ...productSelect, ...addSelectProduct }
            let productAddUnit = { ...productAdd, ...unitSelect }
            let itemListAdd = dataProducInTable.find((itemAddNew) => {
                return itemAddNew.prodCode == productAddUnit.prodCode && itemAddNew.altUnit == productAddUnit.altUnit
            })

            let mapNewData = dataProducInTable.map((item,index) => {
                let data = addSelectProduct.dataNuberchange.data
                if (data) {
                    if (data[`additionalPrice${index}`]) {
                        return {
                            ...item, 
                            additionalPrice: data[`additionalPrice${index}`] || 0, 
                            additionalPerUnit: data[`additionalPerUnit${index}`] || '',
                            qty: data[`qty${index}`] || 0,
                        }
                    }

                    return item
                } else {
                    return item
                }
            
            })

            if (itemListAdd) return setModalDataAdd(true)

            setDataProducInTable([...mapNewData, productAddUnit])
            setIsVisible(false)
            setDataDescrip('');
            setRefresh(!refresh)
            setProductSelect('')
        }
    }

    const handleDelete = (item) => {
        let productNewList = dataProducInTable.filter((itemDelete) => {
            let deleteSelect = itemDelete.prodCode == item.prodCode && itemDelete.prodCateCode == item.prodCateCode && itemDelete.altUnit == item.altUnit

            return !deleteSelect
        })

        setProductNew(productNewList)
        setModalDelete(true)
    }

    const handleModalDelete = (event) => {
        setModalDelete(event)
        setModalDeleteSuccess(true)
        setDataProducInTable(productNew)
        setRefresh(!refresh)
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <ScrollView>
                <View style={{ margin: '5%', alignItems: 'flex-end' }}>
                    {
                        isQuaNo == true ?
                        null
                        :
                        // perButtonAddProduct == true ?
                        <View style={{ width: '40%' }}>
                            <Button
                                title={'Add Product'}
                                onPress={() => setIsVisible(true)}
                            />
                        </View>
                        // :
                        // null
                    }    
                </View>

                <View style={{marginHorizontal:'5%', marginBottom: '5%'}}>
                    <FullTable isShow={isShowFullTable} onChange={(status) => setisShowFullTable(status)}> 
                        <TableAddProduct
                            editable = { isQuaNo == true ? false : true}
                            data={dataProducInTable}
                            onPressRemove={(item) => handleDelete(item)}
                            ref={el => inputRef.current.dataNuberchange = el}
                            comma
                            hideEdit={isShowFullTable ? true : false}
                            hideDelete={isShowFullTable ? true : false}
                            disableRemoveBut={ isQuaNo == true ? true : false}
                            refresh={refresh}
                            isShowFullTable={isShowFullTable}
                            editAdditional={dataSapNo}
                        />
                    </FullTable>
                </View>

                <Modal
                    visible={isVisible}
                    title={'Product'}
                    BUTTON={true}
                    confirmText={'Add'}
                    onPressCancel={onPressModal}
                    onPressButton={() => handleAddButton()}
                >
                    <View style={{ margin: 10 }}>
                        <View style={{ paddingBottom: 20 }}>
                            <SelectDropdown
                                titleDropdown={'Product'}
                                titleAlert={'Product'}
                                dataList={dataOfProduct}
                                valueKey={'prodCode'}
                                titleKey={'prodNameTh'}
                                ref={el => inputRef.current.prodCode = el}
                                onPress={(item) => {
                                    setProductSelect(item)
                                    setDataUnitOfProduct('')
                                    inputRef.current.prodConvId.clear()
                                }}
                                REQUIRETITLE
                                require
                                massageError={language.PRODUCTSALEORDER}
                            />
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <TextInput
                                title={'Description'}
                                editable={false}
                                value={dataDescrip != null ? dataDescrip : ''}
                                ref={el => inputRef.current.description = el}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
                            <View style={{ flex: 1 / 2, paddingRight: 10 }}>
                                <TextInput
                                    title={'Quantity'}
                                    type={"Num"}
                                    ref={el => inputRef.current.qty = el}
                                    REQUIRETITLE
                                    require
                                    massageError={language.QUATITYSALEORDER}
                                    maxLength = {13}
                                    comma
                                    typeKeyboard={"numeric"}
                                />
                            </View>
                            <View style={{ flex: 1 / 2 }}>
                                <SelectDropdown
                                    titleDropdown={'Unit'}
                                    titleAlert={'Unit'}
                                    disabled={!productSelect}
                                    dataList={dataUnitOfProduct}
                                    valueKey={'prodConvId'}
                                    titleKey={'altUnit'}
                                    ref={el => inputRef.current.prodConvId = el}
                                    onPress={(item) => {
                                        setUnitSelect(item)
                                    }}
                                    REQUIRETITLE
                                    require
                                    massageError={language.UNITSALEORDER}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{flex: 0}}>
                    <ModalWarning
                        visible = {modalDataAdd}
                        onlyCloseButton
                        onPressClose = {() => setModalDataAdd(false)}
                        detailText = {'ข้อมูล Product และ Unit ซ้ำ กรุณาเลือกข้อมูลใหม่'}
                    />
                    <ModalWarning
                        visible = {modalDelete}
                        onPressConfirm = {() => handleModalDelete(false)}
                        onPressCancel = {() => setModalDelete(false)}
                        detailText = {language.DELETE}
                    />
                    <ModalWarning
                        visible = {modalDeleteSuccess}
                        onlyCloseButton
                        onPressClose = {() => setModalDeleteSuccess(false)}
                        detailText = {language.DELETESUCCESS}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

// export default ProductSaleOrder;
export default forwardRef(ProductSaleOrder);
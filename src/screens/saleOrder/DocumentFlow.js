import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Icon } from 'native-base';
import {useDispatch, useSelector} from 'react-redux';

import colors from '../../utility/colors';
import { Cardcollapsible, Text, SelectDropdown } from '../../components';
import { FONT_SIZE } from '../../utility/enum';
import { searchSaleOrderDocFlow } from '../../actions/menuSalesOrderAction';
import { getInputData } from '../../utility/helper';
import dayjs from 'dayjs'
var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)
require('dayjs/locale/th')

const DocumentFlow = ({ callDocument }) =>{

    const {salesOrderSelectInfoReducer} = useSelector((state) => state);
    const {salesOrderReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    const totalValue = getInputData(inputRef);
    const [isShowDoc, setIsShowDoc] = useState(false);
    const [dataListIndropdown, setDataListIndropdown] = useState([]);
    const [productSelect, setProductSelect] = useState([]);

    useEffect(() => {
        if(callDocument == true) {
            dispatch(searchSaleOrderDocFlow(salesOrderSelectInfoReducer.dataSelect))
        }
    }, [callDocument])

    useEffect(() => {
        setDataListIndropdown(salesOrderReducer.dataSaleOrderDocFlow)
    },[salesOrderReducer.dataSaleOrderDocFlow])

    const handleSelectDrop = (value) => {
        setProductSelect(value.document)
    }

    const formatDate = (value, type) => {
        let year = value.created_On.substring(0, 4);
        let month = value.created_On.substring(4, 6);
        let day = value.created_On.substring(6, 8);
        let formDate = `${year}-${month}-${day}`

        // if (type == "DATE") return `${dayjs(day).format('D')}/${dayjs(month).format('M')}/${dayjs(year).format('BBBB')}`
        if (type == "DATE") return `${dayjs(formDate).format('D/M/BBBB')}`

        let hour = value.created_Time.substring(0, 2);
        let min = value.created_Time.substring(2, 4);
        let sec = value.created_Time.substring(4, 6);
        return `${hour}:${min}`

    }

    return(
        <View style={{flex:1, backgroundColor: colors.white}}>
            <ScrollView style={{margin: '5%'}}>
                <View style={{marginBottom: '10%'}}>
                    <SelectDropdown
                        titleDropdown={'สินค้า'}
                        titleAlert={'สินค้า'}
                        dataList={dataListIndropdown}
                        valueKey={'material'}
                        titleKey={'material_Desc'}
                        ref={el => inputRef.current.materialCode = el}
                        onPress={(item)=> {
                            handleSelectDrop(item)
                        }}
                    />
                </View>
                {
                    productSelect != '' ?
                    <FlatList 
                        data={productSelect}
                        renderItem={(data, index)=> {
                            return (
                                <View>
                                    <View style={{
                                        justifyContent: 'center', 
                                        height: 200, 
                                        marginHorizontal: '20%', 
                                        shadowOffset: { height: 3, width: 5 }, shadowRadius: 10,
                                        shadowOpacity: 0.6,
                                        shadowColor: colors.black,
                                        elevation: 10,
                                        backgroundColor: colors.white
                                    }}>
                                        <View>
                                            <View style={{alignSelf:'center',paddingBottom:10}}>
                                                <Text style={{fontWeight:'bold', fontSize:FONT_SIZE.SUBTITLE}}>{data.item.document_Name}</Text>
                                            </View>
                                            <View style={{alignSelf:'center',paddingBottom:10}}>
                                                <Text style={{fontWeight:'bold', fontSize:FONT_SIZE.SUBTITLE}}>{data.item.document_no}</Text>
                                            </View>
                                            <View style={{alignSelf:'center'}}>
                                                <Text style={{fontWeight:'bold', fontSize:FONT_SIZE.SUBTITLE}}>{formatDate(data.item, "DATE")} {formatDate(data.item)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    { (productSelect.length - 1 != data.index) ?
                                        <View style={{alignSelf:'center', marginVertical:20}} >
                                            <Icon  type='FontAwesome' name='arrow-circle-down'/>
                                        </View>
                                        :
                                        null
                                    }
                                    
                                </View>
                            )
                        }} 
                    /> 
                    :
                    null
                }
            </ScrollView>
        </View>
    )
}

export default DocumentFlow;
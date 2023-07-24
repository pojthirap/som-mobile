import React, { useEffect, useState } from 'react';
import { View,ScrollView } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { Table, FullTable } from '../../components';
import colors from '../../utility/colors';
import { getChange } from '../../actions/menuSalesOrderAction';

const ChangeSaleOrder = ({ callChange }) => {

    const {salesOrderReducer} = useSelector((state) => state);
    const [orderId, setOrderID] = useState('')
    const [currentPage, setCurrentPage] = useState('');
    const [isShowFullTable,setisShowFullTable] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(salesOrderReducer.saleOrderById){
            setOrderID(salesOrderReducer.saleOrderById[0].saleOrder.orderId)
        }
    },[salesOrderReducer.saleOrderById])

    useEffect(() => {
        if (orderId && callChange ==true) {
            setCurrentPage(1)
            dispatch(getChange(orderId)) 
        }
    },[orderId, callChange])

    // useFocusEffect(
    //     React.useCallback(() => {
    //             setCurrentPage(1)
    //             dispatch(getChange(salesOrderReducer.saleOrderById[0].saleOrder.orderId)) 
    //         return () => {
    //             // Do something when the screen is unfocused
    //             // Useful for cleanup functions
    //         };
    //     }, [])
    // );
    const [columnsHeader, setColumnsHeader] = useState([
        { key: "changeDtm",title: "Change Date/Time",isDateTimeFormat:true },
        { key: 'changeTabDesc', title: 'Change Tap'},
        { key: 'changeUser', title: 'Changed By'},
        { key: 'orderSaleRep', title: 'Sale Rep ID'}
    ])

    const onPressPage = (page) => {
        if (!page) return
        setCurrentPage(page)
        return dispatch(getChange(orderId,page)) 
    }
    
    return(
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <ScrollView style={{margin: '5%'}}>
                <FullTable isShow={isShowFullTable} onChange={(status) => setisShowFullTable(status)}> 
                    <Table 
                    columns={columnsHeader} 
                    data={salesOrderReducer.changeData.records}
                    onPressPage={onPressPage}
                    spaceHorizontal={0}
                    recordDetail={salesOrderReducer.changeData}
                    currentPage={currentPage}
                    isShowFullTable={isShowFullTable}
                    />
                </FullTable>
            </ScrollView>
        </View>
    )
}

export default ChangeSaleOrder;
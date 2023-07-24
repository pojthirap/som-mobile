import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { CardCarousel, Text, SearchInput } from '../../../components';
import { FONT_SIZE } from '../../../utility/enum';
import colors from '../../../utility/colors'
import { searchSaleDataTab } from '../../../actions/SaleDataTabAction'
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getInputData } from '../../../utility/helper';
const SubmenuSalesData = () => {
    const { prospectSelectInfoReducer, prospectReducer } = useSelector((state) => state);
    const [data, setData] = useState([])
    const [showObject, setShowObject] = useState(null);
    const [Filtered, setFiltered] = useState('');
    // const [indexContact, setIndexContact] = useState(0);
    const inputRef = useRef({});

    useEffect(() => {
        getData();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getData();
            // Do something when the screen is focused
            return () => {
                inputRef.current.nameSaleData.clear()
                setFiltered('')
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const getData = async () => {
        const data = await searchSaleDataTab(prospectSelectInfoReducer?.dataSelect?.prospectAccount?.custCode || '');
        if (data[0]) setShowObject(data[0])
        setData(data)
    }

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const handleSearch = () => {
        let totalValue = getInputData(inputRef);
        let search = totalValue.data.nameSaleData.name;

        if (search !== '') {
            const newList = data.filter((item) => {
                const lcOrgname = item.orgNameTh.toLowerCase()
                const filter = search.toLowerCase()
                return lcOrgname.includes(filter)
            })
            setShowObject(newList[0]);
            setFiltered(newList)
        } else {
            setShowObject(data[0]);
            setFiltered(data)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <ScrollView>
                <View style={styles.topLabel}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: FONT_SIZE.HEADER, fontWeight: 'bold' }}>{getTitle()}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignSelf: 'center', marginBottom: 20, marginHorizontal: '3%' }}>
                    <SearchInput
                        SearchBarType={'SearchBarButton'}
                        // widthSearchBox={'30%'}
                        // SearchBarWidth={'70%'}
                        // buttonWidth={'70%'}
                        onPressSearch={() => handleSearch()}
                        ref={el => inputRef.current.nameSaleData = el}
                    />
                </View>
                {
                    data && data.length != 0 ?
                        <CardCarousel data={Filtered || data} isSaleData={true} showItem={(item) => setShowObject(item)} />
                    :
                    <View style={{ alignSelf: 'center', marginTop: '10%' }}>
                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>ไม่พบข้อมูล</Text>
                    </View>
                }
                {
                    Filtered && Filtered.length === 0 ?
                        <View style={{ alignSelf: 'center', marginTop: '10%' }}>
                            <Text style={{ fontSize: FONT_SIZE.LITTLETEXT }}>ไม่พบข้อมูล</Text>
                        </View>
                    :
                    null
                }
                <View style={{ backgroundColor: colors.white, paddingBottom: '10%' }}>
                    {/* Infomation */}
                    <View style={styles.titleLabel}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: '3%' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>รายละเอียด</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowLabel}>
                        <View style={styles.input}>
                            <Text style={{ fontWeight: 'bold' }}>Sales Office</Text>
                            <View style={{ marginVertical: '3%' }}>
                                <Text >{showObject ? showObject.officeNameTh : '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.input}>
                            <Text style={{ fontWeight: 'bold' }}>Sales Group</Text>
                            <View style={{ marginVertical: '3%' }}>
                                <Text>{showObject ? showObject.groupNameTh : '-'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowLabel}>
                        <View style={styles.input}>
                            <Text style={{ fontWeight: 'bold' }}>Customer Group</Text>
                            <View style={{ marginVertical: '3%' }}>
                                <Text>{showObject ? showObject.custGroup : '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.input}>
                            <Text style={{ fontWeight: 'bold' }}>Payment Terms</Text>
                            <View style={{ marginVertical: '3%' }}>
                                <Text>{showObject ? showObject.paymentTerm : '-'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.input, { marginHorizontal: 20 }]}>
                        <Text style={{ fontWeight: 'bold' }}>Incoterms</Text>
                        <View style={{ marginVertical: 10 }}>
                            <Text>{showObject ? showObject.incoterm : '-'}</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    topLabel: {
        width: '100%',
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: '5%'
    },
    titleLabel: {
        flex: 1,
        justifyContent: 'center',
        padding: '5%'
    },
    rowLabel: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginHorizontal: '5%'
    },
    input: {
        flex: 1 / 2,
        paddingRight: '3%'
    },
})

export default SubmenuSalesData;
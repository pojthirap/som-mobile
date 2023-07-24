import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'

import colors from '../../utility/colors'
import Text from '../Text'

const TableStockCount = ({ data,
    editable = false,
    spaceHorizontal = 10
}) => {

    const tableHeader = () => {
        return (
            <View style={styles.tableHeader}>
                <View style={[styles.columnHeader, { width: 80 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>ลำดับ</Text>
                </View>
                <View style={[styles.columnHeader, { width: 150 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Product Code</Text>
                </View>
                <View style={[styles.columnHeader, { width: 220 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Product Name</Text>
                </View>
                <View style={[styles.columnHeader, { width: 120 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Base Unit</Text>
                </View>
                <View style={[styles.columnHeader, { width: 120 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Qty</Text>
                </View>
                <View style={[styles.columnHeader, { width: 120 }]}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Unit</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container, { marginHorizontal: spaceHorizontal }]}>
            <ScrollView horizontal={true} style={{}}>
                <FlatList
                    contentContainerStyle={{ borderRadius: 20, overflow: 'hidden' }}
                    data={data}
                    keyExtractor={(item, index) => index + ""}
                    ListHeaderComponent={tableHeader}
                    stickyHeaderIndices={[0]}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{
                                ...styles.tableRow,
                                backgroundColor: index % 2 == 1 ? colors.white : colors.grayborder,
                                borderBottomWidth: 1,
                                borderColor: colors.gray,
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.itemTable, { width: 80, justifyContent: item.listRecQty.length > 1 ? null : "center" }]}>
                                        <Text style={styles.columnRowTxt}>{index + 1}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 150, justifyContent: item.listRecQty.length > 1 ? null : "center" }]}>
                                        <Text style={styles.columnRowTxt}>{item.productCode}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 220, justifyContent: item.listRecQty.length > 1 ? null : "center" }]}>
                                        <Text style={styles.columnRowTxt}>{item.productName}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 120, justifyContent: item.listRecQty.length > 1 ? null : "center" }]}>
                                        <Text style={styles.columnRowTxt}>{item.baseUnit}</Text>
                                    </View>
                                    <View style={[styles.itemTable, { width: 120, justifyContent: "center" }]}>
                                        {
                                            item.listRecQty && item.listRecQty.length && (
                                                item.listRecQty.map((item, index) => {
                                                    return (
                                                        <View>
                                                            <Text style={styles.columnRowTxt}>{item.qry}</Text>
                                                        </View>
                                                    )
                                                })
                                            )
                                        }
                                    </View>
                                    <View style={[styles.itemTable, { width: 120, justifyContent: "center" }]}>
                                        {
                                            item.listRecQty && item.listRecQty.length && (
                                                item.listRecQty.map((item, index) => {
                                                    return (
                                                        <View>
                                                            <Text style={styles.columnRowTxt}>{item.altUnit}</Text>
                                                        </View>
                                                    )
                                                })
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        )
                    }
                    }
                />
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
    },
    tableRow: {
        flexDirection: "row",
        minHeight: 50
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
        paddingLeft: 20,
    },
    itemTable: {
        borderLeftWidth: 0.5,
        borderColor: colors.gray,
        minHeight: 50,
    },
});


export default TableStockCount;
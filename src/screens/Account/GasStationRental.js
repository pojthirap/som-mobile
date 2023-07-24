import React, { useState, useEffect, useRef } from 'react'
import { View, FlatList, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'

import { getMyRentStaion, getRentInTerritory } from '../../actions/rentStationAtion';
import { getConfigLov } from '../../actions/getConfigLovAccountAction';
import { Cardcollapsible, SearchInput, Text, Header, Filter, ModalWarning } from '../../components'
import { FONT_SIZE } from '../../utility/enum'
import colors from '../../utility/colors'
import { getInputData } from '../../utility/helper';
const { width } = Dimensions.get('window')

const GasStationRental = () => {

    const { rentStationReducer, getConfigLovAccountReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [myRentStationPage, setMyRentStationPage] = useState(1);
    const [myInTerritoryPage, setMyInTerritoryPage] = useState(1);
    const [modalError, setModalError] = useState(false);
    const [msgError, setMsgError] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getMyRentStaion())
            dispatch(getRentInTerritory())
            dispatch(getConfigLov("PROSPECT_STATUS"))
            // Do something when the screen is focused
            return () => {
                inputRef.current.accName.clear()
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {
        if ((rentStationReducer.dataRentErrorMSG != '') && !rentStationReducer.dataRentErrorMSG_Loading) {
            setModalError(true);
            setMsgError(`${rentStationReducer.dataRentErrorMSG}`);
        }
        else if ((rentStationReducer.dataRentInTerritoryErrorMSG != '') && !rentStationReducer.dataRentInTerritoryErrorMSG_Loding) {
            setModalError(true);
            setMsgError(`${rentStationReducer.dataRentInTerritoryErrorMSG}`);
        }
    }, [rentStationReducer.dataRentErrorMSG, rentStationReducer.dataRentInTerritoryErrorMSG])

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef);
        let search = totalValue.data;

        if (!totalValue.isInvalid) {
            dispatch(getMyRentStaion(search.accName.name, search.prospectFilter))
            dispatch(getRentInTerritory(search.accName.name, search.territoryFilter))
        }
    }

    const onViewableItemsChanged = ({
        viewableItems,
    }) => {
        if (viewableItems[0] != undefined) {
            setMyRentStationPage(viewableItems[0].index + 1)
        }
    };

    const viewabilityConfigCallbackPairsRentStatus = useRef([
        {
            viewabilityConfig: {
                minimumViewTime: 0,
                itemVisiblePercentThreshold: 1
            }, onViewableItemsChanged: onViewableItemsChanged
        },
    ]);

    const onViewableInTorritoryItemsChanged = ({
        viewableItems,
    }) => {
        if (viewableItems[0] != undefined) {
            setMyInTerritoryPage(viewableItems[0].index + 1)
        }
    };

    const viewabilityConfigCallbackPairsInTorritory = useRef([
        {
            viewabilityConfig: {
                minimumViewTime: 0,
                itemVisiblePercentThreshold: 1
            }, onViewableItemsChanged: onViewableInTorritoryItemsChanged
        },
    ]);

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView>
                <View style={{ flex: 1, marginTop: 30, alignSelf: 'center', marginHorizontal: '3%' }}>
                    <SearchInput
                        SearchBarType={'SearchBarButton'}
                        // widthSearchBox={'30%'}
                        // SearchBarWidth={'63%'}
                        // buttonWidth={'70%'}
                        onPressSearch={() => handleSubmit()}
                        ref={el => inputRef.current.accName = el}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: '3%', paddingBottom: '2%', paddingTop: '4%' }}>
                        <View style={{ alignSelf: 'flex-start' }}>
                            <Text style={{ fontSize: FONT_SIZE.HEADER }}>ปั๊มเช่า</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', marginBottom: '2%' }}>
                        <View>
                            <Text style={{ fontSize: FONT_SIZE.TITLE }}>ปั๊มเช่าของฉัน</Text>
                        </View>
                        {/* <View>
                        <Filter onPress={() => handleSubmitFilter('RENT')} ref={el => inputRef.current.prospectFilter = el} station={true}/>
                   </View> */}
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', marginBottom: '3%' }}>
                        <View>
                            <Text>แสดง {rentStationReducer.dataRent.totalRecords} รายการ</Text>
                        </View>
                        <View>
                            <Text>หน้า {myRentStationPage} ของ {rentStationReducer.dataRent ? Math.ceil(rentStationReducer.dataRent.totalRecords / 8) : 0}</Text>
                        </View>
                    </View>
                    <View style={{ paddingBottom: '3%' }}>
                        {
                            rentStationReducer.dataRent && rentStationReducer.dataRent.records.length != 0 ?
                                <FlatList
                                    viewabilityConfigCallbackPairs={
                                        viewabilityConfigCallbackPairsRentStatus.current
                                    }
                                    horizontal
                                    pagingEnabled
                                    numColumns={1}
                                    data={rentStationReducer.dataRent ? rentStationReducer.dataRent.item : []}
                                    renderItem={({ item }) => <View style={{ width: width }} >
                                        <FlatList
                                            data={item.items}
                                            renderItem={(data) =>
                                                <Cardcollapsible
                                                    customID={data?.item?.prospectAccount?.custCode || ''}
                                                    isStatus={true}
                                                    status={data.item.prospect.prospectStatus}
                                                    companyName={data.item.prospectAccount.accName}
                                                    phone={data.item.prospectAddress.tellNo}
                                                    fax={data.item.prospectAddress.faxNo}
                                                    lat={data.item.prospectAddress.latitude}
                                                    long={data.item.prospectAddress.longitude}
                                                    isRentStation={true}
                                                    Infomation={data.item}
                                                    Nav={['snbmenuProspect', 'FE_ACC_PUMP_S011']}
                                                />
                                            }
                                            numColumns={2}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>}
                                />
                                :
                                <View style={{ alignSelf: 'center', marginVertical: 20 }}>
                                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, fontWeight: 'bold' }}>ไม่พบข้อมูล</Text>
                                </View>
                        }
                    </View>

                    <View style={{ flex: 1, backgroundColor: colors.greenBGTerritory }}>
                        <View style={{ marginHorizontal: '3%', paddingTop: '8%' }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2%' }}>
                                <View>
                                    <Text style={{ fontSize: FONT_SIZE.TITLE }}>In Territory</Text>
                                </View>
                                {/* <View>
                            <Filter onPress={() => handleSubmitFilter('TERRITORY')} ref={el => inputRef.current.territoryFilter = el} station={true}/>
                        </View> */}
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '3%' }}>
                                <View>
                                    <Text>แสดง {rentStationReducer.dataRentInTerritory.totalRecords} รายการ</Text>
                                </View>
                                <View>
                                    <Text>หน้า {myInTerritoryPage} ของ {rentStationReducer.dataRentInTerritory ? Math.ceil(rentStationReducer.dataRentInTerritory.totalRecords / 8) : 0}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingBottom: '3%' }}>
                            {
                                rentStationReducer.dataRentInTerritory && rentStationReducer.dataRentInTerritory.records.length != 0 ?
                                    <FlatList
                                        viewabilityConfigCallbackPairs={
                                            viewabilityConfigCallbackPairsInTorritory.current
                                        }
                                        horizontal
                                        pagingEnabled
                                        numColumns={1}
                                        data={rentStationReducer.dataRentInTerritory ? rentStationReducer.dataRentInTerritory.item : []}
                                        renderItem={({ item }) => <View style={{ width: width }} >
                                            <FlatList
                                                data={item.items}
                                                renderItem={(data) =>
                                                    <Cardcollapsible
                                                        customID={data?.item?.prospectAccount?.custCode || ''}
                                                        isStatus={true}
                                                        status={data.item.prospect.prospectStatus}
                                                        companyName={data.item.prospectAccount.accName}
                                                        phone={data.item.prospectAddress.tellNo}
                                                        fax={data.item.prospectAddress.faxNo}
                                                        lat={data.item.prospectAddress.latitude}
                                                        long={data.item.prospectAddress.longitude}
                                                        isRentStation={true}
                                                        Infomation={data.item}
                                                        Nav={['snbmenuProspect', 'FE_ACC_PUMP_S011']}
                                                    />
                                                }
                                                numColumns={2}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>}
                                    />
                                    :
                                    <View style={{ alignSelf: 'center', marginVertical: 20 }}>
                                        <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, fontWeight: 'bold' }}>ไม่พบข้อมูล</Text>
                                    </View>
                            }
                        </View>
                    </View>
                </View>
                <ModalWarning
                    WARNINGTITLE
                    onlyCloseButton
                    visible={modalError}
                    detailText={msgError}
                    onPressClose={() => setModalError(false)}
                />
            </ScrollView>
        </View>
    )
}

export default GasStationRental;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
});
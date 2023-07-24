import React, { useState, useEffect, useRef } from 'react'
import { View, FlatList, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';

import { getMyProspect, getReccomentBUProspect, getTerritoryProspect } from '../../actions/prospectAction';
import { getProspectSelectData } from '../../actions/prospectSelectInfoAction'
import { getConfigLov } from '../../actions/getConfigLovAccountAction';
import { Cardcollapsible, SearchInput, Button, Text, Header, Filter, ModalWarning } from '../../components'
import { FONT_SIZE } from '../../utility/enum'
import colors from '../../utility/colors'
import { getInputData } from '../../utility/helper';
import language from '../../language/th.json';

const { width } = Dimensions.get('window')

const Prospect = () => {

    const navigation = useNavigation();

    const { prospectReducer, getUserProfileReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [reccomentBUPage, setReccomentBUPage] = useState(1);
    const [myProspectPage, setMyProspectPage] = useState(1);
    const [myInTerritoryPage, setMyInTerritoryPage] = useState(1);
    const [filterSelect, setFilterSelect] = useState([]);
    const [filterRecSelect, setFilterRecSelect] = useState([]);
    const [filterTerSelect, setFilterTerSelect] = useState([]);
    const [modalError, setModalError] = useState(false);
    const [msgError, setMsgError] = useState('');

    let listPermissionUser = getUserProfileReducer.dataUserProfile.listPermObjCode;

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getMyProspect())
            dispatch(getReccomentBUProspect())
            dispatch(getTerritoryProspect())
            dispatch(getConfigLov("PROSPECT_STATUS"))
            // Do something when the screen is focused
            return () => {
                inputRef.current.accName.clear()
                setFilterSelect('')
                setFilterRecSelect('')
                setFilterTerSelect('')
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {
        if ((prospectReducer.dataMyProspectErrorMSG != '') && !prospectReducer.dataMyProspectErrorMSG_Loding) {
            setModalError(true);
            setMsgError(`${prospectReducer.dataMyProspectErrorMSG}`);
        }
        else if ((prospectReducer.dataReccomentBUErrorMSG != '') && !prospectReducer.dataReccomentBUErrorMSG_Loding) {
            setModalError(true);
            setMsgError(`${prospectReducer.dataReccomentBUErrorMSG}`);
        }
        else if ((prospectReducer.dataInTerritoryErrorMSG != '') && !prospectReducer.dataInTerritoryErrorMSG_Loding) {
            setModalError(true);
            setMsgError(`${prospectReducer.dataInTerritoryErrorMSG}`);
        }
    }, [prospectReducer.dataMyProspectErrorMSG, prospectReducer.dataReccomentBUErrorMSG, prospectReducer.dataInTerritoryErrorMSG])

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef);
        let search = totalValue.data;

        if (!totalValue.isInvalid) {
            dispatch(getMyProspect(search.accName.name, search.prospectFilter))
            dispatch(getReccomentBUProspect(search.accName.name, search.reccomendFilter))
            dispatch(getTerritoryProspect(search.accName.name, search.territoryFilter))
        }
    }

    const handleSubmitFilter = (type) => {
        let totalValue = getInputData(inputRef);
        let search = totalValue.data;

        if (!totalValue.isInvalid) {
            setFilterSelect(search.prospectFilter)
            setFilterRecSelect(search.reccomendFilter)
            setFilterTerSelect(search.territoryFilter)
            if (type == 'PROSPECT') return dispatch(getMyProspect(search.accName.name, search.prospectFilter))
            if (type == 'RECCOMENT') return dispatch(getReccomentBUProspect(search.accName.name, search.reccomendFilter))
            if (type == 'TERRITORY') return dispatch(getTerritoryProspect(search.accName.name, search.territoryFilter))
        }
    }

    //// myProspect
    const onViewableItemsChanged = ({
        viewableItems,
    }) => {
        if (viewableItems[0] != undefined) {
            setMyProspectPage(viewableItems[0].index + 1)
        }
    };

    const viewabilityConfigCallbackPairsProspect = useRef([
        {
            viewabilityConfig: {
                minimumViewTime: 0,
                itemVisiblePercentThreshold: 1
            }, onViewableItemsChanged: onViewableItemsChanged
        },
    ]);

    //// BuReccommend
    const onViewableBuReccommendItemsChanged = ({
        viewableItems,
    }) => {
        if (viewableItems[0] != undefined) {
            setReccomentBUPage(viewableItems[0].index + 1)
        }
    };

    const viewabilityConfigCallbackPairsBuRecommend = useRef([
        {
            viewabilityConfig: {
                minimumViewTime: 0,
                itemVisiblePercentThreshold: 1
            }, onViewableItemsChanged: onViewableBuReccommendItemsChanged
        },
    ]);

    //// myInTerritory
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

    const handleNavScreen = (screen, permObjCode) => {
        let premissionScreen = listPermissionUser.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        if (premissionScreen) return navigation.navigate(screen);
        if (!premissionScreen) return navigation.navigate('DontHavePermission');
    };

    const handleNavScreenButton = (permObjCode) => {
        let premissionScreen = listPermissionUser.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        if (premissionScreen) return true;
        if (!premissionScreen) return false;
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView>
                <View style={{ flex: 1, marginTop: 10, alignSelf: 'center', marginHorizontal: '3%' }}>
                    <SearchInput
                        SearchBarType={'SearchBarButton'}
                        // widthSearchBox={'30%'}
                        // SearchBarWidth={'100%'}
                        // buttonWidth={'70%'}
                        onPressSearch={() => handleSubmit()}
                        ref={el => inputRef.current.accName = el}
                    />
                </View>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', paddingBottom: '3%', paddingTop: '4%' }}>
                        <View style={{ flex: 1 / 2, alignSelf: 'center' }}>
                            <Text style={{ fontSize: FONT_SIZE.HEADER }}>Prospect</Text>
                        </View>
                        <View style={{ flex: 1 / 4 }}>
                            {
                                handleNavScreenButton('FE_ACC_PROSP_S01_ADD') ?
                                    <Button title={'Create Prospect'} typeIcon={'Ionicons'} nameIcon={'add-outline'} onPress={() => handleNavScreen('createProspect', 'FE_ACC_PROSP_S011')} />
                                    :
                                    null
                            }
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', marginBottom: '2%' }}>
                        <View>
                            <Text style={{ fontSize: FONT_SIZE.TITLE }}>My Prospect</Text>
                        </View>
                        <View>
                            <Filter onPress={() => handleSubmitFilter('PROSPECT')} ref={el => inputRef.current.prospectFilter = el} select={filterSelect} />
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', marginBottom: '3%' }}>
                        <View>
                            <Text>แสดง {prospectReducer.dataMyProspect.totalRecords} รายการ</Text>
                        </View>
                        <View>
                            <Text>หน้า {myProspectPage} ของ {prospectReducer.dataMyProspect ? Math.ceil(prospectReducer.dataMyProspect.totalRecords / 8) : 0}</Text>
                        </View>
                    </View>
                    <View style={{ paddingBottom: '3%' }}>
                        {
                            prospectReducer.dataMyProspect && prospectReducer.dataMyProspect.records.length != 0 ?
                                <FlatList
                                    viewabilityConfigCallbackPairs={
                                        viewabilityConfigCallbackPairsProspect.current
                                    }
                                    horizontal
                                    pagingEnabled
                                    numColumns={1}
                                    data={prospectReducer.dataMyProspect ? prospectReducer.dataMyProspect.item : []}
                                    renderItem={({ item }) => <View style={{ width: width }} >
                                        <FlatList
                                            data={item.items}
                                            renderItem={(data) =>
                                                <Cardcollapsible
                                                    isStatus={true}
                                                    prospectId={data.item.prospect.prospectId}
                                                    status={data.item.prospect.prospectStatus}
                                                    companyName={data.item.prospectAccount.accName}
                                                    phone={data.item.prospectAddress.tellNo}
                                                    fax={data.item.prospectAddress.faxNo}
                                                    lat={data.item.prospectAddress.latitude}
                                                    long={data.item.prospectAddress.longitude}
                                                    Infomation={data.item}
                                                    Nav={['snbmenuProspect', 'FE_ACC_PROSP_S012']}
                                                    isProspect={true}
                                                    isProspectMyProspect={true}
                                                />
                                            }
                                            numColumns={2}
                                            keyExtractor={(item, index) => index}
                                        />
                                    </View>}
                                />
                                :
                                <View style={{ alignSelf: 'center', marginVertical: '10%' }}>
                                    <Text style={{ fontSize: FONT_SIZE.LITTLETEXT, fontWeight: 'bold' }}>ไม่พบข้อมูล</Text>
                                </View>
                        }
                    </View>
                </View>

                <View style={{ flex: 1, backgroundColor: colors.greenBGStatus }}>
                    <View style={{ marginHorizontal: '3%', paddingTop: '8%' }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2%' }}>
                            <View>
                                <Text style={{ fontSize: FONT_SIZE.TITLE }}>Reccomend BU</Text>
                            </View>
                            <View>
                                <Filter onPress={() => handleSubmitFilter('RECCOMENT')} ref={el => inputRef.current.reccomendFilter = el} select={filterRecSelect} />
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '3%' }}>
                            <View>
                                <Text>แสดง {prospectReducer.dataReccomentBU.totalRecords} รายการ</Text>
                            </View>
                            <View>
                                <Text>หน้า {reccomentBUPage} ของ {prospectReducer.dataReccomentBU ? Math.ceil(prospectReducer.dataReccomentBU.totalRecords / 8) : 0}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingBottom: '3%' }}>
                        {
                            prospectReducer.dataReccomentBU && prospectReducer.dataReccomentBU.records.length != 0 ?
                                <FlatList
                                    viewabilityConfigCallbackPairs={
                                        viewabilityConfigCallbackPairsBuRecommend.current
                                    }
                                    horizontal
                                    pagingEnabled
                                    numColumns={1}
                                    data={prospectReducer.dataReccomentBU ? prospectReducer.dataReccomentBU.item : []}
                                    renderItem={({ item }) => <View style={{ width: width }} >
                                        <FlatList
                                            data={item.items}
                                            renderItem={(data) =>
                                                <Cardcollapsible
                                                    isStatus={true}
                                                    prospectId={data.item.prospect.prospectId}
                                                    status={data.item.prospect.prospectStatus}
                                                    companyName={data.item.prospectAccount.accName}
                                                    phone={data.item.prospectAddress.tellNo}
                                                    fax={data.item.prospectAddress.faxNo}
                                                    lat={data.item.prospectAddress.latitude}
                                                    long={data.item.prospectAddress.longitude}
                                                    Infomation={data.item}
                                                    Nav={['snbmenuProspect', 'FE_ACC_PROSP_S012']}
                                                    isRecommandBUProspect={true}
                                                />
                                            }
                                            numColumns={2}
                                            keyExtractor={(item, index) => index}
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

                <View style={{ flex: 1, backgroundColor: colors.greenBGTerritory }}>
                    <View style={{ marginHorizontal: '3%', paddingTop: '8%' }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2%' }}>
                            <View>
                                <Text style={{ fontSize: FONT_SIZE.TITLE }}>In Territory</Text>
                            </View>
                            <View>
                                <Filter onPress={() => handleSubmitFilter('TERRITORY')} ref={el => inputRef.current.territoryFilter = el} select={filterTerSelect} />
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: '3%' }}>
                            <View>
                                <Text>แสดง {prospectReducer.dataInTerritory.totalRecords} รายการ</Text>
                            </View>
                            <View>
                                <Text>หน้า {myInTerritoryPage} ของ {prospectReducer.dataInTerritory ? Math.ceil(prospectReducer.dataInTerritory.totalRecords / 8) : 0}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingBottom: '3%' }}>
                        {
                            prospectReducer.dataInTerritory && prospectReducer.dataInTerritory.records.length != 0 ?
                                <FlatList
                                    viewabilityConfigCallbackPairs={
                                        viewabilityConfigCallbackPairsInTorritory.current
                                    }
                                    horizontal
                                    pagingEnabled
                                    numColumns={1}
                                    data={prospectReducer.dataInTerritory ? prospectReducer.dataInTerritory.item : []}
                                    renderItem={({ item }) => <View style={{ width: width }} >
                                        <FlatList
                                            data={item.items}
                                            renderItem={(data) =>
                                                <Cardcollapsible
                                                    isStatus={true}
                                                    prospectId={data.item.prospect.prospectId}
                                                    status={data.item.prospect.prospectStatus}
                                                    companyName={data.item.prospectAccount.accName}
                                                    phone={data.item.prospectAddress.tellNo}
                                                    fax={data.item.prospectAddress.faxNo}
                                                    lat={data.item.prospectAddress.latitude}
                                                    long={data.item.prospectAddress.longitude}
                                                    Infomation={data.item}
                                                    Nav={['snbmenuProspect', 'FE_ACC_PROSP_S012']}
                                                    isProspect={true}
                                                />
                                            }
                                            numColumns={2}
                                            keyExtractor={(item, index) => index}
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

export default Prospect;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
});
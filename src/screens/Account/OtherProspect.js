import React, { useEffect, useRef, useState } from 'react'
import { View, FlatList, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'

import { getMyOtherProspect } from '../../actions/otherProspectAction';
import { getConfigLov } from '../../actions/getConfigLovAccountAction';
import { Cardcollapsible, SearchInput, Text, Header, Filter, ModalWarning } from '../../components'
import { FONT_SIZE } from '../../utility/enum'
import colors from '../../utility/colors'
import { getInputData } from '../../utility/helper';

const OtherProspect = () => {

    const { otherProspectReducer, getConfigLovAccountReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});
    const [filterSelect, setFilterSelect] = useState([]);
    const [modalError, setModalError] = useState(false);
    const [msgError, setMsgError] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getMyOtherProspect())
            dispatch(getConfigLov("PROSPECT_STATUS"))
            // Do something when the screen is focused
            return () => {
                inputRef.current.accName.clear()
                setFilterSelect('')
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {
        if ((otherProspectReducer.dataOtherErrorMSG != '') && !otherProspectReducer.dataOtherErrorMSG_Loading) {
            setModalError(true);
            setMsgError(`${otherProspectReducer.dataOtherErrorMSG}`);
        }
    }, [otherProspectReducer.dataOtherErrorMSG])

    const handleSubmit = () => {
        let totalValue = getInputData(inputRef);
        let search = totalValue.data;

        if (!totalValue.isInvalid) {
            dispatch(getMyOtherProspect(search.accName.name, search.prospectFilter))
        }
    }

    const handleSubmitFilter = (type) => {
        let totalValue = getInputData(inputRef);
        let search = totalValue.data;

        if (!totalValue.isInvalid) {
            setFilterSelect(search.prospectFilter)
            if (type == 'OTHER') return dispatch(getMyOtherProspect(search.accName.name, search.prospectFilter))
        }
    }

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
                <View>
                    <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: '3%', paddingBottom: '2%', paddingTop: '4%' }}>
                        <View style={{ alignSelf: 'flex-start' }}>
                            <Text style={{ fontSize: FONT_SIZE.HEADER }}>Other Prospect</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', marginBottom: '2%' }}>
                        <View>
                            <Text style={{ fontSize: FONT_SIZE.TITLE }}>My Other Prospect</Text>
                        </View>
                        <View>
                            <Filter onPress={() => handleSubmitFilter('OTHER')} ref={el => inputRef.current.prospectFilter = el} select={filterSelect} />
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', marginBottom: '3%' }}>
                        <View>
                            <Text>แสดง {otherProspectReducer.dataOther.totalRecords} รายการ</Text>
                        </View>
                        <View>
                            <Text>หน้า {1} ของ {otherProspectReducer.dataOther ? 1 : 0}</Text>
                        </View>
                    </View>
                    <View style={{ paddingBottom: '3%' }}>
                        {
                            otherProspectReducer.dataOther && otherProspectReducer.dataOther.records.length != 0 ?
                                <FlatList
                                    // numColumns={1}
                                    data={otherProspectReducer.dataOther.records}
                                    renderItem={(data) =>
                                        <Cardcollapsible
                                            customID={data?.item?.prospectAccount?.custCode ? data.item.prospectAccount.custCode : data.item.prospect.prospectId}
                                            isStatus={true}
                                            status={data.item.prospect.prospectStatus}
                                            companyName={data.item.prospectAccount.accName}
                                            phone={data.item.prospectAddress.tellNo}
                                            fax={data.item.prospectAddress.faxNo}
                                            lat={data.item.prospectAddress.latitude}
                                            long={data.item.prospectAddress.longitude}
                                            Infomation={data.item}
                                            buId={data.item.prospect.buId}
                                            buName={data.item.buNameTh}
                                            Nav={['snbmenuProspect', 'FE_ACC_OTHER_S011']}
                                            isOther={true}
                                        />
                                    }
                                    numColumns={2}
                                    keyExtractor={(item, index) => index.toString()}
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

export default OtherProspect;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
});
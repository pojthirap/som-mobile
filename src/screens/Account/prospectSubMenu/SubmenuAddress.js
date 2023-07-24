import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { CardCarousel, Text, Address, Button } from '../../../components';
import { FONT_SIZE } from '../../../utility/enum';
import colors from '../../../utility/colors';
import { getProspectAddress } from '../../../actions/prospectAction';

const SubmenuAddress = (prosp) => {

    const {prospectReducer} = useSelector((state) => state);
    const {masterReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const [dataAddressPros, setDataAddressPros] = useState(prospectReducer.addressProspect);
    const {prospectSelectInfoReducer} = useSelector((state) => state);
    const [indexAddress, setIndexAddress] = useState(0);
    const [isCustomer,setIsCustomer] = useState(prospectSelectInfoReducer.dataSelect.isCustomer ? true : false)
    const [isRentStation,setIsRentStation] = useState(prospectSelectInfoReducer.dataSelect.isRentStation ? true : false)
    const [isOther,setIsOther] = useState(prospectSelectInfoReducer.dataSelect.isOther ? true : false)
    const [isRecommandBUProspect,setIsRecommandBUProspect] = useState(prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ? true : false)
    const navigation = useNavigation();
    
    useEffect(() => {

        // if (prospectReducer.prospectAddress_loading) {
        dispatch(getProspectAddress(prospectSelectInfoReducer.dataSelect));    
        // }

    }, [])  

    useFocusEffect(
        React.useCallback(() => {
                dispatch(getProspectAddress(prospectSelectInfoReducer.dataSelect));
            return () => {
          };
        }, [])
    );

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const handleCheckBox = () => {
        if (isCustomer) return true

        return false
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={styles.topLabel}>
                    <View style={{ flex: 1, marginLeft: '5%', marginTop: '5%'}}>
                        <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                    </View>
                </View>  
                {
                    isCustomer == true && !prospectReducer.addressProspect ?
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>ไม่พบข้อมูล</Text>
                    </View>
                    :
                    <>
                    <CardCarousel isAddress ={true} data={prospectReducer.addressProspect} mainAddressFlagYes={isCustomer ? '-' : 'Yes'}
                        ref={el => el ? setIndexAddress(el.getIndexNumber().dataIndex) : 0 }/>

                    <View style={{backgroundColor: colors.white, paddingBottom: 30}}>
                        {/* Address */}
                            {
                                prospectReducer.addressProspect && <Address 
                                                                        textTitle={'รายละเอียด'}
                                                                        editable={false}
                                                                        disabled={true}
                                                                        addressTab={prospectReducer.addressProspect}
                                                                        provinceName={masterReducer.province}
                                                                        indexAddress={indexAddress} 
                                                                        ADDRESSCUSTOMER={handleCheckBox()}
                                                                    />
                            }
                    </View>
                    </>
                }
            </ScrollView>
                       
        </View>
    )
}

const styles = StyleSheet.create({
    topLabel: {
        width: '100%',
        flex: 1,
        marginBottom: '5%'
    },
    buttonLow: {
        flex: 1,
        paddingHorizontal: 20,
        marginVertical: 20,
        alignItems: 'center',
        maxWidth: 500
    },
})

export default SubmenuAddress;

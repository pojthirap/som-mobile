import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Icon } from 'native-base';
import { Calendar } from 'react-native-big-calendar'
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import {useDispatch, useSelector} from 'react-redux';

import colors from '../utility/colors'
import { Header, Text } from '../components';
import { FONT_SIZE } from '../utility/enum';
import { getSearchPlanTrip, getEmpForAssignPlanTrip, mergPlanTrip } from '../actions/SaleVisitPlanAction';
import { getConfigLovPlanStatus } from '../actions/getConfigLovAction';
import { getSearchEmailJobForPlanTrip } from '../actions/homeAction';

const DontHavePermission = () => {
    return (
        <View style={styles.container}>
            <Header/>
            <View style={{flex: 1, flexDirection:'row', justifyContent:'space-between', backgroundColor: colors.white}}>
                <View style={{paddingHorizontal:40, paddingTop:25}}>
                    <Text style={{fontSize:35, fontWeight:'bold'}}>You don't have permission in this page.</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.greenBGStatus,
    },
    styleShadow: {
        shadowOffset: {
            height: 3,
            width: 5
        },
        shadowRadius: 20,
        shadowOpacity: 0.2,
        shadowColor: colors.black,
        elevation: 10,
      },
});


export default DontHavePermission;

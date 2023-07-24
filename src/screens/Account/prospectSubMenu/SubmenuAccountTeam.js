import React,{ useEffect, useRef, useState } from 'react';
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'

import { Text, TabAccTeam, SearchInput } from '../../../components';
import colors from '../../../utility/colors';
import { FONT_SIZE } from '../../../utility/enum';
import { getAccountTeam } from '../../../actions/prospectAction';
import { getInputData } from '../../../utility/helper';

const SubmenuAccTeam = () => {
    
    const {prospectReducer,prospectSelectInfoReducer} = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(prospectId){
            dispatch(getAccountTeam(prospectId))
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
            dispatch(getAccountTeam(prospectId))
          // Do something when the screen is focused
          return () => {
            inputRef.current.fullName.clear()
            // Do something when the screen is unfocused
            // Useful for cleanup functions
          };
        }, [])
      );

    const getLength = () =>{
        if(prospectReducer.dataAccoutTeam){
            let length = prospectReducer.dataAccoutTeam.records.reduce((sum,item)=>{
                 return item.salesRep.length + sum }, 0)
            return length
        }else{
            return 0
        }
    }

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const handleSubmit = () => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        let totalValue = getInputData(inputRef);
        let search = totalValue.data;
        if (!totalValue.isInvalid) {
            dispatch(getAccountTeam(prospectId,search.fullName.name))
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <ScrollView>
                <View style={styles.topLabel}>
                    <View>
                        <View style={{marginTop: '5%'}}>
                            <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection:'row'}}>
                        <View>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, fontWeight:'bold'}}>All Order</Text>
                        </View>
                        <View>
                            <Text style={{fontSize: FONT_SIZE.SUBTITLE, color:colors.primary, fontWeight:'bold'}}> ({getLength()})</Text> 
                        </View>  
                    </View>
                </View>
                <View style={{flex: 1 , paddingHorizontal: '5%', marginBottom: '5%', alignSelf:'center'}}>
                    <SearchInput 
                        SearchBarType={'SearchBarButton'}  
                        // widthSearchBox={'30%'} 
                        // SearchBarWidth={'70%'}
                        // buttonWidth={'70%'}
                        onPressSearch={() => handleSubmit()} 
                        ref={el => inputRef.current.fullName = el}/>
                </View>
                <FlatList
                    data = {prospectReducer.dataAccoutTeam.records}
                    renderItem = {(item) =>
                        <View style={styles.flatStyle}>
                            { item.item.salesRep.length !=0 ?
                                item.item.salesRep.map((sal) =>{
                                    return <TabAccTeam
                                    nameEmployee={`${sal.admEmployee.titleName}  ${sal.admEmployee.firstName}  ${sal.admEmployee.lastName}`}
                                    roleEmployee={sal.admGroup.groupNameTh}
                                    phoneEmployee={sal.admEmployee.tellNo}
                                    emailEmployee={sal.admEmployee.email}
                                    saleGroup={sal.orgSaleGroup.descriptionTh}
                                    saleTerritory={sal.listOrgTerritory}
                                    />
                                })
                                :
                                <View style={{alignSelf:'center', marginTop:20}}>
                                    <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>ไม่พบข้อมูล</Text>
                                </View>
                            }
                         
                        </View>
                    }
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    topLabel: {
        flex: 1,
        paddingHorizontal: '5%',
        width: '100%'
    },
    flatStyle: {
        paddingVertical: '2%', 
        // borderTopWidth: 1, 
        // borderTopColor: colors.grayborder, 
        marginHorizontal:'5%', 
        flex: 1
    }
})

export default SubmenuAccTeam;
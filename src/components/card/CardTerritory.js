import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Icon } from 'native-base'
import Text from '../Text'
import CheckBox from '../CheckBox'
import Modal from '../Modal'
import colors from '../../utility/colors';
import {ModalWarning} from '../../components'; 
import { getTerritoryForDedicated,addProspectDedicated } from '../../actions/prospectAction';
import language from '../../language/th.json';
import { FONT_SIZE } from '../../utility/enum';

const CardTerritory = ({Rep = true,
                        data,
                        Title,
                        isAddButton = false,
                        remove
                        }) => {
    
    const [modalVisible, setmodalVisible] = useState(false);
    const [selectedItemList, setSelectedItemList] = useState([]);
    const [modalVisibleAddAlert, setmodalVisibleAddAlert] = useState(false);
    const [modalVisibleAlertAdd, setmodalVisibleAlertAdd] = useState(false);
    const [modalVisibleAddSuccess, setmodalVisibleAddSuccess] = useState(false);

    const {prospectReducer,prospectSelectInfoReducer} = useSelector((state) => state);
    const dispatch = useDispatch();

     useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(prospectId){
            dispatch(getTerritoryForDedicated(prospectId))
        }
    }, [])
    
    const ColorList = [
        colors.pinkList,
        colors.mintList,
        colors.purpleList,
        colors.greenList,
        colors.orangeList
    ];

    const onPressPlus = () =>{
        setmodalVisible(true)
        setSelectedItemList([]);
    }

    const onPressModal = (event) => {
        setmodalVisible(event);
        setSelectedItemList([]);
    }

    const findSelect = (select) => {
        if(!selectedItemList) return false;
        return selectedItemList.territoryId === select
    }

    const onPressConfirm = () => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(prospectId && selectedItemList){
            dispatch(addProspectDedicated(prospectId,selectedItemList))
            setmodalVisibleAddSuccess(true)
        }
        setmodalVisible(false);
        setmodalVisibleAlertAdd(false)
    }

    const handleSelect = (value) => {
        let findItem = selectedItemList.find((item) => {
            return item.territoryId == value.territoryId
        })
        
        if (findItem) {
            let filterItem = selectedItemList.filter((item) => {
                return item != value
            })
            return setSelectedItemList(filterItem)
        }

        let List = [...selectedItemList, value]
        return setSelectedItemList(List)
    }

    const getLength = () =>{
        if(prospectReducer.saleTerritoryData){
            let length = data.length
            return length
        }else{
            return 0
        }
    }

    const onCloseWarning = () =>{
        setmodalVisibleAddAlert(false)
        setmodalVisibleAddSuccess(false)
        setmodalVisible(true)
    }

    const onPressModalAdd = (event) => {
        setmodalVisibleAlertAdd(event);
        setmodalVisibleAddSuccess(false);
        setmodalVisibleAddAlert(false)
    }
    const onPressModalAddSuccess = (event) => {
        setmodalVisibleAddSuccess(event);
        setmodalVisibleAlertAdd(false);
    }

    const onPressAdd = () =>{
        if(selectedItemList.length === 0){
            setmodalVisibleAddAlert(true)
            setmodalVisibleAddSuccess(false)
        }else{
            onPressModalAdd(true) 
        }
        // setSelectedItemList([])
    }

    const cardItem = (items) => {
        return (
            <View style={[styles.CardArea,{marginHorizontal: Rep ? '15%':'10%',marginBottom: '1%', width: Rep ? '90%' : '90%'}]}>
                <View style={{paddingHorizontal:'10%',flexDirection:'row',justifyContent:'space-between',paddingTop:'7%',paddingBottom:'3%'}}>
                    { Rep ? 
                        <View style = {{alignSelf:'center'}}>
                            <Text style={{fontSize:22, fontWeight: 'bold' }}>{`${items.item.admEmployee.titleName} ${items.item.admEmployee.firstName} ${items.item.admEmployee.lastName}`}</Text>
                        </View>
                    :
                        <View style = {{alignSelf:'center'}}>
                            <Text style={{fontSize:22, fontWeight: 'bold' }} numberOfLines={2}>{items.item.territoryNameTh}</Text>
                        </View>
                    }
                    {prospectSelectInfoReducer.dataSelect.isOther || prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ?
                        null
                    :
                    isAddButton ?
                        <TouchableOpacity style = {{alignSelf:'center'}} onPress={() => remove(items)}>
                            <Icon type="Ionicons" name="trash-outline" style={{ color: colors.grayDark, fontSize:20 }}/>
                        </TouchableOpacity> 
                    :
                        null
                    }
                   
                </View>
                <View style={{paddingHorizontal:'10%',paddingBottom:'5%'}}>
                    { Rep ? 
                        <View>
                            {/* Loop colors */}
                            {
                                items.item && items.item.listOrgTerritory.length && (
                                    items.item.listOrgTerritory.map((item, index) => {
                                        return (
                                            <View style={{marginBottom:'3%'}}>
                                                <View style={{backgroundColor: ColorList[index % 5],borderRadius:6,padding:7.5}}>
                                                    <Text style = {{alignSelf:'center',fontSize:18}} numberOfLines={1}>{item.territoryNameTh}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                )
                            }
                            <View style={{marginTop:'5%'}}>
                                <Text numberOfLines={2} style={{fontSize:22}}>Sales Group Name : {items.item.orgSaleGroup.descriptionTh }</Text>
                            </View>
                            <View style={{marginTop:'5%'}}>
                                <Text numberOfLines={2} style={{fontSize:22}}>Role : {items.item.admGroup.groupNameTh}</Text>
                            </View>
                            
                            <View style={{flexDirection:'row',marginTop:'5%'}}>
                                <View style={{paddingRight:'4%'}}>
                                    <Icon type="SimpleLineIcons" name="phone" style={{alignItems:'center',color:colors.grayDark, fontSize:20}}/>
                                </View>
                                <View>
                                    {items.item.admEmployee.tellNo ?
                                        <Text style={{color:colors.black, fontSize:22}}>{items.item.admEmployee.tellNo}</Text>
                                    :
                                        <Text style={{color:colors.black, fontSize:22}}> - </Text>
                                    }
                                </View>      
                            </View>

                            <View style={{flexDirection:'row',marginVertical:'5%'}}>
                                <View style={{paddingRight:'4%'}}>
                                    <Icon type="SimpleLineIcons" name="envelope" style={{alignItems:'center',color:colors.grayDark, fontSize:20}}/>
                                </View>
                                <View>
                                    {items.item.admEmployee.email ?
                                        <Text style={{color:colors.black, fontSize:22 }}>{items.item.admEmployee.email}</Text>
                                    :
                                        <Text style={{color:colors.black, fontSize:22 }}> - </Text>
                                    }
                                </View>      
                            </View>
                        </View>
                        // <>
                        // </>
                    :
                        <Text style={{alignSelf:'flex-start', fontSize:20}}>Territory Code : {items.item.territoryCode ? items.item.territoryCode : '   -'}</Text>
                    }
                        
                </View>
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={{flex:1,margin:'2%'}} >
                <View style={[styles.BGArea, {paddingBottom:'5%'}]}>
                <View style={{paddingHorizontal:'7%',paddingTop:'5%'}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style = {{alignSelf:'center', marginBottom:'3%'}}>
                            {/* {Rep || isAddButton ? */}
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:FONT_SIZE.LITTLETEXT, fontWeight:'bold'}}>{Title}</Text>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT, color:colors.primary, fontWeight:'bold'}}> ({getLength()})</Text> 
                            </View>
                            {/* // :
                            // <>
                            // <Text style={{fontSize:25, fontWeight:'bold'}}>{Title}</Text>
                            // </>
                            // } */}
                           
                        </View>
                        {prospectSelectInfoReducer.dataSelect.isOther || prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ?
                            null
                        :
                        isAddButton ?
                            <View style = {{alignSelf:'center'}}>
                                <TouchableOpacity onPress={() => onPressPlus()}>
                                    <Icon type = "MaterialCommunityIcons" name = "plus" style={{ color: colors.grayDark, fontSize: 25}}/>
                                </TouchableOpacity>
                            </View>
                        :
                        null
                        }   
                </View>
                <Modal 
                    visible={modalVisible}
                    BUTTON = {true}
                    confirmText = {'Add'}
                    buttonWidth = {'50%'}
                    onPressCancel={onPressModal}
                    onPressButton={()=>onPressAdd()}
                    title = {'Dedicated Sales Territories'}
                >
                    <ScrollView style={{marginHorizontal:'10%',marginTop:'5%', marginBottom:'10%', height: prospectReducer.TerritoryForDedicated.records && prospectReducer.TerritoryForDedicated.records.length > 5 ? 250 : null}}> 
                    <FlatList
                        data={prospectReducer.TerritoryForDedicated.records}
                        renderItem={(data) =>
                            <CheckBox 
                                onPress={(data)=> handleSelect(data)} 
                                type ={'end'} 
                                title = {data.item.territoryNameTh} 
                                data={data.item}
                                typeSelect = {'multiSelect'}
                                isSelect = {findSelect(data.item.territoryId)}
                            />
                        }
                    />
                    </ScrollView>
                </Modal>
                </View>
                <FlatList 
                    data = {data}
                    renderItem={cardItem}
                />  
                </View>
            </View>
            <ModalWarning
                visible={modalVisibleAlertAdd}
                detailText={language.ADD}
                onPressConfirm={()=> onPressConfirm()}
                onPressCancel={()=> onPressModalAdd(false)}/>
            <ModalWarning
                visible={modalVisibleAddSuccess}
                detailText={language.ADDSUCCESS}
                onlyCloseButton={true}
                onPressClose={()=> onPressModalAddSuccess(false)}/> 
            <ModalWarning
                visible={modalVisibleAddAlert}
                detailText={'กรุณาเลือกข้อมูล'}
                onlyCloseButton={true}
                onPressClose={()=> onCloseWarning()}/> 
        </ScrollView>
        )
}

const styles = StyleSheet.create({
    BGArea:{
        borderRadius : 20,
        backgroundColor: colors.grayborder,
    },
    CardArea :{
        borderRadius : 20,
        backgroundColor: colors.white,
        alignSelf : 'center',
        marginTop : '3%',
        marginBottom: '10%'
    }
});

export default CardTerritory;
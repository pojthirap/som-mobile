import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView, StyleSheet } from 'react-native';
import {useDispatch, useSelector} from 'react-redux'; 

import { CardRecommand, Button, Text, Modal, CheckBox, ModalWarning } from '../../../components'
import { FONT_SIZE } from '../../../utility/enum';
import { getSubReccomentBU, getBusinessUnit, addBusinessUnit, delBusinessUnit } from '../../../actions/prospectAction';
import language from '../../../language/th.json';

const SubmenuRecommandBU = () =>{

    const [modalVisible, setmodalVisible] = useState(false);
    const [selectedItemList, setSelectedItemList] = useState([]);
    const [modalVisibleAlert, setmodalVisibleAlert] = useState(false);
    const [modalVisibleDelete, setmodalVisibleDelete] = useState(false);
    const [deleteItem, setDeleteItem] = useState('')
    const [lengethBusUnit,setLengthBusUnit] = useState()
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [modalVisibleAddAlert, setmodalVisibleAddAlert] = useState(false);
    const [modalVisibleAlertAdd, setmodalVisibleAlertAdd] = useState(false);
    const [modalVisibleAddSuccess, setmodalVisibleAddSuccess] = useState(false);
    const {prospectReducer,prospectSelectInfoReducer} = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        // let prospectId = 1
        if(prospectId){
            dispatch(getSubReccomentBU(prospectId))
            dispatch(getBusinessUnit(prospectId))
        if(prospectReducer.dataBusinessUnit){
            setLengthBusUnit(prospectReducer.dataBusinessUnit.records.length)
        }
        }
    }, [])

    useEffect(() => {  
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        // let prospectId = 1
        if(prospectReducer.addBusinessUnitSuccess){
            dispatch(getSubReccomentBU(prospectId))
            dispatch(getBusinessUnit(prospectId))
            if(selectedItemList.length === 0){
                setmodalVisibleAddSuccess(false)
            }else{
                setmodalVisibleAddSuccess(true)
            }
        }
        if(prospectReducer.delBusinessUnitSuccess){
            dispatch(getSubReccomentBU(prospectId))
            dispatch(getBusinessUnit(prospectId))
            setmodalVisibleDelete(true)
        }

    }, [prospectReducer.addBusinessUnitSuccess,prospectReducer.delBusinessUnitSuccess])

    const handleRemove = (remove) => {
         let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        //  let prospectId = 1
            dispatch(delBusinessUnit(prospectId,remove.item.buId,remove.item.prospRecommId))
            setmodalVisibleAlert(false)
    }

    const onPressModal = (event) => {
        setmodalVisible(event);
        setSelectedItemList([]);
        setIsSelectedAll(false)
    }
    
    const handleSubmit = () => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        // let prospectId = 1
        if(prospectId && selectedItemList){
            dispatch(addBusinessUnit(prospectId,selectedItemList))
        }
        setmodalVisible(false)
        setmodalVisibleAlertAdd(false)
    }

    const onPressAlertDelete = (event) => {
        setmodalVisibleAlert(event);
    }
    
    const findSelect = (select) => {
        return selectedItemList.find((value)=>{
            return value.buId == select
        })
    }

    const selectedAll = () =>{
        if(isSelectedAll != false){
            setSelectedItemList([])
        }else{
            setSelectedItemList(prospectReducer.dataBusinessUnit.records)
        }
        setIsSelectedAll(!isSelectedAll) 
    }

    const handleSelect = (value) => {
        let findItem = selectedItemList.find((item) => {
            return item.buId == value.buId
        })
        
        if (findItem) {
            let filterItem = selectedItemList.filter((item) => {
                return item != value &&  setIsSelectedAll(false)
            })

            return setSelectedItemList(filterItem)
        }
        let List = [...selectedItemList, value]
        if(List.length === prospectReducer.dataBusinessUnit.records.length){
            setIsSelectedAll(true)
        }

        return setSelectedItemList(List)
    }

    const onCloseWarning = () =>{
        setmodalVisibleAddAlert(false)
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
        setSelectedItemList([])
        setmodalVisible(true)
    }

    const onPressAddModal = () =>{
        if(selectedItemList.length === 0){
            setmodalVisibleAddAlert(true)
            setmodalVisibleAlertAdd(false)
            setmodalVisibleAddSuccess(false)
        }
        else if(selectedItemList.length != 0){
            setmodalVisibleAlertAdd(true)
        }
        
    }

    return(
        <View style={{flex:1}}>
            <ScrollView>
            <View style={styles.topLabel}>
                <View style={{marginLeft: '5%', marginTop: '5%'}}>
                    <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''}</Text>
                </View>
                <View style={{alignItems: 'flex-end', marginHorizontal: '5%', marginBottom: '3%'}}>
                    {prospectSelectInfoReducer.dataSelect.isProspect ? 
                        <Button 
                        title = {'Add'}
                        width={'30%'}
                        typeIcon={'Ionicons'}
                        nameIcon={'add-outline'}
                        onPress={() => onPressAdd()}/>
                        : 
                        null
                    }
                </View>
            </View>

            <View style={{marginHorizontal:'2%'}}>
                <CardRecommand data={prospectReducer.dataSubReccomentBU.records}  
                    onRemove={(item) => {
                        setmodalVisibleAlert(true)
                        setDeleteItem(item)
                    }} />
                <ModalWarning
                    visible={modalVisibleAlert}
                    detailText={language.DELETE}
                    onPressConfirm={()=> handleRemove(deleteItem)}
                    onPressCancel={()=> onPressAlertDelete(false)}/>
                <ModalWarning
                    visible={modalVisibleDelete}
                    detailText={language.DELETESUCCESS}
                    onlyCloseButton={true}
                    onPressClose={()=> setmodalVisibleDelete(false)}/>
            </View>
            </ScrollView>  
            <Modal
                visible={modalVisible}
                onPressCancel={onPressModal}
                title = {'Add'}
                BUTTON = {true}
                confirmText= {'Add'}
                buttonWidth={'35%'}
                onPressButton={() => onPressAddModal()}
            >
                 <ScrollView style={{marginHorizontal:'10%',marginTop:'5%', marginBottom:'10%', height: lengethBusUnit > 5 ? 250 : null}}> 
                    <CheckBox 
                            onPress={()=> selectedAll()} 
                            type ={'end'} 
                            title = {'ทั้งหมด'} 
                            typeSelect ={'multiSelect'}
                            SelectDefault={isSelectedAll}
                        />
                   <FlatList
                    data={prospectReducer.dataBusinessUnit.records}
                    renderItem={(data) =>
                        <CheckBox 
                            data={data.item}
                            onPress={(item)=> handleSelect(item)} 
                            type ={'end'} 
                            title = {data.item.buNameTh} 
                            typeSelect ={'multiSelect'}
                            SelectDefault={findSelect(data.item.buId)}
                        />
                    }
                   />
                </ScrollView>
            </Modal>

            <ModalWarning
                visible={modalVisibleAlertAdd}
                detailText={language.ADD}
                onPressConfirm={()=> handleSubmit()}
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
            
        </View>
        )
}


const styles = StyleSheet.create({
    topLabel: {
        width: '100%',
        flex: 1
    },
})

export default SubmenuRecommandBU;
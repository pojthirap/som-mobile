import React, { useState,useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../../utility/colors';
import { CardTerritory, Text, ModalWarning } from '../../../components'
import { FONT_SIZE } from '../../../utility/enum'
import language from '../../../language/th.json';
import { getSaleTerritory,delProspectDedicated,getTerritoryForDedicated } from '../../../actions/prospectAction';

const SubmenuSaleTrritory = () => {

    const {prospectReducer,prospectSelectInfoReducer} = useSelector((state) => state);
    const dispatch = useDispatch();

     useEffect(() => {
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(prospectId){
            dispatch(getSaleTerritory(prospectId))
        }
    }, [])

    useEffect(() => {  
        let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
        if(prospectReducer.addsaleTerritorySucsess){
            dispatch(getSaleTerritory(prospectId))
            dispatch(getTerritoryForDedicated(prospectId))
        }
        if(prospectReducer.delsaleTerritorySucsess){
            dispatch(getSaleTerritory(prospectId))
            dispatch(getTerritoryForDedicated(prospectId))
            setmodalVisibleDelete(true)
        }

    }, [prospectReducer.addsaleTerritorySucsess,prospectReducer.delsaleTerritorySucsess])

    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    }

    const data_territories = () =>{
        if(prospectReducer.saleTerritoryData){
            let myTerritory = prospectReducer.saleTerritoryData.records[0].myTerritory
            return myTerritory
        }
    }

    const data_Dedicated = () =>{
        if(prospectReducer.saleTerritoryData){
            let dedicatedTerritory = prospectReducer.saleTerritoryData.records[0].dedicatedTerritory
            return dedicatedTerritory
        }
    }

    const data_salesRep = () =>{
        if(prospectReducer.saleTerritoryData){
            let salesRep = prospectReducer.saleTerritoryData.records[0].salesRep
                return salesRep
            }
    }

    const [modalVisibleAlert, setmodalVisibleAlert] = useState(false);
    const [modalVisibleDelete, setmodalVisibleDelete] = useState(false);
    const [deleteItem, setDeleteItem] = useState('')

    const handleRemove = (remove) => {
         let prospectId = prospectSelectInfoReducer.dataSelect.prospect.prospectId
            dispatch(delProspectDedicated(prospectId,remove.item.prospDedicateId,remove.item.territoryId,remove.item.activeFlag))
            setmodalVisibleAlert(false)
    }

    const onPressAlertDelete = (event) => {
        setmodalVisibleAlert(event);
    }
    
    return (
        <View style={{flex:1, backgroundColor: colors.white}}>
        <ScrollView>
            <View style={{ flex: 1, marginLeft: '5%', marginTop: '5%'}}>
                <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
            </View>
        
                <View style = {{marginHorizontal:'5%'}}>

                    {/* Card 1 */}

                        <CardTerritory Rep = {false} Title={'Sales territories'} data={data_territories()}/>

                    {/* Card 2 */}

                        <CardTerritory  
                                        Rep = {false} 
                                        Title={'Dedicated sales territories'} 
                                        isAddButton={true} 
                                        data={data_Dedicated()} 
                                        remove={(item) => {
                                            setmodalVisibleAlert(true)
                                            setDeleteItem(item)
                                            }}
                        />
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

                    {/* Card 3 */}

                        <CardTerritory Title={'Sales Rep'}  data={data_salesRep()}/>

                </View>  
            </ScrollView>
        </View>
                     
        )
}

export default SubmenuSaleTrritory;
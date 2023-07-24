import React,{useEffect,useState,useRef,useCallback} from 'react'
import { View, FlatList, StyleSheet, ScrollView,Dimensions } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import { Cardcollapsible, SearchInput, Text, Header, ModalWarning } from '../../components'
import { FONT_SIZE } from '../../utility/enum'
import colors from '../../utility/colors'
import {useDispatch, useSelector} from 'react-redux';
import { searchMyAccount,searchTerritory,setTerritoryPage } from '../../actions/customerAction';
import { getInputData } from '../../utility/helper';
import { getConfigLov } from '../../actions/getConfigLovAccountAction';

const {width,height} = Dimensions.get('window')
const Customer = () => {
    const [search,setSearch] = useState('');
    const inputRef = useRef({});
    const {customerReducer} = useSelector((state) => state);
    const [customerPage,setCustomerPage] = useState(1);
    const [territoryPage,setTerritoryPage] = useState(1);
    const [modalError, setModalError] = useState(false);
    const [msgError,setMsgError] = useState('');

    const dispatch = useDispatch();
    const [inViewPort, setInViewPort] = useState(0)
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
        waitForInteraction: true,
        minimumViewTime: 5,
    })

    useFocusEffect(
        React.useCallback(() => {
            dispatch(searchMyAccount(search,customerReducer.customerPage,customerReducer.customerLegth));
            dispatch(searchTerritory(search,customerReducer.territoryPage,customerReducer.territoryLegth));
            dispatch(getConfigLov("PROSPECT_STATUS")) 
            // Do something when the screen is focused
            return () => {
                inputRef.current.search.clear()
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {
        if((customerReducer.dataCustomerErrorMSG != '') && !customerReducer.isLoadingErrorMSG) {
            setModalError(true);
            setMsgError(`${customerReducer.dataCustomerErrorMSG}`);
        }
        else if((customerReducer.dataTerritoryErrorMSG != '') && !customerReducer.isLoadingTerritoryErrorMSG) {
            setModalError(true);
            setMsgError(`${customerReducer.dataTerritoryErrorMSG}`);
        }
    }, [customerReducer.dataCustomerErrorMSG, customerReducer.dataTerritoryErrorMSG])

    const onSearch = () =>{
         let totalValue = getInputData(inputRef);
         if (!totalValue.isInvalid){
            setSearch(totalValue.data.search.name);
            dispatch(searchMyAccount(totalValue.data.search.name,customerReducer.customerPage,customerReducer.customerLegth));
            dispatch(searchTerritory(totalValue.data.search.name,customerReducer.territoryPage,customerReducer.territoryLegth));
         }
    }

    /// customer
    const onViewableItemsChanged = ({
        viewableItems,
      }) => {
          if(viewableItems[0] != undefined){
            setCustomerPage(viewableItems[0].index+1)
          }
      };

      const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig: {
            minimumViewTime: 0,
            itemVisiblePercentThreshold: 1
          },onViewableItemsChanged: onViewableItemsChanged },
      ]);
      ////
      //// territory
      const onViewableItemsTerChanged = ({
        viewableItems,
      }) => {
        if(viewableItems[0] != undefined){
            setTerritoryPage(viewableItems[0].index+1)
          }
      };

      const viewabilityConfigCallbackTerPairs = useRef([
        { viewabilityConfig: {
            minimumViewTime: 0,
            itemVisiblePercentThreshold: 1
          },onViewableItemsChanged: onViewableItemsTerChanged },
      ]);
    return(
        <View style={styles.container}>
            <Header />
            <ScrollView >
                <View style={{ flex:1, marginTop:30, alignSelf: 'center', marginHorizontal: '3%'}}>
                    <SearchInput 
                        ref={el => inputRef.current.search = el}
                        SearchBarType ={'SearchBarButton'}
                        // widthSearchBox={'30%'} 
                        // SearchBarWidth={'63%'}
                        // buttonWidth={'70%'}
                        onPressSearch={()=>onSearch()}
                    />
                </View>
                <View style={{ flex: 1}}>
                    <View style={{flex:1, justifyContent:'center', marginHorizontal:'3%',paddingBottom:'2%',paddingTop:'4%'}}>
                        <View>
                            <Text style={{fontSize: FONT_SIZE.HEADER}}>Customer</Text>
                        </View>       
                    </View>
                    <View style={{marginHorizontal:'3%', marginBottom:'2%'}}>
                        <Text style={{fontSize:FONT_SIZE.TITLE}}>My Customer</Text>
                    </View>
                    <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginHorizontal:'3%',marginBottom:'3%'}}>
                        <View>
                            <Text>แสดง {customerReducer.dataCustomer ? customerReducer.dataCustomer.totalRecords : 0} รายการ</Text>
                        </View>
                        <View>
                            <Text>หน้า {customerPage} ของ {customerReducer.dataCustomer ? Math.ceil(customerReducer.dataCustomer.totalRecords / 8) : 0}</Text>
                        </View>
                    </View>
                    {
                        customerReducer.dataCustomer && customerReducer.dataCustomer.records.length != 0 ?
                            <FlatList
                                viewabilityConfigCallbackPairs={
                                viewabilityConfigCallbackPairs.current
                                }
                                horizontal
                                pagingEnabled
                                numColumns={1}
                                data={customerReducer.dataCustomer ? customerReducer.dataCustomer.item : []}
                                renderItem={({item})=> <View style={{width:width}} >
                                    <FlatList
                                            data={ item.items}
                                            renderItem={(data)=> 
                                                <Cardcollapsible
                                                    customID={data?.item?.prospectAccount?.custCode || ''} 
                                                    status={data.item.prospect.prospectStatus}
                                                    companyName={data.item.prospectAccount.accName}
                                                    phone={data.item.prospectAddress.tellNo}
                                                    fax={data.item.prospectAddress.faxNo}
                                                    lat={data.item.prospectAddress.latitude}
                                                    long={data.item.prospectAddress.longitude}
                                                    Infomation={data.item}
                                                    Nav = {['snbmenuProspect','FE_ACC_CUST_S011']}
                                                    isCustomer = {true}
                                                    isStatusCus = {true}
                                                /> 
                                            }
                                            numColumns={2}
                                            keyExtractor={(item, index) => index}
                                        />
                                </View>}
                            />
                        :
                        <View style={{alignSelf:'center', marginVertical:20}}>
                            <Text style={{fontSize: FONT_SIZE.LITTLETEXT, fontWeight:'bold'}}>ไม่พบข้อมูล</Text>
                        </View>
                    }                     
                </View>

                <View style={{flex:1,backgroundColor:colors.greenBGTerritory, justifyContent:'flex-end'}}>
                    <View style={{marginHorizontal:'3%', paddingTop:'8%'}}>
                        <View style={{marginBottom:'2%'}}>
                            <Text style={{fontSize:FONT_SIZE.TITLE}}>In Territory</Text>
                        </View>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between',marginBottom:'3%'}}>
                        <View>
                            <Text>แสดง {customerReducer.dataTerritory ? customerReducer.dataTerritory.totalRecords : 0} รายการ</Text>
                        </View>
                        <View>
                            <Text>หน้า {territoryPage} ของ {customerReducer.dataTerritory ? Math.ceil(customerReducer.dataTerritory.totalRecords / 8) : 0}</Text>
                        </View>
                        </View>
                    </View>
                    <View style={{paddingBottom:'3%'}}>
                        {
                            customerReducer.dataTerritory && customerReducer.dataTerritory.records.length != 0 ?
                                <FlatList
                                    viewabilityConfigCallbackPairs={
                                    viewabilityConfigCallbackTerPairs.current
                                    }
                                    horizontal
                                    pagingEnabled
                                    numColumns={1}
                                    data={customerReducer.dataTerritory ? customerReducer.dataTerritory.item : []}
                                    renderItem={({item})=> <View style={{width:width}} >
                                        <FlatList
                                                data={ item.items}
                                                renderItem={(data)=> 
                                                    <Cardcollapsible
                                                        customID={data?.item?.prospectAccount?.custCode || ''} 
                                                        status={data.item.prospect.prospectStatus}
                                                        companyName={data.item.prospectAccount.accName}
                                                        phone={data.item.prospectAddress.tellNo}
                                                        fax={data.item.prospectAddress.faxNo}
                                                        lat={data.item.prospectAddress.latitude}
                                                        long={data.item.prospectAddress.longitude}
                                                        Infomation={data.item}
                                                        Nav = {['snbmenuProspect','FE_ACC_CUST_S011']}
                                                        isCustomer = {true}
                                                        isStatusCus = {true}
                                                    /> 
                                                }
                                                numColumns={2}
                                                keyExtractor={(item, index) => index}
                                            />
                                    </View>}
                                />
                            :
                            <View style={{alignSelf:'center', marginVertical:20}}>
                                <Text style={{fontSize: FONT_SIZE.LITTLETEXT, fontWeight:'bold'}}>ไม่พบข้อมูล</Text>
                            </View>
                        }
                   
                    </View>
                </View>
                <ModalWarning
                    WARNINGTITLE
                    onlyCloseButton
                    visible={modalError}
                    detailText={msgError}
                    onPressClose={()=> setModalError(false)}
                />
            </ScrollView>
        </View>
       
    )
}

export default Customer;

const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: colors.white
    },
  });
import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { CardItem, Body, Icon, Left, Right } from 'native-base'
import {useDispatch, useSelector} from 'react-redux';

import { getProspectSelectData,getCustomerSelectDate,getRentStationSelectDate,getOtherSelectDate,getProspectRecommandSelectData } from '../../actions/prospectSelectInfoAction';
import { resetAction } from '../../actions/prospectAction';

import Text from '../Text'
import colors from '../../utility/colors'

const Cardcollapsible = ({ customID, 
                            prospectId,
                            isStatus = false, 
                            status, 
                            Nav, 
                            companyName, 
                            phone, 
                            fax, 
                            lat,
                            buId,
                            buName,
                            long,
                            flow = false,
                            Infomation,
                            children,
                            isCustomer,
                            isRentStation,
                            isOther,
                            isProspect,
                            isRecommandBUProspect,
                            heigthFlow,
                            isStatusCus = false,
                            isProspectMyProspect = false
                        }) =>{

  const {getUserProfileReducer} = useSelector((state) => state);
  const navigation = useNavigation();
  const [isShowDeteil,setIsShowDeteil] = useState(false);
  const {getConfigLovAccountReducer} = useSelector((state) => state);
  const dispatch = useDispatch();

  let listPermission = getUserProfileReducer.dataUserProfile.listPermObjCode;

  const findStatue = (Status) => {
    if(getConfigLovAccountReducer.lovKeyword != ''){ 
      let findStatus = getConfigLovAccountReducer.lovKeyword.find((item) => {
      return item.lovKeyvalue == Status
  })
    if (!findStatus) return
      return findStatus.lovNameTh
    }else{
      return
    }
  }

  const backgroundStatus= (Status) =>  {
    if(getConfigLovAccountReducer.lovKeyword != ''){ 
        let findStatusColor = getConfigLovAccountReducer.lovKeyword.find((item) => {
        return item.lovKeyvalue == Status
    })
        if (!findStatusColor) return
        let color = findStatusColor.condition1.split('|')
        return color[0]
    }else{
      return
    }
  }

  const TextStatusColor = (Status) =>  {
    if(getConfigLovAccountReducer.lovKeyword != ''){ 
        let findStatusColor = getConfigLovAccountReducer.lovKeyword.find((item) => {
        return item.lovKeyvalue == Status
    })
        if (!findStatusColor) return
        let color = findStatusColor.condition1.split('|')
        return color[1]
    }
  }

  const onClickButton = () => {
    if(isShowDeteil == false){
      setIsShowDeteil(true);
    }else{
      setIsShowDeteil(false);
    }
  }

  const onPressCard = (nameScreen, permObjCode) => {
     let premissionScreen = listPermission.find((itemScreen) => {
      return itemScreen.permObjCode == permObjCode
    });

    if (premissionScreen) {
      if(isCustomer){
        dispatch(getCustomerSelectDate({...Infomation,...{isCustomer:isCustomer}}))
      }
      else if(isProspect) {
        dispatch(getProspectSelectData({...Infomation,...{isProspect:isProspect, isProspectMyProspect:isProspectMyProspect}}))
      }
      else if(isRentStation) {
        dispatch(getRentStationSelectDate({...Infomation,...{isRentStation:isRentStation}}))
      }
      else if(isOther) {
        dispatch(getOtherSelectDate({...Infomation,...{isOther:isOther}}))
      }else if(isRecommandBUProspect){
        dispatch(getProspectRecommandSelectData({...Infomation,...{isRecommandBUProspect:isRecommandBUProspect}}))
      }
      dispatch(resetAction())     
      navigation.navigate(nameScreen)   
    }

    if (!premissionScreen) {
      navigation.navigate('DontHavePermission')   
    }
    
  }

  const onPressPhone = (phoneNumber) =>{
    let phone = '';
    if (Platform.OS === 'android') { phone = `tel:${phoneNumber}`; }
    else {phone = `telprompt:${phoneNumber}`; }
    Linking.openURL(phone);
  }

  const onPressGoogleMap = (lat,long) =>{
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=` +
      lat +
      `,` +
      long 
  );
}

    return (
        <View style={styles.container}>
          <View style={{marginHorizontal: '3%', marginVertical: '15%'}}>
            <CardItem style={[styles.headerArea,styles.styleShadow]}>
              <View style={{flex: 1 , justifyContent:'space-between', flexWrap: 'wrap' }}>
                <View style={{flex: 1,flexDirection:'row', width: '100%',}}>
                  { 
                    flow  ?
                      null
                    :
                    <>
                      <View style={{alignSelf:'center'}}>
                        <Icon name="person-outline" style={{ color: colors.grayDark, fontSize: 20 }} />
                      </View>
                      <View style={{alignSelf:'center',paddingLeft:3}}>
                        {customID ? 
                          <Text style={{fontSize:22}}>{customID}</Text>
                        :
                        prospectId ? 
                          <Text style={{fontSize:22}}>{prospectId}</Text>
                        :
                          <Text style={{fontSize:22}}>  </Text>
                        }
                      </View>
                    </>
                  }
                </View>
                {isStatus ?
                    isRentStation ?
                      <View style={{flex: 1,flexDirection:'row', width: '100%'}}>
                          <View style={{backgroundColor: "#DDF7FF",height:35,width: flow ? 100 :'95%',justifyContent:'center',borderRadius:40}}>
                              <Text style={{ color: "#00BAF3",alignSelf:'center',fontSize:18}}>ปั๊มเช่า</Text>        
                          </View>
                      </View>
                    :
                    <View>
                      <View style={{borderRadius:40,backgroundColor: backgroundStatus(status),height:35,width: flow? 100 :'95%',justifyContent:'center'}}>
                          <Text style={{color:TextStatusColor(status),alignSelf:'center',fontSize:18}}>{findStatue(status)}</Text>        
                      </View>
                    </View>
                    :
                    null
                }
                {
                  isStatusCus && isCustomer && status == "6" ?
                  <View>
                      <View style={{backgroundColor: "#DDF7FF",height:35,width: flow? 100 :'95%',justifyContent:'center',borderRadius:40}}>
                          <Text style={{ color: "#00BAF3",alignSelf:'center',fontSize:18}}>ปั๊มเช่า</Text>        
                      </View>
                  </View>
                  :
                  null
                }
              </View> 
            </CardItem>
            {flow ?
              <CardItem style={[styles.styleShadow,styles.CompanyArea, {height: heigthFlow}]}>
                <Body style={{flex: 1}}>
                    {children}
                </Body> 
              </CardItem>
            :
            <CardItem button onPress={()=>onPressCard(Nav[0],Nav[1])} style={[styles.styleShadow,styles.CompanyArea]}>
              <Body style={{flex: 1}}>
                  <View style={{paddingTop:5}}>
                    <Text numberOfLines={2} style={{fontSize:22}}>{companyName}</Text>
                  </View>
              </Body> 
            </CardItem>
            }
           
            <CardItem style={[styles.CompanyInfoArea,styles.styleShadow]}>
              {isShowDeteil ?
              <Body style={{borderTopWidth:0.5,borderColor:colors.grayborder}}>
              { isOther == true ?
                  <View  style={{justifyContent:'space-between',flexDirection:'row',paddingHorizontal:5, marginTop:20}}>
                      <View>
                        <View style={{borderWidth:1, width:30,height:30,borderRadius:30,borderColor: colors.grayDark}}>
                          <Text style={{alignSelf:'center',fontSize:21,fontWeight:'bold',color:colors.grayDark}}>BU</Text>
                        </View>
                      </View>
                      <View style={{paddingLeft:'5%',alignSelf:'center'}}>
                        {
                          buId && buName?
                          <Text  style={{fontSize:20}}>{`${buId} : ${buName}`}</Text>

                          :
                          <Text  style={{fontSize:20}}> - </Text>
                        }
                      </View>
                  </View>
                        :
                        null
                }
                <TouchableOpacity style={{justifyContent:'space-between',flexDirection:'row',padding:'5%', marginTop:'3%' }}
                 onPress={() => phone ? onPressPhone(phone) : null}
                 >
                  <View >
                    <Icon type="SimpleLineIcons" name="phone" style={{alignItems:'center',color:colors.grayDark, fontSize:20}}/>
                  </View>
                  <View style={{paddingLeft:'5%',alignSelf:'center'}}>
                    {phone ?
                        <Text  style={{fontSize:20}}>{phone}</Text>
                    :
                        <Text  style={{fontSize:20}}> - </Text>
                    }
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent:'space-between',flexDirection:'row',padding:'5%'}}
                  onPress={() => fax ?  onPressPhone(fax) : null}
                >
                  <View >
                    <Icon type="SimpleLineIcons" name="printer" style={{alignItems:'center',color:colors.grayDark, fontSize:20}}/>
                  </View>
                  <View style={{paddingLeft:'5%',alignSelf:'center'}}>
                  {fax ?
                        <Text style={{fontSize:20}}>{fax}</Text>
                    :
                        <Text style={{fontSize:20}}> - </Text>
                    }
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent:'space-between',flexDirection:'row',padding:'5%'}}
                   onPress={() => lat && long ?  onPressGoogleMap(lat,long) : null}
                >
                  <View >
                    <Icon type="SimpleLineIcons" name="location-pin" style={{alignItems:'center',color:colors.grayDark, fontSize:20}}/>
                  </View>
                  <View style={{paddingLeft:'5%',alignSelf:'center', paddingBottom:'5%'}}>
                  {lat && long  ?
                        <Text  style={{fontSize:20}}>{`${lat} , ${long}`}</Text>
                    :
                        <Text  style={{fontSize:20}}> - </Text>
                    }
                  </View>
                </TouchableOpacity>
                </Body>
              :
              null
              }
              {
                flow ?
                null
                :
                <TouchableOpacity style={[styles.buttonShowDeteil,styles.styleShadow]} onPress={onClickButton}>
                  <Icon name="chevron-down-circle-outline" style={{ color: colors.primary, fontSize:35}}/>
                </TouchableOpacity> 
              }
            </CardItem>
          </View>
        </View>
            )
}

export default Cardcollapsible;

const styles = StyleSheet.create({
  container:{
    flex: 1 / 2
  },
  headerArea:{
    backgroundColor: colors.grayTable,
    borderTopLeftRadius:15, 
    borderTopRightRadius:15,
    height: 90
  },
  CompanyArea: {
    height: 80
  },
  CompanyInfoArea: {
    borderBottomLeftRadius:15, 
    borderBottomRightRadius:15
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
  buttonShowDeteil:{
    flex:1, 
    position: 'absolute', 
    top: '103%',
    left:'50%', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'white',
    borderRadius:40,
    height:40,
    width:40
  },
    
});
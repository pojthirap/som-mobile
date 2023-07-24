import React, { useEffect, useState } from 'react';
import {View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Image} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux'; 
import { Icon } from 'native-base'

import colors from '../utility/colors';
import { Text } from '../components';
import { FONT_SIZE, STYLE_SIZE } from '../utility/enum';
import language from '../language/th.json';

const { height } = Dimensions.get('window')

const DrawerView = (props) => {
    const {authReducer, getUserProfileReducer} = useSelector((state) => state);
    const navigation = props.navigation;
    const [isWidthDrawer, setIsWidthDrawer] = useState(false)
    const [subMenu, setSubMenu] = useState(false);
    const [listPermission, setListPermission] = useState(authReducer.userProfile.listPermObjCode)
    let sizeIcons = STYLE_SIZE.ICON_SIZE_SMALL

    useEffect(() => {
        setIsWidthDrawer(false)
    }, [props])

    useEffect(() => {
        if(getUserProfileReducer.dataUserProfile.listPermObjCode) {
            setListPermission(getUserProfileReducer.dataUserProfile.listPermObjCode);
        }
    }, [getUserProfileReducer.dataUserProfile])

    const onPressDrawer = () => {
        if (isWidthDrawer === true ){
            setIsWidthDrawer(false)
        }
        navigation.closeDrawer()
    }

    const handleWidthDrawer = (event) => {
        setIsWidthDrawer(true);
        setSubMenu(event);
    }

    const handleNavDrawer = (screen,permObjCode) => {  
        setIsWidthDrawer(false);
        if (screen == 'SaleVisitPlanScreen') {
            let premissionScreen = listPermission.find((itemScreen) => {
                return itemScreen.permObjCode == permObjCode
            });
    
            if (premissionScreen) return navigation.navigate(screen, {formSelectMenu : true});
            if (!premissionScreen) return navigation.navigate('DontHavePermission');
        } else {
            if(screen == 'HomeScreen') {
                navigation.navigate(screen);
            } else {
                let premissionScreen = listPermission.find((itemScreen) => {
                    return itemScreen.permObjCode == permObjCode
                });
        
                if (premissionScreen) return navigation.navigate(screen);
                if (!premissionScreen) return navigation.navigate('DontHavePermission');
            }
        }
    }

    const handleNavDrawerAccount = (screen,permObjCode) => {  
        let premissionScreen = listPermission.find((itemScreen) => {
            return itemScreen.permObjCode == permObjCode
        });

        if (premissionScreen) return navigation.navigate(screen);
        if (!premissionScreen) return navigation.navigate('DontHavePermission');
    }

    const handleResetNav = (screen) => {
        onPressDrawer()
        navigation.reset({
            index: 0,
            routes: [{ name: screen }],
        })
    }

    const handlePermission = (nameScreen) => {
        let permissionScreen = listPermission.find((itemScreen) => {
            if (itemScreen.permObjCode == nameScreen) return true
            
            return false
        })
        return permissionScreen
    };

    const renderAccount = () => {
        return (
            <View style={{ margin: '7%'}}>
                <View style={{ paddingTop:'5%'}}>
                    <Text style={{ fontSize:FONT_SIZE.LITTLETEXT, fontWeight:'bold'}}>
                        Account
                    </Text>
                </View>
                <View style={{ marginTop: 30 }}>
                    {
                        handlePermission('FE_ACC_PROSP') ?
                        <TouchableOpacity style={styles.subMenuView} onPress={() => handleNavDrawerAccount('ProspectScreen','FE_ACC_PROSP_S01')}>
                            <Text>
                                Prospect
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {
                        handlePermission('FE_ACC_CUST') ?
                        <TouchableOpacity style={styles.subMenuView} onPress={() => handleNavDrawerAccount('CustomerScreen','FE_ACC_CUST_S01')}>
                            <Text>
                                Customer
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {
                        handlePermission('FE_ACC_PUMP') ?
                        <TouchableOpacity style={styles.subMenuView} onPress={() => handleNavDrawerAccount('GasStationRentalScreen','FE_ACC_PUMP_S01')}>
                            <Text>
                                ปั๊มเช่า
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {
                        handlePermission('FE_ACC_OTHER') ?
                        <TouchableOpacity style={styles.subMenuView} onPress={() => handleNavDrawerAccount('OtherProspectScreen','FE_ACC_OTHER_S01')}>
                            <Text>
                                Other Prospect
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
            </View>
        )
    }

    const renderMasterData = () => {
        return (
            <View style={{ margin: '7%' }}>
                <View style={{ paddingTop:'5%'}}>
                    <Text style={{ fontSize:FONT_SIZE.LITTLETEXT, fontWeight:'bold'}}>
                        Master Data
                    </Text>
                </View>
                <View style={{ marginTop: 30 }}>
                    {
                        handlePermission('FE_MAS_LOC') ?
                        <TouchableOpacity style={styles.subMenuView} onPress={() => handleResetNav('LocationMasterScreen','FE_MAS_LOC_S01')}>
                            <Text>
                                {language.LOCATIONMENU}
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {
                        handlePermission('FE_MAS_QR') ?
                        <TouchableOpacity style={styles.subMenuView} onPress={() => handleResetNav('QRMasterScreen','FE_MAS_QR_S01')}>
                            <Text>
                                QR Master
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }                  
                </View>
            </View>
        )
    }

    return (
        <DrawerContentScrollView {...props}   drawerStyle={{
          }}>
              <View style={{ flexDirection: 'row', flex: 1, height: height }}>
                <View style={{backgroundColor: colors.white, flex: 0.7, borderRightWidth: 0.5, borderRightColor: colors.gray}}>
                    <View style={[styles.menuContranner, { marginTop: '10%' }]}>
                        <Image source={require('../assets/images/logo-ptt.png')} style={{width:50,height:50}}/>
                    </View>
                    <TouchableOpacity onPress={() => onPressDrawer()} style={[styles.menuContranner, { marginTop: '3%' }]}>
                        <Icon type="FontAwesome" name="bars" style={{ color: colors.grayButton, fontSize: sizeIcons }}/>
                    </TouchableOpacity>
                   
                    <TouchableOpacity onPress={() => handleNavDrawer('HomeScreen')} style={[styles.menuContranner, { marginTop: '3%'}]}>
                        <Icon type="Ionicons" name="home-outline" style={{ color: colors.grayButton, fontSize: sizeIcons }}/>
                        <Text>
                            Home
                        </Text>
                    </TouchableOpacity>
                
                    {
                        handlePermission('FE_ACC') ?
                        <TouchableOpacity onPress={() => handleWidthDrawer('ACCOUNT')} style={styles.menuContranner}>
                            <Icon  name="person-outline" style={{ color: colors.grayButton, fontSize: sizeIcons }}/>
                            <Text>
                                Account
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }

                    {
                        handlePermission('FE_PLAN_TRIP') ?
                        <TouchableOpacity onPress={() => handleNavDrawer('SaleVisitPlanScreen','FE_PLAN_TRIP_S01')} style={styles.menuContranner}>
                            <Icon type="MaterialCommunityIcons" name="calendar-blank-outline" style={{ color: colors.grayButton, fontSize: sizeIcons }}/>
                            <Text>
                                Sales visit plan 
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }

                    {
                        handlePermission('FE_VISIT') ?
                        <TouchableOpacity onPress={() => handleNavDrawer('SaleVisitScreen','FE_VISIT_S01')} style={styles.menuContranner}>
                            <Icon type="SimpleLineIcons" name="location-pin" style={{ color: colors.grayButton, fontSize: sizeIcons }}/>
                            <Text>
                                Sales visit
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }

                    {
                        handlePermission('FE_SALEORD') ?
                        <TouchableOpacity onPress={() => handleNavDrawer('SaleOrder','FE_SALEORD_S01')} style={styles.menuContranner}>
                            <Icon type="MaterialCommunityIcons" name="cart-outline" style={{ color: colors.grayButton, fontSize: sizeIcons }}/>
                            <Text>
                                Sales order
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }

                    {
                        handlePermission('FE_MAS') ?
                        <TouchableOpacity onPress={() => handleWidthDrawer('MASTERDATA')} style={styles.menuContranner}>
                            <Icon type="MaterialCommunityIcons" name="resistor" style={{ color: colors.grayButton, fontSize: sizeIcons }}/>
                            <Text>
                                Master Data
                            </Text>
                        </TouchableOpacity>
                        :
                        null
                    }

                </View>

                {
                    (isWidthDrawer) ?
                        <View style={{ backgroundColor: 'white', heigth: '100%', flex: 2}}>
                        {
                            subMenu == 'ACCOUNT' && renderAccount()
                        }
                        {
                            subMenu == 'MASTERDATA' && renderMasterData()
                        }
                        </View>
                    :
                        <TouchableWithoutFeedback onPress={() => onPressDrawer()} style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', heigth: '100%', flex: 2}}>
                            <View style={{flex: 2}}></View>
                        </TouchableWithoutFeedback>
                }
              </View>

        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    menuContranner: {
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 10,
    },
    subMenuView: {
        paddingVertical: 10,
    }
})
export default DrawerView

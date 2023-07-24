import React, {useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux';
import Text from './Text';
import colors from '../utility/colors';
import { FONT_SIZE } from '../utility/enum';


const subMenu = ({titleSubMenu, ScreenName, iconPhoto, isFocus = true, heightBox='50%', widthBox='100%', heightPhoto= 40, widthPhotot=40, marginPhoto=10, sizeFont=FONT_SIZE.LITTLETEXT}, prosp) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();


    return (
        <TouchableOpacity  onPress={()=> navigation.navigate('AccountTab', {'screen' : ScreenName})}>
            <View  style={[styles.container, {height : heightBox, width: widthBox}]}>
                <View  style={{ flex: 1,justifyContent:'center',alignItems:'center'}}>
                    <View  style={{justifyContent: 'center', alignItems:'center', marginHorizontal: '1%'}}>
                        <Image key={Math.random()}  source={iconPhoto} style={[{tintColor: isFocus ? false : colors.gray}, {width: widthPhotot, height: heightPhoto, marginBottom: marginPhoto }]}/>
                    </View>
                    <View style={{alignSelf: 'center', justifyContent:'center'}}>
                        <Text style={{fontSize: sizeFont}}>{titleSubMenu}</Text>
                    </View>  
                </View>              
            </View>     
        </TouchableOpacity>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1/5,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        paddingVertical: 5,
        // paddingHorizontal: 5,
        // marginHorizontal: 5,
        marginVertical: 10,
    },
})

export default subMenu;
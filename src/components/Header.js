import React, { useState } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
// import {useTranslation} from 'react-i18next';
import { Icon } from 'native-base'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import ModalWarning from '../components/ModalWarning';
import language from '../language/th.json'
import { resetAuth } from '../actions/authAction';

import Text from './Text'
import colors from '../utility/colors';

const Header = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch();
    // const {t} = useTranslation();
    const {authReducer} = useSelector((state) => state);
    const [modalConfirm, setModalConfirm] = useState(false);

    const onPressMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    }

    const modalConfirmLogout = (event) => {
        setModalConfirm(event)
    }

    const onPressLogout = () => {
        EncryptedStorage.removeItem('token');
        dispatch(resetAuth())
    }

    return (
        <View style={styles.contraner}>
            <TouchableOpacity onPress={onPressMenu} style={{ marginLeft: 20 }}>
                <Icon type="FontAwesome" name="bars" style={{ color: colors.grayButton, fontSize: 30 }}/>
            </TouchableOpacity>
            {/* <Text>
                {t('home')}
            </Text> */}
            <View style={{ flexDirection: 'row' }}>
            <View style={styles.profileContainer}>
                <Icon name="person-outline" style={{ color: colors.grayButton, fontSize: 30 }}/>
                <Text style={{ paddingHorizontal: 10}}>
                    {authReducer.userProfile.firstName}
                </Text>
            </View>
            <TouchableOpacity onPress={() => modalConfirmLogout(true)} style={styles.profileContainer}>
                <Icon type="MaterialCommunityIcons" name="exit-to-app" style={{ color: colors.grayButton, fontSize: 30 }}/> 
                <Text style={{ paddingHorizontal: 10}}>
                    Logout
                </Text>
            </TouchableOpacity>
            <View style={{flex: 0}}>
                <ModalWarning
                    visible = {modalConfirm}
                    onPressConfirm = {() => onPressLogout()}
                    onPressCancel = {() => setModalConfirm(false)}
                    detailText={language.LOGOUT}
                />
            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    contraner: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent:'space-between',
    },
    profileContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 20 
    }
})

export default Header;

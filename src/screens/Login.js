import React, { useRef, useEffect, useState } from 'react';
import { View, Image, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Text, TextInput, Button } from '../components';
import colors from '../utility/colors';
import { FONT_SIZE } from '../utility/enum';
import { getInputData } from '../utility/helper';
import { LoginAction } from '../actions/authAction';
import { getUserProfile } from '../actions/getUserProfileAction';
import language from '../language/th.json'

const Login = () => {
    const { authReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const inputRef = useRef({});

    const [visiblePass, setVisiblePass] = useState(true)

    useEffect(() => {
        if (authReducer.loginError) {
            Alert.alert('', authReducer.loginErrorMSG)
        }

        if (!authReducer.loginError && authReducer.loginSuccess) {
            setVisiblePass(true)
            inputRef.current.username.clear()
            inputRef.current.password.clear()
            dispatch(getUserProfile())

        }
    }, [authReducer])

    const handleLogin = () => {
        let totalValue = getInputData(inputRef);

        if (!totalValue.isInvalid) {
            dispatch(LoginAction(totalValue.data));
        }
    }

    const onPressVisiblePass = () => {
        if (visiblePass == true) {
            setVisiblePass(false)
        } else {
            setVisiblePass(true)
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={{ flex: 1 }}>
                <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', height: '20%' }}>
                    <Image source={require('../assets/images/headimg.png')} resizeMode="contain" style={{ width: '100%', }} />
                </View>
                <View style={{ position: 'absolute', alignSelf: 'center', marginVertical: '20%' }}>
                    <Image source={require('../assets/images/logo-ptt.png')} resizeMode="contain" style={{}} />
                </View>
            </View>
            <View style={{ flex: 2, justifyContent: 'space-between', marginBottom: '10%' }}>
                <View>
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ color: colors.primary, fontSize: 72, fontWeight: 'bold' }}>เข้าสู่ระบบ</Text>
                    </View>
                    <View style={{ marginHorizontal: '10%', alignItems: 'center', marginBottom: 20 }}>
                        <TextInput
                            ref={el => inputRef.current.username = el}
                            require
                            fontSize={FONT_SIZE.TEXT}
                            textSize={FONT_SIZE.TEXT}
                            title={'ชื่อผู้ใช้งาน'}
                            massageError={language.USERNAME} />
                    </View>
                    <View
                        style={{ marginHorizontal: '10%', alignItems: 'center', marginBottom: '10%', flexDirection: 'row' }}>
                        <TextInput
                            ref={el => inputRef.current.password = el}
                            require
                            fontSize={FONT_SIZE.TEXT}
                            textSize={FONT_SIZE.TEXT}
                            title={'รหัสผ่าน'}
                            secureTextEntry={visiblePass}
                            onPressVisiblePass={() => onPressVisiblePass()}
                            massageError={language.PASSWORD} />
                    </View>
                    <View style={{ marginHorizontal: '20%', alignItems: 'center' }}>
                        <Button
                            title={'เข้าสู่ระบบ'} textSize={FONT_SIZE.TEXT} onPress={() => handleLogin()} />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.black, fontSize: FONT_SIZE.SUBTITLE }}>Copyright 2020 © Powered by PT</Text>
                    <Text style={{ color: colors.black, fontSize: FONT_SIZE.SUBTITLE }}>Version 1.0.6</Text>
                </View>
            </View>
        </View>
    )
}

export default Login;
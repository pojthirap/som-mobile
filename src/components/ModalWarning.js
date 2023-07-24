import React from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Icon } from 'native-base';

import colors from '../utility/colors';
import Text from './Text';
import Button from './Button';

import { FONT_SIZE, STYLE_SIZE } from '../utility/enum';

const modalWarning = ({visible, 
                    onPressCancel, 
                    onPressConfirm,
                    onPressClose,
                    onlyCloseButton= false, 
                    WARNINGTITLE = false ,
                    buttonWidth = STYLE_SIZE.BNT_WIDTH,
                    detailText,
                    cancelButtonColor = colors.white,
                    cancelTextColor = colors.primary,
                    confirmTextColor,
                    confirmButtonColor,
                    buttonClose = 'Close',
                    ButtonCancel = 'Cancel',
                    ButtonConfirm = 'Confirm',
                    backgroundColor = colors.primary,
                    detailOject 
                }) =>{

    return(
        <View style={{flex: 1}}>
            <Modal
                animationType = 'slide'
                transparent = {true}
                visible = {visible}>
                <View style={styles.modaltBox}>
                    <View style={styles.container}>
                        {WARNINGTITLE ?
                            <View style={[styles.alertTitle,{backgroundColor:backgroundColor}]}>
                                <Icon type="FontAwesome" name="exclamation-triangle"  style={{color:colors.white, fontSize:FONT_SIZE.TEXT}}/>
                                <Text style={styles.modalTitle}>เกิดความผิดพลาด</Text>
                            </View>
                            :
                            <View style={[styles.alertTitle,{backgroundColor:backgroundColor}]}>
                                <Text style={styles.modalTitle}>แจ้งเตือน</Text>
                            </View>
                        }
                        <ScrollView>
                            <View style={{paddingHorizontal: '8%', marginVertical: '2%'}}>
                                {detailOject ? 
                                    detailOject
                                :
                                    <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>{detailText}</Text>
                                }
                            </View>
                        </ScrollView>
                        {onlyCloseButton ?
                            <View style={styles.bottom}>
                                <Button
                                    onPress={onPressClose}
                                    width={buttonWidth}
                                    title={buttonClose}
                                    buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                />
                            </View>
                            :
                            <View style={styles.bottom}>
                                <View style={{marginEnd: '2%'}}>
                                    <Button
                                        onPress={onPressCancel}
                                        title={ButtonCancel}  
                                        fontColor={cancelTextColor}
                                        color={cancelButtonColor}
                                        buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                        width={STYLE_SIZE.BNT_WIDTH}
                                    />
                                </View>
                                <View>
                                    <Button
                                        onPress={onPressConfirm}
                                        title={ButtonConfirm}
                                        color={confirmButtonColor}
                                        fontColor={confirmTextColor}
                                        buttonHeigth={STYLE_SIZE.BNT_HEIGTH}
                                        width={STYLE_SIZE.BNT_WIDTH}
                                    />
                                </View>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderRadius: 10,
        width: '80%',
        height: '30%',
        maxHeight: '90%',
    },
    modaltBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.6)',
        paddingHorizontal: '5%',
        paddingVertical: '5%'
    },
    alertTitle: {
        height: 70,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: '3%',
        paddingVertical: '5%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle:{
        color: colors.white,
        marginHorizontal: '2%',
        alignSelf:'center',
        fontSize: FONT_SIZE.TEXT,
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: '2%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    }
});

export default modalWarning;
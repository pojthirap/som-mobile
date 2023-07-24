import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, Modal as DefaultModal, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import { Text } from '../../components'
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const FuccTable = (props) => {
    const [fullScreenModal, setFullScreenModal] = useState(props.isShow == true ? true : false)

    const handleChange = (status) => {
        setFullScreenModal(status)
        props.onChange(status)
    }

    return (
        <View>
            <View style={{ justifyContent: 'center', alignItems: 'flex-end'}}>
                <TouchableOpacity onPress={() => handleChange(true)}>
                    <Icon type="MaterialCommunityIcons" name="arrow-expand-all" style={{  fontSize:  props.size ? props.size : STYLE_SIZE.ICON_SIZE_THRR, paddingBottom: '3%' }} size={8}/>
                </TouchableOpacity>
            </View>
            <View>
                {props.children}
            </View>
            <DefaultModal
                animationType="slide"
                visible={fullScreenModal}
                onRequestClose={() => {
                    handleChange(false);
                }}
            >
                <View style={{ 
                    flex: 1, 
                    width: windowWidth, 
                    height: windowHeight, 
                    backgroundColor: 'white',
                    position: 'relative',
                    display: 'flex',
                    left:0,
                    bottom: 0,
                    top: 0,
                    right: 0,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 30
                }}>
                    <View style={{ 
                        justifyContent: 'center', 
                        alignItems: 'flex-end', 
                        backgroundColor: 'white', 
                        position: 'absolute', 
                        zIndex: 2, 
                        width: windowWidth, 
                        height: 60, 
                        paddingTop: 10, 
                        paddingRight: 20,
                    }}>
                        <TouchableOpacity onPress={() => handleChange(false)}>
                            <Icon type="MaterialCommunityIcons" name="arrow-collapse-all" style={{ fontSize:  props.size ? props.size : STYLE_SIZE.ICON_SIZE_THRR, paddingBottom: '3%' }} size={9}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        style={{
                            // width: windowHeight , 
                            // height: windowWidth,
                            // transform: [{ rotate: '90deg' }],
                            // // paddingTop: 10,
                            // // paddingLeft: 10,
                            // // height: '100%',
                            // // paddingBottom: 50,
                            // position: 'absolute',
                            // zIndex: 1,
                            // flexDirection: "row",
                            // backgroundColor: 'green',
                            // display: 'flex',
                            // left:0,
                            // bottom: 0,
                            // top: 0,
                            // right: 0,
                            backgroundColor: 'white',
                            transform: [{ rotate: '90deg' }],
                            // top: 210,
                            marginTop: ( windowHeight * 0.27 ),
                            width: windowHeight - ( windowHeight * 0.15 ),
                            position: 'absolute',
                            // marginLeft: 85,
                            height: windowWidth,
                            flexDirection: "row",
                            padding: 0,
                            top: 0,
                            // bottom: 0
                        }}>
                        <ScrollView style={{ 
                            // marginRight: 150,
                            // width: windowHeight , 
                            // height: windowWidth,
                            // display: 'flex',
                            // left:0,
                            // bottom: 0,
                            // top: 0,
                            // right: 0, 
                            // backgroundColor: 'yellow',
                            // position: 'absolute',
                            // zIndex: 33
                            backgroundColor: 'white',

                        }}>
                            {props.children}
                        </ScrollView>
                    </ScrollView>
                </View>
            </DefaultModal>
        </View>
    )
}

export default FuccTable

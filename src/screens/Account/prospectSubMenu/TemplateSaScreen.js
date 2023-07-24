import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native'

import { Text } from '../../../components';
import colors from '../../../utility/colors';

const TemplateSaScreen = ({route}) => {
    const {Title, children} = route.params
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.alertTitle}>
                    <Text style={styles.modalTitle}>{Title}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SubmenuTemplateSaScreen')} style={{marginHorizontal: 15, justifyContent:'center'}}>
                        <Icon type="MaterialCommunityIcons" name="close"  style={{color:colors.white, fontSize:45}}/>
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
                    <Text>{children}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    alertTitle: {
        backgroundColor: colors.primary,
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalTitle:{
        backgroundColor: colors.primary,
        flex: 0.4,
        color: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 15,
    },

});

export default TemplateSaScreen;
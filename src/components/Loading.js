import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import colors from '../utility/colors';

const LoadingCom = () => {
    
    return (
        <View style={styles.contraner}>
            <ActivityIndicator 
                animating={true}
                size="large" 
                color={colors.black}/>
        </View>
    )
}

const styles = StyleSheet.create({
    contraner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    }
});

export default LoadingCom;
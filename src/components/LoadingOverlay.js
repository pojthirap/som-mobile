import React, { useEffect } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';

const LoadingOverLay = ({ visible }) => {
    return (
        <View>
            {
                visible&&<View>
                    <Spinner
                        visible={true}
                        textContent={'Loading...'}
                    />
                </View>
            }
        </View>
    )
}

const styles =  StyleSheet.create({

});

export default LoadingOverLay
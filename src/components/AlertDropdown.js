import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import { Icon } from 'native-base';
import crashlytics from '@react-native-firebase/crashlytics';

import colors from '../utility/colors';
import Text from './Text';
import SearchInput from './SearchInput';
import {sortData} from './../utility/helper'
import Loading from './Loading';
import { FONT_SIZE } from '../utility/enum';

const alertDropdown = ({visible, titleAlert, onPressClose, onPressConfirm, data, textSearch, titleKey, inputSearchKey, displayKey, NotFillter}) =>{
    // const [fileter, setFiltered] = useState(null);

    const [fileter, setFiltered] = useState([]);
    useEffect(() => {
        if (!data) return
        if (!titleKey || !data.length) return setFiltered(data);
        if (NotFillter) return setFiltered(data);
        let dddd = [...data]
        if (dddd.length < 2 ) return setFiltered(data)
        if(dddd.length > 200) return setFiltered(data)
        let dataSort = dddd.sort(function(a, b) {
            return a[titleKey].localeCompare(b[titleKey])
        });
        setFiltered(dataSort)
    }, [data, visible])

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.touchStyle} onPress={() => onPressConfirm(item)}>
                <Text>{item.item[titleKey] || item.item.key}</Text>
            </TouchableOpacity>
        )
    }

    let handleSearchBar = (keyInput) => {
        try {
            let currentList = []
            let newList = []
            if (keyInput !== '') {
                currentList = data || []
                if (!currentList) return
                
                newList = currentList.filter((item) => {
                    if (!item[titleKey || key]) return false
                    
                    const lc = item[titleKey || key].toLowerCase()
                    const filter = keyInput.toLowerCase()
                    return lc.includes(filter)
                })
                setFiltered(newList)
            } else {
                setFiltered(data)
            }
        } catch (error) {
            crashlytics().log('AlertDropdown ' + error );
        }
    }
    
    return(
        <View style={{ flex: 1}}>
            <Modal
                animationType = 'slide'
                transparent = {true}
                visible = {visible}>
                <View style={styles.alertBox}>
                    <View style={styles.contraner}>
                        <View style={styles.alertTitle}>
                            <View style={{justifyContent:'center'}}>
                                <Text style={{color: colors.white, marginHorizontal: '2%'}}>
                                    {titleAlert}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => onPressClose(false)} style={{marginHorizontal: '2%'}}>
                                <Icon type="MaterialCommunityIcons" name="close"  style={{color:colors.white, fontSize: FONT_SIZE.TEXT}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.alertSerch}>
                            <SearchInput onChangeText={handleSearchBar} textSearch = {textSearch} SearchBarType={'AutoSearchBar'}/>
                        </View >
                        <View style={styles.itemBox}>
                            {
                            fileter.length ?
                                <FlatList
                                    data={fileter}
                                    renderItem={(item) => renderItem(item)}
                                    keyExtractor={item => item.gasId}
                                />
                                :
                                <View style={{alignItems: 'center', marginTop: 20}}>
                                    <Text>ไม่พบข้อมูล</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </Modal>    
        </View>
    )
}

const styles =  StyleSheet.create({
    contraner: {
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: 10,
        width: '100%',
        height: '100%',
        maxHeight: '90%',
        minHeight: '50%',
    },
    alertBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.6)',
        paddingHorizontal: '3%',
        paddingVertical: '10%'
    },
    alertTitle: {
        backgroundColor: colors.primary,
        width: "100%",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: '3%',
        paddingVertical: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    alertSerch: {
        flex: 1/5,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
    },
    alertCancel: {
        width: '100%',
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: '2%'
    },
    touchStyle: {
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        justifyContent: 'center',
        paddingVertical: '2%',
        paddingHorizontal: '3%'
    },
    itemBox: {
        width: "100%",
        flex: 1,
        marginVertical: 10,
    },
});

export default alertDropdown;

alertDropdown.propsTypes = {
    visible: PropTypes.string,
    titleAlert: PropTypes.string,
    onPressClose: PropTypes.string,
    onPressConfirm: PropTypes.string,
    data: PropTypes.string,
}
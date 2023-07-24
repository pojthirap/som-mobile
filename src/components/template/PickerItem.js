import React, { useState ,useEffect,useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList,PermissionsAndroid,Dimensions,ActivityIndicator,TextInput } from 'react-native';
import { Text,SelectDropdown,Modal,Table,CheckBox,PickerDate } from '../../components'
import dayjs  from 'dayjs';
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('TH')
function Date (props){
    const [value,setValue] = useState(props.dateValue ? dayjs(props.dateValue).format('YYYY-MM-DD') : null)
    return <View>
        <PickerDate dateValue={value} onChange={(date)=>{
            setValue(date)
            props.onChange(date)
        }} markDate={value} minDate={props.minDate ? dayjs(props.minDate).add(1,'days').format('YYYY-MM-DD') : null } disabled={props.disabled ? props.disabled : false}/>  
        </View>
}

export default Date;
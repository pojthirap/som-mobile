import React, { useState } from 'react';
import { View } from 'react-native';
import { PickerDate } from '..'
import dayjs from 'dayjs';
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.locale('TH')
function Date(props) {
    const [start, setStart] = useState(props.value[0] && props.value[0].val ? dayjs(props.value[0].val).format('YYYY-MM-DD') : null)
    const [end, setEnd] = useState(props.value[1] && props.value[1].val ? dayjs(props.value[1].val).format('YYYY-MM-DD') : null)
    const [value, setValue] = useState(props.dateValue ? dayjs(props.dateValue).format('YYYY-MM-DD') : null)
    return <View>
        <PickerDate disabled={props.disable} dateValue={start} onChange={(date) => {
            setStart(date)
            setEnd(null)
            props.onChangeV1(date)
        }} />
        <View>
            <PickerDate disabled={props.disable} dateValue={end} onChange={(date) => {
                setEnd(date)
                props.onChangeV2(date)
            }} minDate={start ? dayjs(start).format('YYYY-MM-DD') : null} />
        </View>
    </View>
}

export default Date;
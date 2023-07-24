import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Text as RnText,
} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import {
    Calendar,
    CalendarList,
    LocaleConfig,
    Agenda,
} from 'react-native-calendars';
import XDate from 'xdate';

import colors from '../utility/colors'

LocaleConfig.locales['th'] = {
    monthNames: ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'],
    monthNamesShort: ['ม.ค.','ก.พ.','ม.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ต.','ก.ย..','ต.ค.','พ.ย.','ธ.ค.'],
    dayNames: ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'],
    dayNamesShort: ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],
    today: 'วันนี้'
};

LocaleConfig.locales['en'] = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthNamesShort: [
      'JAN.',
      'FEB.',
      'MAR.',
      'APR.',
      'MAY.',
      'JUN.',
      'JUL.',
      'AUG.',
      'SEP.',
      'OCT.',
      'NOV.',
      'DEC.',
    ],
    dayNames: ['SUN', 'MON', 'TUE', 'WEB', 'THU', 'FRI', 'SAT'],
    dayNamesShort: ['SUN', 'MON', 'TUE', 'WEB', 'THU', 'FRI', 'SAT'],
    today: 'Today',
};

LocaleConfig.defaultLocale = 'th';

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const initYear = 1955;
const currentYear = Number(new Date().getFullYear());
const years = Array(currentYear - initYear)
  .fill()
  .map((v, i) => i + 1).reverse();
const format = 'DD / MMM / BBBB';
const {width, height} = Dimensions.get('window');


const Index = ({ valueDate,minDate, maxDate, onDateChange, dateValue, markDate, maxYear}) => {
    let newX = new XDate(markDate)
    const checkD = markDate ? newX.toString('yyyy-MM-dd') : valueDate;

    const [value, setValue] = useState(valueDate ? dayjs(valueDate).format('YYYY-MM-DD') : null);
    const [yearListVisible, setYearListVisible] = useState(false);
    const [month, setMonth] = useState(undefined);
    const [current, setCurrent] = useState(checkD);
    const [locale, setLocale] = useState('th');
    const [makerDate, setMarkerDate] = useState(dayjs(markDate).format('YYYY-MM-DD'));

    useEffect(() => {
      if (markDate) return setMarkerDate(dayjs(markDate).format('YYYY-MM-DD'))
      return setMarkerDate(dayjs().format('YYYY-MM-DD'))
    }, [markDate])

    const onSelectYear = (year) => {
        month.setFullYear(year);
        const current = month.toString('yyyy-MM-dd');
        setCurrent(current);
        setYearListVisible(!yearListVisible);
        setMonth(month);
    };

    const onPressHeader = (month) => {
      if (!month) return;

      setMonth(month);
      setYearListVisible(true);
    }

    const renderYear = ({item}) => {
        const year = initYear + item;
        return (
          <TouchableOpacity
            onPress={() => onSelectYear(year)}
            style={{height: 50, alignItems: 'center', flex: 1}}>
            <RnText style={{fontSize: 20}}>
              {locale === 'th' ? Number(year) + 543 : year}
            </RnText>
          </TouchableOpacity>
        );
    };

    const headerYears = () => {
        if (!month) return;
        // setYearListVisible(!yearListVisible);

        if (locale === 'th')
          return month.toString('MMMM') + ' ' + (month.getFullYear() + 543);
        return month.toString('MMMM yyyy');
    };

    const checkMaxDate = () => {
      let maxD = dayjs(maxDate).format('YYYY-MM-DD')
      let dateNow = dayjs().format('YYYY-MM-DD')
      if (maxDate > dateNow) return dateNow

      return maxD
    }

    return (
        <View>
            {yearListVisible ? (
              <View style={[{backgroundColor: 'white', height: height * 0.25}]}>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    height: 45,
                    justifyContent: 'center',
                  }}
                  onPress={() => setYearListVisible(false)}>
                  <RnText style={{textAlign: 'center', fontSize: 18}}>
                    {headerYears()}
                  </RnText>
                </TouchableOpacity>
                <FlatList
                  nestedScrollEnabled
                  style={{marginTop: 5, flex: 1}}
                  data={years}
                  keyExtractor={(item) => item}
                  renderItem={renderYear}
                />
              </View>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              // onPress={() => console.log('asdklasdkl')}
              >
              <Calendar
                showYears={false}
                // style = {{position: 'absolute'}}
                // yeasClick={() => console.log('lcik')}
                current={current}
                onDayPress={(day) => {
                  setValue(day.dateString);
                  onDateChange(dayjs(day.dateString).format('YYYY-MM-DD').concat('T00:00:00'));
                }}
                onDayLongPress={(day)=>{
                  setValue(day.dateString);
                  onDateChange(dayjs(day.dateString).format('YYYY-MM-DD').concat('T00:00:00'));
                }}
                markedDates={{
                  [makerDate]: {
                    selected: true,
                    selectedColor: colors.primary,
                  },
                }}
                locale={locale}
                minDate={minDate ? minDate : null}
                maxDate={maxDate ? checkMaxDate() : null}
                // Handler which gets executed on day long press. Default = undefined
                enableSwipeMonths={true}
                onPressYear={onPressHeader}
              />
            </TouchableOpacity>
          )}
        </View>
    )
}

export default Index;

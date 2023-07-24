import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'native-base';

import { TableStockCount, Text, FullTable } from '../../../components';
import { FONT_SIZE } from '../../../utility/enum';
import colors from '../../../utility/colors'
import { stockCount } from '../../../actions/StockCountAction'
import { useDispatch, useSelector } from 'react-redux';
const SubmenuStockCount = () => {
  const { prospectSelectInfoReducer } = useSelector((state) => state);
  const [prospect, setProspect] = useState(prospectSelectInfoReducer.dataSelect);
  const [isShowFullTable, setisShowFullTable] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, [])
  const getData = async () => {
    const data = await stockCount(`${prospect.prospect.prospectId}`);
    setData(data)
  }
  const getTitle = () => {
    if (!prospectSelectInfoReducer.dataSelect) return ''

    return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView>
        <View style={styles.topLabel}>
          <Text style={{ fontSize: FONT_SIZE.HEADER, fontWeight: 'bold' }}>{getTitle()}</Text>
          <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight: 'bold' }}>Stock Count</Text>
        </View>
        <View style={{ marginHorizontal: '3%', marginBottom: '10%' }}>
          <FullTable isShow={isShowFullTable} onChange={(status) => setisShowFullTable(status)}>
            <TableStockCount isShowFullTable={isShowFullTable} data={data} />
          </FullTable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  topLabel: {
    marginVertical: '5%',
    paddingHorizontal: '5%'
  },
});

export default SubmenuStockCount;
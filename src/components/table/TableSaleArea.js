import React, { useEffect, useState,useRef, useImperativeHandle, forwardRef } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity  } from 'react-native';
import { Icon } from 'native-base'
import { DataTable, Menu, Divider, Provider } from 'react-native-paper';

import colors from '../../utility/colors'

import Text from '../Text'
import language from '../../language/th.json'
import { FONT_SIZE } from '../../utility/enum';

const TableSaleArea = ({data, 
                        spaceHorizontal= '5%',
                        recordDetail= {},
                        onPressPage,
                        currentPage,
                        onPressSelectButton,
                        value,
                        massageError = language.NOINPUT,
                    },ref) => {

    const [isError, setIsError] = useState(false);
    const [errorMessage, setEerrorMessage] = useState('');
    const [visiblePageSelect, setVisiblePageSelect] = useState(false);
    const [page, setPage] = useState(0);
    const inputRef = useRef({});
    const nubmerPageArray = [...Array(recordDetail.totalPages || 1).keys()];
    const openMenu = () => setVisiblePageSelect(true);
    const closeMenu = () => setVisiblePageSelect(false);

    useEffect(() => {
        setPage(currentPage - 1);
    }, [currentPage])

    // useImperativeHandle(ref, () => ({
    //     getInputValue() {
    //         return { isInvalid: validate(), value: value, isChange: isChange() };
    //     }
    //   }));

    // const validate = () => {
    // if (!value) {
    //     setEerrorMessage(`${massageError}`);
    //     setIsError(true);
    //     return true
    // }

    // setIsError(false);
    //     return false
    // };

    const isChange = () => {
        if (!data && !value) return false
        if(data && value){
           let DATA = data.find((item)=>{ return item.custSaleId != value}) 
           return DATA
        }
      };

    const onPageChange = (page) => {
        setPage(page);
        onPressPage(page + 1)
    }

    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      }

    const tableHeader = () => {
        return (
        <View style={styles.tableHeader}>
            <View style={[styles.columnHeader,{width: 100}]}>
                <Text> </Text>
            </View>
            <View style={[styles.columnHeader,{width: 200}]}>
                <Text style={{color:colors.white}}>Sale Organization</Text>
            </View>  
            <View style={[styles.columnHeader,{width: 220}]}>
                <Text style={{color:colors.white}}>Distribution Channel</Text>
            </View>  
            <View style={[styles.columnHeader,{width: 200}]}>
                <Text style={{color:colors.white}}>Division</Text>
            </View> 
        </View>
    )}
return (
<View style={[styles.container, {marginHorizontal : spaceHorizontal}]}>
<ScrollView horizontal={true} style={{ }}>
  <FlatList 
      contentContainerStyle={{ borderRadius: 20, overflow: 'hidden'}}
      data={data}
      keyExtractor={(item, index) => index+""}
      ListHeaderComponent={tableHeader}
      stickyHeaderIndices={[0]}
      renderItem={({item, index}) => {
        return (
        <View
        style={{...styles.tableRow, 
                  backgroundColor: index % 2 == 1 ?  colors.grayTable: colors.white, 
                  borderBottomWidth: 1, 
                  borderColor:colors.gray,
                  }}>
        <View style={{ flexDirection: 'row'}}>
         <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center',width:100}]}>
             <TouchableOpacity onPress={()=>onPressSelectButton(item)} >
                <Icon type="FontAwesome" name="check-circle" style={{alignItems:'center',color:colors.grayDark,fontSize:30}}/>
             </TouchableOpacity>
         </View>
            <View style={[styles.itemTable,{width:200}]}>
                <Text style={styles.columnRowTxt}>{item.orgNameTh}</Text> 
            </View>
            <View style={[styles.itemTable,{width:220}]}>
                <Text style={styles.columnRowTxt}>{item.channelNameTh}</Text> 
            </View>
            <View style={[styles.itemTable,{width:200}]}>
                <Text style={styles.columnRowTxt}>{item.divisionNameTh}</Text>
            </View>
        </View>
        </View>  
        )}
    }
  />
</ScrollView>
{
  !data.length&&<View><Text>ไม่พบข้อมูล</Text></View>
}
  <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',  paddingRight: '5%', paddingLeft:'2%', flexWrap: 'wrap' }}>
      <View style={{ flex: 1, flexBasis: '100%' }}>
          <Text>
              {`แสดง ${recordDetail.recordStart || 0} ถึง ${data.length ? ((page) * 5) + data.length : 0} ของ ${recordDetail.totalRecords || 0} รายการ`}
          </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', flexBasis: '100%' }} >
          <DataTable>
              <DataTable.Pagination
                  page={page}
                  numberOfPages={recordDetail.totalPages || 1}
                  onPageChange={page => onPageChange(page)}
                  showFastPaginationControls
                  // numberOfItemsPerPageList={numberOfItemsPerPageList}
                  // numberOfItemsPerPage={numberOfItemsPerPage}
                  // onItemsPerPageChange={onItemsPerPageChange}
                  selectPageDropdownLabel={'go to page'}
              />
          </DataTable>
          <View style={{ width: 50, height: 50 }}>
              <Menu
                  visible={visiblePageSelect}
                  onDismiss={closeMenu}
                  anchor={
                      <TouchableOpacity onPress={openMenu} style={{ 
                          justifyContent: 'center', 
                          marginTop: 10, 
                          borderColor: 'lightgray',
                          borderWidth: 1,
                          borderRadius: 5,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center'
                          }}>
                          <Text>
                              {page + 1}
                          </Text>
                          <Icon type="SimpleLineIcons" name="arrow-down" style={{alignItems:'center',color:colors.grayDark,fontSize:10, marginLeft: '2%'}}/>
                      </TouchableOpacity>
                  }>
                  <ScrollView>
                      {
                          nubmerPageArray.map((page, index) => {
                              return <Menu.Item onPress={() => {
                                  onPageChange(page)
                                  closeMenu()
                              }} title={page + 1} />
                          })
                      }
                  </ScrollView>
              </Menu>
          </View>
      </View>
  </View>
</View>
);
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        height: 60,
    },
    tableRow: {
        flexDirection: "row",
        minHeight: 50,
        alignItems:"center"
    },
    columnHeader: {
        flex: 1,
        justifyContent: "center",
        alignItems:"center",
        width: 150,
        borderLeftWidth:0.5,
        borderColor:colors.white,
        minHeight:60,
    },
    columnRowTxt: {
        paddingLeft: 20,
        paddingRight: 5,
    },
    itemTable:{
        borderLeftWidth:0.5,
        borderColor:colors.gray,
        minHeight:50,
        justifyContent: "center",
        maxHeight: '100%',
        flex: 1,
    },
    itemTableNumber:{
        flex: 1,
        borderLeftWidth:0.5,
        borderColor:colors.gray,
        minHeight:50,
        maxHeight: '100%',
        justifyContent: "center",
        width: 150,
        alignItems:'center'
    },
});


export default forwardRef(TableSaleArea);
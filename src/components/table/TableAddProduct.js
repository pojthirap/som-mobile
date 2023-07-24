import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity  } from 'react-native';
import { Icon } from 'native-base'

import colors from '../../utility/colors'

import Text from '../Text'
import TextInput from '../TextInput'
import { getInputData, resetInputData } from '../../utility/helper';
let currentValue = [{
  "additionalPrice": "",
  "prodNameTh": "",
  "altUnit": "",
  "orderProdId": "",
  "orderId": "",
  "prodCode": "",
  "qty": 0,
  "prodConvId": 0,
  "netPriceEx": 0,
  "transferPrice": 0,
  "netPriceInc": 0,
  "additionalPrice": 0,
  "itemType": "",
  "netValue": 0,
  "createUser": "",
  "createDtm": "",
  "updateUser": "",
  "updateDtm": "",
  "sapItemNo": "",
  "prodAltUnit": "",
  "prodCateCode": ""
}]
const TableAddProduct = ({  data, 
                            editable = true, 
                            spaceHorizontal= 5,
                            onPressRemove,
                            comma,
                            hideEdit = false,
                            hideDelete = false,
                            disableRemoveBut = false,
                            refresh,
                            editAdditional,
                        }, ref) => {
      const inputRef = useRef({});
      const [dataChangeqty, setDataChangeqty] = useState(0);
      const [dataChange, setDataChange] = useState(0);
      const [dataChangeAdd, setDataChangeAdd] = useState(0);
      const [dataChangeNetP, setDataChangeNetP] = useState(0);
      const [dataChangeNetV, setDataChangeNetV] = useState(0);
      const [dataChangeTrans, setDataChangeTrans] = useState(0);
      const [editPer, setEditPer] = useState([]);

      useEffect(() => {
        let finds = data.map((item, index) => {
          return {index, text: item.additionalPrice || 0}
        })
        setEditPer(finds)
      }, [])

      useEffect(() => {
        setDataChangeqty(getTotalVal("qty"))
        setDataChange(getTotalVal("netPriceEx"))
        setDataChangeAdd(getTotalVal("additionalPrice"))
        setDataChangeNetP(getTotalVal("netPriceInc"))
        setDataChangeNetV(getTotalVal("netValue"))
        setDataChangeTrans(getTotalVal("transferPrice"))

        let propData = JSON.stringify([...data])
        let parse = JSON.parse(propData)

        // let propsEdit = parse.map((item, index) => {
        //   let val = editPer.find((i) => {
        //     let deleteSelect = i.prodCode == item.prodCode && i.prodCateCode == item.prodCateCode && i.altUnit == item.altUnit
        //     return deleteSelect
        //   }) || []


        //   let dds = {...item, 
        //     additionalPerUnit: val.remove ? '' : (val.additionalPerUnit || item.additionalPerUnit),
        //     additionalPrice: val.remove ? 0 : (val.text || item.additionalPrice)
        //   }
        //   return dds
        // })

        currentValue = parse

      },[data])

      useEffect(() => {
        if (refresh == true) {
          resetVal()
        }
      },[refresh])

      const resetVal = () => {
        setDataChangeqty("0.00")
        setDataChange("0.00")
        setDataChangeAdd("0.00")
        setDataChangeNetP("0.00")
        setDataChangeNetV("0.00")
        setDataChangeTrans("0.00")
      }

      useImperativeHandle(ref, () => ({
        getInputValue() {
            let totalValue = getInputData(inputRef, 'C');

            return { isInvalid: totalValue.isInvalid, value: totalValue, isChange: !totalValue.isNotChange, title: totalValue.changeField, list: currentValue };
        },
        resetValue() {
            resetInputData(inputRef);
            setDataChangeqty(getTotalVal("qty"))
            setDataChange(getTotalVal("netPriceEx"))
            setDataChangeAdd(getTotalVal("additionalPrice"))
            setDataChangeNetP(getTotalVal("netPriceInc"))
            setDataChangeNetV(getTotalVal("netValue"))
            setDataChangeTrans(getTotalVal("transferPrice"))
        },
        clear() {
            setIsError(false);
            setEerrorMessage('');
            setText('');
        },
    }));

    function formatNumber(num) {
      if (num == undefined) return num
      let number = num;
      if (!isNaN(number)) number = parseFloat(number).toFixed(2)
      return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const tableHeader = () => {
        return (
            <View style={styles.tableHeader}>     
                <View style={[styles.columnHeader,{width: 200}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Product Code</Text>
                </View>
                <View style={[styles.columnHeader,{width: 200}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Product Category</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 220}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Description</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 150}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Quantity</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 100}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Unit</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 300}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Net Price1 (ex Addition Price){'\n'}(inc Transfer Price)</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 200}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Additional Price</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 200}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Per</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 300}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Net Price2 (inc Additional Price)</Text>
                </View>  
                <View style={[styles.columnHeader,{width: 150}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Net Value</Text>
                </View> 
                <View style={[styles.columnHeader,{width: 150}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Transfer Price</Text>
                </View>
                <View style={[styles.columnHeader,{width: 150}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}>Item Type</Text>
                </View>
                <View style={[styles.columnHeader,{width: 80}]}>
                    <Text style={{color:colors.white,fontWeight:'bold'}}></Text>
                </View>
            </View>
          )
        }

      const getTotalVal = (param) => {
        let value = data.reduce((previous, current) => {
          if (isNaN(current[param])) return previous + 0
          return previous + parseFloat(current[param])
        }, 0)

        return formatNumber(parseFloat(value).toFixed(2))
      }

      const handleEditableInputPer = (index) => {
        if (hideEdit) return false
        if (editAdditional) return false

        let perItem = currentValue[index] ? currentValue[index].additionalPrice : null

        let nonComma = perItem ? perItem.toString().replace(/,/g, '') : null;
        if (perItem && parseFloat(nonComma) != 0) return true

        if (!editable) return false

        return false
      }

      const removePer = (index) => {
        let rmPer = editPer[index].remove = true
        setEditPer(rmPer)
      }

      const handlePerValue = (index) => {
        if (!currentValue[index]) return ''
        if (!currentValue[index].additionalPrice) return ''
        if (!currentValue[index].additionalPrice && !currentValue[index].additionalPerUnit) return '1'

        let perItem = currentValue[index] && currentValue[index].additionalPerUnit ? currentValue[index].additionalPerUnit : ''

        return `${perItem || ''}`
      }

      return (
        <View style={[styles.container, {marginHorizontal : spaceHorizontal}]}>
            <ScrollView horizontal={true} style={{ }}>
              <View style={{backgroundColor:'#CCC', borderRadius:20, borderWidth:0.5, borderColor:colors.grayborder}}>
               <FlatList 
                contentContainerStyle={{ overflow: 'hidden'}}
                data={data}
                extraData={currentValue}
                keyExtractor={(item, index) => index+""}
                ListHeaderComponent={tableHeader}
                stickyHeaderIndices={[0]}
                renderItem={({item, index})=> {
                  return (
                        <View style={{...styles.tableRow, 
                                      backgroundColor: index % 2 == 1 ?  colors.white: colors.grayborder, 
                                      borderBottomWidth: 1, 
                                      borderColor:colors.gray,
                                      }}>
                    {data ? 
                        <View style={{ flexDirection: 'row'}}>
                            <View style={[styles.itemTable,{width:235}]}>
                                  <Text style={styles.columnRowTxt}>{item.prodCode}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:235}]}>
                                  <Text style={styles.columnRowTxt}>{item.prodCateCode}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:255}]}>
                                  <Text style={styles.columnRowTxt}>{item.prodNameTh}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:185}]}>
                              <View style={{paddingHorizontal:80, alignSelf:'center',marginTop:-40}}>
                                <TextInput 
                                  editable={hideEdit ? false : editable}
                                  value = {item.qty ? `${item.qty}` : ''}
                                  // ref={el => inputRef.current[index] = el}
                                  ref={el => inputRef.current['qty'+index] = el}
                                  onChangeText={(text) => {
                                    (text && currentValue[index].qty != text ? currentValue[index].qty = text.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '')
                                    resetVal()
                                  }}
                                  maxLength = {13}
                                  comma
                                  typeKeyboard={"numeric"}
                                  widthBox = {150}
                                />
                              </View>
                            </View>
                            <View style={[styles.itemTable,{width:135, alignItems: 'flex-end', paddingEnd: 20}]}>
                              <Text style={styles.columnRowTxt}>{item.altUnit}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:335, alignItems: 'flex-end', paddingEnd: 20}]}>
                              <Text style={styles.columnRowTxt}>{formatNumber(item.netPriceEx)}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:234}]}>
                              <View style={{paddingHorizontal:80, alignSelf:'center',marginTop:-40}}>
                                <TextInput 
                                  editable={hideEdit ? false : editAdditional ? false : editable}
                                  value={item.additionalPrice || item.additionalPrice == 0 ? `${item.additionalPrice}` : '0'} 
                                  ref={el => inputRef.current['additionalPrice'+index] = el}
                                  onChangeText={(text) => {
                                    if (currentValue && currentValue[index] && currentValue[index].additionalPrice != text) {
                                      currentValue[index].additionalPrice = text
                                      let nonComma = text ? text.toString().replace(/,/g, '') : 0;
                                      if (!text || parseFloat(nonComma) == 0) currentValue[index].additionalPerUnit = ''
                                      if (text && parseFloat(nonComma) != 0  && !currentValue[index].additionalPerUnit) currentValue[index].additionalPerUnit = 1

                                      // let finds = editPer.filter((item) => item.index != index)
                                      // setEditPer([...finds, {index, text, }])
                                      let finds = editPer.map((i) => {
                                        let check = i.prodCode == item.prodCode && i.prodCateCode == item.prodCateCode && i.altUnit == item.altUnit
                                        if (!check) return text ? i : {...i, additionalPerUnit : ''}
                                        return {index: index, additionalPerUnit: text ? i.additionalPerUnit : '', text: text, prodCode: i.prodCode, prodCateCode: i.prodCateCode, altUnit: i.altUnit }
                                      })

                                      let findIndex = finds.find((item) => item.index == index)
                                      if (findIndex) {
                                        setEditPer(finds)
                                      } else {
                                        setEditPer([...finds, {...item, index: index, additionalPerUnit: '', text: text }])
                                      }
                                      
                                    }

                                    resetVal()
                                  }}
                                  // maxLength={13}
                                  maxLength={10}
                                  type={"NumFloat"}
                                  comma
                                  typeKeyboard={"numeric"}
                                  addition = {true}
                                  widthBox = {150}
                                />
                              </View>
                              {/* <Text style={styles.columnRowTxt}>{item.Additional_Price}</Text>  */}
                            </View>
                            <View style={[styles.itemTable,{width:234}]}>
                              <View style={{paddingHorizontal:80, alignSelf:'center',marginTop:-40}}>
                                <TextInput 
                                  editable={handleEditableInputPer(index)}
                                  value={handlePerValue(index)}
                                  ref={el => inputRef.current['additionalPerUnit'+index] = el}
                                  onChangeText={(text) => {
                                    if (text && currentValue) {
                                      currentValue[index].additionalPerUnit = text
                                  
                                      let finds = editPer.map((i) => {
                                        let check = i.prodCode == item.prodCode && i.prodCateCode == item.prodCateCode && i.altUnit == item.altUnit
                                        if (!check) return i
                                        return {index: index, additionalPerUnit: text, text: i.text, prodCode: i.prodCode, prodCateCode: i.prodCateCode, altUnit: i.altUnit }
                                      })

                                      let findIndex = finds.find((item) => item.index == index)
                                      if (findIndex) {
                                        setEditPer(finds)
                                      } else {
                                        setEditPer([...finds, {...item, index: index, additionalPerUnit: '', text: text }])
                                      }
                                    }
                                    resetVal()
                                  }}
                                  maxLength={7}
                                  type={"Num"}
                                  comma
                                  typeKeyboard={"numeric"}
                                  // addition = {true}
                                  widthBox = {150}
                                />
                              </View>
                            </View>
                            <View style={[styles.itemTable,{width:334, alignItems: 'flex-end', paddingEnd: 20}]}>
                                <Text style={styles.columnRowTxt}>{formatNumber(item.netPriceInc)}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:185, alignItems: 'center'}]}>
                                <Text style={styles.columnRowTxt}>{formatNumber(item.netValue)}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:185, alignItems: 'flex-end', paddingEnd: 20}]}>
                                <Text style={styles.columnRowTxt}>{formatNumber(item.transferPrice)}</Text> 
                            </View>
                            <View style={[styles.itemTable,{width:185}]}>
                                <Text style={styles.columnRowTxt}>{item.itemType}</Text> 
                            </View>
                            
                            <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center',width:115}]}>
                              {
                                hideDelete == true ?
                                null
                                :
                                <TouchableOpacity onPress={() => {
                                  // removePer(index)
                                  onPressRemove(item)
                                }} 
                                  disabled={disableRemoveBut}>
                                  <Icon type="Ionicons" name="trash-outline" style={{ color: colors.grayDark, fontSize:25 }}/>
                                </TouchableOpacity>
                              }
                            </View>
                        </View>
                          :
                          <View style={styles.itemTable}>
                            <Text style={styles.columnRowTxt}>No Data</Text> 
                          </View>
                          }
                          </View>
                  )}
                } 
                /> 
                
                {/* {
                  data && data.length != 0 ?
                  <View style={{height:50, flexDirection:'row', borderBottomWidth:0.5, borderColor:colors.gray,}}>
                    <View style={[styles.itemTable, { width:1045, justifyContent:'center', alignItems:'center'}]}>
                      <Text style={{alignSelf:'flex-end',paddingHorizontal:20, fontWeight:'bold'}}>Total</Text>
                    </View>
                    <View style={[styles.itemTable, { backgroundColor:colors.white, width:335, justifyContent:'center'}]}>
                      <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChange}</Text>
                    </View>
                    <View style={[styles.itemTable, { backgroundColor:colors.white, width:235, justifyContent:'center'}]}>
                      <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChangeAdd}</Text>
                    </View>
                    <View style={[styles.itemTable, { backgroundColor:colors.white, width:334, justifyContent:'center'}]}>
                      <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChangeNetP}</Text>
                    </View>
                    <View style={[styles.itemTable, { backgroundColor:colors.white, width:185, justifyContent:'center'}]}>
                      <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChangeNetV}</Text>
                    </View>
                    <View style={[styles.itemTable, { backgroundColor:colors.white, width:185, justifyContent:'center'}]}>
                      <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChangeTrans}</Text>
                    </View>
                  </View>
                  :
                  <View style={{height: 50, justifyContent: 'center'}}>
                    <Text style={{alignSelf:'center', fontWeight:'bold'}}>ไม่พบข้อมูล</Text>
                  </View>
                } */}

                {
                  data && data.length != 0 ?
                  <View style={{height:50, flexDirection:'row', borderBottomWidth:0.5, borderColor:colors.gray,}}>
                    <View style={[styles.itemTable, { width:725, justifyContent:'center', alignItems:'center'}]}>
                      <Text style={{alignSelf:'flex-end',paddingHorizontal:20, fontWeight:'bold'}}>Total</Text>
                    </View>
                    <View style={[styles.itemTable, { backgroundColor:colors.white, width:185, justifyContent:'center'}]}>
                      <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChangeqty}</Text>
                    </View>
                    <View style={[styles.itemTable, { width:1272, justifyContent:'center'}]}>
                      {/* <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChangeAdd}</Text> */}
                    </View>
                    <View style={[styles.itemTable, { backgroundColor:colors.white, width:185, justifyContent:'center'}]}>
                      <Text style={{alignSelf:'center', fontWeight:'bold'}}>{dataChangeNetV}</Text>
                    </View>
                  </View>
                  :
                  <View style={{height: 50, justifyContent: 'center'}}>
                    <Text style={{alignSelf:'center', fontWeight:'bold'}}>ไม่พบข้อมูล</Text>
                  </View>
                }
                
              </View>
            </ScrollView>
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
        height: 70,
        alignItems:"center"
      },
      columnHeader: {
        flex: 1,
        justifyContent: "center",
        alignItems:"center",
        borderLeftWidth:0.5,
        borderColor:colors.white,
        height:60,
      },
      columnRowTxt: {
        paddingLeft: 20,
      },
      itemTable:{
          borderLeftWidth:0.5,
          borderColor:colors.gray,
          height:70,
          justifyContent: "center",
      },
    });
    

export default forwardRef(TableAddProduct);
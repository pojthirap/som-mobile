import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, Modal as DefaultModal, Dimensions  } from 'react-native';
import { Icon } from 'native-base'
import QRCode from 'react-native-qrcode-svg';
import { RadioButton } from 'react-native-paper';
import { DataTable, Menu, Divider, Provider } from 'react-native-paper';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import colors from '../../utility/colors'

import Text from '../Text'
import Modal from '../Modal'
import TimePicker from '../TimePicker'
import CheckBox from '../CheckBox'
import Button from '../Button'
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';

var buddhistEra = require('dayjs/plugin/buddhistEra')
dayjs.extend(buddhistEra)

require('dayjs/locale/th')

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Table = ({data = [], 
                columns , 
                editable = false, 
                edittableonly = false,
                qrCode = false, 
                selectButton = false,
                Time = false,
                removetable = false,
                select = false,
                editableTime = false,
                onPressEdit, 
                onPressEditOnly,
                onPressRemove,
                spaceHorizontal= '5%',
                recordDetail= {},
                onPressPage,
                currentPage,
                dragable = false,
                onDragend,
                nopage = false,
                onPressSelect,
                onPressSelectButton,
                hideEdit = false,
                hideDelete = false,
                viewSelectCheckbox,
                isShowFullTable = false
              }) => {

  const [columnsList, setColumnsList] = useState(columns);
  const [visible, setVisible] = useState(false);
  const [visiblePageSelect, setVisiblePageSelect] = useState(false);
  const [qrData, setQrData] = useState('qrcode'); 
  const [page, setPage] = useState(0);
  const [qrDetail, setQrDetail] = useState('');
  const [svg, setSvg] = useState();
  const inputRef = useRef({});

  const nubmerPageArray = [...Array(recordDetail.totalPages || 1).keys()];

  const openMenu = () => setVisiblePageSelect(true);

  const closeMenu = () => setVisiblePageSelect(false);

  const onPressCap = () => {
    inputRef.viewShot.capture().then(uri => {
      callback(uri)
    });
    
  }

  const onShare = () =>{
    svg.toDataURL(callback)
  };
  
  const callback = (dataURL) => {
    if (dataURL) {
      const shareOptions = {
        type: 'image/jpg',
        title: '',
        url: dataURL,
      };
      Share.open(shareOptions)
        // .then(res => console.log(res))
        // .catch(err => console.error(err));
    }
  };

  const handelSelectCheckbox = (item) => {
    let keyRequire = item.taskType;

    if (keyRequire == 'S') return true;
    if (keyRequire == 'M') return true;
    if (keyRequire == 'T') return true;
    if (keyRequire == 'A') return false;
    
    return false;
  };

  const handleDefaultSelect = (item) => {
    let flagRequire = item.requireFlag;
    if (flagRequire == 'Y') return true;
    
    return false;
  };

  const handleDefaultSelectDis = (item) => {
    let flagRequire = item.requireFlag;
    if (flagRequire == 'Y') {
      return 'viewDisable';
    }
    
    return 'disable'
  };

  useEffect(() => {

    // let findRadio = columnsList.find((item) => item == '')
    // if(radioButton && !findRadio) {
    //   setColumnsList((columnsList) => [...columnsList, ''])
    // }

    let findTime = columnsList.find((item) => item == 'Time')
    if(Time && !findTime) {
      setColumnsList((columnsList) => [...columnsList, {key: '_Time', title: 'Time'}])
    }

    let findQR = columnsList.find((item) => item == 'QR')
    if(qrCode && !findQR) {
      setColumnsList((columnsList) => [...columnsList, { key: '_QR', title: 'QR' }])
    }

    let findSelect = columnsList.find((item) => item == 'Required')
    if(select && !findSelect) {
      setColumnsList((columnsList) => [...columnsList, { key: '_Required', title: 'Required' }])
    }

    let findEditable = columnsList.find((item) => item == '')
    if(editable && findEditable == undefined) {
      setColumnsList((columnsList) => [...columnsList, {key: '_EIDTABLE', title: ''}])
    }

    let findEdittableonly = columnsList.find((item) => item == '')
    if(edittableonly && findEdittableonly == undefined) {
      setColumnsList((columnsList) => [...columnsList, {key: '_EIDTTABLEONLY', title: ''}])
    }

    let findRemovetable = columnsList.find((item) => item == '')
    if(removetable && findRemovetable == undefined) {
      setColumnsList((columnsList) => [...columnsList, {key: '_removeTable', title: ''}])
    }
  }, [])

  useEffect(() => {
    setPage(currentPage - 1);
  }, [currentPage])

  const onPageChange = (page) => {
    setPage(page);
    onPressPage(page + 1)
  }
    const tableHeader = () => (
        <View style={styles.tableHeader}>
          {selectButton ? 
            <View style={styles.columnHeader}>
              <Text> </Text>
            </View>
          :
          null
          }
          {
            columnsList.map((column, index) => {
              {
                return (
                    <View style={styles.columnHeader}>
                        <Text style={{color:colors.white,fontWeight:'bold'}}>{column.title}</Text>
                    </View>   
                )
              }
            })
          }
        </View>
    )

    const renderTime = (item) => {
      return (
        <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center', flexDirection:'row'}]}>
          <View>
            <TimePicker onChange={()=>{}} disabled={editableTime}/>
          </View>
          <View>
            <TimePicker onChange={()=>{}} disabled={editableTime}/>
          </View>
      </View>
      )
    }

    const renderQR = (item) => {
      return (
        <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center'}]}>
            <TouchableOpacity onPress={() => {
              setQrData(item.qrcode)
              setQrDetail(item)
              setVisible(true)
            }}>
              <Icon type="Ionicons" name="qr-code-outline" style={{ color: colors.grayDark, fontSize:FONT_SIZE.TEXT }}/>
            </TouchableOpacity>
        </View>
      )
    }

    const renderEditable = (item) => {
      return (
        <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center'}]}>
          <View style={{flexDirection:'row'}}>
            {
              hideEdit == true ?
              null
              :
              <TouchableOpacity onPress={() => onPressEdit(item)}>
                <Icon type='SimpleLineIcons' name='note' style={{ color: colors.grayDark, fontSize:FONT_SIZE.TEXT,paddingRight:10}}/>
              </TouchableOpacity>
            }
            {
              hideDelete == true ?
              null
              :
              <TouchableOpacity onPress={() => onPressRemove(item)}>
                <Icon type="Ionicons" name="trash-outline" style={{ color: colors.grayDark, fontSize:FONT_SIZE.TEXT }}/>
              </TouchableOpacity>
            }
          </View>
        </View>
      )
    }

    const renderEditTableOnly = (item) => {
      return (
        <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center'}]}>
            {
              hideEdit == true ?
              null
              :
              <TouchableOpacity onPress={() => onPressEditOnly(item)}>
                <Icon type='SimpleLineIcons' name='note' style={{ color: colors.grayDark, fontSize:25,paddingRight:10}}/>
              </TouchableOpacity>
            }
        </View>
      )
    }

    const renderCheckbok = (item) => {
      return (
        <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center'}]}>   
          <CheckBox
            onPressStatus={(e)=> onPressSelect(item, e)} 
            SelectDefault={handleDefaultSelect(item)} 
            typeSelect={'multiSelect'} 
            disabled={viewSelectCheckbox ? true : handelSelectCheckbox(item)}
            disableType={viewSelectCheckbox ? handleDefaultSelectDis(item) : 'view'}
          />
        </View>
      )
    }

    const renderRemoveable = (item) => {
      return (
        <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center'}]}>
          <TouchableOpacity onPress={() => onPressRemove(item)}>
            <Icon type="Ionicons" name="trash-outline" style={{ color: colors.grayDark, fontSize:25 }}/>
          </TouchableOpacity>
        </View>
      )
    }

    function isNumeric(str) {
      if (typeof str != "string") return false // we only process strings!  
      return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    function formatNumber(num) {
      return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const renderTableColumn = ({item, index, drag, isActive}) => {
      return (
        <TouchableOpacity 
        style={{...styles.tableRow, 
                      backgroundColor: index % 2 == 1 ?  colors.grayTable: colors.white, 
                      borderBottomWidth: 1, 
                      borderColor:colors.gray,
                      }}
                      onLongPress={drag}
                      >
            <View style={{ flexDirection: 'row'}}>
          {selectButton ? 
             <View style={[styles.itemTable,{ alignItems:'center', justifyContent:'center'}]}>
                <Button
                    title={'select'}
                    width={50}
                      // value={index}
                    onPress={()=>onPressSelectButton(item)} 
                />
             </View>
            :
            null
            }
            {
              columnsList.map((element) => {
                if (element.key == '_Time') return renderTime(item);
                if (element.key == '_QR') return renderQR(item);
                if (element.key == '_EIDTABLE') return renderEditable(item);
                if (element.key == '_EIDTTABLEONLY') return renderEditTableOnly(item);
                if (element.key == '_Required') return renderCheckbok(item);
                if (element.key == '_removeTable') return renderRemoveable(item);

                return (
                  <View>
                    {
                      element.isColumnCenter ? 
                      <View style={styles.itemTableNumber}>
                          <Text style={styles.columnRowTxt}>{item[element.key]}</Text> 
                      </View>
                      :
                      element.isDateTimeFormat === true && item[element.key] != null ?
                      <View style={styles.itemTable}>
                        <Text style={styles.columnRowTxt}>{dayjs(item[element.key]).locale('th').format('D/M/BBBB HH:mm')}</Text> 
                      </View>
                      :
                      element.isNumberFormat === true && item[element.key] != null ?
                      <View style={styles.itemTable}>
                        <Text style={styles.columnRowTxt}>{formatNumber(item[element.key])}</Text> 
                      </View>
                      :
                      <View style={styles.itemTable}>
                            <Text style={styles.columnRowTxt}>{item[element.key]}</Text> 
                      </View>
                    }
                  </View>
                  )
              })
            }
          </View>
        </TouchableOpacity>  
      )
    }
    
      return (
        <View style={[styles.container, {marginHorizontal : spaceHorizontal}]}>
            <ScrollView horizontal={true} style={{ }}>
            {
              dragable ? <DraggableFlatList
                    contentContainerStyle={{ borderRadius: 20, overflow: 'hidden',}}
                    data={data}
                    renderItem={renderTableColumn}
                    ListHeaderComponent={tableHeader}
                    keyExtractor={(item, index) => `draggable-item-${index}`}
                    onDragEnd={({ data }) => onDragend(data)}
                    stickyHeaderIndices={[0]}
                    activationDistance={1}
                />
              :
              <FlatList 
                  contentContainerStyle={{ borderRadius: 20, overflow: 'hidden'}}
                  data={data}
                  keyExtractor={(item, index) => index+""}
                  ListHeaderComponent={tableHeader}
                  stickyHeaderIndices={[0]}
                  renderItem={renderTableColumn}
              />
            }
            </ScrollView>
            {
              !data.length&&<View><Text>ไม่พบข้อมูล</Text></View>
            }
            {
              nopage ?
              null
              :
              <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',  paddingRight: 60, paddingLeft:30, flexWrap: 'wrap' }}>
                  <View style={{ flex: 1, flexBasis: '100%' }}>
                      <Text>
                          {`แสดง ${recordDetail.recordStart || 0} ถึง ${data.length ? ((page) * 10) + data.length : 0} ของ ${recordDetail.totalRecords || 0} รายการ`}
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
                      <View style={{ width: 70, height: 50 }}>
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
                                      <Icon type="SimpleLineIcons" name="arrow-down" style={{alignItems:'center',color:colors.grayDark,fontSize:15, marginLeft: 10}}/>
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
                                  {
                                    isShowFullTable ?
                                    <DefaultModal transparent={true} visible={isShowFullTable == true && visiblePageSelect == true}>
                                      <ScrollView
                                        horizontal
                                        style={{
                                            // width: windowHeight, height: windowWidth,
                                            width: windowHeight - (windowHeight * 0.4),
                                            transform: [{ rotate: '90deg' }],
                                            // paddingTop: 490,
                                            // paddingLeft: 1150,
                                            // paddingTop: 600,
                                            // paddingLeft: 600,
                                            marginTop: windowHeight,
                                            // height: '102%',
                                            height: windowWidth - (windowWidth * 0.4),
                                            // paddingBottom: -10,
                                            position: 'absolute',
                                            zIndex: 1,
                                            flexDirection: "row",
                                            backgroundColor: 'rgba(52, 52, 52, 0.8)',
                                        }}>
                                        <ScrollView style={{ backgroundColor: colors.white, borderWidth: 0.3, borderColor: colors.gray }}>
                                          {
                                            nubmerPageArray.map((page, index) => {
                                              return <Menu.Item onPress={() => {
                                                  onPageChange(page)
                                                  closeMenu()
                                              }} title={page + 1} />
                                            })
                                          }
                                        </ScrollView>
                                      </ScrollView>
                                    </DefaultModal>
                                    :
                                    null

                                  }
                              </ScrollView>
                          </Menu>
                      </View>
                  </View>
              </View>
            }
            <Modal visible={visible} onPressCancel={() => setVisible(false)} title={'QR'}>
            <ViewShot 
                  ref={el => inputRef.viewShot = el}
               options={{ format: "jpg", quality: 0.9 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop:'5%', marginBottom:'5%', backgroundColor: 'white', padding: '2%' }}>
                <QRCode
                  getRef={(c) => setSvg(c)}
                  value={qrData}
                  size={STYLE_SIZE.QR_SIZE}
                />
                <View style={{marginTop: '5%', marginHorizontal: '10%'}}>
                  <Text style={{fontWeight: 'bold', fontSize: FONT_SIZE.TEXT}}>ชื่อลูกค้า  :  {qrDetail.custNameTh}</Text>
                  <Text style={{fontWeight: 'bold', fontSize: FONT_SIZE.TEXT}}>ประเภทผลิตภัณฑ์  :  {qrDetail.gasNameTh}</Text>
                  <Text style={{fontWeight: 'bold', fontSize: FONT_SIZE.TEXT}}>ตู้น้ำมัน  :  {qrDetail.dispenserNo}</Text>
                  <Text style={{fontWeight: 'bold', fontSize: FONT_SIZE.TEXT}}>มือจ่ายที่  :  {qrDetail.nozzleNo}</Text>
                </View>
              </View>
            </ViewShot>
            <TouchableOpacity style={{alignSelf:'flex-end', marginHorizontal:'15%', marginBottom:'5%'}} onPress={() => {
              onShare(qrData)
              onPressCap()
              }}>
                <View style={{justifyContent:'center'}}>
                  <View style={{alignSelf:'center'}}>
                    <Icon type='Ionicons' name='share-outline' style={{fontSize:STYLE_SIZE.ICON_SIZE_THRR}}/>
                  </View>
                  <View style={{alignSelf:'center'}}>
                    <Text>Share</Text>
                  </View> 
                </View>
              </TouchableOpacity>
            </Modal>
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
        width: 180,
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
        width: 180,
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
        width: 180,
        alignItems:'center'
    },
    });
    

export default Table;
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'

import { CardCarousel, ContactInfo, Text, Button, ModalWarning, Modal, TextInput, SearchInput } from '../../../components';
import { FONT_SIZE } from '../../../utility/enum';
import colors from '../../../utility/colors';
import language from '../../../language/th.json';
import { getInputData, resetInputData } from '../../../utility/helper';
import { getProspectContact, addContact, updContact, cancelContact, actionClearPros } from '../../../actions/prospectAction';

const SubmenuContect = () => {

    const {prospectSelectInfoReducer} = useSelector((state) => state);
    const {prospectReducer} = useSelector((state) => state);
    const [indexContact, setIndexContact] = useState(0);
    const inputRef = useRef({});
    const dispatch = useDispatch();

    let getCarousel = useRef({});

    //madal
    const [modalVisibleAdd, setmodalVisibleAdd] = useState(false);
    const [modalVisibleAddSuccess, setmodalVisibleAddSuccess] = useState(false);
    const [editDeteil, setEditDetail] = useState(false);   
    const [modalVisibleEditSuccess, setmodalVisibleEditSuccess] = useState(false);
    const [modalVisibleDelete, setmodalVisibleDelete] = useState(false);
    const [modalVisibleDeleteSuccess, setmodalVisibleDeleteSuccess] = useState(false);
    const [Filtered, setFiltered] = useState('');
    const [modalVisibleError, setmodalVisibleError] = useState(false);
    const [isCustomer,setIsCustomer] = useState(prospectSelectInfoReducer.dataSelect.isCustomer ? true : false);
    const [isRentStation,setIsRentStation] = useState(prospectSelectInfoReducer.dataSelect.isRentStation ? true : false);
    const [isOther,setIsOther] = useState(prospectSelectInfoReducer.dataSelect.isOther ? true : false);
    const [isRecommandBUProspect,setIsRecommandBUProspect] = useState(prospectSelectInfoReducer.dataSelect.isRecommandBUProspect ? true : false);
    const [showItem, setShowItem] = useState(null);

    useEffect(() => {
        dispatch(getProspectContact(prospectSelectInfoReducer.dataSelect.prospectContact))
    }, [])

    useEffect(() => {
        if (prospectReducer.contactProspect) {
            setShowItem(prospectReducer.contactProspect[0])
            setFiltered(prospectReducer.contactProspect);
        }
    }, [prospectReducer.contactProspect])

    useFocusEffect(
        React.useCallback(() => {
                // if(inputRef) resetInputData(inputRef);
                dispatch(getProspectContact(prospectSelectInfoReducer.dataSelect.prospectContact));
                if (getCarousel) getCarousel.getCarouselData()
            return () => {
                inputRef.current.nameContact.clear();
                setFiltered('')
            };
        }, [])
    );

    useEffect(() => {
        if (prospectReducer.addContactPropectSuucess) {
            setTimeout(() => {
                dispatch(getProspectContact(prospectSelectInfoReducer.dataSelect.prospectContact))
            }, 500)
        };

        // if (prospectReducer.removeContactPropectSuucess) {
        //     setTimeout(() => {
        //         dispatch(getProspectContact(prospectSelectInfoReducer.dataSelect.prospectContact))
        //     }, 500)
        // };

        if (prospectReducer.addContactPropectSuucess && !prospectReducer.addContactPropectError) {
            setmodalVisibleAddSuccess(true)
        };

        if (prospectReducer.addContactPropectSuucess && prospectReducer.addContactPropectError)  {
            setmodalVisibleError(true)
        };

        if (prospectReducer.updContactPropectSuucess && !prospectReducer.updContactPropectError) {
            if(inputRef) resetInputData(inputRef);
            setmodalVisibleEditSuccess(true);
            // setFiltered(prospectReducer.contactProspect);
        };

        if (prospectReducer.updContactPropectSuucess && prospectReducer.updContactPropectError)  {
            setmodalVisibleError(true)
        };

        if (prospectReducer.removeContactPropectSuucess && !prospectReducer.removeContactPropectError) {
            setmodalVisibleDeleteSuccess(true) 
        }; 

        if (prospectReducer.removeContactPropectSuucess && prospectReducer.removeContactPropectError)  {
            setmodalVisibleError(true)
        };

    }, [prospectReducer, prospectReducer.addContactPropectSuucess, prospectReducer.removeContactPropectSuucess])

    useEffect(() => {
        setEditDetail(false);
    }, [indexContact])

    // select edit button
    const onPressEdit = (event) => {
        setEditDetail(event);
    };

    // search contact
    const handleSearch = () => {
        let totalValue = getInputData(inputRef);
        let search = totalValue.data.nameContact.name;
        
        if (search !== '') {
            const newList = prospectReducer.contactProspect.filter((item) => {
                const lcFirstname = item.firstName.toLowerCase()
                const lcLastname = item.lastName.toLowerCase()
                const filter = search.toLowerCase()
                return lcFirstname.includes(filter) || lcLastname.includes(filter)
            })
            setIndexContact(0);
            setFiltered(newList)
            if (newList.length) {
                setShowItem(newList[0])
            } else {
                setShowItem(null)
            }
        } else {
            setIndexContact(0);
            setFiltered(prospectReducer.contactProspect)
            if (prospectReducer.contactProspect.length) {
                setShowItem(prospectReducer.contactProspect[0])
            }
        }
        getCarousel.getCarouselData(); 
    };
    
    //madal add
    const onPressModalAdd = (event) => {
        setmodalVisibleAdd(event);
        setmodalVisibleAddSuccess(false);
    };

    const onPressModalAddSucess = (event) => {
        setmodalVisibleAddSuccess(event);
        setmodalVisibleAdd(false);
        getCarousel.getCarouselData()  
    };

    const handleConfirm = () => {
        let totalValue = getInputData(inputRef);
        let prospectContact = prospectSelectInfoReducer.dataSelect.prospectContact;

        if (!totalValue.isInvalid && prospectContact) {
            dispatch(addContact(totalValue.data, prospectContact));
        }
    };

    //madal edit
    const onPressModalEditSuccess = (event) => {
        setmodalVisibleEditSuccess(event);
        setEditDetail(false);
        let totalValue = getInputData(inputRef);
        
        let search = totalValue.data.nameContact.name;

        if (search !== '') {
            if (inputRef.current.nameContact) inputRef.current.nameContact.clear();
            dispatch(getProspectContact(prospectSelectInfoReducer.dataSelect.prospectContact))
        } else {
            dispatch(getProspectContact(prospectSelectInfoReducer.dataSelect.prospectContact))
        }
        getCarousel.getCarouselData()
    }

    const handleSave = () => {
        let totalValue = getInputData(inputRef);
        let data = totalValue.data.contactInfo;
        // let prospectContact = prospectReducer.contactProspect[indexContact];
        let prospectContact = showItem;

        if (!totalValue.isInvalid && prospectContact) {
            dispatch(updContact(data, prospectContact));
        }
    };

    //madal delete
    const onPressModalDelete = (event) => {
        setmodalVisibleDelete(event);
        setmodalVisibleDeleteSuccess(false);
    };

    const onPressModalDeleteSuccess = (event) => {
        setmodalVisibleDeleteSuccess(event);
        setmodalVisibleDelete(false);  
        getCarousel.getCarouselData(); 
        dispatch(getProspectContact(prospectSelectInfoReducer.dataSelect.prospectContact))
    };

    const handleDelete = () => {
        let prospectContact = prospectReducer.contactProspect[indexContact];

        if (prospectContact) {
            dispatch(cancelContact(prospectContact));
        }
    };

    const onPressError = (event) => {
        setmodalVisibleError(event)
    };

    //name prospect
    const getTitle = () => {
        if (!prospectSelectInfoReducer.dataSelect) return ''

        return prospectSelectInfoReducer?.dataSelect?.prospectAccount?.accName || ''
    };

    const handleButton = () => {
        if (isCustomer) return false
        if (isRentStation) return true
        if (isOther) return false
        if (isRecommandBUProspect) return false

        return true
    };

    const getRefFunction = (el) => {
        if (!el) return
        el ? setIndexContact(el.getIndexNumber().dataIndex) : 0
        getCarousel = el
    };

    return (
        <View style={{flex: 1, backgroundColor: colors.white}}>
            <ScrollView>
                <View style={styles.topLabel}>
                    <View style={{flex: 1, marginLeft: '5%', marginTop: '5%'}}>
                        <Text style={{fontSize: FONT_SIZE.HEADER, fontWeight:'bold'}}>{getTitle()}</Text>
                    </View>
                    {
                        handleButton() && <View style={{flex: 1, alignItems: 'flex-end', marginRight: '3%'}}>
                            <Button
                                onPress={()=> onPressModalAdd(true)}
                                width={'25%'}
                                typeIcon={'Ionicons'}
                                nameIcon={'add-outline'}
                                title={'Add'}/>
                            <Modal
                                visible={modalVisibleAdd}
                                onPressCancel={()=> onPressModalAdd(false)}
                                title={'Add'}
                                >
                                <View style={{margin: '5%'}}>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{flex: 1}}>
                                            <Text style={{fontSize: FONT_SIZE.SUBTITLE}}>รายละเอียด</Text>
                                        </View>
                                        <View style={{alignItems: 'flex-end'}}>
                                            <Button 
                                                onPress={()=> handleConfirm(true)}
                                                title={'Confirm'}
                                                typeIcon={'MaterialIcons'}
                                                nameIcon={'done'}
                                                width={'70%'}
                                                margin={0}/>
                                            <ModalWarning
                                                visible={modalVisibleAddSuccess}
                                                detailText={language.ADDSUCCESS}
                                                onlyCloseButton={true}
                                                onPressClose={()=> onPressModalAddSucess(false)}/>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingVertical: '3%'}}>
                                        <View style={{flex: 1, marginEnd: "2%"}}>
                                            <TextInput 
                                                title={'ชื่อ'}
                                                ref={el => inputRef.current.firstName = el}
                                                maxLength={250}
                                                REQUIRETITLE
                                                require
                                                massageError={language.NAME}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginStart: "2%"}}>
                                            <TextInput 
                                                title={'นามสกุล'}
                                                ref={el => inputRef.current.lastName = el}
                                                maxLength={250}
                                                REQUIRETITLE
                                                require
                                                massageError={language.SURNAME}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingVertical: '3%'}}>
                                        <View style={{flex: 1, marginEnd: "2%"}}>
                                            <TextInput 
                                                title={'เบอร์โทรศัพท์'}
                                                ref={el => inputRef.current.phoneNo = el}
                                                maxLength={100}
                                                type={"ThaiEnNum"}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginStart: "2%"}}>
                                            <TextInput 
                                                title={'เบอร์แฟกซ์'}
                                                ref={el => inputRef.current.faxNo = el}
                                                maxLength={10}
                                                typeKeyboard={'numeric'}
                                                type={"Num"}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', paddingVertical: '3%'}}>
                                        <View style={{flex: 1, marginEnd: "2%"}}>
                                            <TextInput 
                                                title={'เบอร์โทรศัพท์มือถือ'}
                                                ref={el => inputRef.current.mobileNo = el}
                                                maxLength={10}
                                                typeKeyboard={'numeric'}
                                                type={"Num"}
                                            />
                                        </View>
                                        <View style={{flex: 1, marginStart: "2%"}}>
                                            <TextInput 
                                                title={'อีเมล'}
                                                ref={el => inputRef.current.email = el}
                                                maxLength={250}
                                                type={'email'}
                                                massageError={language.EMAIL}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    }  
                    
                </View> 

                <View style={{flex: 1,alignSelf: 'center', marginBottom: '3%', marginHorizontal: '3%'}}>
                    <SearchInput  
                        SearchBarType ={'SearchBarButton'}
                        // widthSearchBox={'30%'} 
                        // SearchBarWidth={'70%'}
                        // buttonWidth={'70%'}
                        onPressSearch={() => handleSearch()} 
                        ref={el => inputRef.current.nameContact = el}
                    />
                </View>
                {prospectReducer.contactProspect && prospectReducer.contactProspect.length == 0 ?
                    <View style={{alignSelf:'center', marginTop:'3%'}}>
                        <Text style={{fontSize:FONT_SIZE.LITTLETEXT}}> </Text>
                    </View>
                    :
                    <CardCarousel showItem={setShowItem} isContect={true} data={Filtered || prospectReducer.contactProspect}  
                        ref={el => getRefFunction(el) }
                    />
                }    
                {Filtered && Filtered.length === 0 ? 
                    <View style={{alignSelf:'center', marginTop:'5%'}}>
                        <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>ไม่พบข้อมูล</Text>
                    </View>
                    :
                    null
                }           
                <View style={{backgroundColor: colors.white, marginTop: '0%'}}>
                    {Filtered && Filtered.length === 0 ? 
                        null
                        :
                        <ContactInfo 
                            textTitle={'รายละเอียด'} 
                            editable={editDeteil} 
                            indexContact={indexContact} 
                            ref={el => inputRef.current.contactInfo = el}
                            contactTab={showItem || (Filtered[indexContact] || [])} 
                        />  
                    }      

                {
                    showItem && showItem.mainFlag != "Y" ?
                    handleButton() && <View style={{ flex: 1, flexDirection: 'row' , justifyContent: 'center', marginHorizontal: "2%" }}>
                        <View style={styles.buttonLow}>
                            <Button
                                onPress={()=> onPressModalDelete(true)}
                                width={'100%'}
                                title={'Delete'}
                                fontColor={colors.redButton}
                                color={colors.white}
                                colorBorder={colors.redButton}/>
                            <ModalWarning
                                visible={modalVisibleDelete}
                                detailText={language.DELETE}
                                onPressCancel={()=> onPressModalDelete(false)}
                                onPressConfirm={()=> handleDelete()}/>
                            <ModalWarning
                                visible={modalVisibleDeleteSuccess}
                                detailText={language.DELETESUCCESS}
                                onlyCloseButton={true}
                                onPressClose={()=> onPressModalDeleteSuccess(false)}/>
                        </View>
                        <View style={styles.buttonLow}>
                            <Button
                                onPress={()=> onPressEdit(true)}
                                width={'100%'}
                                title={'Edit'}
                                fontColor={colors.primary}
                                color={colors.white}/>
                        </View>
                        <View style={styles.buttonLow}>
                            <Button
                                onPress={()=> handleSave()}
                                width={'100%'}
                                title={'Save'}
                                disabled={!editDeteil}/>
                            <ModalWarning
                                visible={modalVisibleEditSuccess}
                                detailText={language.EDITSUCCESS}
                                onlyCloseButton={true}
                                onPressClose={()=> onPressModalEditSuccess(false)}/>
                        </View>
                    </View>
                    :
                    null
                }

                </View>
            </ScrollView> 
            <ModalWarning
                visible={modalVisibleError}
                onPressClose={()=> onPressError(false)}
                WARNINGTITLE
                onlyCloseButton
                detailText={prospectReducer.contactErrorMSG}
            />     
        </View>
    )
}

const styles = StyleSheet.create({
    topLabel: {
        width: '100%',
        flex: 1,
        alignItems: 'stretch'
    },
    buttonLow: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: '2%',
        marginBottom: '10%'
    },
})

export default SubmenuContect;
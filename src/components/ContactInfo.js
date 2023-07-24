import React, {useRef, useImperativeHandle, forwardRef} from 'react';
import { View, StyleSheet } from 'react-native';

import TextInput from './TextInput'
import Text from './Text'

import colors from '../utility/colors'
import { FONT_SIZE } from '../utility/enum';
import { getInputData, resetInputData } from '../utility/helper';
import language from '../language/th.json'

const contactInfo = ({  textTitle = 'Contact Info', 
                        textDetail = 'New Account', 
                        CREATEPROSPECT= false, 
                        editable=true, 
                        basicTab,
                        contactTab,
                        saTab,
                        indexContact = 0
                    }, ref) => {

    const inputRef = useRef({});

    useImperativeHandle(ref, () => ({
        getInputValue() {
            let totalValue = getInputData(inputRef, 'C');
            return { isInvalid: totalValue.isInvalid, value: totalValue, isChange: totalValue.isChange };
        },
        resetValue() {
            resetInputData(inputRef);
        },
        clear() {
            setIsError(false);
            setEerrorMessage('');
            setText('');
        },
    }));

    const getValue = (key) => {

        if (basicTab) {
            return basicTab[key]
        }

        if (saTab) {
            return saTab[key]
        }

        if (contactTab) {
            try {
                return contactTab[key]

            } catch {
                return contactTab[key]
            }
        }

        return ''
    }

    const detTypeEmail = () => {
        if (CREATEPROSPECT) {
            return "email";
        }
        if (basicTab) {
            return "email";
        }
        if (contactTab && editable ) {
            return "email";
        }

        return ''
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{backgroundColor: colors.white, paddingBottom: '10%'}}>
                {/* Contact Info */}
                <View style={styles.titleLabel}>
                    <View style={styles.title}>
                        <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight:'bold' }}>{textTitle}</Text>
                    </View>
                    {
                    CREATEPROSPECT ?
                        <View style={styles.title}>
                            <Text style={{ fontSize: FONT_SIZE.TITLE, fontWeight:'bold' }}>{textDetail}</Text>
                        </View>
                    :
                        null
                    }
                    
                        <View style={styles.input}>
                            <TextInput 
                                title={'ชื่อ'}
                                value={getValue('firstName')}
                                ref={el => inputRef.current.firstName = el}
                                editable={editable}
                                maxLength={250}
                                REQUIRETITLE={contactTab ? true : false}
                                require={(contactTab ? (editable ? true : false) : false)}
                                massageError={language.NAME}
                                placeholder={editable == false ? '-' : ''}
                            />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                                title={'นามสกุล'}
                                value={getValue('lastName')}
                                ref={el => inputRef.current.lastName = el}
                                editable={editable}
                                maxLength={250}
                                REQUIRETITLE={contactTab ? true : false}
                                require={(contactTab ? (editable ? true : false) : false)}
                                massageError={language.SURNAME}
                                placeholder={editable == false ? '-' : ''}
                            />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                                title={'เบอร์โทรศัพท์'}
                                editable={editable}
                                value={getValue('phoneNo')}
                                ref={el => inputRef.current.phoneNo = el}
                                maxLength={100}
                                type={"ThaiEnNum"}
                                placeholder={editable == false ? '-' : ''}
                            />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                                title={'เบอร์แฟกซ์'}
                                editable={editable}
                                value={getValue(basicTab ? 'contactFaxNo' : contactTab ? 'faxNo' : saTab ? 'faxNo' : '')}
                                ref={el => inputRef.current.faxNo = el}
                                maxLength={10}
                                typeKeyboard={'numeric'}
                                type={"Num"}
                                placeholder={editable == false ? '-' : ''}
                            />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                                title={'เบอร์โทรศัพท์มือถือ'}
                                editable={editable}
                                value={getValue('mobileNo')}
                                ref={el => inputRef.current.mobileNo = el}
                                maxLength={10}
                                typeKeyboard={'numeric'}
                                type={"Num"}
                                placeholder={editable == false ? '-' : ''}
                            />
                        </View>
                        <View style={styles.input}>
                            <TextInput 
                                title={'อีเมล'}
                                editable={editable}
                                value={getValue('email')}
                                ref={el => inputRef.current.email = el}
                                maxLength={250}
                                type={detTypeEmail()}
                                massageError={language.EMAIL}
                                placeholder={editable == false ?  '-' : ''}
                            />
                        </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleLabel: {
        flex: 1,
        justifyContent: 'center',
        padding: '5%'
    },
    title: {
        paddingVertical: '2%',
    },
    rowLabel: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    input: {
        flex: 1 / 2,
        paddingVertical: '2%'
    },
})

export default forwardRef(contactInfo);
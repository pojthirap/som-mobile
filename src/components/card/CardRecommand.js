import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'native-base';
import { useSelector} from 'react-redux'; 

import Text from '../Text'
import colors from '../../utility/colors'
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';

const CardRecommand = ({data, onRemove}) =>{

    const {prospectSelectInfoReducer,prospectReducer} = useSelector((state) => state);

    const Card = (data) =>{
        return(
        <View style={styles.container}>
            <View style={{flexDirection:'row',marginHorizontal:'3%',marginBottom: '5%'}}>
                <View style={[styles.iconBeforTextinput,styles.styleShadow]} />
                    <View style={[styles.inputbox,styles.styleShadow]}>
                        <Text style={{fontSize: FONT_SIZE.LITTLETEXT,fontWeight:'bold'}} numberOfLines={1}>{data.item.buNameTh}</Text>
                    </View>
                    <View style={[styles.BorderEndTextinput,styles.styleShadow]}>
                        {prospectSelectInfoReducer.dataSelect.isProspect ? 
                            <TouchableOpacity  onPress={()=>onRemove(data)}>
                                <Icon type="MaterialCommunityIcons" name="close" style={{fontSize: STYLE_SIZE.ICON_SIZE_SMALL,color: colors.grayDark}}/>
                            </TouchableOpacity>
                            : 
                            null
                        }
                    </View>
            </View>
        </View>
        )
    }
    return(
        <>
        {prospectReducer.dataSubReccomentBU.records != 0 ? 
            <FlatList
                data={data}
                renderItem={(data)=> Card(data)}
                numColumns={2}
                keyExtractor={(item, index) => index}
            /> 
        :
            <View style={{alignSelf:'center', marginTop:40}}>
                <Text style={{fontSize: FONT_SIZE.LITTLETEXT}}>ไม่พบข้อมูล</Text>
            </View>
        }
           
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1/2,
        alignItems: 'center'
    },
    styleShadow: {
        shadowOffset: {
            height: 3,
            width: 5
        },
        shadowRadius: 20,
        shadowOpacity: 0.2,
        shadowColor: colors.gray,
        elevation: 10,
      },
      inputbox: {
        backgroundColor: colors.grayborder,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginTop: 5,
        height: 60,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBeforTextinput: {
        backgroundColor: colors.grayborder,
        borderStartWidth: 1, 
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        borderTopLeftRadius: 20, 
        borderBottomLeftRadius: 20,
        height: 60,
        marginTop: 5,
        width: 20
    },
    BorderEndTextinput: {
        backgroundColor: colors.grayborder,
        borderTopRightRadius: 20, 
        borderBottomRightRadius: 20, 
        borderEndWidth: 1, 
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.grayborder,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 60,
        marginTop: 5
    }

});
export default CardRecommand;
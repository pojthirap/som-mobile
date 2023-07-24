import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Icon } from 'native-base'

import  Text  from '../Text';
import colors from '../../utility/colors';
import { scrollInterpolator, animatedStyles } from '../../utility/animation';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH / 1.9)
const CONTECT_WIDTH = Math.round(SLIDER_WIDTH / 1.4)

const CardCarousel = ({ isAddress = false,
                        isSaleData = false,
                        isContect = false, 
                        showItem,
                        data,
                        mainAddressFlagYes,
                    },ref ) => {

    const [dataIndex, setdataIndex] = useState('');
    let getCarousel = useRef({});

    useImperativeHandle(ref, () => ({
        getCarouselData() {
            if (!getCarousel)  return
            getCarousel.snapToItem(0);
        },
        getIndexNumber() {
            return {dataIndex}
        },
        clear() {
          setIsError(false);
          setEerrorMessage('');
          setText('');
        },
    }));

    useEffect(() => {
        if (!getCarousel)  return
        getCarousel.snapToItem(0);
    }, [data])
    
    const Card = (items) =>{
        return(
            <View style={[styles.container, {justifyContent: 'center'}]}>
                <Image
                source={
                    isAddress ? 
                    require('../../assets/images/Group37.png')
                    : 
                    isSaleData ?
                    require('../../assets/images/Group50.png')
                    :
                    isContect ?
                    require('../../assets/images/Group40.png')
                    :
                    null
                }
                style={{width: isAddress ? '100%' : '100%', borderRadius: 30, maxHeight: isAddress || isSaleData ? 200 : 180}}
            />
            <View style={[styles.cardArea, {marginVertical: '2%', width: '100%'}]}>
                <View style={{alignItems:'flex-start',marginVertical:'2%',marginHorizontal:'5%'}}>
                    {isAddress ?
                        <View style={{paddingHorizontal:'5%', marginTop:'2%'}}>
                            <Text style={{color:colors.white,fontSize: FONT_SIZE.LITTLETEXT, fontWeight:'bold'}} numberOfLines={2}>{items.item.addressFullName}</Text> 
                        </View>
                    :
                    isSaleData ?
                        <View style={{paddingHorizontal:'5%', marginTop:'2%'}}>
                            <Text style={{color:colors.white,fontSize:FONT_SIZE.LITTLETEXT, fontWeight:'bold'}}>{items.item.orgNameTh}</Text> 
                        </View>
                    :
                    isContect ?
                        <View style={{paddingHorizontal:'5%', marginTop:'2%', width: '100%'}}>
                            <Text style={{color:colors.white,fontSize:FONT_SIZE.LITTLETEXT, fontWeight:'bold'}} numberOfLines={1}>{items.item.firstName} {items.item.lastName}</Text> 
                        </View>      
                    :
                    null
                    }  
                </View> 
                    <View style={{flexDirection:'row',justifyContent: 'flex-start',
                                  marginHorizontal:isAddress || isContect ?'5%' : null,
                                  paddingBottom: isAddress || isContect ? '2%': null
                                  }}>                   
                        <View style={{flexDirection:'row',marginRight: isAddress || isContect ? '5%':'10%',paddingBottom: isSaleData ? 10 : null, flex: 1, justifyContent: isAddress ? 'center' : 'flex-start', alignItems: 'center',marginLeft:10}}>
                            <View style={{paddingLeft: isAddress || isContect ?'1%' : '20%',alignSelf: 'center', marginRight: isAddress || isContect ?'5%' : '10%'}}>
                                {isSaleData ?
                                    <Icon type="Ionicons" name="podium-outline" style={{color:colors.white, fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}/>
                                :
                                    <Icon type="SimpleLineIcons" name="phone" style={{color:colors.white, fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}/>
                                }
                            </View>
                            <View style={{alignSelf:'center'}}>
                                {isAddress ?
                                    items.item.tellNo ?
                                        <Text style={{color:colors.white,fontSize: 22}}>{items.item.tellNo}</Text>
                                    :
                                        <Text style={{color:colors.white,fontSize: 22}}> - </Text>
                                :
                                isContect ?
                                    items.item.phoneNo ?
                                        <Text style={{color:colors.white,fontSize: 20}} numberOfLines={1}>{items.item.phoneNo}</Text>
                                    :
                                        <Text style={{color:colors.white,fontSize: 20}} numberOfLines={1}> - </Text>
                                :
                                isSaleData ?
                                items.item.channelNameTh ?
                                        <Text style={{color:colors.white,fontSize:25}} numberOfLines={1}>{items.item.channelNameTh}</Text>
                                    :
                                        <Text style={{color:colors.white,fontSize:25}}> - </Text>
                                :
                                null
                                }
                            </View>      
                        </View>
                        <View style={{flexDirection:'row',marginRight:'5%', flex: 1, justifyContent: isAddress ? 'center' : 'flex-start', alignItems: 'center'}}>
                            <View style={{paddingLeft:'1%',alignSelf:'center', marginRight: isAddress || isContect ?'5%' : '5%'}}>
                                {isAddress || isContect ?
                                    <Icon type="SimpleLineIcons" name="printer" style={{color:colors.white,fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}/>
                                :
                                null
                                }    
                            </View>
                            <View>
                                {isAddress || isContect ?
                                    items.item.faxNo ?
                                        <Text style={{color:colors.white,fontSize:isContect ? 20 : 22}} numberOfLines={1}>{items.item.faxNo}</Text>
                                    :
                                        <Text style={{color:colors.white,fontSize:isContect ? 20 : 22}} numberOfLines={1}> - </Text>
                                :
                                null
                                }  
                            </View>      
                        </View>
                    </View>        
                    <View style={{flexDirection:'row',justifyContent: 'flex-start',
                                    marginHorizontal:isAddress || isContect ?'5%' : null,
                                    paddingBottom: isAddress || isContect ? '2%': null
                                }}>
                        { isAddress || isSaleData ?
                            null
                        :
                        <View style={{flexDirection:'row',marginRight: isAddress || isContect ? '5%':'10%',paddingBottom: isSaleData ? 10 : null, flex: 1, justifyContent: isAddress ? 'center' : 'flex-start', alignItems: 'center',marginLeft:10}}>
                                <View style={{paddingLeft:'1%',alignSelf:'center', marginRight: '5%'}}>
                                    <Icon type="SimpleLineIcons" name="screen-smartphone" style={{color:colors.white,fontSize:18}}/>
                                </View>
                                <View>
                                    {items.item.mobileNo ?
                                        <Text style={{color:colors.white,fontSize:20}} numberOfLines={1}>{items.item.mobileNo}</Text>
                                    :
                                        <Text style={{color:colors.white,fontSize:20}} numberOfLines={1}> - </Text>
                                    }
                                </View> 
                            </View>
                        } 
                        { isAddress || isSaleData ?
                            null
                        :
                            <View style={{flexDirection:'row', marginRight:'5%', flex: 1, alignItems: 'center'}}>
                                <View style={{paddingLeft:'1%',alignSelf:'center', marginRight: '5%'}}>
                                    <Icon type="SimpleLineIcons" name="envelope" style={{alignItems:'center',color:colors.white,fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}/>
                                </View>
                                <View>
                                    {items.item.email ?
                                        <Text style={{color:colors.white,fontSize:20}} numberOfLines={1}>{items.item.email}</Text>
                                    :
                                        <Text style={{color:colors.white,fontSize:20}} numberOfLines={1}> - </Text>
                                    }
                                </View> 
                            </View>
                        }                           
                    </View>                       
    
                    <View style={{flex:1,borderBottomWidth:0.5, borderColor:colors.white, width:'90%', alignSelf:'center',marginBottom:'3%'}} />
                    
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginHorizontal:'5%'}}>
                            {isAddress ?
                                <>  
                                <View>
                                    <Text style={{color:colors.white,fontSize:22}}>Ship To</Text>
                                    {items.item.shiftToFlag == 1 ?
                                        <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}>Yes</Text>  
                                    :
                                        <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}> - </Text>  
                                    }           
                                </View>
                                <View>
                                    <Text style={{color:colors.white,fontSize:22}}>Bill To</Text>
                                    {items.item.billToFlag == 1 ?
                                        <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}>Yes</Text>  
                                    :
                                        <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}> - </Text>  
                                    }           
                                </View>  
                                <View>
                                    <Text style={{color:colors.white,fontSize:22}}>Main</Text>
                                    {items.item.mainAddressFlag == 1 ?
                                        <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}>Yes</Text>  
                                    :
                                        <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}>{mainAddressFlagYes}</Text>  
                                    }           
                                </View> 
                                </>
                                :
                                isSaleData ?
                                <View style={{marginHorizontal:'3%', flex: 1}}>
                                    <View style={{flexDirection:'row', flex: 1}}>
                                        <View style={{marginRight: '3%'}}>
                                            <Text style={{color:colors.white, fontSize:22}}>Division</Text>
                                        </View>
                                        {items.item.divisionNameTh ?
                                            <View style={{flex: 1}}>
                                                <Text style={{color:colors.white,fontSize:22, fontWeight:'bold',width:40}} numberOfLines={1}>{items.item.divisionNameTh}</Text>  
                                            </View>
                                        :
                                            <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}> - </Text>  
                                        }           
                                    </View>
                                    <View style={{flexDirection:'row', flex: 1}}>
                                        <View style={{marginRight: '3%'}}>
                                            <Text style={{color:colors.white, fontSize:22}}>Sales Office</Text>
                                        </View>
                                        {items.item.officeNameTh ?
                                            <View style={{flex: 1}}>
                                                <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}} numberOfLines={1}>{items.item.officeNameTh}</Text>
                                            </View>
                                        :
                                            <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}> - </Text>  
                                        }           
                                    </View>  
                                    <View style={{flexDirection:'row', flex: 1}}>
                                        <View style={{marginRight: '3%'}}>
                                            <Text style={{color:colors.white, fontSize:22}}>Sales Group</Text>
                                        </View>
                                        {items.item.groupNameTh ?
                                            <View style={{flex: 1}}>
                                                <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}} numberOfLines={1}>{items.item.groupNameTh}</Text>  
                                            </View>
                                        :
                                            <Text style={{color:colors.white,fontSize:22, fontWeight:'bold'}}> - </Text>  
                                        }           
                                    </View>      
                                </View>
                                :
                                null
                            }
                        </View>
                    </View>     
            </View>
        )
    }

    
    return(
        <Carousel
            ref={el => getCarousel = el}
            activeSlideOffset={1}
            data={data}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={isContect ? CONTECT_WIDTH : ITEM_WIDTH}
            useScrollView={true}  
            enableSnap = {true}
            enableMomentum
            lockScrollTimeoutDuration={5000}
            lockScrollWhileSnapping
            // loop = {true}
            scrollInterpolator={scrollInterpolator}
            slideInterpolatedStyle={animatedStyles}
            onBeforeSnapToItem={slideIndex => {
                // showItem(data[slideIndex])
                if (showItem) showItem(data[slideIndex])
                if (setdataIndex) setdataIndex(slideIndex)
            }}
            // ref={'carousel'}
            renderItem={(items, index) => <View style={{ marginHorizontal: isContect ? '5%':'7%', marginBottom:30}}>{Card (items)}</View>}
            // activeSlideOffset={1}
            // lockScrollWhileSnapping={true}
        />
        )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        height: 200
    },
    cardArea: {
        position:'absolute',
    },
});

export default forwardRef(CardCarousel) ;
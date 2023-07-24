import React, {useState} from 'react';
import { View, Image, TouchableOpacity,Dimensions } from 'react-native';
import { Icon } from 'native-base';
import Share from 'react-native-share';
import ImageView from 'react-native-image-view';
import RNFetchBlob from 'rn-fetch-blob'

import Text from '../Text'
import DownloadFile from '../DownloadFile';
import colors from '../../utility/colors';
import { FONT_SIZE, STYLE_SIZE } from '../../utility/enum';
import { baseUrl } from '../../api/Axios';

const {width} = Dimensions.get('window')

const tabAttachDetail = ({name, userBy, sizeFile, type, img, data}) => {
    const [modalVisible, setmodalVisible] = useState(false);
    const [image, setImage] = useState();

    const onPressModal = (event) => {
        setmodalVisible(event);
    }
    
    const onShare = () => {
    callback(image[0].source.uri)
    }
    const callback = (dataURL) => {
    let imagePath = null;

    if (dataURL) {
        const fs = RNFetchBlob.fs;

        RNFetchBlob.config({
        fileCache: true
        })
        .fetch("GET", dataURL)
        // the image is now dowloaded to device's storage
        .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile("base64");
        })
        .then(base64Data => {
            // here's base64 encoded image
            // remove the file from storage

            const shareOptions = {
            type: 'image/jpg',
            title: '',
            url: 'data:image/png;base64,'+base64Data,
            };
            Share.open(shareOptions)
            // .then(res => console.log(res))
            // .catch(err => console.error(err));

            return fs.unlink(imagePath);
        });

    }
    };

    const ImgByType = (type, img) => {
        if (type === 'N') {
            return <Image
                style={{ width: 50, height: 50}}
                source={
                require('../../assets/images/icon-download.png')
                }
            />
        }

        if (type === 'Y') {
            return <Image
                style={{ width: 50, height: 50}}
                source={{
                    uri: `${baseUrl}${img}`,
                }}
            />
        }
    }

    const onPressDonwload = () => {
        // onPressModal(true)
        DownloadFile(data)
    }
    const onPressItem = () =>{
        if (type === 'Y'){
            let img = [{source: { uri: `${baseUrl}${data.fileUrl}`}}]
            setImage(img)
            onPressModal(true)
            setmodalVisible(true)
        }
        if (type === 'N'){
            onPressDonwload()
     }
 }

    return (
        <View style={{paddingHorizontal: '5%'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={{marginEnd: '5%', justifyContent: 'center'}} onPress={() => onPressItem()}>
                    {ImgByType(type, img)}
                </TouchableOpacity>
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={{flex: 1 ,justifyContent: 'center', paddingVertical: '3%'}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{marginEnd: '3%', flex: 1}}>
                                <Text numberOfLines={1} style={{fontWeight:'bold', fontSize: FONT_SIZE.LITTLETEXT}}>{name}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginStart: '2%'}}>
                                    <Icon 
                                        type="MaterialCommunityIcons" 
                                        name="circle-medium"
                                        style={{fontSize: STYLE_SIZE.ICON_SIZE_SMALL}}
                                    />
                                </View>
                                <View style={{marginStart: '2%'}}>
                                    <Text>{sizeFile}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-start'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginEnd: '3%'}}>
                                <Text>โดย</Text>
                            </View>
                            <View>
                                <Text>{userBy}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>        
         <ImageView
                images={image}
                imageIndex={0}
                isVisible={modalVisible}
                onClose={()=>
                    {
                    setmodalVisible(false)
                    }}
                renderFooter={(currentImage) => ( 
                <TouchableOpacity style={{alignSelf:'center',marginTop:40,marginBottom:40,backgroundColor:colors.primary,padding:15,borderRadius:10,marginLeft:20}} 
                    onPress={()=>onShare()}>
                    <Text style={{marginLeft:width*0.1,marginRight:width*0.1,fontSize:30,color:'white',fontWeight:'bold'}}>Share</Text>
                </TouchableOpacity>)}
            />
        </View>
    )
}

export default tabAttachDetail;
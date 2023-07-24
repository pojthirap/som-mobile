import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Alert } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const Map =({ markerList, onPress, onSelect }) =>{

    const [location, setLocation] = useState('');
    const [modalMapVisible, setModalMapVisible] = useState(false)
    const [cMarkerList, setCmarkerList] = useState(null)
    const [mapWidth, setMapWidth] = useState(750)
    const [currentLocation, setCurrentLocation] = useState({ latitude: 13.710068809,
        longitude: 100.629197831,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421, 
    })

    useEffect(() => {
        setTimeout(() => {
            setMapWidth(751)
        }, 2000)
        requestLocationPermission()
        getLocAction()
    }, [])

    useEffect(() => {
        setCmarkerList(markerList)
    }, [markerList])

    const requestLocationPermission = async () =>{
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
                buttonPositive: "OK"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // console.warn("You can use the location");
              getLocAction()
            } else {
              console.warn("Location permission denied");
            }
          } catch (err) {
            console.warn(err);
        }
    }

    const getLocAction = async () => {
        return Geolocation.getCurrentPosition(
            info => {
                setCurrentLocation({ ...currentLocation, latitude: info.coords.latitude, longitude: info.coords.longitude })
            },
            error => Alert.alert('Error ', JSON.stringify(error.message)),
            { 
                enableHighAccuracy: true, 
                timeout: 20000, 
                maximumAge: 3600000
            },
        )
    }

    const onPressMarker = (item) => {
        if (onPress) {
            onPress(item)
        } else {
            setLocation(item.nativeEvent.coordinate)
            setModalMapVisible(false)
        }
    }

    const onPressMap = (e) => {
        if (onPress) return
        if (!e) return
        if (onSelect) return
        setLocation(e.nativeEvent.coordinate)
    }

    const checkNumber = (input) => {
        if(!isNaN(parseFloat(input))) return parseFloat(input)

        return ''
    }


    return(
        <View>
            <MapView
                    style={{ width: mapWidth, height: 300,alignSelf:'center'}}
                    onPress={(e) => { onPressMap(e)}}
                    initialRegion={currentLocation}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                {
                    location ? <Marker
                        key={1}
                        coordinate={location}
                        title={"ADD"}
                        description={""}
                        onCalloutPress={(e) => {onPressMarker(e)}}
                    >
                        <Callout>
                        </Callout>
                    </Marker>
                    :
                    null
                }
                {
                    markerList && markerList.length ? markerList.map((mar, index) => {
                         return <Marker
                                key={Math.random()}
                                coordinate={{ latitude: checkNumber(mar.latitude),
                                    longitude: checkNumber(mar.longitude),
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421, 
                                }}
                                title={"ADD"}
                                description={""}
                                onCalloutPress={(e) => {
                                    if(!onSelect) onPressMarker(e)
                                    if(onSelect) onSelect(mar)
                                }}
                            >
                                <Callout>
                                </Callout>
                            </Marker>
                        })
                        :
                        null
                }
            </MapView>
        </View>
        )
}

export default Map;

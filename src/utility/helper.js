import Config from "react-native-config";
import { INPUT_TYPE } from './enum';
const Eng = /^[A-Za-z0-9]*$/;
const ThaiEn = /^[A-Za-z0-9ก-๙]*$/;
const Num = /^[0-9]*$/;
const Other = /^[A-Za-z0-9ก-๙]*$/;

export function formatNumber(num) {
    if (num === null || num === undefined) return ''
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const validateInput = (value, type, isRequire = false) => {
    let errMSG = '';
    let isError = false;

    if (isRequire && !value) {
        errMSG = 'กรุณากรอกข้อมูล';
        isError = true;
    }

    if (type == INPUT_TYPE.STRING) {
        if (value && !Other.test(value)) {
            errMSG = 'กรอกได้เฉพาะ ตัวเลข และตัวอักษร'
            isError = true
        }
    }

    if (type == INPUT_TYPE.ENG) {
        if (value && !Eng.test(value)) {
            errMSG = 'กรอกได้ตัวอักษรภาษาอังกฤษ'
            isError = true
        }

        return { errMSG, isError, value }
    }

    if (!isRequire && !value) {
        errMSG = '';

        return { errMSG, isError, value }
    }

    return { errMSG, isError, value }
}

export const getInputData = (myObj, getType = "N") => {
    const getTypeUpper = getType;
    let dataObj = { isInvalid: false, dataSize: 0 };
    if (getTypeUpper == "C") {
        dataObj.isNotChange = true;
    }
    let objKey = []
    if (Array.isArray(myObj.current)) {
        for (let i = 0; i < myObj.current.length; i++) {
            objKey.push(i);
        }
        dataObj.data = [];
    }
    else {
        objKey = Object.keys(myObj.current);
        dataObj.data = {};
    }

    objKey.forEach((key) => {
        if (myObj.current[key]) {
            let item = myObj.current[key].getInputValue()
            if (getTypeUpper == "C") {
                dataObj.isInvalid = dataObj.isInvalid || item.isInvalid;
                dataObj.isNotChange = dataObj.isNotChange && !item.isChange;
                dataObj.dataSize++;
                dataObj.data[key] = item.value;
                if (item.isChange) {
                    if (!dataObj.changeField) dataObj.changeField = item.title
                    else dataObj.changeField += ", " + item.title
                }
                if (item.list) dataObj.list = item.list

            } else if (getTypeUpper == "NE") {
                dataObj.isInvalid = dataObj.isInvalid || item.isInvalid;
                if (item.value) {
                    dataObj.data[key] = item.value;
                    dataObj.dataSize++;
                }

            }
            else {
                dataObj.isInvalid = dataObj.isInvalid || item.isInvalid;
                dataObj.data[key] = item.value;
                dataObj.dataSize++;
            }
        }
    });
    return dataObj;
}


export const resetInputData = (myObj) => {
    try {
        let objKey = []
        if (Array.isArray(myObj.current)) {
            for (let i = 0; i < myObj.current.length; i++) {
                objKey.push(i);
            }
        }
        else {
            objKey = Object.keys(myObj.current);
        }
        objKey.forEach((key) => {
            if (myObj.current[key].resetValue instanceof Function) myObj.current[key].resetValue();
        });

    } catch (error) {

    }
}


export const formatBytes = (data, decimals = 2) => {

    const bytes = data ? Number(data) : 0;
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const sortData = (property) => {
    try {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            /* next line works with strings and numbers, 
                * and you may want to customize it to your needs
                */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    } catch (error) {
        return []
    }
}


export const waypoint = (start, stop, waypoints) => {
    // https://maps.googleapis.com/maps/api/directions/json?origin=13.6780642,100.6392003&waypoints=optimize:true|13.725907,100.593622|13.946082,99.835922|13.6497862,100.2894123&destination=13.726032,100.688494&key=AIzaSyBIgoB0yUxQ-tGCLEYceKwGriKWGZbrhjI&mode=${mode.toLowerCase()}&language=th&region=${region}

    if (!waypoints.length) return
    let waypointList = '';
    waypoints.map((loc) => {
        waypointList = waypointList + `|${loc.latitude},${loc.longitude}`
        return `|${loc.latitude},${loc.longitude}`
    })

    let startLoc = `origin=${start.latitude},${start.longitude}`
    let waypointsLoc = `waypoints=optimize:true${waypointList}`
    let destination = `destination=${stop.latitude},${stop.longitude}`
    let key = `key=${'AIzaSyBIgoB0yUxQ-tGCLEYceKwGriKWGZbrhjI'}`
    let language = `language=th`
    let googleMapURL = `https://maps.googleapis.com/maps/api/directions/json?${startLoc}&${waypointsLoc}&${destination}&${key}&${language}`
    return fetch(googleMapURL)
        .then(response => response.json())
        .then(json => {

            if (json.status !== 'OK') {
                const errorMessage = json.error_message || json.status || 'Unknown error';
                return Promise.reject(errorMessage);
            }

            if (json.routes.length) {

                const route = json.routes[0];

                return Promise.resolve({
                    distance: route.legs.reduce((carry, curr) => {
                        return carry + curr.distance.value;
                    }, 0) / 1000,
                    duration: route.legs.reduce((carry, curr) => {
                        return carry + (curr.duration_in_traffic ? curr.duration_in_traffic.value : curr.duration.value);
                    }, 0) / 60,
                    // coordinates: (
                    //     (precision === 'low') ?
                    //         this.decode([{polyline: route.overview_polyline}]) :
                    //         route.legs.reduce((carry, curr) => {
                    //             return [
                    //                 ...carry,
                    //                 ...this.decode(curr.steps),
                    //             ];
                    //         }, [])
                    // ),
                    fare: route.fare,
                    waypointOrder: route.waypoint_order,
                });

            } else {
                return Promise.reject();
            }
        })
        .catch(err => {
            return Promise.reject(`Error on GMAPS route request: ${err}`);
        });
}

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


export const validateLatLng = (lat, lng) => {
    if (lat && !lng) return (lat && isFinite(lat) && Math.abs(lat) <= 90);
    if (!lat && lng) return (lng && isFinite(lng) && Math.abs(lng) <= 180);
    if (lat && lng) return (lat && isFinite(lat) && Math.abs(lat) <= 90) && (lng && isFinite(lng) && Math.abs(lng) <= 180);
}

export const getGoogleFromLatLonInKm = async (lat1, lon1, lat2, lon2) => {
    let key = `key=${'AIzaSyBIgoB0yUxQ-tGCLEYceKwGriKWGZbrhjI'}`
    let startLoc = `origin=${lat1},${lon1}`
    let language = `language=th`
    let destination = `destination=${lat2},${lon2}`
    let googleMapURL = `https://maps.googleapis.com/maps/api/directions/json?${startLoc}&${destination}&${key}&${language}`
    return fetch(googleMapURL)
        .then(response => response.json())
        .then(json => {

            if (json.status !== 'OK') {
                const errorMessage = json.error_message || json.status || 'Unknown error';
                return Promise.reject(errorMessage);
            }

            if (json.routes.length) {

                const route = json.routes[0];

                return Promise.resolve({
                    distance: route.legs.reduce((carry, curr) => {
                        return carry + curr.distance.value;
                    }, 0) / 1000,
                    duration: route.legs.reduce((carry, curr) => {
                        return carry + (curr.duration_in_traffic ? curr.duration_in_traffic.value : curr.duration.value);
                    }, 0) / 60,
                    // coordinates: (
                    //     (precision === 'low') ?
                    //         this.decode([{polyline: route.overview_polyline}]) :
                    //         route.legs.reduce((carry, curr) => {
                    //             return [
                    //                 ...carry,
                    //                 ...this.decode(curr.steps),
                    //             ];
                    //         }, [])
                    // ),
                    fare: route.fare,
                    waypointOrder: route.waypoint_order,
                });

            } else {
                return Promise.reject();
            }
        })
        .catch(err => {
            alert(`ไม่สามารถคำนวณหาเส้นทางระหว่าง ${lat1},${lon1} และ ${lat2},${lon2} ได้ กรุณาตรวจสอบ Latitude,Longitude ใหม่`)
            return Promise.reject(`Error on GMAPS route request: ${err}`);
        });
}
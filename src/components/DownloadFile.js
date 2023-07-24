import react from 'react'
import {View, Text, Platform, PermissionsAndroid, Alert } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

import { baseUrl } from '../api/Axios';

const DownloadFile = (file,Ext) => {
    checkPermission(file,Ext)
}

const checkPermission = async (file,Ext) => {
    if (Platform.OS === 'ios') {
      downloadFile(file,Ext);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(file,Ext);
        } else {
          // If permission denied then show alert
          Alert.alert('Error','Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
      }
    }
};

const downloadFile = (file,Ext) => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    // fliex example http://www.africau.edu/images/default/sample.pdf
    /// file real `${baseUrl}${file.fileUrl}`
    let FILE_URL = file.fileUrl ? `${baseUrl}${file.fileUrl}` : `${baseUrl}${file}` ;  
    // Function to get extention of the file url
    // let file_ext = getFileExtention(FILE_URL);
    let file_ext = file.fileExt ? `${file.fileUrl}.${file.fileExt}` : Ext ?  `${file}.${Ext}` : '';
   
    // file_ext = '.' + file_ext[0];
   
    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir+
          '/file_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,   
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        Alert.alert('File Downloaded Successfully.');
    }).catch((err) => {
    })
};

const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
};

export default DownloadFile
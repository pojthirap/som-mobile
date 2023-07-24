


import axios from '../api/Axios';
import {URL} from '../api/url';


export const serviceType = async () => {
    const response = await axios.post(URL.searchServiceType, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            activeFlag: "Y"
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const configLov = async () => {
    const response = await axios.post(URL.getConfigLov, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            lovKeyword: "PROSPECT_STATUS",
            activeFlag: "Y"
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const searchBrand = async () =>{
    const response = await axios.post(URL.searchBrand, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            activeFlag: "Y"
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const searchBrandCate = async ()=>{
    const response = await axios.post(URL.searchBrandCate, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            activeFlag: "Y"
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const searchLocType = async () =>{
    const response = await axios.post(URL.searchLocType, {
        searchOption: 0,
        searchOrder: 0,
        startRecord: 0,
        length: 0,
        pageNo: 0,
        model: {
            activeFlag: "Y"
    }})  
    if(response.data)
    return response.data.data ? response.data.data.records : [];
    return [];
}

export const searchProspectId = async (id)=>{
    try{
          
        const response = await axios.post(URL.searchProspectSaTab, {
            searchOption: 0,
            searchOrder: 0,
            startRecord: 0,
            length: 0,
            pageNo: 1,
            model: {
            prospectId: JSON.stringify(id),
            // fullName: "string"
            }
        }) 
        if(response.data.data && response.data.data.records[0]){
            return response.data.data.records[0]
        }
        return null
    }catch(error){
         return null
    }
}
export const updateProspectId = async (value,prospec,serviceTypeList,numberProspectType)=>{
    let serviceId = ''
    serviceTypeList.map((service,index)=>{
        // if(index+1 != serviceTypeList.length) serviceId = serviceId + ',' + service.serviceTypeId;
        if(serviceTypeList.length) {
            if (serviceId) {
                serviceId = serviceId + ',' + service.serviceTypeId;
            } else {
                serviceId = `${service.serviceTypeId}`;
            }
        }
    });
    
    /// lovKeyvalue --> prospectStatus
    let {prospectAccountModel,prospectModel,prospectAddressModel,prospectContactModel} = prospec
    let ddd = prospectModel

    prospectModel = {...ddd, 
        dbdRegCapital: `${ddd.dbdRegCapital}`, 
        dbdTotalIncome: `${ddd.dbdTotalIncome}`,
        dbdProfitLoss: `${ddd.dbdProfitLoss}`,
        dbdTotalAsset: `${ddd.dbdTotalAsset}`,
    }
    /// updateAccountModel
    prospectAccountModel.prospAccId = `${prospectAccountModel.prospAccId}`;
    prospectAccountModel.brandId = value.data.brandId ? `${value.data.brandId}` : null;
    prospectModel.prospectId = `${prospectModel.prospectId}`;
    prospectModel.prospAccId = `${prospectModel.prospAccId}`;
    prospectModel.buId = `${prospectModel.buId}`;
    prospectModel.servicesTypeId = serviceId ? serviceId : null;
    prospectModel.locTypeId = `${value.data.locTypeId}`;
    prospectModel.prospectType = `${numberProspectType}`;
    prospectModel.stationName = value.data.stationName ? value.data.stationName : null;
    prospectModel.stationOpenFlag = value.data.stationOpenFlag;
    prospectModel.reasonCancel = value.data.reasonCancel ? value.data.reasonCancel : null;
    prospectModel.brandCateId = `${value.data.brandCateId}`;
    prospectModel.brandCateOther = value.data.brandCateOther ? value.data.brandCateOther : null;
    prospectModel.areaSquareWa = value.data.areaSquareWa;
    prospectModel.areaNgan = value.data.areaNgan;
    prospectModel.areaRai = value.data.areaRai;
    prospectModel.areaWidthMeter = value.data.areaWidthMeter ? value.data.areaWidthMeter : null;
    prospectModel.shopJoint = value.data.shopJoint ? value.data.shopJoint : null;
    prospectModel.licenseStatus = value.data.licenseStatus ? value.data.licenseStatus : null;
    prospectModel.licenseOther = value.data.licenseOther ? value.data.licenseOther : null;
    prospectModel.interestOther = value.data.interestOther ? value.data.interestOther : null;
    prospectModel.interestStatus = value.data.interestStatus;
    prospectModel.saleVolumeRef = value.data.saleVolumeRef ? value.data.saleVolumeRef : null;
    prospectModel.saleVolume = value.data.saleVolume ? value.data.saleVolume : null;
    prospectModel.progressDate = value.data.progressDate ? value.data.progressDate : null;
    prospectModel.terminateDate = value.data.terminateDate ? value.data.terminateDate : null;
    prospectModel.addrTitleDeedNo = value.data.Address.data.addrTitleDeedNo ? value.data.Address.data.addrTitleDeedNo : null;
    prospectModel.addrCertUtilisation = value.data.Address.data.addrCertUtilisation ? value.data.Address.data.addrCertUtilisation : null;
    prospectModel.addrParcelNo = value.data.Address.data.addrParcelNo ? value.data.Address.data.addrParcelNo : null;
    prospectModel.addrTambonNo = value.data.Address.data.addrTambonNo ? value.data.Address.data.addrTambonNo : null;
    prospectModel.prospectStatus = `${value.data.lovKeyvalue}`;
    prospectModel.changeField = value.changeField
    prospectAddressModel = {...prospectAddressModel,...value.data.Address.data};
    prospectAddressModel.prospAddrId = `${prospectAddressModel.prospAddrId}`;
    prospectAddressModel.prospectId = `${prospectAddressModel.prospectId}`;
    prospectAddressModel.prospAccId = `${prospectAddressModel.prospAccId}`;
    prospectContactModel = {...prospectContactModel,...value.data.ContactInfo.data};
    prospectContactModel.prospContactId = `${prospectContactModel.prospContactId}`;
    prospectContactModel.prospectId = `${prospectContactModel.prospectId}`;
    prospectContactModel.prospAccId  = `${prospectContactModel.prospAccId}`;

    try{
        const response = await axios.post('/updProspectSaTab', {
            prospectAccountModel:prospectAccountModel,
            prospectModel:prospectModel,
            prospectAddressModel:prospectAddressModel,
            prospectContactModel:prospectContactModel
        })

        if(response.data.data && response.data.data.records[0]){
            return response.data.data.records[0]
        }
        return null
    }catch(error){
        return null
    }

    /// serviceTypeList
}
export const searchTemplateSaResultTab = async (prospectId,tpNameTh,fromDate,toDate)=>{
    try{
        const response = await axios.post(URL.searchTemplateSaResultTab, {
            "searchOption": 0,
            "searchOrder": 0,
            "startRecord": 0,
            "length": 0,
            "pageNo": 1,
            "model": {
                "prospectId" : prospectId ? `${prospectId}` : null,
                "tpNameTh" : tpNameTh ? `${tpNameTh}` : null,
                "fromDate": fromDate ? fromDate : null,
                "toDate": toDate ? toDate : null
            }
        }) 
        if(response.data.data){
            return response.data.data.records
        }
        return []
    }catch(error){
         return []
    }

}

export const viewTemplateSaResult = async (rceAppFormId,recSaFormId)=>{
    try{
        const response = await axios.post(URL.viewTemplateSaResult, {
            searchOption: 0,
            searchOrder: 0,
            startRecord: 0,
            length: 0,
            pageNo: 1,
            model: {
                rceAppFormId,
                recSaFormId
            }
        }) 
        if(response.data.data){
            return response.data.data.records[0]
        }
        return []
    }catch(error){
         return []
    }

}



export const getMasterDataForTemplateSa = async (ansLovType)=>{
    try{
        const response = await axios.post(URL.getMasterDataForTemplateSa, {
            searchOption: 0,
            searchOrder: 0,
            startRecord: 0,
            length: 0,
            pageNo: 0,
            model: {
                ansLovType
            }
        }) 
        if(response.data.data){
            return response.data.data.records
        }
        return []
    }catch(error){
         return []
    }

}
export const getTaskTemplateSaFormForRecord = async (planTripTaskId)=>{
    try{
        const response = await axios.post(URL.getTaskTemplateSaFormForRecord, {
            searchOption: 0,
            searchOrder: 0,
            startRecord: 0,
            length: 0,
            pageNo: 1,
            model: {
                planTripTaskId,
                activeFlag : "Y",
            }
        }) 
        if(response.data.data){
            return response.data.data.records
        }
        return []
    }catch(error){
         return []
    }

}

export const getConfigLov  = async (lovKeyword) =>{
    try{
    const response = await axios.post(URL.getConfigLov, {
        "searchOption": 0,
        "searchOrder": 0,
        "startRecord": 0,
        "length": 0,
        "pageNo": 0,
        "model": {
            "lovKeyword": lovKeyword,
            "activeFlag": "Y"
        }
        })
        if(response.data.data){
            return response.data.data.records
        }
        return []
    }catch(error){
         return []
    }
    
}
export const uploadFile = async (fileUri,type = 'jpeg',name= '.jpg',PhotoFlag = "Y") =>{
    const formData = new FormData();
    formData.append('ImageFile', {
        uri: fileUri,
        type: type, 
        name: name,
     });
     formData.append('PhotoFlag',PhotoFlag);
     const response = await axios.post(URL.uploadFileSaForm,formData)
     if(response.data)
    return response.data.data ? response.data.data.records[0] : null;
    return null
}
export const addRecordSaForm = async (payload) =>{
    try{
        await axios.post(URL.addRecordSaForm, payload)  
        return true
    }catch(error){
        return true
    }

}
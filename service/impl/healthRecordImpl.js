const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const datastore = require('../../dataStore')
const moment = require('moment')
const healthRecordAccessImpl = require('./healthRecordAccessImpl')


module.exports.storeHealthRecord = (userid, body) => {
    let orgDbo = datastore.getOrganizationDbo()
    let healthRecordDbo = datastore.getHealthRecordDbo()
    let providerDbo = datastore.getProviderDbo()
    let healthRecord = {}
    let createDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ')
    let createdBy = body.createdBy
    id = uuid(JSON.stringify({
        userId: userid,
        providerId: createdBy,
        createDate: createDate,
        resourceType: body.resourceType
    }))
    healthRecord.createDate = createDate
    healthRecord.createdBy = createdBy
    healthRecord.id = id
    healthRecord.resourceType = body.resourceType
    healthRecord.providerName = providerDbo[createdBy].name
    healthRecord.organizationName = orgDbo[body.createdAt].name
    healthRecord.organizationId = body.createdAt
    healthRecord.organizationAddress = orgDbo[body.createdAt].address
    let accessArr = []
    if(body.resourceType == "PRESCRIPTION"){
        let resource = buildPrescriptionResource(userid, body)
        healthRecord.patient = resource.patient
        healthRecord.condition = resource.symptoms
        healthRecord.medication = resource.medication
        healthRecord.appointmentId = resource.appointmentId
        healthRecord.labReportsOrdered = resource.labReportsOrdered
        accessArr = [userid, body.createdBy]
    } else if(body.resourceType == "LAB_REPORT"){
        let resource = buildLabReportResource(userid, body)
        healthRecord.patient = resource.patient
        healthRecord.report = resource.report
        healthRecord.referredbyProviderId = resource.referredbyProviderId
        healthRecord.verifiedbyProviderId = resource.verifiedbyProviderId
        healthRecord.referredbyProviderName = resource.referredbyProviderName
        healthRecord.verifiedbyProviderName = resource.verifiedbyProviderName
        accessArr = [userid, body.createdBy, body.referredBy, body.verifiedBy]
    }
    healthRecordAccessImpl.addHealthRecordAccess(accessArr, id)
    healthRecordDbo[id] = healthRecord
    let data = JSON.stringify(healthRecordDbo)
    fs.writeFileSync('datastore/healthRecord.json', data)
    return healthRecord
}

module.exports.getHealthRecords = (id) => {
    let healthRecordDbo = datastore.getHealthRecordDbo()
    let healthRecordAccessDbo = datastore.gethealthRecordAccessDbo()
    let healthRecordList = []
    let healthRecords = []
    if(healthRecordAccessDbo[id] != undefined){
        healthRecordList = healthRecordAccessDbo[id].healthRecords
        healthRecordList.forEach(element => {
            if(healthRecordDbo[element] != undefined && healthRecordDbo[element] != null){
                healthRecords.push(healthRecordDbo[element])
            }
        })
    }
    return healthRecords
}

module.exports.getHealthRecordsByType = (id, type) => {
    let healthRecordDbo = datastore.getHealthRecordDbo()
    let healthRecordAccessDbo = datastore.gethealthRecordAccessDbo()

    let healthRecordList = []
    let healthRecords = []
    let filteredRecords = []
    if(healthRecordAccessDbo[id] != undefined){
        healthRecordList = healthRecordAccessDbo[id].healthRecords
        healthRecordList.forEach(element => {
            if(healthRecordDbo[element] != undefined && healthRecordDbo[element] != null){
                healthRecords.push(healthRecordDbo[element])
            }
        })
        
        filteredRecords = healthRecords.filter((healthRecord) =>{ 
            return healthRecord.resourceType == type
        }).map((healthRec) => {
            if(type == "LAB_REPORT"){
                return transformToLabReport(healthRec)
            }else{
                return healthRec
            }
        })
    }
    
    return filteredRecords
}

function transformToLabReport(healthRecord){
    let providerDbo = datastore.getProviderDbo()
    let record = {}
    record.id = healthRecord.id
    record.datetime = healthRecord.createDate
    record.type = healthRecord.report.name
    record.labName = healthRecord.organizationName
    record.labAddress = healthRecord.organizationAddress
    record.refByDoctor = healthRecord.referredbyProviderName
    record.labPhone = providerDbo[healthRecord.createdBy].phone
    return record
}

function buildPrescriptionResource(userid, request){
    let userDbo = datastore.getUserDbo()
    let resource = {}
    resource.patient = {
        id: uuid(JSON.stringify({
            name: request.patientName,
            contact: request.contact,
            dob: request.dob
        })),
        name: request.name,
        gender: request.gender,
        age: request.age,
        referenceid: userid,
        referenceContact: userDbo[userid].contact,
        vitals: {
            weight: request.weight,
            height: request.height,
            bloodPressure: request.bp,
            heartRate: request.heartRate
        }
    }
    resource.condition = request.symptoms
    resource.medication = request.medication
    resource.labReportsOrdered = request.labReportsOrdered
    resource.appointmentId = request.appointmentId
    return resource
}

function buildLabReportResource(userid, body){
    let providerDbo = datastore.getProviderDbo()
    let resource = {}
    resource.patient = {
        id: uuid(JSON.stringify({
            name: body.patientName,
            contact: body.contact,
            dob: body.dob
        })),
        name: body.patientName,
        gender: body.gender,
        age: body.age
    }
    resource.report = body.report
    resource.referredbyProviderId = body.referredBy
    resource.verifiedbyProviderId = body.verifiedBy
    resource.referredbyProviderName = providerDbo[body.referredBy].name
    resource.verifiedbyProviderName = providerDbo[body.verifiedBy].name
    return resource    
}
        

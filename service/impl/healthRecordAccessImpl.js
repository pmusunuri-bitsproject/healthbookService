const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const moment = require('moment')
const datastore = require('../../dataStore')


module.exports.addHealthRecordAccess = (accessArr, fhirId) =>{
    let healthRecordAccess = {}
    let healthRecordAccessDbo = datastore.gethealthRecordAccessDbo()
    accessArr.forEach(element => {
        if(healthRecordAccessDbo[element] != undefined){
            healthRecordAccessDbo[element].healthRecords.push(fhirId)
        }else{
            healthRecordAccess.healthRecords = [fhirId]
            healthRecordAccessDbo[element] = healthRecordAccess
        }
    });
    let data = JSON.stringify(healthRecordAccessDbo)
    fs.writeFileSync('datastore/healthRecordAccess.json', data)
}
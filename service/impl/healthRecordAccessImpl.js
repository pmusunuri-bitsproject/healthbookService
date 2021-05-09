const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
var healthRecordAccessDbo = gethealthRecordAccessDbo()
const moment = require('moment')


function gethealthRecordAccessDbo(){
    let data = JSON.parse(fs.readFileSync('datastore/healthRecordAccess.json'))
    return data
}

module.exports.addHealthRecordAccess = (accessArr, fhirId) =>{
    let healthRecordAccess = {}
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
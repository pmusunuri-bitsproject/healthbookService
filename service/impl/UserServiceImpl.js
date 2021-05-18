const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const datastore = require('../../dataStore')
const moment = require('moment')
const healthRecordAcessImpl = require('./healthRecordAccessImpl')
const appointmentImpl = require('./appointmentImpl')


module.exports.storeUser = (body) =>{
    let userDbo = datastore.getUserDbo()
    let user = {}
    let id = uuid(body.email)
    user.id = id
    let dob = ''
    if (body.dob){
        dob =  moment(new Date(body.dob)).format('YYYY-MM-DD')
    }
    user.email = body.email
    user.contact = body.contact || ''
    user.name = body.name
    user.dob = dob
    user.location = body.location || ''
    userDbo[id] = user
    let data = JSON.stringify(userDbo)
    fs.writeFileSync('datastore/user.json', data)
    return user
}

module.exports.getUser = (id) => {
    let userDbo = datastore.getUserDbo()
    user = userDbo[id]
    return user
}

module.exports.bookAppointment = (userid, body) => {
    let userDbo = datastore.getUserDbo()
    let username = userDbo[userid].name 
    return appointmentImpl.createAppointment(userid, username, body)        
}

module.exports.getAppointments = (userid) => {
    return appointmentImpl.getUserAppointments(userid)
}

module.exports.getReferredProviders = (userid) => {
    console.log(userid)
    return appointmentImpl.getReferredProviders(userid)
}

module.exports.provideHealthRecordAccess = (userid, body) => {
    try{
         return healthRecordAcessImpl.giveHealthRecordHistoryAccess(userid, body.providers)
    }catch(ex){
        console.log(ex)
        return {"message": "failed to share healthrecords"}
    }
}
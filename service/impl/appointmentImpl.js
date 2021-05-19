const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const moment = require('moment')
const uuid = require('uuid-by-string')
const datastore = require('../../dataStore')
const providerOrgImpl = require('./providerOrganizationImpl')

updateAppointmentParticipant = (appointmentid, participants) => {
    console.log(appointmentid)
    console.log(participants)
    let appointmentParticipantDbo = datastore.getAppointmentParticipantDbo()
    participants.forEach(participant => {
        let appointments = appointmentParticipantDbo[participant] || []
        appointments.push(appointmentid)
        appointmentParticipantDbo[participant] = appointments
        let data = JSON.stringify(appointmentParticipantDbo)
        fs.writeFileSync('datastore/appointmentParticipant.json', data)
    })

}

generateAppointmentId = (userid, providerid, orgid, appointmentDate, timeSlot ) => {
    return uuid(JSON.stringify({
        providerid: providerid,
        organizationId: orgid,
        userid: userid,
        date: appointmentDate,
        timeSlot: timeSlot
    }))
}

module.exports.createAppointment = (userid, username, req) => {
    let appointmentDbo = datastore.getAppointmentDbo()
    let providerDbo = datastore.getProviderDbo()
    let orgDbo = datastore.getOrganizationDbo()
    let provider = providerDbo[req.providerId]
    let org = orgDbo[req.organizationId]
    let appointmentId = generateAppointmentId(userid, req.providerid, req.orgId,
                         req.appointmentDate, req.timeSlot)
    appointmentDbo[appointmentId] = {
        id: appointmentId,
        appointmentDate: req.appointmentDate,
        appointmentTimeSlot: req.timeSlot,
        providerName: provider.name,
        providerphone: provider.phone,
        providerId: provider.id,
        organizationId: org.id,
        organizationName: org.name,
        organizationAddress: org.address,
        userid: userid,
        username: username,
        status: "NOT_YET_STARTED"
    }

    let data = JSON.stringify(appointmentDbo)
    fs.writeFileSync('datastore/appointments.json', data)
    
    let providerOrgId = providerOrgImpl.generateProviderOrgId(provider.id, org.id)
    updateAppointmentParticipant(appointmentId, [userid, providerOrgId])
    providerOrgImpl.blockProviderTimeslot(provider.id, org.id, req.timeSlot, req.appointmentDate)
    return {id: appointmentId}

}



module.exports.getUserAppointments = (userid) => {
    let appointmentsDbo = datastore.getAppointmentDbo()
    let appointmentParticipantDbo = datastore.getAppointmentParticipantDbo()
    let userAppointments = []
    let currentDate = moment(new Date()).format('YYYY-MM-DD')
    let appointments = appointmentParticipantDbo[userid] || []
    console.log(appointments)
    if(appointments.length > 0){
        appointments.forEach(appointmentid => {
            let appointment = appointmentsDbo[appointmentid]
            let responseObject =  {
                id: appointment.id,
                datetime: appointment.appointmentDate + " from " + appointment.appointmentTimeSlot,
                doctorName: appointment.providerName,
                hospitalName: appointment.organizationName,
                hospitalAddress: appointment.organizationAddress,
                hospitalPhone: appointment.providerphone,
                appointmentDate: appointment.appointmentDate,
                appointmentTimeSlot: appointment.appointmentTimeSlot,
                providerId: appointment.providerId,
                organizationId: appointment.organizationId,
                userid: appointment.userid,
                bookedBy: appointment.username
            }
            console.log(appointment)
            if (appointment.appointmentDate >= currentDate){
                userAppointments.push(responseObject)
            }
            
        })
    }
    return userAppointments
}

module.exports.getProviderAppointments = (providerId, orgId) => {
    let appointmentsDbo = datastore.getAppointmentDbo()
    let appointmentParticipantDbo = datastore.getAppointmentParticipantDbo()
    let providerOrgId = providerOrgImpl.generateProviderOrgId(providerId, orgId)
    let providerAppointments = []
    let currentDate = moment(new Date()).format('YYYY-MM-DD')
    let appointments = appointmentParticipantDbo[providerOrgId] || []
    if(appointments.length > 0){
        appointments.forEach(appointmentid => {
            let appointment = appointmentsDbo[appointmentid]
            let responseObject =  {
                id: appointment.id,
                datetime: appointment.appointmentDate + " from " + appointment.appointmentTimeSlot,
                doctorName: appointment.providerName,
                hospitalName: appointment.organizationName,
                hospitalAddress: appointment.organizationAddress,
                hospitalPhone: appointment.providerphone,
                appointmentDate: appointment.appointmentDate,
                appointmentTimeSlot: appointment.appointmentTimeSlot,
                providerId: appointment.providerId,
                organizationId: appointment.organizationId,
                userid: appointment.userid,
                bookedBy: appointment.username
            }
            if (appointment.appointmentDate >= currentDate){
                providerAppointments.push(responseObject)
            }
            
        })
    }
    return providerAppointments
}


module.exports.getReferredProviders = (userid) => {
    let appointmentsDbo = datastore.getAppointmentDbo()
    let appointmentParticipantDbo = datastore.getAppointmentParticipantDbo()
    let referredProviders = []
    const providerSet = new Set()
    let appointments = appointmentParticipantDbo[userid] || []
    if(appointments.length > 0){
        appointments.forEach(appointmentid => {
            let appointment = appointmentsDbo[appointmentid]
            if(!providerSet.has(appointment.providerid)){
                providerSet.add(appointment.providerId)
                referredProviders.push({
                    providerName: appointment.providerName,
                    providerid: appointment.providerId
                })
            }
            
        })
    }
    return referredProviders
}

module.exports.getAppointmentById = (id) => {
    let appointmentsDbo = datastore.getAppointmentDbo()
    let response = {}
    response = appointmentsDbo[id]
    return response
}

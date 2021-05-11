const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const datastore = require('../../dataStore')
const moment = require('moment')
const healthRecordAcessImpl = require('./healthRecordAccessImpl')

function updateAvailabilitySlot (appointmentTimeSlot, appointmentDate, providerOrgId){
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let providerAvailability = providerOrgDbo[providerOrgId].timeSlots
    let availableTimeSlot = []
    providerAvailability[appointmentDate].forEach( slot => {
        if(slot != appointmentTimeSlot){
            availableTimeSlot.push(slot)
        }
    })
    providerOrgDbo[providerOrgId].timeSlots[appointmentDate] = availableTimeSlot
    let data = JSON.stringify(providerOrgDbo)
    fs.writeFileSync('datastore/providerOrganization.json', data)
}

module.exports.storeUser = (body) =>{
    let userDbo = datastore.getUserDbo()
    let user = {}
    let dob =  moment(new Date(body.dob)).format('YYYY-MM-DD')
    let id = uuid(body.email)
    user.id = id
    user.email = body.email
    user.contact = body.contact
    user.name = body.name
    user.dob = dob
    userDbo[id] = user
    let data = JSON.stringify(userDbo)
    fs.writeFileSync('datastore/user.json', data)
    return {id: user.id}
}

module.exports.getUser = (id) => {
    let userDbo = datastore.getUserDbo()
    user = userDbo[id]
    return user
}

module.exports.bookAppointment = (userid, body) => {
    const updateUserAppResponse = updateUserAppointments({
        request: body,
        userid: userid
    })
    if(updateUserAppResponse != null){
        let providerOrgId = uuid(JSON.stringify({
            providerid: body.providerId,
            organizationId: body.organizationId
        }))
        updateAvailabilitySlot(body.timeSlot, body.appointmentDate, providerOrgId)
        const updateProviderAppResponse = updateProviderAppointments({
            request: body,
            providerOrgId: providerOrgId,
            userid: userid
        })
    }
    return {appointmentId: updateUserAppResponse}         
}

module.exports.getAppointments = (userid) => {
    let userAppointmentsDbo = datastore.getUserAppointmentDbo()
    let userAppointments = []
    let currentDate = moment(new Date()).format('YYYY-MM-DD')
    let userAppointment = userAppointmentsDbo[userid]
    if(userAppointment != undefined && userAppointment.appointments != undefined){
        userAppointment.appointments.forEach(appointment => {
            if (appointment.appointmentDate >= currentDate){
                userAppointments.push({
                    id: appointment.id,
                    datetime: appointment.appointmentDate + " from " + appointment.appointmentTimeSlot,
                    doctorName: appointment.providerName,
                    hospitalName: appointment.organizationName,
                    hospitalAddress: appointment.organizationAddress,
                    hospitalPhone: appointment.providerphone,
                    appointmentDate: appointment.appointmentDate,
                    appointmentTimeSlot: appointment.appointmentTimeSlot,
                    providerId: appointment.providerId,
                    organizationId: appointment.organizationId
                })
            } 
          })
    }
    return userAppointments
}

module.exports.getReferredProviders = (userid) => {
    let userAppointmentsDbo = datastore.getUserAppointmentDbo()
    let referredProviders = []
    const providerSet = new Set()
    let userAppointments = []
    if(userAppointmentsDbo[userid] != undefined){
        userAppointments = userAppointmentsDbo[userid].appointments
        userAppointments.forEach(appointment => {
            if (!providerSet.has(appointment.providerId)){
                providerSet.add(appointment.providerId)
                referredProviders.push({
                    providerid: uuid(appointment.providerId),
                    providerName: appointment.providerName
                })
            }
        })
    }
    return referredProviders
}

module.exports.provideHealthRecordAccess = (body) => {
    try{
        healthRecordAcessImpl.addHealthRecordAccess([body.providers], body.recordId)
    }catch(ex){
        console.log(ex)
        return null
    }
    return {status: "success"}
}

const updateUserAppointments = (userAppUpdateRequest) => {
    let providerDbo = datastore.getProviderDbo()
    let orgDbo = datastore.getOrganizationDbo()
    let userAppointmentsDbo = datastore.getUserAppointmentDbo()
    let userAppointments = {}
    let userAppointmentList = []
    const request = userAppUpdateRequest.request
    const userid = userAppUpdateRequest.userid
    let userAppointmentDetails = userAppointmentsDbo[userid]
    if( userAppointmentDetails != undefined && userAppointmentDetails.appointments != undefined){
        userAppointmentList = userAppointmentDetails.appointments
    }
    const providerid = request.providerId
    const orgid = request.organizationId
    const providerDetails = providerDbo[providerid]
    const orgDetails = orgDbo[orgid]
    const appointmentDate = request.appointmentDate
    const timeSlot = request.timeSlot
    const appointmentId = uuid(JSON.stringify({
        providerid: providerid,
        organizationId: orgid,
        date: appointmentDate,
        timeSlot: timeSlot
    }))
    userAppointmentList.push(
        {
            id: appointmentId,
            appointmentDate: appointmentDate,
            appointmentTimeSlot: timeSlot,
            providerName: providerDetails.name,
            providerphone: providerDetails.phone,
            providerId: providerid,
            organizationId: orgid,
            organizationName: orgDetails.name,
            organizationAddress: orgDetails.address
        }
    ) 
    userAppointments.appointments = userAppointmentList
    userAppointmentsDbo[userid] = userAppointments
    let data = JSON.stringify(userAppointmentsDbo)
    fs.writeFileSync('datastore/userAppointment.json', data)
    return appointmentId
}

const updateProviderAppointments = (providerAppUpdateRequest) => {
    let userDbo = datastore.getUserDbo()
    let providerAppointmentsDbo = datastore.getProviderAppointmentDbo()
    const request = providerAppUpdateRequest.request
    const providerOrgId = providerAppUpdateRequest.providerOrgId
    const userid = providerAppUpdateRequest.userid

    let providerAppointmentId = uuid(JSON.stringify({
        providerOrganizationId: providerOrgId,
        appointmentDate: request.appointmentDate,
        timeSlot: request.timeSlot
    }))
    let providerAppointments = {}
    let providerAppointmentList =[]
    const providerAppointmentDetails = providerAppointmentsDbo[providerOrgId]
    if (  providerAppointmentDetails != undefined && providerAppointmentDetails.appointment != undefined){
        providerAppointmentList = providerAppointmentDetails.appointments
    }
    providerAppointmentList.push(
        {
            id: providerAppointmentId,
            bookedBy: userDbo[userid].name,
            phone: userDbo[userid].phone,
            appointmentDate: request.appointmentDate,
            timeSlot: request.timeSlot
        }
    )
    providerAppointments.appointments = providerAppointmentList
    providerAppointmentsDbo[providerAppointmentId] = providerAppointments
    data = JSON.stringify(providerAppointmentsDbo)
    fs.writeFileSync('datastore/providerAppointment.json', data)
    return providerAppointmentId
}


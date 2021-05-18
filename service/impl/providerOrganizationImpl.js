const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const datastore = require('../../dataStore')
const moment = require('moment')
const appointmentImpl = require('./appointmentImpl')

module.exports.getAvailability = (providerid, orgId, datefilter) => {
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let providerOrgId = generateProviderOrgId(providerid, orgId)
    let response = {}
    response[datefilter] = providerOrgDbo[providerOrgId].timeSlots[datefilter]
    return response
}

module.exports.getAvailabilityWithoutFilter = (providerid, orgId) => {
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let currentDate = moment(new Date()).format('YYYY-MM-DD')
    let providerOrgId = this.generateProviderOrgId(providerid, orgId)
    let entries = providerOrgDbo[providerOrgId].timeSlots
    let response = {}
    for (const [key, value] of Object.entries(entries)) {
        let availabilityDate =  moment(new Date(key)).format('YYYY-MM-DD')
        if( availabilityDate >= currentDate){
            response[key] = value
        }
    }
    return response
}


module.exports.blockProviderTimeslot = (providerId, orgId, timeslot, appointmentDate) => {
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let providerOrgId = this.generateProviderOrgId(providerId, orgId)
    let providerAvailability = providerOrgDbo[providerOrgId].timeSlots
    let availableTimeSlot = []
    providerAvailability[appointmentDate].forEach(slot => {
        if (slot != timeslot) {
            availableTimeSlot.push(slot)
        }
    })
    providerOrgDbo[providerOrgId].timeSlots[appointmentDate] = availableTimeSlot
    let data = JSON.stringify(providerOrgDbo)
    fs.writeFileSync('datastore/providerOrganization.json', data)
}

module.exports.getAppointments = (providerId, orgId) => {
    let appointmentData = appointmentImpl.getProviderAppointments(providerId, orgId)
    return appointmentData
}

module.exports.generateProviderOrgId = (providerId, orgId) => {
    return uuid(JSON.stringify({
        providerid: providerId,
        organizationId: orgId
    }))
}

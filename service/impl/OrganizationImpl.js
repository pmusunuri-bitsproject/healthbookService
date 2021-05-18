const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const moment = require('moment')
const datastore = require('../../dataStore')
var dateUtils = require('../../utils/DateUtils')

module.exports.addOrganization = (body) => {
    let orgDbo = datastore.getOrganizationDbo()
    let org = {}
    let id = uuid(body.tin)
    org.name = body.name
    let providers = []
    org.id = id
    org.city = body.city
    org.state = body.state
    org.phone = body.phone
    org.tin = body.tin
    org.address = body.address
    org.providers = providers
    orgDbo[id] = org
    let data = JSON.stringify(orgDbo)
    fs.writeFileSync('datastore/organizations.json', data)
    return {id: id}
}

module.exports.getOrganizationById = (id) => {
    let orgDbo = datastore.getOrganizationDbo()
    console.log(`Fetch orgs for Id: ${id}`)
    return orgDbo[id]
}

module.exports.getOrganizations = () => {
    let orgDbo = datastore.getOrganizationDbo()
    let response = []
    for (const [key, value] of Object.entries(orgDbo)) {
        response.push(value)
      }
    return response
}

module.exports.addProviderToOrganization = (id, body) => {
    let orgDbo = datastore.getOrganizationDbo()
    let providerDbo = datastore.getProviderDbo()
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let provider = providerDbo[body.providerId]
    orgDbo[id].providers.push({
        name: provider.name,
        id: body.providerId
    })
    let orgId = id
    let orgName = orgDbo[id].name
    const uuidString = JSON.stringify({
        providerid: body.providerId,
        organizationId: id
    })
    let providerOrgId = uuid(uuidString)
    providerDbo[body.providerId].organizations.push({
        name: orgName,
        id: orgId
    })
    let currentDate = new Date()
    currentDate = moment(currentDate).format('YYYY-MM-DD')
    providerOrgDbo[providerOrgId] = {
        availabilityStart: body.availabilityStart,
        availabilityEnd: body.availabilityEnd,
        appointmentTime: body.appointmentTime,
        timeSlots: dateUtils.getDates(currentDate, body.availabilityStart, body.availabilityEnd, body.appointmentTime)
    }

    let data = JSON.stringify(providerOrgDbo)
    fs.writeFileSync('datastore/providerOrganization.json', data)
    data = JSON.stringify(orgDbo)
    fs.writeFileSync('datastore/organizations.json', data)
    data = JSON.stringify(providerDbo)
    fs.writeFileSync('datastore/providers.json', data)
    return orgDbo[id]
}
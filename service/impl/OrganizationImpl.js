const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const moment = require('moment')
var orgDbo = getOrganizationDbo()
var providerDbo = getProviderDbo()
var providerOrgDbo = getProviderOrgDbo()
var dateUtils = require('../../utils/DateUtils')

function getOrganizationDbo(){
    let data = JSON.parse(fs.readFileSync('datastore/organizations.json'))
    return data
}

function getProviderDbo(){
    let data = JSON.parse(fs.readFileSync('datastore/providers.json'))
    return data
}

function getProviderOrgDbo(){
    let data = JSON.parse(fs.readFileSync('datastore/providerOrganization.json'))
    return data
}

module.exports.addOrganization = (body) => {
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
    console.log(`Fetch orgs for Id: ${id}`)
    return orgDbo[id]
}

module.exports.getOrganizations = () => {
    let response = []
    for (const [key, value] of Object.entries(orgDbo)) {
        response.push(value)
      }
    return response
}

module.exports.addProviderToOrganization = (id, body) => {
    orgDbo[id].providers.push({
        name: body.name,
        id: body.providerId
    })
    let orgId = id
    let orgName = orgDbo[id].name
    const uuidString = JSON.stringify({
        providerid: body.providerId,
        organizationId: id
    })
    console.log(uuidString)
    let providerOrgId = uuid(uuidString)

    console.log(providerOrgId)

    console.log(providerOrgId)
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
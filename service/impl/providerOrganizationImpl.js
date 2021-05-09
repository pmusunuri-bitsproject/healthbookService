const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
var providerOrgDbo = getProviderOrgDbo()

function getProviderOrgDbo(){
    let data = JSON.parse(fs.readFileSync('datastore/providerOrganization.json'))
    return data
}

module.exports.getAvailability = (providerid, orgId, datefilter) => {
    let providerOrgId = uuid(JSON.stringify({
        providerid: providerid,
        organizationId: orgId
    }))
    let response = {}
    response[datefilter] = providerOrgDbo[providerOrgId].timeSlots[datefilter]
    return response
}

module.exports.getAvailabilityWithoutFilter = (providerid, orgId) => {
    let providerOrgId = uuid(JSON.stringify({
        providerid: providerid,
        organizationId: orgId
    }))
    const entries = providerOrgDbo[providerOrgId].timeSlots
    return entries
}
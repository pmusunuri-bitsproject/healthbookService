const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const datastore = require('../../dataStore')

module.exports.getAvailability = (providerid, orgId, datefilter) => {
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let providerOrgId = uuid(JSON.stringify({
        providerid: providerid,
        organizationId: orgId
    }))
    let response = {}
    response[datefilter] = providerOrgDbo[providerOrgId].timeSlots[datefilter]
    return response
}

module.exports.getAvailabilityWithoutFilter = (providerid, orgId) => {
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let providerOrgId = uuid(JSON.stringify({
        providerid: providerid,
        organizationId: orgId
    }))
    const entries = providerOrgDbo[providerOrgId].timeSlots
    return entries
}
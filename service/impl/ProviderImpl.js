const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const uuid = require('uuid-by-string')
const datastore = require('../../dataStore')

module.exports.addProvider = (body) => {
    let providerDbo = datastore.getProviderDbo()
    let provider = {}
    let id = uuid(body.npi)
    provider.name = body.name
    provider.organizations = []
    provider.npi = body.npi
    provider.phone = body.phone
    provider.address = body.address
    provider.id = id
    providerDbo[id] = provider
    let data = JSON.stringify(providerDbo)
    fs.writeFileSync('datastore/providers.json', data)
    return {id: id}
}

module.exports.getProviderById = (id) => {
    let providerDbo = datastore.getProviderDbo()
    console.log(`Fetch providers for Id: ${id}`)
    return providerDbo[id]
}

module.exports.getProviders = () => {
    let providerDbo = datastore.getProviderDbo()
    console.log(`Fetch all the providers`)
    let response = []
    Object.values(providerDbo).forEach(element => {
        response.push(element)
    })
    return response
}
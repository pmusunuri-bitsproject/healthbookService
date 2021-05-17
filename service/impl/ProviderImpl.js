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

module.exports.getProviderDetailsByNpi = (npi) => {
    let providerDbo = datastore.getProviderDbo()
    console.log(`Fetch providerdetails by npi ${uuid(npi)}`)
    let response = {}
    let providerid = uuid(npi)
    if (providerDbo[providerid]){
        return providerDbo[providerid]
    }else{
        return {error: "data not found"}
    }
}

/*module.exports.getProviderAppointments = (providerid, orgId) => {
    let providerOrgDbo = datastore.getProviderOrgDbo()
    let id = uuid(JSON.stringify({
        providerid: providerId,
        organizationId: orgId
    }))
     let response = []
    if (providerOrgDbo[id]){
        let providerOrgDetails = {}
        return response.push(appointment)
    }else{
        return {error: "data not found"}
   }
}*/
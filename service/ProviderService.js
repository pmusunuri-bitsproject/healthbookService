const { request } = require('express')
const express = require('express')
const app = express()
const router = express.Router()
const providerImpl = require('./impl/ProviderImpl.js')
const providerOrgImpl = require('./impl/providerOrganizationImpl')
const healthRecordImpl = require('./impl/healthRecordImpl')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//routes for providers

router.post('/', jsonParser, (req, res) => {
    if(req.body != undefined ){
        return res.status(201).send(providerImpl.addProvider(req.body))
    } else {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.get('/', (req, res) => {
    let providers = providerImpl.getProviders()
    if (providers != null){
        return res.status(200).send(providers)
        
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

router.get('/:id', (req, res) => {
    let provider = providerImpl.getProviderById(req.params.id)
    if (provider.npi == undefined){
        return res.status(400).json({error: "Data not found"})
    }else{
        return res.status(200).send(provider)
    }
})

router.get('/details/:id', (req, res) => {
    let provider = providerImpl.getProviderDetailsByNpi(req.params.id)
    console.log(provider)
    if (provider.npi == undefined){
        return res.status(400).send(provider)
    }else{
        return res.status(200).send(provider)
    }
})

router.get('/:id/:orgId/availability/', (req, res) => {
    let availability = null
    if(req.query.datefilter != undefined) {
        availability = providerOrgImpl.getAvailability(req.params.id, req.params.orgId, req.query.datefilter)
    } else{
        availability = providerOrgImpl.getAvailabilityWithoutFilter(req.params.id, req.params.orgId)
    }
    if(availability != null){
        return res.status(200).send(availability)
        
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

router.get('/:id/sharedHealthRecords/', (req, res) => {
    let healthRecords = healthRecordImpl.getHealthRecords(req.params.id)
    if (healthRecords != null){
        return res.status(200).send(healthRecords)
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})


module.exports = router
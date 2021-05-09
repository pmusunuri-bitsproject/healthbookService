const { request } = require('express')
const express = require('express')
const app = express()
const router = express.Router()
const organizationImpl = require('./impl/OrganizationImpl')

const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//routes for organizations

router.post('/', jsonParser, (req, res) => {
    if(req.body != undefined ){
        return res.status(201).send(organizationImpl.addOrganization(req.body))
    } else {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.get('/', (req, res) => {
    let orgs = organizationImpl.getOrganizations()
    if (orgs != null){
        return res.status(200).send(orgs)
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

router.get('/:id', (req, res) => {
    let org = organizationImpl.getOrganizationById(req.params.id)
    if (org.tin == undefined){
        return res.status(400).json({error: "Data not found"})
    }else{
        return res.status(200).send(org)
    }
})

router.put('/:id/provider', jsonParser, (req, res) => {
    return res.status(201).send(organizationImpl.addProviderToOrganization(req.params.id, req.body))
})

module.exports = router
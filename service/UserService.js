const { request } = require('express')
const express = require('express')
const app = express()
const router = express.Router()
const userImpl = require('./impl/UserServiceImpl.js')
const healthRecordImpl = require('./impl/healthRecordImpl')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//routes for user profile and appointments

router.post('/', jsonParser, (req, res) => {
    if(req.body != undefined ){
        return res.status(201).send(userImpl.storeUser(req.body))
    } else {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.get('/:id', (req, res) => {
    let user = userImpl.getUser(req.params.id)
    if (user != null){
        return res.status(200).send(user)
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

router.get('/:id/appointments/', (req, res) => {
    let appointmentDetails = userImpl.getAppointments(req.params.id)
    if (appointmentDetails != null){
        return res.status(200).send(appointmentDetails)
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

router.post('/:id/appointments/', jsonParser, (req, res) => {
    if(req.body != undefined ){
        return res.status(201).send(userImpl.bookAppointment(req.params.id, req.body))
    } else {
        return res.status(500).json({error: "Internal Server Error"})
    }
})


router.post('/:id/healthRecord', jsonParser, (req, res) => {
    if(req.body != undefined ){
        return res.status(201).send(healthRecordImpl.storeHealthRecord(req.params.id, req.body))
    } else {
        return res.status(500).json({error: "Internal Server Error"})
    }
})


router.get('/:id/healthRecord/', (req, res) => {
    let healthRecords = []
    if(req.query.type != undefined){
        healthRecords  = healthRecordImpl.getHealthRecordsByType(req.params.id, req.query.type)
    }else{
        healthRecords = healthRecordImpl.getHealthRecords(req.params.id)
    }
    if (healthRecords != null){
        return res.status(200).send(healthRecords)
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

router.get('/:id/referredProviders/', (req, res) => {
    let referredProviders = userImpl.getReferredProviders(req.params.id)
    if (referredProviders != null){
        return res.status(200).json({referredProviders: referredProviders})
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

router.post('/:id/healthRecordAccess', jsonParser, (req, res) => {
    if(req.body != undefined){
        return res.status(201).send(userImpl.provideHealthRecordAccess(req.params.id, req.body))
    } else {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

module.exports = router

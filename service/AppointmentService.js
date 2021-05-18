const { request } = require('express')
const express = require('express')
const app = express()
const router = express.Router()
const appointmentImpl = require('./impl/appointmentImpl')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/:id', (req, res) => {
    let appointmentDetails = appointmentImpl.getAppointmentById(req.params.id)
    if (appointmentDetails != null){
        return res.status(200).send(appointmentDetails)
    }else{
        return res.status(400).json({error: "Data not found"})
    }
})

module.exports = router

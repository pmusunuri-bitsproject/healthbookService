const { json } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
var path = require('path')
const router = express.Router()
app.use(cors())
app.use('/organizations', require('./service/OrganizationService'))
app.use('/providers', require('./service/ProviderService'))
app.use('/user', require('./service/UserService'))
app.use('/appointments', require('./service/AppointmentService'))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Listenning on ${PORT}`)
})

module.exports = router

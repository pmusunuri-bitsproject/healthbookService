const express = require('express')
const app = express()
var path = require('path')
const router = express.Router()

require('dotenv').config()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Listenning on ${PORT}`)
})

module.exports = router
